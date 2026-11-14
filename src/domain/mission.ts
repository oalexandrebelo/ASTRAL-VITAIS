/** Educational simulation only. No thresholds or outputs represent clinical decisions. */
export type StageId = 'preflight' | 'orbit' | 'return';
export type Outcome = 'recommended' | 'partial' | 'unsafe';
export type SensorStatus = 'valid' | 'stale' | 'invalid';

export interface Feedback {
  outcome: Outcome;
  title: string;
  message: string;
  why: string;
  points: number;
}

export interface Choice {
  id: string;
  label: string;
  detail: string;
  feedback: Feedback;
}

export interface Mission {
  id: string;
  stage: StageId;
  title: string;
  category: string;
  briefing: string;
  question: string;
  objective: string;
  sourceIds: readonly string[];
  choices: readonly Choice[];
}

export const MISSION_STAGES = [
  { id: 'preflight', title: 'Pré-voo', subtitle: 'Conheça sua linha de base', label: '01 · PREPARAR' },
  { id: 'orbit', title: 'Em órbita', subtitle: 'Observe. Confirme. Cuide.', label: '02 · PROTEGER' },
  { id: 'return', title: 'Retorno', subtitle: 'Reaprenda a gravidade', label: '03 · RECUPERAR' },
] as const;

export const SCIENCE_SOURCES = {
  hazards: { title: 'NASA · Five Hazards of Human Spaceflight', url: 'https://www.nasa.gov/hrp/hazards/' },
  standards: { title: 'NASA · Human Spaceflight and Aviation Standards', url: 'https://www.nasa.gov/ochmo/human-spaceflight-and-aviation-standards/' },
  hrr: { title: 'NASA · Human Research Roadmap', url: 'https://humanresearchroadmap.nasa.gov/' },
  exercise: { title: 'NASA · The Human Body in Space', url: 'https://www.nasa.gov/humans-in-space/the-human-body-in-space/' },
  sans: { title: 'NASA · Spaceflight Associated Neuro-ocular Syndrome', url: 'https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/' },
} as const;

function choice(id: string, label: string, detail: string, outcome: Outcome, message: string, why: string): Choice {
  return {
    id, label, detail,
    feedback: {
      outcome,
      title: outcome === 'recommended' ? 'Procedimento bem escolhido' : outcome === 'partial' ? 'Falta uma etapa importante' : 'Reveja este procedimento',
      message, why, points: outcome === 'recommended' ? 10 : outcome === 'partial' ? 5 : 0,
    },
  };
}

