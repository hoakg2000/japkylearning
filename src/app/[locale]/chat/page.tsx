import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { Suspense } from 'react';
import { ChatConsent } from '@/components/chat-consent';
import { ChatTutor } from '@/components/chat-tutor';
import { Link } from '@/i18n/navigation';
import { getAiSettings } from '@/lib/ai/registry';
import { getSession } from '@/lib/auth/session';
import { getConsents } from '@/lib/progress';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Chat');
  return { title: t('title'), robots: { index: false } };
}

export default async function ChatPage() {
  const t = await getTranslations('Chat');
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">{t('title')} <span className="align-middle text-xs font-normal text-muted">beta</span></h1>
      <p className="mb-6 text-sm text-muted">{t('scope')}</p>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-surface-2" />}>
        <ChatContent />
      </Suspense>
    </>
  );
}

async function ChatContent() {
  // P5 decision D5: the beta is hidden until an admin switches it on (the API enforces the same flag).
  if (!(await getAiSettings()).chatEnabled) notFound();
  const t = await getTranslations('Chat');
  const locale = (await rootLocale()) as 'vi' | 'en';
  const session = await getSession();
  if (!session || session.user.isAnonymous) {
    return (
      <p>
        {t('signIn')} <Link href="/sign-in" className="underline">{t('signInLink')}</Link>
      </p>
    );
  }
  if ((await getConsents(session.user.id)).ai_processing !== true) return <ChatConsent />;
  return <ChatTutor locale={locale} />;
}
