# Dossiê ASTRAL VITAIS — o que a NASA realmente liberou para o desafio de 2026
### "Create Health Monitoring Software for Astronauts on Space Missions" · NASA Space Apps Challenge 2026
**Coleta e verificação: 14/11/2026** · fontes primárias consultadas ao vivo (API OSDR, API DONKI, Europe PMC, DLR eLibrary, NASA HRP, CSA) · todos os DOIs e endpoints foram testados nesta data.

> **Como ler este documento.** Ele não é um resumo do que já está na página do desafio. É um dossiê de inteligência para a avaliação: o que existe de dado real, o que é literatura de 2026, onde estão os buracos, quais números usar na interface e como transformar isso em arquitetura defensável. Onde um número é estimativa ou não foi possível confirmar na fonte primária, está marcado como **[não verificado]** ou **[ordem de grandeza]**.

### 0.1 Onde este documento se encaixa no repositório

Este dossiê é **complementar** a [`CIENCIA-NASA.md`](../CIENCIA-NASA.md) e a [`NASA-EVIDENCE.json`](../NASA-EVIDENCE.json). Não substitui, não revisa e não reclassifica os requisitos já citados lá (S01–S30, V1 4030, V2 6004). Ele acrescenta três coisas que o repositório ainda não tinha:

1. **Dados abertos com receita de acesso** — OSDR (API REST; 10 estudos verificados em 14/11/2026), DONKI (clima espacial ao vivo) e Artemis I/MARE.
2. **Literatura de 2024–2026** que fecha lacunas numéricas: SANS em 81%, 1,18 mSv/dia na Orion, −60,7% com AstroRad, CO₂ nominal de 3 mmHg, sono de 6,09 h.
3. **Um modelo executável** das três simulações prioritárias, com *lead time* mensurável, pronto para virar lógica de domínio.

| Achado deste dossiê | Base já existente no repositório | O que acrescenta |
|---|---|---|
| Cinco perigos e riscos | S01, S02, §2 de CIENCIA-NASA.md | confirma a taxonomia |
| Carreira de 600 mSv | V1 4030 / S24 | dose real medida (1,18 mSv/dia) para comparar com o requisito de 1,3 mSv/dia (V1 4033) |
| CO₂ ≤ 3 mmHg (média de 1 h) | V2 6004 / S25 | valor nominal e limiar de cefaleia (2–5 mmHg) |
| SANS | S09 | prevalência de 81% em consenso de 2026 |
| Trombose venosa | S17 | 3º caso documentado e sinal de pulso jugular (2026) |
| Sono e fadiga | S08 | 6,09 h obtidas e 52% das noites com hipnótico |
| Radiação | S05 | dose medida, cenário de SPE e eficácia do colete |
| Dados abertos | — | endpoints OSDR/DONKI testados e amostra real baixada |

**Vocabulário:** `P01…P20` são as fontes desta pesquisa (Anexo D); `S01…S30` são as fontes já citadas em `CIENCIA-NASA.md`. Onde os dois se sobrepõem, o texto aponta a referência do repositório.

---

## 0. Sumário executivo — os 12 achados que mudam o projeto

1. **O desafio de 2026 tem apenas 5 recursos oficiais, e 2 são da Agência Espacial Canadense (CSA).** São eles: *5 Hazards of Human Spaceflight*, *Risks of Human Spaceflight*, *Ongoing HRP Research in Space* (NASA) e *Monitoring Radiation for Astronaut Health* + *Why Do We Conduct Science Experiments in Space?* (CSA). Ou seja: **radiação deixou de ser tema periférico e virou recurso oficial do desafio** — citar a CSA e o componente de nêutrons é diferenciação barata e visível.
2. **O texto oficial pede explicitamente seis indicadores** — pressão arterial, frequência cardíaca, glicemia, temperatura corporal, horas de sono e humor — e diz que *qualquer* entrada serve (teclado, mouse, câmera). Seu recorte de 5 vitais (FC, SpO₂, FR, Tcut, radiação) é tecnicamente mais forte que o pedido, mas **precisa cobrir os seis citados** para não perder ponto em "relevância". Solução: os 5 vitais + glicemia e sono/humor como módulos satélites.
3. **Existe dado humano real, aberto e baixável da missão Inspiration4 no OSDR**, com API REST e tabelas já "transformadas" para machine learning. Baixamos e conferimos: o painel metabólico (OSD-575) tem 4 tripulantes × 7 pontos temporais (L-92, L-44, L-3, R+1, R+45, R+82, R+194) com glicose, sódio, potássio, cálcio, creatinina, ALT etc.
4. **O dado real tem anomalias — e isso é um argumento de venda.** No OSD-575 há glicemias de **36 e 44 mg/dL** em R+45, fisiologicamente implausíveis para tripulantes assintomáticos. Um software que **detecta artefato antes de alarmar** é mais crível que um que pinta tudo de vermelho. Coloque isso na demo.
5. **A dose de radiação medida dentro da Orion na Artemis I foi de 1,18 ± 0,03 mSv/dia** (GCR, 0,379 mGy/dia × fator de qualidade 3,1). Com o limite de carreira de **600 mSv** (NASA-STD-3001 Rev. C, REID < 3%), isso dá **≈ 508 dias** de exposição contínua só de GCR antes de esgotar a carreira — número perfeito para a projeção acumulada do seu módulo radiológico.
6. **Um único evento solar tipo agosto/1972 equivaleria a 34–37% do limite de carreira** (222 mSv); com o colete AstroRad cai para ~87,5 mSv (−60,7%). Em evento tipo outubro/1989: 233,5 → 143,6 mSv (−38,5%). Isso justifica, com número, o botão "entrar no abrigo / vestir proteção" do seu alerta.
7. **O SANS é o "matador" clínico de 2026:** o consenso de especialistas publicado em 2026 reporta **pelo menos uma alteração de SANS em 81% dos astronautas da NASA**. Nenhum dos seus 5 vitais detecta SANS — mas um módulo ocular (autoexame guiado + sintomas + histórico) resolve, e nenhum concorrente vai ter isso.
8. **Anemia espacial muda a leitura do SpO₂:** a hemólise aumenta ~54% e o corpo destrói ~3 milhões de hemácias/s em voo. SpO₂ de 97% com hemoglobina baixa ≠ oxigenação adequada. Se o seu alerta de hipóxia ignora capacidade de transporte de O₂, ele é fisiologicamente ingênuo.
9. **O ambiente explica sintomas que parecem do astronauta:** CO₂ nominal na ISS é ~3 mmHg (±0,8), e o limiar de cefaleia fica entre 2 e 5 mmHg. Ou seja, **3 mmHg ≈ 4.000 ppm** — 4 a 10× uma casa terrestre. Cefaleia + FR alta + FC alta pode ser ambiente, não doença. Contexto ambiental no alerta = sofisticação.
10. **Sono é o vetor mais bem quantificado de todos:** 6,09 h de sono obtido na ISS (vs. 6,95 h na primeira semana pós-voo) e **52% das noites com fármaco hipnótico** em tripulações de ônibus espaciais. Isso alimenta o "risco composto" do seu modelo: débito de sono → FC/HRV → cognição.
11. **2026 é o ano em que o voo lunar voltou a gerar dados humanos:** Artemis II voou em abril/2026 com quatro astronautas; o DLR apresentou dados preliminares de dosímetros M-42 EXT na WRMISS (setembro/2026) e a avaliação do MARE segue em publicação. Um app desenhado para "qualquer ambiente" (nave, estação, rover, base) capitaliza essa narrativa.
12. **A regra de ouro da honestidade de dados é vantagem competitiva:** o OSDR é pré/pós-voo, discreto, n=4, e não tem telemetria contínua. A avaliação sabe disso. Declarar na interface o que é **REAL (OSDR/DONKI/NASA-STD)**, o que é **DERIVADO** e o que é **SINTÉTICO (simulação fisiológica)** — com selo visual por card — transforma a maior fraqueza do projeto no item mais maduro dele.

