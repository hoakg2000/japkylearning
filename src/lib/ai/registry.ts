import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { appSettings } from '@/lib/db/schema';
import { AiUnavailableError, type AiMode, type AiProvider } from './types';
import { buildProvider, resolveChoice, type AiSettings } from './registry-pure';

export type { AiSettings, ModeChoice } from './registry-pure';
export { buildProvider, resolveChoice, envDefault } from './registry-pure';

const DEFAULT: AiSettings = { modes: {}, killSwitch: false };

/** Settings from the DB (key `ai`), or defaults. */
export async function getAiSettings(): Promise<AiSettings> {
  const db = await getDb();
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, 'ai'));
  return row ? ({ ...DEFAULT, ...(row.value as Partial<AiSettings>) } as AiSettings) : DEFAULT;
}

/** Provider for a mode, or AiUnavailableError when the kill-switch is on. */
export async function providerFor(mode: AiMode): Promise<AiProvider> {
  const settings = await getAiSettings();
  if (settings.killSwitch) throw new AiUnavailableError('KILL_SWITCH');
  return buildProvider(resolveChoice(settings, mode));
}
