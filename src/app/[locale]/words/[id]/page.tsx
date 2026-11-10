import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { DisplayToggles } from '@/components/display-toggles';
import { JsonLd } from '@/components/json-ld';
import { UnreviewedNote } from '@/components/unreviewed-note';
import { WordCard } from '@/components/word/word-card';
import { wordLabels } from '@/components/word/labels';
import { Link } from '@/i18n/navigation';
import { allWords, getLesson, getWord, packsWithWord } from '@/lib/content/n5';
import { alternates } from '@/lib/seo';

export function generateStaticParams() {
  return allWords.map((w) => ({ id: w.id }));
}

async function load(params: Promise<{ id: string }>) {
  const w = getWord((await params).id);
  if (!w) notFound();
  return w;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/words/[id]'>): Promise<Metadata> {
  const w = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Word');
  return {
    title: t('pageTitle', { surface: w.surface, reading: w.reading, meaning: w.meanings[locale] }),
    description: `${w.surface} (${w.reading}, ${w.romaji}) – ${w.meanings[locale]}. ${w.examples[0].ja} ${w.examples[0].translation[locale]}`,
    alternates: alternates(`/words/${w.id}`, locale),
  };
}

export default async function WordPage({ params }: PageProps<'/[locale]/words/[id]'>) {
  const w = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Word');
  const labels = await wordLabels();
  const lesson = getLesson(w.tags[0]);
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'DefinedTerm', name: w.surface, alternateName: [w.reading, w.romaji], description: w.meanings[locale], inDefinedTermSet: w.jlpt ? `JLPT ${w.jlpt.toUpperCase()} vocabulary` : 'Japky vocabulary pack' }} />
      <h1 className="sr-only">{w.surface}</h1>
      <DisplayToggles />
      <UnreviewedNote show={!w.meaningsViReviewed} />
      <WordCard word={w} locale={locale} layout="card" density="extended" labels={{ ...labels, details: '' }} />
      {lesson && (
        <p className="text-sm">
          {t('inLesson')} <Link href={`/learn/n5/${lesson.order}`} className="underline">{lesson.order}. {lesson.title[locale]}</Link>
        </p>
      )}
      {packsWithWord(w.id).map((p) => (
        <p key={p.id} className="text-sm">
          {t('inPack')} <Link href={`/packs/${p.id}`} className="underline">{p.title[locale]}</Link>
        </p>
      ))}
      <p className="text-xs text-muted">{t('attribution')}</p>
    </article>
  );
}
