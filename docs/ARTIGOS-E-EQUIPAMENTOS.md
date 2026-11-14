# ASTRAL VITAIS - Artigos anexados e evolução dos equipamentos

Pesquisa conferida em 14/11/2026. Idioma: português do Brasil. Este documento fundamenta um simulador educativo; não transforma achados de pesquisa em protocolos clínicos ou em alegação de homologação pela NASA.

## 1. Decisão de produto sustentada pela evidência

O diferencial mais defensável é ensinar a transformar uma medição em uma ação verificável: estabelecer a linha de base antes da missão, registrar o contexto, conferir a qualidade do sinal, cumprir a rotina prevista, comunicar uma alteração e acompanhar a recuperação. Um painel com números que parecem médicos não entrega essa cadeia sozinho.

Os dois artigos enviados pertencem ao programa SOMA. Eles sustentam uma arquitetura longitudinal e a importância da padronização de dados. Não demonstram que um algoritmo consiga diagnosticar astronautas, prever sozinho a segurança de uma missão ou prescrever contramedidas individuais. O artigo da Nature declara essa insuficiência explicitamente em sua discussão, na página 1152. [P1, P2]

No jogo, portanto, o progresso deve representar **procedimentos aprendidos e ações concluídas**, com números sintéticos identificados como tal. Não deve representar uma probabilidade clínica inventada de sobrevivência, doença, câncer ou aptidão para voo.

## 2. Análise do primeiro PDF

