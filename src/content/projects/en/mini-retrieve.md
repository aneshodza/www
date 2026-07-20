---
slug: mini-retrieve
locale: en
title: mini-retrieve
summary: A full information-retrieval engine written from scratch in Rust. Hand-rolled tokeniser, stemmer, stop-word removal, inverted index, and BM25 scoring, answering Cranfield queries at MAP 0.2 in roughly 70 microseconds per query.
role: Author
status: live
statusLabel: Live
year: "2025"
featured: false
order: 3.5
tech:
  - Rust
  - Information Retrieval
  - BM25
  - Inverted Index
  - NLP
links:
  - label: GitHub
    url: https://github.com/aneshodza/mini-retrieve
---

A complete **information-retrieval** engine in **Rust**, built without any search or NLP libraries. The whole pipeline is hand-written: special-character stripping, a small hand-rolled **stemmer**, **stop-word** removal, and an **inverted index** backed by `HashMap` postings lists with per-document metadata and global statistics.

Ranking uses the **Okapi BM25** algorithm. On the **Cranfield** collection the engine reaches a **MAP of ~0.2** and answers queries in roughly **70µs** in release mode, well under a millisecond.

The engine ships a set of `::` meta-commands that make its internals inspectable: `::reindex` to rebuild the index, `::stats` for index statistics, `::postings <term>` to read a postings list, `::doc <id>` to fetch a document, and `::tokenize <query>` to see exactly how the engine processes input. The point of the project was to own every layer of retrieval, from tokenisation to ranking, instead of importing it.
