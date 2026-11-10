// Builds content/levels/n5/*.json from authored sources + open datasets (docs/07-CONTENT-LICENSING.md §3).
// Run `npm run ingest:fetch` first. Usage: npm run ingest:n5
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { toHiragana, toRomaji } from 'wanakana';
import { n5Kanji } from '../../content/source/n5/kanji';
import type { KanjiSource, LessonSource, PackSource, Sentence, WordSource } from '../../content/source/types';
import { GrammarPoint, Kanji, Lesson, Pack, Word, type Segment } from '../../src/lib/content/schemas';
import { assertMarkup, parseMarkup } from '../../src/lib/japanese/markup';

const SRC = '.data/sources';
const OUT = 'content/levels/n5';
const PACK_SRC = 'content/source/packs';
const PACK_OUT = 'content/packs';
const warnings: string[] = [];
const errors: string[] = [];

// ---------- datasets ----------
type JmWord = {
  id: string;
  kanji: { text: string }[];
  kana: { text: string }[];
  sense: { partOfSpeech: string[]; gloss: { text: string }[] }[];
};
const jmdictFile = readdirMatch(/^jmdict-eng-common-.*\.json$/);
const jmdict: JmWord[] = JSON.parse(readFileSync(jmdictFile, 'utf8')).words;
const jmIndex = new Map<string, JmWord>();
for (const w of jmdict) {
  for (const r of w.kana) {
    for (const k of w.kanji) if (!jmIndex.has(`${k.text}|${r.text}`)) jmIndex.set(`${k.text}|${r.text}`, w);
    if (!jmIndex.has(`${r.text}|${r.text}`)) jmIndex.set(`${r.text}|${r.text}`, w);
  }
}

type FuriPart = { ruby: string; rt?: string };
const furiIndex = new Map<string, FuriPart[]>();
for (const f of JSON.parse(readFileSync(`${SRC}/JmdictFurigana.json`, 'utf8').replace(/^﻿/, '')) as { text: string; reading: string; furigana: FuriPart[] }[]) {
  furiIndex.set(`${f.text}|${f.reading}`, f.furigana);
}

type KdChar = {
  literal: string;
  misc: { strokeCounts: number[] };
  readingMeaning: { groups: { readings: { type: string; value: string }[]; meanings: { lang: string; value: string }[] }[] } | null;
};
const kanjidic = new Map<string, KdChar>();
for (const c of JSON.parse(readFileSync(readdirMatch(/^kanjidic2-en-.*\.json$/), 'utf8')).characters as KdChar[]) kanjidic.set(c.literal, c);

// Unihan kVietnamese, also reachable through the Japanese old (traditional) variant.
const unihanVi = new Map<string, string[]>();
for (const line of readFileSync(`${SRC}/Unihan_Readings.txt`, 'utf8').split('\n')) {
  const m = /^U\+([0-9A-F]+)\tkVietnamese\t(.+)$/.exec(line);
  if (m) unihanVi.set(String.fromCodePoint(parseInt(m[1], 16)), m[2].trim().split(/\s+/));
}
const oldVariant = new Map<string, string>();
for (const line of readFileSync(`${SRC}/Unihan_Variants.txt`, 'utf8').split('\n')) {
  const m = /^U\+([0-9A-F]+)\tkJapaneseOldVariant\tU\+([0-9A-F]+)/.exec(line);
  if (m) oldVariant.set(String.fromCodePoint(parseInt(m[1], 16)), String.fromCodePoint(parseInt(m[2], 16)));
}

function readdirMatch(re: RegExp) {
  const f = readdirSync(SRC).find((n) => re.test(n));
  if (!f) throw new Error(`missing dataset ${re} in ${SRC}; run npm run ingest:fetch`);
  return `${SRC}/${f}`;
}

const readings = (c: KdChar | undefined, type: string) =>
  c?.readingMeaning?.groups.flatMap((g) => g.readings.filter((r) => r.type === type).map((r) => r.value)) ?? [];
const meaningsEn = (c: KdChar | undefined) =>
  c?.readingMeaning?.groups.flatMap((g) => g.meanings.filter((m) => m.lang === 'en').map((m) => m.value)) ?? [];

