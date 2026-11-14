# Decisões do ASTRAL VITAIS

Data: 14/11/2026. Versão de referência: 0.1.0-beta.1. Equipe: ASTRAL VITAL.

Este registro reúne decisões efetivamente refletidas no código e separa a evolução planejada. A base de implementação está em `src/App.tsx`, `src/domain/mission.ts`, `src/components/SpaceScene.tsx` e `src/data/science.ts`.

## 01. Produto educativo com dados sintéticos

**Decisão:** entregar um percurso de aprendizagem sobre monitoramento e prevenção, com sinais e eventos gerados localmente.

**Motivo:** o objetivo imediato é tornar compreensível a passagem de uma observação para uma ação responsável. A pesquisa disponível não valida um novo sistema diagnóstico. Os artigos SOMA apontam restrições de amostragem e comparabilidade que impedem transformar resultados exploratórios em regras clínicas individuais. [Análise científica](ARTIGOS-E-EQUIPAMENTOS.md).

**Consequência:** a interface identifica a simulação, a exportação leva o mesmo aviso e não existem backend, prontuário, autenticação ou conexão a sensores reais nesta versão.

## 02. Identidade da equipe e do produto

**Decisão:** usar **ASTRAL VITAL** como nome da equipe e **ASTRAL VITAIS** como nome do software e do repositório.

**Motivo:** preservar o nome da equipe informado no briefing e a grafia solicitada para o projeto no Git.

**Consequência:** o app usa marca própria e informa que é independente. Referências à NASA são atribuição científica; não representam endosso.

## 03. Nove decisões em três fases

**Decisão:** organizar a beta em pré-voo, órbita e retorno. O domínio contém nove desafios e 27 alternativas com feedback.

**Motivo:** prevenção começa antes da viagem e o acompanhamento continua após o pouso. Um percurso finito permite demonstrar o produto inteiro sem depender de coleta real ou de uma sessão longa.

**Consequência:** a primeira entrega é um jogo de decisões contextualizadas. Manipulação de instrumentos, estações 3D navegáveis e procedimentos em vários passos pertencem ao roadmap, não são apresentados como já implementados.

## 04. Pontuação de aprendizagem separada da saúde

**Decisão:** calcular progresso pelas respostas concluídas e pontuação pelas escolhas do roteiro, normalizada para 0–100.

**Motivo:** transformar uma nota em “saúde do astronauta” daria precisão clínica inexistente. Também seria inadequado punir sintomas ou classificar publicamente o bem-estar da tripulação.

**Consequência:** o jogador pode concluir o percurso mesmo com erros, recebe explicações e pode reiniciar. Não há morte, ranking de resiliência ou obrigação de demonstrar uma emoção.

## 05. Qualidade e tempo fazem parte do dado

**Decisão:** representar cada métrica com unidade, horário, idade, qualidade e estado `valid`, `stale` ou `invalid`.

**Motivo:** falha de comunicação pode parecer estabilidade se o último valor for mantido sem contexto. O propósito do desafio de sensor é ensinar essa diferença.

**Consequência:** o pulso antigo conserva seu timestamp; o valor inválido é ocultado. Sono é histórico. Sinal válido descreve o canal, não condição clínica.

## 06. Normas como referências com escopo

**Decisão:** citar NASA-STD-3001 Volume 1 revisão C e Volume 2 revisão F, com requisito, seção, valor e contexto. A UI seleciona CO₂ médio horário, dose efetiva de carreira, pressão atmosférica e ALARA. [Rastreabilidade](NASA-EVIDENCE.json) e [análise de requisitos](CIENCIA-NASA.md).

**Motivo:** pressão parcial, porcentagem, dose, taxa, média horária e histórico de carreira são grandezas diferentes. Um valor retirado de sua janela ou cenário pode produzir uma regra errada.

**Consequência:** a seleção não é uma matriz completa de conformidade. O motor não usa esses valores como gatilhos clínicos. As 8,5 horas de sono aparecem como recomendação no rationale, sem serem promovidas a requisito universal.

## 07. Evento solar por roteiro; taxa separada de dose acumulada

**Decisão:** ativar o evento solar como situação fictícia e mostrar taxa ilustrativa em µSv/h.

**Motivo:** não há detector real, modelo de exposição validado nem cálculo de risco individual. A ação educativa é reconhecer o contexto e seguir o protocolo de abrigo definido no cenário.

**Consequência:** confirmar abrigo registra o procedimento. O app não apaga exposição passada, não calcula dose de carreira e não promete risco zero.

## 08. React e Three.js direto

