'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/** Registers the service worker (production only) and shows a notice while the browser is offline (P7, G6). */
export function Pwa() {
  const t = useTranslations('Offline');
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    const update = () => setOffline(!navigator.onLine);
    update();
    addEventListener('online', update);
    addEventListener('offline', update);
    return () => {
      removeEventListener('online', update);
      removeEventListener('offline', update);
    };
  }, []);
  if (!offline) return null;
  return (
    <p role="status" className="mx-auto mb-4 max-w-5xl rounded-card border border-warning/60 bg-warning/10 px-3 py-2 text-sm">
      {t('notice')}
    </p>
  );
}
