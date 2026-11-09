import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthForm } from '@/components/auth-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth');
  return { title: t('signIn'), robots: { index: false } };
}

export default async function SignInPage() {
  const t = await getTranslations('Auth');
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">{t('signIn')}</h1>
      <AuthForm mode="sign-in" />
    </>
  );
}
