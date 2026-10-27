import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const src = resolve(dist, 'sitemap-index.xml');
const dest = resolve(dist, 'sitemap.xml');

try {
  const content = await readFile(src, 'utf8');
  await writeFile(dest, content, 'utf8');
  console.log('[sitemap] Generated dist/sitemap.xml');
} catch (err) {
  console.error('[sitemap] Failed to generate dist/sitemap.xml:', err.message);
  process.exit(1);
}
