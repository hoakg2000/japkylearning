import { toHiragana, toKana } from 'wanakana';

/**
 * True when typed romaji (any common variant: shi/si, tsu/tu, fu/hu…) spells the kana.
 * Also accepts the displayed Hepburn romaji (e.g. "ji" for ぢ).
 */
export function isRomajiAnswer(input: string, kana: { char: string; romaji: string }): boolean {
  const typed = input.trim().toLowerCase();
  if (!typed) return false;
  if (typed === kana.romaji) return true;
  if (kana.char === 'を' || kana.char === 'ヲ') return typed === 'o' || typed === 'wo';
  return toHiragana(toKana(typed)) === toHiragana(kana.char);
}
