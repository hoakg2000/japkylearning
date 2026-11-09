// Authoring format for hand-written content. `scripts/ingest/build-n5.ts` enriches it with
// JMdict (id, English gloss, part of speech), JmdictFurigana (ruby segments), KANJIDIC2 and
// Unihan, then writes validated JSON to content/levels/n5/.
//
// Japanese text uses furigana markup: "{私|わたし} は {学生|がくせい} です。" (see src/lib/japanese/markup.ts).
// Sentences are authored by Japky (source "japky"), licensed CC BY-SA 4.0 with the rest of the content.

/** [markup, vi, en] */
export type Sentence = [ja: string, vi: string, en: string];

export type WordSource = {
  surface: string;
  reading: string;
  vi: string;
  /** Hán-Việt when it cannot be derived (e.g. 日本 is one ruby group in JmdictFurigana but read on'yomi). */
  hanViet?: string;
  /** Override the English gloss from JMdict (required when the word is not in JMdict). */
  en?: string;
  example: Sentence;
};

export type GrammarSource = {
  id: string;
  pattern: string;
  meaning: { vi: string; en: string };
  explanation: { vi: string; en: string };
  examples: Sentence[];
  /** [markup, part to blank out, vi, en] */
  cloze: [ja: string, blank: string, vi: string, en: string][];
};

export type LessonSource = {
  id: string;
  order: number;
  title: { vi: string; en: string };
  goals: { vi: string; en: string }[];
  kanji: string[];
  words: WordSource[];
  grammar: GrammarSource[];
  /** [speaker, markup, vi, en] */
  dialogue: [speaker: string, ja: string, vi: string, en: string][];
};

export type KanjiSource = { char: string; hanViet: string[]; vi: string };
