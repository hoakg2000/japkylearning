// CI gate for content (ADR 0008): schemas, cross references and stable ids.
// An id that existed in the previous commit must still exist or be listed in content/tombstones.json.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { z } from 'zod';
import { GrammarPoint, Kana, Kanji, Lesson, Pack, Word } from '../src/lib/content/schemas';

const errors: string[] = [];
const read = (f: string) => JSON.parse(readFileSync(f, 'utf8'));

function check<T>(file: string, schema: z.ZodType<T>): T[] {
  const parsed = z.array(schema).safeParse(read(file));
  if (!parsed.success) {
    errors.push(`${file}: ${parsed.error.issues.slice(0, 5).map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
    return [];
  }
  return parsed.data;
}

check('content/kana/hiragana.json', Kana);
check('content/kana/katakana.json', Kana);
const words = check('content/levels/n5/words.json', Word);
const kanji = check('content/levels/n5/kanji.json', Kanji);
const grammar = check('content/levels/n5/grammar.json', GrammarPoint);
const lessons = check('content/levels/n5/lessons.json', Lesson);
const packWords = check('content/packs/words.json', Word);
const packKanji = check('content/packs/kanji.json', Kanji);
const packs = check('content/packs/packs.json', Pack);

const wordIds = new Set(words.map((w) => w.id));
const allWordIds = new Set([...wordIds, ...packWords.map((w) => w.id)]);
if (allWordIds.size !== words.length + packWords.length) errors.push('a pack-only word repeats an N5 word id');
const grammarIds = new Set(grammar.map((g) => g.id));
const kanjiChars = new Set(kanji.map((k) => k.char));
const allKanjiChars = new Set([...kanjiChars, ...packKanji.map((k) => k.char)]);
if (allKanjiChars.size !== kanji.length + packKanji.length) errors.push('a pack-only kanji repeats an N5 kanji');
for (const l of lessons) {
  for (const id of l.wordIds) if (!wordIds.has(id)) errors.push(`${l.id}: unknown word ${id}`);
  for (const id of l.grammarIds) if (!grammarIds.has(id)) errors.push(`${l.id}: unknown grammar ${id}`);
  for (const c of l.kanji) if (!kanjiChars.has(c)) errors.push(`${l.id}: unknown kanji ${c}`);
}
for (const p of packs) {
  for (const id of p.wordIds) if (!allWordIds.has(id)) errors.push(`pack ${p.id}: unknown word ${id}`);
  for (const c of p.kanji) if (!allKanjiChars.has(c)) errors.push(`pack ${p.id}: unknown kanji ${c}`);
}
for (const g of grammar) for (const c of g.cloze) if (!c.ja.includes(c.blank)) errors.push(`${g.id}: blank "${c.blank}" not in "${c.ja}"`);
for (const k of [...kanji, ...packKanji]) if (!existsSync(`public/strokes/${k.char.codePointAt(0)!.toString(16).padStart(5, '0')}.json`)) errors.push(`kanji ${k.char}: no stroke data (npm run fetch:strokes kanji)`);

// Stable ids: SRS cards and progress point at these ids.
const tombstones: string[] = existsSync('content/tombstones.json') ? read('content/tombstones.json') : [];
const previous = (file: string): { id?: string; char?: string }[] => {
  try {
    return JSON.parse(execFileSync('git', ['show', `HEAD:${file}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    return []; // new file or no git history
  }
};
const current = new Set([...allWordIds, ...grammarIds, ...lessons.map((l) => l.id), ...packs.map((p) => p.id)]);
for (const file of ['content/levels/n5/words.json', 'content/levels/n5/grammar.json', 'content/levels/n5/lessons.json', 'content/packs/words.json', 'content/packs/packs.json']) {
  for (const item of previous(file)) {
    if (item.id && !current.has(item.id) && !tombstones.includes(item.id)) errors.push(`id removed without tombstone: ${item.id} (${file})`);
  }
}

if (errors.length) {
  console.error(`Content invalid (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Content OK: ${words.length} words, ${kanji.length} kanji, ${grammar.length} grammar, ${lessons.length} lessons, ${packs.length} packs (+${packWords.length} words, +${packKanji.length} kanji)`);
