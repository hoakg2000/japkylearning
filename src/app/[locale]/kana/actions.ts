'use server';

import { z } from 'zod';
import { requireUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { lessonProgress, testAttempts, userSettings } from '@/lib/db/schema';
import { hiragana, katakana } from '@/lib/content/kana';
import { addCards } from '@/lib/learning';
import { addXp, ensureSettings } from '@/lib/progress';
import { SKIP_PASS_RATIO } from '@/lib/quiz';
import { eq } from 'drizzle-orm';

const Input = z.object({
  mode: z.enum(['practice', 'skip']),
  total: z.number().int().min(1).max(100),
  correct: z.number().int().min(0),
  missed: z.array(z.string().max(4)).max(100),
  timeZone: z.string().max(64).optional(),
});


export async function recordKanaQuiz(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  if (input.correct > input.total) throw new Error('invalid score');
  const user = await requireUser();
  await ensureSettings(user.id, input.timeZone);
  const db = await getDb();
  const score = input.correct / input.total;

  await db.insert(testAttempts).values({
    userId: user.id,
    kind: input.mode === 'skip' ? 'placement' : 'kana',
    scope: { missed: input.missed },
    score,
    total: input.total,
    correct: input.correct,
  });

  // F7: missed kana become review cards; only chars that exist in content, duplicates ignored by the unique index.
  const known = new Set([...hiragana, ...katakana].map((k) => k.char));
  await addCards(user.id, [...new Set(input.missed)].filter((c) => known.has(c)).map((c) => ({ itemType: 'kana' as const, itemId: c })));

  const passedSkip = input.mode === 'skip' && score >= SKIP_PASS_RATIO;
  if (passedSkip) {
    await db
      .insert(lessonProgress)
      .values({ userId: user.id, lessonId: 'n5-00-kana', status: 'skipped', score, completedAt: new Date() })
      .onConflictDoUpdate({ target: [lessonProgress.userId, lessonProgress.lessonId], set: { status: 'skipped', score, completedAt: new Date() } });
    await db.update(userSettings).set({ knownLevel: 'kana' }).where(eq(userSettings.userId, user.id));
  }

  // 1 XP per correct answer, +5 for finishing.
  const streak = await addXp(user.id, 'kana', input.correct + 5, input.mode);
  return { score, passedSkip, streak };
}
