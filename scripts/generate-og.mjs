import { chromium } from 'playwright-core';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4391;
const BASE = `http://localhost:${PORT}`;

/**
 * The share card is composed from the real home page, so it is the site rather
 * than an imitation of it: same faces, same palette, same lattice. Only the
 * proportions are retuned, because the hero's vertical rhythm does not fit a
 * 1200x630 crop and the name has to hold one line at that width.
 */
const OG_CSS = `
  .hud, #cookie-notice, .foot, .stage-cta { display: none !important; }
  .stage { height: 630px !important; min-height: 0 !important; overflow: hidden !important; }

  /* The card is built on the site's loudest move: the display type running the
     full width, low in the frame, with the machine above it. */
  .stage-inner {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
    height: 630px !important;
    display: grid !important;
    grid-template-rows: auto 1fr auto !important;
    grid-template-columns: minmax(0, 1fr) !important;
    padding: 46px 60px 52px !important;
    row-gap: 0 !important;
    max-width: none !important;
  }

  .kicker { grid-row: 1 !important; font-size: 15px !important; letter-spacing: 0.02em !important; }
  .kicker::before { width: 8px !important; height: 8px !important; }

  .title {
    grid-row: 3 !important;
    align-content: end !important;
    gap: 10px !important;
  }
  .title-name {
    font-size: 122px !important;
    line-height: 0.86 !important;
    letter-spacing: -0.044em !important;
  }
  .title-role {
    font-size: 30px !important;
    line-height: 1.1 !important;
    max-width: none !important;
  }

  .stage-foot {
    grid-row: 3 !important;
    align-self: end !important;
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
    position: absolute !important;
    inset-inline-end: 60px !important;
    inset-block-end: 52px !important;
    width: 320px !important;
  }
  .support {
    font-size: 16px !important;
    line-height: 1.45 !important;
    max-width: none !important;
    text-align: right !important;
    color: var(--ink-3) !important;
  }

  /* Contained, not floating: a plate the size the hero gives it, sitting in
     the upper right where the lattice is loudest. */
  .plate {
    position: absolute !important;
    inset-block-start: 40px !important;
    inset-inline-end: 60px !important;
    width: 268px !important;
    height: 335px !important;
    aspect-ratio: auto !important;
    margin: 0 !important;
    border: 1px solid var(--edge) !important;
    border-radius: 12px !important;
    box-shadow: 0 30px 70px -36px rgb(0 0 0 / 0.75) !important;
    z-index: 2 !important;
  }
  .plate img {
    object-position: 50% 20% !important;
    filter: saturate(0.62) brightness(0.9) contrast(1.05) !important;
  }

  /* The machine is the subject here, not a texture behind a wash. */
  .field-canvas { opacity: 1 !important; }
  .field-wash {
    background: linear-gradient(
      190deg,
      transparent 0%,
      color-mix(in srgb, var(--field) 30%, transparent) 46%,
      color-mix(in srgb, var(--field) 88%, transparent) 82%
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

  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // Give the deferred field time to compile its shaders and settle.
  await page.waitForTimeout(3800);
  // Park the descent deep enough that the lattice reads as an open volume and
  // the accent has begun to warm -- the card is a slice of the descent, not a
  // portrait of the surface.
  await page.evaluate(() => window.__field?.configure({ base: 0.62, range: 0, strength: 1 }));
  await page.addStyleTag({ content: OG_CSS });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(root, 'public', 'og.png') });
  console.log('Wrote public/og.png');

  await browser.close();
} finally {
  try {
    process.kill(-server.pid);
  } catch {
  }
}

console.log('Done. Run `npm run build` to bundle the refreshed card.');
