import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Learn');
  return { title: t('title') };
}

export default async function LearnPage() {
  const t = await getTranslations('Learn');
  const items = [
    { href: '/kana', key: 'kana', icon: 'あ' },
    { href: '/learn/n5', key: 'n5', icon: '📘' },
    { href: '/kanji', key: 'kanji', icon: '日' },
    { href: '/packs', key: 'packs', icon: '介' },
    { href: '/songs', key: 'songs', icon: '♪' },
  ] as const;
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="flex h-full flex-col gap-1 rounded-card border border-line bg-surface p-5 hover:border-brand">
              <span lang="ja" aria-hidden className="text-3xl">{i.icon}</span>
              <span className="font-medium">{t(`${i.key}.title`)}</span>
              <span className="text-sm text-muted">{t(`${i.key}.desc`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
