import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { lessonProgress, testAttempts } from '@/lib/db/schema';

export type TodayTask = { id: string; kind: 'kana' | 'review' | 'lesson' | 'weak'; href: string; priority: number; reason: string; count?: number };

/** Kana counts as done when skipped by the placement test or practised to 80%+ twice. */
export async function kanaDone(userId: string) {
  const db = await getDb();
  const [lp] = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, 'n5-00-kana')));
  if (lp && (lp.status === 'done' || lp.status === 'skipped')) return true;
  const recent = await db.select({ score: testAttempts.score }).from(testAttempts).where(and(eq(testAttempts.userId, userId), eq(testAttempts.kind, 'kana'))).orderBy(desc(testAttempts.finishedAt)).limit(5);
  return recent.filter((r) => r.score >= 0.8).length >= 2;
}

/** Rule-based plan for the Today screen (F7 layer 1). P2 adds reviews, lessons and weak skills. */
export async function getTodayPlan(userId: string): Promise<TodayTask[]> {
  const tasks: TodayTask[] = [];
  if (!(await kanaDone(userId))) {
    tasks.push({ id: 'kana', kind: 'kana', href: '/kana/quiz', priority: 100, reason: 'kana' });
  }
  return tasks.sort((a, b) => b.priority - a.priority);
}
