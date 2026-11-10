'use server';

import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';

/** The signed-in learner's own streak widget id, or null when it is off (the page itself stays static). */
export async function myStreakEmbedId(): Promise<string | null> {
  const session = await getSession();
  if (!session || session.user.isAnonymous) return null;
  const db = await getDb();
  const [row] = await db.select({ id: userSettings.streakPublicId }).from(userSettings).where(eq(userSettings.userId, session.user.id));
  return row?.id ?? null;
}
