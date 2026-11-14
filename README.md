# ASTRAL VITAIS

## Longe da Terra. Perto da vida.

**ASTRAL VITAIS** é um simulador educativo de saúde espacial criado pela equipe **ASTRAL VITAL**. Em uma experiência React + Three.js, o participante acompanha sinais sintéticos e pratica decisões de prevenção antes do voo, durante a missão e após o retorno.

**Pitch:** observar um número não basta para cuidar de uma tripulação. O ASTRAL VITAIS transforma monitoramento em um percurso de decisões: conferir o sinal, entender o contexto, agir, registrar e comunicar.

Versão: **0.1.0-beta.1** · Idioma: **português do Brasil** · [Repositório](https://github.com/oalexandrebelo/ASTRAL-VITAIS)

**[Abrir o beta publicado](https://astral-vitais.alexandrebelo.chatgpt.site)** · Acesso privado do proprietário no ambiente de publicação.

> Protótipo educativo independente. Todos os sinais e eventos são sintéticos. A pontuação mede escolhas no jogo; não mede saúde, aptidão para voo ou risco individual. O projeto não tem vínculo, certificação ou aprovação da NASA.

## O que a beta entrega

| Área | Conteúdo implementado |
|---|---|
| Sua missão | Nove desafios, três fases, 27 alternativas, feedback e justificativa científica |
| Monitoramento | Seis métricas sintéticas, tendências, qualidade, horário e idade da leitura |
| Base científica | Oito grupos de riscos, quatro referências normativas e dez fontes selecionadas |
| Tecnologia | Nove marcos de equipamentos, de Mercury ao E4D em demonstração em 2026 |
| Cena espacial | Terra estilizada, astronauta original, estrelas, órbita e modos de câmera |
| Controles | Pausa, retomada, som ambiente opcional e tela cheia quando suportada |
| Continuidade | Progresso no navegador, reinício com confirmação e exportação do diário em JSON |

A interface principal usa elementos HTML. As decisões continuam disponíveis se o navegador não conseguir iniciar WebGL; nesse caso, a cena usa uma representação visual alternativa. Há suporte a preferência de movimento reduzido, foco visível, rótulos de controles e navegação por teclado. Essas medidas implementadas não equivalem a uma certificação de acessibilidade.

## Por que esse tema

A NASA organiza os perigos do voo espacial humano em radiação, isolamento e confinamento, distância da Terra, gravidade alterada e ambientes hostis. Os riscos atravessam fisiologia, ambiente e rotina; interpretar uma leitura exige entender essas relações. [Fonte: NASA Human Research Program](https://www.nasa.gov/hrp/hazards/).

Os artigos SOMA usados no projeto mostram o valor de referências individuais, coleta longitudinal e qualidade de dados. Também apontam limites: muitos dados moleculares de poucos participantes não bastam para validar intervenções médicas. A beta usa essa evidência para ensinar observação e prevenção, mantendo os resultados de pesquisa separados dos sinais fictícios do jogo. [Análise dos artigos](docs/ARTIGOS-E-EQUIPAMENTOS.md).

O diferencial do produto está no ciclo de aprendizagem. Uma leitura tecnicamente válida não demonstra que todos os sistemas do corpo estão bem. Uma falha de transmissão não prova doença ou normalidade. Um alerta só ganha sentido quando produz uma ação compreendida e registrada.

## Como jogar

1. Abra **Sua missão** e selecione **Iniciar minha missão**.
2. Leia o contexto, escolha um procedimento e confirme a execução.
3. Leia o feedback e a explicação científica antes de avançar.
4. Use **Monitoramento** para explorar as seis métricas e conferir a qualidade dos sinais.
5. Consulte **Base científica** e **Tecnologia** para entender riscos, requisitos e instrumentos.
6. Ao concluir os nove desafios, exporte o diário ou prepare uma nova missão.

O percurso não tem limite de tempo para acertar. A pausa suspende o relógio da simulação e a animação. O relógio também deixa de avançar quando a aba está oculta, ao consultar as páginas de ciência/tecnologia e depois da conclusão.

### As três fases

| Fase | Desafios | Aprendizado central |
|---|---|---|
| Pré-voo | Linha de base; sono e ritmo | Preparar referências individuais e uma rotina sustentável |
| Em órbita | Exercício; nutrição e hidratação; radiação; visão/SANS; sensor; equipe | Transformar observação em ação coordenada |
| Retorno | Readaptação à gravidade | Comunicar sintomas, solicitar apoio e continuar o acompanhamento |

Uma escolha incompleta ou inadequada recebe feedback e permite continuar. Progresso e pontuação são independentes: completar todas as decisões não significa acertar todas elas. A pontuação é calculada pelas respostas: 10 pontos para a alternativa recomendada no cenário, 5 para a parcialmente adequada e 0 para a inadequada, normalizados para 0–100.

## Executar localmente

Pré-requisitos: **Node.js 22.12 ou superior** e npm. A instalação inicial exige acesso ao registro de pacotes. Não é necessário configurar chave de API ou arquivo de segredos.

```sh
git clone https://github.com/oalexandrebelo/ASTRAL-VITAIS.git
cd ASTRAL-VITAIS
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

### Comandos disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Executar a suíte Vitest |
| `npm run typecheck` | Verificar os tipos TypeScript |
| `npm run build` | Verificar tipos e gerar a aplicação estática em `dist/` |
| `npm run preview` | Servir localmente o build, normalmente na porta 4173 |

```sh
npm test
npm run build
npm run preview
```

O build utiliza arquivos locais e recursos visuais procedurais. Depois de instalar as dependências e gerar o build, ele pode ser servido em uma rede local sem buscar texturas, modelos, fontes ou áudio em serviços externos. Os links de referências científicas precisam de Internet. A beta não inclui service worker, instalação PWA ou garantia de recarregamento offline em um site remoto.

## Stack e arquitetura

| Tecnologia | Uso |
|---|---|
| React 19 | Interface, navegação local e coordenação do estado |
| Three.js 0.187 | Cena 3D original e ciclo de renderização |
| TypeScript 5.9 | Contratos de domínio e verificação estática |
| Vite 7 | Desenvolvimento e build estático |
| Vitest 4 | Testes determinísticos do motor |
| Web Audio API | Som ambiente sintetizado, ativado pelo usuário |
| `localStorage` | Persistência opcional da sessão educativa no navegador |

O motor em `src/domain/mission.ts` é independente de React, WebGL, rede e armazenamento. Ele recebe ações e deriva o estado, o progresso, a telemetria e os eventos. A interface realiza os efeitos externos. Isso permite testar as regras e reproduzir um cenário sem renderizar a cena.

A cena 3D é carregada sob demanda em um componente separado. O renderer limita a densidade de pixels a 1,5, usa atualização visual com alvo de 30 quadros por segundo, respeita a aba oculta e a preferência de movimento reduzido, e libera geometrias, materiais e texturas ao desmontar. Esses limites reduzem trabalho de renderização; desempenho real depende do aparelho e do navegador.

### Mapa dos arquivos

| Caminho | Responsabilidade |
|---|---|
| `src/main.tsx` | Inicialização da aplicação |
| `src/App.tsx` | Páginas, decisões, painel, exportação e persistência |
| `src/styles.css` | Identidade visual, layout responsivo e estados de interação |
| `src/components/SpaceScene.tsx` | Terra, astronauta, materiais, câmera e alternativa sem WebGL |
| `src/components/Icon.tsx` | Marca e ícones vetoriais originais |
| `src/domain/mission.ts` | Nove roteiros, reducer, telemetria e restauração de estado |
| `src/domain/mission.test.ts` | Testes do domínio |
| `src/data/science.ts` | Riscos, fontes, equipamentos e referências normativas da interface |
| `public/favicon.svg` | Ícone da aplicação |
| `docs/` | Pesquisa, decisões, design do jogo, arquitetura e evolução |
| `vite.config.ts` | Build e separação do módulo Three.js |
| `package-lock.json` | Versões resolvidas para instalação reproduzível |

## Telemetria e integridade da simulação

O painel apresenta frequência cardíaca, saturação periférica, temperatura, CO₂ ambiental, taxa de dose simulada e sono registrado. Cada métrica possui unidade, horário, idade, estado de validade e contexto. Os dados são gerados localmente de maneira determinística.

- **Sinal válido** descreve qualidade do canal, não diagnóstico.
- **Leitura antiga** mantém o horário original e expõe a falta de atualização.
- **Leitura inválida** oculta o valor; ausência não vira zero.
- **Sono** é um registro histórico, não um sensor que se atualiza continuamente.
- **CO₂** é uma amostra instantânea fictícia, não a média de uma hora exigida no requisito ambiental citado.
- **Radiação** é uma taxa em µSv/h. O MVP não calcula dose acumulada nem probabilidade de câncer. O evento solar é acionado pelo roteiro.

As referências normativas da página científica não atuam como limiares automáticos do motor. Os valores e os eventos são didáticos. A data inicial da simulação também é fictícia.

## Dados, privacidade e limites

Esta beta não possui autenticação, backend, prontuários, integração com sensores ou transmissão de saúde real. Não solicita nome, dados clínicos ou credenciais do participante. O progresso é salvo em `localStorage` e permanece naquele navegador; a aplicação continua em memória se esse armazenamento estiver indisponível.

A restauração aceita somente uma versão conhecida e ações coerentes com o roteiro. Pontuação e feedback são recalculados; dados armazenados não são tratados como uma autoridade. Isso protege a consistência do jogo, sem transformar `localStorage` em armazenamento clínico seguro.

O botão **Exportar diário** cria um JSON da simulação com decisões, progresso e telemetria sintética. O reinício apaga o progresso atual do navegador depois da confirmação. Downloads já exportados continuam no dispositivo do usuário.

A aplicação é uma experiência educativa. Não diagnostica, prescreve medicamentos, recomenda doses, aprova astronautas ou substitui protocolos de missão e equipes profissionais. Os documentos explicam por que resultados da ISS e de missões curtas não podem ser generalizados automaticamente a missões longas para Marte.

## Verificação

A rodada registrada em 14/11/2026 executou **23 testes do motor, todos aprovados**. A suíte cobre percurso completo, progresso, pontuação, idempotência, entradas inválidas, restauração, resistência à adulteração do feedback, telemetria determinística e distinção entre sinais válidos, antigos e inválidos. [Detalhes da verificação do motor](docs/GAME-DESIGN.md#verificação-executada).

Testes de domínio não comprovam compatibilidade universal de navegador, acessibilidade integral, desempenho em todos os aparelhos ou validação médica. O comando `npm run build` verifica tipos e produz o artefato estático; a inspeção visual e o percurso de interação complementam essa etapa em cada entrega.

O percurso completo e a alternativa sem WebGL foram verificados no navegador de teste. Na página publicada, o Chrome conectado renderizou a Terra, atmosfera e astronauta em Three.js; a troca entre as câmeras Órbita e Tripulante também foi observada. [Registro completo da validação](docs/VALIDACAO.md).

## Documentação

- [Base científica NASA e requisitos](docs/CIENCIA-NASA.md)
- [Pesquisa 2026: dados abertos, literatura e modelo executável](docs/pesquisa-2026/LEIA-ME.md)
- [Evidências estruturadas e escopo das regras](docs/NASA-EVIDENCE.json)
- [Análise dos artigos e evolução dos equipamentos](docs/ARTIGOS-E-EQUIPAMENTOS.md)
- [Design do jogo e contrato do motor](docs/GAME-DESIGN.md)
- [Arquitetura e plano de evolução](docs/ROADMAP-E-ARQUITETURA.md)
- [Repositórios e oportunidades de integração](docs/REPOSITORIOS.md)
- [Decisões do ASTRAL VITAIS](docs/DECISOES-ASTRAL.md)
- [Validação executada e limites da prova](docs/VALIDACAO.md)
- [Licenças e avisos de terceiros](THIRD-PARTY-NOTICES.md)

## Evolução do produto

| Etapa | Entrega proposta | Critério para avançar |
|---|---|---|
| Refinar a beta | Revisão científica, testes com participantes e revisão das respostas ao final | O participante explica o motivo das ações e reconhece incerteza nos dados |
| Procedimentos práticos | Estações 3D com tarefas de vários passos e alternativa HTML equivalente | Sequência de ações verificável, acessível e compreensível |
| Evidências de pesquisa | Catálogo curado de estudos SOMA/OSDR, com proveniência — primeiro lote em [`docs/pesquisa-2026`](docs/pesquisa-2026/LEIA-ME.md) | Cada resultado informa estudo, método, população e limitações |
| Instrutor | Reprodução de sessões e análise do aprendizado; avaliar Open MCT | Mesma semente e ações permitem reproduzir a sessão |
| Lua, Marte e XR | Cenários próprios e interação espacial em aparelhos definidos | Contexto científico e usabilidade validados para cada cenário |
| Pesquisa com hardware | Integração experimental separada da beta | Finalidade, governança, equipe responsável e protocolo de validação definidos |

Essas etapas são planejamento. O código atual entrega a beta educativa descrita acima; não inclui hardware, XR, processamento de dados clínicos ou um console Open MCT.

## Licença e referências

O código e os assets originais do projeto são disponibilizados sob [licença MIT](LICENSE). Dependências mantêm suas próprias licenças; consulte [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

Os artigos anexados e a imagem do desafio foram usados como referências de trabalho e não são redistribuídos neste repositório. A documentação aponta títulos, DOI e fontes oficiais. A Terra é estilizada e procedural; não representa cartografia científica. A cena não utiliza modelos, logotipos ou texturas oficiais da NASA.
