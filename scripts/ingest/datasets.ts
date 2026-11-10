// Open datasets in .data/sources shared by the ingest scripts (run `npm run ingest:fetch` first).
import { readdirSync, readFileSync } from 'node:fs';

export const SRC = '.data/sources';

export function readdirMatch(re: RegExp) {
  const f = readdirSync(SRC).find((n) => re.test(n));
  if (!f) throw new Error(`missing dataset ${re} in ${SRC}; run npm run ingest:fetch`);
  return `${SRC}/${f}`;
}

export type JmWord = {
  id: string;
  kanji: { text: string }[];
  kana: { text: string }[];
  sense: { partOfSpeech: string[]; gloss: { text: string }[] }[];
};

/** JMdict common entries (jmdict-simplified, CC BY-SA 4.0). */
export function loadJmdict(): JmWord[] {
  return JSON.parse(readFileSync(readdirMatch(/^jmdict-eng-common-.*\.json$/), 'utf8')).words;
}

export type FuriPart = { ruby: string; rt?: string };

/** JmdictFurigana ruby groups keyed by `${text}|${reading}`. */
export function loadFurigana(): Map<string, FuriPart[]> {
  const index = new Map<string, FuriPart[]>();
  for (const f of JSON.parse(readFileSync(`${SRC}/JmdictFurigana.json`, 'utf8').replace(/^﻿/, '')) as { text: string; reading: string; furigana: FuriPart[] }[]) {
    index.set(`${f.text}|${f.reading}`, f.furigana);
  }
  return index;
}