**Decisão:** utilizar React para interface e estado, com Three.js isolado em `SpaceScene.tsx`. Não incluir React Three Fiber, drei, XR ou engine de física nesta beta.

**Motivo:** a cena tem escopo delimitado e o domínio precisa continuar independente do renderer. Os controles essenciais são HTML e não dependem de interação dentro do canvas.

**Consequência:** há menos integrações para manter. Uma migração para renderer declarativo pode ser avaliada quando estações e objetos com estado tornarem a cena mais complexa. [Repositórios avaliados](REPOSITORIOS.md).

## 09. Assets originais e geração procedural

**Decisão:** gerar Terra estilizada, nuvens, astronauta, estrelas, órbita, ícones e áudio no próprio projeto.

**Motivo:** a demonstração precisa carregar sem hotlinks e sem dependência de modelos pesados. A procedência dos assets também deve ser clara.

**Consequência:** a Terra é artística, sem compromisso cartográfico; a cena não representa distâncias reais. PDFs anexados e imagem do desafio não são incluídos no Git. Figuras de artigos, vídeos ESA e assets NASA exigem avaliação própria antes de eventual incorporação.

## 10. Renderização com limites explícitos

**Decisão:** carregar a cena sob demanda, separar o módulo Three.js, limitar pixel ratio a 1,5 e usar alvo de 30 quadros por segundo. Interromper animação com pausa, aba oculta ou preferência de movimento reduzido.

**Motivo:** proteger a fluidez da interface e reduzir trabalho gráfico desnecessário, principalmente em aparelhos modestos.

**Consequência:** a renderização permanece ilustrativa; não há promessa universal de taxa de quadros. Recursos WebGL são descartados ao desmontar. Falha de inicialização ou perda de contexto exibe representação alternativa, mantendo as decisões em HTML.

## 11. Som opcional e controle do ritmo

**Decisão:** sintetizar som ambiente pela Web Audio API apenas depois de ação do usuário. Oferecer pausa e tela cheia quando o navegador permitir.

**Motivo:** imersão não deve exigir áudio nem impedir leitura no ritmo da pessoa. A simulação não impõe cronômetro para resposta.

**Consequência:** indisponibilidade de áudio ou tela cheia gera aviso sem interromper a missão. As fontes podem ser consultadas com o relógio simulado parado.

## 12. Persistência local com reconstrução do estado

**Decisão:** salvar a sessão educativa no navegador e restaurar apenas ações reconhecidas e coerentes. Recalcular score e feedback a partir do roteiro.

**Motivo:** continuar uma demonstração não exige conta ou serviço remoto. O armazenamento local pode ser removido, adulterado ou indisponível e deve ser tratado como entrada não confiável.

**Consequência:** restauração inválida volta ao início; falha de gravação mantém a experiência em memória. Há exportação JSON e reinício com confirmação. Não há sincronização entre dispositivos ou importação de diário pela interface nesta versão.

## 13. Ciência em duas profundidades

**Decisão:** apresentar texto conciso na interface e manter pesquisa detalhada em Markdown, com URLs, DOI, versões e limites.

**Motivo:** a tomada de decisão precisa ser legível durante o jogo; a equipe e avaliadores também precisam auditar as escolhas científicas.

**Consequência:** oito grupos de riscos, dez fontes selecionadas e nove marcos compõem a interface. A documentação amplia o contexto e distingue uso operacional, pesquisa e demonstração tecnológica.

## 14. Testar o que pode comprometer o significado do jogo

**Decisão:** priorizar testes de transição, idempotência, restauração, dados ausentes e significado da telemetria.

**Motivo:** um botão visualmente correto pode ainda avançar duas vezes, aceitar uma sessão adulterada ou mostrar normalidade quando falta dado. Esses problemas quebram o objetivo educativo.

**Consequência:** a rodada registrada aprovou 23 testes do motor. Build, navegação, apresentação visual e comportamento em diferentes aparelhos são verificações complementares, sem equivalência com validação médica.

## 15. Crescimento por critérios de saída

**Decisão:** separar a evolução em revisão educativa, estações práticas, dados de pesquisa, instrutor, cenários Lua/Marte, XR e pesquisa com hardware.

**Motivo:** incorporar dados reais, operação de missão ou recomendações clínicas muda o problema de validação e governança. A qualidade visual da beta não resolve essas exigências.

**Consequência:** integrações futuras precisam de finalidade definida, fonte e licença por ativo/dataset, revisão especializada e critérios de aceite. O [roadmap](ROADMAP-E-ARQUITETURA.md) detalha essas etapas.
