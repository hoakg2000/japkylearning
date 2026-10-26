import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { Suspense } from 'react';
import { LessonPractice } from '@/components/lesson-practice';
import { grammarPoints, lessonByOrder, lessonContent, lessons, words } from '@/lib/content/n5';

export function generateStaticParams() {
  return lessons.map((l) => ({ lesson: String(l.order) }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/learn/n5/[lesson]/practice'>): Promise<Metadata> {
  const t = await getTranslations('Practice');
  return { title: t('title', { n: (await params).lesson }), robots: { index: false } };
}

export default async function PracticePage({ params }: PageProps<'/[locale]/learn/n5/[lesson]/practice'>) {
  const lesson = lessonByOrder(Number((await params).lesson));
  if (!lesson) notFound();
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Practice');
  const content = lessonContent(lesson);
  // Distractors come from this and earlier lessons so options stay familiar.
  const pool = words.filter((w) => w.tags.some((tag) => tag <= lesson.id));
  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">{t('title', { n: lesson.order })}: {lesson.title[locale]}</h1>
      <Suspense>
        <LessonPractice lessonId={lesson.id} order={lesson.order} locale={locale} words={content.words} grammar={content.grammar} pool={pool} allGrammar={grammarPoints} />
      </Suspense>
    </>
  );
}