---

## 1. O que o desafio pede, em texto oficial (e o que isso implica)

### 1.1 Resumo oficial (tradução fiel)

> "Missões de longa duração expõem astronautas à radiação espacial, isolamento e confinamento, gravidade alterada e um ambiente fechado hostil, o que pode trazer alterações imunológicas, perda óssea, eventos cardiovasculares e problemas de saúde comportamental. Em missões longas, os astronautas carregam boa parte da responsabilidade de perceber essas mudanças neles mesmos. Seu desafio é construir um software de monitoramento de saúde que reúne indicadores de saúde e permite aos astronautas avaliar e agir sobre o estado da própria saúde."

### 1.2 Objetivos literais

- Criar uma **ferramenta visual** que ajude o astronauta a **autoavaliar** a saúde e que **dê orientação** sobre tratamentos e melhorias.
- Coletar dados por **qualquer entrada** — teclado, cliques, imagens de câmera. "Qualquer tipo de dado pode ser usado, desde que represente um indicador de saúde, como glicemia em mg/dL ou imagens de ultrassom."
- Responder: **quais medições podem ser feitas no espaço? Por que o exame é necessário? Como os perigos do voo afetam esse indicador? Quando o resultado merece atenção da tripulação ou dos cirurgiões de voo em solo? Que ações podem ser tomadas para prevenir uma condição crítica?**
- **Design de interface importa**: "você pode considerar usar animações e interatividade… por exemplo, exibir uma figura humana onde cada parte do corpo é clicável e mostra informação sobre função e estado de saúde."

### 1.3 Considerações potenciais (não obrigatórias, mas são a rubrica disfarçada)

1. Insights para **ambientes diferentes**: nave, estação, rover, base em outro planeta/lua.
2. **Prompts proativos**: o app pede medições e ações como parte da rotina da missão.
3. Recursos: **gamificação**, **gráficos dinâmicos** de evolução, **código de cores** para leitura em um relance.
4. **Nunca assumir que o astronauta sabe avaliar a própria saúde** — instruções simples, medição passo a passo, explicação de risco.

### 1.4 Os 5 recursos oficiais (verificados)

| # | Recurso | Agência | URL |
|---|---|---|---|
| 1 | 5 Hazards of Human Spaceflight | NASA HRP | https://www.nasa.gov/hrp/hazards/ |
| 2 | Risks of Human Spaceflight | NASA HRP | https://www.nasa.gov/hrp/risks/ |
| 3 | Ongoing HRP Research in Space | NASA HRP | https://www.nasa.gov/hrp/ongoing-hrp-research/ |
| 4 | Monitoring Radiation for Astronaut Health (26/02/2026) | CSA | https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp |
| 5 | Why Do We Conduct Science Experiments in Space? | CSA | https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp |

**Implicação estratégica:** o recurso nº 4 é uma notícia de fevereiro de 2026 sobre o **CANS (Canadian Active Neutron Spectrometer)**, com contrato de **C$ 5,5 milhões** à Bubble Technology Industries, e afirma que **nêutrons respondem por ~30% da dose total na ISS**. Um app que trata radiação como "um número em µSv/h" ignora que a dose tem **componentes** (GCR, prótons de SPE, nêutrons secundários) e **qualidade** (fator de qualidade). Citar isso em 15 segundos de pitch derruba a objeção "vocês só fizeram um mostrador".

### 1.5 Critérios de julgamento (como a avaliação decide)

A organização global avalia **inovação, viabilidade e relevância** (critérios divulgados para a edição de 2026), além de impacto e clareza de apresentação. Traduzindo para o que você deve mostrar em tela:

| Critério | O que o avaliador procura | Onde provar no ASTRAL VITAIS |
|---|---|---|
| Inovação | Algo que não é dashboard genérico | Predição com tempo-até-limiar, fusão ambiente+biometria, módulo SANS, decisão de colete/shelter |
| Viabilidade | Dá para construir e operar | Stack simples, offline-first, dados reais citados, limites declarados |
| Relevância | Responde ao desafio | 6 indicadores cobertos, 5 hazards mapeados, guias para não especialistas |
| Impacto | Muda o desfecho | Autonomia médica em Marte (latência), triagem, escalonamento correto |
| Apresentação | Clareza | Figura humana clicável, cores acessíveis, storytelling de 3 minutos |

---

## 2. Por que este desafio é *o* desafio de 2026

1. **Artemis II voou em abril de 2026** com quatro astronautas ao redor da Lua — o primeiro voo tripulado além da órbita baixa desde Apollo. O próprio texto do desafio cita "um sobrevoo lunar tripulado" como fato recente. O tema "monitorar a saúde longe da Terra" deixou de ser ficção científica de 2040.
2. **Dados preliminares de radiação da Artemis II foram apresentados em setembro de 2026** (DLR, 29ª WRMISS, Praga): quatro detectores **M-42 EXT** em posições distintas da Orion, comparados com a Artemis I. A missão MARE (phantoms Helga e Zohar, milhares de detectores passivos e 34 ativos) continua sendo avaliada.
3. **O consenso de SANS saiu em 2026** (Eye/Nature): 81% dos astronautas da NASA com ao menos uma característica. É o risco que mais assusta flight surgeons porque é **silencioso** e **não tem contramedida estabelecida**.
4. **A revisão "Astroimmunology" saiu em 2026** (Nature Reviews Immunology): integra microgravidade, GCR, estresse psicológico, ritmo circadiano e microbioma — e aponta **monitoramento com machine learning** como contramedida emergente. Isso é literalmente o seu projeto, citado por uma review da Nature.
5. **Primeira radiografia em órbita** (missão Fram2, 2025) mostra a tendência: diagnóstico por imagem a bordo. Seu roadmap deve prever "câmera como sensor" — o desafio já sugere isso.
6. **A CSA reforçou dosimetria de nêutrons em 2026** com o CANS, autônomo e contínuo — o oposto dos dosímetros passivos de leitura posterior. A narrativa "de dosimetria passiva para monitoramento ativo" é uma aula de 30 segundos.

