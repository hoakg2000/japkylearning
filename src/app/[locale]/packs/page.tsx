import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Link } from '@/i18n/navigation';
import { packs } from '@/lib/content/n5';
import { alternates } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Packs');
  return { title: t('title'), description: t('description'), alternates: alternates('/packs', locale) };
}

export default async function PacksPage() {
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Packs');
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 text-muted">{t('description')}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {packs.map((p) => (
          <li key={p.id}>
            <Link href={`/packs/${p.id}`} className="flex h-full flex-col gap-1 rounded-card border border-line bg-surface p-5 hover:border-brand">
              <span className="font-medium">{p.title[locale]}</span>
              <span className="text-sm text-muted">{p.description[locale]}</span>
              <span className="text-xs text-muted">{t('counts', { words: p.wordIds.length, kanji: p.kanji.length })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
