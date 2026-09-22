# Anes Hodza — Portfolio

Personal site for **Anes Hodza**, Full-Stack Software- and Security-Engineer.
Bilingual: German default (`/`), English (`/en/`).

---

## Concept: **Descent**

The site is one continuous vertical descent through the layers of a computer —
surface interface, runtime, protocol, socket, silicon — and every project sits
at the depth it was actually built at.

That is not a metaphor bolted on afterwards; it is the through-line of the work
itself. `mini-retrieve` is "no search library, I wrote the tokeniser, stemmer,
inverted index and BM25 myself". `http.c` is "what usually disappears into the
framework". `rust-http-server`: "sockets are the only abstraction". MNIST: "no
ML framework, I wrote back-propagation myself". Every entry is *I went one layer
below where people stop*, so the navigation is the thesis and the ordinals on
`/projects` (`01`–`10`) are a depth scale rather than decoration.

### The field

A hand-written WebGL2 point lattice renders behind every page except the CV.
Point positions are derived from `gl_VertexID`, so there are no attribute
buffers, no geometry upload and exactly one draw call per frame — the whole
scene is a dozen uniforms. No three.js: for a point lattice that would be
~150 KB of parse cost to replace a `for` loop.

Scrolling tilts the camera, widens the lens and lights more of the layers
underneath, so the structure opens as you descend. Each layer is rotated a
little further than the one above it, so the columns never line up into a
starburst and descending turns the whole thing like a screw.

The camera pulls back in proportion to how portrait the viewport is: a fixed
world-space framing puts a phone inside the near field, where the lattice reads
as out-of-focus blobs rather than structure.

Every camera parameter is a critically-damped spring reading scroll and pointer,
so the moves interrupt each other cleanly. The pointer parts the field in clip
space — which is why there is no custom cursor; the field *is* the cursor.

The lattice is driven by scroll position, not by a clock: descending moves it,
standing still stops it. It only *starts* travelling once it has opened — while
a single plane is lit, translating it reads as that plane sliding away and the
next one snapping in behind. Every page except home also arrives with the
lattice already part-open (`openFloor`), because the single-plane state is the
home surface's signature and everywhere else it just reads as an empty screen. Once the springs settle and the pointer is idle the
render loop **shuts down entirely**, so a reader sitting on a page costs zero
frames. Reading pages also render at 1× backing scale with a shorter lattice,
because the field is composited at ~40% opacity there and resolution is the
dominant per-frame cost. Nothing on the site uses `backdrop-filter`: every
surface sat over a full-viewport canvas that repaints on scroll, and re-blurring
that region each frame bought nothing over a slightly more opaque veil.

- `src/scripts/field.ts` — the renderer, ~7 KB, zero dependencies
- `src/lib/depth.ts` — where each page and project sits on the 0…1 depth axis

Shaders are linked asynchronously via `KHR_parallel_shader_compile` and the
whole module is dynamically imported after `load` → `requestIdleCallback`, so it
contributes nothing to blocking time.

### Fonts

| Face | Role |
| --- | --- |
| **Source Serif 4 Variable** (wght 200–900, normal + italic) | display at weight 800, headings, all reading text |
| **Inter Variable** | instrumentation only: navigation, numerals, readouts, form controls |

Two families, nothing else — inline `code` sets in Inter with tabular figures.
Latin-only variable files are copied to `public/fonts/` by `npm run fonts` so
they sit at stable, preloadable paths: **147 KB total** for the full 200–900
range plus italics.

No tracked-out ALL-CAPS labels anywhere on screen. The print CV keeps its own.

### Palette

Cold at the surface, warm at depth: colour temperature carries position rather
than decorating. Pages set `--depth` (0 = surface, 1 = silicon) and `--accent`
interpolates between the two.

| Token | Light | Dark |
| --- | --- | --- |
| field | `#EEF0F5` porcelain | `#06070B` |
| shelf | `#FFFFFF` | `#0C0E15` |
| ink | `#0A0C12` | `#EDEFF5` |
| ink-2 / ink-3 | `#4A5162` / `#5A6170` | `#9AA1B4` / `#767E92` |
| **signal** (surface) | `#1F35D6` | `#3A5BFF` |
| **ember** (depth) | `#B4590B` | `#FF9A2E` |

A straight blue→amber ramp passes through grey, so the shader re-saturates the
midpoint and the heat arrives late — most of the descent is still cold.

---

## Stack

- **Astro 5**, TypeScript strict, static output.
- **Tailwind CSS v4** via `@tailwindcss/vite`; the design system is hand-written
  in `src/styles/global.css` and Tailwind supplies layout utilities.
- **Astro i18n** (`defaultLocale: 'de'`, `prefixDefaultLocale: false`).
- **View Transitions** via `<ClientRouter />`. The canvas is
  `transition:persist`, so the camera keeps descending into the next page
  instead of restarting — navigating is motion through one continuous space.
- **Content Collections** for `projects`, `experience`, `education`, Zod-typed.
- **CSS scroll-driven animations** (`animation-timeline`) for the pinned hero
  and the HUD material — no JS, no main-thread work. Unsupported browsers get
  the finished state.