export const MISSIONS: readonly Mission[] = [
  {
    id: 'baseline', stage: 'preflight', title: 'Antes da contagem regressiva', category: 'LINHA DE BASE',
    briefing: 'Seu traje transmite o primeiro sinal. Um número isolado ainda não conta a sua história: contexto, identificação e qualidade do sensor fazem parte da leitura.',
    question: 'Qual é a primeira ação antes de confiar no painel?',
    objective: 'Validar o sensor e construir uma linha de base individual.', sourceIds: ['standards', 'hrr'],
    choices: [
      choice('compare', 'Comparar com a média da tripulação', 'Usar um único perfil para todos os astronautas.', 'unsafe', 'A média do grupo não substitui uma linha de base individual.', 'A preparação inclui avaliação e registros individuais. Neste jogo, os números são sintéticos e não aprovam aptidão para voo.'),
      choice('calibrate', 'Verificar sensor e registrar a linha de base', 'Conferir identificação, contato, horário e medições com a equipe.', 'recommended', 'Você conferiu a origem do sinal antes de interpretar a leitura.', 'Avaliações pré-voo, contexto de coleta e acompanhamento individual apoiam a comparação ao longo da missão. Validação do instrumento é diferente de diagnóstico.'),
      choice('single', 'Registrar somente o pulso', 'Anotar uma medida e liberar o restante depois.', 'partial', 'Registrar o pulso ajuda, mas a verificação ficou incompleta.', 'Um painel responsável também mostra origem, horário, qualidade e contexto; nenhuma medida isolada encerra a avaliação.'),
    ],
  },
  {
    id: 'sleep', stage: 'preflight', title: 'Um relógio para o corpo', category: 'SONO & RITMO',
    briefing: 'A missão terá turnos, trabalho intenso e ciclos de luz diferentes dos da Terra. Preparar a agenda de descanso é uma ação de missão.',
    question: 'Como você prepara uma rotina sustentável?',
    objective: 'Planejar sono, luz e comunicação de fadiga.', sourceIds: ['hazards', 'hrr'],
    choices: [
      choice('schedule', 'Proteger a janela de sono', 'Combinar horário, luz, ambiente e registro de fadiga com a equipe.', 'recommended', 'Você tratou descanso como parte do plano operacional.', 'Sono insuficiente e desorganização circadiana afetam desempenho. O plano de missão precisa proteger o descanso e permitir relatar fadiga sem punição.'),
      choice('catchup', 'Compensar apenas no fim da semana', 'Priorizar todos os experimentos antes do descanso.', 'unsafe', 'Adiar sistematicamente o descanso deixa a fadiga sem manejo.', 'Uma decisão operacional segura usa a rotina e a equipe de apoio; o jogo não prescreve fármacos ou esquemas de sono.'),
      choice('log', 'Registrar o cansaço, sem alterar o plano', 'Observar o padrão antes de conversar com a equipe.', 'partial', 'O registro é útil, mas faltou proteger a oportunidade de descanso.', 'Monitorar deve levar a uma ação coordenada. Registrar fadiga e comunicar a equipe faz parte do ciclo de cuidado.'),
    ],
  },
  {
    id: 'exercise', stage: 'orbit', title: 'Seu corpo precisa de carga', category: 'MÚSCULOS & OSSOS',
    briefing: 'Flutuar parece fácil. Para músculos, ossos e capacidade aeróbia, a ausência de carga exige uma rotina de contramedidas.',
    question: 'Como você organiza o treino de hoje?',
    objective: 'Executar o plano individual de exercício e registrar sintomas.', sourceIds: ['exercise', 'standards'],
    choices: [
      choice('aerobic', 'Fazer apenas a parte aeróbia', 'Concluir a bicicleta e retirar a sessão resistida.', 'partial', 'A parte aeróbia tem valor, mas não substitui a resistência.', 'Contramedidas em voo incluem componentes aeróbios e resistidos. O volume e a carga são definidos individualmente pela equipe.'),
      choice('skip', 'Pular a sessão porque estou flutuando', 'Usar a ausência de esforço como sinal de recuperação.', 'unsafe', 'A sensação de leveza não demonstra manutenção muscular ou óssea.', 'A microgravidade reduz a carga habitual. A rotina de exercício deve ser acompanhada, inclusive quando parece não haver esforço na locomoção.'),
      choice('combined', 'Seguir o plano resistido e aeróbio', 'Verificar o equipamento, executar a sessão e relatar desconforto.', 'recommended', 'Você escolheu carga e condicionamento com acompanhamento.', 'Exercício é uma contramedida central, mas não elimina todos os riscos. Sintomas e limitações exigem revisão do plano pela equipe, sem improvisar intensidade.'),
    ],
  },
  {
    id: 'nutrition', stage: 'orbit', title: 'Pequenas rotinas, longa missão', category: 'NUTRIÇÃO & HIDRATAÇÃO',
    briefing: 'Entre tarefas, é fácil deixar a refeição e o registro de ingestão para depois. A equipe precisa acompanhar como a rotina está funcionando.',
    question: 'Qual ação faz sentido neste cenário?',
    objective: 'Acompanhar ingestão e seguir o plano individual da missão.', sourceIds: ['standards', 'hrr'],
    choices: [
      choice('plan', 'Cumprir e registrar o plano de ingestão', 'Organizar alimentação e água, comunicando dificuldade à equipe.', 'recommended', 'Você transformou o plano nutricional em uma rotina observável.', 'Nutrição e hidratação participam das contramedidas. Quantidades e ajustes dependem de avaliação individual; o jogo não define doses ou metas universais.'),
      choice('universal', 'Aplicar uma quantidade igual para todos', 'Ignorar atividade, avaliação e características individuais.', 'unsafe', 'Uma meta universal não substitui um plano individual.', 'A adequação de energia, nutrientes e água exige contexto. O painel educativo não pode prescrever um valor para toda a tripulação.'),
      choice('remember', 'Tentar lembrar no fim do dia', 'Manter a rotina sem registrar a ingestão ou as dificuldades.', 'partial', 'A intenção é boa; o acompanhamento ficou frágil.', 'Registros e comunicação ajudam a equipe a identificar dificuldades de adesão e a ajustar o plano.'),
    ],
  },
  {
    id: 'radiation', stage: 'orbit', title: 'O Sol entrou na conversa', category: 'RADIAÇÃO',
    briefing: 'O roteiro simula um aviso de evento de partículas solares. A equipe aciona o procedimento de proteção; isso não é um alerta espacial real.',
    question: 'Qual é a prioridade operacional?',
    objective: 'Executar o procedimento de abrigo e confirmar a tripulação.', sourceIds: ['hazards', 'standards'],
    choices: [
      choice('wait', 'Esperar aparecer algum sintoma', 'Continuar as tarefas e observar como me sinto.', 'unsafe', 'Sintomas não são um sistema de dosimetria.', 'A resposta a um evento de radiação segue detecção, planejamento e protocolos. Sensação subjetiva não mede dose nem substitui proteção.'),
      choice('shelter', 'Ir ao abrigo definido pelo protocolo', 'Confirmar a tripulação, acompanhar dosimetria e coordenar com o controle.', 'recommended', 'Você priorizou proteção e coordenação da equipe.', 'Abrigo planejado, monitoramento e resposta operacional reduzem exposição em cenários apropriados. Blindagem não significa risco zero e não elimina toda radiação cósmica.'),
      choice('watch', 'Observar somente o dosímetro', 'Aguardar novas leituras no posto de trabalho.', 'partial', 'Monitorar é necessário, mas faltou executar a proteção indicada.', 'Dosimetria informa exposição; ela não é uma barreira física. Neste cenário, o protocolo já determinou a ida ao abrigo.'),
    ],
  },
  {
    id: 'vision', stage: 'orbit', title: 'Uma mudança no horizonte', category: 'VISÃO & SANS',
    briefing: 'O astronauta do cenário percebe alteração visual durante uma tarefa. O painel de pulso continua com sinal válido.',
    question: 'O que você faz com essa informação?',
    objective: 'Relatar alteração visual e seguir a avaliação da equipe médica.', sourceIds: ['hrr', 'sans'],
    choices: [
      choice('dismiss', 'Ignorar porque o pulso não mudou', 'Usar uma leitura válida como prova de que a visão está bem.', 'unsafe', 'Um sensor não exclui problemas fora do que ele mede.', 'SANS é uma área de pesquisa e acompanhamento especializado. Frequência cardíaca ou saturação não diagnosticam nem descartam alterações oculares.'),
      choice('note', 'Anotar para contar só após o retorno', 'Guardar o relato, sem comunicação durante o voo.', 'partial', 'O registro ajuda, mas a comunicação foi adiada.', 'Mudanças visuais devem ser comunicadas conforme o protocolo da missão. A equipe define avaliação e acompanhamento.'),
      choice('report', 'Pausar a tarefa e comunicar a alteração', 'Registrar o ocorrido e seguir a avaliação orientada pela equipe.', 'recommended', 'Você levou o sintoma à equipe responsável, mesmo com outros sinais válidos.', 'O jogo ensina observação e encaminhamento. Não apresenta uma cura para SANS nem usa biomarcadores experimentais como diagnóstico.'),
    ],
  },
  {
    id: 'sensor', stage: 'orbit', title: 'O silêncio de um sensor', category: 'QUALIDADE DO SINAL',
    briefing: 'A transmissão parou. O último pulso é antigo e outra medida perdeu qualidade. A ausência de atualização descreve o canal, não o estado do astronauta.',
    question: 'Como você responde a uma leitura desatualizada?',
    objective: 'Distinguir falha de sinal de alteração fisiológica.', sourceIds: ['standards'],
    choices: [
      choice('verify', 'Verificar contato, horário e repetir', 'Avaliar a pessoa, conferir o dispositivo e acionar apoio se necessário.', 'recommended', 'Você investigou o sinal sem inventar uma conclusão clínica.', 'Dados antigos ou inválidos devem ser identificados. Repetir a coleta e checar o contexto evita confundir falha de sensor com normalidade ou diagnóstico.'),
      choice('assume', 'Manter o último valor como atual', 'Mostrar a leitura anterior sem informar o horário.', 'unsafe', 'Um valor antigo apresentado como atual cria falsa confiança.', 'O horário e a validade são parte do dado. A interface precisa expor a perda de sinal e orientar a verificação.'),
      choice('replace', 'Marcar a falha e esperar a conexão', 'Informar que o dado expirou, mas não conferir a pessoa nem o sensor.', 'partial', 'Você identificou a falha, mas falta a verificação do contexto.', 'Mostrar dados desatualizados é necessário; uma rotina de apoio também deve orientar a checagem de sensor e da pessoa.'),
    ],
  },
  {
    id: 'crew', stage: 'orbit', title: 'Ninguém viaja sozinho', category: 'EQUIPE & ISOLAMENTO',
    briefing: 'Um colega relata cansaço e começa a se afastar das atividades coletivas. Seu papel é abrir uma conversa, sem fazer um diagnóstico pelo comportamento.',
    question: 'Qual prática protege a equipe?',
    objective: 'Fazer um check-in e usar o suporte previsto na missão.', sourceIds: ['hazards', 'hrr'],
    choices: [
      choice('privacy', 'Oferecer uma conversa privada', 'Ouvir, revisar a carga de trabalho e acionar o suporte combinado.', 'recommended', 'Você favoreceu comunicação, descanso e acesso a apoio.', 'Confinamento, isolamento e carga de trabalho importam para desempenho e bem-estar. O apoio deve respeitar privacidade e protocolos da equipe.'),
      choice('rank', 'Expor um ranking de resiliência', 'Comparar os integrantes para pressionar a participação.', 'unsafe', 'Exposição e competição não são avaliação de saúde mental.', 'Um sistema de apoio não deve transformar sofrimento em pontuação pública. O score deste jogo mede apenas escolhas educativas.'),
      choice('later', 'Enviar uma mensagem e encerrar', 'Demonstrar atenção sem combinar acompanhamento.', 'partial', 'Você iniciou contato; falta combinar continuidade.', 'Uma conversa e um plano de acompanhamento podem direcionar o apoio. O jogo não infere condição mental a partir de telemetria.'),
    ],
  },
  {
    id: 'return', stage: 'return', title: 'De volta ao peso do mundo', category: 'READAPTAÇÃO',
    briefing: 'A cápsula retornou. Na simulação, levantar rapidamente provoca tontura. Retornar à gravidade exige avaliação e apoio.',
    question: 'Como você conduz esse primeiro momento?',
    objective: 'Priorizar assistência e recuperação orientada após o voo.', sourceIds: ['exercise', 'standards'],
    choices: [
      choice('prove', 'Levantar depressa para provar preparo', 'Ignorar a tontura e caminhar sem apoio.', 'unsafe', 'Forçar a tarefa aumenta a exposição a queda neste cenário.', 'Readaptação cardiovascular, vestibular e muscular pode exigir assistência. Um resultado no jogo não certifica prontidão física.'),
      choice('assist', 'Pedir apoio e seguir a recuperação', 'Comunicar sintomas, evitar a tarefa sozinho e seguir a equipe médica.', 'recommended', 'Você manteve a recuperação sob orientação e reduziu o risco da tarefa.', 'Acompanhamento e reabilitação continuam após o pouso. Esta simulação não prescreve manobras, medicamentos ou quantidades de fluidos.'),
      choice('quiet', 'Sentar e não contar a ninguém', 'Interromper o movimento sem comunicar os sintomas.', 'partial', 'Interromper a tarefa ajuda, mas a equipe precisa saber o que ocorreu.', 'Sintomas após o voo fazem parte da avaliação individual. Comunicar permite definir assistência e próximos passos.'),
    ],
  },
];

