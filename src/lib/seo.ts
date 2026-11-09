import type { Metadata } from 'next';

const base = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Canonical + hreflang for a path that exists in every locale (docs/08-NFR.md §1). */
export function alternates(path: string, locale: 'vi' | 'en'): Metadata['alternates'] {
  return {
    canonical: `/${locale}${path}`,
    languages: { vi: `/vi${path}`, en: `/en${path}`, 'x-default': `/vi${path}` },
  };
}

export const siteUrl = base;
