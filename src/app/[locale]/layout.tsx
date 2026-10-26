import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Be_Vietnam_Pro, Noto_Sans_JP } from 'next/font/google';
import { locale as rootLocale } from 'next/root-params';
import { MainNav } from '@/components/nav';
import { Providers } from '@/components/providers';
import { SettingsToggles } from '@/components/settings-toggles';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const ui = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '700'], variable: '--font-ui', display: 'swap' });
// Japanese glyphs are large: no preload, the browser fetches unicode-range chunks on demand.
const jp = Noto_Sans_JP({ weight: ['400', '500', '700'], variable: '--font-jp', display: 'swap', preload: false });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: { default: t('title'), template: `%s · Japky` },
    description: t('description'),
  };
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await rootLocale();
  const t = await getTranslations('Nav');
  return (
    <html lang={locale} className={`${ui.variable} ${jp.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets data-ui before paint; a file, not inline, to fit the CSP (ADR 0013). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/ui-mode.js" />
      </head>
      <body className="min-h-dvh bg-bg text-ink">
        <NextIntlClientProvider>
          <Providers>
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
              {t('skip')}
            </a>
            <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
              <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
                <Link href="/" className="flex items-center gap-2 font-bold">
                  <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-vermilion text-white" lang="ja">日</span>
                  Japky
                </Link>
                <MainNav variant="top" />
                <SettingsToggles />
              </div>
            </header>
            <main id="main" className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">
              {children}
            </main>
            <MainNav variant="bottom" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