export const STATE_VERSION = 1 as const;
export const STORAGE_KEY = 'astral-vitais.mission.v1';
export const SIMULATION_EPOCH = '2033-04-12T09:00:00.000Z';
const MAX_ELAPSED_SECONDS = 2_592_000;

export interface ResponseRecord {
  missionId: string;
  choiceId: string;
  atSecond: number;
  answeredAt: string;
}

export interface MissionState {
  version: typeof STATE_VERSION;
  seed: number;
  startedAt: string;
  missionIndex: number;
  responses: readonly ResponseRecord[];
  feedback: Feedback | null;
  complete: boolean;
  elapsedSeconds: number;
}

export type MissionAction =
  | { type: 'ANSWER'; choiceId: string }
  | { type: 'NEXT' }
  | { type: 'TICK'; seconds?: number }
  | { type: 'RESET' }
  | { type: 'RESTORE'; payload: unknown };

export function initialState(seed = 42, startedAt = SIMULATION_EPOCH): MissionState {
  return {
    version: STATE_VERSION,
    seed: Number.isFinite(seed) ? Math.floor(seed) >>> 0 : 42,
    startedAt: validDate(startedAt) ? new Date(startedAt).toISOString() : SIMULATION_EPOCH,
    missionIndex: 0, responses: [], feedback: null, complete: false, elapsedSeconds: 0,
  };
}

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 30) return false;
  const epoch = Date.parse(value);
  // Deliberately bounded demo timestamps, avoiding invalid Date overflow on replay.
  return Number.isFinite(epoch) && epoch >= 0 && epoch <= 7_258_118_400_000;
}

