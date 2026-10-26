import { getTranslations } from 'next-intl/server';
import { FirstRunQuiz } from '@/components/first-run-quiz';
import { Link } from '@/i18n/navigation';
import { hiragana } from '@/lib/content/kana';

export default async function Landing() {
  const t = await getTranslations('Home');
  const pool = hiragana.filter((k) => k.group === 'basic');
  return (
    <div className="grid items-center gap-10 py-6 md:grid-cols-2 md:py-12">
      <section>
        <p lang="ja" className="text-5xl font-bold text-vermilion minimal:text-4xl">日本語</p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">{t('title')}</h1>
        <p className="mt-3 max-w-xl text-muted">{t('subtitle')}</p>
        <ul className="mt-6 space-y-2 text-sm">
          {(['f1', 'f2', 'f3', 'f4'] as const).map((k) => (
            <li key={k} className="flex gap-2"><span aria-hidden className="text-success">✓</span>{t(`features.${k}`)}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/kana" className="inline-flex min-h-12 items-center rounded-card bg-brand px-6 font-medium text-brand-ink">{t('start')}</Link>
          <Link href="/home" className="inline-flex min-h-12 items-center rounded-card border border-line px-6">{t('continue')}</Link>
        </div>
      </section>
      <section aria-label={t('tryNow')}>
        <h2 className="mb-3 text-center font-medium">{t('tryNow')}</h2>
        <FirstRunQuiz pool={pool} />
      </section>
    </div>
  );
}
