import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { OnboardingForm } from '@/components/onboarding-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Onboarding');
  return { title: t('title'), robots: { index: false } };
}

export default async function OnboardingPage() {
  const t = await getTranslations('Onboarding');
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
      <Suspense>
        <OnboardingForm />
      </Suspense>
    </>
  );
}
