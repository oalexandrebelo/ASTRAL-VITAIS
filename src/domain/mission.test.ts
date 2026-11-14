import { describe, expect, it } from 'vitest';
import {
  MISSIONS, getCurrentMission, getProgress, getSimulationEvents, getTelemetry,
  initialState, reducer, restoreState,
} from './mission';
import type { MissionState, Outcome } from './mission';

function answer(state: MissionState, outcome: Outcome = 'recommended') {
  const selected = getCurrentMission(state).choices.find((item) => item.feedback.outcome === outcome)!;
  return reducer(state, { type: 'ANSWER', choiceId: selected.id });
}

function reach(id: string) {
  let state = initialState();
  while (getCurrentMission(state).id !== id && !state.complete) {
    state = reducer(answer(state), { type: 'NEXT' });
  }
  return state;
}

describe('mission state machine', () => {
  it('starts without actions or a clinical score', () => {
    const state = initialState();
    expect(getProgress(state)).toEqual({ completed: 0, total: 9, percent: 0, score: 0, stage: 'preflight' });
    expect(state.feedback).toBeNull();
    expect(getCurrentMission(state).id).toBe('baseline');
  });

  it('requires a valid answer before moving and blocks repeated scoring', () => {
    const start = initialState();
    expect(reducer(start, { type: 'NEXT' })).toBe(start);
    expect(reducer(start, { type: 'ANSWER', choiceId: 'not-a-choice' })).toBe(start);
    const answered = answer(start);
    expect(answered.responses).toHaveLength(1);
    expect(answer(answered)).toBe(answered);
    expect(getProgress(answered).score).toBe(11);
    const next = reducer(answered, { type: 'NEXT' });
    expect(getCurrentMission(next).id).toBe('sleep');
    expect(next.feedback).toBeNull();
    expect(start.responses).toHaveLength(0);
  });

  it('completes nine decisions with a bounded educational score', () => {
    let state = initialState();
    for (const mission of MISSIONS) {
      expect(getCurrentMission(state).id).toBe(mission.id);
      state = reducer(answer(state), { type: 'NEXT' });
    }
    expect(state.complete).toBe(true);
    expect(getProgress(state)).toMatchObject({ completed: 9, percent: 100, score: 100 });
    expect(answer(state)).toBe(state);
    expect(reducer(state, { type: 'NEXT' })).toBe(state);
    expect(reducer(state, { type: 'TICK' })).toBe(state);
  });

  it('keeps progress separate from answer quality and permits learning after errors', () => {
    let state = initialState();
    for (let index = 0; index < MISSIONS.length; index++) state = reducer(answer(state, 'unsafe'), { type: 'NEXT' });
    expect(getProgress(state)).toMatchObject({ percent: 100, score: 0 });
    expect(state.complete).toBe(true);
    expect(reducer(state, { type: 'RESET' })).toEqual(initialState());
  });

  it('bounds time and ignores non-finite or negative elapsed input', () => {
    const state = initialState();
    expect(reducer(state, { type: 'TICK', seconds: Number.POSITIVE_INFINITY })).toBe(state);
    expect(reducer(state, { type: 'TICK', seconds: -1 })).toBe(state);
    expect(reducer(state, { type: 'TICK', seconds: 3600 }).elapsedSeconds).toBe(60);
  });
});