- **Native scrolling.** A smooth-scroll library was tried and removed: it
  stretched every wheel tick into ~750 ms of settle time, which reads as lag on
  long pages. Native scroll settles in ~65 ms.
- **Zero client framework, zero runtime dependencies.**

### Reduced motion

`prefers-reduced-motion: reduce` gets a still version, not a broken one: the
lattice renders a single frame held at a three-quarter view — a photogram of the
structure — the camera loop never starts, and every scroll-driven animation is
skipped at its finished pose.

## Run

```bash
bun install
bun dev
```

Build and preview:

```bash
bun run build
bun run preview
```

Type-check: `bun run check`. Refresh the font files after bumping the
`@fontsource-variable/*` deps: `node scripts/sync-fonts.mjs`.

---

## Measured

Lighthouse, mobile, against the production build:

| Route | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 |
| `/projects` | 100 | 100 | 100 | 100 |
| `/projects/localmate` | 100 | 100 | 100 | 100 |
| `/cv` | 100 | 100 | 100 | 100 |
| `/contact` | 100 | 100 | 100 | 100 |
| `/en/` | 100 | 100 | 100 | 100 |

FCP and LCP 0.9 s, TBT 0 ms.

### Text integrity

`scripts/extract-text.mjs` walks the built HTML and dumps every text node, page
title, meta description, `alt`, `aria-label` and `title` per route. The redesign
was verified against a baseline captured from the previous build:
**zero unintended differences across 30 routes and 8,198 words.**

Two deliberate deltas: the separator glyphs the old layout generated (`→`, `←`,
`/`, `©`), which the new layout replaces with structure, and the full stop the
template used to append after the name (`Anes Hodza.` → `Anes Hodza`) on the
home and CV pages in both languages.

```bash
node scripts/extract-text.mjs dist text.json
```

---

## Pages

- **`/`** — the descent. Surface, the drop, the featured project at depth, exit.
- **`/projects`** — a section drawing: a depth axis with each project pinned at
  its layer.
- **`/projects/[slug]`** — arrival at one layer. The page's field colour and
  density match that project's depth constant.
- **`/cv`** — a document, not a scene: it opts out of the field entirely
  (`bare`). Its section structure is unchanged from the previous design; it sits
  on the site's own frame so its edges line up with the header and footer, and
  colour and type were brought onto the new system.
- **`/contact`** — the floor of the descent. Amber, dense, at rest.
- **`/404`** — a depth with nothing at it.

The CV page also carries a hidden single-page A4 print document (`.cv-doc`) that
only the print path renders; `npm run cv:pdf` drives Chrome over it to
regenerate `public/CV_Anes_Hodza.pdf` and `public/Lebenslauf_Anes_Hodza.pdf`.

`npm run og` composes the share card from the real home page — same faces,
palette and lattice, with the proportions retuned for a 1200x630 crop.

---

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds on every push to `main` and publishes
`dist/` via `actions/deploy-pages`.

One-time setup:

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Settings → Pages → Custom domain: `aneshodza.ch`** (`public/CNAME` is
   committed so this survives every deploy).
4. Point DNS at GitHub Pages (apex `A` records, or a `CNAME` for `www`).
5. Tick **Enforce HTTPS** once the certificate provisions.

`bun.lock` and `public/.nojekyll` are committed; the latter keeps Pages from
stripping Astro's `_astro/` directory.

---

## Content rules in force

- No em-dashes or en-dashes in user-facing text. (This README is the exception.)
- No `ß`. Swiss German uses `ss` throughout.
- Swiss German vocabulary and Swiss date format (`14.01.2026`).
- Technical keywords are bolded inline.

## File layout

```
public/
  fonts/               serif.woff2, serif-italic.woff2, sans.woff2
  favicon.svg .ico, og.png, portrait.jpg, CV/Lebenslauf PDFs
src/
  assets/portrait.jpg  processed by astro:assets into avif/webp srcsets
  components/          Field, Surface, Hud, Feature, Footer, CookieNotice,
                       ThemeToggle, LanguageSwitcher, LanguageBar,
                       ExperienceItem, EducationItem
  components/pages/    HomeView, ProjectsView, ProjectView, CVView,
                       ContactView, NotFoundView
  content/             projects/{de,en}, experience/{de,en}, education/{de,en}
  lib/depth.ts         where each page sits on the depth axis
  scripts/field.ts     the WebGL2 lattice
  i18n/                ui.ts (strings), utils.ts (locale helpers)
  layouts/Layout.astro single layout, ClientRouter, OG meta, alt hreflang
  pages/               index, projects/[slug], cv, contact, 404 (+ /en mirror)
  styles/global.css    tokens, type scale, component classes, print rules
scripts/
  sync-fonts.mjs       copy latin variable fonts into public/fonts
  extract-text.mjs     dump every visible string from a build
  generate-cv-pdf.mjs  drive Chrome over the print CV
  generate-og.mjs      compose public/og.png from the real home page
```
