import { describe, expect, it } from 'vitest';
import { assertMarkup, parseMarkup } from './markup';

describe('parseMarkup', () => {
  it('builds segments, plain Japanese text and spaced romaji', () => {
    const r = parseMarkup('{私|わたし} は {学生|がくせい} です。');
    expect(r.ja).toBe('私は学生です。');
    expect(r.segments).toEqual([
      { surface: '私', reading: 'わたし' },
      { surface: 'は' },
      { surface: '学生', reading: 'がくせい' },
      { surface: 'です。' },
    ]);
    expect(r.romaji).toBe('watashi wa gakusei desu.');
    expect(r.reading).toBe('わたしはがくせいです。');
  });

  it('handles okurigana inside a word and particles へ/を', () => {
    const r = parseMarkup('{学校|がっこう} へ {行|い}きます。 パン を {食|た}べます。');
    expect(r.ja).toBe('学校へ行きます。パンを食べます。');
    expect(r.segments).toContainEqual({ surface: '行', reading: 'い' });
    expect(r.romaji).toBe('gakkou e ikimasu. pan o tabemasu.');
  });

  it('keeps は inside words as ha', () => {
    expect(parseMarkup('こんにちは').romaji).toBe('konnichiha');
    expect(parseMarkup('はい').romaji).toBe('hai');
  });

  it('rejects unbalanced markup', () => {
    expect(() => assertMarkup('{私|わたし は')).toThrow();
    expect(() => assertMarkup('{私|わたし} は')).not.toThrow();
  });
});
