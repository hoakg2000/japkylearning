import 'server-only';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { consents, streakFreezes, studyDays, userSettings, xpEvents } from '@/lib/db/schema';
import { addDays, computeStreak, grantWeeklyFreeze, studyDate } from '@/lib/streak';

export const POLICY_VERSION = '2026-10-26';

/** Valid IANA zone or the default; the client sends Intl's zone. */
export function safeTimeZone(tz: string | undefined | null): string {
  try {
    if (tz) {
      new Intl.DateTimeFormat('en', { timeZone: tz });
      return tz;
    }
  } catch {}
  return 'Asia/Ho_Chi_Minh';
}

/** Settings row, created with the client time zone on first use. */
export async function ensureSettings(userId: string, timeZone?: string) {
  const db = await getDb();
  const [row] = await db
    .insert(userSettings)
    .values({ userId, timezone: safeTimeZone(timeZone) })
    .onConflictDoNothing()
    .returning();
  if (row) return row;
  const [existing] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
  return existing;
}

/**
 * Records XP for an activity: one xp_events row and an atomic upsert on study_days
 * (concurrent events add up, ADR / 02-FEATURES F2).
 */
export async function addXp(userId: string, source: string, amount: number, refId?: string) {
  const db = await getDb();
  const settings = await ensureSettings(userId);
  const today = studyDate(new Date(), settings.timezone);
  // A unique index may reject a repeat (speaking XP once per word per day): then nothing is added.
  const added = await db.insert(xpEvents).values({ userId, source, amount, refId }).onConflictDoNothing().returning({ id: xpEvents.id });
  if (!added.length) return getStreak(userId);
  await db
    .insert(studyDays)
    .values({ userId, localDate: today, xp: amount, goalMet: amount >= settings.dailyGoalXp })
    .onConflictDoUpdate({
      target: [studyDays.userId, studyDays.localDate],
      set: {
        xp: sql`${studyDays.xp} + ${amount}`,
        goalMet: sql`${studyDays.xp} + ${amount} >= ${settings.dailyGoalXp}`,
      },
    });
  return getStreak(userId);
}

/** Streak computed on read (pure function over study days), applying the weekly freeze lazily. */
export async function getStreak(userId: string) {
  const db = await getDb();
  const settings = await ensureSettings(userId);
  const today = studyDate(new Date(), settings.timezone);

  const [f] = await db.select().from(streakFreezes).where(eq(streakFreezes.userId, userId));
  const granted = grantWeeklyFreeze(f?.available ?? 0, f?.lastGrantedWeek ?? null, today);

  const since = addDays(today, -400);
  const days = await db
    .select({ localDate: studyDays.localDate, xp: studyDays.xp, goalMet: studyDays.goalMet, freezeUsed: studyDays.freezeUsed })
    .from(studyDays)
    .where(and(eq(studyDays.userId, userId), gte(studyDays.localDate, since)))
    .orderBy(desc(studyDays.localDate));

  // Days bridged by a freeze earlier count as kept days.
  const kept = days.filter((d) => d.goalMet || d.freezeUsed).map((d) => d.localDate);
  const result = computeStreak(kept, today, granted.available);

  if (result.freezesUsed.length) {
    await db
      .insert(studyDays)
      .values(result.freezesUsed.map((localDate) => ({ userId, localDate, freezeUsed: true })))
      .onConflictDoUpdate({ target: [studyDays.userId, studyDays.localDate], set: { freezeUsed: true } });
  }
  if (!f || granted.available !== f.available || granted.lastGrantedWeek !== f.lastGrantedWeek || result.freezesUsed.length) {
    await db
      .insert(streakFreezes)
      .values({ userId, available: result.freezesLeft, lastGrantedWeek: granted.lastGrantedWeek })
      .onConflictDoUpdate({ target: streakFreezes.userId, set: { available: result.freezesLeft, lastGrantedWeek: granted.lastGrantedWeek } });
  }

  const todayRow = days.find((d) => d.localDate === today);
  return {
    current: result.current,
    longest: result.longest,
    freezes: result.freezesLeft,
    todayXp: todayRow?.xp ?? 0,
    goalXp: settings.dailyGoalXp,
    goalMetToday: todayRow?.goalMet ?? false,
    history: days.slice(0, 84).map((d) => ({ date: d.localDate, xp: d.xp, kept: d.goalMet || d.freezeUsed })),
  };
}

export type StreakInfo = Awaited<ReturnType<typeof getStreak>>;

export async function recordConsent(userId: string, purpose: string, granted: boolean) {
  const db = await getDb();
  await db.insert(consents).values({ userId, purpose, granted, policyVersion: POLICY_VERSION });
}

/** Latest decision per purpose. */
export async function getConsents(userId: string) {
  const db = await getDb();
  const rows = await db.select().from(consents).where(eq(consents.userId, userId)).orderBy(desc(consents.at), desc(consents.id));
  const latest = new Map<string, boolean>();
  for (const r of rows) if (!latest.has(r.purpose)) latest.set(r.purpose, r.granted);
  return Object.fromEntries(latest) as Record<string, boolean>;
}
