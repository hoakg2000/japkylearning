import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { aiUsage, appSettings } from '@/lib/db/schema';
import { studyDate } from '@/lib/streak';
import { dailyBudgetUsd } from './limits';
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

/** Provider for a mode, or AiUnavailableError when the kill-switch is on. Over the daily budget (F13) only the free mock is used. */
export async function providerFor(mode: AiMode): Promise<AiProvider> {
  const settings = await getAiSettings();
  if (settings.killSwitch) throw new AiUnavailableError('KILL_SWITCH');
  const choice = resolveChoice(settings, mode);
  if (choice.adapter !== 'mock' && (await spentTodayUsd()) >= dailyBudgetUsd()) return buildProvider({ adapter: 'mock' });
  return buildProvider(choice);
}

/** Cost recorded server-side by the providers today (Vietnam study day, like the admin usage table). */
async function spentTodayUsd(): Promise<number> {
  const db = await getDb();
  const [row] = await db
    .select({ cost: sql<number>`coalesce(sum(${aiUsage.costUsd}), 0)` })
    .from(aiUsage)
    .where(eq(aiUsage.localDate, studyDate(new Date(), 'Asia/Ho_Chi_Minh')));
  return Number(row?.cost ?? 0);
}
