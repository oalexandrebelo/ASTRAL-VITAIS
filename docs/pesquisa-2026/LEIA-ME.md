# Pesquisa 2026 — dados abertos, literatura e modelo executável

Esta pasta reúne a pesquisa que sustenta a evolução do ASTRAL VITAIS para a etapa **"Evidências de pesquisa"** descrita em [`docs/ROADMAP-E-ARQUITETURA.md`](../ROADMAP-E-ARQUITETURA.md): um catálogo curado de estudos OSDR/SOMA **com proveniência**, em vez de números soltos.

Ela é **complementar** a [`docs/CIENCIA-NASA.md`](../CIENCIA-NASA.md) e a [`docs/NASA-EVIDENCE.json`](../NASA-EVIDENCE.json). Não altera requisitos, não reclassifica riscos e não muda o que a beta afirma. O que ela acrescenta:

1. **Receita de acesso a dados abertos** — como baixar os estudos humanos do OSDR (API REST), como consultar o DONKI e o que já foi baixado e verificado.
2. **Literatura de 2024–2026** com números que o produto pode citar sem inventar (SANS 81%, 1,18 mSv/dia, −60,7% com AstroRad, CO₂ 3 mmHg, sono 6,09 h).
3. **Um modelo executável** das três simulações prioritárias (hipóxia, cardiovascular, radiação) com *lead time* mensurável — semente para a lógica de domínio.

## Conteúdo

| Arquivo | O que é |
|---|---|
| [`DOSSIE.md`](DOSSIE.md) | Dossiê completo: 12 achados, catálogo OSDR, âncoras por indicador, arquitetura preditiva, alertas, estudos P01–P20 |
| [`TAREFAS-PARA-CODEX.md`](TAREFAS-PARA-CODEX.md) | Backlog de implementação com critérios de aceite, pronto para virar issues/commits |
| `dados/ancoras_clinicas.json` | Limiares, deriva esperada, mecanismo e fonte por indicador (inclui SANS, sono, humor) |
| `dados/catalogo_osdr_inspiration4.csv` | Catálogo dos 10 estudos verificados (OSD-569…OSD-656, OSD-53) |
| `dados/osdr_osd575_cmp_inspiration4.csv` | **Dado real**: painel metabólico de 4 tripulantes × 7 coletas |
| `dados/donki_snapshot_2026.json` | 65 notificações reais de clima espacial (30/09–14/11/2026) |
| `dados/sim_*.csv` | Saídas das três simulações (121 min, 6 h e 24 h) |
| `dados/alertas_simulados.json` | Alerta, limiar cruzado, *lead time* e projeções de cada cenário |
| `scripts/coletar_dados_nasa.py` | Coletor idempotente (OSDR + DONKI); mantém cache se a rede falhar |
| `scripts/simulador_astral_vital.py` | Simulador determinístico (seed fixa), só biblioteca padrão do Python |

Nada aqui entra no bundle: `docs/` e os scripts Python ficam fora do build do Vite.

## Real, derivado e sintético

A distinção é a mesma que a beta já adota na interface e é pré-requisito para citar qualquer número:

| Selo | O que é | Exemplos nesta pasta |
|---|---|---|
| **REAL** | dado de fonte primária, com accession ou endpoint | `osdr_osd575_cmp_inspiration4.csv` (NASA OSDR OSD-575), `donki_snapshot_2026.json` (NASA DONKI) |
| **DERIVADO** | cálculo sobre dado real + regra publicada | fração de carreira (dose/600 mSv), z-score, projeção de 30/90 dias |
| **SINTÉTICO** | fisiologia gerada por equações publicadas | `sim_hipoxia.csv`, `sim_cardiovascular.csv`, `sim_radiacao.csv` |

Os CSVs de simulação **não** são telemetria de astronautas. Não há, e não é possível obter publicamente, série contínua de sinais vitais de tripulantes: os dados humanos abertos (OSDR) são amostras pré/pós-voo, discretas e de poucos participantes.

## Proveniência e verificação

- Coleta e conferência em **14/11/2026**, por requisição direta às APIs (não por captura de tela ou resumo de terceiros).
- Estudos OSDR verificados por metadados: `OSD-569`, `OSD-570`, `OSD-571`, `OSD-572`, `OSD-573`, `OSD-574`, `OSD-575`, `OSD-630`, `OSD-656` (missão SpaceX Inspiration4) e `OSD-53`.
- A rota `.../dataset/OSD-xxx/file/<nome>/` devolve **metadados**, não o CSV; o binário está em `osdr.nasa.gov/geode-py/ws/studies/OSD-xxx/download?file=<nome>`. O coletor já usa a rota correta.
- O `SEP` do DONKI recusa intervalos maiores que 60 dias; o coletor usa janelas curtas.
- Números normativos permanecem os do repositório: **V1 4030 / S24** (600 mSv de carreira), **V2 6004 / S25** (ppCO₂ ≤ 3 mmHg, média de 1 h), **V1 4033** (GCR < 1,3 mSv/dia em espaço livre). A dose medida de 1,18 mSv/dia na Orion (P03) é **contexto**, não substitui o requisito.

## Limites (não ignorar)

- O OSD-575 tem **n = 4** e uma missão de ~3 dias. Serve para plausibilidade e faixas, não para treinar modelo.
- O dado real contém anomalias (glicemias de 36 e 44 mg/dL em R+45). O produto deve tratar **plausibilidade antes de alarme** — e isso está proposto em `TAREFAS-PARA-CODEX.md`.
- Nada aqui é diagnóstico, prescrição ou protocolo de voo. A beta continua sendo um simulador educativo.
- Artigos de 2026 podem ser revisados; os valores devem ser versionados com data e DOI.

## Como reproduzir

```bash
python3 docs/pesquisa-2026/scripts/coletar_dados_nasa.py      # requer rede
python3 docs/pesquisa-2026/scripts/simulador_astral_vital.py  # offline e determinístico
```

Requisitos: Python 3 (somente biblioteca padrão). Nenhuma dependência de Node ou do build do app.

## Atribuição

Dados: **NASA Open Science Data Repository (OSDR)** e **NASA DONKI/CCMC**. Literatura: ver Anexo D de [`DOSSIE.md`](DOSSIE.md), com DOI por item. Ao reutilizar, cite o accession (`OSD-xxx`) e o DOI — a mesma regra de proveniência que o produto aplica na tela.
