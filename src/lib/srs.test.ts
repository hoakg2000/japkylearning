import { describe, expect, it } from 'vitest';
import { newCard, Rating, retrievability, review, unlockedDirection } from './srs';

const DAY = 86_400_000;

describe('FSRS wrapper', () => {
  it('new cards are due now', () => {
    const now = new Date('2026-10-26T00:00:00Z');
    expect(newCard(now).due.getTime()).toBe(now.getTime());
  });

  it('intervals grow when answering Good repeatedly', () => {
    let row = newCard(new Date('2026-10-01T00:00:00Z'));
    let now = row.due;
    const intervals: number[] = [];
    for (let i = 0; i < 6; i++) {
      row = review(row, Rating.Good, now).row;
      intervals.push((row.due.getTime() - now.getTime()) / DAY);
      now = row.due;
    }
    for (let i = 3; i < intervals.length; i++) expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
    expect(row.reps).toBe(6);
  });

  it('Again counts a lapse on a review card and brings it back soon', () => {
    let row = newCard(new Date('2026-10-01T00:00:00Z'));
    let now = row.due;
    for (let i = 0; i < 4; i++) {
      row = review(row, Rating.Good, now).row;
      now = row.due;
    }
    const before = row.lapses;
    const again = review(row, Rating.Again, now).row;
    expect(again.lapses).toBe(before + 1);
    expect(again.due.getTime() - now.getTime()).toBeLessThan(DAY);
  });

  it('retrievability drops over time', () => {
    let row = newCard(new Date('2026-10-01T00:00:00Z'));
    row = review(row, Rating.Good, row.due).row;
    row = review(row, Rating.Good, row.due).row;
    const soon = retrievability(row, new Date(row.due.getTime() - DAY));
    const late = retrievability(row, new Date(row.due.getTime() + 30 * DAY));
    expect(soon).toBeGreaterThan(late);
  });

  it('only a mature word recognition card unlocks production', () => {
    const young = newCard();
    const mature = { ...young, scheduledDays: 30 };
    expect(unlockedDirection('word', 'recognition', young)).toBeNull();
    expect(unlockedDirection('word', 'recognition', mature)).toBe('production');
    expect(unlockedDirection('word', 'production', mature)).toBeNull();
    expect(unlockedDirection('grammar', 'recognition', mature)).toBeNull();
  });
});
