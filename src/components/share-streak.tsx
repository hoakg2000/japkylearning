'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

/**
 * Streak share card (F2, P5 decision D7): drawn in the browser and downloaded as PNG.
 * Nothing is uploaded and there is no public URL; the card shows only the streak numbers.
 */
export function ShareStreak({ current, longest }: { current: number; longest: number }) {
  const t = useTranslations('Me');
  const [url, setUrl] = useState<string | null>(null);

  function draw() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const g = canvas.getContext('2d');
    if (!g) return;
    const grad = g.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#3b4cca');
    grad.addColorStop(1, '#e8483d');
    g.fillStyle = grad;
    g.fillRect(0, 0, 1200, 630);
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.font = 'bold 64px system-ui, sans-serif';
    g.fillText('🔥', 600, 170);
    g.font = 'bold 180px system-ui, sans-serif';
    g.fillText(String(current), 600, 360);
    g.font = '48px system-ui, sans-serif';
    g.fillText(t('shareDays', { n: current }), 600, 440);
    g.font = '32px system-ui, sans-serif';
    g.fillText(t('shareLongest', { n: longest }), 600, 500);
    g.font = 'bold 36px system-ui, sans-serif';
    g.fillText('Japky · 日本語', 600, 580);
    setUrl(canvas.toDataURL('image/png'));
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={draw} className="rounded-card border border-line px-3 py-2 text-sm hover:border-brand">
        {t('shareMake')}
      </button>
      {url && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- a local data: URL, nothing to optimise */}
          <img src={url} alt={t('shareAlt', { n: current })} className="h-20 rounded border border-line" />
          <a href={url} download={`japky-streak-${current}.png`} className="rounded-card bg-brand px-3 py-2 text-sm text-brand-ink">
            {t('shareDownload')}
          </a>
        </>
      )}
    </div>
  );
}
