// Generates content/kana/{hiragana,katakana}.json from the gojuon table below.
// Romaji comes from wanakana (Hepburn); the legacy Expo seed is checked for consistency.
import { writeFileSync, readFileSync } from 'node:fs';
import { toKatakana, toRomaji } from 'wanakana';

type Group = 'basic' | 'dakuten' | 'handakuten' | 'yoon' | 'small' | 'extended';
type Row = { row: string; group: Group; chars: string[] };

const rows: Row[] = [
  { row: 'a', group: 'basic', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { row: 'ka', group: 'basic', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { row: 'sa', group: 'basic', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { row: 'ta', group: 'basic', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { row: 'na', group: 'basic', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { row: 'ha', group: 'basic', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { row: 'ma', group: 'basic', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { row: 'ya', group: 'basic', chars: ['や', 'ゆ', 'よ'] },
  { row: 'ra', group: 'basic', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { row: 'wa', group: 'basic', chars: ['わ', 'を', 'ん'] },
  { row: 'ga', group: 'dakuten', chars: ['が', 'ぎ', 'ぐ', 'げ', 'ご'] },
  { row: 'za', group: 'dakuten', chars: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'] },
  { row: 'da', group: 'dakuten', chars: ['だ', 'ぢ', 'づ', 'で', 'ど'] },
  { row: 'ba', group: 'dakuten', chars: ['ば', 'び', 'ぶ', 'べ', 'ぼ'] },
  { row: 'pa', group: 'handakuten', chars: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'] },
  ...['き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'び', 'ぴ'].map((c) => ({
    row: toRomaji(c + 'ゃ'),
    group: 'yoon' as const,
    chars: ['ゃ', 'ゅ', 'ょ'].map((s) => c + s),
  })),
  { row: 'small', group: 'small', chars: ['っ', 'ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'] },
];

// Katakana-only sounds for loanwords.
const extendedKatakana = ['ー', 'ファ', 'フィ', 'フェ', 'フォ', 'ティ', 'ディ', 'トゥ', 'ドゥ', 'ウィ', 'ウェ', 'ウォ', 'シェ', 'ジェ', 'チェ', 'ヴァ', 'ヴィ', 'ヴ', 'ヴェ', 'ヴォ'];

const romajiOf = (kana: string, group: Group) => {
  if (kana === 'ー') return '-';
  if (group === 'small') return kana === 'っ' || kana === 'ッ' ? '(double consonant)' : toRomaji(kana).replace(/^x/, '');
  if (kana === 'を' || kana === 'ヲ') return 'wo';
  return toRomaji(kana);
};

const build = (script: 'hiragana' | 'katakana') => {
  const items = rows.flatMap(({ row, group, chars }) =>
    chars.map((h) => {
      const char = script === 'hiragana' ? h : toKatakana(h);
      return { char, romaji: romajiOf(char, group), script, group, row };
    }),
  );
  if (script === 'katakana') {
    items.push(...extendedKatakana.map((char) => ({ char, romaji: romajiOf(char, 'extended'), script, group: 'extended' as Group, row: 'extended' })));
  }
  return items;
};

const hiragana = build('hiragana');
const katakana = build('katakana');

const legacy: { letters: { h: string; k: string; r: string }[][] } = JSON.parse(readFileSync('content/kana/legacy-letter.json', 'utf8'));
for (const { h, k, r } of legacy.letters.flat()) {
  const hi = hiragana.find((x) => x.char === h);
  const ka = katakana.find((x) => x.char === k);
  if (!hi || !ka) throw new Error(`legacy kana missing: ${h}/${k}`);
  if (hi.romaji !== r) console.warn(`romaji differs from legacy seed: ${h} ${hi.romaji} vs ${r}`);
}

writeFileSync('content/kana/hiragana.json', JSON.stringify(hiragana, null, 1) + '\n');
writeFileSync('content/kana/katakana.json', JSON.stringify(katakana, null, 1) + '\n');
console.log(`hiragana ${hiragana.length}, katakana ${katakana.length}`);
