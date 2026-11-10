import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { AddPackButton } from '@/components/add-pack-button';
import { DisplayToggles } from '@/components/display-toggles';
import { UnreviewedNote } from '@/components/unreviewed-note';
import { WordCard } from '@/components/word/word-card';
import { wordLabels } from '@/components/word/labels';
import { Link } from '@/i18n/navigation';
import { getPack, packContent, packs } from '@/lib/content/n5';
import { alternates } from '@/lib/seo';

export function generateStaticParams() {
  return packs.map((p) => ({ id: p.id }));
}

async function load(params: Promise<{ id: string }>) {
  const pack = getPack((await params).id);
  if (!pack) notFound();
  return pack;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/packs/[id]'>): Promise<Metadata> {
  const pack = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  return { title: pack.title[locale], description: pack.description[locale], alternates: alternates(`/packs/${pack.id}`, locale) };
}

export default async function PackPage({ params }: PageProps<'/[locale]/packs/[id]'>) {
  const pack = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Packs');
  const labels = await wordLabels();
  const { words, kanji } = packContent(pack);

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm text-muted">
          <Link href="/packs" className="underline">{t('title')}</Link>
        </p>
        <h1 className="text-3xl font-bold">{pack.title[locale]}</h1>
        <p>{pack.description[locale]}</p>
        <UnreviewedNote show={words.some((w) => !w.meaningsViReviewed) || kanji.some((k) => !k.hanVietReviewed)} />
        <AddPackButton packId={pack.id} />
        <DisplayToggles />
      </header>

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

      <section aria-labelledby="vocab">
        <h2 id="vocab" className="mb-3 text-xl font-bold">{t('vocab', { count: words.length })}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {words.map((w) => (
            <WordCard key={w.id} word={w} locale={locale} layout="card" density="standard" labels={labels} />
          ))}
        </div>
      </section>
    </article>
  );
}
