// Pure streak logic (docs/02-FEATURES.md F2). No I/O: callers pass study days and "now".

export const ROLLOVER_HOUR = 4;
export const MAX_FREEZES = 2;

/** Local study date (YYYY-MM-DD) for an instant in an IANA time zone, with a 04:00 rollover. */
export function studyDate(now: Date, timeZone: string): string {
  const shifted = new Date(now.getTime() - ROLLOVER_HOUR * 3600_000);
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(shifted);
}

const DAY = 86_400_000;
const toDay = (date: string) => Date.parse(`${date}T00:00:00Z`) / DAY;
export const addDays = (date: string, n: number) => new Date((toDay(date) + n) * DAY).toISOString().slice(0, 10);

/** ISO week key (e.g. 2026-W43) of a local date; used for the weekly free freeze. */
export function isoWeek(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dow + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / DAY - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export type StreakResult = {
  current: number;
  longest: number;
  /** Gap days covered by freezes while computing; caller persists them as used. */
  freezesUsed: string[];
  freezesLeft: number;
  studiedToday: boolean;
};

/**
 * Computes the streak from goal-met study days. A gap of missed days is bridged
 * if enough freezes are available; otherwise the streak resets.
 * Today not yet studied does not break the streak.
 */
export function computeStreak(goalDays: Iterable<string>, today: string, freezesAvailable: number): StreakResult {
  const days = [...new Set(goalDays)].filter((d) => d <= today).sort();
  let freezes = Math.min(freezesAvailable, MAX_FREEZES);
  const freezesUsed: string[] = [];
  let run = 0;
  let longest = 0;
  let prev: string | null = null;

  for (const day of days) {
    if (prev === null) run = 1;
    else {
      const gap = toDay(day) - toDay(prev) - 1;
      if (gap === 0) run += 1;
      else if (gap <= freezes) {
        for (let i = 1; i <= gap; i++) freezesUsed.push(addDays(prev, i));
        freezes -= gap;
        run += 1;
      } else run = 1;
    }
    longest = Math.max(longest, run);
    prev = day;
  }

  const studiedToday = prev === today;
  let current = 0;
  if (prev !== null) {
    // Days missed after the last study day, not counting today (still open).
    const missed = toDay(today) - toDay(prev) - 1;
    if (studiedToday || missed <= 0) current = run;
    else if (missed <= freezes) {
      for (let i = 1; i <= missed; i++) freezesUsed.push(addDays(prev, i));
      freezes -= missed;
      current = run;
    }
  }
  return { current, longest, freezesUsed, freezesLeft: freezes, studiedToday };
}

/** Weekly free freeze: grant 1 when the ISO week changed, capped at MAX_FREEZES. */
export function grantWeeklyFreeze(available: number, lastGrantedWeek: string | null, today: string) {
  const week = isoWeek(today);
  if (week === lastGrantedWeek) return { available, lastGrantedWeek };
  return { available: Math.min(available + 1, MAX_FREEZES), lastGrantedWeek: week };
}

/** Milestones celebrated in the UI (F2). */
export const MILESTONES = [3, 7, 30, 100, 365] as const;
export const isMilestone = (n: number) => (MILESTONES as readonly number[]).includes(n);
