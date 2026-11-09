// Furigana markup used by authored content (and later AI output, ADR 0013):
//   "{私|わたし} は {学生|がくせい} です。"
// `{base|reading}` gives ruby text; spaces separate words (removed from the Japanese text,
// kept in romaji). Parsed into data only, never into HTML.
import { toRomaji } from 'wanakana';
import type { Segment } from '@/lib/content/schemas';

const TOKEN = /\{([^|{}]+)\|([^|{}]+)\}|([^{}\s]+)/g;
// Particles read differently from their kana when standing alone.
const PARTICLE_ROMAJI: Record<string, string> = { は: 'wa', へ: 'e', を: 'o' };

export type ParsedLine = { ja: string; segments: Segment[]; reading: string; romaji: string };

export function parseMarkup(markup: string): ParsedLine {
  const segments: Segment[] = [];
  const words: { reading: string }[] = [];
  for (const word of markup.trim().split(/\s+/)) {
    let reading = '';
    for (const m of word.matchAll(TOKEN)) {
      const [, base, rt, plain] = m;
      if (base) {
        segments.push({ surface: base, reading: rt });
        reading += rt;
      } else {
        const last = segments[segments.length - 1];
        // Merge consecutive plain text into one segment.
        if (last && last.reading === undefined) last.surface += plain;
        else segments.push({ surface: plain });
        reading += plain;
      }
    }
    words.push({ reading });
  }
  const ja = segments.map((s) => s.surface).join('');
  const reading = words.map((w) => w.reading).join('');
  const romaji = words
    .map((w) => PARTICLE_ROMAJI[w.reading] ?? toRomaji(w.reading))
    .join(' ')
    .replace(/\s+([.,!?])/g, '$1')
    .replace(/[。]/g, '.')
    .replace(/[、]/g, ',')
    .replace(/[？]/g, '?')
    .replace(/[！]/g, '!')
    .replace(/\s+([.,!?])/g, '$1');
  return { ja, segments, reading, romaji };
}

/** Throws when braces are unbalanced, so authoring mistakes fail the build. */
export function assertMarkup(markup: string) {
  const stripped = markup.replace(/\{[^|{}]+\|[^|{}]+\}/g, '');
  if (/[{}|]/.test(stripped)) throw new Error(`Bad furigana markup: ${markup}`);
}
