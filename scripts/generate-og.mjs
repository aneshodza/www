import { chromium } from 'playwright-core';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4391;
const BASE = `http://localhost:${PORT}`;

// The card always advertises the real domain, regardless of what the page was
// built or served against -- SITE_URL exists to preview tunnelled builds, not
// to relabel what the card tells people to go visit.
const DISPLAY_URL = 'aneshodza.ch';
const FAVICON_SVG = fs.readFileSync(path.join(root, 'public', 'favicon.svg'), 'utf8');

/**
 * The share cards are composed from the real home pages, so they are the site
 * rather than an imitation of it: same faces, same palette, same lattice. Only
 * the proportions are retuned, because the hero's vertical rhythm does not fit
 * a 1200x630 crop and the name has to hold one line at that width.
 *
 * One card per locale: the line under the name is prose, and an English reader
 * should not be shown the German one. These filenames are the contract with
 * `socialImage` in src/layouts/Layout.astro.
 */
const TARGETS = [
  { route: '', file: 'og.png' },
  { route: 'en', file: 'og-en.png' },
];

const OG_CSS = `
  .hud, #cookie-notice, .foot, .stage-cta, .stage-foot, .plate, .kicker {
    display: none !important;
  }
  .stage { height: 630px !important; min-height: 0 !important; overflow: hidden !important; }

  /* Four things and nothing else: the brand tile top-left, the name and the
     role in the middle, the URL at the foot. A share card is read at thumbnail
     size in a feed, so the floor is ~28px at 1200 wide and the name and role
     each hold a single line. The tile and the URL are not part of the hero --
     the generator injects them (see the capture loop). */
  .stage-inner {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
    height: 630px !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: auto 1fr auto !important;
    row-gap: 0 !important;
    padding: 56px 64px !important;
    max-width: none !important;
  }

  .og-brand {
    grid-row: 1 !important;
    display: block !important;
  }
  /* The favicon markup carries its own width/height attributes; override them
     rather than the wrapper, or the intrinsic 32px wins. */
  .og-brand svg {
    display: block !important;
    width: 68px !important;
    height: 68px !important;
  }

  .title {
    grid-row: 2 !important;
    align-content: center !important;
    gap: 26px !important;
  }
  .title-name {
    font-size: 120px !important;
    line-height: 0.94 !important;
    letter-spacing: -0.04em !important;
  }
  .title-role {
    font-size: 46px !important;
    line-height: 1.12 !important;
    max-width: none !important;
  }

  /* The URL as instrumentation: Inter, the same readout voice the site uses,
     scaled up to survive the feed. */
  .og-url {
    grid-row: 3 !important;
    margin: 0 !important;
    font-family: var(--font-sans) !important;
    font-size: 28px !important;
    font-weight: 500 !important;
    letter-spacing: 0.005em !important;
    color: var(--ink-2) !important;
    font-variant-numeric: tabular-nums lining-nums !important;
  }

  /* The machine is the whole backdrop now, so the wash does the same job it
     does on the real page at desktop: opaque under the reading column on the
     left, clearing to the right where the lattice is allowed to be loud. */
  .field-canvas { opacity: 1 !important; }
  .field-wash {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--field) 80%, transparent) 0%,
      color-mix(in srgb, var(--field) 64%, transparent) 38%,
      color-mix(in srgb, var(--field) 22%, transparent) 68%,
      transparent 88%
    ) !important;
  }
`;

console.log('Building site…');
if (spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' }).status !== 0) {
  process.exit(1);
}

console.log('Starting preview server…');
const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
  detached: true,
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {
    }
    await sleep(500);
  }
  throw new Error('preview server did not start');
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    return await chromium.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    });
  }
}

try {
  await waitForServer();
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('cookie-notice-dismissed', '1');
    } catch {}
  });

  for (const { route, file } of TARGETS) {
    // A fresh page per card. The field owns a persistent WebGL context that is
    // deliberately kept across navigations, so reusing one page would carry the
    // already-settled lattice into the next card instead of growing it again.
    const page = await context.newPage();
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle' });
    // Give the deferred field time to compile its shaders and settle.
    await page.waitForTimeout(3800);
    // Park the descent deep enough that the lattice reads as an open volume and
    // the accent has begun to warm -- the card is a slice of the descent, not a
    // portrait of the surface.
    await page.evaluate(() => window.__field?.configure({ base: 0.62, range: 0, strength: 1 }));
    // The brand tile and the URL are not part of the hero -- they exist only on
    // the card -- so they are injected rather than styled out of real markup,
    // the way OG_CSS does for everything else here.
    await page.evaluate(
      ([svg, url]) => {
        const stageInner = document.querySelector('.stage-inner');
        const brand = document.createElement('div');
        brand.className = 'og-brand';
        brand.innerHTML = svg;
        stageInner.prepend(brand);
        const urlEl = document.createElement('p');
        urlEl.className = 'og-url';
        urlEl.textContent = url;
        stageInner.append(urlEl);
      },
      [FAVICON_SVG, DISPLAY_URL],
    );
    await page.addStyleTag({ content: OG_CSS });
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(root, 'public', file) });
    console.log(`Wrote public/${file}`);
    await page.close();
  }

  await browser.close();
} finally {
  try {
    process.kill(-server.pid);
  } catch {
  }
}

console.log('Done. Run `npm run build` to bundle the refreshed cards.');
