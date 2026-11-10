'use server';

import { z } from 'zod';
import { requireUser } from '@/lib/auth/session';
import { getPack } from '@/lib/content/n5';
import { addCards } from '@/lib/learning';
import { ensureSettings } from '@/lib/progress';

const Input = z.object({ packId: z.string().max(40), timeZone: z.string().max(64).optional() });

/** F3: adds every word of a pack to SRS in one go. Existing cards are kept (unique index), so a second click adds 0. */
export async function addPackToReview(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  const pack = getPack(input.packId);
  if (!pack) throw new Error('unknown pack');
  const user = await requireUser();
  await ensureSettings(user.id, input.timeZone);
  const added = await addCards(user.id, pack.wordIds.map((id) => ({ itemType: 'word' as const, itemId: id })));
  return { added, total: pack.wordIds.length };
}
