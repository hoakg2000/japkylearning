'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';
import { addXp, ensureSettings } from '@/lib/progress';

const Input = z.object({
  knownLevel: z.enum(['none', 'kana', 'some-n5']),
  goal: z.enum(['jlpt', 'tokutei', 'it']),
  sector: z.enum(['kaigo', 'food-service', 'manufacturing', 'construction', 'agriculture', 'other']).optional(),
  dailyGoalXp: z.union([z.literal(10), z.literal(20), z.literal(50)]),
  firstRunScore: z.number().int().min(0).max(5).optional(),
  timeZone: z.string().max(64).optional(),
});

export async function saveOnboarding(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  const user = await requireUser();
  await ensureSettings(user.id, input.timeZone);
  const db = await getDb();
  await db
    .update(userSettings)
    .set({
      knownLevel: input.knownLevel,
      goal: input.goal,
      sector: input.goal === 'tokutei' ? (input.sector ?? null) : null,
      dailyGoalXp: input.dailyGoalXp,
      onboardedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, user.id));
  if (input.firstRunScore) await addXp(user.id, 'placement', input.firstRunScore, 'first-run');
  // Where to go next: kana learners start the chart, others take the skip test.
  return { next: input.knownLevel === 'none' ? '/kana' : '/kana/quiz?mode=skip' } as const;
}
