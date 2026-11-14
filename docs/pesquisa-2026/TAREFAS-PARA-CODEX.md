# Tarefas para o Codex — da pesquisa à implementação

Backlog derivado de [`DOSSIE.md`](DOSSIE.md). Foi escrito para ser executado em PRs pequenos, sem quebrar o que a beta já garante: sinais sintéticos rotulados, ausência de diagnóstico e nenhuma "cura por interface".

**Princípios que valem para todas as tarefas**

1. Nada aqui transforma o produto em dispositivo médico. Texto de UI fala em observação, prevenção, encaminhamento e registro.
2. Todo número exibido carrega origem (medido/calculado/simulado), unidade, timestamp e qualidade — a decisão 3 de [`../CIENCIA-NASA.md`](../CIENCIA-NASA.md) §3.
3. Limiar normativo continua vindo de `NASA-EVIDENCE.json` (V1 4030, V2 6004, V1 4033). Os valores desta pasta são **contexto e plausibilidade**, não substituição.
4. `npm test`, `npm run typecheck` e `npm run build` precisam passar em cada tarefa.

---

## T1 — Origem do dado e frequência respiratória na telemetria

**Contexto.** `TelemetryMetric` (`src/domain/mission.ts`) tem `simulated: true` fixo e seis métricas — falta a frequência respiratória, que é um dos cinco indicadores do recorte do produto e o primeiro sinal de hipercapnia.

**Fazer.**
- Adicionar `respiratoryRate` ao union `TelemetryMetric['id']`, com unidade `rpm`, base plausível em repouso (12–20) e contexto.
- Adicionar `origin: 'measured' | 'derived' | 'simulated'`, mantendo `simulated: true` enquanto não houver sensor real (compatibilidade com consumidores atuais).
- Atualizar `MetricCard` (`src/App.tsx`) para exibir o selo de origem.
- Estender os testes de contrato de telemetria em `src/domain/mission.test.ts`.

**Aceite.**
- `getTelemetry` continua determinístico para a mesma `seed` + `elapsedSeconds`.
- O selo aparece para as sete métricas e não quebra o layout compacto.
- Nenhum teste existente alterado para "passar"; novos casos cobrem FR e origem.

**Risco.** Aumentar o número de cartões pode prejudicar a leitura em telas pequenas; validar em 390 px de largura.

---

## T2 — Módulo de fisiologia pura (sem UI)

**Contexto.** O simulador desta pasta prova as equações em Python; o produto precisa das mesmas funções em TypeScript, testáveis isoladamente.

**Fazer.** Criar `src/domain/fisiologia.ts` com funções puras e documentadas:

```ts
export function pressaoAlveolarO2(opts: { fio2: number; pressaoKpa: number; paco2Kpa: number }): number;
export function saturacaoPorPao2(pao2Mmhg: number): number;      // Severinghaus
export function conteudoArterialO2(opts: { spo2: number; pao2Mmhg: number; hemoglobina: number }): number;
export function projetarAteLimiar(serie: readonly number[], limiar: number, janela?: number): { slope: number; minutosAteLimiar: number | null };
export function ewma(valor: number, anterior: number, lambda?: number): number;
export function cusum(z: number, anterior: number, k?: number): number;
```

**Aceite (casos-âncora do dossiê §7.1):**
- `saturacaoPorPao2(100) ≈ 97,7` e `saturacaoPorPao2(54) ≈ 87,8` (tolerância ±0,3).
- `pressaoAlveolarO2({fio2:0.21, pressaoKpa:101.3, paco2Kpa:5.3}) ≈ 13,3 kPa` (≈100 mmHg).
- `projetarAteLimiar` devolve `null` quando a inclinação é ≥ 0 e um valor finito quando a série cai de forma monotônica.
- Testes em `src/domain/fisiologia.test.ts`, sem depender de DOM.

**Risco.** Não usar essas funções para "diagnosticar"; são modelo educativo.

---

## T3 — Limiares tipados a partir de `ancoras_clinicas.json`

**Contexto.** O JSON em `dados/` é a fonte curada (com fonte e mecanismo por indicador), mas `docs/` não é importável pelo app sem configuração.

**Fazer.**
- Criar `src/data/limiares.ts` com tipo `LimiarIndicador` e os valores do JSON, **citando `P01…P20`** em comentário por item.
- Comparar com `src/data/science.ts` (`STANDARDS`) e não duplicar o que já é requisito normativo: referenciar o `id` da regra (`V1 4030`, `V2 6004`).
- Adicionar um teste que garanta que todo limiar tem `fonte` não vazia e unidade.

**Aceite.** Nenhum limiar "solto" sem fonte; `npm run typecheck` limpo.

---

## T4 — Alerta em três níveis com latência por ambiente

**Contexto.** O dossiê §9 propõe Info/Atenção/Emergência e a regra dos 30 minutos; `CIENCIA-NASA.md` §6 (S29) já trata do atraso de ~21–23 min para Marte.

**Fazer.**
- Modelo `AlertaNivel = 'info' | 'atencao' | 'emergencia'` com `origem`, `fatores` (3 no máximo) e `acao`.
- `latenciaComunicacao(ambiente: 'orbita' | 'lua' | 'marte')` retornando segundos/minutos, com nota de que o valor é educativo e comprimido na UI.
- Regra explícita: nível `emergencia` **nunca** depende da Terra.
- Exibir no alerta o que **não** deve ser feito (ex.: "não trate CO₂ ambiental respirando fundo").

