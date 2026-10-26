// CI guard (ADR 0013): public pages must stay prerendered. Reads the build manifest after `next build`.
import { readFileSync } from 'node:fs';

const required = ['/vi', '/en'];
const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'));
const routes = Object.keys(manifest.routes);
const missing = required.filter((r) => !routes.includes(r));
if (missing.length) {
  console.error(`Not prerendered: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`Static OK: ${required.join(', ')}`);
