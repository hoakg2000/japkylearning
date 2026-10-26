import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { KanaChart } from '@/components/kana-chart';
import { Link } from '@/i18n/navigation';
import { kanaRows } from '@/lib/content/kana';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Kana');
  return { title: t('title'), description: t('description') };
}

export default async function KanaPage() {
  const t = await getTranslations('Kana');
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted">{t('description')}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/kana/quiz" className="inline-flex min-h-11 items-center rounded-card bg-brand px-4 font-medium text-brand-ink">{t('practice')}</Link>
          <Link href={{ pathname: '/kana/quiz', query: { mode: 'skip' } }} className="inline-flex min-h-11 items-center rounded-card border border-line px-4">{t('skipTest')}</Link>
        </div>
      </div>
      <KanaChart charts={{ hiragana: kanaRows('hiragana'), katakana: kanaRows('katakana') }} />
    </>
  );
}
