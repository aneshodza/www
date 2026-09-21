// Copies the latin variable font files we actually use into public/fonts/ so
// they have stable, preloadable paths. Run after bumping the fontsource deps.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'fonts');
mkdirSync(out, { recursive: true });

const files = [
  ['@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2', 'serif.woff2'],
  ['@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2', 'serif-italic.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'sans.woff2'],
];

for (const [from, to] of files) {
  const src = path.join(root, 'node_modules', from);
  const dest = path.join(out, to);
  copyFileSync(src, dest);
  console.log(`${to.padEnd(20)} ${(statSync(dest).size / 1024).toFixed(1)} KB`);
}
