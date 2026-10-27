'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { setConsent, setTimezone, setVoice, updateSettings } from '@/app/[locale]/me/actions';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { writeDisplayPrefs } from '@/lib/display-prefs';

type Settings = { dailyGoalXp: 10 | 20 | 50; furiganaMode: 'always' | 'unlearned' | 'never'; showRomaji: boolean; showHanViet: boolean };
const box = 'space-y-3 rounded-card border border-line bg-surface p-4';

export function SettingsForm({ initial }: { initial: Settings }) {
  const t = useTranslations('Me');
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const save = (next: Settings) => {
    setS(next);
    writeDisplayPrefs({ furigana: next.furiganaMode, romaji: next.showRomaji, hanViet: next.showHanViet });
    setSaved(false);
    start(async () => {
      await updateSettings(next);
      setSaved(true);
    });
  };
  return (
    <section className={box}>
      <h2 className="font-medium">{t('settings')}</h2>
      <label className="flex items-center justify-between gap-3 text-sm">
        {t('dailyGoal')}
        <select value={s.dailyGoalXp} onChange={(e) => save({ ...s, dailyGoalXp: Number(e.target.value) as Settings['dailyGoalXp'] })} className="min-h-10 rounded-card border border-line bg-surface px-2">
          {[10, 20, 50].map((n) => <option key={n} value={n}>{n} XP</option>)}
        </select>
      </label>
      <label className="flex items-center justify-between gap-3 text-sm">
        {t('furigana')}
        <select value={s.furiganaMode} onChange={(e) => save({ ...s, furiganaMode: e.target.value as Settings['furiganaMode'] })} className="min-h-10 rounded-card border border-line bg-surface px-2">
          {(['always', 'unlearned', 'never'] as const).map((m) => <option key={m} value={m}>{t(`furiganaMode.${m}`)}</option>)}
        </select>
      </label>
      <label className="flex items-center justify-between text-sm">{t('romaji')}<input type="checkbox" checked={s.showRomaji} onChange={(e) => save({ ...s, showRomaji: e.target.checked })} /></label>
      <label className="flex items-center justify-between text-sm">{t('hanViet')}<input type="checkbox" checked={s.showHanViet} onChange={(e) => save({ ...s, showHanViet: e.target.checked })} /></label>
      <p className="h-4 text-xs text-muted" aria-live="polite">{pending ? t('saving') : saved ? t('saved') : ''}</p>
    </section>
  );
}

const PURPOSES = ['analytics', 'email_reminders', 'ai_processing', 'speech_processing'] as const;

export function ConsentList({ initial }: { initial: Record<string, boolean> }) {
  const t = useTranslations('Me');
  const [c, setC] = useState(initial);
  const [, start] = useTransition();
  return (
    <section className={box}>
      <h2 className="font-medium">{t('consents')}</h2>
      {PURPOSES.map((p) => (
        <label key={p} className="flex items-center justify-between gap-3 text-sm">
          <span>{t(`purpose.${p}`)}</span>
          <input
            type="checkbox"
            checked={c[p] ?? false}
            onChange={(e) => {
              const granted = e.target.checked;
              setC((x) => ({ ...x, [p]: granted }));
              start(() => setConsent(p, granted));
            }}
          />
        </label>
      ))}
    </section>
  );
}

export function AccountActions() {
  const t = useTranslations('Me');
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  return (
    <section className={box}>
      <h2 className="font-medium">{t('data')}</h2>
      <div className="flex flex-wrap gap-2">
        {/* Download from an API route, not a page navigation. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/me/export" className="inline-flex min-h-10 items-center rounded-card border border-line px-3 text-sm">{t('export')}</a>
        <button
          type="button"
          className="min-h-10 rounded-card border border-line px-3 text-sm"
          onClick={() => start(async () => { await authClient.signOut(); router.push('/'); router.refresh(); })}
        >
          {t('signOut')}
        </button>
        {!confirm ? (
          <button type="button" onClick={() => setConfirm(true)} className="min-h-10 rounded-card border border-error px-3 text-sm text-error">{t('delete')}</button>
        ) : (
          <span className="flex items-center gap-2 text-sm">
            {t('deleteConfirm')}
            <button
              type="button"
              disabled={pending}
              className="min-h-10 rounded-card bg-error px-3 text-white"
              onClick={() => start(async () => { await authClient.deleteUser(); router.push('/'); router.refresh(); })}
            >
              {t('deleteYes')}
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="min-h-10 rounded-card border border-line px-3">{t('cancel')}</button>
          </span>
        )}
      </div>
    </section>
  );
}

/** Cloud voice choice: only enabled allowlist voices are offered. The empty option keeps the device voice. */
export function VoiceSelect({ voices, current }: { voices: { id: string; label: string }[]; current: string | null }) {
  const t = useTranslations('Me');
  const [v, setV] = useState(current ?? '');
  const [pending, start] = useTransition();
  if (!voices.length) return null;
  return (
    <section className={box}>
      <label className="flex items-center justify-between gap-3 text-sm">
        {t('voice')}
        <select
          value={v}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            setV(next);
            start(() => setVoice(next || null));
          }}
          className="min-h-10 rounded-card border border-line bg-surface px-2"
        >
          <option value="">{t('deviceVoice')}</option>
          {voices.map((x) => (
            <option key={x.id} value={x.id}>{x.label}</option>
          ))}
        </select>
      </label>
    </section>
  );
}

/** shortcut: offers the current zone, Vietnam and Japan only; use Intl.supportedValuesOf when learners live elsewhere. */
export function TimezoneSelect({ current }: { current: string }) {
  const t = useTranslations('Me');
  const [tz, setTz] = useState(current);
  const [status, setStatus] = useState<'' | 'saved' | 'once'>('');
  const [pending, start] = useTransition();
  const zones = [...new Set([current, 'Asia/Ho_Chi_Minh', 'Asia/Tokyo'])];
  return (
    <section className={box}>
      <label className="flex items-center justify-between gap-3 text-sm">
        {t('timezone')}
        <select
          value={tz}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            start(async () => {
              const r = await setTimezone(next);
              if (r.ok) setTz(next);
              setStatus(r.ok ? 'saved' : 'once');
            });
          }}
          className="min-h-10 rounded-card border border-line bg-surface px-2"
        >
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
      </label>
      <p className="text-xs text-muted" aria-live="polite">{status === 'saved' ? t('saved') : status === 'once' ? t('timezoneOnce') : t('timezoneHint')}</p>
    </section>
  );
}
