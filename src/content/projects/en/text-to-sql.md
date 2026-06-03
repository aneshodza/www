---
slug: text-to-sql
locale: en
title: Evaluating LLMs on Text-to-SQL
summary: Course paper comparing three strategies for turning natural-language questions into SQL over real Swiss federal statistics, with a documented notebook that reproduces every step. The database-exploring agent does best on the hard questions, where grounding in the right year, geographic level, and exact categorical values matters most.
role: Co-author
status: archived
statusLabel: Archived
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
  - label: Report (Google Drive)
    url: https://drive.google.com/file/d/1sFv4ktlgIOtf23QgjB73a9o1WpDCtxHl/view
  - label: Source (GitHub)
    url: https://github.com/aneshodza/llm-to-sql
---

An investigation into how well different strategies turn natural-language questions into **SQL**, a task that predates LLMs and is still an active research area. A course project, co-authored with Vibishek Rathirajan, delivered as a short report plus a documented **Jupyter notebook** that reproduces every step.

We built three systems that share the same model and scoring and differ only in how they write the query: a **fixed grounding pipeline** (generate, value-grounding, execute, repair, self-refine), a **ReAct agent** that explores the database with read-only tools before answering, and a **hybrid** where the agent drafts the query and the pipeline cleans it up.

The benchmark is **StatBot.Swiss**, built on real data from the Swiss Federal Statistical Office. Answering correctly needs more than the schema: the right year, the right geographic level, the exact categorical values. That is what makes it a good grounding test. Stack: **Python**, **LangChain**, **LangGraph**, and **PostgreSQL**, with `gpt-oss-120b` served on Groq.

The database-exploring agent did best on the hard questions, where getting the answer right depends less on the SQL and more on resolving those grounding details before the query is ever written.
