// CI guard (ADR 0013): public pages must stay prerendered. Reads the build manifest after `next build`.
import { readFileSync } from 'node:fs';

const required = ['/vi', '/en', '/vi/kana', '/en/kana', '/vi/learn', '/en/learn', '/vi/learn/n5/1', '/en/learn/n5/10', '/vi/kanji', '/vi/kanji/学', '/en/words/jmdict-1206900'];
const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'));
const routes = Object.keys(manifest.routes);
const missing = required.filter((r) => !routes.includes(r));
if (missing.length) {
  console.error(`Not prerendered: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`Static OK: ${required.join(', ')}`);