function timestamp(state: Pick<MissionState, 'startedAt'>, seconds: number): string {
  return new Date(Date.parse(state.startedAt) + seconds * 1000).toISOString();
}

export function getCurrentMission(state: MissionState): Mission {
  return MISSIONS[Math.min(Math.max(state.missionIndex, 0), MISSIONS.length - 1)];
}

export function reducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'ANSWER': {
      if (state.complete || state.feedback) return state;
      const mission = getCurrentMission(state);
      if (state.responses.some((item) => item.missionId === mission.id)) return state;
      const selected = mission.choices.find((item) => item.id === action.choiceId);
      if (!selected) return state;
      return {
        ...state,
        responses: [...state.responses, {
          missionId: mission.id, choiceId: selected.id, atSecond: state.elapsedSeconds,
          answeredAt: timestamp(state, state.elapsedSeconds),
        }],
        feedback: { ...selected.feedback },
      };
    }
    case 'NEXT':
      if (state.complete || !state.feedback) return state;
      return state.missionIndex === MISSIONS.length - 1
        ? { ...state, complete: true, feedback: null }
        : { ...state, missionIndex: state.missionIndex + 1, feedback: null };
    case 'TICK': {
      if (state.complete) return state;
      const seconds = action.seconds ?? 1;
      if (!Number.isFinite(seconds) || seconds <= 0) return state;
      return { ...state, elapsedSeconds: Math.min(MAX_ELAPSED_SECONDS, state.elapsedSeconds + Math.min(60, Math.floor(seconds))) };
    }
    case 'RESET': return initialState(state.seed, state.startedAt);
    case 'RESTORE': return restoreState(action.payload);
    default: return state;
  }
}

