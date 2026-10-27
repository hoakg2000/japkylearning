// F2: `npm run purge:anonymous` counts stale guests (dry run); `-- --apply` deletes them. Logs counts only.
// Uses DATABASE_URL when set, else the local PGlite folder (PGLITE_DIR). Cron wiring waits for the deploy (B3).
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import { purgeAnonymous } from '../src/lib/purge';

async function main() {
  const apply = process.argv.includes('--apply');
  const url = process.env.DATABASE_URL;
  const db = (url ? drizzlePg(postgres(url, { prepare: false, max: 1 })) : (await import('drizzle-orm/pglite')).drizzle(process.env.PGLITE_DIR ?? '.data/pglite')) as unknown as PgDatabase<PgQueryResultHKT>;
  const { count } = await purgeAnonymous(db, { apply });
  console.log(apply ? `Deleted ${count} anonymous users.` : `${count} anonymous users would be deleted. Run with --apply to delete.`);
}

main().then(() => process.exit(0));
