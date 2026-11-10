// Content schemas (docs/04-DATA-MODEL.md §2), validated at build by scripts/validate-content.ts.
import { z } from 'zod';

export const Bilingual = z.object({ vi: z.string().min(1), en: z.string().min(1) });
export const Segment = z.object({ surface: z.string().min(1), reading: z.string().optional() });
export const Jlpt = z.enum(['n5', 'n4', 'n3', 'n2', 'n1']);

export const Kana = z.object({
  char: z.string().min(1),
  romaji: z.string().min(1),
  script: z.enum(['hiragana', 'katakana']),
  group: z.enum(['basic', 'dakuten', 'handakuten', 'yoon', 'small', 'extended']),
  row: z.string(),
  audioUrl: z.string().url().optional(),
});

export const Strokes = z.object({ char: z.string(), strokes: z.array(z.string().min(1)).min(1) });

export const Example = z.object({
  ja: z.string().min(1),
  segments: z.array(Segment).min(1),
  romaji: z.string().min(1),
  translation: Bilingual,
  source: z.string().min(1),
  audioUrl: z.string().url().optional(),
});

export const Kanji = z.object({
  char: z.string().length(1),
  on: z.array(z.string()),
  kun: z.array(z.string()),
  hanViet: z.array(z.string()).min(1),
  hanVietReviewed: z.boolean(),
  meanings: Bilingual,
  strokeCount: z.number().int().positive(),
  jlpt: Jlpt.nullable(),
  lessonId: z.string().nullable(),
  sectors: z.array(z.string()),
});

export const Word = z.object({
  id: z.string().min(1),
  surface: z.string().min(1),
  reading: z.string().min(1),
  romaji: z.string().min(1),
  segments: z.array(Segment).min(1),
  hanViet: z.string().optional(),
  hanVietSource: z.enum(['onyomi-join', 'manual']).optional(),
  jukujikun: z.boolean(),
  pos: z.array(z.string()),
  meanings: Bilingual,
  meaningsViReviewed: z.boolean(),
  examples: z.array(Example).min(1),
  jlpt: Jlpt.nullable(),
  tags: z.array(z.string()),
  audioUrl: z.string().url().optional(),
});

export const GrammarPoint = z.object({
  id: z.string().min(1),
  pattern: z.string().min(1),
  meaning: Bilingual,
  explanation: Bilingual,
  examples: z.array(Example).min(2),
  /** Cloze sentences for grammar SRS cards: `blank` is the part hidden from `ja`. */
  cloze: z.array(z.object({ ja: z.string(), blank: z.string(), translation: Bilingual })).min(2),
  jlpt: Jlpt,
});

export const DialogueLine = z.object({ speaker: z.string(), ja: z.string(), segments: z.array(Segment), translation: Bilingual });

export const Lesson = z.object({
  id: z.string().min(1),
  level: Jlpt,
  order: z.number().int().positive(),
  title: Bilingual,
  goals: z.array(Bilingual).min(1),
  wordIds: z.array(z.string()).min(1).max(18),
  kanji: z.array(z.string()),
  grammarIds: z.array(z.string()),
  dialogue: z.array(DialogueLine).min(2),
});

/** Sector vocabulary pack (F3). Words resolve against N5 words plus content/packs/words.json. */
export const Pack = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  title: Bilingual,
  description: Bilingual,
  wordIds: z.array(z.string()).min(1),
  kanji: z.array(z.string().length(1)),
});

export type Pack = z.infer<typeof Pack>;

/** Song lesson (F11 v1), built by scripts/build-songs.ts from LRCLIB synced lyrics. Keyword offsets are code points. */
export const Song = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  artist: z.string().min(1),
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  channel: z.string().min(1),
  lrclibId: z.number().int(),
  lines: z.array(z.object({ t: z.number().min(0), text: z.string().min(1), segments: z.array(Segment).min(1), translation: Bilingual.optional() })).min(1),
  keywords: z.array(z.object({ line: z.number().int().min(0), start: z.number().int().min(0), end: z.number().int().min(1), wordId: z.string().min(1) })),
  keywordSource: z.enum(['rules', 'ai']),
  unreadKanji: z.number().min(0).max(1),
});

export type Song = z.infer<typeof Song>;
export type Kana = z.infer<typeof Kana>;
export type Strokes = z.infer<typeof Strokes>;
export type Segment = z.infer<typeof Segment>;
export type Example = z.infer<typeof Example>;
export type Kanji = z.infer<typeof Kanji>;
export type Word = z.infer<typeof Word>;
export type GrammarPoint = z.infer<typeof GrammarPoint>;
export type Lesson = z.infer<typeof Lesson>;
export type Bilingual = z.infer<typeof Bilingual>;