---

## 3. Mapa de dados: o que existe, onde está e para que serve

| Fonte | O que é | Formato / acesso | Latência | Uso no ASTRAL VITAIS | Licença/nota |
|---|---|---|---|---|---|
| **OSDR** (Open Science Data Repository) | Estudos humanos e biológicos de voo (Inspiration4, Twins, JAXA, camundongos) | REST JSON + CSV/TSV; tabelas "ALSDA transformed" prontas para ML | Publicação (dias–anos) | Baseline individual real, ranges laboratoriais, módulo metabólico | Aberto; citar accession (OSD-xxx) |
| **NLSP** (NASA Life Sciences Portal) | Estudos de bedrest (UTMB), análogos, dados históricos | Portal/consulta; parte requer solicitação | Variável | Modelos de decondicionamento, parâmetros de simulação | Verificar termos por estudo |
| **DONKI** (CCMC/NASA) | Clima espacial: SEP, FLR, CME, notificações | JSON REST | **Minutos** | Alerta radiológico e contexto ambiental | `api_key` (DEMO_KEY para teste) |
| **Artemis I MARE / AstroRad** | Dosimetria real em phantom no espaço profundo | Publicação científica (Nature 2024; Sci Adv 2026) | Publicado | Taxa de dose, projeção, eficácia do colete | Citar DOI |
| **NASA-STD-3001 Vol. 1 Rev. C** | Padrão humano de voo (limites de saúde) | PDF público | — | Limite de carreira 600 mSv; requisitos | Documento normativo |
| **HRP Risk Records / Evidence** | Riscos, evidências e lacunas por hazard | PDFs públicos | — | Textos de "por que monitorar" e matriz de risco | Citar HRP |
| **CSA CANS / Radi-N2 / EVARM** | Dosimetria de nêutrons e prótons | Notícias e artigos técnicos | — | Componente de nêutrons (30% da dose) | Citar CSA |
| **Bio-Monitor (CSA)** | Camiseta com sensores vitais usada na ISS | Descrição pública | — | Prova de que os 5 vitais já são medidos em voo | Ver página CSA |

**O que NÃO existe (e você deve dizer em voz alta):** não há dataset público de telemetria contínua de astronautas (FC, SpO₂, PA segundo a segundo) por razões de privacidade médica e de segurança operacional. Qualquer projeto que diga "usamos dados reais de smartwatch de astronautas" está blefando. O caminho honesto — e mais forte — é: **dados reais esparsos (OSDR) + ambiente real (DONKI) + fisiologia simulada com parâmetros publicados**.

---

## 4. OSDR: o ouro real, com IDs verificados

### 4.1 A suíte Inspiration4 (verificada via API em 14/11/2026)

Missão: **SpaceX Inspiration4**, 16–18/09/2021, 4 tripulantes, ~3 dias em órbita. Todos os estudos abaixo foram abertos em 14/05/2024 (release público).

| Accession | Título | Material | Tecnologia | Uso direto no app |
|---|---|---|---|---|
| **OSD-569** | Whole Blood Measurements (RNA-seq, epitranscriptome, WGS, clonal hematopoiesis, **CBC**) | Sangue total / pellet de hemácias | Hematology Analyzer, RNA-seq, long-read | Hemograma: anemia, imunidade, trombose |
| **OSD-570** | PBMC Profiling: snRNA-seq, snATAC-seq, TCR/BCR repertoire | PBMC | Sequenciamento | Resposta imune célula a célula |
| **OSD-571** | Plasma Profiling: proteômica, EVPs, metabolômica, cfDNA, cfRNA | Plasma | Multi-ômica | Biomarcadores circulantes, lesão tecidual |
| **OSD-572** | Oral, Nasal and Skin Metagenomic/Metatranscriptomic Swabs | Swab | WGS, RNA-seq | Microbioma de superfície, risco infeccioso |
| **OSD-573** | Dragon Capsule Metagenomic/Metatranscriptomic Swabs | Swab (cápsula) | WGS, RNA-seq | Saúde do habitat |
| **OSD-574** | Deltoid Skin and Microbiome: Spatial Transcriptomics (GeoMx) | Biópsia de pele + swab | Spatial transcriptomics | Pele, cicatrização, microbioma |
| **OSD-575** | Blood Serum Metabolic Panel + Immune/Cardiac Cytokine Arrays (CMP + multiplex) | Soro | Química clínica, multiplex | **Glicose, eletrólitos, rim, fígado, citocinas cardíacas** |
| **OSD-630** | Stool Metagenome Profiling | Fezes | WGS | Eixo intestino-cérebro, inflamação |
| **OSD-656** | Urine Inflammation Panel (Multiplex, NULISAseq) | Urina | Multiplex | **203 proteínas inflamatórias** — exame não invasivo |

Estudos complementares úteis: **OSD-53** (expressão gênica em sangue de 6 astronautas, microarray, 2013) para a narrativa "por que o biomarcador muda"; e a série de camundongos (ex.: OSD-568 ocular, OSD-576 músculo) para mecanismos.

### 4.2 Como puxar (endpoints testados)

```bash
# Metadados do estudo (JSON)
curl -s "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/OSD-575/"

# Lista de arquivos + metadados de cada arquivo
curl -s "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/OSD-575/files/"

# Download do arquivo real (a rota /file/<nome>/ devolve metadados; o binário vem do geode-py)
curl -L "https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?source=datamanager&file=LSDS-8_Comprehensive_Metabolic_Panel_CMP_TRANSFORMED.csv"
```

**Detalhe que quase todo mundo erra:** `.../file/<nome>/` retorna JSON de metadados, **não** o CSV. O binário está no endpoint `geode-py/.../download?file=`. Se o seu backend usar a rota errada, o app "baixa" 866 bytes de metadata e o gráfico fica vazio. Isso está implementado corretamente em `docs/pesquisa-2026/scripts/coletar_dados_nasa.py`.

### 4.3 O dado real, na mesa (OSD-575, CMP)

4 tripulantes (C001–C004) × 7 coletas: L-92, L-44, L-3 (pré-voo), R+1, R+45, R+82, R+194 (pós-voo). Amostra de glicose (mg/dL):

| Tripulante | L-92 | L-44 | L-3 | R+1 | R+45 | R+82 | R+194 |
|---|---|---|---|---|---|---|---|
| C001 | 83 | 80 | 69 | 90 | 84 | 91 | 87 |
| C002 | 69 | 72 | 78 | 83 | **44** | 77 | 84 |
| C003 | 77 | 62 | 75 | 103 | **36** | 80 | 73 |
| C004 | 100 | 83 | 56 | 97 | **43** | 80 | 84 |

Os valores em negrito são **fisiologicamente improváveis** (hipoglicemia grave em pessoas assintomáticas, sem registro clínico). Interpretação mais provável: tempo até o processamento do soro / jejum prolongado / artefato pré-analítico. **Três lições de produto:**

