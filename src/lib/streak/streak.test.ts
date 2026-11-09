import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { addDays, computeStreak, grantWeeklyFreeze, isoWeek, studyDate } from '.';

describe('studyDate', () => {
  it('rolls over at 04:00 local time', () => {
    // 2026-10-26 02:00 in Ho Chi Minh (UTC+7) = 2026-10-25T19:00Z → still the 25th.
    expect(studyDate(new Date('2026-10-25T19:00:00Z'), 'Asia/Ho_Chi_Minh')).toBe('2026-10-25');
    // 04:01 local → the 26th.
    expect(studyDate(new Date('2026-10-25T21:01:00Z'), 'Asia/Ho_Chi_Minh')).toBe('2026-10-26');
  });

  it('23:59 and 00:01 of consecutive nights at 05:00+ boundaries differ', () => {
    const a = studyDate(new Date('2026-10-26T16:59:00Z'), 'Asia/Ho_Chi_Minh'); // 23:59 on the 26th
    const b = studyDate(new Date('2026-10-27T21:01:00Z'), 'Asia/Ho_Chi_Minh'); // 04:01 on the 28th
    expect(a).toBe('2026-10-26');
    expect(b).toBe('2026-10-28');
  });

  it('handles DST transitions without skipping a date', () => {
    // US DST ends 2026-11-01 02:00 local. 10:00 local on 11-01 is after rollover.
    expect(studyDate(new Date('2026-11-01T15:00:00Z'), 'America/New_York')).toBe('2026-11-01');
    expect(studyDate(new Date('2026-11-01T07:30:00Z'), 'America/New_York')).toBe('2026-10-31');
  });
});

describe('computeStreak', () => {
  const today = '2026-10-26';
  it('counts consecutive days ending today', () => {
    expect(computeStreak(['2026-10-24', '2026-10-25', '2026-10-26'], today, 0).current).toBe(3);
  });
  it('keeps streak when today is not studied yet', () => {
    const r = computeStreak(['2026-10-24', '2026-10-25'], today, 0);
    expect(r.current).toBe(2);
    expect(r.studiedToday).toBe(false);
  });
  it('resets to 0 when a day was missed and no freeze', () => {
    expect(computeStreak(['2026-10-23', '2026-10-24'], today, 0).current).toBe(0);
  });
  it('uses a freeze for one missed day', () => {
    const r = computeStreak(['2026-10-23', '2026-10-24'], today, 1);
    expect(r.current).toBe(2);
    expect(r.freezesUsed).toEqual(['2026-10-25']);
    expect(r.freezesLeft).toBe(0);
  });
  it('bridges an inner gap with freezes', () => {
    const r = computeStreak(['2026-10-22', '2026-10-24', '2026-10-25', '2026-10-26'], today, 2);
    expect(r.current).toBe(4);
    expect(r.freezesUsed).toEqual(['2026-10-23']);
  });
  it('tracks longest separately', () => {
    const r = computeStreak(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-25', '2026-10-26'], today, 0);
    expect(r).toMatchObject({ current: 2, longest: 3 });
  });

  it('property: current ≤ longest and current ≤ number of study days', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer({ min: 0, max: 60 })), fc.integer({ min: 0, max: 2 }), (offsets, freezes) => {
        const days = offsets.map((o) => addDays(today, -o));
        const r = computeStreak(days, today, freezes);
        expect(r.current).toBeLessThanOrEqual(r.longest || r.current);
        expect(r.current).toBeLessThanOrEqual(days.length);
        expect(r.freezesLeft).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  it('property: studying every day for n days gives streak n', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 400 }), (n) => {
        const days = Array.from({ length: n }, (_, i) => addDays(today, -i));
        expect(computeStreak(days, today, 0).current).toBe(n);
      }),
    );
  });
});

describe('weekly freeze', () => {
  it('grants once per ISO week, capped at 2', () => {
    let s = grantWeeklyFreeze(0, null, '2026-10-26');
    expect(s).toEqual({ available: 1, lastGrantedWeek: isoWeek('2026-10-26') });
    s = grantWeeklyFreeze(s.available, s.lastGrantedWeek, '2026-10-27');
    expect(s.available).toBe(1);
    s = grantWeeklyFreeze(2, s.lastGrantedWeek, '2026-11-02');
    expect(s.available).toBe(2);
  });
  it('computes ISO weeks across year boundary', () => {
    expect(isoWeek('2026-01-01')).toBe('2026-W01');
    expect(isoWeek('2027-01-01')).toBe('2026-W53');
  });
});
