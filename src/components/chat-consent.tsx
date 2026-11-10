'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { setConsent } from '@/app/[locale]/me/actions';

/** Asks for the `ai_processing` consent before the first chat message (docs/08 §Consent, no pre-ticked box). */
export function ChatConsent() {
  const t = useTranslations('Chat');
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  return (
    <div className="space-y-3 rounded-card border border-line bg-surface p-4">
      <p>{t('consentText')}</p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            try {
              await setConsent('ai_processing', true);
              router.refresh();
            } catch {
              setError(true);
            }
          })
        }
        className="inline-flex min-h-12 items-center rounded-card bg-brand px-6 font-medium text-brand-ink disabled:opacity-60"
      >
        {t('consentAgree')}
      </button>
      {error && <p role="alert" className="text-sm text-error">{t('errors.ERROR')}</p>}
    </div>
  );
}
