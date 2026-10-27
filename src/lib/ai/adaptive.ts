import 'server-only';
import { createHash } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { aiGeneratedItems } from '@/lib/db/schema';
import { recordCost, refund, reserve } from './guard';
import { providerFor } from './registry';
import type { AiMode } from './types';

const Comment = z.object({ comment: z.string().min(1).max(240) });

/**
 * One sentence next to the rule-based plan (F7 layer 2). Once per learner per day: the answer is stored
 * under a hash of (user, date), so reloading the page does not spend another request.
 * The plan never depends on this: any failure returns null and the page shows nothing extra.
 */
export async function adaptiveComment(
  userId: string,
  today: string,
  facts: { due: number; weakSkill: string | null; streak: number; nextLesson: number | null },
  locale: 'vi' | 'en',
): Promise<string | null> {
  const mode: AiMode = 'adaptive';
  const hash = createHash('sha256').update(`${userId}|${today}|${locale}`).digest('hex');
  const db = await getDb();
  const [cached] = await db
    .select({ payload: aiGeneratedItems.payload })
    .from(aiGeneratedItems)
    .where(and(eq(aiGeneratedItems.kind, 'adaptive'), eq(aiGeneratedItems.inputHash, hash)));
  if (cached) return (cached.payload as { comment: string }).comment;

  try {
    await reserve(userId, today, mode);
  } catch {
    return null; // over the daily limit
  }
  try {
    const provider = await providerFor(mode);
    // Aggregate facts only: no names, ids or free text from the learner reach the model.
    const r = await provider.generateObject({
      mode,
      schema: Comment,
      name: 'adaptive_comment',
      maxOutputTokens: 120,
      messages: [
        {
          role: 'system',
          content: `Write one short, warm sentence in ${locale === 'vi' ? 'Vietnamese' : 'English'} advising what to study today. Return JSON {"comment": "..."}.`,
        },
        { role: 'user', content: JSON.stringify(facts) },
      ],
    });
    await recordCost(userId, today, mode, r.tokensIn, r.tokensOut, r.costUsd);
    await db.insert(aiGeneratedItems).values({ kind: 'adaptive', inputHash: hash, payload: r.value, provider: r.provider, model: r.model, status: 'approved', createdBy: userId });
    return r.value.comment;
  } catch {
    await refund(userId, today, mode);
    return null;
  }
}

// Required by guard's recordCost signature.
export type { AiMode };
