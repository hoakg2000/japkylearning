'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getSession, requireUser } from '@/lib/auth/session';
import { getWord } from '@/lib/content/n5';
import { getDb } from '@/lib/db';
import { srsCards } from '@/lib/db/schema';
import { addCards } from '@/lib/learning';
import { ensureSettings } from '@/lib/progress';

const Ids = z.array(z.string().max(80)).max(300);

/** F11: song keywords to SRS (one word or all of a song). Unknown ids are ignored; duplicates add nothing. */
export async function addWordsToReview(raw: z.input<typeof Ids>, timeZone?: string) {
  const ids = [...new Set(Ids.parse(raw))].filter((id) => getWord(id));
  const user = await requireUser();
  await ensureSettings(user.id, z.string().max(64).optional().parse(timeZone));
  return addCards(user.id, ids.map((id) => ({ itemType: 'word' as const, itemId: id })));
}

/** Which of these words the visitor already has in SRS (to dim them); empty without a session. */
export async function learnedWordIds(raw: z.input<typeof Ids>): Promise<string[]> {
  const ids = Ids.parse(raw);
  const session = await getSession();
  if (!session || !ids.length) return [];
  const db = await getDb();
  const rows = await db
    .selectDistinct({ id: srsCards.itemId })
    .from(srsCards)
    .where(and(eq(srsCards.userId, session.user.id), eq(srsCards.itemType, 'word'), inArray(srsCards.itemId, ids)));
  return rows.map((r) => r.id);
}
