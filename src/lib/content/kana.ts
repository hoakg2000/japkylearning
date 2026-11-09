import hiraganaJson from '../../../content/kana/hiragana.json';
import katakanaJson from '../../../content/kana/katakana.json';
import type { Kana } from './schemas';

export const hiragana = hiraganaJson as Kana[];
export const katakana = katakanaJson as Kana[];

export type Script = Kana['script'];
export const kanaOf = (script: Script) => (script === 'hiragana' ? hiragana : katakana);

/** Rows in display order for the gojūon grid, grouped by kind. */
export function kanaRows(script: Script) {
  const rows = new Map<string, Kana[]>();
  for (const k of kanaOf(script)) rows.set(k.row, [...(rows.get(k.row) ?? []), k]);
  return [...rows.entries()].map(([row, items]) => ({ row, group: items[0].group, items }));
}

/** Kana that can be quizzed (small kana alone and the long-vowel mark are not quiz items). */
export const quizzable = (k: Kana) => k.group !== 'small' && k.char !== 'ー';
