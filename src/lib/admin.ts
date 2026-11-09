import 'server-only';
import { notFound } from 'next/navigation';
import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { auditLog } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';

/**
 * Admin gate (docs/05 §Admin): role `admin` (granted by hand in the DB) AND two-factor enabled.
 * Anyone else gets a 404, so the admin area is not even discoverable.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || !isAdmin(session.user)) notFound();
  return session.user;
}

export const isAdmin = (user: unknown) => {
  const u = user as { role?: string; twoFactorEnabled?: boolean | null } | undefined;
  return u?.role === 'admin' && !!u.twoFactorEnabled;
};

/** Writes one audit row. Called in the same request as every admin change. */
export async function audit(actorId: string, action: string, target: string | null, before: unknown, after: unknown) {
  const db = await getDb();
  await db.insert(auditLog).values({ actorId, action, target, before, after });
}

export async function recentAudit(limit = 50) {
  const db = await getDb();
  return db.select().from(auditLog).orderBy(desc(auditLog.at)).limit(limit);
}

/** Whether an env key exists for a preset. Returns a boolean only, never the value. */
export function keyConfigured(envName: string, env: NodeJS.ProcessEnv = process.env): boolean {
  return !!env[envName];
}
