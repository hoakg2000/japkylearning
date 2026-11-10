// Splits a lyric line's furigana segments at keyword boundaries so keywords can be highlighted or hidden (F11).
// Offsets are code points. A boundary inside a ruby group pulls the whole group into the keyword (readings can't split).
import type { Segment } from '@/lib/content/schemas';

export type Piece = { segments: Segment[]; keyword?: number };

export function linePieces(segments: Segment[], keywords: { start: number; end: number }[]): Piece[] {
  // Expand to single characters (plain) or whole ruby groups, each with its code-point range.
  const units: { seg: Segment; start: number; end: number }[] = [];
  let pos = 0;
  for (const s of segments) {
    const chars = [...s.surface];
    if (s.reading) {
      units.push({ seg: s, start: pos, end: pos + chars.length });
      pos += chars.length;
    } else for (const c of chars) units.push({ seg: { surface: c }, start: pos, end: ++pos });
  }
  const owner = (u: { start: number; end: number }) => keywords.findIndex((k) => u.start < k.end && u.end > k.start);
  const pieces: Piece[] = [];
  for (const u of units) {
    const k = owner(u);
    const last = pieces.at(-1);
    const keyword = k === -1 ? undefined : k;
    if (last && last.keyword === keyword) {
      const prev = last.segments.at(-1)!;
      if (!u.seg.reading && !prev.reading) prev.surface += u.seg.surface;
      else last.segments.push({ ...u.seg });
    } else pieces.push({ segments: [{ ...u.seg }], keyword });
  }
  return pieces;
}

/** Deterministic cloze: hide about `percent`% of keywords, the same ones on every visit. */
export function hiddenAt(percent: number, line: number, start: number): boolean {
  if (percent >= 100) return true;
  if (percent <= 0) return false;
  const h = Math.imul(line * 2654435761 + start * 40503, 2246822519) >>> 0;
  return h % 100 < percent;
}
