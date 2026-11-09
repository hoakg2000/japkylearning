import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { MockExam } from '@/components/mock-exam';
import { grammarPoints, words } from '@/lib/content/n5';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Mock');
  return { title: t('title'), robots: { index: false } };
}

export default async function MockExamPage() {
  const t = await getTranslations('Mock');
  const locale = (await rootLocale()) as 'vi' | 'en';
  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">{t('title')}</h1>
      <MockExam words={words} grammar={grammarPoints} locale={locale} />
    </>
  );
}