// ---------- Hán-Việt ----------
const manualHanViet = new Map(n5Kanji.map((k) => [k.char, k.hanViet[0]]));
function hanVietOf(char: string): string | undefined {
  const manual = manualHanViet.get(char);
  if (manual) return manual;
  const kd = readings(kanjidic.get(char), 'vietnam')[0];
  if (kd) return kd.toUpperCase();
  const uni = unihanVi.get(char) ?? unihanVi.get(oldVariant.get(char) ?? '');
  return uni?.[0]?.toUpperCase();
}

/** True when `rt` is an on'yomi of `char`, allowing sokuon (学→がっ) and rendaku (社→じゃ). */
function isOnyomi(char: string, rt: string) {
  const ons = readings(kanjidic.get(char), 'ja_on').map((r) => toHiragana(r.replace(/[-.]/g, '')));
  const voiced: Record<string, string> = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };
  const half: Record<string, string> = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
  return ons.some((on) => {
    const variants = [on, on.slice(0, -1) + 'っ'];
    if (voiced[on[0]]) variants.push(voiced[on[0]] + on.slice(1));
    if (half[on[0]]) variants.push(half[on[0]] + on.slice(1));
    return variants.includes(rt);
  });
}

function hanVietForWord(segments: Segment[]) {
  const kanjiSegs = segments.filter((s) => s.reading !== undefined);
  if (!kanjiSegs.length) return { jukujikun: false };
  if (kanjiSegs.some((s) => [...s.surface].length > 1)) return { jukujikun: true };
  if (!kanjiSegs.every((s) => isOnyomi(s.surface, s.reading!))) return { jukujikun: false };
  const parts = kanjiSegs.map((s) => hanVietOf(s.surface));
  if (parts.some((p) => !p)) return { jukujikun: false };
  return { jukujikun: false, hanViet: parts.join(' '), hanVietSource: 'onyomi-join' as const };
}

// ---------- words ----------
function lookup(surface: string, reading: string): { entry?: JmWord; suffix: string } {
  const direct = jmIndex.get(`${surface}|${reading}`);
  if (direct) return { entry: direct, suffix: '' };
  // する-verbs and words with a trailing particle: look up the base.
  for (const suffix of ['する', 'に', 'で']) {
    if (surface.endsWith(suffix) && reading.endsWith(suffix)) {
      const base = jmIndex.get(`${surface.slice(0, -suffix.length)}|${reading.slice(0, -suffix.length)}`);
      if (base) return { entry: base, suffix };
    }
  }
  return { suffix: '' };
}

function segmentsFor(surface: string, reading: string, suffix: string): Segment[] | undefined {
  if (toHiragana(surface) === toHiragana(reading) && !/[一-鿿々]/.test(surface)) return [{ surface }];
  const base = suffix ? [surface.slice(0, -suffix.length), reading.slice(0, -suffix.length)] : [surface, reading];
  const parts = furiIndex.get(`${base[0]}|${base[1]}`) ?? furiIndex.get(`${surface}|${reading}`);
  if (!parts) return undefined;
  const segs: Segment[] = parts.map((p) => (p.rt ? { surface: p.ruby, reading: p.rt } : { surface: p.ruby }));
  if (suffix && !furiIndex.has(`${surface}|${reading}`)) segs.push({ surface: suffix });
  // Merge adjacent plain segments.
  return segs.reduce<Segment[]>((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && last.reading === undefined && s.reading === undefined) last.surface += s.surface;
    else acc.push({ ...s });
    return acc;
  }, []);
}

const example = ([ja, vi, en]: Sentence) => {
  assertMarkup(ja);
  const p = parseMarkup(ja);
  return { ja: p.ja, segments: p.segments, romaji: p.romaji, translation: { vi, en }, source: 'japky' };
};

