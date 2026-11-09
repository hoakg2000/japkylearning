import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Suspense } from 'react';
import { ReviewSession, type ReviewItem } from '@/components/review-session';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';
import { hiragana, katakana } from '@/lib/content/kana';
import { getGrammar, getWord } from '@/lib/content/n5';
import { dueCards } from '@/lib/learning';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Review');
  return { title: t('title'), robots: { index: false } };
}

export default async function ReviewPage() {
  const t = await getTranslations('Review');
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <Suspense fallback={<div className="mx-auto h-64 max-w-xl animate-pulse rounded-card bg-surface-2" />}>
        <ReviewContent />
      </Suspense>
    </>
  );
}

async function ReviewContent() {
  const t = await getTranslations('Review');
  const locale = (await rootLocale()) as 'vi' | 'en';
  const session = await getSession();
  const cards = session ? await dueCards(session.user.id, 20) : [];
  const items: ReviewItem[] = cards.flatMap((c): ReviewItem[] => {
    if (c.itemType === 'grammar') {
      const g = getGrammar(c.itemId);
      // Alternate cloze sentences across reviews.
      return g ? [{ cardId: c.id, kind: 'grammar', grammar: g, clozeIndex: c.reps % g.cloze.length }] : [];
    }
    if (c.itemType === 'kana') {
      const k = [...hiragana, ...katakana].find((x) => x.char === c.itemId);
      return k ? [{ cardId: c.id, kind: 'kana', kana: k }] : [];
    }
    const w = getWord(c.itemId);
    if (!w) return [];
    if (c.itemType === 'word' && c.direction === 'production') return [{ cardId: c.id, kind: 'production', word: w }];
    return c.itemType === 'word' || c.itemType === 'listening' ? [{ cardId: c.id, kind: c.itemType, word: w }] : [];
  });

  if (!items.length) {
    return (
      <section className="mx-auto max-w-md space-y-3 rounded-card border border-success/50 bg-success/10 p-6 text-center">
        <p className="text-lg font-medium">🎉 {t('empty')}</p>
        <p className="text-sm text-muted">{t('emptyHint')}</p>
        <Link href="/learn/n5" className="inline-flex min-h-11 items-center rounded-card bg-brand px-4 text-brand-ink">{t('toLessons')}</Link>
      </section>
    );
  }
  return <ReviewSession items={items} locale={locale} />;
}
