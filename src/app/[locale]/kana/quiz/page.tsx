import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { KanaQuiz } from '@/components/kana-quiz';
import { hiragana, katakana, quizzable } from '@/lib/content/kana';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('KanaQuiz');
  return { title: t('title') };
}

export default async function KanaQuizPage() {
  const t = await getTranslations('KanaQuiz');
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      {/* useSearchParams needs a boundary under Cache Components. */}
      <Suspense>
        <KanaQuiz hiragana={hiragana.filter(quizzable)} katakana={katakana.filter(quizzable)} />
      </Suspense>
    </>
  );
}
