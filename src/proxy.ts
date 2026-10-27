import { getSessionCookie } from 'better-auth/cookies';
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { isAdmin } from './lib/admin';
import { getAuth } from './lib/auth';

const intl = createMiddleware(routing);
const ADMIN = /^\/(vi|en)\/admin(\/|$)/;

export default async function proxy(req: NextRequest) {
  // F11: a real 404 status for non-admins. This only denies; requireAdmin in the page stays the authority.
  if (ADMIN.test(req.nextUrl.pathname)) {
    const session = getSessionCookie(req) ? await (await getAuth()).api.getSession({ headers: req.headers }) : null;
    if (!session || !isAdmin(session.user)) return NextResponse.rewrite(new URL('/_admin-not-found', req.url));
  }
  return intl(req);
}

export const config = {
  // Skip API, embeds, Next internals and files with an extension.
  // In a JS string '\.' is any char, so the first entry in practice matches only '/'; admin paths are listed on their own.
  matcher: ['/((?!api|embed|_next|_vercel|.*\..*).*)', '/:locale(vi|en)/admin/:path*'],
};
