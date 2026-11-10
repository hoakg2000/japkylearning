import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { describe, expect, it } from 'vitest';
import { user, xpEvents } from './schema';

describe('xp_events', () => {
  it('speaking XP is unique per user and ref; other sources may repeat a ref', async () => {
    const db = drizzle();
    await migrate(db, { migrationsFolder: 'drizzle' });
    await db.insert(user).values({ id: 'u', name: 'u', email: 'u@x.test' });
    const add = (source: string) => db.insert(xpEvents).values({ userId: 'u', source, amount: 2, refId: 'w1:2026-11-10' }).onConflictDoNothing().returning({ id: xpEvents.id });
    expect(await add('speaking')).toHaveLength(1);
    expect(await add('speaking')).toHaveLength(0);
    expect(await add('kana')).toHaveLength(1);
    expect(await add('kana')).toHaveLength(1);
  }, 30_000);
});
