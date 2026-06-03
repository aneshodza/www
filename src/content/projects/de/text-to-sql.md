---
slug: text-to-sql
locale: de
title: Evaluating LLMs on Text-to-SQL
summary: Kurspaper, das drei Strategien vergleicht, um natürlichsprachliche Fragen über echten Schweizer Bundesstatistiken in SQL zu übersetzen, mit einem dokumentierten Notebook, das jeden Schritt reproduzierbar macht. Der datenbankerkundende Agent schneidet bei den schweren Fragen am besten ab, gerade dort, wo das richtige Jahr, die richtige geografische Ebene und die exakten kategorischen Werte am meisten zählen.
role: Co-Autor
status: archived
statusLabel: Archiviert
year: "2026"
featured: false
order: 2.5
tech:
  - LLMs
  - Text-to-SQL
  - LangChain
  - LangGraph
  - PostgreSQL
  - Python
links:
  - label: Bericht (Google Drive)
    url: https://drive.google.com/file/d/1sFv4ktlgIOtf23QgjB73a9o1WpDCtxHl/view
  - label: Quellcode (GitHub)
    url: https://github.com/aneshodza/llm-to-sql
---

Eine Untersuchung, wie gut verschiedene Strategien natürlichsprachliche Fragen in **SQL** übersetzen, eine Aufgabe, die älter ist als LLMs und nach wie vor ein aktives Forschungsfeld bleibt. Ein Kursprojekt, gemeinsam mit Vibishek Rathirajan verfasst, abgeliefert als kurzer Bericht samt dokumentiertem **Jupyter-Notebook**, das jeden Schritt reproduzierbar macht.

Wir haben drei Systeme gebaut, die sich dasselbe Modell und dieselbe Bewertung teilen und sich nur darin unterscheiden, wie sie die Query schreiben: eine **feste Grounding-Pipeline** (Generieren, Value-Grounding, Ausführen, Reparieren, Self-Refine), ein **ReAct-Agent**, der die Datenbank vor der Antwort mit Read-only-Tools erkundet, und ein **Hybrid**, bei dem der Agent die Query entwirft und die Pipeline sie bereinigt.

Der Benchmark ist **StatBot.Swiss**, aufgebaut auf echten Daten des Bundesamts für Statistik. Eine korrekte Antwort braucht mehr als das Schema: das richtige Jahr, die richtige geografische Ebene, die exakten kategorischen Werte. Genau das macht ihn zu einem guten Grounding-Test. Stack: **Python**, **LangChain**, **LangGraph** und **PostgreSQL**, mit `gpt-oss-120b` auf Groq.

Der datenbankerkundende Agent schnitt bei den schweren Fragen am besten ab. Dort hängt die richtige Antwort weniger am SQL als daran, diese Grounding-Details aufzulösen, bevor die Query überhaupt geschrieben wird.
