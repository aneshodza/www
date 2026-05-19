# Anes Hodza — Portfolio

Personal portfolio for **Anes Hodza**, Full-Stack Software- and Security-Engineer.
Bilingual: German default (`/`), English (`/en/`).

---

## Assigned visual direction: **D — Editorial restraint**

The brief described this direction as *Source Serif, EB Garamond, or Newsreader
paired with Inter. Generous leading. NYT obituary calm. Drop caps allowed only
on long-form pages.* The site reads like a typeset newspaper: a narrow column,
hairline rules between sections, italic captions, oxblood accent for links,
small-caps Inter labels above serif headings, and a drop cap reserved for the
About page.

### Fonts

- **Source Serif 4** (Google Fonts, self-hosted via `@fontsource/source-serif-4`)
  — body, headings, display.
- **Inter** (Google Fonts, self-hosted via `@fontsource/inter`)
  — labels, navigation, captions, buttons. The role split is strict: every
  serif is content, every sans is metadata.
- **JetBrains Mono** (Google Fonts, self-hosted via `@fontsource/jetbrains-mono`)
  — only inside `<code>` / `<pre>`.

No system fonts. No Google Fonts CDN.

### Palette

| Token  | Light                     | Dark                       |
| ------ | ------------------------- | -------------------------- |
| paper  | `#FBFAF7` (warm cream)    | `#14110D` (deep ink)       |
| ink    | `#1A1815`                 | `#ECE6D7`                  |
| muted  | `#4A463F` / `#807A6E`     | `#B8B0A0` / `#7A7468`      |
| rule   | `#D8D3C5`                 | `#2B2620`                  |
| accent | `#6B2B2B` (deep oxblood)  | `#C97373` (softened)       |

One accent. Used only on links on hover, the drop cap, the favicon rule, and
the focused link border.

---

## Stack

- **Astro 5** with TypeScript strict mode.
- **Tailwind CSS v4** via `@tailwindcss/vite`, design tokens in `@theme`.
- **Astro i18n** routing (`defaultLocale: 'de'`, `prefixDefaultLocale: false`).
- **View Transitions** via `<ClientRouter />`.
- **Content Collections** for `projects`, `experience`, `education`, all with Zod schemas.
- **Zero client framework**: vanilla TypeScript for the theme toggle and the
  projects-page tech filter. No React, no Vue, no Solid.

## Run

```bash
bun install
bun dev
```

…or `npm install && npm run dev`. Visit `http://localhost:4321/` (German) or
`http://localhost:4321/en/` (English).

Build:

```bash
bun run build
bun run preview
```

Type-check:

```bash
bun run check
```

---

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds on every push to `main` and publishes
`dist/` to GitHub Pages via the official `actions/deploy-pages` flow.

One-time setup:

1. Push the repo to GitHub.
2. Repo **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
3. Repo **Settings -> Pages -> Custom domain: `aneshodza.ch`** (the `public/CNAME`
   file is committed so this survives every deploy).
4. Point the DNS for `aneshodza.ch` at GitHub Pages (apex `A` records to the
   four GitHub IPs, or a `CNAME` for the `www` subdomain to
   `<your-user>.github.io`).
5. Tick **Enforce HTTPS** once the certificate provisions.

The workflow needs `bun.lock` committed (it is). `public/.nojekyll` is shipped
so GitHub Pages does not strip Astro's `_astro/` chunk directory.

### Deploying to a project page instead (no custom domain)

If you want `https://<user>.github.io/<repo>/` instead of `aneshodza.ch`:

1. Delete `public/CNAME`.
2. In `astro.config.mjs`, change `site` to `https://<user>.github.io` and add
   `base: '/<repo>'`.
3. Remove the **Custom domain** setting in repo Settings -> Pages.

---

## Design decisions

- **One column, one rule, one accent.** Sections are separated by thin
  horizontal rules (`var(--rule)`), never by colour blocks. The accent is
  oxblood and appears only where a recruiter actually has to look (link hover,
  drop cap, focused link border, favicon underline).
- **Inter is metadata, Source Serif is content.** Anything tracked, uppercase,
  and small (labels, dates, nav, captions, tags, button text) is sans. Everything
  with semantic weight (headlines, body, names) is serif.
- **Hero is a masthead.** A label (“Portfolio”), an issue line (date / location),
  then the name and tagline as the largest type on the site, followed by a
  single supporting sentence and two text-link CTAs. The portrait sits to the
  right of the masthead, with an italic figure caption.
- **Projects index uses a vanilla-TS tech filter.** Buttons are text with an
  underline, no chips. Filtering hides nothing fancy, just `display: none`
  with an empty-state line.
- **Project detail uses a two-column layout.** The tech stack is a sticky
  sidebar on desktop; the body is a narrow column for readability.
- **CV page prints cleanly.** A `.no-print` class hides the chrome and
  `@media print` swaps to black-on-white. The print button calls `window.print()`.
- **About page is the only place with a drop cap.** Faithful to the brief —
  drop caps allowed only on long-form pages.
- **i18n via shared view components.** Each route file is a 6-line wrapper that
  imports a `View` component from `~/components/pages/`. The view detects the
  locale from the URL and renders the right strings and collection entries.
  This keeps the route tree mirrored without duplicating layout code.
- **Theme toggle is islandless.** A single inline `<script>` in the `<head>`
  sets `class="dark"` before paint to avoid a flash; the toggle button itself
  is a tiny inline script in the component.
- **Favicon is a lowercase serif “a”** rendered in Source Serif 4 in the
  oxblood accent, sized to read clean at 16×16 and 32×32. SVG primary, ICO
  fallback.
- **Portrait placeholder is a real 400×500 JPEG.** Swapping the real portrait
  is a one-file replacement at `public/portrait.jpg`.

---

## Content rules in force

- No em-dashes or en-dashes in user-facing text. (This README is the only exception.)
- No `ß`. Swiss German uses `ss` throughout.
- Swiss German vocabulary and Swiss date format (`14.01.2026`).
- Technical keywords are bolded inline; the *Centro Labs*, *Hack Winterthur 2026*,
  *Co-founder*, *Teaching Assistant* signals are bolded too.
- Skills and tech stacks repeat the vocabulary recruiters search for:
  TypeScript, C#, Angular, NestJS, ASP.NET, Ruby on Rails, LangGraph.js,
  MCP, RAG, Qdrant, PostgreSQL, Bun, Docker, CI/CD, Scrum, TDD,
  security engineering.

## File layout

```
public/                favicon.svg, favicon.ico, portrait.jpg
src/
  components/          Header, Footer, Hero, ThemeToggle, LanguageSwitcher,
                       ProjectCard, ExperienceItem, EducationItem
  components/pages/    HomeView, ProjectsView, ProjectView, CVView,
                       AboutView, ContactView, NotFoundView
  content/             projects/{de,en}, experience/{de,en}, education/{de,en}
  content.config.ts    Zod schemas for the three collections
  i18n/                ui.ts (strings), utils.ts (locale helpers)
  layouts/Layout.astro Single layout, ClientRouter, OG meta, alt hreflang
  pages/               index, projects/[slug], cv, about, contact, 404
  pages/en/            mirror of the above
  styles/global.css    @theme tokens, base, components, print rules
astro.config.mjs       i18n routing + Tailwind
tsconfig.json          strict, noUncheckedIndexedAccess, path alias ~/*
```
