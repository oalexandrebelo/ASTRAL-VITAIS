#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ASTRAL VITAIS — simulador fisiológico das três simulações prioritárias.

Gera, sem rede e de forma determinística:
  1. Hipóxia progressiva (despressurização lenta de cabine)
  2. Alterações cardiovasculares (drift + teste ortostático)
  3. Exposição radiológica elevada (GCR + evento SEP)
e o arquivo de alertas preditivos com o "lead time" de cada cenário.

Modelos:
  - Gás alveolar:        PAO2 = FiO2*(Pb - 6,3) - PaCO2/0,8      [kPa]
  - Dissociação de O2:   SpO2 = 23400/(PO2^3 + 150*PO2 + 23400)  [Severinghaus]
  - Conteúdo arterial:   CaO2 = 1,34*Hb*SaO2 + 0,003*PaO2
  - Radiação:            D(t) = D0*t + Σ eventos; carreira = D/600 mSv

Referências dos parâmetros: ver ../DOSSIE.md (§7).
Uso: python3 docs/pesquisa-2026/scripts/simulador_astral_vital.py
"""

import csv
import json
import math
import os
import random

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "dados")

random.seed(20261114)  # reprodutível

# ---------------------------------------------------------------- constantes
PH2O_KPA = 6.3
R = 0.8
MMHG_POR_KPA = 7.50062
HB_G_DL = 14.2                 # hemoglobina de referência (ajustável por OSD-569)
LIMITE_CARREIRA_MSV = 600.0    # NASA-STD-3001 Vol.1 Rev.C (REID < 3%)
GCR_MSV_DIA = 1.18             # Artemis I / Orion (Sci Adv 2026)
SPE_1972_MSV = 222.3           # sem colete
SPE_1972_COLETE_MSV = 87.5     # com AstroRad (-60,7%)
SPE_1989_MSV = 233.5
SPE_1989_COLETE_MSV = 143.6


# ------------------------------------------------------------------- funções
def clamp(x, lo, hi):
    return max(lo, min(hi, x))


def pao2_kpa(fio2, pb_kpa, paco2_kpa):
    return fio2 * (pb_kpa - PH2O_KPA) - paco2_kpa / R


def spo2_de_pao2(pao2_mmhg):
    """Severinghaus (1980) — boa aproximação da curva de dissociação."""
    p = max(1.0, pao2_mmhg)
    # Severinghaus: S = 1 / (1 + 23400/(PO2^3 + 150*PO2))
    return 100.0 / (1.0 + 23400.0 / (p ** 3 + 150.0 * p))


def cao2_ml_dl(spo2_pct, pao2_mmhg, hb=HB_G_DL):
    return 1.34 * hb * (spo2_pct / 100.0) + 0.003 * pao2_mmhg


def regressao(xs, ys):
    """Inclinação e intercepto por mínimos quadrados."""
    n = len(xs)
    if n < 3:
        return 0.0, ys[-1] if ys else 0.0
    mx = sum(xs) / n
    my = sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return 0.0, my
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    m = sxy / sxx
    return m, my - m * mx


def mediana(xs):
    s = sorted(xs)
    n = len(s)
    if n == 0:
        return 0.0
    return s[n // 2] if n % 2 else 0.5 * (s[n // 2 - 1] + s[n // 2])


def mad(xs, med=None):
    med = mediana(xs) if med is None else med
    return mediana([abs(x - med) for x in xs]) or 1e-9


def salvar_csv(nome, campos, linhas):
    caminho = os.path.join(DADOS, nome)
    with open(caminho, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=campos)
        w.writeheader()
        w.writerows(linhas)
    print("  -> {} ({} linhas)".format(caminho, len(linhas)))
    return caminho


# ------------------------------------------------------- 1. HIPÓXIA PROGRESSIVA
def simular_hipoxia():
    """
    Microvazamento de cabine: pressão total cai de 101,3 kPa para 72 kPa em 90 min
    (FiO2 constante em 21%). A SpO2 só desaba no fim — daí a necessidade de predição.
    """
    linhas = []
    rr = 14.0
    paco2 = 5.3
    alerta_min = None
    cruzou_90 = None
    cruzou_85 = None

    for t in range(0, 121):
        if t <= 10:
            pb = 101.3
        else:
            pb = max(72.0, 101.3 - (101.3 - 72.0) * (t - 10) / 90.0)

        pao2 = pao2_kpa(0.21, pb, paco2)
        pao2_mmhg = pao2 * MMHG_POR_KPA
        spo2 = spo2_de_pao2(pao2_mmhg)

        # compensação respiratória (hipóxia -> hiperventilação) e queda do CO2
        rr_alvo = clamp(14.0 * (1.0 + 2.2 * (1.0 - spo2 / 98.0)), 12.0, 34.0)
        rr = 0.7 * rr + 0.3 * rr_alvo
        paco2 = clamp(5.3 - 0.02 * (rr - 14.0), 3.6, 5.6)

        fc = 62.0 + 1.2 * max(0.0, 98.0 - spo2) + random.gauss(0, 0.8)
        linhas.append(
            {
                "t_min": t,
                "pressao_cabine_kpa": round(pb, 2),
                "fio2": 0.21,
                "pao2_mmhg": round(pao2_mmhg, 1),
                "spo2_pct": round(spo2, 1),
                "fr_rpm": round(rr, 1),
                "fc_bpm": round(fc, 1),
                "cao2_ml_dl": round(cao2_ml_dl(spo2, pao2_mmhg), 2),
                "evento": "vazamento" if 10 < t <= 100 else "",
            }
        )

        if cruzou_90 is None and spo2 < 90:
            cruzou_90 = t
        if cruzou_85 is None and spo2 < 85:
            cruzou_85 = t

        # predição: inclinação dos últimos 15 min -> tempo até SpO2 = 90%
        if t >= 25 and alerta_min is None:
            jan = linhas[-15:]
            xs = [r["t_min"] for r in jan]
            ys = [r["spo2_pct"] for r in jan]
            m, _ = regressao(xs, ys)
            if m < -0.05:
                t_ate_90 = (ys[-1] - 90.0) / (-m)
                if 0 < t_ate_90 <= 15:
                    alerta_min = t

    salvar_csv(
        "sim_hipoxia.csv",
        ["t_min", "pressao_cabine_kpa", "fio2", "pao2_mmhg", "spo2_pct",
         "fr_rpm", "fc_bpm", "cao2_ml_dl", "evento"],
        linhas,
    )
    return {
        "cenario": "Hipóxia progressiva",
        "evento": "Microvazamento de cabine: 101,3 -> 72 kPa em 90 min (FiO2 21%)",
        "limiar": "SpO2 < 90%",
        "alerta_min": alerta_min,
        "cruzamento_min": cruzou_90,
        "cruzamento_85_min": cruzou_85,
        "antecedencia_min": (cruzou_90 - alerta_min) if (alerta_min is not None and cruzou_90 is not None) else None,
        "acao": "Subir O2 (máscara), igualar pressão, restringir esforço, checar vazamento e preparar evacuação para módulo pressurizado.",
        "metodo": "Equação do gás alveolar + curva de Severinghaus; alerta por projeção linear (15 min).",
    }


# ------------------------------------------------- 2. ALTERAÇÕES CARDIOVASCULARES
def simular_cardiovascular():
    """6 h de turno: débito de sono, pouca hidratação e teste ortostático no minuto 240."""
    linhas = []
    fc0, rmssd0, fr0, pas0 = 58.0, 46.0, 13.5, 118.0
    teste = range(240, 246)
    alerta_min = None
    ewma_fc = fc0
    cusum = 0.0
    base_fc, base_rmssd = [], []

    for t in range(0, 361):
        # deriva lenta (descondicionamento + débito de sono + hipohidratação)
        fc = fc0 + 0.035 * t + random.gauss(0, 1.2)
        rmssd = rmssd0 * (1.0 - 0.0012 * t) + random.gauss(0, 1.0)
        fr = fr0 + 0.006 * t + random.gauss(0, 0.4)
        pas = pas0 - 0.025 * t + random.gauss(0, 1.5)

        ortostase = False
        if t in teste:
            ortostase = True
            fc += 22.0 + 2.0 * (t - 240)   # resposta exacerbada
            pas -= 6.0 + 2.0 * (t - 240)
            rmssd *= 0.6

        linhas.append(
            {
                "t_min": t,
                "fc_bpm": round(fc, 1),
                "rmssd_ms": round(max(5.0, rmssd), 1),
                "fr_rpm": round(fr, 1),
                "pas_mmhg": round(pas, 1),
                "evento": "teste_ortostatico" if ortostase else "",
            }
        )

        if t < 60:
            base_fc.append(fc)
            base_rmssd.append(rmssd)
            continue

        med_fc, mad_fc = mediana(base_fc), mad(base_fc)
        z = (fc - med_fc) / (1.4826 * mad_fc)
        ewma_fc = 0.2 * fc + 0.8 * ewma_fc
        cusum = max(0.0, cusum + z - 0.5)

        desp_rmssd = rmssd < 0.7 * mediana(base_rmssd)
        if alerta_min is None and cusum > 5 and desp_rmssd and ewma_fc > med_fc + 6:
            alerta_min = t

    salvar_csv(
        "sim_cardiovascular.csv",
        ["t_min", "fc_bpm", "rmssd_ms", "fr_rpm", "pas_mmhg", "evento"],
        linhas,
    )
    antes = next(r for r in linhas if r["t_min"] == 239)
    pico = next(r for r in linhas if r["t_min"] == 245)
    d_fc = round(pico["fc_bpm"] - antes["fc_bpm"], 1)
    d_pas = round(pico["pas_mmhg"] - antes["pas_mmhg"], 1)
    return {
        "cenario": "Alterações cardiovasculares",
        "evento": "6 h de turno com débito de sono + teste ortostático (3 min) no minuto 240",
        "limiar": "CUSUM > 5 e RMSSD < 70% do baseline e FC +6 bpm sustentada",
        "alerta_min": alerta_min,
        "cruzamento_min": alerta_min,
        "antecedencia_min": None,
        "acao": "Hidratação + sal, exercício resistivo/ARED, LBNP se disponível, repetir ortostase em 24 h e revisar sono.",
        "metodo": "EWMA (lambda 0,2) + CUSUM (k 0,5) sobre z-score robusto; RMSSD por janelas.",
        "confirmacao_ortostatica": {"delta_fc_bpm": d_fc, "delta_pas_mmhg": d_pas,
                                     "criterio": "dFC >= 30 bpm ou dPAS <= -20 mmHg",
                                     "positivo": bool(d_fc >= 30 or d_pas <= -20)},
    }


# ------------------------------------------------------ 3. EXPOSIÇÃO RADIOLÓGICA
def simular_radiacao():
    """24 h de missão: GCR contínuo (1,18 mSv/dia) + evento SEP de 0,5 mSv em 40 min."""
    por_min = GCR_MSV_DIA / 1440.0
    linhas = []
    acumulado = 0.0
    taxas = []
    alerta_min = None

    for t in range(0, 1441):
        taxa = por_min
        if 600 <= t <= 640:
            # perfil triangular: 0,5 mSv integrados em 40 min -> pico 0,025 mSv/min
            frac = 1.0 - abs((t - 620) / 20.0)
            taxa += 0.025 * frac
        acumulado += taxa
        taxas.append(taxa)
        med = mediana(taxas[-180:]) if len(taxas) >= 30 else por_min

        if alerta_min is None and 600 <= t <= 645 and taxa > 5.0 * med:
            alerta_min = t

        linhas.append(
            {
                "t_min": t,
                "taxa_msv_min": round(taxa, 6),
                "taxa_usv_h": round(taxa * 1000.0 * 60.0, 2),
                "dose_acumulada_msv": round(acumulado, 4),
                "fracao_carreira_pct": round(100.0 * acumulado / LIMITE_CARREIRA_MSV, 4),
                "evento": "SEP" if 600 <= t <= 640 else "",
            }
        )

    salvar_csv(
        "sim_radiacao.csv",
        ["t_min", "taxa_msv_min", "taxa_usv_h", "dose_acumulada_msv",
         "fracao_carreira_pct", "evento"],
        linhas,
    )

    restante = LIMITE_CARREIRA_MSV - acumulado
    return {
        "cenario": "Exposição radiológica elevada",
        "evento": "GCR de 1,18 mSv/dia + SEP de 0,5 mSv em 40 min (minuto 600)",
        "limiar": "Taxa instantânea > 5x a mediana das últimas 3 h",
        "alerta_min": alerta_min,
        "cruzamento_min": alerta_min,
        "antecedencia_min": None,
        "acao": "Abrigar no módulo mais blindado, vestir AstroRad, cancelar EVA, registrar dose e reavaliar exposição acumulada.",
        "metodo": "D(t) = D0*t + soma(SEP); fracao = D/600 mSv; alerta por razão de taxa.",
        "antecedencia_estimada_via_donki": "dezenas de minutos (flare -> chegada de partículas); requer feed DONKI ativo",
        "dose_24h_msv": round(acumulado, 4),
        "dias_de_carreira_restantes_gcr": round(restante / GCR_MSV_DIA, 1),
        "projecao_30d_msv": round(GCR_MSV_DIA * 30, 2),
        "projecao_90d_msv": round(GCR_MSV_DIA * 90, 2),
        "spe_1972": {"sem_colete_msv": SPE_1972_MSV,
                      "com_colete_msv": SPE_1972_COLETE_MSV,
                      "pct_carreira_sem_colete": round(100 * SPE_1972_MSV / LIMITE_CARREIRA_MSV, 1),
                      "pct_carreira_com_colete": round(100 * SPE_1972_COLETE_MSV / LIMITE_CARREIRA_MSV, 1)},
        "spe_1989": {"sem_colete_msv": SPE_1989_MSV,
                      "com_colete_msv": SPE_1989_COLETE_MSV,
                      "pct_carreira_sem_colete": round(100 * SPE_1989_MSV / LIMITE_CARREIRA_MSV, 1),
                      "pct_carreira_com_colete": round(100 * SPE_1989_COLETE_MSV / LIMITE_CARREIRA_MSV, 1)},
    }


def main():
    os.makedirs(DADOS, exist_ok=True)
    print("ASTRAL VITAIS — simulador fisiológico")
    alertas = [simular_hipoxia(), simular_cardiovascular(), simular_radiacao()]
    destino = os.path.join(DADOS, "alertas_simulados.json")
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(
            {
                "gerado_em": "2026-11-14",
                "modelo": "ASTRAL VITAIS v1 — simulação fisiológica com parâmetros publicados",
                "aviso": "Telemetria SINTÉTICA. Não representa dados de astronautas reais.",
                "limite_carreira_msv": LIMITE_CARREIRA_MSV,
                "gcr_msv_dia": GCR_MSV_DIA,
                "cenarios": alertas,
            },
            f, ensure_ascii=False, indent=2,
        )
    print("  -> {}".format(destino))
    for a in alertas:
        print("  [{}] alerta em {} min | limiar cruzado em {} min | antecedência {} min".format(
            a["cenario"], a["alerta_min"], a["cruzamento_min"], a["antecedencia_min"]))


if __name__ == "__main__":
    main()
