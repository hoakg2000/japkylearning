// Downloads KanjiVG stroke paths (CC BY-SA 3.0, Ulrich Apel) for the given characters
// and stores only the path data in public/strokes/<char-hex>.json (served statically).
// Usage: tsx scripts/fetch-strokes.ts [kana|kanji]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
const OUT = 'public/strokes';

function charsFor(kind: string): string[] {
  if (kind === 'kanji') {
    const kanji: { char: string }[] = JSON.parse(readFileSync('content/levels/n5/kanji.json', 'utf8'));
    return kanji.map((k) => k.char);
  }
  const kana = [
    ...JSON.parse(readFileSync('content/kana/hiragana.json', 'utf8')),
    ...JSON.parse(readFileSync('content/kana/katakana.json', 'utf8')),
  ] as { char: string }[];
  return [...new Set(kana.flatMap((k) => [...k.char]))];
}

const hex = (c: string) => c.codePointAt(0)!.toString(16).padStart(5, '0');

async function main() {
  mkdirSync(OUT, { recursive: true });
  const chars = charsFor(process.argv[2] ?? 'kana');
  let fetched = 0;
  const missing: string[] = [];
  for (const c of chars) {
    const file = `${OUT}/${hex(c)}.json`;
    if (existsSync(file)) continue;
    const res = await fetch(`${BASE}${hex(c)}.svg`);
    if (!res.ok) {
      missing.push(c);
      continue;
    }
    const svg = await res.text();
    // Stroke paths in drawing order; ids look like kvg:3042-s1.
    const strokes = [...svg.matchAll(/<path[^>]*\sid="kvg:[^"]*-s\d+"[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
    if (!strokes.length) {
      missing.push(c);
      continue;
    }
    writeFileSync(file, JSON.stringify({ char: c, strokes }) + '\n');
    fetched++;
  }
  console.log(`fetched ${fetched}, total ${chars.length}, missing: ${missing.join(' ') || 'none'}`);
}

main();
