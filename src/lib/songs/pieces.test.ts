import { describe, expect, it } from 'vitest';
import { hiddenAt, linePieces } from './pieces';

const text = (p: ReturnType<typeof linePieces>[number]) => p.segments.map((s) => s.surface).join('');

describe('linePieces', () => {
  it('cuts plain text at keyword boundaries and keeps ruby', () => {
    const segs = [{ surface: '夜', reading: 'よる' }, { surface: 'に' }, { surface: '駆', reading: 'か' }, { surface: 'けて' }];
    const pieces = linePieces(segs, [{ start: 0, end: 1 }, { start: 2, end: 4 }]);
    expect(pieces.map(text)).toEqual(['夜', 'に', '駆け', 'て']);
    expect(pieces.map((p) => p.keyword)).toEqual([0, undefined, 1, undefined]);
    expect(pieces[2].segments[0]).toEqual({ surface: '駆', reading: 'か' });
  });

  it('a boundary inside a ruby group takes the whole group', () => {
    const pieces = linePieces([{ surface: '今日', reading: 'きょう' }, { surface: 'は' }], [{ start: 1, end: 2 }]);
    expect(pieces.map(text)).toEqual(['今日', 'は']);
    expect(pieces[0].keyword).toBe(0);
  });

  it('keeps the full line text in order', () => {
    const segs = [{ surface: 'あの' }, { surface: '日', reading: 'ひ' }, { surface: '見', reading: 'み' }, { surface: '渡した' }];
    expect(linePieces(segs, [{ start: 2, end: 3 }]).map(text).join('')).toBe('あの日見渡した');
  });
});

describe('hiddenAt', () => {
  it('hides none at 0%, all at 100%, roughly the share in between, always the same', () => {
    expect(hiddenAt(0, 1, 2)).toBe(false);
    expect(hiddenAt(100, 1, 2)).toBe(true);
    let n = 0;
    for (let l = 0; l < 50; l++) for (let s = 0; s < 20; s++) if (hiddenAt(25, l, s)) n++;
    expect(n / 1000).toBeGreaterThan(0.15);
    expect(n / 1000).toBeLessThan(0.35);
    expect(hiddenAt(50, 7, 3)).toBe(hiddenAt(50, 7, 3));
  });
});