1. **Faça checagem de plausibilidade antes do alerta** (`36 mg/dL` + sem sintomas + sem hipoglicemiante ⇒ `suspeita_artefato`, não `emergência`).
2. **Guarde a cadeia de custódia**: quem coletou, quando, quanto tempo até centrifugar. Em Marte, isso é dado de auditoria.
3. **Use tendência, não valor isolado**: a variação intrapessoal (56→100 no mesmo tripulante) é maior que a faixa de referência sugere.

### 4.4 Limitações que você deve declarar (e como contornar)

| Limitação | Consequência | Contorno elegante |
|---|---|---|
| n=4, uma missão de 3 dias | Pouca generalização | Chamar de "âncora de plausibilidade", não de treino |
| Amostras pré/pós, sem in-flight | Não há série temporal contínua | Simulação fisiológica explícita + dados ambientais reais |
| Sem PA/FC/SpO₂ contínuos | O core do app não vem do OSDR | Mostrar que o OSDR calibra *baseline* e *ranges* |
| Dados multi-ômicos brutos e ruidosos | Difícil de usar em 24h | Usar apenas as tabelas "TRANSFORMED" (ALSDA) |
| Termos de uso e citação | Risco de plágio de dados | Selo "Fonte: NASA OSDR OSD-575" em cada tela |

---

## 5. Radiação e ambiente: os números que dão autoridade ao módulo

### 5.1 Artemis I — dosimetria real no espaço profundo

| Medida | Valor | Fonte |
|---|---|---|
| Dose absorvida (GCR) dentro da Orion | **0,379 ± 0,010 mGy/dia** (H₂O) | Sci Adv 2026 (adz1892) |
| Fator de qualidade medido (HERA HSU2) | **3,1** | idem |
| Dose equivalente | **1,18 ± 0,03 mSv/dia** | idem |
| Escala para dose efetiva | **~2,01 mSv/dia** no mínimo solar (a dose efetiva varia com o ciclo solar) | idem |
| Limite de carreira (NASA-STD-3001 Rev. C) | **600 mSv** (REID < 3%, qualquer idade/sexo) | idem / norma |
| Trânsito no cinturão de prótons (Van Allen interno) | 1,61 mSv (Helga, sem colete) → 1,19 mSv (Zohar, com AstroRad): **−25,8%** | idem |
| SPE simulado tipo ago/1972 | 222,3 mSv → 87,5 mSv com colete: **−60,7%** | idem |
| SPE simulado tipo out/1989 | 233,5 mSv → 143,6 mSv: **−38,5%** | idem |
| Fração do limite de carreira em um único SPE | **34–36,5%** sem colete; **14,2–23%** com colete | idem |
| Nêutrons na ISS | **~30% da dose total** | CSA 2026 |

**Derivações que valem slide:**
- `600 mSv ÷ 1,18 mSv/dia ≈ 508 dias` de GCR contínuo no espaço profundo. Uma missão Marte (≈3 anos) **estoura o limite vitalício só com GCR** — é por isso que blindagem, escolha de ciclo solar e colete não são opcionais.
- Um único SPE tipo 1972 consome **mais de um terço** da carreira. Se o app só mostra "dose acumulada", ele não ajuda a decidir; se mostra **fração da carreira + previsão do evento + efeito do colete**, ajuda.

### 5.2 DONKI — clima espacial ao vivo (testado hoje)

| Endpoint | Uso |
|---|---|
| `https://api.nasa.gov/DONKI/notifications?type=all&api_key=DEMO_KEY` | Feed de alertas (RBE, SEP, FLR, CME) |
| `https://api.nasa.gov/DONKI/SEP?startDate=...&endDate=...` | Eventos de partículas solares (máx. 60 dias por consulta) |
| `https://api.nasa.gov/DONKI/FLR` / `CME` / `GST` | Erupções, ejeções, tempestades geomagnéticas |

No snapshot de 02/10/2026 (salvo em `dados/donki_snapshot_2026.json`) há uma notificação **RBE — "Continued Radiation Belt Enhancement"**, com fluxos de elétrons energéticos significativamente elevados. Esse é o tipo de evento que o seu app deve traduzir para linguagem de tripulação: *"ambiente externo elevado; exposição adicional esperada; priorizar atividades internas e revisar plano de EVA"*.

**Armadilha de API:** `SEP` recusa intervalos > 60 dias (`"Date range cannot exceed 60 days"`). Faça janelas deslizantes de 30 dias e cache local — em Marte não há retry.

### 5.3 Ambiente interno: CO₂ e pressão

| Parâmetro | Valor | Implicação |
|---|---|---|
| CO₂ nominal ISS | **3 mmHg ± 0,8** | ≈ **3.950 ppm** |
| Limiar de cefaleia associado | **2–5 mmHg** | Cefaleia a bordo é frequentemente ambiental |
| Pressão total da cabine | 97,9–102,7 kPa | ≈ 1 atm |
| Traje EVA | ~29,6 kPa (4,3 psi), O₂ 100% | Hipóxia por falha de O₂ é o cenário crítico |
| Fonte | NASA HSRB CO₂ Risk Record (2025) | Citar no tooltip do indicador |

**Insight de produto:** o mesmo sintoma (cefaleia + FR ↑ + FC ↑) tem duas explicações — CO₂ ambiental ou hipóxia/doença. Um app que mostra **as duas hipóteses com probabilidade** e pede a medição discriminatória (SpO₂, CO₂ da cabine) é medicina, não dashboard.

## 6. Âncoras fisiológicas: o que muda no espaço, por indicador

Esta é a tabela que deve virar `dados/ancoras_clinicas.json` e alimentar os *tooltips* da interface. Cada linha tem baseline, deriva esperada, limiar e a razão fisiopatológica.

| Indicador | Baseline em Terra | Deriva esperada em voo | Limiar de atenção | Por que (mecanismo) |
|---|---|---|---|---|
| **FC** | 50–100 bpm repouso | primeiros dias: ↓ (expansão de volume central); depois ↑ progressivo com decondicionamento, débito de sono e estresse; taquicardia ao ortostatismo | repouso > 100; ↑ ≥ 30 bpm ao teste ortostático; FC noturna ↑ 10% sobre baseline | Remodelação cardíaca precoce (LVEDV/SV caem nos primeiros 14 dias e depois se recuperam) + tônus vagal reduzido |
| **SpO₂** | 95–99% | 96–98% em cabine a 101 kPa; queda com CO₂ alto, hipóxia por falha de O₂, anemia | < 90% (moderado), < 85% (crítico), < 80% (emergência) | Curva de dissociação sigmoide: pequena queda de PAO₂ perto de 60 mmHg derruba SpO₂ rápido |
| **FR** | 12–20 rpm | ↑ 1–3 rpm com CO₂ elevado; ↓ no sono; ↑ com ansiedade/hipóxia | > 24 ou < 10; ↑ > 25% sobre baseline por > 15 min | Compensação respiratória de acidose/hipóxia; marcador precoce de hipercapnia em ambiente fechado |
| **Tcut** | 33–36 °C, amplitude circadiana ~1 °C, nadir ~04–05 h | dessincronização (16 nasceres do sol/dia); fase atrasada; ↑ com inflamação | > 38 °C (febre), < 35 °C (hipotermia), perda de amplitude circadiana | Termorregulação depende de fluxo cutâneo, que muda com redistribuição de fluidos |
| **Radiação** | ~2,4 mSv/ano (background terrestre) | **1,18 mSv/dia** no trânsito lunar (Orion); ISS menor por blindagem + campo geomagnético; picos em SPE | 600 mSv de carreira; fração de carreira > 80%; alerta operacional em SPE | GCR é contínuo e penetrante; SPE é agudo e blindável; nêutrons ~30% na ISS |
| *Extras* | | | | |
| Glicemia | 70–99 mg/dL jejum | ↑ resistência à insulina; ↓ apetite; artefato pré-analítico | < 54 ou > 180 mg/dL; > 250 com cetonas | Estresse + dieta + imobilidade |
| Sono | 7–9 h | **6,09 h** (ISS), 6,96 h pós-voo | < 6 h por 3 noites; eficiência < 85% | Dessincronização + ruído + carga de trabalho |
| Humor | — | fadiga, tensão, "terceiro quarto" em confinamento | queda sustentada em 2 dimensões do POMS | Isolamento e confinamento |

