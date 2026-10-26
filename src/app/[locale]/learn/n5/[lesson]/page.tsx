import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { AudioButton } from '@/components/audio-button';
import { DisplayToggles } from '@/components/display-toggles';
import { JsonLd } from '@/components/json-ld';
import { Ruby } from '@/components/word/ruby';
import { WordCard } from '@/components/word/word-card';
import { wordLabels } from '@/components/word/labels';
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

export async function generateMetadata({ params }: PageProps<'/[locale]/learn/n5/[lesson]'>): Promise<Metadata> {
  const lesson = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Lesson');
  return {
    title: `${t('lesson', { n: lesson.order })}: ${lesson.title[locale]}`,
    description: lesson.goals.map((g) => g[locale]).join(' · '),
    alternates: alternates(`/learn/n5/${lesson.order}`, locale),
  };
}

export default async function LessonPage({ params }: PageProps<'/[locale]/learn/n5/[lesson]'>) {
  const lesson = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Lesson');
  const labels = await wordLabels();
  const { words, kanji, grammar } = lessonContent(lesson);
  const prev = lessonByOrder(lesson.order - 1);
  const next = lessonByOrder(lesson.order + 1);

  return (
    <article className="space-y-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: lesson.title[locale],
          educationalLevel: 'JLPT N5',
          inLanguage: ['ja', locale],
          teaches: grammar.map((g) => g.pattern),
          learningResourceType: 'Lesson',
        }}
      />
      <header className="space-y-3">
        <p className="text-sm text-muted">
          <Link href="/learn/n5" className="underline">{t('path')}</Link> · {t('lesson', { n: lesson.order })}
        </p>
        <h1 className="text-3xl font-bold">{lesson.title[locale]}</h1>
        <ul className="space-y-1">
          {lesson.goals.map((g, i) => (
            <li key={i} className="flex gap-2"><span aria-hidden className="text-success">✓</span>{g[locale]}</li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DisplayToggles />
          <Link href={`/learn/n5/${lesson.order}/practice`} className="inline-flex min-h-12 items-center rounded-card bg-brand px-6 font-medium text-brand-ink">
            {t('practice')}
          </Link>
        </div>
      </header>

      <section aria-labelledby="vocab">
        <h2 id="vocab" className="mb-3 text-xl font-bold">{t('vocab', { count: words.length })}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {words.map((w) => (
            <WordCard key={w.id} word={w} locale={locale} layout="card" density="standard" labels={labels} />
          ))}
        </div>
      </section>

      {kanji.length > 0 && (
        <section aria-labelledby="kanji">
          <h2 id="kanji" className="mb-3 text-xl font-bold">{t('kanji', { count: kanji.length })}</h2>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
            {kanji.map((k) => (
              <li key={k.char}>
                <Link href={`/kanji/${k.char}`} className="flex flex-col items-center rounded-card border border-line bg-surface p-3 hover:border-brand">
                  <span lang="ja" className="text-4xl">{k.char}</span>
                  <span className="hanviet text-xs font-medium">{k.hanViet.join(', ')}</span>
                  <span className="text-xs text-muted">{k.meanings[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="grammar" className="space-y-4">
        <h2 id="grammar" className="text-xl font-bold">{t('grammar')}</h2>
        {grammar.map((g) => (
          <div key={g.id} id={g.id} className="space-y-3 rounded-card border border-line bg-surface p-4">
            <h3 className="text-lg font-medium"><span lang="ja">{g.pattern}</span> — {g.meaning[locale]}</h3>
            <p>{g.explanation[locale]}</p>
            <ul className="space-y-2">
              {g.examples.map((ex, i) => (
                <li key={i} className="rounded-[calc(var(--radius)-6px)] bg-surface-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Ruby segments={ex.segments} className="ruby-line text-lg" />
                    <AudioButton text={ex.ja} className="size-8 shrink-0" />
                  </div>
                  <p className="romaji text-xs text-muted">{ex.romaji}</p>
                  <p className="text-sm">{ex.translation[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="dialogue">
        <h2 id="dialogue" className="mb-3 text-xl font-bold">{t('dialogue')}</h2>
        <ol className="space-y-3">
          {lesson.dialogue.map((line, i) => (
            <li key={i} className={`flex gap-3 ${i % 2 ? 'flex-row-reverse text-right' : ''}`}>
              <span lang="ja" className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-sm">{line.speaker.slice(0, 2)}</span>
              <div className="max-w-[80%] rounded-card border border-line bg-surface p-3">
                <div className={`flex items-start gap-2 ${i % 2 ? 'flex-row-reverse' : ''}`}>
                  <Ruby segments={line.segments} className="ruby-line" />
                  <AudioButton text={line.ja} className="size-8 shrink-0" />
                </div>
                <p className="text-sm text-muted">{line.translation[locale]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <nav className="flex justify-between border-t border-line pt-4 text-sm" aria-label={t('nav')}>
        {prev ? <Link href={`/learn/n5/${prev.order}`} className="underline">← {prev.title[locale]}</Link> : <span />}
        {next ? <Link href={`/learn/n5/${next.order}`} className="underline">{next.title[locale]} →</Link> : <span />}
      </nav>
    </article>
  );
}
