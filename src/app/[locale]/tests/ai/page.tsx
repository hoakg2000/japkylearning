import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Suspense } from 'react';
import { AiQuizRunner } from '@/components/ai-quiz';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';
import { buildAiQuiz } from '@/lib/ai/service';
import { ensureSettings } from '@/lib/progress';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AiTest');
  return { title: t('title'), robots: { index: false } };
}

export default async function AiTestPage() {
  const t = await getTranslations('AiTest');
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 text-muted">{t('description')}</p>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-surface-2" />}>
        <AiTestContent />
      </Suspense>
    </>
  );
}

async function AiTestContent() {
  const t = await getTranslations('AiTest');
  const locale = (await rootLocale()) as 'vi' | 'en';
  const session = await getSession();
  if (!session) {
    return (
      <p>
        <Link href="/sign-in" className="text-brand underline">{t('signIn')}</Link>
      </p>
    );
  }
  if (session.user.isAnonymous) return <p className="text-sm text-muted">{t('guest')}</p>;
  const settings = await ensureSettings(session.user.id);
  const result = await buildAiQuiz(session.user.id, settings.timezone, locale);
  if (result.reason === 'NOT_ENOUGH_WORDS') {
    return (
      <p className="rounded-card border border-line p-4 text-sm">
        {t('notEnough')}{' '}
        <Link href="/learn/n5" className="text-brand underline">{t('toLessons')}</Link>
      </p>
    );
  }
  return (
    <>
      <p className="mb-4 text-sm text-muted">{t('remaining', { count: result.remaining })}</p>
      <AiQuizRunner questions={result.questions} source={result.source} reason={result.reason} />
    </>
  );
}
