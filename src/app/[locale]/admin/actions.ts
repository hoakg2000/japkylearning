'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/admin';
import { getAiSettings, type ModeChoice } from '@/lib/ai/registry';
import { PRESETS } from '@/lib/ai/adapters/openai-compatible';
import { AI_MODES } from '@/lib/ai/types';
import { getDb } from '@/lib/db';
import { appSettings, ttsVoices } from '@/lib/db/schema';

const Choice = z.object({
  adapter: z.enum(['mock', 'openai-compatible', 'gateway']),
  preset: z.enum(Object.keys(PRESETS) as [keyof typeof PRESETS, ...(keyof typeof PRESETS)[]]).optional(),
  model: z.string().max(80).optional(),
});

const SaveAi = z.object({
  modes: z.record(z.enum(AI_MODES), Choice),
});

/**
 * Saves per-mode adapter choices. Stores adapter names and model names only (never URLs or keys).
 * A preset without its key in env is refused, so an admin cannot point a mode at an unconfigured service.
 */
export async function saveAiSettings(raw: z.input<typeof SaveAi>) {
  const admin = await requireAdmin();
  const input = SaveAi.parse(raw);
  for (const [mode, c] of Object.entries(input.modes)) {
    if (c.adapter === 'openai-compatible' && (!c.preset || !process.env[PRESETS[c.preset].keyEnv])) {
      throw new Error(`KEY_NOT_CONFIGURED:${mode}`);
    }
  }
  const before = await getAiSettings();
  const next = { ...before, modes: input.modes as Record<string, ModeChoice> };
  const db = await getDb();
  await db
    .insert(appSettings)
    .values({ key: 'ai', value: next, updatedBy: admin.id })
    .onConflictDoUpdate({ target: appSettings.key, set: { value: next, updatedBy: admin.id, updatedAt: new Date() } });
  await audit(admin.id, 'ai.settings.save', 'ai', before, next);
  revalidatePath('/[locale]/admin', 'page');
}

export async function setKillSwitch(on: boolean) {
  const admin = await requireAdmin();
  const z2 = z.boolean().parse(on);
  const before = await getAiSettings();
  const next = { ...before, killSwitch: z2 };
  const db = await getDb();
  await db
    .insert(appSettings)
    .values({ key: 'ai', value: next, updatedBy: admin.id })
    .onConflictDoUpdate({ target: appSettings.key, set: { value: next, updatedBy: admin.id, updatedAt: new Date() } });
  await audit(admin.id, 'ai.killswitch', 'ai', { killSwitch: before.killSwitch }, { killSwitch: z2 });
  revalidatePath('/[locale]/admin', 'page');
}

export async function setVoiceEnabled(id: string, enabled: boolean) {
  const admin = await requireAdmin();
  const voiceId = z.string().min(1).max(40).parse(id);
  const db = await getDb();
  const [before] = await db.select().from(ttsVoices).where(eq(ttsVoices.id, voiceId));
  if (!before) throw new Error('NOT_FOUND');
  await db.update(ttsVoices).set({ enabled: z.boolean().parse(enabled) }).where(eq(ttsVoices.id, voiceId));
  await audit(admin.id, 'tts.voice.toggle', voiceId, { enabled: before.enabled }, { enabled }); // reference id is not logged
  revalidatePath('/[locale]/admin', 'page');
}
