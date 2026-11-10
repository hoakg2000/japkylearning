import type { MetadataRoute } from 'next';
import { allKanji, allWords, lessons, packs } from '@/lib/content/n5';
import { songs } from '@/lib/content/songs';
import { siteUrl } from '@/lib/seo';

/** Public, static pages in both locales with hreflang alternates (docs/08-NFR.md §1). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/kana',
    '/learn',
    '/learn/n5',
    '/kanji',
    '/tests',
    '/privacy',
    '/about/credits',
    '/embed-code',
    ...lessons.map((l) => `/learn/n5/${l.order}`),
    '/packs',
    '/songs',
    ...songs.map((s) => `/songs/${s.slug}`),
    ...packs.map((p) => `/packs/${p.id}`),
    ...allKanji.map((k) => `/kanji/${encodeURIComponent(k.char)}`),
    ...allWords.map((w) => `/words/${w.id}`),
  ];
  return paths.flatMap((p) =>
    (['vi', 'en'] as const).map((locale) => ({
      url: `${siteUrl()}/${locale}${p}`,
      alternates: { languages: { vi: `${siteUrl()}/vi${p}`, en: `${siteUrl()}/en${p}` } },
    })),
  );
}
