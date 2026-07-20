---
slug: mini-retrieve
locale: de
title: mini-retrieve
summary: Eine vollständige Information-Retrieval-Engine, von Grund auf in Rust gebaut. Handgeschriebener Tokenizer, Stemmer, Stopwort-Filter, invertierter Index und BM25-Scoring, die Cranfield-Anfragen mit MAP 0.2 in rund 70 Mikrosekunden pro Query beantwortet.
role: Autor
status: live
statusLabel: Live
year: "2025"
featured: false
order: 3.5
tech:
  - Rust
  - Information Retrieval
  - BM25
  - Invertierter Index
  - NLP
links:
  - label: GitHub
    url: https://github.com/aneshodza/mini-retrieve
---

Eine vollständige **Information-Retrieval**-Engine in **Rust**, ohne jede Such- oder NLP-Bibliothek. Die gesamte Pipeline ist handgeschrieben: Entfernen von Sonderzeichen, ein kleiner handgebauter **Stemmer**, **Stopwort**-Filterung und ein **invertierter Index** auf Basis von `HashMap`-Postings-Listen mit Metadaten pro Dokument und globalen Statistiken.

Das Ranking nutzt den **Okapi-BM25**-Algorithmus. Auf der **Cranfield**-Kollektion erreicht die Engine einen **MAP von ~0.2** und beantwortet Anfragen im Release-Build in rund **70µs**, also klar unter einer Millisekunde.

Die Engine bringt eine Reihe von `::`-Meta-Kommandos mit, die ihr Innenleben inspizierbar machen: `::reindex` zum Neuaufbau des Index, `::stats` für Index-Statistiken, `::postings <term>` zum Lesen einer Postings-Liste, `::doc <id>` zum Abrufen eines Dokuments und `::tokenize <query>`, um zu sehen, wie die Engine eine Eingabe genau verarbeitet. Ziel des Projekts war es, jede Schicht des Retrievals selbst zu bauen, von der Tokenisierung bis zum Ranking, statt sie zu importieren.