**Regra de ouro clínica:** nenhum limiar populacional substitui o **baseline individual**. Um astronauta com FC de repouso 45 bpm e outro com 75 bpm têm "normal" diferente. O ASTRAL VITAIS deve calcular **z-score robusto por indivíduo** (mediana e MAD das primeiras 72 h) e usar o limiar populacional apenas como *fail-safe*.

---

## 7. As três simulações: fisiologia, equações e o que o avaliador vê

> Implementação funcional em `docs/pesquisa-2026/scripts/simulador_astral_vital.py` (roda offline, gera CSVs e o arquivo de alertas).

### 7.1 Hipóxia progressiva

**Cenário físico:** microvazamento de cabine com falha de compensação. A pressão total cai de 101,3 kPa para 72 kPa em 90 minutos, com FiO₂ constante em 21%. O corpo compensa com FR e FC; a SpO₂ só desaba no fim — **é exatamente por isso que se precisa de predição, não de alarme**. (Uma falha do gerador de O₂, que reduz FiO₂, produz a mesma curva com outra constante de tempo.)

**Equações usadas:**

1. Gás alveolar: `PAO₂ = FiO₂ × (Pb − 6,3 kPa) − PaCO₂ / 0,8` (Pb em kPa).
2. Dissociação: `SpO₂ = 100 / (1 + 23400 / (PO₂³ + 150·PO₂))` (Severinghaus, PO₂ em mmHg).
3. Conteúdo arterial: `CaO₂ = 1,34 × Hb × SaO₂ + 0,003 × PaO₂` — **inclua Hb**; é o que conecta a anemia espacial ao seu alerta.
4. Compensação: `FR = FR₀ × (1 + k·(1 − SpO₂/SpO₂₀))`, com k ≈ 2,5; `FC` sobe com hipóxia e com ansiedade.

**O que a demo mostra (números reais do script):** SpO₂ de 97,7% → 87,8%; PAO₂ de 100 → 54 mmHg; CaO₂ de 18,9 → 16,9 mL/dL. O **alerta sai aos 81 min**, e o limiar de 90% só é cruzado aos **92 min** — **11 minutos de antecedência** neste cenário. O número de "minutos de antecedência" é o seu diferencial mensurável, e ele cresce em vazamentos mais lentos.

**Por que é defensável:** as equações são as mesmas usadas em UTI e em fisiologia de altitude; os parâmetros (FiO₂, Pb) vêm do ambiente da cabine; a Hb vem de dado real (OSD-569/OSD-575, quando houver).

### 7.2 Alterações cardiovasculares

**Cenário:** 6 h de turno com débito de sono, hidratação insuficiente e ortostatismo repetido. FC sobe de 59 para ~72 bpm (pico de 99 no teste ortostático), RMSSD cai 40% (45 → 27 ms) e a PA sistólica cai ~9 mmHg.

**Sinais e cálculo:**
- **Tendência:** regressão linear robusta em janela deslizante de 30 min; inclinação > 0,15 bpm/min sustentada = drift.
- **HRV:** RMSSD em janelas de 5 min; queda > 30% sobre baseline = retirada vagal.
- **Teste ortostático guiado:** deitar 5 min → levantar 3 min; critério clássico de intolerância: **↑FC ≥ 30 bpm ou ↓PAS ≥ 20 mmHg**.
- **Fusão:** `risco = w1·z(FC) + w2·(−z(RMSSD)) + w3·z(FR) + w4·(débito de sono)`.

**O que a demo mostra:** o app **pede** o teste ortostático (prompt proativo), coleta 3 min de dados, e classifica "resposta ortostática exacerbada — provável decondicionamento precoce; iniciar contramedida (LBNP/fluid loading/exercício) e reavaliar em 24 h".

**Base científica:** remodelação cardíaca precoce documentada em 13 astronautas (Circulation 2026), com queda de LVEDV/SV nos primeiros 14 dias e recuperação posterior; trombose de veia jugular interna já descrita (3º caso documentado, Sci Rep 2026) — seu alerta deve incluir "cefaleia + edema facial + dor cervical" como *red flag* para trombose, não só para SANS.

### 7.3 Exposição radiológica elevada

**Cenário:** dose de fundo GCR (1,18 mSv/dia no espaço profundo) + evento SEP com incremento de 0,5 mSv em 40 min + decisão de vestir AstroRad/entrar no abrigo.

**Cálculo:**
- `D(t) = D₀·t + Σ ΔD_evento` (mSv).
- `fração_carreira = D(t)/600`.
- Projeção: `D(t+30d) = D(t) + taxa_recente × 30` (com incerteza).
- Efeito do colete: fator **0,39** (evento tipo 1972) a **0,61** (tipo 1989), conforme medido em phantom.
- Alerta em três gatilhos: (a) taxa instantânea > 5× a mediana das últimas 24 h; (b) incremento projetado > 20 mSv; (c) fração de carreira > 80%.

**O que a demo mostra:** o painel de carreira começa em **0,28%** após 24 h (1,68 mSv) e salta para **37%** no cenário de um SPE tipo 1972 — com o botão "vestir AstroRad" caindo para **14,6%** e preservando **até 193 dias** de exposição profunda (número do paper). É a diferença entre um mostrador e uma ferramenta de decisão.


### 7.4 Resultados reproduzíveis (saída de `docs/pesquisa-2026/scripts/simulador_astral_vital.py`)

| Cenário | Alerta emitido | Limiar cruzado | Antecedência | Observação |
|---|---|---|---|---|
| Hipóxia progressiva | **81 min** | 92 min (SpO₂ < 90%) | **11 min** | Alerta por projeção; SpO₂ final 87,8% |
| Cardiovascular | **230 min** (CUSUM) | Teste ortostático em 240 min: **+33,3 bpm** | confirmatório | O app já alertava antes; o teste confirma |
| Radiação | **603 min** (início do SEP) | 603 min | 0 (taxa) / dezenas de min via DONKI | Dose 24 h = 1,681 mSv; 507 dias de carreira restantes |

