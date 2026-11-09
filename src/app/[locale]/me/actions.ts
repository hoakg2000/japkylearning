'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ttsVoices, userSettings } from '@/lib/db/schema';
import { ensureSettings, recordConsent, safeTimeZone } from '@/lib/progress';
import { studyDate } from '@/lib/streak';
import { and, eq, isNull, ne, or } from 'drizzle-orm';

async function currentUser() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('UNAUTHORIZED');
  return session.user;
}

export async function recordSignupConsents(raw: { analytics: boolean; emailReminders: boolean }) {
  const input = z.object({ analytics: z.boolean(), emailReminders: z.boolean() }).parse(raw);
  const user = await currentUser();
  if (user.isAnonymous) throw new Error('UNAUTHORIZED');
  await recordConsent(user.id, 'account', true);
  await recordConsent(user.id, 'analytics', input.analytics);
  await recordConsent(user.id, 'email_reminders', input.emailReminders);
}

const Purpose = z.enum(['analytics', 'email_reminders', 'ai_processing', 'speech_processing']);

export async function setConsent(purpose: z.input<typeof Purpose>, granted: boolean) {
  const user = await currentUser();
  if (user.isAnonymous) throw new Error('UNAUTHORIZED');
  await recordConsent(user.id, Purpose.parse(purpose), z.boolean().parse(granted));
}

const Settings = z.object({
  dailyGoalXp: z.union([z.literal(10), z.literal(20), z.literal(50)]),
  furiganaMode: z.enum(['always', 'unlearned', 'never']),
  showRomaji: z.boolean(),
  showHanViet: z.boolean(),
});

export async function updateSettings(raw: z.input<typeof Settings>) {
  const input = Settings.parse(raw);
  const user = await currentUser();
  const db = await getDb();
  await db.update(userSettings).set({ ...input, updatedAt: new Date() }).where(eq(userSettings.userId, user.id));
}

/** Chooses a cloud voice. Only enabled voices from the allowlist are accepted; null returns to the device voice. */
export async function setVoice(voiceId: string | null) {
  const user = await currentUser();
  if (user.isAnonymous) throw new Error('UNAUTHORIZED');
  const db = await getDb();
  const id = voiceId === null ? null : z.string().min(1).max(40).parse(voiceId);
  if (id) {
    const [v] = await db.select().from(ttsVoices).where(eq(ttsVoices.id, id));
    if (!v || !v.enabled) throw new Error('VOICE_NOT_ALLOWED');
  }
  await db.update(userSettings).set({ ttsVoiceId: id, updatedAt: new Date() }).where(eq(userSettings.userId, user.id));
}

/** F3: changes the study time zone at most once per study day, so a streak cannot be gamed by hopping zones. */
export async function setTimezone(raw: string) {
  const user = await currentUser();
  const zone = z.string().min(1).max(64).parse(raw);
  if (safeTimeZone(zone) !== zone) throw new Error('INVALID_TIMEZONE');
  const settings = await ensureSettings(user.id);
  const today = studyDate(new Date(), settings.timezone);
  const db = await getDb();
  const changed = await db
    .update(userSettings)
    .set({ timezone: zone, timezoneChangedOn: today, updatedAt: new Date() })
    .where(and(eq(userSettings.userId, user.id), or(isNull(userSettings.timezoneChangedOn), ne(userSettings.timezoneChangedOn, today))))
    .returning({ userId: userSettings.userId });
  return { ok: changed.length > 0 };
}
