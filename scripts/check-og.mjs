// Checks the share cards without deploying: audits the meta tags on every built
// page, then renders each card into the crops the big platforms actually apply,
// so you can see what gets cut before anyone shares a link.
//
//   npm run build && npm run og:check      -> writes .og-preview.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.error('No dist/. Run `npm run build` first.');
  process.exit(1);
}

// ---- 1. Audit -------------------------------------------------------------

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const REQUIRED = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
const ADVISED = [
  'og:image:width',
  'og:image:height',
  'og:image:alt',
  'twitter:image:alt',
  'og:locale:alternate',
];

const problems = [];
const seenImages = new Set();
const pagesByImage = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const route = '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');

  for (const tag of REQUIRED) {
    if (!html.includes(`"${tag}"`)) problems.push([route, `MISSING required ${tag}`]);
  }

  const img = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (img) {
    seenImages.add(img);
    if (!pagesByImage.has(img)) pagesByImage.set(img, new Set());
    pagesByImage.get(img).add(route);
    if (!/^https?:\/\//.test(img)) {
      problems.push([route, `og:image is not absolute: ${img}`]);
    }
  }

  // twitter:image is what X and several chat clients actually read; a page
  // whose two image tags disagree will unfurl differently per platform.
  const twImg = html.match(/name="twitter:image" content="([^"]+)"/)?.[1];
  if (img && twImg && img !== twImg) {
    problems.push([route, `og:image and twitter:image disagree`]);
  }

  const url = html.match(/property="og:url" content="([^"]+)"/)?.[1];
  if (url && !/^https?:\/\//.test(url)) problems.push([route, `og:url is not absolute: ${url}`]);

  const desc = html.match(/property="og:description" content="([^"]*)"/)?.[1] ?? '';
  if (desc.length > 200) problems.push([route, `og:description is ${desc.length} chars (>200 gets truncated)`]);
}

const advisedMissing = ADVISED.filter(
  (t) => !fs.readFileSync(htmlFiles[0], 'utf8').includes(`"${t}"`),
);

console.log(`Audited ${htmlFiles.length} pages.\n`);

if (problems.length) {
  console.log('Problems:');
  for (const [route, msg] of problems) console.log(`  ${route.padEnd(34)} ${msg}`);
} else {
  console.log('No required tags missing, all URLs absolute.');
}

if (advisedMissing.length) {
  console.log('\nAdvised but absent:');
  for (const t of advisedMissing) console.log(`  ${t}`);
}

// ---- 2. Card facts --------------------------------------------------------
// Every distinct og:image the pages point at, resolved back to the file in
// public/ that has to exist for it. A card referenced but not generated is the
// failure that only shows up once someone shares the link.

