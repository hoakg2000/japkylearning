import { getSession } from '@/lib/auth/session';
import { isOldEnough } from '@/lib/auth/age';
import { DAILY_LIMITS, recordCost, refund, reserve } from '@/lib/ai/guard';
import { getAiSettings, providerFor } from '@/lib/ai/registry';
import { buildMessages, ChatRequest } from '@/lib/ai/tutor';
import type { AiUsage } from '@/lib/ai/types';
import { getDb } from '@/lib/db';
import { aiUsage } from '@/lib/db/schema';
import { ensureSettings, getConsents } from '@/lib/progress';
import { studyDate } from '@/lib/streak';
import { and, eq } from 'drizzle-orm';

export const maxDuration = 60;

const sse = (event: string, data: unknown) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
const fail = (code: string, status: number) => Response.json({ error: code }, { status });

/**
 * Chat tutor beta (F8), Server-Sent Events. Every check runs before the stream opens; the request is
 * reserved against the daily quota and refunded if the answer does not finish (error or abort).
 */
export async function POST(req: Request) {
  const settings = await getAiSettings();
  if (!settings.chatEnabled) return fail('NOT_FOUND', 404);

  const session = await getSession();
  if (!session || session.user.isAnonymous) return fail('UNAUTHORIZED', 401);
  const user = session.user as typeof session.user & { birthYear?: number | null };
  if (!isOldEnough(user.birthYear)) return fail('AGE', 403);
  if ((await getConsents(user.id)).ai_processing !== true) return fail('CONSENT', 403);

  let body: ChatRequest;
  try {
    body = ChatRequest.parse(await req.json());
  } catch {
    return fail('BAD_REQUEST', 400);
  }

  const { timezone } = await ensureSettings(user.id);
  const today = studyDate(new Date(), timezone);
  try {
    await reserve(user.id, today, 'tutor');
  } catch {
    return fail('QUOTA', 429);
  }

  let provider;
  try {
    provider = await providerFor('tutor');
  } catch {
    await refund(user.id, today, 'tutor');
    return fail('AI_UNAVAILABLE', 503);
  }

  const db = await getDb();
  const [row] = await db
    .select({ n: aiUsage.requests })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, user.id), eq(aiUsage.localDate, today), eq(aiUsage.mode, 'tutor')));
  const remaining = Math.max(0, DAILY_LIMITS.tutor - (row?.n ?? 0));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => controller.enqueue(encoder.encode(sse(event, data)));
      let finished = false;
      try {
        send('meta', { demo: provider.id === 'mock', remaining });
        const it = provider.streamText({ mode: 'tutor', messages: buildMessages(body), maxOutputTokens: 500, signal: req.signal });
        let step = await it.next();
        while (!step.done) {
          send('delta', { t: step.value });
          step = await it.next();
        }
        if (req.signal.aborted) throw new Error('ABORTED');
        const usage: AiUsage = step.value;
        await recordCost(user.id, today, 'tutor', usage.tokensIn, usage.tokensOut, usage.costUsd);
        finished = true;
        send('done', {});
      } catch {
        if (!req.signal.aborted) send('error', { error: 'AI_UNAVAILABLE' });
      } finally {
        if (!finished) await refund(user.id, today, 'tutor');
        try {
          controller.close();
        } catch {
          // already closed by the client abort
        }
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' },
  });
}
