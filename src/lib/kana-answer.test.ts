import { describe, expect, it } from 'vitest';
import { hiragana, katakana } from './content/kana';
import { isRomajiAnswer } from './kana-answer';

const k = (char: string) => [...hiragana, ...katakana].find((x) => x.char === char)!;

describe('isRomajiAnswer', () => {
  it('accepts Hepburn and Kunrei variants', () => {
    expect(isRomajiAnswer('shi', k('し'))).toBe(true);
    expect(isRomajiAnswer('si', k('し'))).toBe(true);
    expect(isRomajiAnswer('tu', k('つ'))).toBe(true);
    expect(isRomajiAnswer('hu', k('フ'))).toBe(true);
    expect(isRomajiAnswer('kya', k('きゃ'))).toBe(true);
    expect(isRomajiAnswer(' KA ', k('カ'))).toBe(true);
  });
  it('accepts displayed romaji for ぢ and both o/wo for を', () => {
    expect(isRomajiAnswer('ji', k('ぢ'))).toBe(true);
    expect(isRomajiAnswer('di', k('ぢ'))).toBe(true);
    expect(isRomajiAnswer('o', k('を'))).toBe(true);
    expect(isRomajiAnswer('wo', k('を'))).toBe(true);
  });
  it('rejects wrong answers', () => {
    expect(isRomajiAnswer('sa', k('し'))).toBe(false);
    expect(isRomajiAnswer('', k('あ'))).toBe(false);
    expect(isRomajiAnswer('kyo', k('きゃ'))).toBe(false);
  });
  it('every quizzable kana accepts its own romaji', () => {
    for (const x of [...hiragana, ...katakana].filter((x) => x.group !== 'small' && x.char !== 'ー')) {
      expect(isRomajiAnswer(x.romaji, x), x.char).toBe(true);
    }
  });
});