**Aceite.** Teste garante que `emergencia` tem `acao` local e `prazoSegundos` menor que a latência de Marte.

---

## T5 — Plausibilidade antes do alarme (dado real do OSD-575)

**Contexto.** O dado real tem glicemias de 36 e 44 mg/dL em R+45, improváveis em tripulantes assintomáticos.

**Fazer.**
- Função `classificarLeitura({ valor, unidade, sintomas, medicacao, tempoAteProcessamento })` que devolve `ok | suspeita_artefato | critico`.
- UI: quando `suspeita_artefato`, pedir repetição e registrar a causa provável — **não** pintar de vermelho.
- Texto educativo explicando por que artefato pré-analítico existe.

**Aceite.** Um caso de teste reproduz o 36 mg/dL sem sintomas e resulta em `suspeita_artefato`; o mesmo valor com sintomas resulta em `critico`.

---

## T6 — Radiação: taxa, acumulado e carreira

**Contexto.** A beta já mostra taxa em µSv/h. O dossiê mostra que a decisão depende de três grandezas e do cenário solar.

**Fazer.**
- Exibir três números separados: taxa atual (µSv/h), dose acumulada da missão (mSv) e **fração da carreira** (limite de 600 mSv, V1 4030).
- Evento solar simulado com escolha de abrigo/colete; o abrigo reduz **exposição futura** e **não** altera a dose já recebida.
- Tooltip com o número medido na Artemis I (1,18 mSv/dia) e a origem (`P03`, `P04`).

**Aceite.** Após o evento, a dose acumulada é monotônica não decrescente; a fração de carreira é recalculada a partir dela; teste cobre ambos.

**Risco.** Não apresentar 600 mSv como "meta segura" — é limite de projeto (ALARA, V1 4029).

---

## T7 — Módulo SANS guiado (sem diagnóstico)

**Contexto.** SANS tem prevalência de 81% (P01) e **não** é detectável pelas métricas atuais; ignorá-lo deixa um buraco clínico evidente.

**Fazer.**
- Fluxo de 5 passos: sintomas visuais → checagem de acuidade simulada → contexto (tempo de voo) → registro → encaminhamento.
- Nunca "curar" SANS; o evento fica em acompanhamento.
- Explicar que webcam não substitui exame ocular e que a prevalência é populacional, não individual.

**Aceite.** O fluxo termina em "encaminhado/aguardando" e o diário registra a decisão com timestamp.

---

## T8 — Fila offline e pacote de *handoff*

**Contexto.** Latência e perda de contato são o caso nominal em Marte (`CIENCIA-NASA.md` §6, S29), não *edge case*.

**Fazer.**
- Fila local de eventos/alertas com estados `pendente | enviado | aguardando_resposta`.
- "Pacote para a equipe médica": série temporal, contexto ambiental, ações tomadas, timestamp.
- Exportação no diário JSON já existente, sem inventar resposta da Terra.

**Aceite.** Desligar a rede não perde eventos; ao "reconectar", o estado muda para `enviado` sem criar resposta automática.

---

## T9 — Proveniência visível

**Contexto.** O produto já separa medido/calculado/simulado, mas a pesquisa acrescenta fontes com accession.

**Fazer.**
- Em cada métrica ou alerta que cite número externo, mostrar `OSD-xxx`, `DONKI` ou `P0x` com data de acesso.
- Página "Base científica" ganha uma seção "Dados abertos" com o catálogo de `dados/catalogo_osdr_inspiration4.csv`.
- Nunca exibir o número sem a fonte ao lado.

**Aceite.** Nenhum número "órfão" nas telas de ciência/monitoramento.

---

## T10 — Opcional: promover P01–P20 a `NASA-EVIDENCE.json`

**Contexto.** Hoje o JSON tem 31 fontes (S01–S30 + desdobramentos) e 3 regras. A pesquisa adiciona 20 referências.

**Fazer (somente se o mantenedor aprovar).**
- Adicionar `sources` com `id: "P01"…"P20"`, `accessedOn: "2026-11-14"` e `type: "peer-reviewed" | "agency" | "dataset"`.
- **Não** adicionar `rules` novas sem revisão: as três atuais vêm de norma.
- CI simples que valida JSON e unicidade de `id`.

**Aceite.** `docs/CIENCIA-NASA.md` continua coerente; nenhum requisito alterado.

---

## Fora de escopo (não fazer)

- Baixar OSDR/DONKI em tempo de execução no navegador (CORS, disponibilidade, reprodutibilidade).
- Inferir diagnóstico, doses, prescrições ou aptidão.
- Usar dados com identificação pessoal — os datasets citados são públicos e agregados por código de amostra.
- Substituir os requisitos normativos por limiares desta pasta.

## Ordem sugerida

`T2` → `T3` → `T1` → `T5` → `T4` → `T6` → `T7` → `T8` → `T9` → `T10`.
As três primeiras são pré-requisito das demais; `T6` e `T7` são as que mais rendem demonstração.
