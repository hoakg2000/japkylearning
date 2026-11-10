import { describe, expect, it } from 'vitest';
import { addEntry, inflections, segmentLine, type DictEntry } from './lyrics';

const yoru: DictEntry = { surface: '夜', segments: [{ surface: '夜', reading: 'よる' }], wordId: 'w-yoru' };
const kakeru: DictEntry = { surface: '駆ける', segments: [{ surface: '駆', reading: 'か' }, { surface: 'ける' }] };
const kaku: DictEntry = { surface: '書く', segments: [{ surface: '書', reading: 'か' }, { surface: 'く' }], wordId: 'w-kaku' };
const sora: DictEntry = { surface: '空', segments: [{ surface: '空', reading: 'そら' }], wordId: 'w-sora' };

function dict(...entries: DictEntry[]) {
  const d = new Map<string, DictEntry>();
  for (const e of entries) addEntry(d, e);
  return d;
}

describe('lyrics furigana', () => {
  it('adds readings by longest match and keeps kana', () => {
    const r = segmentLine('夜に駆ける', dict(yoru, kakeru));
    expect(r.segments).toEqual([{ surface: '夜', reading: 'よる' }, { surface: 'に' }, { surface: '駆', reading: 'か' }, { surface: 'ける' }]);
    expect(r.unread).toBe(0);
  });

  it('counts kanji it cannot read', () => {
    const r = segmentLine('沈む空', dict(sora));
    expect(r.kanji).toBe(2);
    expect(r.unread).toBe(1);
  });

  it('finds conjugated godan and ichidan forms through stems', () => {
    const d = dict(kaku, ...inflections(kaku, ['v5k']), kakeru, ...inflections(kakeru, ['v1']));
    expect(segmentLine('書いた', d).segments[0]).toEqual({ surface: '書', reading: 'か' });
    expect(segmentLine('駆けて', d).unread).toBe(0);
  });

  it('keyword tokens point at the exact characters of the line', () => {
    const line = '「さよなら」夜の空に書いた';
    const d = dict(yoru, sora, kaku, ...inflections(kaku, ['v5k']));
    const chars = [...line];
    for (const t of segmentLine(line, d).tokens) expect(chars.slice(t.start, t.end).join('')).toBe(t.entry.surface);
    expect(segmentLine(line, d).tokens.map((t) => t.entry.wordId)).toEqual(['w-yoru', 'w-sora', 'w-kaku']);
  });
});
