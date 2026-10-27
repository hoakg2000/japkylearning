import 'server-only';
import { createHash } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { getWord, words as allWords } from '@/lib/content/n5';
import type { Word } from '@/lib/content/schemas';
import { getDb } from '@/lib/db';
import { aiGeneratedItems, aiUsage, srsCards } from '@/lib/db/schema';
import { shuffle } from '@/lib/quiz';
import { studyDate } from '@/lib/streak';
import { DAILY_LIMITS, recordCost, refund, reserve } from './guard';
import { providerFor } from './registry';
import { generateQuiz, staticQuestions, type AiQuestion } from './quiz-gen';
import { AiInvalidOutputError, AiUnavailableError } from './types';

export type QuizResult = { questions: AiQuestion[]; source: 'ai' | 'static'; reason?: string; remaining: number };

/** Words the learner has an SRS card for. A quiz may only use these (F6). */
export async function learnedWords(userId: string): Promise<Word[]> {
  const db = await getDb();
  const rows = await db
    .selectDistinct({ itemId: srsCards.itemId })
    .from(srsCards)
    .where(and(eq(srsCards.userId, userId), eq(srsCards.itemType, 'word')));
  return rows.map((r) => getWord(r.itemId)).filter((w): w is Word => !!w);
}

async function usedToday(userId: string, today: string): Promise<number> {
  const db = await getDb();
  const [row] = await db
    .select({ n: aiUsage.requests })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.localDate, today), eq(aiUsage.mode, 'quiz-gen')));
  return row?.n ?? 0;
}

/**
 * AI test for the learner (F6). Uses only learned words, respects the daily quota and always returns
 * questions: AI when possible, static questions otherwise.
 */
export async function buildAiQuiz(userId: string, timeZone: string, locale: 'vi' | 'en', count = 5): Promise<QuizResult> {
  const today = studyDate(new Date(), timeZone);
  const learned = await learnedWords(userId);
  if (learned.length < 4) return { questions: [], source: 'static', reason: 'NOT_ENOUGH_WORDS', remaining: 0 };

  const sample = shuffle(learned).slice(0, count);
  const pool = allWords; // distractors may come from any N5 word

  try {
    await reserve(userId, today, 'quiz-gen');
  } catch {
    const used = await usedToday(userId, today);
    return { questions: staticQuestions(sample, pool, locale, Math.random), source: 'static', reason: 'QUOTA', remaining: Math.max(0, DAILY_LIMITS['quiz-gen'] - used) };
  }

  try {
    const provider = await providerFor('quiz-gen');
    const r = await generateQuiz(provider, sample, locale);
    await recordCost(userId, today, 'quiz-gen', r.tokensIn, r.tokensOut, r.costUsd);
    await saveGenerated(r.questions, r.provider, r.model, userId, sample);
    return { questions: r.questions, source: 'ai', remaining: Math.max(0, DAILY_LIMITS['quiz-gen'] - (await usedToday(userId, today))) };
  } catch (e) {
    await refund(userId, today, 'quiz-gen');
    const reason = e instanceof AiUnavailableError ? e.message : e instanceof AiInvalidOutputError ? 'INVALID' : 'ERROR';
    return { questions: staticQuestions(sample, pool, locale, Math.random), source: 'static', reason, remaining: DAILY_LIMITS['quiz-gen'] - (await usedToday(userId, today)) };
  }
}

/** Keeps generated questions for admin review. Status stays `pending`: only approved items may be reused. */
async function saveGenerated(questions: AiQuestion[], provider: string, model: string, userId: string, sample: Word[]) {
  const db = await getDb();
  const hash = createHash('sha256').update(sample.map((w) => w.id).sort().join('|')).digest('hex');
  await db.insert(aiGeneratedItems).values({ kind: 'quiz', inputHash: hash, payload: questions, provider, model, createdBy: userId });
}