**Como ler:** o alerta de hipóxia é o único com antecedência puramente algorítmica. No cardiovascular, a antecedência é a detecção do drift (o teste é a confirmação). Na radiação, a antecedência tem de vir do **feed externo** (DONKI) — o dosímetro detecta o evento quando ele já chegou, e essa é uma lição de arquitetura que vale dizer em voz alta.

---

## 8. Inteligência preditiva: arquitetura em 6 camadas

```
[1] INGESTÃO           [2] QUALIDADE         [3] BASELINE           [4] DETECÇÃO            [5] PROJEÇÃO           [6] EXPLICAÇÃO
 sensores simulados →  plausibilidade  →   mediana/MAD 72h   →   EWMA + CUSUM      →   tempo-até-limiar   →   "por que alertou"
 OSDR (labs)            artefato (36 mg/dL)   por indivíduo       z-score robusto        regressão + IC        SHAP/regras
 DONKI (ambiente)       faltante/atraso       circadiano          changepoint            cenário SPE           texto p/ leigo
```

**Por que não "só machine learning":** com n=4 e sem série contínua, um modelo supervisionado seria teatro. A arquitetura defensável é **estatística sequencial + fisiologia + regras clínicas**, com ML opcional para detecção de anomalia não supervisionada (Isolation Forest) em cima dos resíduos. Isso também é o que a review de 2026 sobre *network physiology* propõe: sensores multimodais + análise por IA para desvios de estado adaptativo.

**Componentes mínimos:**
1. **Baseline pessoal** (mediana e MAD por hora do dia) — corrige ritmo circadiano.
2. **EWMA** (λ = 0,2) para suavizar e **CUSUM** (k = 0,5; h = 5) para mudança persistente — imune a picos isolados.
3. **Projeção com incerteza:** ajuste linear dos últimos 10–20 pontos + banda de confiança; se o limite inferior da banda cruza o limiar, alerta.
4. **Fusão de contexto:** CO₂ da cabine, pressão, temperatura, hora do dia, carga de exercício, sono da noite anterior.
5. **Explicação obrigatória:** todo alerta carrega 3 fatores contribuintes e o que fazer (ver §9).
6. **Registro auditável:** cada alerta e cada decisão ficam em log imutável (em Marte, o *post-mortem* chega 20 min depois).

**Métricas que você deve reportar (mesmo em simulação):** sensibilidade, especificidade, **tempo de antecedência** (lead time), taxa de falsos positivos por dia. Um painel "FP/dia = 0,7" é mais convincente que "IA avançada".

---

## 9. Alertas e escalonamento: quem decide, quando e com que latência

| Nível | Cor | Quem recebe | Prazo | Exemplo |
|---|---|---|---|---|
| **0 — Info** | cinza/azul | astronauta | imediato | "glicemia 91, dentro do seu baseline" |
| **1 — Atenção** | amarelo | astronauta + enfermeiro/CMO de bordo | 4 h | "FC noturna +12% por 3 noites; repetir medição e revisar hidratação" |
| **2 — Alerta** | laranja | astronauta + CMO + **flight surgeon (Terra)** | 1 h (ou imediato se janela de comunicação) | "SpO₂ 89% em repouso; iniciar O₂ e protocolo de vazamento" |
| **3 — Emergência** | vermelho | todos + comando da missão | **imediato, sem esperar a Terra** | "SpO₂ < 85% ou perda de consciência; executar checklist de hipóxia" |

**Latências que justificam a arquitetura:**
- Terra–Lua: **~1,3 s** (ida). Dá para teleoperar aconselhamento.
- Terra–Marte: **4 a 24 min** (ida, depende das órbitas). Uma hipoxemia grave não espera.
- Consequência de projeto: **todo alerta nível 3 tem um "plano autônomo" local**, escrito para não especialista, e o nível 2 tem um "resumo para o flight surgeon" pronto para envio (o *handoff package*: série temporal, contexto, ações já tomadas).

**Regra dos 30 minutos (proposta):** qualquer condição com risco de vida em < 30 min não pode depender de resposta terrestre. Isso deve estar escrito na tela, não só no pitch.

---

## 10. Interface: a figura humana clicável que a NASA pediu

O desafio sugere uma figura clicável. Faça melhor: **mapa órgão → sensor → risco → ação**.

| Região | Sensores/medições | Riscos (5 hazards) | O que o clique mostra |
|---|---|---|---|
| Olhos/cérebro | autoexame visual, sintomas, (futuro: OCT/US) | SANS, ICP, cognição | prevalência 81%, sinais precoces, quando escalar |
| Coração/vasos | FC, PA, HRV, ortostase | decondicionamento, arritmia, trombose | tendência, teste ortostático, red flags de TVP |
| Pulmões | SpO₂, FR, CO₂ ambiente | hipóxia, hipercapnia, SPE? não | equação alveolar em linguagem simples |
| Sangue | Hb, hemograma (OSD-569), hemólise | anemia espacial, imunidade | por que SpO₂ normal pode enganar |
| Rins/bexiga | urina (OSD-656), creatinina, cálcio | cálculos, desidratação | painel inflamatório não invasivo |
| Pele/intestino | swabs (OSD-572/630), Tcut | disbiose, infecção, cicatrização | mapa do microbioma |
| Ossos/músculos | carga de exercício, (futuro: DXA/QUS) | 1–2%/mês de perda | adesão ao ARED, gamificação |
| Sistema radiológico | dosímetro, DONKI | GCR, SPE, nêutrons | fração de carreira, decisão de colete/abrigo |

**Acessibilidade (ponto fácil que quase ninguém faz):** não use **só** cor. Use cor + forma + texto + posição (daltonismo atinge ~8% dos homens; uma avaliação técnica percebe). Contraste mínimo 4,5:1; alvos de toque ≥ 44 px; modo "luva" (botões grandes) para EVA.

---

## 11. Dados vs. simulação: o selo que transforma limitação em maturidade

Cada número na tela deve ter um dos três selos:

| Selo | Significado | Exemplo |
|---|---|---|
| 🟢 **REAL** | dado de fonte NASA/agência, com accession e data | glicose OSD-575; notificação DONKI; dose Artemis I |
| 🟡 **DERIVADO** | calculado a partir de real + modelo | fração de carreira (dose/600); z-score; projeção |
| 🔵 **SIMULADO** | gerado por modelo fisiológico com parâmetros publicados | telemetria contínua de FC/SpO₂; cenário de hipóxia |

**Por que isso ganha ponto:** (a) cumpre o requisito de elegibilidade (citar recursos NASA); (b) demonstra rigor científico; (c) antecipa a pergunta que o avaliador *vai* fazer ("isso é dado real?"); (d) permite escalar quando dados reais chegarem (Artemis II/III, novas missões OSDR).

