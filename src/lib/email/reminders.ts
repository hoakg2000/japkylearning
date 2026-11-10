// Opt-in study reminders (F2, P5 decision D6). No 'server-only': scripts/send-reminders.ts runs this outside Next.
// shortcut: candidates are filtered in JS after one query; move the consent/study-day checks into SQL when users > ~10k.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { and, desc, eq, inArray, isNotNull } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { user } from '../db/auth-schema';
import { consents, studyDays, userSettings } from '../db/schema';
import { studyDate } from '../streak';
import type { EmailMessage } from './transport';

/** Hour 0-23 in the learner's time zone. */
export function localHour(now: Date, timeZone: string): number {
  return Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone }).format(now));
}

export type Candidate = { reminderHour: number; timezone: string; lastRemindedOn: string | null; consent: boolean; goalMetToday: boolean };

/** Send only with consent, in the chosen hour, once per study day, and not after today's goal is met (no nagging, F2). */
export function shouldRemind(c: Candidate, now: Date): boolean {
  return c.consent && localHour(now, c.timezone) === c.reminderHour && c.lastRemindedOn !== studyDate(now, c.timezone) && !c.goalMetToday;
}

export function unsubscribeToken(userId: string, secret: string): string {
  return createHmac('sha256', secret).update(`unsubscribe:${userId}`).digest('base64url');
}

export function verifyUnsubscribe(userId: string, token: string, secret: string): boolean {
  const expected = Buffer.from(unsubscribeToken(userId, secret));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function reminderEmail(to: string, unsubscribeUrl: string, appUrl: string): EmailMessage {
  return {
    to,
    subject: 'Japky: 5 phút tiếng Nhật hôm nay? / 5 minutes of Japanese today?',
    text: [
      'Chào bạn, hôm nay mình ôn vài thẻ tiếng Nhật nhé. Chỉ cần 5 phút.',
      'Hi! A few Japanese cards are waiting for you today. Five minutes is enough.',
      '',
      `${appUrl}/vi/review`,
      '',
      `Tắt nhắc học / Stop reminders: ${unsubscribeUrl}`,
    ].join('\n'),
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
  };
}

type Db = PgDatabase<PgQueryResultHKT>;

/** Learners due for a reminder now: signed-up accounts with an email, a reminder hour and the email_reminders consent. */
export async function dueReminders(db: Db, now = new Date()) {
  const rows = await db
    .select({ id: user.id, email: user.email, reminderHour: userSettings.reminderHour, timezone: userSettings.timezone, lastRemindedOn: userSettings.lastRemindedOn })
    .from(userSettings)
    .innerJoin(user, eq(user.id, userSettings.userId))
    .where(and(isNotNull(userSettings.reminderHour), eq(user.isAnonymous, false), isNotNull(user.email)));
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const consentRows = await db
    .select({ userId: consents.userId, granted: consents.granted })
    .from(consents)
    .where(and(inArray(consents.userId, ids), eq(consents.purpose, 'email_reminders')))
    .orderBy(desc(consents.at), desc(consents.id));
  const latest = new Map<string, boolean>();
  for (const c of consentRows) if (!latest.has(c.userId)) latest.set(c.userId, c.granted);
  const met = await db
    .select({ userId: studyDays.userId, localDate: studyDays.localDate })
    .from(studyDays)
    .where(and(inArray(studyDays.userId, ids), eq(studyDays.goalMet, true)));
  return rows.filter((r) =>
    shouldRemind(
      {
        reminderHour: r.reminderHour!,
        timezone: r.timezone,
        lastRemindedOn: r.lastRemindedOn,
        consent: latest.get(r.id) === true,
        goalMetToday: met.some((m) => m.userId === r.id && m.localDate === studyDate(now, r.timezone)),
      },
      now,
    ),
  );
}

export async function markReminded(db: Db, userId: string, localDate: string) {
  await db.update(userSettings).set({ lastRemindedOn: localDate }).where(eq(userSettings.userId, userId));
}
