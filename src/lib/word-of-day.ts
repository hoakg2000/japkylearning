// Word of the day (F12, P7 decision G4): the same word for everyone on a Vietnam calendar day, flipping at 00:00.
// Pure, used in the browser so the embed page stays static.
const STRIDE = 7919; // prime step so consecutive days do not show consecutive lesson words

/** Days since 1970-01-01 in Asia/Ho_Chi_Minh. */
export function vietnamDay(now: Date): number {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return Math.floor(Date.parse(`${ymd}T00:00:00Z`) / 86_400_000);
}

export function wordOfDayIndex(now: Date, count: number): number {
  if (count <= 0) return 0;
  return (((vietnamDay(now) * STRIDE) % count) + count) % count;
}
