// Question generation for lesson practice and lesson tests (F4/F5). Pure: pass the content and an RNG.
import type { GrammarPoint, Segment, Word } from '@/lib/content/schemas';
import { shuffle, type Rng } from '@/lib/quiz';

export type Locale = 'vi' | 'en';
export type Skill = 'vocab' | 'kanji' | 'grammar' | 'listening';
export type Option = { id: string; label: string; segments?: Segment[] };

export type Question =
  | { id: string; type: 'meaning'; skill: 'vocab'; word: Word; options: Option[]; answer: string }
  | { id: string; type: 'reading'; skill: 'kanji'; word: Word; options: Option[]; answer: string }
  | { id: string; type: 'listening'; skill: 'listening'; word: Word; options: Option[]; answer: string }
  | { id: string; type: 'cloze'; skill: 'grammar'; grammarId: string; before: string; after: string; translation: string; options: Option[]; answer: string };

const hasKanji = (s: string) => /[一-鿿々]/.test(s);

function pickDistinct<T>(pool: readonly T[], exclude: (x: T) => boolean, key: (x: T) => string, n: number, rng: Rng): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of shuffle(pool, rng)) {
    if (out.length >= n) break;
    if (exclude(x) || seen.has(key(x))) continue;
    seen.add(key(x));
    out.push(x);
  }
  return out;
}

export function meaningQuestion(word: Word, pool: Word[], locale: Locale, rng: Rng): Question {
  const others = pickDistinct(pool, (w) => w.id === word.id || w.meanings[locale] === word.meanings[locale], (w) => w.meanings[locale], 3, rng);
  return {
    id: `meaning:${word.id}`,
    type: 'meaning',
    skill: 'vocab',
    word,
    options: shuffle([word, ...others], rng).map((w) => ({ id: w.id, label: w.meanings[locale] })),
    answer: word.id,
  };
}

export function readingQuestion(word: Word, pool: Word[], rng: Rng): Question | null {
  if (!hasKanji(word.surface)) return null;
  const others = pickDistinct(pool, (w) => w.reading === word.reading, (w) => w.reading, 3, rng);
  return {
    id: `reading:${word.id}`,
    type: 'reading',
    skill: 'kanji',
    word,
    options: shuffle([word, ...others], rng).map((w) => ({ id: w.reading, label: w.reading })),
    answer: word.reading,
  };
}

export function listeningQuestion(word: Word, pool: Word[], rng: Rng): Question {
  const others = pickDistinct(pool, (w) => w.id === word.id || w.reading === word.reading, (w) => w.reading, 3, rng);
  return {
    id: `listening:${word.id}`,
    type: 'listening',
    skill: 'listening',
    word,
    options: shuffle([word, ...others], rng).map((w) => ({ id: w.id, label: w.surface, segments: w.segments })),
    answer: word.id,
  };
}

/** Cloze question from one of the grammar point's cloze sentences; distractors are other blanks. */
export function clozeQuestion(g: GrammarPoint, allGrammar: GrammarPoint[], locale: Locale, rng: Rng, index?: number): Question {
  const c = g.cloze[index ?? Math.floor(rng() * g.cloze.length)];
  const at = c.ja.indexOf(c.blank);
  const blanks = allGrammar.flatMap((x) => x.cloze.map((y) => y.blank));
  const others = pickDistinct(blanks, (b) => b === c.blank, (b) => b, 3, rng);
  return {
    id: `cloze:${g.id}`,
    type: 'cloze',
    skill: 'grammar',
    grammarId: g.id,
    before: c.ja.slice(0, at),
    after: c.ja.slice(at + c.blank.length),
    translation: c.translation[locale],
    options: shuffle([c.blank, ...others], rng).map((b) => ({ id: b, label: b })),
    answer: c.blank,
  };
}

/** End-of-lesson test: every word once (meaning), kanji words (reading), 3 listening, every grammar point. Max 15. */
export function lessonTest(content: { words: Word[]; grammar: GrammarPoint[] }, pool: Word[], allGrammar: GrammarPoint[], locale: Locale, rng: Rng, max = 15): Question[] {
  const ws = shuffle(content.words, rng);
  const qs: Question[] = [
    ...content.grammar.map((g) => clozeQuestion(g, allGrammar, locale, rng)),
    ...ws.slice(0, 3).map((w) => listeningQuestion(w, pool, rng)),
    ...ws.filter((w) => hasKanji(w.surface)).slice(0, 3).map((w) => readingQuestion(w, pool, rng)!),
    ...ws.map((w) => meaningQuestion(w, pool, locale, rng)),
  ];
  return shuffle(qs.slice(0, max), rng);
}
