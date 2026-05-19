---
slug: http-c
locale: de
title: http.c
summary: Multithreaded HTTP/1.1-Server in reinem C mit eigenem Thread-Pool, MIME-Type-Erkennung, eigenen Fehlerseiten, gzip-fähiger Response-Negotiation und CUnit-Test-Suite.
role: Autor
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

Ein multithreaded HTTP/1.1-Server in reinem **C**, gebaut mit einem **Makefile** und einer eigenen **CUnit**-Test-Suite. Anfragen werden über einen handgeschriebenen **Thread-Pool** parallel verarbeitet.

Der Server kann **MIME-Typen** anhand der Dateiendung bestimmen, liefert eigene Fehlerseiten aus und versteht **gzip**-Negotiation: Clients, die gzip akzeptieren, erhalten komprimierte Responses, die anderen den unkomprimierten Originalinhalt.

Das Projekt ist bewusst klein gehalten, deckt aber sehr nahe an Hardware-Niveau ab, was bei höheren Sprachen typischerweise im Framework verschwindet.
