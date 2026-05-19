---
slug: ngx-blogdown
locale: en
title: ngx-blogdown
summary: Open-source Angular library for Markdown-driven blogs. Strictly data-layer-only. Consumers control HTML, CSS, and routing.
role: Author and maintainer
status: live
statusLabel: Live
year: "2026"
featured: false
order: 4
tech:
  - TypeScript
  - Angular
  - js-yaml
  - CLI
  - npm
links:
  - label: npm package
    url: https://www.npmjs.com/package/@centrolabs/ngx-blogdown
---

ngx-blogdown is a lean **Angular** library that enables a Markdown-driven blogging experience without prescribing a full CMS or templating engine. The library ships only the data layer: frontmatter parsing with **js-yaml**, a **CLI** for index generation, and type-safe **TypeScript** services for accessing posts.

The philosophy is deliberately minimal: consumers own HTML, CSS, and routing inside their own Angular application. ngx-blogdown only handles what cannot reasonably be reinvented.

Published on **npm** under the Centro Labs organisation as `@centrolabs/ngx-blogdown`.
