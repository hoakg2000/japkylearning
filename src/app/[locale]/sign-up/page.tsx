import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthForm } from '@/components/auth-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth');
  return { title: t('signUp'), robots: { index: false } };
}

export default async function SignUpPage() {
  const t = await getTranslations('Auth');
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">{t('signUp')}</h1>
      <AuthForm mode="sign-up" />
    </>
  );
}
