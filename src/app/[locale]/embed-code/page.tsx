import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { EmbedBuilder } from '@/components/embed-builder';
import { words } from '@/lib/content/n5';
import { alternates } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('EmbedCode');
  return { title: t('title'), description: t('intro'), alternates: alternates('/embed-code', locale) };
}

export default async function EmbedCodePage() {
  const t = await getTranslations('EmbedCode');
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 text-sm text-muted">{t('intro')}</p>
      <EmbedBuilder firstWordId={words[0].id} />
    </>
  );
}
