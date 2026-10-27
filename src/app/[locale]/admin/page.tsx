import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { sql } from 'drizzle-orm';
import { Suspense } from 'react';
import { AdminControls } from '@/components/admin-controls';
import { requireAdmin, recentAudit, keyConfigured } from '@/lib/admin';
import { getAiSettings } from '@/lib/ai/registry';
import { PRESETS } from '@/lib/ai/adapters/openai-compatible';
import { AI_MODES } from '@/lib/ai/types';
import { getDb } from '@/lib/db';
import { aiUsage, ttsVoices } from '@/lib/db/schema';
import { studyDate } from '@/lib/streak';

export const metadata: Metadata = { robots: { index: false } };

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">…</p>}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  await requireAdmin(); // 404 for everyone else
  const t = await getTranslations('Admin');
  const settings = await getAiSettings();
  const db = await getDb();
  const today = studyDate(new Date(), 'Asia/Ho_Chi_Minh');
  const usage = await db
    .select({ mode: aiUsage.mode, requests: sql<number>`sum(${aiUsage.requests})`, cost: sql<number>`sum(${aiUsage.costUsd})` })
    .from(aiUsage)
    .where(sql`${aiUsage.localDate} = ${today}`)
    .groupBy(aiUsage.mode);
  const voices = await db.select().from(ttsVoices);
  const audit = await recentAudit(30);

  // Only booleans: whether each preset has its key configured. Values are never read out.
  const keys = Object.fromEntries(Object.entries(PRESETS).map(([name, p]) => [name, keyConfigured(p.keyEnv)]));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <AdminControls
        modes={AI_MODES.map((m) => ({ mode: m, choice: settings.modes[m] ?? { adapter: 'mock' as const } }))}
        presets={Object.keys(PRESETS) as (keyof typeof PRESETS)[]}
        keys={keys}
        killSwitch={settings.killSwitch}
        voices={voices.map((v) => ({ id: v.id, label: v.label, enabled: v.enabled }))}
      />
      <section aria-labelledby="usage">
        <h2 id="usage" className="mb-2 text-lg font-medium">{t('usageToday')}</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th>{t('mode')}</th><th>{t('requests')}</th><th>USD</th></tr>
          </thead>
          <tbody>
            {usage.length === 0 && <tr><td colSpan={3} className="py-2 text-muted">{t('none')}</td></tr>}
            {usage.map((u) => (
              <tr key={u.mode} className="border-t border-line">
                <td>{u.mode}</td>
                <td>{Number(u.requests)}</td>
                <td>{Number(u.cost).toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section aria-labelledby="audit">
        <h2 id="audit" className="mb-2 text-lg font-medium">{t('audit')}</h2>
        <ul className="space-y-1 text-xs">
          {audit.map((a) => (
            <li key={a.id} className="font-mono">
              {a.at.toISOString().slice(0, 16)} · {a.action} · {a.target ?? '-'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
