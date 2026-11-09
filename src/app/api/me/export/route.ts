import { eq, inArray } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { consents, lessonProgress, reviewLogs, srsCards, studyDays, testAttempts, testAnswers, userSettings, xpEvents } from '@/lib/db/schema';

/** Personal data export (PDPL data subject right, ADR 0011). */
export async function GET(req: Request) {
  const session = await (await getAuth()).api.getSession({ headers: req.headers });
  if (!session) return new Response('Unauthorized', { status: 401 });
  const id = session.user.id;
  const db = await getDb();
  const cards = await db.select().from(srsCards).where(eq(srsCards.userId, id));
  const attempts = await db.select().from(testAttempts).where(eq(testAttempts.userId, id));
  const data = {
    exportedAt: new Date().toISOString(),
    user: { id, email: session.user.email, name: session.user.name, isAnonymous: session.user.isAnonymous, createdAt: session.user.createdAt },
    settings: await db.select().from(userSettings).where(eq(userSettings.userId, id)),
    consents: await db.select().from(consents).where(eq(consents.userId, id)),
    studyDays: await db.select().from(studyDays).where(eq(studyDays.userId, id)),
    xpEvents: await db.select().from(xpEvents).where(eq(xpEvents.userId, id)),
    lessonProgress: await db.select().from(lessonProgress).where(eq(lessonProgress.userId, id)),
    srsCards: cards,
    reviewLogs: cards.length ? await db.select().from(reviewLogs).where(inArray(reviewLogs.cardId, cards.map((c) => c.id))) : [],
    testAttempts: attempts,
    testAnswers: attempts.length ? await db.select().from(testAnswers).where(inArray(testAnswers.attemptId, attempts.map((a) => a.id))) : [],
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'content-type': 'application/json', 'content-disposition': 'attachment; filename="japky-data.json"', 'cache-control': 'no-store' },
  });
}
