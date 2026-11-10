// Mora scoring for speaking practice (F10, docs/05-AI-SPEECH.md §3). Pure, client and server.
// STT tends to "correct" speech to the nearest real word, so this measures intelligibility, not phonemes.
import { toHiragana as wkHiragana } from 'wanakana';
import type { Segment } from '@/lib/content/schemas';

const SMALL = new Set([...'ゃゅょぁぃぅぇぉゎ']);

/**
 * Transcript → hiragana. Kanji the recogniser wrote are mapped through the target word's segments
 * (its surface and each ruby group); anything still not kana is left as is and counts as wrong.
 */
export function toHiragana(text: string, target?: { surface: string; reading: string; segments: Segment[] }): string {
  let s = text.normalize('NFKC').replace(/[\s。、.,!?！？「」]/g, '');
  if (target) {
    s = s.split(target.surface).join(target.reading);
    for (const seg of target.segments) if (seg.reading) s = s.split(seg.surface).join(seg.reading);
  }
  return wkHiragana(s, { passRomaji: true, convertLongVowelMark: false });
}

/** Mora list: ゃゅょ (and small vowels) join the kana before them; っ and ー are one mora each. */
export function splitMora(kana: string): string[] {
  const out: string[] = [];
  for (const ch of wkHiragana(kana, { passRomaji: true, convertLongVowelMark: false })) {
    if (SMALL.has(ch) && out.length) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
}

export type MoraOp = { op: 'ok'; mora: string } | { op: 'sub'; mora: string; heard: string } | { op: 'del'; mora: string } | { op: 'ins'; heard: string };

/** Levenshtein over mora with the edit script, in target order. */
export function moraDiff(target: string[], heard: string[]): MoraOp[] {
  const n = target.length;
  const m = heard.length;
  const d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (target[i - 1] === heard[j - 1] ? 0 : 1));
  const ops: MoraOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (target[i - 1] === heard[j - 1] ? 0 : 1)) {
      ops.push(target[i - 1] === heard[j - 1] ? { op: 'ok', mora: target[i - 1] } : { op: 'sub', mora: target[i - 1], heard: heard[j - 1] });
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      ops.push({ op: 'del', mora: target[--i] });
    } else {
      ops.push({ op: 'ins', heard: heard[--j] });
    }
  }
  return ops.reverse();
}

/** 0–100: round(100 × (1 − distance / target mora count)), clamped. */
export function score(target: string[], heard: string[]): number {
  if (!target.length) return 0;
  const dist = moraDiff(target, heard).filter((o) => o.op !== 'ok').length;
  return Math.max(0, Math.min(100, Math.round(100 * (1 - dist / target.length))));
}

/** Scores a transcript against a word reading. */
export function scoreReading(reading: string, transcript: string, target?: Parameters<typeof toHiragana>[1]) {
  const t = splitMora(reading);
  const h = splitMora(toHiragana(transcript, target));
  return { score: score(t, h), ops: moraDiff(t, h), heard: h.join('') };
}

const KANA_ONLY = /^[\p{Script=Hiragana}ー]+$/u;

/**
 * Best of the recogniser's alternatives (F10, P6 decision E5). Alternatives that still contain kanji or
 * latin after mapping are not scored; when none is left the result is `unmapped` and nothing is stored.
 */
export function bestAlternative(reading: string, alternatives: string[], target?: Parameters<typeof toHiragana>[1]) {
  const scored = alternatives
    .map((alt) => ({ alt, kana: toHiragana(alt, target) }))
    .filter((a) => KANA_ONLY.test(a.kana))
    .map((a) => ({ ...scoreReading(reading, a.alt, target), transcript: a.alt }));
  if (!scored.length) return { unmapped: true as const, heard: alternatives[0] ?? '' };
  return { unmapped: false as const, ...scored.reduce((a, b) => (b.score > a.score ? b : a)) };
}
