// Renders the CV routes to print-accurate A4 PDFs in public/, so the CV page can
// offer a direct download instead of relying on the browser's Print dialog
// (which re-paginates and can slice lines at the page boundary).
//
// Run after editing CV content:  npm run cv:pdf
// Then `npm run build` bundles the refreshed PDFs.
import { chromium } from 'playwright-core';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4390;
const BASE = `http://localhost:${PORT}`;

// Filenames must match `printFilename` in src/components/pages/CVView.astro.
const targets = [
  { route: 'cv', file: 'Lebenslauf_Anes_Hodza.pdf' },
  { route: 'en/cv', file: 'CV_Anes_Hodza.pdf' },
];

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
      if ((await fetch(`${BASE}/cv`)).ok) return;
    } catch {
      // server not up yet
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
  const page = await browser.newPage();
  for (const { route, file } of targets) {
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: path.join(root, 'public', file),
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    });
    console.log(`Wrote public/${file}`);
  }
  await browser.close();
} finally {
  try {
    process.kill(-server.pid);
  } catch {
    // already gone
  }
}

console.log('Done. Run `npm run build` to bundle the refreshed PDFs.');
