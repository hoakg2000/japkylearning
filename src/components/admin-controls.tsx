'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { saveAiSettings, setKillSwitch, setVoiceEnabled } from '@/app/[locale]/admin/actions';
import type { AiMode } from '@/lib/ai/types';

type Choice = { adapter: 'mock' | 'openai-compatible' | 'gateway'; preset?: string; model?: string };
type Preset = string;

export function AdminControls(props: {
  modes: { mode: AiMode; choice: Choice }[];
  presets: Preset[];
  keys: Record<string, boolean>;
  killSwitch: boolean;
  voices: { id: string; label: string; enabled: boolean }[];
}) {
  const t = useTranslations('Admin');
  const [rows, setRows] = useState(props.modes);
  const [kill, setKill] = useState(props.killSwitch);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<unknown>, ok: string) =>
    start(async () => {
      try {
        await fn();
        setMsg(ok);
      } catch (e) {
        setMsg(e instanceof Error ? e.message : 'ERROR');
      }
    });

  const update = (mode: AiMode, patch: Partial<Choice>) => setRows((rs) => rs.map((r) => (r.mode === mode ? { ...r, choice: { ...r.choice, ...patch } } : r)));
  const field = 'min-h-10 rounded-card border border-line bg-surface px-2';

  return (
    <div className="space-y-8">
      <section aria-labelledby="ai" className="space-y-3">
        <h2 id="ai" className="text-lg font-medium">{t('ai')}</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={kill} onChange={(e) => { setKill(e.target.checked); run(() => setKillSwitch(e.target.checked), t('saved')); }} />
          {t('killSwitch')}
        </label>
        <table className="w-full text-sm">
          <thead className="text-left text-muted"><tr><th>{t('mode')}</th><th>{t('adapter')}</th><th>{t('preset')}</th><th>{t('model')}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.mode} className="border-t border-line">
                <td className="py-1">{r.mode}</td>
                <td>
                  <select value={r.choice.adapter} onChange={(e) => update(r.mode, { adapter: e.target.value as Choice['adapter'] })} className={field}>
                    <option value="mock">mock</option>
                    <option value="openai-compatible">openai-compatible</option>
                    <option value="gateway">gateway</option>
                  </select>
                </td>
                <td>
                  <select value={r.choice.preset ?? ''} onChange={(e) => update(r.mode, { preset: e.target.value || undefined })} className={field} disabled={r.choice.adapter !== 'openai-compatible'}>
                    <option value="">—</option>
                    {props.presets.map((p) => (
                      <option key={p} value={p} disabled={!props.keys[p]}>
                        {p}{props.keys[p] ? '' : ` (${t('noKey')})`}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input value={r.choice.model ?? ''} onChange={(e) => update(r.mode, { model: e.target.value.slice(0, 80) })} className={field} placeholder="default" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => saveAiSettings({ modes: Object.fromEntries(rows.map((r) => [r.mode, r.choice])) as never }), t('saved'))}
          className="min-h-10 rounded-card bg-brand px-4 text-brand-ink disabled:opacity-50"
        >
          {t('save')}
        </button>
      </section>

      <section aria-labelledby="voices" className="space-y-2">
        <h2 id="voices" className="text-lg font-medium">{t('voices')}</h2>
        {props.voices.length === 0 && <p className="text-sm text-muted">{t('noVoices')}</p>}
        {props.voices.map((v) => (
          <label key={v.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.enabled} onChange={(e) => run(() => setVoiceEnabled(v.id, e.target.checked), t('saved'))} />
            {v.label} <span className="font-mono text-xs text-muted">{v.id}</span>
          </label>
        ))}
      </section>

      <p role="status" className="text-sm text-muted">{msg}</p>
    </div>
  );
}
