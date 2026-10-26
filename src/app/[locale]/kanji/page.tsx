import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { DisplayToggles } from '@/components/display-toggles';
import { Link } from '@/i18n/navigation';
import { kanjiList, lessons } from '@/lib/content/n5';
import { alternates } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Kanji');
  const locale = (await rootLocale()) as 'vi' | 'en';
  return { title: t('title'), description: t('description'), alternates: alternates('/kanji', locale) };
}

export default async function KanjiListPage() {
  const t = await getTranslations('Kanji');
  const locale = (await rootLocale()) as 'vi' | 'en';
  const groups = [
    ...lessons.map((l) => ({ key: l.id, title: t('lessonGroup', { n: l.order, title: l.title[locale] }), items: kanjiList.filter((k) => k.lessonId === l.id) })),
    { key: 'later', title: t('laterGroup'), items: kanjiList.filter((k) => !k.lessonId) },
  ].filter((g) => g.items.length);
  return (
    <>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mb-4 text-muted">{t('description')}</p>
      <div className="mb-6"><DisplayToggles /></div>
      {groups.map((g) => (
        <section key={g.key} className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-muted">{g.title}</h2>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {g.items.map((k) => (
              <li key={k.char}>
                <Link href={`/kanji/${k.char}`} className="flex flex-col items-center rounded-card border border-line bg-surface p-2 hover:border-brand">
                  <span lang="ja" className="text-3xl">{k.char}</span>
                  <span className="hanviet text-[11px] font-medium">{k.hanViet[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
