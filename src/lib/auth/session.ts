import 'server-only';
import { headers } from 'next/headers';
import { getAuth } from './index';

/** Current session or null. Request-time API: call inside a Suspense boundary. */
export async function getSession() {
  // headers() first: during prerender it suspends here, before the database is touched.
  const h = await headers();
  const auth = await getAuth();
  return auth.api.getSession({ headers: h });
}

/** User for a write: creates an anonymous guest on the first write (ADR 0009). */
export async function requireUser() {
  const h = await headers();
  const auth = await getAuth();
  const existing = await auth.api.getSession({ headers: h });
  if (existing) return existing.user;
  const created = await auth.api.signInAnonymous({ headers: h });
  if (!created) throw new Error('Could not create guest session');
  return created.user;
}
