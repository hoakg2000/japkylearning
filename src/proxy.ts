import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip API, embeds, Next internals and files with an extension.
  matcher: ['/((?!api|embed|_next|_vercel|.*\..*).*)'],
};
