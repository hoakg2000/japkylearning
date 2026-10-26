import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';
import { getStreak } from '@/lib/progress';
import { getTodayPlan } from '@/lib/today';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Today');
  return { title: t('title'), robots: { index: false } };
}

export default async function TodayPage() {
  const t = await getTranslations('Today');
  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-card bg-surface-2" />}>
        <TodayContent />
      </Suspense>
    </>
  );
}

async function TodayContent() {
  const t = await getTranslations('Today');
  const session = await getSession();
  if (!session) {
    return (
      <section className="py-10 text-center">
        <p className="text-lg">{t('welcome')}</p>
        <Link href="/" className="mt-4 inline-flex min-h-12 items-center rounded-card bg-brand px-6 text-brand-ink">{t('startFirstRun')}</Link>
      </section>
    );
  }
  const [streak, tasks] = await Promise.all([getStreak(session.user.id), getTodayPlan(session.user.id)]);
  const [main, ...rest] = tasks;
  const goalPct = Math.min(100, Math.round((streak.todayXp / streak.goalXp) * 100));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted">{t('greeting')}</p>
        <span className="rounded-full border border-warning/50 bg-warning/10 px-3 py-1 text-sm" title={t('freezes', { count: streak.freezes })}>
          <span aria-hidden>🔥</span> {streak.current}
        </span>
      </div>

      <section className="rounded-card border border-line bg-surface p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>{t('goal')}</span>
          <span>{streak.todayXp}/{streak.goalXp} XP</span>
        </div>
        <progress value={goalPct} max={100} className="h-2 w-full accent-success" aria-label={t('goal')} />
      </section>

      {main ? (
        <Link href={main.href} className="flex min-h-16 items-center justify-between rounded-card bg-brand px-5 text-lg font-medium text-brand-ink">
          <span>{t('continue')} · {t(`task.${main.kind}`, { count: main.count ?? 0 })}</span>
          <span aria-hidden>→</span>
        </Link>
      ) : (
        <section className="rounded-card border border-success/50 bg-success/10 p-5 text-center">
          <p className="text-lg font-medium">🎉 {t('allDone')}</p>
          <p className="text-sm text-muted">{t('allDoneHint')}</p>
        </section>
      )}

      {rest.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-3">
          {rest.slice(0, 3).map((task) => (
            <li key={task.id}>
              <Link href={task.href} className="block rounded-card border border-line bg-surface p-4 hover:border-brand">
                <p className="font-medium">{t(`task.${task.kind}`, { count: task.count ?? 0 })}</p>
                <p className="text-sm text-muted">{t(`reason.${task.reason}`)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {session.user.isAnonymous && (
        <p className="rounded-card bg-surface-2 p-3 text-sm">
          {t('saveProgress')} <Link href="/sign-up" className="font-medium text-brand underline">{t('signUp')}</Link>
        </p>
      )}
    </div>
  );
}
