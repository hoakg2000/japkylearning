export const MIN_AGE = 16;

/** True when someone born in `birthYear` is at least 16 this year (year-only check, ADR 0011). */
export function isOldEnough(birthYear: number | undefined | null, now = new Date()): boolean {
  if (!birthYear || !Number.isInteger(birthYear)) return false;
  const age = now.getFullYear() - birthYear;
  return age >= MIN_AGE && age < 120;
}
