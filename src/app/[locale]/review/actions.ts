'use server';

import { z } from 'zod';
import { requireUser } from '@/lib/auth/session';
import { reviewCard } from '@/lib/learning';
import { addXp } from '@/lib/progress';

const Input = z.object({
  cardId: z.number().int().positive(),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  elapsedMs: z.number().int().min(0).optional(),
});

export async function rateCard(raw: z.input<typeof Input>) {
  const input = Input.parse(raw);
  const user = await requireUser();
  const row = await reviewCard(user.id, input.cardId, input.rating, input.elapsedMs);
  const streak = await addXp(user.id, 'review', 1, String(input.cardId));
  return { due: row.due.toISOString(), streak };
}
