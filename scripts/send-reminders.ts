// F2 reminders: `npm run send:reminders` lists how many learners are due now (dry run); `-- --apply` sends them
// through EMAIL_TRANSPORT (default console, real provider waits for B4) and marks them reminded for the day.
// Meant to run hourly (cron wiring waits for the deploy, B3). Logs counts and masked addresses only.
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import { dueReminders, markReminded, reminderEmail, unsubscribeToken } from '../src/lib/email/reminders';
import { transportFromEnv } from '../src/lib/email/transport';
import { studyDate } from '../src/lib/streak';

/** Local PGlite, migrated like the app does on first use (Neon is migrated by the deploy). */
async function localDb() {
  const db = (await import('drizzle-orm/pglite')).drizzle(process.env.PGLITE_DIR ?? '.data/pglite');
  await (await import('drizzle-orm/pglite/migrator')).migrate(db, { migrationsFolder: 'drizzle' });
  return db;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const url = process.env.DATABASE_URL;
  const db = (url ? drizzlePg(postgres(url, { prepare: false, max: 1 })) : await localDb()) as unknown as PgDatabase<PgQueryResultHKT>;
  const now = new Date();
  const due = await dueReminders(db, now);
  if (!apply) return console.log(`${due.length} reminders due now. Run with --apply to send.`);

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error('BETTER_AUTH_SECRET is required to sign unsubscribe links');
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const transport = transportFromEnv();
  let sent = 0;
  for (const r of due) {
    const unsubscribe = `${appUrl}/api/reminders/unsubscribe?u=${encodeURIComponent(r.id)}&t=${unsubscribeToken(r.id, secret)}`;
    try {
      await transport.send(reminderEmail(r.email, unsubscribe, appUrl));
      await markReminded(db, r.id, studyDate(now, r.timezone));
      sent++;
    } catch (e) {
      console.error(`send failed: ${e instanceof Error ? e.message : 'error'}`);
    }
  }
  console.log(`Sent ${sent}/${due.length} reminders via ${transport.id}.`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  },
);
