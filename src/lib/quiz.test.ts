import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { buildOptions, pickWeighted, shuffle } from './quiz';

const romaji = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'ji', 'ji'];

describe('buildOptions', () => {
  it('never contains duplicate answers and always contains the answer', () => {
    fc.assert(
      fc.property(fc.constantFrom(...romaji), fc.integer({ min: 2, max: 6 }), (answer, count) => {
        const opts = buildOptions(answer, romaji, count, (x) => x);
        expect(new Set(opts).size).toBe(opts.length);
        expect(opts).toContain(answer);
        expect(opts.length).toBeLessThanOrEqual(count);
      }),
    );
  });
});

describe('shuffle', () => {
  it('keeps all items', () => {
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('pickWeighted', () => {
  it('favours items with more misses', () => {
    let seed = 1;
    const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const counts = { a: 0, b: 0 };
    for (let i = 0; i < 2000; i++) counts[pickWeighted(['a', 'b'] as const, (x) => (x === 'b' ? 5 : 0), rng)]++;
    expect(counts.b).toBeGreaterThan(counts.a * 5);
  });
});
