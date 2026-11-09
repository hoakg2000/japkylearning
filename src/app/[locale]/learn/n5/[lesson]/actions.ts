'use server';

import { z } from 'zod';
import { requireUser } from '@/lib/auth/session';
import { gradeAnswer } from '@/lib/grade-answer';
import { recordLessonTest } from '@/lib/learning';
import { addXp, ensureSettings } from '@/lib/progress';

const Input = z.object({
  lessonId: z.string().regex(/^n5-\d{2}$/),
  answers: z.array(z.object({ questionId: z.string().max(80), answer: z.string().max(80) })).min(1).max(30),
  timeZone: z.string().max(64).optional(),
});

export async function submitLessonTest(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  const user = await requireUser();
  await ensureSettings(user.id, input.timeZone);
  // Grade on the server: the client only sends what was picked.
  const graded = input.answers.flatMap((a) => {
    const g = gradeAnswer(input.lessonId, a.questionId, a.answer);
    return g ? [{ ...a, correct: g.correct, skillTags: [g.skill] }] : [];
  });
  if (!graded.length) throw new Error('NO_VALID_ANSWERS');
  const result = await recordLessonTest(user.id, input.lessonId, graded);
  const streak = await addXp(user.id, 'lesson', 10 + result.correct, input.lessonId);
  return { ...result, streak, wrong: graded.filter((a) => !a.correct).map((a) => a.questionId) };
}
