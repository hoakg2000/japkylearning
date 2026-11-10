// Rule-based furigana and keywords for song lyrics (F11, P8 decisions H2/H3). Pure: the dictionary is passed in.
// Longest match over known words (ours first, then JMdict common) plus inflected stems of verbs and い-adjectives.
// shortcut: no morphological analysis, so names, ateji and rare readings stay without furigana (counted as unread).
import type { Segment } from '../../src/lib/content/schemas';

export type DictEntry = { surface: string; segments: Segment[]; wordId?: string };

const KANJI = /[一-鿿㐀-䶿々〆ヶ]/u;
const KATAKANA_WORD = /^[゠-ヿー]{3,}$/u;
const MAX_LEN = 10;

const GODAN: Record<string, string> = { う: 'わいうえおっ', く: 'かきくけこい', ぐ: 'がぎぐげごい', す: 'さしすせそ', つ: 'たちつてとっ', ぬ: 'なにぬねのん', ぶ: 'ばびぶべぼん', む: 'まみむめもん', る: 'らりるれろっ' };

/** Replaces the last `cut` characters of the surface (trailing plain okurigana) with `tail`. */
function retail(segments: Segment[], cut: number, tail: string): Segment[] | undefined {
  const out = segments.map((s) => ({ ...s }));
  const last = out[out.length - 1];
  if (!last || last.reading !== undefined || [...last.surface].length < cut) return undefined;
  last.surface = [...last.surface].slice(0, -cut).join('') + tail;
  if (!last.surface) out.pop();
  return out.length ? out : undefined;
}

/** Conjugation stems that keep the kanji: 食べ(る), 書か/書き/書い(く), 美味し(い)… */
export function inflections(entry: DictEntry, pos: string[]): DictEntry[] {
  const chars = [...entry.surface];
  const end = chars.at(-1)!;
  const tails: string[] = [];
  if (pos.some((p) => p === 'v1' || p === 'adj-i')) tails.push('');
  if (pos.some((p) => p.startsWith('v5')) && GODAN[end]) tails.push(...GODAN[end]);
  if (pos.includes('v5k-s')) tails.push('っ'); // 行く → 行っ
  const out: DictEntry[] = [];
  for (const tail of tails) {
    const segments = retail(entry.segments, 1, tail);
    if (!segments) continue;
    const surface = segments.map((s) => s.surface).join('');
    if (KANJI.test(surface) && surface !== entry.surface) out.push({ surface, segments, wordId: entry.wordId });
  }
  return out;
}

/** First entry wins, so callers add their preferred sources first. */
export function addEntry(dict: Map<string, DictEntry>, e: DictEntry) {
  if (!dict.has(e.surface)) dict.set(e.surface, e);
}

export type LyricToken = { start: number; end: number; entry: DictEntry };

/** Segments with readings for one lyric line, tokens for keyword spotting, and the unread-kanji count. */
export function segmentLine(line: string, dict: Map<string, DictEntry>) {
  const chars = [...line];
  const segments: Segment[] = [];
  const tokens: LyricToken[] = [];
  let kanji = 0;
  let unread = 0;
  const plain = (s: string) => {
    const last = segments.at(-1);
    if (last && last.reading === undefined) last.surface += s;
    else segments.push({ surface: s });
  };
  for (let i = 0; i < chars.length; ) {
    let hit: DictEntry | undefined;
    let len = 0;
    for (let j = Math.min(chars.length, i + MAX_LEN); j > i; j--) {
      const key = chars.slice(i, j).join('');
      const e = dict.get(key);
      if (e && (KANJI.test(key) || (e.wordId && KATAKANA_WORD.test(key)))) {
        hit = e;
        len = j - i;
        break;
      }
    }
    if (hit) {
      for (const s of hit.segments) {
        if (s.reading) segments.push({ ...s });
        else plain(s.surface);
      }
      kanji += [...hit.surface].filter((c) => KANJI.test(c)).length;
      tokens.push({ start: i, end: i + len, entry: hit });
      i += len;
      continue;
    }
    if (KANJI.test(chars[i])) {
      kanji++;
      unread++;
    }
    plain(chars[i]);
    i++;
  }
  return { segments, tokens, kanji, unread };
}