/** Word entry for an authored word, or undefined (error recorded). `tag` is the lesson or pack id. */
function buildWord(w: WordSource, tag: string, jlpt: 'n5' | null): Word | undefined {
  const { entry, suffix } = lookup(w.surface, w.reading);
  if (!entry && !w.en) {
    errors.push(`${tag}: ${w.surface} (${w.reading}) not in JMdict; add "en"`);
    return;
  }
  const segments = segmentsFor(w.surface, w.reading, suffix);
  if (!segments) {
    errors.push(`${tag}: no furigana for ${w.surface} (${w.reading})`);
    return;
  }
  const id = entry ? `jmdict-${entry.id}${suffix ? `-${toRomaji(suffix)}` : ''}` : `japky-${toRomaji(w.reading)}`;
  const sense = entry?.sense[0];
  const word = {
    id,
    surface: w.surface,
    reading: w.reading,
    romaji: toRomaji(w.reading),
    segments,
    ...(w.hanViet ? { jukujikun: false, hanViet: w.hanViet, hanVietSource: 'manual' as const } : hanVietForWord(segments)),
    pos: suffix === 'する' ? ['vs'] : (sense?.partOfSpeech ?? []),
    meanings: { vi: w.vi, en: w.en ?? sense!.gloss.slice(0, 3).map((g) => g.text).join('; ') },
    meaningsViReviewed: false,
    examples: [example(w.example)],
    jlpt,
    tags: [tag],
  };
  const parsed = Word.safeParse(word);
  if (!parsed.success) errors.push(`${tag}: ${w.surface}: ${parsed.error.message}`);
  return parsed.data;
}

/** Hán-Việt cross-check against KANJIDIC2/Unihan (warning only) and the Kanji entry. */
function buildKanji(k: KanjiSource, jlpt: 'n5' | null, lessonId: string | null, sectors: string[]) {
  const kd = kanjidic.get(k.char);
  if (!kd) errors.push(`kanji ${k.char} missing in KANJIDIC2`);
  const sources = [...readings(kd, 'vietnam'), ...(unihanVi.get(k.char) ?? unihanVi.get(oldVariant.get(k.char) ?? '') ?? [])].map((r) => r.toUpperCase().normalize('NFC'));
  if (sources.length && !k.hanViet.some((h) => sources.includes(h.normalize('NFC')))) warnings.push(`Hán-Việt ${k.char}: authored ${k.hanViet.join('/')} vs datasets ${[...new Set(sources)].join('/')}`);
  const item = {
    char: k.char,
    on: readings(kd, 'ja_on'),
    kun: readings(kd, 'ja_kun'),
    hanViet: k.hanViet,
    hanVietReviewed: false,
    meanings: { vi: k.vi, en: meaningsEn(kd).slice(0, 3).join('; ') },
    strokeCount: kd?.misc.strokeCounts[0] ?? 0,
    jlpt,
    lessonId,
    sectors,
  };
  const parsed = Kanji.safeParse(item);
  if (!parsed.success) errors.push(`kanji ${k.char}: ${parsed.error.message}`);
  return parsed.data;
}

