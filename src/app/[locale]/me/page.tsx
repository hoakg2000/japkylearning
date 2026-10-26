import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { AccountActions, ConsentList, SettingsForm } from '@/components/me-controls';
import { StreakCalendar } from '@/components/streak-calendar';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';
import { ensureSettings, getConsents, getStreak } from '@/lib/progress';
import { studyDate } from '@/lib/streak';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Me');
  return { title: t('title'), robots: { index: false } };
}

export default async function MePage() {
  const t = await getTranslations('Me');
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-surface-2" />}>
        <MeContent />
      </Suspense>
    </>
  );
}

async function MeContent() {
  const t = await getTranslations('Me');
  const session = await getSession();
  if (!session) {
    return (
      <p>
        <Link href="/sign-in" className="text-brand underline">{t('signIn')}</Link> · <Link href="/sign-up" className="text-brand underline">{t('signUp')}</Link>
      </p>
    );
  }
  const userId = session.user.id;
  const [settings, streak, consents] = await Promise.all([ensureSettings(userId), getStreak(userId), getConsents(userId)]);
  const anonymous = !!session.user.isAnonymous;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="space-y-3 rounded-card border border-line bg-surface p-4 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium">{anonymous ? t('guest') : session.user.email}</p>
          {anonymous && <Link href="/sign-up" className="rounded-card bg-brand px-3 py-2 text-sm text-brand-ink">{t('saveProgress')}</Link>}
        </div>
        <p className="text-sm">
          🔥 {t('streak', { current: streak.current, longest: streak.longest })} · {t('freezes', { count: streak.freezes })}
        </p>
        <StreakCalendar streak={streak} today={studyDate(new Date(), settings.timezone)} />
      </section>
      <SettingsForm
        initial={{
          dailyGoalXp: settings.dailyGoalXp as 10 | 20 | 50,
          furiganaMode: settings.furiganaMode as 'always' | 'unlearned' | 'never',
          showRomaji: settings.showRomaji,
          showHanViet: settings.showHanViet,
        }}
      />
      {!anonymous && <ConsentList initial={consents} />}
      <AccountActions />
    </div>
  );
}
