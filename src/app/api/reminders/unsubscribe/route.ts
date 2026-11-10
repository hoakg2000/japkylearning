import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';
import { verifyUnsubscribe } from '@/lib/email/reminders';
import { recordConsent } from '@/lib/progress';

/** One-click unsubscribe from reminder emails (signed link, no sign-in). Withdraws consent and clears the hour. */
async function unsubscribe(req: Request) {
  const params = new URL(req.url).searchParams;
  const userId = params.get('u') ?? '';
  const token = params.get('t') ?? '';
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || !userId || userId.length > 64 || !verifyUnsubscribe(userId, token, secret)) {
    return new Response('Invalid link / Liên kết không hợp lệ', { status: 400, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  const db = await getDb();
  const [row] = await db.update(userSettings).set({ reminderHour: null, updatedAt: new Date() }).where(eq(userSettings.userId, userId)).returning({ userId: userSettings.userId });
  if (row) await recordConsent(userId, 'email_reminders', false);
  return new Response('Đã tắt nhắc học qua email. / Email reminders are off.', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

export const GET = unsubscribe;
// RFC 8058 one-click: mail clients POST to the List-Unsubscribe URL.
export const POST = unsubscribe;
