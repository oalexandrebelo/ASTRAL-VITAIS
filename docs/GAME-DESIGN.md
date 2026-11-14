# ASTRAL VITAIS — design do jogo e contrato do motor

Data de revisão: 14 de novembro de 2026. Idioma: português do Brasil.

## Proposta

O jogador participa de uma missão fictícia e aprende a transformar monitoramento em ações verificáveis: conferir a leitura, entender seu contexto, seguir o procedimento e registrar o que aconteceu. O problema central de design é a distância entre ver um número e tomar uma decisão responsável.

O MVP oferece uma sequência completa de nove decisões. O painel mistura o ambiente da cabine com sinais sintéticos da pessoa e mostra quando um canal perde validade. Essa separação é deliberada: uma amostra pode ser tecnicamente válida sem certificar saúde; um dado ausente não prova normalidade nem doença.

O projeto é uma experiência educativa original. Não representa um sistema operacional da NASA, uma ferramenta de triagem ou uma avaliação de aptidão para voo. As ações do roteiro são traduções didáticas dos temas científicos; o documento de rastreabilidade normativa do projeto contém o escopo e as fontes oficiais.

## Estrutura implementada

| Ordem | Fase | Cenário | Ação praticada | Erro que o jogo torna visível |
|---|---|---|---|---|
| 1 | Pré-voo | Linha de base | Conferir identidade, contato, horário e medições com a equipe | Tratar a média da tripulação como avaliação individual |
| 2 | Pré-voo | Sono e ritmo | Planejar janela de descanso, ambiente e comunicação de fadiga | Adiar o descanso sistematicamente |
| 3 | Órbita | Músculos e ossos | Seguir o plano resistido e aeróbio; verificar equipamento e comunicar desconforto | Confundir flutuação confortável com manutenção física |
| 4 | Órbita | Nutrição e hidratação | Cumprir e registrar o plano individual; comunicar dificuldade | Aplicar uma quantidade universal a todos |
| 5 | Órbita | Radiação | Executar o procedimento de abrigo, confirmar tripulação e coordenar dosimetria | Esperar sintomas ou apenas olhar o dosímetro |
| 6 | Órbita | Visão/SANS | Registrar alteração e comunicar a equipe de saúde | Usar o pulso válido para descartar um problema ocular |
| 7 | Órbita | Falha do sensor | Conferir contato e horário, repetir a coleta e avaliar a pessoa | Apresentar o último valor como se fosse atual |
| 8 | Órbita | Isolamento e equipe | Conversa privada, revisão da carga e suporte acordado | Criar ranking público de resiliência |
| 9 | Retorno | Readaptação | Comunicar sintomas, pedir assistência e seguir recuperação orientada | Forçar uma tarefa para provar preparo |

