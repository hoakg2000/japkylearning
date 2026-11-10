import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { SpeakPractice } from '@/components/speak-practice';
import { Link } from '@/i18n/navigation';
import { lessonByOrder, lessonContent, lessons } from '@/lib/content/n5';
import { alternates } from '@/lib/seo';

export function generateStaticParams() {
  return lessons.map((l) => ({ lesson: String(l.order) }));
}

async function load(params: Promise<{ lesson: string }>) {
  const lesson = lessonByOrder(Number((await params).lesson));
  if (!lesson) notFound();
  return lesson;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/speak/[lesson]'>): Promise<Metadata> {
  const lesson = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Speak');
  return { title: `${t('title')} – ${lesson.title[locale]}`, alternates: alternates(`/speak/${lesson.order}`, locale), robots: { index: false } };
}

/** F10 speaking practice for one lesson: static shell, recorder runs in the browser (P6 decisions E1, E2). */
export default async function SpeakPage({ params }: PageProps<'/[locale]/speak/[lesson]'>) {
  const lesson = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Speak');
  const { words } = lessonContent(lesson);
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-muted">
          <Link href={`/learn/n5/${lesson.order}`} className="underline">← {lesson.order}. {lesson.title[locale]}</Link>
        </p>
        <h1 className="text-2xl font-bold">{t('title')} <span className="align-middle text-xs font-normal text-muted">beta</span></h1>
        <p className="text-sm text-muted">{t('intro')}</p>
      </header>
      <SpeakPractice
        lessonId={lesson.id}
        words={words.map((w) => ({ id: w.id, surface: w.surface, reading: w.reading, romaji: w.romaji, segments: w.segments, meaning: w.meanings[locale] }))}
      />
    </article>
  );
}
