'use server';

import { z } from 'zod';
import { requireUser } from '@/lib/auth/session';
import { gradeAnswer } from '@/lib/grade-answer';
import { recordMockExam } from '@/lib/learning';
import { addXp, ensureSettings } from '@/lib/progress';

const Input = z.object({
  answers: z.array(z.object({ questionId: z.string().max(80), answer: z.string().max(80) })).min(1).max(40),
  timeZone: z.string().max(64).optional(),
});

export async function submitMockExam(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  const user = await requireUser();
  await ensureSettings(user.id, input.timeZone);
  // Graded on the server; unanswered questions arrive with an empty answer and count as wrong.
  const graded = input.answers.flatMap((a) => {
    const g = gradeAnswer(null, a.questionId, a.answer);
    return g ? [{ ...a, correct: g.correct, skillTags: [g.skill] }] : [];
  });
  if (!graded.length) throw new Error('NO_VALID_ANSWERS');
  const result = await recordMockExam(user.id, graded);
  const streak = await addXp(user.id, 'test', 10 + result.correct, 'mock-n5');
  return { ...result, streak };
}