// ---------- build ----------
async function main() {
  const lessons: LessonSource[] = [];
  for (let i = 1; existsSync(`content/source/n5/lesson-${String(i).padStart(2, '0')}.ts`); i++) {
    lessons.push((await import(`../../content/source/n5/lesson-${String(i).padStart(2, '0')}.ts`)).default);
  }

  const words = new Map<string, Word>();
  const kanjiLesson = new Map<string, string>();
  const grammar: unknown[] = [];
  const lessonOut: unknown[] = [];

  for (const lesson of lessons) {
    const wordIds: string[] = [];
    for (const w of lesson.words) {
      const word = buildWord(w, lesson.id, 'n5');
      if (!word) continue;
      if (!words.has(word.id)) words.set(word.id, word);
      wordIds.push(word.id);
    }

    for (const k of lesson.kanji) if (!kanjiLesson.has(k)) kanjiLesson.set(k, lesson.id);

    for (const g of lesson.grammar) {
      const point = {
        id: g.id,
        pattern: g.pattern,
        meaning: g.meaning,
        explanation: g.explanation,
        examples: g.examples.map(example),
        cloze: g.cloze.map(([ja, blank, vi, en]) => {
          const p = parseMarkup(ja);
          if (!p.ja.includes(blank)) errors.push(`${g.id}: blank "${blank}" not in "${p.ja}"`);
          return { ja: p.ja, blank, translation: { vi, en } };
        }),
        jlpt: 'n5' as const,
      };
      const parsed = GrammarPoint.safeParse(point);
      if (!parsed.success) errors.push(`${g.id}: ${parsed.error.message}`);
      else grammar.push(parsed.data);
    }

    const out = {
      id: lesson.id,
      level: 'n5' as const,
      order: lesson.order,
      title: lesson.title,
      goals: lesson.goals,
      wordIds: [...new Set(wordIds)],
      kanji: lesson.kanji,
      grammarIds: lesson.grammar.map((g) => g.id),
      dialogue: lesson.dialogue.map(([speaker, ja, vi, en]) => {
        const p = parseMarkup(ja);
        return { speaker, ja: p.ja, segments: p.segments, translation: { vi, en } };
      }),
    };
    const parsed = Lesson.safeParse(out);
    if (!parsed.success) errors.push(`${lesson.id}: ${parsed.error.message}`);
    else lessonOut.push(parsed.data);
  }

  const kanji = n5Kanji.map((k) => buildKanji(k, 'n5', kanjiLesson.get(k.char) ?? null, []));
  for (const k of kanjiLesson.keys()) if (!manualHanViet.has(k)) errors.push(`lesson kanji ${k} is not in content/source/n5/kanji.ts`);

  // Packs (F3): N5 words are referenced by id; other words and kanji go to content/packs/{words,kanji}.json.
  const packs: PackSource[] = [];
  for (const f of existsSync(PACK_SRC) ? readdirSync(PACK_SRC).filter((n) => n.endsWith('.ts')).sort() : []) {
    packs.push((await import(`../../${PACK_SRC}/${f}`)).default);
  }
  const packWords = new Map<string, Word>();
  const packKanji = new Map<string, NonNullable<ReturnType<typeof buildKanji>>>();
  const packOut: unknown[] = [];
  for (const pack of packs.toSorted((a, b) => a.order - b.order)) {
    const wordIds: string[] = [];
    for (const w of pack.words) {
      const word = buildWord(w, `pack:${pack.id}`, null);
      if (!word) continue;
      const known = packWords.get(word.id);
      if (known) known.tags = [...new Set([...known.tags, `pack:${pack.id}`])];
      else if (!words.has(word.id)) packWords.set(word.id, word);
      wordIds.push(word.id);
    }
    for (const k of pack.newKanji) {
      if (manualHanViet.has(k.char)) errors.push(`pack ${pack.id}: ${k.char} is N5; list it in "kanji" only`);
      const known = packKanji.get(k.char);
      if (known) known.sectors = [...new Set([...known.sectors, pack.id])];
      else {
        const item = buildKanji(k, null, null, [pack.id]);
        if (item) packKanji.set(k.char, item);
      }
    }
    for (const c of pack.kanji) if (!manualHanViet.has(c) && !pack.newKanji.some((k) => k.char === c)) errors.push(`pack ${pack.id}: kanji ${c} needs a newKanji entry`);
    const out = { id: pack.id, order: pack.order, title: pack.title, description: pack.description, wordIds: [...new Set(wordIds)], kanji: pack.kanji };
    const parsed = Pack.safeParse(out);
    if (!parsed.success) errors.push(`pack ${pack.id}: ${parsed.error.message}`);
    else packOut.push(parsed.data);
  }

  if (warnings.length) console.warn(`${warnings.length} warnings:\n  ${warnings.join('\n  ')}`);
  if (errors.length) {
    console.error(`${errors.length} errors:\n  ${errors.join('\n  ')}`);
    process.exit(1);
  }

  mkdirSync(OUT, { recursive: true });
  const write = (name: string, data: unknown) => writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1) + '\n');
  write('words', [...words.values()]);
  write('kanji', kanji);
  write('grammar', grammar);
  write('lessons', lessonOut);
  write('meta', { sources: JSON.parse(readFileSync(`${SRC}/versions.json`, 'utf8')), builtAt: new Date().toISOString().slice(0, 10) });
  mkdirSync(PACK_OUT, { recursive: true });
  const writePack = (name: string, data: unknown) => writeFileSync(`${PACK_OUT}/${name}.json`, JSON.stringify(data, null, 1) + '\n');
  writePack('packs', packOut);
  writePack('words', [...packWords.values()]);
  writePack('kanji', [...packKanji.values()]);
  console.log(`words ${words.size}, kanji ${kanji.length}, grammar ${grammar.length}, lessons ${lessonOut.length}`);
  console.log(`packs ${packOut.length}, pack-only words ${packWords.size}, pack-only kanji ${packKanji.size}`);
}

main();
