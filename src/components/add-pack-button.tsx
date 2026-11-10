'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { addPackToReview } from '@/app/[locale]/packs/actions';

export function AddPackButton({ packId }: { packId: string }) {
  const t = useTranslations('Packs');
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ added: number; total: number } | 'error' | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            try {
              setResult(await addPackToReview({ packId, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
            } catch {
              setResult('error');
            }
          })
        }
        className="inline-flex min-h-12 items-center rounded-card bg-brand px-6 font-medium text-brand-ink disabled:opacity-60"
      >
        {pending ? t('adding') : t('addAll')}
      </button>
      <p role="status" className="text-sm">
        {result === 'error' ? t('error') : result ? (result.added ? t('added', { n: result.added }) : t('alreadyAdded')) : null}
      </p>
    </div>
  );
}
