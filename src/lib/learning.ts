import 'server-only';
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { lessonProgress, reviewLogs, srsCards, testAnswers, testAttempts } from '@/lib/db/schema';
import { getLesson } from '@/lib/content/n5';
import { newCard, review, unlockedDirection, type CardRow } from '@/lib/srs';
import type { Grade } from 'ts-fsrs';

export type ItemType = 'word' | 'grammar' | 'listening' | 'kana' | 'kanji';
export type Answer = { questionId: string; answer: string; correct: boolean; skillTags: string[] };

export const LESSON_PASS = 0.6;

/** Cards a finished lesson adds (F5): word recognition, grammar cloze, listening for each word. */
export function lessonCardItems(lessonId: string): { itemType: ItemType; itemId: string }[] {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  return [
    ...lesson.wordIds.map((id) => ({ itemType: 'word' as const, itemId: id })),
    ...lesson.grammarIds.map((id) => ({ itemType: 'grammar' as const, itemId: id })),
    ...lesson.wordIds.map((id) => ({ itemType: 'listening' as const, itemId: id })),
  ];
}

export async function addCards(userId: string, items: { itemType: ItemType; itemId: string }[]) {
  if (!items.length) return 0;
  const db = await getDb();
  const now = new Date();
  // 1 ms apart: keeps the lesson order when sorting by due date.
  const rows = items.map((it, i) => ({ userId, ...it, direction: 'recognition', ...newCard(new Date(now.getTime() + i)) }));
  const inserted = await db.insert(srsCards).values(rows).onConflictDoNothing().returning({ id: srsCards.id });
  return inserted.length;
}

export async function recordLessonTest(userId: string, lessonId: string, answers: Answer[]) {
  const db = await getDb();
  const correct = answers.filter((a) => a.correct).length;
  const score = answers.length ? correct / answers.length : 0;
  const [attempt] = await db
    .insert(testAttempts)
    .values({ userId, kind: 'lesson', scope: { lessonId }, score, total: answers.length, correct })
    .returning({ id: testAttempts.id });
  if (answers.length) {
    await db.insert(testAnswers).values(answers.map((a) => ({ attemptId: attempt.id, questionId: a.questionId, answer: a.answer, correct: a.correct, skillTags: a.skillTags })));
  }
  const passed = score >= LESSON_PASS;
  if (passed) {
    await db
      .insert(lessonProgress)
      .values({ userId, lessonId, status: 'done', score, completedAt: new Date() })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: { status: 'done', score: sql`greatest(coalesce(${lessonProgress.score}, 0), ${score})`, completedAt: new Date(), updatedAt: new Date() },
      });
  }
  const cardsAdded = passed ? await addCards(userId, lessonCardItems(lessonId)) : 0;
  return { score, correct, total: answers.length, passed, cardsAdded };
}

export async function lessonProgressMap(userId: string) {
  const db = await getDb();
  const rows = await db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
  return new Map(rows.map((r) => [r.lessonId, r]));
}

export async function dueCards(userId: string, limit = 20) {
  const db = await getDb();
  return db
    .select()
    .from(srsCards)
    .where(and(eq(srsCards.userId, userId), eq(srsCards.suspended, false), lte(srsCards.due, new Date())))
    .orderBy(asc(srsCards.due))
    .limit(limit);
}

export async function dueCount(userId: string) {
  const db = await getDb();
  const [r] = await db
    .select({ n: count() })
    .from(srsCards)
    .where(and(eq(srsCards.userId, userId), eq(srsCards.suspended, false), lte(srsCards.due, new Date())));
  return r?.n ?? 0;
}

export async function reviewCard(userId: string, cardId: number, rating: Grade, elapsedMs?: number) {
  const db = await getDb();
  const [card] = await db.select().from(srsCards).where(and(eq(srsCards.id, cardId), eq(srsCards.userId, userId)));
  if (!card) throw new Error('NOT_FOUND');
  const { row, state } = review(card as CardRow, rating);
  await db.update(srsCards).set(row).where(eq(srsCards.id, card.id));
  await db.insert(reviewLogs).values({ cardId: card.id, rating, state, elapsedMs: elapsedMs ? Math.min(elapsedMs, 600_000) : null });
  const direction = unlockedDirection(card.itemType, card.direction, row);
  if (direction) await db.insert(srsCards).values({ userId, itemType: card.itemType, itemId: card.itemId, direction, ...newCard() }).onConflictDoNothing();
  return row;
}

/** Skill with the highest error rate over the last 7 days (≥ 5 answers and ≥ 40% wrong), for F7. */
export async function weakestSkill(userId: string) {
  const db = await getDb();
  const since = new Date(Date.now() - 7 * 86_400_000);
  const rows = await db
    .select({ tags: testAnswers.skillTags, correct: testAnswers.correct })
    .from(testAnswers)
    .innerJoin(testAttempts, eq(testAnswers.attemptId, testAttempts.id))
    .where(and(eq(testAttempts.userId, userId), gte(testAttempts.finishedAt, since)));
  const stats = new Map<string, { n: number; wrong: number }>();
  for (const r of rows) for (const t of r.tags) {
    const s = stats.get(t) ?? { n: 0, wrong: 0 };
    s.n++;
    if (!r.correct) s.wrong++;
    stats.set(t, s);
  }
  const ranked = [...stats.entries()].filter(([, s]) => s.n >= 5 && s.wrong / s.n >= 0.4).sort((a, b) => b[1].wrong / b[1].n - a[1].wrong / a[1].n);
  return ranked[0]?.[0] ?? null;
}

export async function bestLessonScores(userId: string) {
  const db = await getDb();
  const rows = await db
    .select({ scope: testAttempts.scope, score: testAttempts.score })
    .from(testAttempts)
    .where(and(eq(testAttempts.userId, userId), eq(testAttempts.kind, 'lesson')))
    .orderBy(desc(testAttempts.score));
  const best = new Map<string, number>();
  for (const r of rows) {
    const id = (r.scope as { lessonId?: string } | null)?.lessonId;
    if (id && !best.has(id)) best.set(id, r.score);
  }
  return best;
}

/** Item ids of cards a user has, for "learned" marks. */
export async function cardItemIds(userId: string, itemType: ItemType, ids: string[]) {
  if (!ids.length) return new Set<string>();
  const db = await getDb();
  const rows = await db
    .select({ itemId: srsCards.itemId })
    .from(srsCards)
    .where(and(eq(srsCards.userId, userId), eq(srsCards.itemType, itemType), inArray(srsCards.itemId, ids)));
  return new Set(rows.map((r) => r.itemId));
}

/** Mock exam (F8): one attempt row with all answers; missed words and grammar become review cards. */
export async function recordMockExam(userId: string, answers: Answer[]) {
  const db = await getDb();
  const correct = answers.filter((a) => a.correct).length;
  const score = answers.length ? correct / answers.length : 0;
  const [attempt] = await db
    .insert(testAttempts)
    .values({ userId, kind: 'mock', scope: { level: 'n5' }, score, total: answers.length, correct })
    .returning({ id: testAttempts.id });
  await db.insert(testAnswers).values(answers.map((a) => ({ attemptId: attempt.id, questionId: a.questionId, answer: a.answer, correct: a.correct, skillTags: a.skillTags })));
  const missed = answers.filter((a) => !a.correct).map((a) => {
    const [type, itemId] = a.questionId.split(':', 2);
    return { itemType: type === 'cloze' ? ('grammar' as const) : ('word' as const), itemId };
  });
  const cardsAdded = await addCards(userId, missed);
  return { score, correct, total: answers.length, cardsAdded };
}
