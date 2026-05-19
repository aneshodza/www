---
slug: rust-http-server
locale: de
title: rust-http-server
summary: Vollständiger statischer HTTP-Server in Rust mit einem Worker-Pool für parallele Anfrageverarbeitung. Sockets sind die einzige Abstraktion, alles andere ist handgeschrieben.
role: Autor
status: live
statusLabel: Live
year: "2024"
featured: false
order: 6
tech:
  - Rust
  - HTTP
  - Sockets
  - Worker Pool
  - CI
links:
  - label: GitHub
    url: https://github.com/aneshodza/rust-http-server
---

Ein vollständiger statischer HTTP-Server in **Rust**. Der Server akzeptiert TCP-Verbindungen direkt über Sockets, verteilt sie an einen handgebauten Worker-Pool und beantwortet Anfragen aus dem Dateisystem.

Es gibt keine HTTP-Bibliothek und kein Framework. Das Parsing der Request-Line, der Header und die Erzeugung der Response laufen über eigene Implementierungen. Die Codebasis ist vollständig **Unit-getestet** und wird in einer **CI**-Pipeline gebaut.

Ein Projekt, das Netzwerk- und Concurrency-Grundlagen anstelle von Abstraktionen vermittelt.
