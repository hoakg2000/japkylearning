'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { readDisplayPrefs, writeDisplayPrefs, type DisplayPrefs } from '@/lib/display-prefs';

/** Furigana / romaji / Hán-Việt switches shown above study content (F13). */
export function DisplayToggles() {
  const t = useTranslations('Display');
  const [p, setP] = useState<DisplayPrefs | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setP(readDisplayPrefs()), []);
  if (!p) return <div className="h-9" />;
  const update = (next: DisplayPrefs) => {
    setP(next);
    writeDisplayPrefs(next);
  };
  const chip = 'rounded-full border border-line px-3 py-1 text-sm aria-pressed:border-brand aria-pressed:bg-brand/10';
  return (
    <div role="group" aria-label={t('label')} className="flex flex-wrap gap-2">
      <button type="button" className={chip} aria-pressed={p.furigana !== 'never'} onClick={() => update({ ...p, furigana: p.furigana === 'never' ? 'always' : 'never' })}>
        {t('furigana')}
      </button>
      <button type="button" className={chip} aria-pressed={p.romaji} onClick={() => update({ ...p, romaji: !p.romaji })}>
        {t('romaji')}
      </button>
      <button type="button" className={chip} aria-pressed={p.hanViet} onClick={() => update({ ...p, hanViet: !p.hanViet })}>
        {t('hanViet')}
      </button>
    </div>
  );
}
