import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Landing() {
  const t = await getTranslations('Home');
  return (
    <section className="py-10 text-center">
      <p lang="ja" className="text-5xl font-bold text-vermilion minimal:text-4xl">日本語</p>
      <h1 className="mt-4 text-3xl font-bold">{t('title')}</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted">{t('subtitle')}</p>
      <Link href="/kana" className="mt-8 inline-flex min-h-12 items-center rounded-card bg-brand px-6 font-medium text-brand-ink">
        {t('start')}
      </Link>
    </section>
  );
}