---

## 12. Estudos que sustentam a solução (curadoria 2024–2026)

| Ref | Estudo | Achado-chave para o app | DOI / link |
|---|---|---|---|
| P01 | **SANS: expert consensus on diagnosis and management** (Eye/Nature, 2026) | **81%** dos astronautas da NASA com ≥1 característica; fenotipagem e manejo | 10.1038/s41433-026-04651-6 |
| P02 | **Astroimmunology** (Nat Rev Immunol, 2026) | estressores combinados; reativação viral; monitoramento com ML como contramedida | 10.1038/s41577-025-01226-6 |
| P03 | **Space radiation measurements during Artemis I** (Nature, 2024) | 1,18 mSv/dia; diferença de 4× por blindagem; −50% mudando a orientação da nave | 10.1038/s41586-024-07927-7 |
| P04 | **First evaluation of wearable radiation protection (AstroRad)** (Sci Adv, 2026) | −60,7% / −38,5% em SPE; até 193 dias de carreira poupados; limite de 600 mSv | 10.1126/sciadv.adz1892 |
| P05 | **Impact of prolonged spaceflight on cardiac structure and function** (Circulation, 2026) | 13 astronautas; LVEDV/SV caem nos primeiros 14 dias; ⅜ G simulado pós-voo | 10.1161/CIRCULATIONAHA.125.078665 |
| P06 | **Physiological adaptation of the jugular venous pulse** (Sci Rep, 2026) | 3º caso de trombose de jugular; ultrassom + IA para JVP | 10.1038/s41598-026-69054-9 |
| P07 | **Prevalence of sleep deficiency and hypnotic use** (Lancet Neurol, 2014) | 6,09 h na ISS; 52% das noites com hipnótico | 10.1016/S1474-4422(14)70122-X |
| P08 | **Microgravity-induced organ/system deconditioning** (Front Netw Physiol, 2026) | osso −1 a −2%/mês; recuperação incompleta; acoplamento multi-órgão | 10.3389/fnetp.2026.1931834 |
| P09 | **Portable closed-loop monitoring in space** (Front Netw Physiol, 2026) | sensores vestíveis + IA + intervenção fechada | 10.3389/fnetp.2026.1867627 |
| P10 | **Anticoagulation for VTE in microgravity** (AHJ Plus, 2026) | zero estudos clínicos; lacuna de evidência para trombose | 10.1016/j.ahjo.2026.100724 |
| P11 | **Spatiotemporal expression of haemoglobin in space** (Nat Commun, 2024) | hemoglobina/eritropoese alteradas em Twins, JAXA CFE e Inspiration4 | 10.1038/s41467-024-49289-8 |
| P12 | **Exercise and monitoring in ICE/analogues** (Exp Physiol, 2026) | exercício como contramedida; heterogeneidade de monitoramento | 10.1113/EP093836 |
| P13 | **Valacyclovir e herpesvírus em expedicionários antárticos** (Front Immunol, 2026) | antiviral reduz reativação; modelo para profilaxia em voo | 10.3389/fimmu.2026.1957541 |
| P14 | **NASA HSRB CO₂ Risk Record** (2025) | CO₂ nominal 3 mmHg ± 0,8; cefaleia 2–5 mmHg | nasa.gov (PDF) |
| P15 | **CSA — Monitoring radiation for astronaut health** (2026) | CANS, C$ 5,5 mi, nêutrons ~30% da dose | asc-csa.gc.ca |
| P16 | **DLR — MARE Artemis I + preliminares Artemis II** (WRMISS, 2026) | phantoms; M-42 EXT na Orion; comparação Artemis I/II | elib.dlr.de/227128 |
| P17 | **NASA OSDR — API e estudos Inspiration4** (OSD-569…656, OSD-53) | 10 estudos abertos; tabelas ALSDA prontas para ML | visualization.osdr.nasa.gov |
| P18 | **NASA DONKI** (CCMC) | SEP, FLR, CME e notificações em JSON | api.nasa.gov/DONKI |
| P19 | **Trudel et al., hemólise e anemia do voo** (Nat Med, 2022) | ~54% mais destruição de hemácias; ~3 milhões/s | 10.1038/s41591-021-01637-7 |
| P20 | **Fram2 — primeira radiografia em órbita** (2025, fonte secundária) | imagem diagnóstica a bordo como tendência | universemagazine.com |
| S24 | **NASA-STD-3001 Vol. 1 Rev. C** (já citado no repositório) | limite de carreira 600 mSv; requisitos de saúde | norma |

## 13. Lacunas honestas (o que dizer antes que perguntem)

1. **Não existe telemetria contínua pública de astronautas.** Solução: simulação explícita + dados reais esparsos. Diga a frase: *"não inventamos dado de astronauta; simulamos fisiologia com parâmetros publicados e ancoramos o que é real em OSDR/DONKI"*.
2. **OSDR é n=4, 3 dias.** Não serve para treinar modelo; serve para plausibilidade e ranges. Diga isso.
3. **PA não está no seu conjunto de 5 vitais**, mas está no texto do desafio. Inclua pressão arterial (mesmo que manual/entrada por teclado) — é requisito literal.
4. **Glicemia e humor** também são citados. Módulos satélites resolvem, mas precisam existir na tela.
5. **SANS não é detectável pelos 5 vitais.** Assuma e proponha o módulo ocular guiado.
6. **Validação clínica é zero.** Não afirme "aprovado", "diagnóstico" ou "precisão de 95%". Use "triagem", "apoio à decisão", "protocolo sugerido".
7. **Latência e perda de contato** não são *edge cases*: são o caso nominal em Marte. O app deve funcionar **offline** e sincronizar depois.

---

## 14. Demo de 3 minutos (roteiro) e perguntas previsíveis

**Roteiro:**
- **0:00–0:20** — "Em Marte, o médico está a 20 minutos de distância. O ASTRAL VITAIS dá ao astronauta antecedência mensurável: neste cenário, 11 minutos antes de a SpO₂ cruzar 90%."
- **0:20–0:50** — figura humana; clique no olho → SANS (81%); clique no coração → tendência de FC e ortostatismo.
- **0:50–1:40** — simulação de hipóxia: SpO₂ cai, alerta laranja aos 81 min (11 min antes do limiar), checklist de 3 passos, pacote pronto para o flight surgeon.
- **1:40–2:20** — radiação: DONKI ao vivo, SPE, fração de carreira, botão "vestir AstroRad" (−60% no pico) e "abrigo".
- **2:20–2:45** — selo REAL/DERIVADO/SIMULADO + fonte OSDR na tela.
- **2:45–3:00** — "próximo passo: plugar dados da Artemis II e do CANS".

