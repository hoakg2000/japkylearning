'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';
import { recordConsent } from '@/lib/progress';
import { eq } from 'drizzle-orm';

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
