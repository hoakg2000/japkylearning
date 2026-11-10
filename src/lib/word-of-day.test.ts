import { describe, expect, it } from 'vitest';
import { vietnamDay, wordOfDayIndex } from './word-of-day';

describe('word of the day', () => {
  it('flips at 00:00 in Vietnam (17:00 UTC), whatever the viewer time zone', () => {
    const before = new Date('2026-11-10T16:59:59Z'); // 23:59:59 in Ho Chi Minh City
    const after = new Date('2026-11-10T17:00:00Z'); // 00:00:00 next day
    expect(vietnamDay(after) - vietnamDay(before)).toBe(1);
    expect(wordOfDayIndex(before, 477)).not.toBe(wordOfDayIndex(after, 477));
  });

  it('is the same all through one Vietnam day', () => {
    expect(wordOfDayIndex(new Date('2026-11-10T17:00:00Z'), 477)).toBe(wordOfDayIndex(new Date('2026-11-11T16:59:00Z'), 477));
  });

  it('stays inside the list', () => {
    for (let d = 0; d < 400; d++) {
      const i = wordOfDayIndex(new Date(Date.UTC(2026, 0, 1) + d * 86_400_000), 7);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(7);
    }
    expect(wordOfDayIndex(new Date(), 0)).toBe(0);
  });
});
