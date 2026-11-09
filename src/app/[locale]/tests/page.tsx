import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';
import { lessons } from '@/lib/content/n5';
import { bestLessonScores } from '@/lib/learning';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Tests');
  return { title: t('title') };
}

export default async function TestsPage() {
  const t = await getTranslations('Tests');
  const locale = (await rootLocale()) as 'vi' | 'en';
  return (
    <>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 text-muted">{t('description')}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        <li>
          <Link href={{ pathname: '/kana/quiz', query: { mode: 'skip' } }} className="block rounded-card border border-line bg-surface p-4 hover:border-brand">
            <span className="font-medium">{t('kana')}</span>
            <span className="block text-sm text-muted">{t('kanaDesc')}</span>
          </Link>
        </li>
        {lessons.map((l) => (
          <li key={l.id}>
            <Link href={{ pathname: `/learn/n5/${l.order}/practice`, query: { step: 'test' } }} className="flex items-center justify-between rounded-card border border-line bg-surface p-4 hover:border-brand">
              <span>
                <span className="font-medium">{t('lesson', { n: l.order })}</span>
                <span className="block text-sm text-muted">{l.title[locale]}</span>
              </span>
              <Suspense fallback={null}>
                <Best lessonId={l.id} />
              </Suspense>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/tests/mock" className="mt-6 block rounded-card border border-brand bg-surface p-4 hover:bg-surface-2">
        <span className="font-medium">{t('mock')}</span>
        <span className="block text-sm text-muted">{t('mockDesc')}</span>
      </Link>
    </>
  );
}

async function Best({ lessonId }: { lessonId: string }) {
  const session = await getSession();
  if (!session) return null;
  const best = (await bestLessonScores(session.user.id)).get(lessonId);
  return best === undefined ? null : <span className="text-sm font-medium">{Math.round(best * 100)}%</span>;
}