**Perguntas prováveis (e respostas curtas):**
1. *"De onde vêm os dados?"* → OSDR OSD-575/569/656 (real), DONKI (real, ao vivo), Artemis I MARE (real), resto simulado com equações publicadas.
2. *"Por que 5 vitais, se o texto cita PA, FC, glicemia, temperatura, sono e humor?"* → os 5 são os que dá para medir de forma contínua ou quase contínua a bordo; PA, glicemia, sono e humor entram como módulos guiados (e a PA é requisito literal do desafio).
3. *"Como evitam falsos positivos?"* → baseline individual, EWMA/CUSUM, plausibilidade e contexto ambiental (CO₂).
4. *"Isso é diagnóstico?"* → não; é triagem e apoio à decisão, com escalonamento para flight surgeon.
5. *"E se a comunicação cair?"* → protocolos autônomos nível 3 e fila de sincronização.
6. *"Por que radiação em µSv/h e Sv?"* → taxa (decisão imediata) vs. acumulado (carreira/REID), com nêutrons e SPE.
7. *"Vocês validaram?"* → validação por plausibilidade contra OSDR + revisão de literatura; validação clínica é o roadmap.
8. *"O que muda em 1 ano?"* → dados Artemis II/III e CANS; arquitetura já preparada para ingestão.

---

## Anexo A — Arquivos desta pesquisa

```
docs/pesquisa-2026/
├── LEIA-ME.md                              ← propósito, proveniência e limites
├── DOSSIE.md                               ← este documento
├── TAREFAS-PARA-CODEX.md                   ← backlog de implementação com critérios de aceite
├── dados/
│   ├── osdr_osd575_cmp_inspiration4.csv    ← dado REAL (4 tripulantes × 7 coletas)
│   ├── catalogo_osdr_inspiration4.csv      ← catálogo dos 9 estudos I4 + OSD-53
│   ├── ancoras_clinicas.json               ← limiares + deriva + fonte por indicador
│   ├── donki_snapshot_2026.json            ← 65 notificações reais (30/09–14/11/2026)
│   ├── sim_hipoxia.csv / sim_cardiovascular.csv / sim_radiacao.csv
│   └── alertas_simulados.json              ← lead time e limiares de cada cenário
└── scripts/
    ├── coletar_dados_nasa.py               ← baixa OSDR + DONKI (idempotente, com cache)
    └── simulador_astral_vital.py           ← gera as 3 simulações + alertas preditivos
```

Nada aqui entra no bundle do app: `docs/` e os scripts Python ficam fora do build do Vite.

## Anexo B — Como reproduzir

```bash
python3 docs/pesquisa-2026/scripts/coletar_dados_nasa.py      # requer rede
python3 docs/pesquisa-2026/scripts/simulador_astral_vital.py  # offline e determinístico
```

Os scripts usam apenas a biblioteca padrão do Python 3 e gravam em `docs/pesquisa-2026/dados/`.
Não há dependência de Node, npm ou do build do app.

## Anexo C — Checklist de aceitação do produto

- [ ] Os 6 indicadores do texto oficial aparecem na interface (PA, FC, glicemia, T, sono, humor)
- [ ] Os 5 hazards estão mapeados em telas ou tooltips
- [ ] Figura humana clicável com função + status + risco por região
- [ ] Gráficos de tendência com baseline individual (não só faixa populacional)
- [ ] Código de cores **acessível** (cor + forma + texto)
- [ ] Instruções passo a passo para não especialistas (medição e ação)
- [ ] Gamificação de adesão (ARED, hidratação, sono, check-in de humor)
- [ ] Alertas em 3 níveis com latência explícita (Terra/Lua/Marte)
- [ ] Selo REAL/DERIVADO/SIMULADO em cada número
- [ ] Citação visível de OSDR/DONKI/HRP/CSA (elegibilidade)
- [ ] Funciona offline e sincroniza depois
- [ ] Log auditável de alertas e decisões

## Anexo D — Fontes P01–P20 (citações completas)

- **P01** SANS Expert Consensus. *Eye* (Nature), 2026. https://doi.org/10.1038/s41433-026-04651-6
- **P02** Astroimmunology. *Nature Reviews Immunology*, 2026. https://doi.org/10.1038/s41577-025-01226-6
- **P03** Space radiation measurements during the Artemis I lunar mission. *Nature*, 2024. https://doi.org/10.1038/s41586-024-07927-7
- **P04** First evaluation of wearable radiation protection for human deep space exploration, as flown on Artemis I. *Science Advances*, 2026. https://doi.org/10.1126/sciadv.adz1892
- **P05** Impact of Prolonged Spaceflight on Cardiac Structure and Function. *Circulation*, 2026. https://doi.org/10.1161/CIRCULATIONAHA.125.078665
- **P06** Physiological adaptation of the jugular venous pulse during long-duration spaceflight. *Scientific Reports*, 2026. https://doi.org/10.1038/s41598-026-69054-9
- **P07** Prevalence of sleep deficiency and use of hypnotic drugs in astronauts. *Lancet Neurology*, 2014. https://doi.org/10.1016/S1474-4422(14)70122-X
- **P08** Microgravity-induced organ and system-level deconditioning. *Frontiers in Network Physiology*, 2026. https://doi.org/10.3389/fnetp.2026.1931834
- **P09** Monitoring and modulating interconnected physiological systems in space. *Frontiers in Network Physiology*, 2026. https://doi.org/10.3389/fnetp.2026.1867627
- **P10** Anticoagulants for VTE in humans exposed to microgravity. *American Heart Journal Plus*, 2026. https://doi.org/10.1016/j.ahjo.2026.100724
- **P11** Spatiotemporal expression and control of haemoglobin in space. *Nature Communications*, 2024. https://doi.org/10.1038/s41467-024-49289-8
- **P12** Exercise and physiological monitoring in isolated, confined and extreme environments. *Experimental Physiology*, 2026. https://doi.org/10.1113/EP093836
- **P13** Valacyclovir reduces inflammation and IgG subclass activation by suppressing herpesvirus reactivation. *Frontiers in Immunology*, 2026. https://doi.org/10.3389/fimmu.2026.1957541
- **P14** NASA, Human System Risk Board — CO₂ Risk Record, 2025. https://www.nasa.gov/wp-content/uploads/2025/07/hsrb-co2-risk-risk-record-rev-d-web.pdf
- **P15** CSA, Monitoring radiation for astronaut health, 26/02/2026. https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp
- **P16** DLR, Update on the MARE Evaluation on Artemis I and preliminary results from Artemis II (WRMISS, 2026). https://elib.dlr.de/227128/
- **P17** NASA OSDR, API v2 — estudos OSD-569, OSD-570, OSD-571, OSD-572, OSD-573, OSD-574, OSD-575, OSD-630, OSD-656, OSD-53. https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/OSD-575/
- **P18** NASA DONKI (CCMC). https://api.nasa.gov/DONKI/notifications
- **P19** Trudel et al., Haemolysis contributes to the spaceflight-associated anaemia. *Nature Medicine*, 2022. https://doi.org/10.1038/s41591-021-01637-7
- **P20** Fram2 — primeira radiografia em órbita (fonte secundária, 2025). https://universemagazine.com/en/spacex-fram2-crew-took-a-look-beneath-the-skin-in-microgravity/