const cards = [...seenImages].sort().map((url) => {
  const name = url.replace(/^https?:\/\/[^/]+\//, '');
  const file = path.join(root, 'public', name);
  return { url, name, file, exists: fs.existsSync(file) };
});

console.log(`\nCards in use: ${cards.length}`);

const missingCards = cards.filter((c) => !c.exists);
for (const c of missingCards) {
  console.log(`  ${c.name} — REFERENCED BUT NOT IN public/. Run \`npm run og\`.`);
}
if (missingCards.length) process.exitCode = 1;

// og:image is absolute, resolved against `site`. Serving this build from a
// tunnel does not change that, so a validator pointed at the tunnel will still
// download the card from whichever host is named here — i.e. production, which
// shows you the deployed card instead of the one you just built.
const hosts = [...new Set(cards.map((c) => new URL(c.url).host))];
console.log(`  cards will be fetched from: ${hosts.join(', ')}`);
if (!process.env.SITE_URL?.trim()) {
  console.log('  to preview over a tunnel, rebuild with SITE_URL set to the tunnel origin');
}

const present = cards.filter((c) => c.exists);
for (const c of present) {
  const buf = fs.readFileSync(c.file);
  c.buf = buf;
  c.width = buf.readUInt32BE(16);
  c.height = buf.readUInt32BE(20);
  c.kb = Math.round(buf.length / 1024);

  const pages = [...pagesByImage.get(c.url)].sort();
  const scope = pages.length > 3 ? `${pages.length} pages` : pages.join(', ');
  console.log(`  ${c.name.padEnd(12)} ${c.width}x${c.height}  ${String(c.kb).padStart(4)}KB  <- ${scope}`);
  if (c.width !== 1200 || c.height !== 630) console.log('    ! expected 1200x630');
  if (buf.length > 1024 * 1024) console.log('    ! over 1MB — some clients skip images this large');
  else if (buf.length > 600 * 1024) console.log('    ! over 600KB — WhatsApp may skip the preview');
}

// A card nobody points at is dead weight in the bundle.
for (const f of fs.readdirSync(path.join(root, 'public'))) {
  if (/^og[-.].*\.png$/.test(f) && !cards.some((c) => c.name === f)) {
    console.log(`  ${f} — present in public/ but no page references it`);
  }
}

// ---- 3. Visual preview ----------------------------------------------------

// Aspect ratios each surface crops the 1.91:1 card to. Anything outside the
// narrowest box is not guaranteed to survive.
const CROPS = [
  ['X / Twitter (summary_large_image)', 1.91, 'full card, rounded'],
  ['Slack unfurl', 1.91, 'full card, max 360px wide'],
  ['Discord', 1.91, 'full card'],
  ['LinkedIn', 1.91, 'full card'],
  ['Facebook feed', 1.91, 'full card'],
  ['iMessage / WhatsApp', 1.0, 'CENTRE SQUARE — sides cut'],
  ['Google Discover', 1.33, '4:3 — sides cut'],
];

const sections = present.map((c) => {
  const dataUri = `data:image/png;base64,${c.buf.toString('base64')}`;
  const frames = CROPS.map(([name, ratio, note]) => {
    const boxW = 460;
    const boxH = Math.round(boxW / ratio);
    // Scale the card so it fills the crop box by its limiting dimension, then
    // centre it — which is exactly what the platforms do.
    const scale = ratio < c.width / c.height ? boxH / c.height : boxW / c.width;
    const imgW = Math.round(c.width * scale);
    const imgH = Math.round(c.height * scale);
    return `<figure>
      <figcaption><b>${name}</b> <span>${note}</span></figcaption>
      <div class="crop" style="width:${boxW}px;height:${boxH}px">
        <img src="${dataUri}" style="width:${imgW}px;height:${imgH}px;
             margin-left:${Math.round((boxW - imgW) / 2)}px;
             margin-top:${Math.round((boxH - imgH) / 2)}px">
      </div>
    </figure>`;
  }).join('\n');

  const pages = [...pagesByImage.get(c.url)].sort();
  const scope = pages.length > 3 ? `${pages.length} pages` : pages.join(', ');
  return `<section>
    <h2>${c.name} <span>${c.width}&times;${c.height}, ${c.kb}KB &middot; ${scope}</span></h2>
    <div class="grid">${frames}</div>
  </section>`;
}).join('\n');

const out = path.join(root, '.og-preview.html');
fs.writeFileSync(out, `<!doctype html><meta charset="utf-8">
<title>share cards — platform crops</title>
<style>
  body{font:14px/1.5 ui-sans-serif,system-ui;margin:2rem;background:#14161b;color:#e8eaf0}
  h1{font-size:1.1rem;margin:0 0 .25rem}
  p.sub{color:#8b93a7;margin:0 0 2.5rem}
  h2{font-size:.95rem;margin:0 0 1rem;padding-top:1.5rem;border-top:1px solid #2a2f3a}
  h2 span{color:#8b93a7;font-weight:400;font-size:.9em}
  section+section{margin-top:2.5rem}
  .grid{display:flex;flex-wrap:wrap;gap:1.5rem}
  figure{margin:0}
  figcaption{margin-bottom:.5rem}
  figcaption span{color:#8b93a7;font-size:.85em}
  .crop{overflow:hidden;border-radius:10px;border:1px solid #2a2f3a;background:#000}
  .crop img{display:block}
</style>
<h1>Share cards</h1>
<p class="sub">How each surface crops them. Whatever must survive everywhere has to sit inside the square.</p>
${sections}`);

console.log(`\nWrote ${path.relative(root, out)} — open it to see the crops:`);
console.log(`  open ${path.relative(root, out)}`);
