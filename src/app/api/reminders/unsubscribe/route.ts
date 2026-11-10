import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';
import { verifyUnsubscribe } from '@/lib/email/reminders';
import { recordConsent } from '@/lib/progress';

const text = (body: string, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

/** The signed user id from the link, or null when the link is not valid. */
function signedUser(req: Request): string | null {
  const params = new URL(req.url).searchParams;
  const userId = params.get('u') ?? '';
  const token = params.get('t') ?? '';
  const secret = process.env.BETTER_AUTH_SECRET;
  return secret && userId && userId.length <= 64 && verifyUnsubscribe(userId, token, secret) ? userId : null;
}

const INVALID = 'Invalid link / Liên kết không hợp lệ';

/**
 * GET only shows a confirm button: mail link scanners open links, so GET must not change state.
 * The form posts back to the same URL (query string kept).
 */
export function GET(req: Request) {
  if (!signedUser(req)) return text(INVALID, 400);
  return new Response(
    '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Japky</title>' +
      '<form method="post"><p>Tắt nhắc học qua email? / Turn off email reminders?</p><button type="submit">Tắt / Turn off</button></form></html>',
    { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );
}

/** RFC 8058 one-click (mail clients POST to the List-Unsubscribe URL) and the confirm form. Withdraws consent and clears the hour. */
export async function POST(req: Request) {
  const userId = signedUser(req);
  if (!userId) return text(INVALID, 400);
  const db = await getDb();
  const [row] = await db.update(userSettings).set({ reminderHour: null, updatedAt: new Date() }).where(eq(userSettings.userId, userId)).returning({ userId: userSettings.userId });
  if (row) await recordConsent(userId, 'email_reminders', false);
  return text('Đã tắt nhắc học qua email. / Email reminders are off.');
}
