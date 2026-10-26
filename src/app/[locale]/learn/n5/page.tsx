import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';
import { lessons } from '@/lib/content/n5';
import { lessonProgressMap } from '@/lib/learning';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Path');
  return { title: t('title'), description: t('description') };
}

export default async function N5PathPage() {
  const t = await getTranslations('Path');
  const locale = (await rootLocale()) as 'vi' | 'en';
  return (
    <>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 text-muted">{t('description')}</p>
      <ol className="space-y-3">
        {lessons.map((l) => (
          <li key={l.id}>
            <Link href={`/learn/n5/${l.order}`} className="flex items-center gap-4 rounded-card border border-line bg-surface p-4 hover:border-brand">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 font-bold">{l.order}</span>
              <span className="flex-1">
                <span className="block font-medium">{l.title[locale]}</span>
                <span className="block text-sm text-muted">{t('counts', { words: l.wordIds.length, kanji: l.kanji.length, grammar: l.grammarIds.length })}</span>
              </span>
              <Suspense fallback={null}>
                <LessonStatus lessonId={l.id} />
              </Suspense>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted">{t('more')}</p>
    </>
  );
}

async function LessonStatus({ lessonId }: { lessonId: string }) {
  const t = await getTranslations('Path');
  const session = await getSession();
  if (!session) return null;
  const p = (await lessonProgressMap(session.user.id)).get(lessonId);
  if (!p) return null;
  return p.status === 'done' ? (
    <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">✓ {t('done')}</span>
  ) : (
    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs">{t('inProgress')}</span>
  );
}
