'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveOnboarding } from '@/app/[locale]/onboarding/actions';
import { useRouter } from '@/i18n/navigation';
import { playSound } from '@/lib/sound';

type Known = 'none' | 'kana' | 'some-n5';
type Goal = 'jlpt' | 'tokutei' | 'it';
type Sector = 'kaigo' | 'food-service' | 'manufacturing' | 'construction' | 'agriculture' | 'other';

const option = 'flex min-h-14 w-full items-center gap-3 rounded-card border border-line bg-surface px-4 text-left aria-pressed:border-brand aria-pressed:ring-2 aria-pressed:ring-brand/30';

export function OnboardingForm() {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const score = Number(useSearchParams().get('score') ?? '');
  const [known, setKnown] = useState<Known | null>(Number.isFinite(score) && score >= 4 ? 'kana' : null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [sector, setSector] = useState<Sector>('kaigo');
  const [daily, setDaily] = useState<10 | 20 | 50>(20);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);

  const submit = () => {
    if (!known || !goal) return;
    start(async () => {
      try {
        const r = await saveOnboarding({
          knownLevel: known,
          goal,
          sector: goal === 'tokutei' ? sector : undefined,
          dailyGoalXp: daily,
          firstRunScore: Number.isInteger(score) && score >= 0 && score <= 5 ? score : undefined,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        playSound('complete');
        router.push(r.next);
      } catch {
        setError(true);
      }
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {Number.isInteger(score) && score >= 0 && <p className="rounded-card bg-surface-2 p-3 text-sm">{t('firstRun', { score })}</p>}

      <fieldset className="space-y-2">
        <legend className="mb-2 text-lg font-medium">1. {t('known.q')}</legend>
        {(['none', 'kana', 'some-n5'] as const).map((k) => (
          <button key={k} type="button" className={option} aria-pressed={known === k} onClick={() => setKnown(k)}>{t(`known.${k}`)}</button>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-lg font-medium">2. {t('goal.q')}</legend>
        {(['jlpt', 'tokutei', 'it'] as const).map((g) => (
          <button key={g} type="button" className={option} aria-pressed={goal === g} onClick={() => setGoal(g)}>{t(`goal.${g}`)}</button>
        ))}
        {goal === 'tokutei' && (
          <label className="mt-2 block text-sm">
            {t('sector.q')}
            <select value={sector} onChange={(e) => setSector(e.target.value as Sector)} className="mt-1 block min-h-11 w-full rounded-card border border-line bg-surface px-3">
              {(['kaigo', 'food-service', 'manufacturing', 'construction', 'agriculture', 'other'] as const).map((s) => (
                <option key={s} value={s}>{t(`sector.${s}`)}</option>
              ))}
            </select>
          </label>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-lg font-medium">3. {t('daily.q')}</legend>
        <div className="grid grid-cols-3 gap-2">
          {([10, 20, 50] as const).map((d) => (
            <button key={d} type="button" className={`${option} flex-col justify-center gap-0 text-center`} aria-pressed={daily === d} onClick={() => setDaily(d)}>
              <span className="font-medium">{t(`daily.${d}`)}</span>
              <span className="text-xs text-muted">{d} XP</span>
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p role="alert" className="text-error">⚠ {t('error')}</p>}
      <button type="button" disabled={!known || !goal || pending} onClick={submit} className="min-h-12 w-full rounded-card bg-brand font-medium text-brand-ink disabled:opacity-50">
        {pending ? t('saving') : t('submit')}
      </button>
    </div>
  );
}
