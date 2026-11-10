import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { bestAlternative, moraDiff, score, scoreReading, splitMora, toHiragana } from './mora';

describe('splitMora', () => {
  it('joins small ゃゅょ with the kana before', () => {
    expect(splitMora('きょう')).toEqual(['きょ', 'う']);
    expect(splitMora('しゃしん')).toEqual(['しゃ', 'し', 'ん']);
    expect(splitMora('びょういん')).toEqual(['びょ', 'う', 'い', 'ん']);
  });

  it('counts っ as one mora', () => {
    expect(splitMora('がっこう')).toEqual(['が', 'っ', 'こ', 'う']);
    expect(splitMora('きって')).toHaveLength(3);
  });

  it('counts ー as one mora and reads katakana as hiragana', () => {
    expect(splitMora('コーヒー')).toEqual(['こ', 'ー', 'ひ', 'ー']);
    expect(splitMora('ラーメン')).toHaveLength(4);
  });
});

describe('toHiragana', () => {
  const gakkou = { surface: '学校', reading: 'がっこう', segments: [{ surface: '学校', reading: 'がっこう' }] };
  const taberu = { surface: '食べる', reading: 'たべる', segments: [{ surface: '食', reading: 'た' }, { surface: 'べる' }] };

  it('maps kanji through the target word', () => {
    expect(toHiragana('学校', gakkou)).toBe('がっこう');
    expect(toHiragana('食べる。', taberu)).toBe('たべる');
    expect(toHiragana('食べた', taberu)).toBe('たべた');
  });

  it('keeps unknown kanji, so they count as wrong', () => {
    expect(toHiragana('学生', gakkou)).toContain('生');
  });
});

describe('score', () => {
  it('100 for a perfect match, lower per wrong mora', () => {
    expect(scoreReading('がっこう', '学校', { surface: '学校', reading: 'がっこう', segments: [{ surface: '学校', reading: 'がっこう' }] }).score).toBe(100);
    expect(score(splitMora('がっこう'), splitMora('がこう'))).toBe(75); // missing っ
    expect(score(splitMora('きょう'), splitMora('きよう'))).toBe(0); // きょ heard as き+よ: 1 sub + 1 ins over 2 mora
    expect(score(splitMora('びょういん'), splitMora('びよういん'))).toBe(50);
    expect(score(splitMora('こーひー'), splitMora('こひ'))).toBe(50); // both ー missing
  });

  it('marks wrong mora in target order', () => {
    expect(moraDiff(['が', 'っ', 'こ', 'う'], ['が', 'こ', 'う'])).toEqual([
      { op: 'ok', mora: 'が' },
      { op: 'del', mora: 'っ' },
      { op: 'ok', mora: 'こ' },
      { op: 'ok', mora: 'う' },
    ]);
  });

  it('is always between 0 and 100, and 100 only for an exact match', () => {
    const kana = fc.array(fc.constantFrom('か', 'き', 'きょ', 'っ', 'ー', 'ん', 'し', 'しゃ'), { minLength: 1, maxLength: 8 });
    fc.assert(
      fc.property(kana, kana, (t, h) => {
        const s = score(t, h);
        return s >= 0 && s <= 100 && (s === 100) === (t.join('|') === h.join('|'));
      }),
    );
  });
});

describe('bestAlternative', () => {
  const gakkou = { surface: '学校', reading: 'がっこう', segments: [{ surface: '学校', reading: 'がっこう' }] };
  it('keeps the best mappable transcript', () => {
    const r = bestAlternative('がっこう', ['学生', 'がこう', '学校'], gakkou);
    expect(r).toMatchObject({ unmapped: false, score: 100, transcript: '学校' });
  });
  it('is unmapped when every transcript keeps foreign kanji or latin', () => {
    expect(bestAlternative('がっこう', ['学生', 'school'], gakkou)).toEqual({ unmapped: true, heard: '学生' });
    expect(bestAlternative('がっこう', [], gakkou)).toEqual({ unmapped: true, heard: '' });
  });
});
