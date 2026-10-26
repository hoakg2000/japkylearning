'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { recordSignupConsents } from '@/app/[locale]/me/actions';
import { Link, useRouter } from '@/i18n/navigation';
import { isOldEnough, MIN_AGE } from '@/lib/auth/age';
import { authClient } from '@/lib/auth/client';

const input = 'mt-1 block min-h-11 w-full rounded-card border border-line bg-surface px-3';

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // onSubmit (not a form action) so React does not reset the fields when there is an error.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    start(async () => {
      if (mode === 'sign-in') {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) return setError(t('errors.signIn'));
        router.push('/home');
        router.refresh();
        return;
      }
      const birthYear = Number(form.get('birthYear'));
      if (!isOldEnough(birthYear)) return setError(t('errors.age', { min: MIN_AGE }));
      if (form.get('consent_account') !== 'on') return setError(t('errors.consent'));
      const { error } = await authClient.signUp.email({ email, password, name: String(form.get('name') ?? '').trim() || email.split('@')[0], birthYear });
      if (error) return setError(error.message === 'AGE_UNDER_16' ? t('errors.age', { min: MIN_AGE }) : t('errors.signUp'));
      await recordSignupConsents({ analytics: form.get('consent_analytics') === 'on', emailReminders: form.get('consent_email') === 'on' });
      router.push('/home');
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      {mode === 'sign-up' && (
        <label className="block text-sm">
          {t('name')}
          <input name="name" autoComplete="nickname" className={input} />
        </label>
      )}
      <label className="block text-sm">
        {t('email')}
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block text-sm">
        {t('password')}
        <input name="password" type="password" required minLength={8} autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} className={input} />
      </label>
      {mode === 'sign-up' && (
        <>
          <label className="block text-sm">
            {t('birthYear')}
            <input name="birthYear" type="number" required min={1900} max={2100} inputMode="numeric" className={input} />
            <span className="mt-1 block text-xs text-muted">{t('ageHint', { min: MIN_AGE })}</span>
          </label>
          <fieldset className="space-y-2 rounded-card border border-line p-3 text-sm">
            <legend className="px-1 font-medium">{t('consents')}</legend>
            <label className="flex gap-2"><input type="checkbox" name="consent_account" required /> <span>{t('consentAccount')} <Link href="/privacy" className="text-brand underline">{t('privacy')}</Link></span></label>
            <label className="flex gap-2"><input type="checkbox" name="consent_analytics" /> {t('consentAnalytics')}</label>
            <label className="flex gap-2"><input type="checkbox" name="consent_email" /> {t('consentEmail')}</label>
          </fieldset>
        </>
      )}
      {error && <p role="alert" className="text-sm text-error">⚠ {error}</p>}
      <button type="submit" disabled={pending} className="min-h-12 w-full rounded-card bg-brand font-medium text-brand-ink disabled:opacity-50">
        {pending ? t('wait') : mode === 'sign-up' ? t('signUp') : t('signIn')}
      </button>
      <p className="text-center text-sm">
        {mode === 'sign-up' ? (
          <Link href="/sign-in" className="text-brand underline">{t('haveAccount')}</Link>
        ) : (
          <Link href="/sign-up" className="text-brand underline">{t('noAccount')}</Link>
        )}
      </p>
    </form>
  );
}
