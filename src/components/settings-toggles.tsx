'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { isSoundEnabled, playSound, setSoundEnabled } from '@/lib/sound';

const btn = 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-line px-2 text-sm hover:bg-surface-2';

export function SettingsToggles() {
  const t = useTranslations('Settings');
  const { resolvedTheme, setTheme } = useTheme();
  const [ui, setUi] = useState<'full' | 'minimal'>('full');
  const [sound, setSound] = useState(true);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Read client-only state after hydration (set by public/ui-mode.js and localStorage).
    /* eslint-disable react-hooks/set-state-in-effect */
    setUi(document.documentElement.dataset.ui === 'minimal' ? 'minimal' : 'full');
    setSound(isSoundEnabled());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggleUi = () => {
    const next = ui === 'full' ? 'minimal' : 'full';
    document.documentElement.dataset.ui = next;
    try {
      localStorage.setItem('japky-ui', next);
    } catch {}
    setUi(next);
  };

  const toggleSound = () => {
    setSoundEnabled(!sound);
    setSound(!sound);
    if (!sound) playSound('tap');
  };

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={btn} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} aria-label={t('theme')} title={t('theme')}>
        <span aria-hidden suppressHydrationWarning>{resolvedTheme === 'dark' ? '☾' : '☀'}</span>
      </button>
      <button type="button" className={btn} onClick={toggleUi} aria-pressed={ui === 'minimal'} title={t('uiMode')}>
        {ui === 'minimal' ? t('minimal') : t('full')}
      </button>
      <button type="button" className={btn} onClick={toggleSound} aria-pressed={sound} aria-label={t('sound')} title={t('sound')}>
        <span aria-hidden>{sound ? '🔊' : '🔇'}</span>
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => router.replace(pathname, { locale: locale === 'vi' ? 'en' : 'vi' })}
        aria-label={t('language')}
      >
        {locale === 'vi' ? 'EN' : 'VI'}
      </button>
    </div>
  );
}
