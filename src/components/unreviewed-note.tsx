import { getTranslations } from 'next-intl/server';

/** Shown while agent-authored Vietnamese text or Hán-Việt has not been checked by a person (backlog B6). */
export async function UnreviewedNote({ show }: { show: boolean }) {
  if (!show) return null;
  const t = await getTranslations('Content');
  return (
    <p role="note" className="rounded-card border border-warning/60 bg-warning/10 px-3 py-2 text-xs">
      ⚠ {t('unreviewed')}
    </p>
  );
}
