'use server';

import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod';
import { getAuth } from '@/lib/auth';
import { isOldEnough } from '@/lib/auth/age';
import { getLesson } from '@/lib/content/n5';
import { getDb } from '@/lib/db';
import { testAttempts, xpEvents } from '@/lib/db/schema';
import { addXp, ensureSettings, getConsents } from '@/lib/progress';
import { studyDate } from '@/lib/streak';

export type SpeakStatus = 'ok' | 'signin' | 'age' | 'consent';

async function speaker() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.isAnonymous) return { status: 'signin' as const };
  const user = session.user as typeof session.user & { birthYear?: number | null };
  if (!isOldEnough(user.birthYear)) return { status: 'age' as const };
  if ((await getConsents(user.id)).speech_processing !== true) return { status: 'consent' as const, user };
  return { status: 'ok' as const, user };
}

/** Whether this visitor may record (F10: signed-in, 16+, `speech_processing` consent). */
export async function speakStatus(): Promise<SpeakStatus> {
  return (await speaker()).status;
}

const Input = z.object({ lessonId: z.string().max(20), wordId: z.string().max(80), score: z.number().int().min(0).max(100) });

const SPEAK_PASS = 70;
const SPEAK_XP = 2;

/** Stores the score only (never audio). XP once per word per study day, so repeating a word does not farm XP. */
export async function recordSpeaking(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  const lesson = getLesson(input.lessonId);
  if (!lesson?.wordIds.includes(input.wordId)) throw new Error('UNKNOWN_WORD');
  const s = await speaker();
  if (s.status !== 'ok') throw new Error(s.status.toUpperCase());
  const db = await getDb();
  await db.insert(testAttempts).values({
    userId: s.user.id,
    kind: 'speaking',
    scope: { lessonId: input.lessonId, wordId: input.wordId },
    score: input.score / 100,
    total: 1,
    correct: input.score >= SPEAK_PASS ? 1 : 0,
  });
  const settings = await ensureSettings(s.user.id);
  const ref = `${input.wordId}:${studyDate(new Date(), settings.timezone)}`;
  const [already] = await db.select({ id: xpEvents.id }).from(xpEvents).where(and(eq(xpEvents.userId, s.user.id), eq(xpEvents.source, 'speaking'), eq(xpEvents.refId, ref)));
  if (already) return { xp: 0 };
  // The unique index xp_events_speaking_uq stops a concurrent duplicate inside addXp.
  await addXp(s.user.id, 'speaking', SPEAK_XP, ref);
  return { xp: SPEAK_XP };
}
