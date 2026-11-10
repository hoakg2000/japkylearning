import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { lineAt, parseLrc } from './lrc';

describe('parseLrc', () => {
  it('reads timestamps, drops tags and empty lines, sorts by time', () => {
    const lrc = '[ar:Someone]\n[ti:Song]\n[00:12.50]二行目\n[00:01.00]一行目\n[00:20.00]\n[01:02.345]三行目';
    expect(parseLrc(lrc)).toEqual([
      { t: 1, text: '一行目' },
      { t: 12.5, text: '二行目' },
      { t: 62.345, text: '三行目' },
    ]);
  });

  it('repeats a line with several timestamps and applies [offset:]', () => {
    expect(parseLrc('[offset:500]\n[00:10.00][00:30.00]サビ')).toEqual([
      { t: 9.5, text: 'サビ' },
      { t: 29.5, text: 'サビ' },
    ]);
  });
});

describe('lineAt', () => {
  const lines = [{ t: 1 }, { t: 5 }, { t: 9 }];
  it('finds the current line', () => {
    expect(lineAt(lines, 0.5)).toBe(-1);
    expect(lineAt(lines, 1)).toBe(0);
    expect(lineAt(lines, 8.99)).toBe(1);
    expect(lineAt(lines, 100)).toBe(2);
    expect(lineAt([], 3)).toBe(-1);
  });

  it('matches a linear scan', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ min: 0, max: 300, noNaN: true })), fc.float({ min: 0, max: 300, noNaN: true }), (ts, time) => {
        const sorted = ts.toSorted((a, b) => a - b).map((t) => ({ t }));
        let expected = -1;
        sorted.forEach((l, i) => {
          if (l.t <= time) expected = i;
        });
        return lineAt(sorted, time) === expected;
      }),
    );
  });
});
