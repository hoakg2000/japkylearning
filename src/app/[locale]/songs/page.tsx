import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Link } from '@/i18n/navigation';
import { getWord } from '@/lib/content/n5';
import { songs } from '@/lib/content/songs';
import { alternates } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Songs');
  return { title: t('title'), description: t('description'), alternates: alternates('/songs', locale) };
}

/** Share of a song's keywords that are N5 words: a rough "easier first" order. */
const n5Share = (s: (typeof songs)[number]) => (s.keywords.length ? s.keywords.filter((k) => getWord(k.wordId)?.jlpt === 'n5').length / s.keywords.length : 0);

export default async function SongsPage() {
  const t = await getTranslations('Songs');
  const list = songs.map((s) => ({ s, share: n5Share(s) })).sort((a, b) => b.share - a.share);
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">{t('title')} <span className="align-middle text-xs font-normal text-muted">beta</span></h1>
      <p className="mb-6 text-sm text-muted">{t('description')}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map(({ s, share }) => (
          <li key={s.slug}>
            <Link href={`/songs/${s.slug}`} className="flex h-full flex-col gap-1 rounded-card border border-line bg-surface p-4 hover:border-brand">
              <span lang="ja" className="text-lg font-medium">{s.title}</span>
              <span className="text-sm text-muted">{s.artist}</span>
              <span className="text-xs text-muted">{t('stats', { keywords: new Set(s.keywords.map((k) => k.wordId)).size, n5: Math.round(share * 100) })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
