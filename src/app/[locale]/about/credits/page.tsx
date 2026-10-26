import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import meta from '../../../../../content/levels/n5/meta.json';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Credits');
  return { title: t('title') };
}

const SOURCES = [
  { name: 'JMdict / KANJIDIC2', by: 'Electronic Dictionary Research and Development Group (EDRDG)', license: 'CC BY-SA 4.0', url: 'https://www.edrdg.org/edrdg/licence.html' },
  { name: 'jmdict-simplified', by: 'scriptin', license: 'CC BY-SA 4.0', url: 'https://github.com/scriptin/jmdict-simplified' },
  { name: 'JmdictFurigana', by: 'Doublevil', license: 'CC BY-SA', url: 'https://github.com/Doublevil/JmdictFurigana' },
  { name: 'KanjiVG', by: 'Ulrich Apel', license: 'CC BY-SA 3.0', url: 'https://kanjivg.tagaini.net' },
  { name: 'Unihan (kVietnamese)', by: 'Unicode, Inc.', license: 'Unicode License v3', url: 'https://www.unicode.org/license.txt' },
  { name: 'Noto Sans JP, Be Vietnam Pro', by: 'Google Fonts', license: 'SIL Open Font License', url: 'https://fonts.google.com' },
];

/** Attribution required by the dataset licenses (docs/07-CONTENT-LICENSING.md). */
export default async function CreditsPage() {
  const t = await getTranslations('Credits');
  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p>{t('intro')}</p>
      <ul className="space-y-3">
        {SOURCES.map((s) => (
          <li key={s.name} className="rounded-card border border-line bg-surface p-3">
            <a href={s.url} className="font-medium text-brand underline" rel="noopener noreferrer">{s.name}</a>
            <p className="text-sm text-muted">{s.by} · {s.license}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm">{t('content')}</p>
      <p className="text-xs text-muted">{t('versions', { jmdict: meta.sources.jmdict, furigana: meta.sources.jmdictFurigana })}</p>
    </article>
  );
}
