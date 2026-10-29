import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { JsonLd } from '@/components/json-ld';
import { StrokeOrder } from '@/components/stroke-order';
import { UnreviewedNote } from '@/components/unreviewed-note';
import { WordCard } from '@/components/word/word-card';
import { wordLabels } from '@/components/word/labels';
import { EmbedCode } from '@/components/embed-code';
import { Link } from '@/i18n/navigation';
import { getKanji, getLesson, kanjiList, wordsWithKanji } from '@/lib/content/n5';
import { getStrokes } from '@/lib/content/strokes';
import { alternates } from '@/lib/seo';

export function generateStaticParams() {
  return kanjiList.map((k) => ({ char: k.char }));
}

async function load(params: Promise<{ char: string }>) {
  const k = getKanji(decodeURIComponent((await params).char));
  if (!k) notFound();
  return k;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/kanji/[char]'>): Promise<Metadata> {
  const k = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Kanji');
  return {
    title: t('pageTitle', { char: k.char, hv: k.hanViet.join(', '), meaning: k.meanings[locale] }),
    description: t('pageDescription', { char: k.char, on: k.on.join('、'), kun: k.kun.join('、'), meaning: k.meanings[locale] }),
    alternates: alternates(`/kanji/${k.char}`, locale),
  };
}

export default async function KanjiPage({ params }: PageProps<'/[locale]/kanji/[char]'>) {
  const k = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Kanji');
  const [strokes, labels] = await Promise.all([getStrokes(k.char), wordLabels()]);
  const related = wordsWithKanji(k.char);
  const lesson = k.lessonId ? getLesson(k.lessonId) : undefined;
  return (
    <article className="space-y-8">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'DefinedTerm', name: k.char, description: k.meanings[locale], inDefinedTermSet: 'JLPT N5 kanji' }} />
      <header className="flex flex-wrap items-start gap-6">
        <StrokeOrder char={k.char} strokes={strokes} size={180} />
        <div className="space-y-2">
          <h1 lang="ja" className="text-6xl">{k.char}</h1>
          <p className="text-2xl font-bold tracking-wide">{k.hanViet.join(' · ')}</p>
          <p className="text-lg">{k.meanings[locale]}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted">{t('on')}</dt>
            <dd lang="ja">{k.on.join('、') || '—'}</dd>
            <dt className="text-muted">{t('kun')}</dt>
            <dd lang="ja">{k.kun.join('、') || '—'}</dd>
            <dt className="text-muted">{t('strokesLabel')}</dt>
            <dd>{k.strokeCount}</dd>
            <dt className="text-muted">JLPT</dt>
            <dd>N5</dd>
            {lesson && (
              <>
                <dt className="text-muted">{t('lesson')}</dt>
                <dd>
                  <Link href={`/learn/n5/${lesson.order}`} className="underline">{lesson.order}. {lesson.title[locale]}</Link>
                </dd>
              </>
            )}
          </dl>
        </div>
      </header>
      <UnreviewedNote show={!k.hanVietReviewed} />
      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">{t('words')}</h2>
          <ul className="divide-y divide-line rounded-card border border-line bg-surface px-4">
            {related.map((w) => (
              <li key={w.id}>
                <Link href={`/words/${w.id}`} className="block hover:text-brand">
                  <WordCard word={w} locale={locale} layout="row" labels={labels} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <details className="text-sm">
        <summary className="cursor-pointer text-brand">{t('embed')}</summary>
        <div className="mt-2"><EmbedCode char={k.char} /></div>
      </details>
      <p className="text-xs text-muted">{t('attribution')}</p>
    </article>
  );
}
