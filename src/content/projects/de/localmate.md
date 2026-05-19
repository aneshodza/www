---
slug: localmate
locale: de
title: LocalMate
summary: Agentischer KI-Assistent für interne Wissensabfragen, gebaut auf MCP (Model Context Protocol). Zugeschnitten auf alle Organisationen, welche einen Überblick über ihre Daten haben wollen.
role: Mitgründer, technischer Lead
status: live
statusLabel: Live
year: "2026"
featured: true
order: 1
tech:
  - TypeScript
  - LangGraph.js
  - MCP (Model Context Protocol)
  - NestJS
  - Bun
  - Angular
  - Qdrant
  - PostgreSQL
  - Drizzle ORM
  - Turborepo
  - RAG
links:
  - label: localmate.ch
    url: https://localmate.ch
  - label: Live-Prototyp
    url: https://winti.localmate.ch
---

LocalMate ist ein agentischer **KI-Assistent**, der **MCP (Model Context Protocol)** als zentrale Abstraktion für Wissens- und Werkzeug-Integration einsetzt. Der Assistent richtet sich an Organisationen, die ihre internen Dokumente und Prozesse für Mitarbeitende und externe Stakeholder zugänglich machen wollen, ohne sensible Daten an Dritte abzugeben.

Architektonisch kombiniert LocalMate eine **LangGraph.js**-basierte **ReAct**-Schleife mit dynamisch geladenen **MCP**-Werkzeugen. Das Backend läuft auf **NestJS** unter **Bun**, das Frontend ist eine **Angular**-Anwendung. Retrieval geschieht gegen eine **Qdrant**-Vektordatenbank, strukturierte Daten liegen in **PostgreSQL**, angesteuert über **Drizzle ORM**. Der gesamte Code lebt in einem **Turborepo**-Monorepo mit durchgehender **TypeScript**-Typisierung.

LocalMate wurde am **Hack Winterthur 2026** als Sieger ausgezeichnet. Der Live-Prototyp unter [winti.localmate.ch](https://winti.localmate.ch) beantwortet aktuell rund 600 Anfragen pro Woche. Das Produkt ist privatsphäre-orientiert, single-tenant und anonym, ohne Nutzerkonten.

Derzeit suchen wir die ersten offiziellen Partnerorganisationen in der Schweiz aus dem öffentlichen und privaten Sektor, die LocalMate produktiv einsetzen möchten.
