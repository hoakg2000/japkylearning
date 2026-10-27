// F2: anonymous guests inactive for 30+ days are deleted (ADR 0009); their data goes with them (FK cascade).
// No 'server-only' import: the CLI script (scripts/purge-anonymous.ts) runs this outside Next.
import { and, eq, sql } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { user } from './db/auth-schema';

export const PURGE_AFTER_DAYS = 30;

/** Counts (dry run) or deletes stale guests. Never touches accounts with a password or admins. */
export async function purgeAnonymous(db: PgDatabase<PgQueryResultHKT>, { apply = false, now = new Date(), days = PURGE_AFTER_DAYS } = {}) {
  const cutoff = new Date(now.getTime() - days * 86_400_000).toISOString();
  // Last activity = latest of the user row, any session and any XP event (greatest() skips nulls).
  const lastActive = sql`greatest(${user.updatedAt}::timestamptz,
    (select max(updated_at)::timestamptz from session where session.user_id = ${user.id}),
    (select max(created_at) from xp_events where xp_events.user_id = ${user.id}))`;
  const stale = and(
    eq(user.isAnonymous, true),
    sql`coalesce(${user.role}, 'user') <> 'admin'`,
    sql`not exists (select 1 from account where account.user_id = ${user.id} and account.password is not null)`,
    sql`${lastActive} < ${cutoff}::timestamptz`,
  );
  const rows = apply ? await db.delete(user).where(stale).returning({ id: user.id }) : await db.select({ id: user.id }).from(user).where(stale);
  return { count: rows.length, applied: apply };
}
