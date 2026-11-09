import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { aiUsage } from '@/lib/db/schema';
import { AiUnavailableError, type AiMode } from './types';
import { DAILY_LIMITS } from './limits';

export { DAILY_LIMITS, underLimit } from './limits';

/** Reserves one request for (user, day, mode). Throws QUOTA when the limit is reached. */
export async function reserve(userId: string, localDate: string, mode: AiMode): Promise<void> {
  const db = await getDb();
  const [row] = await db
    .insert(aiUsage)
    .values({ userId, localDate, mode, requests: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.userId, aiUsage.localDate, aiUsage.mode],
      // Increment only while under the limit, so concurrent requests cannot overshoot.
      set: { requests: sql`${aiUsage.requests} + 1` },
      setWhere: sql`${aiUsage.requests} < ${DAILY_LIMITS[mode]}`,
    })
    .returning({ requests: aiUsage.requests });
  if (!row) throw new AiUnavailableError('QUOTA');
}

/** Refund a reservation when the provider call failed (so a failed call does not use up the quota). */
export async function refund(userId: string, localDate: string, mode: AiMode): Promise<void> {
  const db = await getDb();
  await db
    .update(aiUsage)
    .set({ requests: sql`greatest(${aiUsage.requests} - 1, 0)` })
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.localDate, localDate), eq(aiUsage.mode, mode)));
}

export async function recordCost(userId: string, localDate: string, mode: AiMode, tokensIn: number, tokensOut: number, costUsd: number) {
  const db = await getDb();
  await db
    .update(aiUsage)
    .set({
      tokensIn: sql`${aiUsage.tokensIn} + ${tokensIn}`,
      tokensOut: sql`${aiUsage.tokensOut} + ${tokensOut}`,
      costUsd: sql`${aiUsage.costUsd} + ${costUsd}`,
    })
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.localDate, localDate), eq(aiUsage.mode, mode)));
}
