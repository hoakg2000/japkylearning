import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Privacy');
  return { title: t('title') };
}

/** Privacy summary (ADR 0011). Draft: needs legal review before public launch. */
export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');
  const sections = ['collect', 'purposes', 'processors', 'transfer', 'age', 'rights'] as const;
  return (
    <article className="prose max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="rounded-card bg-warning/10 p-3 text-sm">{t('draft')}</p>
      {sections.map((s) => (
        <section key={s}>
          <h2 className="font-medium">{t(`${s}.h`)}</h2>
          <p className="text-muted">{t(`${s}.p`)}</p>
        </section>
      ))}
    </article>
  );
}