Esses temas se apoiam no [Human Research Roadmap](https://humanresearchroadmap.nasa.gov/), nos [cinco perigos do voo espacial](https://www.nasa.gov/hrp/hazards/), nas [normas de saúde e desempenho humano](https://www.nasa.gov/ochmo/human-spaceflight-and-aviation-standards/) e no material da NASA sobre [efeitos no corpo](https://www.nasa.gov/humans-in-space/the-human-body-in-space/). SANS possui uma [página específica de risco](https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/). Os procedimentos detalhados de uma missão real continuam sendo definidos pela equipe responsável.

## Loop de interação

1. Ler o contexto e observar o painel.
2. Escolher uma ação entre três alternativas plausíveis.
3. Receber feedback com o que foi bem escolhido ou ficou incompleto, seguido da justificativa.
4. Avançar explicitamente; o jogo não troca a questão antes que o feedback possa ser lido.
5. Concluir o percurso, revisar a pontuação educativa e recomeçar quando desejado.

Uma escolha incompleta não bloqueia o aprendizado. O jogador recebe a orientação e pode concluir a missão. Não há morte, perda de vida, punição por sintomas, comparação entre pessoas ou classificação de saúde mental.

## Progresso e pontuação

O progresso mede decisões respondidas: `respostas / 9 × 100`, arredondado para inteiro. Ele chega a 100% mesmo se todas as escolhas estiverem incorretas.

A pontuação educativa mede respostas: recomendada = 10 pontos, parcialmente adequada = 5, inadequada para o cenário = 0. O total é normalizado para 0–100: `pontos / 90 × 100`. O indicador nunca recebe o rótulo de saúde, capacidade fisiológica ou aptidão para voo. O motor guarda apenas ações e recalcula a pontuação; um valor adulterado no armazenamento não altera o resultado.

O estado `complete` muda somente depois de responder e avançar na última missão. O progresso pode mostrar nove decisões concluídas enquanto o último feedback ainda está aberto; isso é intencional.

## Contrato TypeScript

Arquivo: `src/domain/mission.ts`.

| Export | Responsabilidade |
|---|---|
| `MISSION_STAGES` | IDs, títulos e subtítulos das três fases |
| `MISSIONS` | Nove roteiros, 27 escolhas, fontes e feedbacks |
| `SCIENCE_SOURCES` | Mapa de fontes oficiais usado pelos roteiros |
| `initialState(seed?, startedAt?)` | Estado inicial reproduzível |
| `reducer(state, action)` | Único ponto de transição do jogo |
| `getCurrentMission(state)` | Missão no cursor atual |
| `getProgress(state)` | Progresso e pontuação educativa derivados |
| `getTelemetry(state)` | Seis métricas sintéticas com qualidade e horário |
| `getSimulationEvents(state)` | Eventos explicitamente ficcionais do roteiro |
| `restoreState(input)` | Validação e reconstrução de uma sessão armazenada |
| `STORAGE_KEY` | `astral-vitais.mission.v1` |

O domínio não importa React, Three.js, DOM, rede ou armazenamento. A interface controla os efeitos externos. O mesmo estado gera a mesma telemetria, facilitando demonstrações, captura de falhas e testes.

### Ações

```ts
type MissionAction =
  | { type: 'ANSWER'; choiceId: string }
  | { type: 'NEXT' }
  | { type: 'TICK'; seconds?: number }
  | { type: 'RESET' }
  | { type: 'RESTORE'; payload: unknown };
```

`ANSWER` é idempotente após a resposta registrada. IDs desconhecidos não causam transição. `NEXT` exige feedback aberto. `TICK` avança o relógio ficcional em até 60 segundos por ação e para quando a missão termina. `RESET` mantém semente e época para possibilitar uma reprodução comparável. `RESTORE` reconstrói ações válidas ou volta ao estado inicial.

### Telemetria

| Campo | Significado |
|---|---|
| `id` | Identificador estável da métrica |
| `value` / `unit` | Amostra sintética; `null` quando inválida |
| `status` | `valid`, `stale` ou `invalid`; qualidade do canal, não avaliação clínica |
| `timestamp` | Horário da amostra no relógio ficcional |
| `ageSeconds` | Tempo simulado desde a amostra |
| `quality` | Indicador técnico fictício, não confiança em diagnóstico |
| `simulated` | Sempre `true` |
| `context` | Explicação humana da validade e das limitações |
| `trend` | Série reproduzível para o gráfico; vazia para o sinal inválido |

As métricas são frequência cardíaca, saturação periférica, temperatura, CO₂ do ambiente, taxa de dose simulada e sono registrado. Os números são escolhidos para exibição; não implementam limites da NASA nem gatilhos clínicos. A taxa de dose é expressa em µSv/h e não é dose acumulada. As fases terrestres usam valores e contextos de treinamento ou recuperação, distintos do cenário orbital. O CO₂ é uma amostra instantânea fictícia, não uma média de uma hora. O sono conserva o horário do registro histórico, sem parecer uma leitura fisiológica contínua.

O evento de radiação é ativado pelo roteiro. Confirmar abrigo altera o registro da ação, sem reduzir artificialmente a leitura, apagar exposição passada ou dizer que o risco acabou. Na falha do sensor, o pulso fica desatualizado e a saturação é ocultada. A escolha recomendada conclui a checagem fictícia e restabelece a qualidade do canal. Esse mecanismo representa a conclusão do exercício educativo, não garante recuperação de um equipamento real.

## Persistência e privacidade

A UI pode salvar o estado serializado em `localStorage`; o motor não realiza essa gravação. A sessão contém escolhas, semente e tempo do cenário. Não há nome real, prontuário, credencial, sinal de wearable ou identificador clínico. Falhas de armazenamento devem manter a experiência em memória.

A restauração aceita apenas versão conhecida, semente finita, data válida dentro do intervalo da demonstração, tempo limitado, cursor consistente e respostas que formam um prefixo ordenado das missões. A pontuação, o feedback e os horários de resposta são reconstruídos a partir de ações válidas. O limite de tamanho do JSON evita carregamento desnecessário de entradas excessivas. Essa validação protege a integridade da demonstração; ela não torna `localStorage` um armazenamento médico seguro.

## Verificação executada

Em 14/11/2026 foi executado:

```sh
node_modules/.bin/vitest run src/domain/mission.test.ts
```

Resultado observado após o ajuste de contexto ambiental: **1 arquivo passou; 23 testes passaram**. A suíte verifica progresso, percurso completo, independência entre score e conclusão, bloqueio de repetição, entradas inválidas, falsificação de feedback, persistência nos diferentes estados, repetição determinística, leitura inválida, proteção do sentido do cenário de radiação, horário histórico de sono e distinção entre contexto terrestre e orbital.

Esta evidência cobre o motor. A validação visual, a navegação por teclado, o layout móvel, a perda de WebGL e a publicação são verificadas separadamente pela integração.

## Evolução proposta

### Próxima versão educativa

Adicionar tarefas em múltiplos passos com confirmação de equipamento e registro; revisão das respostas ao final; cenários alternativos para impedir memorização da posição das alternativas; modo facilitador com reprodução da mesma semente; testes com educadores e especialistas em medicina aeroespacial.

### Treinamento mais imersivo

Criar estações interativas de sono, exercício, coleta e abrigo. O jogador manipula objetos e executa uma sequência antes de concluir a tarefa. Uma visualização 3D nunca deve ser a única via de acesso: todas as decisões precisam existir também no painel DOM, com movimento reduzido e navegação por teclado.

### Conexão a dados de pesquisa

Um módulo separado pode ler datasets públicos, preservando accession, população, missão, unidade, método de coleta e limitações. O repositório NASA OSDR contém experimentos e modalidades diversas; não deve ser apresentado como uma transmissão clínica ao vivo. Essa etapa precisa de curadoria de estudo por estudo e não altera automaticamente as regras educativas do MVP.

### Uso operacional ou clínico

Exige outro ciclo de desenvolvimento: população e finalidade definidas, aprovação de protocolos, engenharia de sistemas e perigos, governança de dados, revisão especializada, validação do hardware, validação do software e evidência prospectiva apropriada. A experiência educativa entrega uma base de interação e rastreabilidade, sem antecipar essas conclusões.
