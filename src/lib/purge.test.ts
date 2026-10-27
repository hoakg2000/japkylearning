import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { describe, expect, it } from 'vitest';
import { user, xpEvents } from './db/schema';
import { purgeAnonymous } from './purge';

const NOW = new Date('2026-10-27T00:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000);

describe('purgeAnonymous', () => {
  it('deletes only anonymous non-admin users inactive past the cutoff, and only with apply', async () => {
    const db = drizzle();
    await migrate(db, { migrationsFolder: 'drizzle' });
    const row = (id: string, isAnonymous: boolean, updatedAt: Date, role = 'user') => ({ id, name: id, email: `${id}@x.test`, isAnonymous, updatedAt, role });
    await db.insert(user).values([
      row('stale-guest', true, daysAgo(40)),
      row('recent-guest', true, daysAgo(5)),
      row('old-guest-recent-xp', true, daysAgo(40)),
      row('old-account', false, daysAgo(400)),
      row('old-admin', true, daysAgo(400), 'admin'),
    ]);
    await db.insert(xpEvents).values({ userId: 'old-guest-recent-xp', source: 'kana', amount: 5, at: daysAgo(2) });

    expect(await purgeAnonymous(db, { now: NOW })).toEqual({ count: 1, applied: false });
    expect((await db.select().from(user)).length).toBe(5);

    expect(await purgeAnonymous(db, { now: NOW, apply: true })).toEqual({ count: 1, applied: true });
    expect((await db.select({ id: user.id }).from(user)).map((u) => u.id).sort()).toEqual(['old-account', 'old-admin', 'old-guest-recent-xp', 'recent-guest']);
  }, 30_000);
});