**Referência:** Overbey, E. G. et al. *Collection of biospecimens from the inspiration4 mission establishes the standards for the space omics and medical atlas (SOMA)*. Nature Communications 15, 4964, publicado em 11/06/2024. DOI: [10.1038/s41467-024-48806-z](https://doi.org/10.1038/s41467-024-48806-z). [P1]

### O que foi estudado

O trabalho descreve o planejamento, a coleta, o processamento, o transporte e o armazenamento de material biológico e ambiental da missão Inspiration4. A unidade humana de estudo é uma coorte de **quatro participantes**, em uma missão orbital de três dias. Foram produzidas **2.911 alíquotas**. Esse total não equivale a 2.911 pessoas, nem a 2.911 experimentos independentes. [P1, pp. 1-2]

O calendário reportado cobre 289 dias em 2021-2022:

| Etapa | Momentos registrados no artigo | Significado para o software |
|---|---|---|
| Antes do lançamento | L-92, L-44 e L-3 | Uma referência individual é construída em vários momentos; uma medição isolada não representa toda a variação basal. |
| Durante o voo | FD1, FD2 e FD3 | Contexto de missão e momento da coleta precisam acompanhar o resultado. |
| Após o retorno | R+1, R+45, R+82 e R+194 | O acompanhamento continua depois do pouso; retorno à Terra não encerra os efeitos biológicos. |

As amostras incluem sangue venoso, sangue capilar em papel, saliva, urina, fezes, swabs corporais, swabs da cápsula, filtro HEPA e biópsias de pele. Sangue venoso, urina, fezes e biópsias foram coletados em solo; sangue capilar em papel, saliva e swabs de pele também foram coletados durante o voo. Essa diferença importa: não é correto representar todo o conjunto de exames como um fluxo instantâneo disponível a bordo. [P1, pp. 1-2]

### O que o artigo acrescenta

O resultado central é um **processo de coleta e biobanco reprodutível**, com material que pode sustentar exames futuros. O valor de uma coleta depende da maneira como foi identificada, obtida, processada e preservada. A discussão enfatiza que ruído técnico, lote, temperatura e diferenças de protocolo podem ser confundidos com mudanças biológicas. [P1, pp. 8-10]

O artigo também documenta dificuldades reais. Houve, por exemplo, situações em que o processamento não permitiu recuperar plasma de determinados tubos. A existência de um formulário preenchido não significa que exista uma amostra válida. No produto, esse princípio se converte em estados explícitos: coletada, aguardando processamento, inválida, indisponível, analisada e revisada. [P1, pp. 3-4]

Os autores defendem coletas seriadas e o fracionamento em alíquotas para reduzir variáveis pré-analíticas e ciclos de congelamento e descongelamento. Há exigências de preservação específicas para cada amostra. Não se deve simplificar o texto para uma regra única de armazenamento: o próprio protocolo diferencia, por exemplo, sangue em papel, swabs, saliva e material criopreservado. [P1, pp. 9-11]

### Limitações que precisam aparecer no discurso do projeto

1. **Quatro pessoas:** a diversidade de milhares de medições não elimina a pequena amostra de participantes.
2. **Três dias em órbita baixa:** a duração e o ambiente não reproduzem diretamente uma missão de meses a Marte.
3. **Artigo de método:** organizar amostras e permitir ensaios posteriores não prova a eficácia de um tratamento.
4. **Pré-analítica variável:** diferenças de coleta, transporte, processamento e armazenamento podem introduzir artefatos.
5. **Múltiplas variáveis por pessoa:** análises de alta dimensionalidade precisam controlar sobreajuste e descobertas falsas.
6. **Condições diferentes entre solo e voo:** nem todos os materiais são coletáveis com o mesmo método nos dois ambientes. [P1, especialmente pp. 8-10]

### Tradução legítima para uma missão do jogo

**Missão “Amostra confiável”:** o participante encontra dois resultados sintéticos discordantes. Deve conferir identificação, horário, origem, qualidade e condição da coleta antes de decidir que houve uma alteração biológica. A solução correta produz um registro rastreável ou solicita nova medição; não produz um diagnóstico.

**Missão “Minha referência”:** o jogador compara uma medida simulada com várias medidas anteriores do mesmo avatar e vê o contexto de cada uma, como repouso, atividade e fase de missão. O aprendizado é reconhecer tendência e incerteza.

Essas missões são propostas de design derivadas do artigo. Não são atividades validadas pelos autores.

## 3. Análise do segundo PDF

**Referência:** Overbey, E. G. et al. *The Space Omics and Medical Atlas (SOMA) and international astronaut biobank*. Nature 632, 1145-1154. Publicação on-line em 11/06/2024; edição impressa de 29/08/2024. DOI: [10.1038/s41586-024-07639-y](https://doi.org/10.1038/s41586-024-07639-y). [P2]

### O que é o SOMA

SOMA é um atlas e conjunto de recursos para integrar dados clínicos, celulares e multiômicos de diferentes missões e estudos. Inclui informações relacionadas ao NASA Twins Study, ao estudo CFE da JAXA e à Inspiration4, além da incorporação de outras missões. Trabalha com genômica, epigenômica, transcriptômica, proteômica, metabolômica e microbioma. [P2, pp. 1145-1146]

A publicação descreve quase 3.000 amostras, mais de 75 bilhões de moléculas de ácidos nucleicos sequenciadas e aumento superior a dez vezes no volume de dados humanos de ômicas espaciais disponíveis no contexto da publicação. Esses números quantificam volume e abrangência de pesquisa. **Não quantificam validação clínica, diversidade populacional suficiente ou capacidade preditiva de um produto.** [P2, pp. 1145-1146]

A Inspiration4 fornece quatro participantes, com idades de 29, 38, 42 e 51 anos, em voo de três dias a aproximadamente 585 km de altitude. Há medidas e comparações adicionais de outras missões, mas a discussão informa que as comparações com conjuntos da NASA e JAXA abrangem, no máximo, 64 astronautas. Não se deve descrever o artigo como uma única coorte homogênea de 64 pessoas, todas acompanhadas pelo mesmo protocolo. [P2, pp. 1145-1146, 1152]

### Principais resultados e o que significam

| Achado descrito | Interpretação sustentada | Extrapolação que o produto deve evitar |
|---|---|---|
| Alterações em telômeros durante o voo | Respostas moleculares podem aparecer rapidamente, inclusive em missões curtas. | “Telômero longo significa rejuvenescimento” ou “valor X indica aptidão”. |
| Mudanças em citocinas e expressão gênica | Diferentes componentes da resposta imune e de estresse respondem ao ambiente da missão. | Diagnosticar infecção ou prescrever imunomodulação por um marcador isolado. |
| Respostas distintas entre populações celulares | O efeito não é uniforme; agregados podem esconder diferenças entre tipos de células. | Reduzir todas as respostas a um único “nível de saúde espacial”. |
| Perfis de RNA livre circulante e tecidos | Há um caminho de pesquisa para estudar estresse e adaptação em múltiplos sistemas. | Exibir um “scanner integral” validado a partir de um wearable. |
| Grande parte dos marcadores retorna à referência nos meses seguintes | Recuperação é dinâmica e pode ser acompanhada longitudinalmente. | Prometer reversibilidade completa ou recuperação garantida. |
| Alguns sinais aparecem ou persistem na recuperação | O período após a missão merece acompanhamento próprio. | Declarar o astronauta recuperado apenas porque terminou o voo. |

[P2, pp. 1146-1152]

O artigo relata retorno de mais de 95% dos marcadores à linha de base nos meses posteriores, enquanto alguns genes, proteínas e citocinas se ativam apenas na recuperação e persistem por pelo menos três meses. Essa descrição se refere aos marcadores e perfis analisados. Não significa “95% do corpo voltou ao normal”, “95% das pessoas se recuperaram” ou “risco residual de 5%”. [P2, p. 1152]

### A limitação mais importante para o ASTRAL VITAIS

Na página 1152, os autores explicam que diferenças entre ensaios, protocolos, intervalos de coleta e tecnologias de sequenciamento limitam comparações entre missões. Declaram que os dados ainda não são suficientes para orientar intervenções médicas ou inferir mecanismos, e os caracterizam como mapas moleculares preliminares. A pequena coorte volta a ser destacada na página seguinte. [P2, pp. 1152-1153]

Por isso, SOMA deve entrar no produto como **base de estudo e contextualização científica**, e não como motor clínico. Um módulo futuro de análise de dados reais exigiria selecionar o estudo e o desfecho, respeitar consentimento e acesso, definir população e critérios, controlar efeito de lote, validar externamente e obter revisão científica independente.

### Uma implicação prática que vale explorar

Uma missão não termina no pouso. A sequência do jogo pode incluir preparação, voo, retorno e acompanhamento. O avatar continua aprendendo a registrar sintomas, completar avaliações programadas e comparar dados de recuperação. O valor pedagógico vem de entender que uma trajetória longitudinal é mais informativa do que um indicador isolado.

## 4. Evolução dos equipamentos: marcos conferidos

**Atenção à categoria:** instrumentos de medição, ferramentas diagnósticas, equipamentos de exercício e plataformas de pesquisa cumprem funções diferentes. Um aparelho de exercício não é um sensor clínico; um sequenciador não é um diagnóstico automático; uma tecnologia enviada à ISS pode ainda estar em demonstração.

| Período | Equipamento ou marco | Evolução principal | Status sustentado pela fonte | Fonte |
|---|---|---|---|---|
| 1961-1963 | Biotelemetria Mercury | ECG, respiração e temperatura sustentavam observação fisiológica à distância; sistemas foram modificados ao longo das missões. | Uso histórico em voo; documentação do programa. | [E1, E2] |
| 2000 | TVIS, esteira com isolamento de vibração | Exercício em microgravidade precisava considerar também as vibrações transmitidas à estação. | Marco histórico na linha do tempo técnica. | [E3] |
| 2001 | CEVIS e iRED | Ergômetro para exercício aeróbico e equipamento de resistência ampliaram contramedidas sistemáticas. | Equipamentos utilizados na ISS; CEVIS posteriormente atualizado. | [E3, E4] |
| 2008 | ARED | Pistões e volante de inércia permitem cargas de exercício resistido em microgravidade. | Instalado na ISS em 2008; adoção/calibração registradas em 2009-2010 na linha do tempo técnica. | [E3, E4] |
| 2009 | T2/COLBERT | Segunda geração de esteira da ISS, integrante do conjunto de exercício com ARED e CEVIS. | Entrega em agosto de 2009 na linha do tempo técnica. | [E3, E4] |
| 08/07/2011 | Ultrasound-2 | Ultrassom comercial adaptado para voo, com interfaces específicas, para investigações e acompanhamento médico. | Lançado na STS-135; substituiu o equipamento anterior. | [E5] |
| 2016-2018 | MinION, miniPCR e métodos de sequenciamento a bordo | Sequenciamento em órbita, identificação microbiana e evolução para processamento a partir de swab. | Demonstrações e pesquisas realizadas na ISS; não equivalem a triagem clínica universal. | [E6] |
| Dezembro de 2018 | Bio-Monitor | Camiseta, faixa e aplicativo integram medidas fisiológicas ao cotidiano, inclusive sono e exercício. | Tecnologia enviada à ISS e utilizada para monitoramento/pesquisa. | [E7] |
| Abril-maio de 2019 | Bio-Analyzer | Análise de pequenas amostras de fluidos a bordo, reduzindo dependência de retorno de material à Terra. | Enviado em abril e testado em maio de 2019; os objetivos são de avaliação biomédica a bordo. | [E8] |
| 2022; resultados publicados em 2024 | HERA, Crew Active Dosimeter, EAD e MARE na Artemis I | Dosimetria do ambiente, dosimetria pessoal e manequins instrumentados permitem estudar exposição por região e condição de voo. | Medições em missão lunar sem tripulação; resultados não generalizam automaticamente para todos os trajetos e eventos solares. | [E9, E10] |
| 2023 | Atualização do CEVIS | Mantém exercício aeróbico com carga e parâmetros monitorados em equipamento renovado. | Atualização confirmada pela NASA. | [E4] |
| 2024 | Publicação do SOMA | Dados clínicos e multiômicos, amostras preservadas e metadados de diferentes estudos passam a integrar um recurso de pesquisa. | Atlas/biobanco de pesquisa; não é um aparelho nem um sistema clínico aprovado. | [P1, P2] |
| Julho de 2026 | E4D | Um dispositivo compacto combina resistência, bicicleta, remo e puxada de corda. | Demonstração tecnológica na ISS, com avaliação prevista por dois anos; não descrever como eficácia definitiva estabelecida. | [E11, E12] |

### O que muda entre as gerações

**Da medição isolada ao contexto contínuo.** A instrumentação Mercury precisava permitir avaliação humana remota apesar das limitações de sensores e comunicação. O Bio-Monitor ilustra a integração da medição à rotina. No software, isso pede contexto de atividade, qualidade e disponibilidade de sinal, e não apenas uma animação de frequência cardíaca. [E1, E7]

**Do exame devolvido à Terra ao processamento a bordo.** Ultrassom, sequenciamento compacto e Bio-Analyzer representam capacidades distintas de avaliar o corpo ou o ambiente no local. A aplicação deve explicar qual dado vem de cada instrumento, quanto processamento ele requer e se há interpretação profissional. O objetivo informado para o Bio-Analyzer era obter resultados em duas a três horas; isso não é um fluxo de telemetria contínuo nem garantia de resultado clínico imediato. [E5, E6, E8]

**De equipamentos separados a plataformas compactas.** ARED, T2 e CEVIS formam uma combinação de exercício. E4D investiga uma solução integrada. Para o jogo, isso permite trabalhar disponibilidade de equipamento, tempo da tripulação, registro de execução e manutenção. A qualidade da sessão não deve ser reduzida a “quanto mais, melhor”. A prescrição da missão e a supervisão profissional permanecem externas ao jogo. [E3, E4, E11]

**De exposição genérica a dosimetria contextual.** Os instrumentos da Artemis I mostram que posição, blindagem e orientação da nave influenciam a leitura. A mecânica educativa pode exigir conferir a fonte do alerta e executar o protocolo de abrigo do cenário. Hidratar-se, dormir ou se exercitar não reduz retrospectivamente a dose acumulada; a simulação nunca deve fazer esse número cair após uma ação. [E9, E10]

## 5. Tradução para ações jogáveis

As ações abaixo são propostas de design fundamentadas na pesquisa, não procedimentos oficiais de missão.

| Estação do cenário | Ação verificável do jogador | Feedback útil | Regra de integridade |
|---|---|---|---|
| Preparação | Completar a conferência da referência individual e do plano da missão | Mostrar o que falta e por que essa informação é usada | Não simular aprovação médica automática. |
| Monitoramento | Conferir identificação, contato do sensor, atividade e qualidade do sinal | Diferenciar dado confiável, degradado e ausente | Dado ausente nunca vira “normal”. |
| Exercício | Conferir equipamento, selecionar sessão previamente definida e registrar execução | Mostrar adesão ao procedimento e possíveis interrupções | Evitar recomendar volume/carga real ao usuário. |
| Laboratório | Associar amostra sintética, horário, método e resultado | Explicar cadeia de qualidade e origem do resultado | Não exibir omics como medição instantânea do wearable. |
| Radiação | Conferir alerta, buscar abrigo designado e registrar evento | Mostrar redução de exposição futura no cenário | Dose acumulada não regride. |
| Comunicação | Preparar mensagem com contexto e dados relevantes | Diferenciar enviado, aguardando e recebido | Não inventar retorno imediato da Terra. |
| Recuperação | Completar acompanhamento após o pouso | Comparar trajetória sem prometer normalização | Uma alta visual do game não equivale a alta clínica. |

É preferível que os eventos críticos avaliem ordem, completude e justificativa da ação. Um jogador não deve ganhar por ignorar sintoma, ocultar dado ruim ou priorizar pontuação sobre comunicação. O debriefing pode registrar: sinal percebido, qualidade conferida, ação tomada, tempo simulado e fonte consultada.

## 6. Dados e arquitetura: recomendações derivadas dos artigos

Um registro observacional deve distinguir pelo menos:

- Identidade sintética do participante e identificação da missão.
- Momento da observação e momento de chegada ao sistema.
- Etapa da missão e contexto de atividade.
- Grandeza, unidade, método e instrumento.
- Qualidade, motivo de ausência e estado de revisão.
- Referência individual utilizada na comparação.
- Fonte científica e versão da regra educativa.
- Origem explícita: `synthetic`, `research` ou, em uma futura integração validada, `device`.

Esses campos são uma recomendação de engenharia do ASTRAL VITAIS, inferida das necessidades de comparabilidade e rastreabilidade descritas nos artigos. Não são apresentados como uma especificação de interoperabilidade promulgada pela NASA.

Para uma evolução real, o consentimento deve cobrir o uso pretendido dos dados e o acesso precisa ser definido por função. Dados ômicos têm sensibilidade e potencial identificador. Publicação científica aberta não implica autorização irrestrita para combinar identidades, redistribuir todos os dados brutos ou produzir inferências médicas individuais. O primeiro artigo registra aprovação ética e consentimento; o segundo distingue conjuntos públicos e acesso controlado. [P1, p. 11; P2, seção de disponibilidade]

## 7. Fontes, licenças e material visual

Os PDFs foram lidos localmente e suas páginas de identificação/discussão foram renderizadas para conferência visual. Não foi necessário copiar figuras dos artigos para fundamentar o jogo.

O artigo P1 informa que algumas figuras foram produzidas com BioRender e disponibilizadas sob **CC BY-NC-ND 4.0**; não se deve presumir que a licença geral do artigo permita modificá-las ou usá-las comercialmente. O artigo P2 é CC BY 4.0, com a ressalva de créditos específicos de terceiros. A opção mais simples para o produto é criar representações próprias e citar os artigos, preservando as licenças de qualquer asset efetivamente incorporado. [P1, p. 12; P2, p. 1153]

O vídeo da ESA sobre ativação do E4D contém material de terceiros e restrições próprias. Ele pode ser referenciado por link; não foi extraído nem incorporado como asset. [E12]

## 8. Referências verificadas

### Artigos enviados pelo usuário

- **P1.** Overbey et al., Nature Communications 15, 4964 (2024). [Página do artigo](https://www.nature.com/articles/s41467-024-48806-z). DOI: 10.1038/s41467-024-48806-z. Fonte local analisada: `s41467-024-48806-z.pdf`.
- **P2.** Overbey et al., Nature 632, 1145-1154 (2024). [DOI](https://doi.org/10.1038/s41586-024-07639-y). [Texto integral no PubMed Central](https://pmc.ncbi.nlm.nih.gov/articles/PMC11357981/). Fonte local analisada: `s41586-024-07639-y(1).pdf`.

### Fontes primárias para equipamentos e marcos

- **E1.** NASA, *The Human Factor: Biomedicine in the Manned Space Program to 1980*, NASA SP-4213, especialmente p. 55. [PDF oficial](https://www.nasa.gov/wp-content/uploads/2023/03/sp-4213.pdf).
- **E2.** NASA, *First U.S. manned six-pass orbital mission (Mercury-Atlas 8, spacecraft 16): description and performance analysis*, seção Biosensor System. [Documento NTRS](https://ntrs.nasa.gov/api/citations/19680025550/downloads/19680025550.pdf).
- **E3.** Twine, C.; Anderson, D. *Interdisciplinary Approach: Spaceflight Human Optimization and Performance*, apresentação à Defense Health Agency em 25/09/2025, arquivada no NASA NTRS. Cronologia dos equipamentos de exercício na página 8. A apresentação contém a ressalva de que opiniões são dos autores; não é um padrão normativo da NASA. [Registro bibliográfico](https://ntrs.nasa.gov/citations/20250008476). [Documento 20250008476](https://ntrs.nasa.gov/api/citations/20250008476/downloads/DHA-CE-PowerPoint%20Final%208-16.pdf).
- **E4.** NASA, Melissa L. Gaskill, *Astronaut Exercise*, 20/05/2024. [Página oficial](https://www.nasa.gov/general/astronaut-exercise/).
- **E5.** NASA Ames, *Ultrasound-2 (STS-135)*. [Página oficial](https://www.nasa.gov/ames/space-biosciences/ultrasound-2-sts-135/).
- **E6.** NASA, *DNA Sequencing in Space Timeline*, publicado em 23/07/2022 e atualizado em 19/05/2025. [Página oficial](https://www.nasa.gov/missions/station/iss-research/dna-sequencing-in-space-timeline/).
- **E7.** Canadian Space Agency, *Bio-Monitor: Keeping an eye on astronauts' vital signs*. [Página oficial](https://www.asc-csa.gc.ca/eng/sciences/bio-monitor.asp).
- **E8.** Canadian Space Agency, *Bio-Analyzer: Biomedical results from space to Earth*, modificado em 05/10/2026. [Página oficial](https://www.asc-csa.gc.ca/eng/iss/bio-analyzer.asp).
- **E9.** NASA, *Artemis I Radiation Measurements Validate Orion Safety for Astronauts*, 09/10/2024. [Página oficial](https://www.nasa.gov/missions/artemis/artemis-1/artemis-i-radiation-measurements-validate-orion-safety-for-astronauts/).
- **E10.** George et al., *Space radiation measurements during the Artemis I lunar mission*, Nature (2024). [DOI](https://doi.org/10.1038/s41586-024-07927-7). [Texto integral](https://pmc.ncbi.nlm.nih.gov/articles/PMC11446838/).
- **E11.** ESA, *New European exercise device begins testing with first rope-pulling workout in space*, 08/07/2026. [Página oficial](https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/New_European_exercise_device_begins_testing_with_first_rope-pulling_workout_in_space).
- **E12.** ESA, *Checkout and activation of E4D*, 07/07/2026. [Página oficial](https://www.esa.int/ESA_Multimedia/Videos/2026/07/Checkout_and_activation_of_E4D).

## 9. Limites de verificação desta pesquisa

Foram conferidos os PDFs fornecidos e páginas oficiais das agências, além do artigo primário de dosimetria. Datas de publicação e atualização não foram confundidas com a data do acontecimento. O marco de 2026 do E4D foi confirmado em publicação contemporânea da ESA, não inferido de uma notícia anterior de lançamento previsto.

Não foram conectados dispositivos reais, processadas amostras de astronautas, validados algoritmos médicos ou demonstrada eficácia clínica. Qualquer aparição de sensores, resultados e decisões no MVP é parte de uma simulação educativa.