describe('untrusted save restoration', () => {
  it('round-trips before answering, during feedback, after next and after completion', () => {
    let state = initialState(7, '2033-04-12T10:30:00Z');
    expect(restoreState(JSON.stringify(state))).toEqual(state);
    for (let index = 0; index < MISSIONS.length; index++) {
      state = reducer(state, { type: 'TICK', seconds: 14 });
      state = answer(state, index % 2 ? 'partial' : 'recommended');
      expect(restoreState(JSON.stringify(state))).toEqual(state);
      state = reducer(state, { type: 'NEXT' });
      expect(restoreState(JSON.stringify(state))).toEqual(state);
    }
  });

  it('recomputes feedback and points rather than trusting stored fields', () => {
    const state = answer(initialState(), 'unsafe');
    const malicious = { ...state, score: 100, feedback: { points: 9000, outcome: 'recommended' } };
    const restored = restoreState(malicious);
    expect(restored.feedback?.outcome).toBe('unsafe');
    expect(restored.feedback?.points).toBe(0);
    expect(getProgress(restored).score).toBe(0);
  });

  it.each([
    null, [], {}, 'not json', { version: 999 },
    { ...initialState(), missionIndex: 8 },
    { ...initialState(), complete: true },
    { ...initialState(), seed: Number.NaN },
    { ...initialState(), startedAt: 'not a timestamp' },
    { ...initialState(), elapsedSeconds: Number.POSITIVE_INFINITY },
    { ...initialState(), responses: [{ missionId: 'return', choiceId: 'assist', atSecond: 0 }] },
  ])('rejects invalid persisted state %#', (bad) => {
    expect(restoreState(bad)).toEqual(initialState());
  });

  it('rejects duplicate or out-of-order answers and future action timestamps', () => {
    const first = answer(initialState());
    expect(restoreState({ ...first, responses: [first.responses[0], first.responses[0]] })).toEqual(initialState());
    expect(restoreState({ ...first, responses: [{ ...first.responses[0], atSecond: 100 }] })).toEqual(initialState());
  });
});

describe('synthetic telemetry and scenario provenance', () => {
  it('replays identical telemetry for the same state and seed', () => {
    const state = reducer(initialState(123), { type: 'TICK', seconds: 10 });
    expect(getTelemetry(state)).toEqual(getTelemetry(restoreState(JSON.stringify(state))));
    expect(getTelemetry(state).every((item) => item.simulated === true && Number.isFinite(Date.parse(item.timestamp)))).toBe(true);
  });

  it('distinguishes stale from invalid data and hides invalid values', () => {
    const state = reducer(reach('sensor'), { type: 'TICK', seconds: 10 });
    const telemetry = getTelemetry(state);
    const pulse = telemetry.find((item) => item.id === 'heartRate')!;
    const oxygen = telemetry.find((item) => item.id === 'oxygenSaturation')!;
    expect(pulse.status).toBe('stale');
    expect(pulse.ageSeconds).toBe(130);
    expect(Date.parse(pulse.timestamp)).toBeLessThan(Date.parse(state.startedAt));
    expect(oxygen.status).toBe('invalid');
    expect(oxygen.value).toBeNull();
    expect(oxygen.trend).toEqual([]);
    expect(getSimulationEvents(state).some((item) => item.kind === 'signal')).toBe(true);
    expect(getTelemetry(answer(state)).every((item) => item.status === 'valid')).toBe(true);
    expect(getTelemetry(answer(state, 'unsafe')).find((item) => item.id === 'oxygenSaturation')?.value).toBeNull();
  });

  it('activates solar scenario by mission, without claiming shelter eliminates dose', () => {
    const state = reach('radiation');
    expect(getSimulationEvents(state).some((item) => item.id === 'solar-event')).toBe(true);
    const before = getTelemetry(state).find((item) => item.id === 'radiation')!;
    const after = getTelemetry(answer(state)).find((item) => item.id === 'radiation')!;
    expect(after.value).toBe(before.value);
    expect(after.context).toContain('não comprova eliminação do risco');
  });

  it('keeps sleep records historical and makes environmental contexts explicit', () => {
    const state = initialState();
    const before = getTelemetry(state);
    const after = getTelemetry(reducer(state, { type: 'TICK', seconds: 30 }));
    expect(after.find((item) => item.id === 'sleep')?.timestamp).toBe(before.find((item) => item.id === 'sleep')?.timestamp);
    expect(after.find((item) => item.id === 'sleep')?.ageSeconds).toBe(3630);
    expect(after.find((item) => item.id === 'carbonDioxide')?.context).toContain('Não representa média de uma hora');
    expect(after.find((item) => item.id === 'radiation')?.context).toContain('ambiente terrestre fictício');
    expect(getTelemetry(reach('exercise')).find((item) => item.id === 'radiation')?.context).toContain('ambiente orbital');
  });
});
