// Extracts every user-visible text string + meta text from the built site.
// Used to prove a redesign changed zero copy.
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const dist = process.argv[2] ?? 'dist';
const out = process.argv[3] ?? 'text-baseline.json';

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) files.push(...walk(p));
    else if (p.endsWith('.html')) files.push(p);
  }
  return files;
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&middot;/g, '·')
    .replace(/&rarr;/g, '→')
    .replace(/&larr;/g, '←')
    .replace(/&copy;/g, '©')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();

const result = {};
for (const file of walk(dist).sort()) {
  const route = '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  let html = readFileSync(file, 'utf8');

  // meta / title text
  const meta = [];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) meta.push('title: ' + norm(title[1]));
  for (const m of html.matchAll(/<meta\s+[^>]*?(?:name|property)=["']([^"']+)["'][^>]*?content=["']([^"']*)["'][^>]*>/gi)) {
    if (/description|og:title|og:description|og:site_name|twitter:title|twitter:description|author/i.test(m[1]))
      meta.push(`${m[1]}: ${norm(m[2])}`);
  }
  // aria-labels, alt, placeholder, download names
  const attrs = [];
  for (const m of html.matchAll(/\b(aria-label|alt|placeholder|title)=["']([^"']+)["']/gi)) {
    const v = norm(m[2]);
    if (v) attrs.push(`${m[1]}: ${v}`);
  }

  // body text
  let body = html.match(/<body[\s\S]*?>([\s\S]*)<\/body>/i)?.[1] ?? html;
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const nodes = [];
  for (const chunk of body.split(/<[^>]*>/g)) {
    const v = norm(chunk);
    if (v) nodes.push(v);
  }

  result[route] = {
    meta: meta.sort(),
    attrs: [...new Set(attrs)].sort(),
    // Full page text, whitespace-collapsed: layout-independent.
    text: norm(nodes.join(' ')),
    // Word multiset fingerprint: catches additions/removals regardless of order.
    words: nodes.join(' ').split(/\s+/).map(norm).filter(Boolean).sort(),
  };
}

mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 2));
console.log(`Wrote ${out}: ${Object.keys(result).length} routes`);
