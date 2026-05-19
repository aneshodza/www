---
slug: localmate
locale: en
title: LocalMate
summary: Agentic AI assistant for internal knowledge retrieval, built on MCP (Model Context Protocol). Targeted at any organisation that wants an overview of its own data.
role: Co-founder, technical lead
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
  - label: Live prototype
    url: https://winti.localmate.ch
---

LocalMate is an **agentic AI** assistant that uses **MCP (Model Context Protocol)** as its central abstraction for knowledge and tool integration. The assistant is built for organisations that want to make their internal documents and processes accessible to staff and external stakeholders without handing sensitive data to third parties.

Architecturally, LocalMate combines a **LangGraph.js** **ReAct** loop with dynamically loaded **MCP** tools. The backend runs on **NestJS** atop **Bun**, the frontend is an **Angular** application. Retrieval runs against a **Qdrant** vector database; structured data lives in **PostgreSQL**, accessed through **Drizzle ORM**. The full codebase sits in a **Turborepo** monorepo with end-to-end **TypeScript** typing.

LocalMate won the **Hack Winterthur 2026** hackathon. The live prototype at [winti.localmate.ch](https://winti.localmate.ch) currently handles roughly 600 queries per week. The product is privacy-first, single-tenant, and anonymous, with no user accounts.

We are currently looking for our first official partner organisations in Switzerland, across both the public and private sector, to deploy LocalMate in production.
