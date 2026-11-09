import 'server-only';
import { drizzle as drizzlePg, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type Db = PostgresJsDatabase<typeof schema>;

declare global {
  var __japkyDb: Promise<Db> | undefined;
}

async function create(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    // Production / Neon: migrations run in the deploy pipeline (`npm run db:migrate`).
    return drizzlePg(postgres(url, { prepare: false }), { schema });
  }
  // Local dev and tests without Postgres: embedded PGlite, migrated on first use.
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const dir = process.env.PGLITE_DIR ?? '.data/pglite';
  (await import('node:fs')).mkdirSync(dir, { recursive: true });
  const db = drizzle(dir, { schema });
  await migrate(db, { migrationsFolder: 'drizzle' });
  // shortcut: PGlite typed as the postgres-js driver (same pg dialect); fine for the queries we use.
  return db as unknown as Db;
}

/** Lazily opened database (never at import time, so builds do not touch it). */
export function getDb(): Promise<Db> {
  return (globalThis.__japkyDb ??= create());
}

export { schema };
