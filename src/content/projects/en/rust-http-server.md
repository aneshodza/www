---
slug: rust-http-server
locale: en
title: rust-http-server
summary: Complete static-file HTTP server written in Rust with a worker pool for parallel request processing. Sockets are the only abstraction, everything else is hand rolled.
role: Author
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

A complete static-file HTTP server in **Rust**. The server accepts TCP connections directly through sockets, distributes them across a hand-built worker pool, and serves responses from the filesystem.

There is no HTTP library and no framework. Parsing of the request line and headers and the construction of responses are implemented in code. The codebase is fully **unit tested** and built in a **CI** pipeline.

A project meant to teach networking and concurrency fundamentals rather than abstractions over them.
