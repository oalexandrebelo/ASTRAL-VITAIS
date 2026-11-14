#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ASTRAL VITAIS — coletor de dados abertos da NASA (Space Apps 2026).

Baixa, de forma idempotente:
  1. Metadados dos estudos humanos do OSDR (suíte Inspiration4 + OSD-53)
  2. A tabela REAL do painel metabólico (OSD-575, CMP) em CSV
  3. Um snapshot das notificações de clima espacial do DONKI

Uso:
    python3 docs/pesquisa-2026/scripts/coletar_dados_nasa.py

Sem rede, mantém os arquivos já existentes e avisa no console.
Todas as fontes são públicas; cite os accessions (OSD-xxx) e o DONKI.
"""

import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "dados")

OSDR_BASE = "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset"
OSDR_DOWNLOAD = (
    "https://osdr.nasa.gov/geode-py/ws/studies/{sid}/download"
    "?source=datamanager&file={nome}"
)
DONKI_NOTIF = "https://api.nasa.gov/DONKI/notifications"

UA = {
    "User-Agent": "ASTRAL-VITAL/1.0 (NASA Space Apps Challenge 2026; uso educacional)",
    "Accept": "application/json, text/csv, */*",
}

# Estudos verificados via API em 14/11/2026.
ESTUDOS = [
    ("OSD-569", "Whole Blood Measurements (RNA-seq, WGS, clonal hematopoiesis, CBC)"),
    ("OSD-570", "PBMC Profiling (snRNA-seq, snATAC-seq, TCR/BCR repertoire)"),
    ("OSD-571", "Plasma Profiling (proteômica, EVPs, metabolômica, cfDNA/cfRNA)"),
    ("OSD-572", "Oral, Nasal and Skin Metagenomic/Metatranscriptomic Swabs"),
    ("OSD-573", "Dragon Capsule Metagenomic/Metatranscriptomic Swabs"),
    ("OSD-574", "Deltoid Skin and Microbiome — Spatial Transcriptomics"),
    ("OSD-575", "Blood Serum Metabolic Panel + Immune/Cardiac Cytokine Arrays"),
    ("OSD-630", "Stool Metagenome Profiling"),
    ("OSD-656", "Urine Inflammation Panel (Multiplex, NULISAseq)"),
    ("OSD-53", "Spaceflight Modulates Gene Expression in Astronauts"),
]

ARQUIVO_CMP = "LSDS-8_Comprehensive_Metabolic_Panel_CMP_TRANSFORMED.csv"
SAIDA_CMP = "osdr_osd575_cmp_inspiration4.csv"
SAIDA_CATALOGO = "catalogo_osdr_inspiration4.csv"
SAIDA_DONKI = "donki_snapshot_2026.json"


def _get(url, timeout=45):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def get_json(url, timeout=45):
    return json.loads(_get(url, timeout).decode("utf-8"))


def estudo(sid):
    """Metadados de um estudo; devolve dict ou None."""
    try:
        d = get_json("{}/{}/".format(OSDR_BASE, sid))
    except Exception as e:  # noqa: BLE001
        print("  ! falha em {}: {}".format(sid, e))
        return None
    for _, v in d.items():
        return v.get("metadata", {})
    return None


def _txt(v):
    if isinstance(v, list):
        return "; ".join(str(x) for x in v)
    if isinstance(v, dict):
        return v.get("name", "") or json.dumps(v, ensure_ascii=False)
    return v or ""


def catalogo():
    print("[1/3] Metadados OSDR...")
    linhas = []
    for sid, titulo_fallback in ESTUDOS:
        meta = estudo(sid)
        if meta:
            missao = meta.get("mission")
            if isinstance(missao, dict):
                missao = missao.get("name", "")
            linhas.append(
                {
                    "accession": sid,
                    "titulo": meta.get("study title") or titulo_fallback,
                    "missao": _txt(missao),
                    "material": _txt(meta.get("material type")),
                    "tecnologia": _txt(meta.get("study assay technology type")),
                    "plataforma": _txt(meta.get("study assay technology platform")),
                    "release": meta.get("study public release date", ""),
                    "url_api": "{}/{}/".format(OSDR_BASE, sid),
                }
            )
        else:
            linhas.append(
                {
                    "accession": sid,
                    "titulo": titulo_fallback,
                    "missao": "SpaceX Inspiration4" if sid.startswith("OSD-5") or sid == "OSD-656" else "",
                    "material": "",
                    "tecnologia": "",
                    "plataforma": "",
                    "release": "",
                    "url_api": "{}/{}/".format(OSDR_BASE, sid),
                }
            )
        time.sleep(0.3)  # gentileza com a API

    destino = os.path.join(DADOS, SAIDA_CATALOGO)
    with open(destino, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(linhas[0].keys()))
        w.writeheader()
        w.writerows(linhas)
    print("    -> {} ({} estudos)".format(destino, len(linhas)))


def painel_metabolico():
    print("[2/3] Tabela real OSD-575 (CMP)...")
    url = OSDR_DOWNLOAD.format(sid="OSD-575", nome=ARQUIVO_CMP)
    try:
        bruto = _get(url, timeout=90)
    except Exception as e:  # noqa: BLE001
        print("    ! download falhou ({}); mantendo arquivo local".format(e))
        return
    if bruto[:1] == b"{":  # a API devolveu metadados, não o CSV
        print("    ! resposta inesperada (metadados); mantendo arquivo local")
        return
    texto = bruto.decode("utf-8-sig")
    destino = os.path.join(DADOS, SAIDA_CMP)
    with open(destino, "w", encoding="utf-8") as f:
        f.write(texto)
    n = sum(1 for _ in open(destino, encoding="utf-8")) - 1
    print("    -> {} ({} linhas de dados)".format(destino, n))


def donki(dias=45):
    print("[3/3] Snapshot DONKI (notificações)...")
    fim = time.strftime("%Y-%m-%d", time.gmtime())
    ini = time.strftime("%Y-%m-%d", time.gmtime(time.time() - dias * 86400))
    qs = urllib.parse.urlencode(
        {"startDate": ini, "endDate": fim, "type": "all", "api_key": "DEMO_KEY"}
    )
    try:
        dados = get_json("{}?{}".format(DONKI_NOTIF, qs), timeout=60)
    except Exception as e:  # noqa: BLE001
        print("    ! DONKI falhou ({}); mantendo snapshot local".format(e))
        return
    if not isinstance(dados, list):
        print("    ! formato inesperado; mantendo snapshot local")
        return
    resumo = [
        {
            "messageType": d.get("messageType"),
            "messageID": d.get("messageID"),
            "messageIssueTime": d.get("messageIssueTime"),
            "messageURL": d.get("messageURL"),
            "resumo": (d.get("messageBody") or "").split("## Summary:")[-1].strip()[:600],
        }
        for d in dados
    ]
    destino = os.path.join(DADOS, SAIDA_DONKI)
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(
            {"coletado_em": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
             "janela": {"inicio": ini, "fim": fim},
             "total": len(resumo), "notificacoes": resumo},
            f, ensure_ascii=False, indent=2,
        )
    print("    -> {} ({} notificações)".format(destino, len(resumo)))


def main():
    os.makedirs(DADOS, exist_ok=True)
    print("ASTRAL VITAIS — coleta de dados NASA/OSDR/DONKI")
    catalogo()
    painel_metabolico()
    donki()
    print("Concluído. Fontes: NASA OSDR (OSD-xxx) e NASA DONKI/CCMC.")


if __name__ == "__main__":
    sys.exit(main())
