---
slug: http-c
locale: en
title: http.c
summary: Multithreaded HTTP/1.1 server in pure C with a custom thread pool, MIME type detection, custom error pages, gzip aware response negotiation, and a CUnit test suite.
role: Author
status: live
statusLabel: Live
year: "2025"
featured: false
order: 7
tech:
  - C
  - Makefile
  - CUnit
  - HTTP/1.1
  - Threads
links:
  - label: GitHub
    url: https://github.com/aneshodza/http.c
---

A multithreaded HTTP/1.1 server in pure **C**, built with a **Makefile** and a dedicated **CUnit** test suite. Requests run in parallel on a hand-written **thread pool**.

The server detects **MIME types** from the file extension, serves its own error pages, and supports **gzip** negotiation: clients that accept gzip get a compressed response, others receive the original content.

The project is deliberately small in scope but covers what higher-level languages typically hide behind a framework, very close to the metal.
