# Validação do beta ASTRAL VITAIS

Data: 14/11/2026. Versão: 0.1.0-beta.1.

## Evidência executada

| Verificação | Resultado observado |
|---|---|
| TypeScript estrito + build Vite | Aprovado; pacote estático gerado |
| Testes Vitest do domínio | 23 testes passaram, 1 arquivo |
| Início e seleção de procedimento | Botão de execução habilitado após escolha |
| Feedback de uma decisão recomendada | Explicação e links primários visíveis |
| Retomada | Recarregar após avançar preservou o segundo desafio e o progresso |
| Pré-voo → órbita | Contexto e valores ambientais mudaram de fase |
| Resposta inadequada à radiação | Aviso solar continuou ativo após a resposta |
| Falha de sensor | Pulso identificado como antigo; SpO₂ ocultada com “sem leitura” |
| Procedimento de verificação | SpO₂ voltou a sinal válido no cenário |
| Percurso completo | 9 decisões concluídas; 8 recomendadas + 1 inadequada resultaram em 89/100 educativos |
| Exportação JSON | Evento de download observado e confirmação na interface |
| Ciência | Navegação entre riscos, 4 cartões normativos e 10 fontes presentes |
| Tecnologia | 9 marcos de equipamentos presentes |
| Reiniciar | Diálogo confirmou a intenção; missão voltou ao início e tempo zerou |
| Layout em 1363 × 936 | Inspecionado; sem rolagem horizontal |
| Página publicada no Chrome conectado | Terra, atmosfera, órbita e astronauta renderizados em Three.js |
| Câmeras da cena 3D | Modos Órbita e Tripulante responderam à interação |
| Layout publicado em 1512 × 749 | Inspecionado; largura do documento igual à largura disponível, sem rolagem horizontal |

## Prova gráfica e alternativa sem WebGL

O navegador de teste inicial informou `GL_RENDERER = Disabled` e recusou a criação de contexto WebGL. A visualização alternativa foi acionada e o percurso educativo permaneceu funcional. Essa execução **não comprova a renderização Three.js em GPU**. O código de cena passou na checagem de tipos e no build.

Nenhum parâmetro de segurança do navegador foi alterado para contornar a limitação.

Em uma segunda verificação, a página publicada em https://astral-vitais.alexandrebelo.chatgpt.site foi aberta no Chrome conectado, com WebGL disponível. Foram observados o planeta, a atmosfera, a órbita e o astronauta, além da mudança de enquadramento para o modo Tripulante e do retorno ao modo Órbita. Essa execução comprova a renderização 3D nesse navegador; não comprova desempenho ou compatibilidade em todos os dispositivos.

## Revisão científica independente

A revisão confrontou os cenários e a interface com NASA-STD-3001 Vol. 1 C, Vol. 2 F, Human Research Roadmap e os dois artigos SOMA fornecidos. Foram corrigidos:

- “Radiação” passou a taxa de dose em µSv/h, sem alegação de dose acumulada.
- O contexto da cabine e da radiação passou a distinguir pré-voo, órbita e retorno.
- Sono passou a registro histórico com horário fixo.
- CO₂ instantâneo não recebe badge de conformidade com média normativa de uma hora.
- A resposta inadequada não desliga o aviso solar no respectivo cenário.
- A referência de sono aponta ao Volume 1, §6.1, que distingue rationale de requisito.

Essa revisão de conteúdo não é validação médica, aprovação da NASA ou autorização de uso clínico.

## Limites de escopo

- Não foram conectados dispositivos, APIs de missão, pacientes ou dados pessoais.
- Não foram executados ensaio clínico, auditoria formal WCAG, teste com astronautas ou revisão por médico aeroespacial.
- Não foi realizada uma rodada de validação em aparelhos móveis físicos.
- Não há instalação offline por service worker. O build pode ser servido localmente sem ativos remotos; a primeira instalação das dependências do código-fonte requer acesso ao registro npm.
- A CI foi configurada no repositório. O resultado da execução remota deve ser consultado em Actions; a existência do arquivo de workflow não equivale a aprovação remota.