export function getProgress(state: MissionState) {
  const points = state.responses.reduce((total, response) => {
    const mission = MISSIONS.find((item) => item.id === response.missionId);
    return total + (mission?.choices.find((item) => item.id === response.choiceId)?.feedback.points ?? 0);
  }, 0);
  return {
    completed: state.responses.length, total: MISSIONS.length,
    percent: Math.round(state.responses.length / MISSIONS.length * 100),
    // This is a quiz score, never a health or fitness indicator.
    score: Math.round(points / (MISSIONS.length * 10) * 100),
    stage: getCurrentMission(state).stage,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Restore only canonical actions; never trust stored scores, feedback or telemetry. */
export function restoreState(input: unknown): MissionState {
  try {
    if (typeof input === 'string' && input.length > 50_000) return initialState();
    const raw: unknown = typeof input === 'string' ? JSON.parse(input) : input;
    if (!isRecord(raw) || raw.version !== STATE_VERSION || !validDate(raw.startedAt)) return initialState();
    if (typeof raw.seed !== 'number' || !Number.isInteger(raw.seed) || raw.seed < 0 || raw.seed > 0xffffffff) return initialState();
    if (typeof raw.elapsedSeconds !== 'number' || !Number.isInteger(raw.elapsedSeconds) || raw.elapsedSeconds < 0 || raw.elapsedSeconds > MAX_ELAPSED_SECONDS) return initialState();
    if (typeof raw.missionIndex !== 'number' || !Number.isInteger(raw.missionIndex) || typeof raw.complete !== 'boolean') return initialState();
    if (!Array.isArray(raw.responses) || raw.responses.length > MISSIONS.length) return initialState();
    const count = raw.responses.length;
    const expectedCursor = raw.complete ? MISSIONS.length - 1 : raw.missionIndex;
    if (raw.complete && (count !== MISSIONS.length || raw.missionIndex !== MISSIONS.length - 1)) return initialState();
    if (!raw.complete && (expectedCursor < 0 || expectedCursor >= MISSIONS.length || (expectedCursor !== count && expectedCursor !== count - 1))) return initialState();
    let state = initialState(raw.seed, raw.startedAt);
    let previousSecond = 0;
    for (let index = 0; index < count; index++) {
      const item: unknown = raw.responses[index];
      if (!isRecord(item) || item.missionId !== MISSIONS[index].id || typeof item.choiceId !== 'string') return initialState();
      if (!MISSIONS[index].choices.some((entry) => entry.id === item.choiceId)) return initialState();
      if (typeof item.atSecond !== 'number' || !Number.isInteger(item.atSecond) || item.atSecond < previousSecond || item.atSecond > raw.elapsedSeconds) return initialState();
      state = reducer({ ...state, elapsedSeconds: item.atSecond }, { type: 'ANSWER', choiceId: item.choiceId });
      if (index < count - 1 || raw.complete || raw.missionIndex === count) state = reducer(state, { type: 'NEXT' });
      previousSecond = item.atSecond;
    }
    return { ...state, elapsedSeconds: raw.elapsedSeconds };
  } catch {
    return initialState();
  }
}

export interface TelemetryMetric {
  id: 'heartRate' | 'oxygenSaturation' | 'bodyTemperature' | 'carbonDioxide' | 'radiation' | 'sleep';
  label: string;
  value: number | null;
  unit: string;
  status: SensorStatus;
  quality: number;
  timestamp: string;
  ageSeconds: number;
  simulated: true;
  context: string;
  trend: readonly number[];
}

function hasRecommendedResponse(state: MissionState, missionId: string): boolean {
  const response = state.responses.find((entry) => entry.missionId === missionId);
  const mission = MISSIONS.find((entry) => entry.id === missionId);
  return mission?.choices.find((entry) => entry.id === response?.choiceId)?.feedback.outcome === 'recommended';
}

/** Generated data are deterministic and display-only. Status is signal validity, not health. */
export function getTelemetry(state: MissionState): TelemetryMetric[] {
  const mission = getCurrentMission(state);
  const sensorFault = mission.id === 'sensor' && !hasRecommendedResponse(state, 'sensor');
  const radiationEvent = mission.id === 'radiation';
  const shelterConfirmed = radiationEvent && hasRecommendedResponse(state, 'radiation');
  const time = state.elapsedSeconds;
  const seedOffset = (state.seed % 1000) / 100;
  const wave = (at: number, offset: number) => Math.sin(at / 7 + seedOffset + offset);
  const definitions: Array<{ id: TelemetryMetric['id']; label: string; unit: string; base: number; amplitude: number; precision: number }> = [
    { id: 'heartRate', label: 'Frequência cardíaca', unit: 'bpm', base: 72, amplitude: 3, precision: 0 },
    { id: 'oxygenSaturation', label: 'Saturação periférica', unit: '%', base: 98, amplitude: 0.3, precision: 0 },
    { id: 'bodyTemperature', label: 'Temperatura', unit: '°C', base: 36.6, amplitude: 0.1, precision: 1 },
    { id: 'carbonDioxide', label: 'CO₂ do ambiente', unit: 'mmHg', base: mission.stage === 'orbit' ? 1.8 : 0.4, amplitude: 0.1, precision: 1 },
    { id: 'radiation', label: 'Taxa de dose simulada', unit: 'µSv/h', base: radiationEvent ? 28 : mission.stage === 'orbit' ? 11 : 0.1, amplitude: mission.stage === 'orbit' ? 0.5 : 0.02, precision: 1 },
    { id: 'sleep', label: 'Sono registrado', unit: 'h', base: 7.5, amplitude: 0, precision: 1 },
  ];
  return definitions.map((definition, index) => {
    const status: SensorStatus = sensorFault && definition.id === 'heartRate' ? 'stale'
      : sensorFault && definition.id === 'oxygenSaturation' ? 'invalid' : 'valid';
    const isSleepRecord = definition.id === 'sleep';
    const ageSeconds = status === 'stale' ? 120 + time : isSleepRecord ? 3600 + time : 0;
    const sampleSecond = status === 'stale' ? -120 : isSleepRecord ? -3600 : time;
    const sampleValue = (at: number) => Number((definition.base + wave(at, index) * definition.amplitude).toFixed(definition.precision));
    const context = status === 'stale' ? 'Última amostra antiga. Verificar sensor e pessoa; não inferir normalidade.'
      : status === 'invalid' ? 'Qualidade insuficiente. Valor ocultado; repetir a coleta e checar o contexto.'
      : isSleepRecord ? 'Último período de sono fictício; registro histórico com horário fixo, não medição contínua.'
      : definition.id === 'carbonDioxide' ? `Leitura instantânea sintética ${mission.stage === 'orbit' ? 'da cabine orbital' : mission.stage === 'preflight' ? 'da cabine de treinamento' : 'da área de recuperação'}. Não representa média de uma hora nem conformidade NASA.`
      : definition.id === 'radiation' && radiationEvent
        ? shelterConfirmed ? 'Abrigo confirmado no roteiro. A leitura não comprova eliminação do risco.' : 'Evento solar fictício ativado pelo roteiro, não por limiar clínico.'
        : definition.id === 'radiation' ? `Taxa ilustrativa ${mission.stage === 'orbit' ? 'do ambiente orbital' : 'do ambiente terrestre fictício'}; não é dose acumulada nem previsão de risco.`
        : 'Amostra sintética para demonstração. Sinal válido não é diagnóstico.';
    return {
      id: definition.id, label: definition.label, value: status === 'invalid' ? null : sampleValue(sampleSecond),
      unit: definition.unit, status, quality: status === 'valid' ? 0.98 : status === 'stale' ? 0.7 : 0.15,
      timestamp: timestamp(state, sampleSecond), ageSeconds, simulated: true, context,
      trend: status === 'invalid' ? [] : Array.from({ length: 24 }, (_, i) => sampleValue(sampleSecond - (23 - i) * 2)),
    };
  });
}

export interface SimulationEvent {
  id: string;
  kind: 'information' | 'action' | 'signal';
  title: string;
  description: string;
  timestamp: string;
  simulated: true;
}

export function getSimulationEvents(state: MissionState): SimulationEvent[] {
  const current = getCurrentMission(state);
  const events: SimulationEvent[] = [{
    id: 'simulation', kind: 'information', title: 'Simulação educativa ativa',
    description: 'Todos os sinais e eventos são gerados localmente; não há conexão com uma missão real.',
    timestamp: state.startedAt, simulated: true,
  }];
  if (current.id === 'radiation') events.push({
    id: 'solar-event', kind: 'action', title: hasRecommendedResponse(state, 'radiation') ? 'Abrigo confirmado no roteiro' : 'Evento solar simulado',
    description: 'O cenário solicita executar o procedimento de proteção. O alerta não foi calculado de uma dose medida.',
    timestamp: timestamp(state, state.elapsedSeconds), simulated: true,
  });
  if (current.id === 'sensor' && !hasRecommendedResponse(state, 'sensor')) events.push({
    id: 'signal-loss', kind: 'signal', title: 'Sinal antigo / leitura inválida',
    description: 'O canal precisa de verificação. A indisponibilidade do dado não permite afirmar o estado clínico.',
    timestamp: timestamp(state, state.elapsedSeconds), simulated: true,
  });
  return events;
}
