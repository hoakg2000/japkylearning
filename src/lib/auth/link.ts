import 'server-only';
import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';

/**
 * Moves learning data from an anonymous guest to the account they signed up / signed in with (ADR 0009).
 * Rows the target account already has win; the rest are reassigned. Leftovers die with the anonymous user (cascade).
 */
export async function moveUserData(fromId: string, toId: string) {
  const db = await getDb();
  await db.transaction(async (tx) => {
    // Tables keyed by user + natural key: skip rows that would collide.
    await tx.execute(sql`update study_days a set user_id = ${toId} where a.user_id = ${fromId}
      and not exists (select 1 from study_days b where b.user_id = ${toId} and b.local_date = a.local_date)`);
    await tx.execute(sql`update lesson_progress a set user_id = ${toId} where a.user_id = ${fromId}
      and not exists (select 1 from lesson_progress b where b.user_id = ${toId} and b.lesson_id = a.lesson_id)`);
    await tx.execute(sql`update srs_cards a set user_id = ${toId} where a.user_id = ${fromId}
      and not exists (select 1 from srs_cards b where b.user_id = ${toId} and b.item_type = a.item_type
        and b.item_id = a.item_id and b.direction = a.direction)`);
    for (const table of ['user_settings', 'streak_freezes']) {
      await tx.execute(sql`update ${sql.identifier(table)} a set user_id = ${toId} where a.user_id = ${fromId}
        and not exists (select 1 from ${sql.identifier(table)} b where b.user_id = ${toId})`);
    }
    // Append-only history moves as is.
    for (const table of ['xp_events', 'test_attempts', 'consents']) {
      await tx.execute(sql`update ${sql.identifier(table)} set user_id = ${toId} where user_id = ${fromId}`);
    }
  });
}
