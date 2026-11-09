import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { lessons } from '@/lib/content/n5';
import { getDb } from '@/lib/db';
import { lessonProgress, testAttempts } from '@/lib/db/schema';
import { dueCount, lessonProgressMap, weakestSkill } from '@/lib/learning';

export type TodayTask = { id: string; kind: 'kana' | 'review' | 'lesson' | 'weak'; href: string; priority: number; reason: string; count?: number; label?: string };

/** Kana counts as done when skipped by the placement test or practised to 80%+ twice. */
export async function kanaDone(userId: string) {
  const db = await getDb();
  const [lp] = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, 'n5-00-kana')));
  if (lp && (lp.status === 'done' || lp.status === 'skipped')) return true;
  const recent = await db.select({ score: testAttempts.score }).from(testAttempts).where(and(eq(testAttempts.userId, userId), eq(testAttempts.kind, 'kana'))).orderBy(desc(testAttempts.finishedAt)).limit(5);
  return recent.filter((r) => r.score >= 0.8).length >= 2;
}

/**
 * Rule-based plan for the Today screen (F7 layer 1, testable without AI):
 * due reviews first, then the weakest skill of the week, kana until mastered, then the next lesson.
 */
export async function getTodayPlan(userId: string): Promise<TodayTask[]> {
  const [due, weak, kana, progress] = await Promise.all([dueCount(userId), weakestSkill(userId), kanaDone(userId), lessonProgressMap(userId)]);
  const tasks: TodayTask[] = [];
  if (due >= 1) tasks.push({ id: 'review', kind: 'review', href: '/review', priority: due >= 20 ? 100 : 80, reason: 'due', count: due });
  if (weak) tasks.push({ id: `weak:${weak}`, kind: 'weak', href: '/review', priority: 70, reason: 'weak', label: weak });
  if (!kana) tasks.push({ id: 'kana', kind: 'kana', href: '/kana/quiz', priority: 90, reason: 'kana' });
  const next = lessons.find((l) => !['done', 'skipped'].includes(progress.get(l.id)?.status ?? ''));
  if (next) tasks.push({ id: `lesson:${next.id}`, kind: 'lesson', href: `/learn/n5/${next.order}`, priority: kana ? 85 : 60, reason: 'next', label: String(next.order) });
  return tasks.sort((a, b) => b.priority - a.priority);
}
