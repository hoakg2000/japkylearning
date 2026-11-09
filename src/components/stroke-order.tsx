'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const hex = (c: string) => c.codePointAt(0)!.toString(16).padStart(5, '0');

/**
 * Animated stroke order from KanjiVG paths (CC BY-SA 3.0). Pass `strokes` when the server
 * already has them; otherwise they are fetched from /strokes/<hex>.json.
 */
export function StrokeOrder({ char, strokes: initial, size = 160 }: { char: string; strokes?: string[] | null; size?: number }) {
  const t = useTranslations('Strokes');
  const [strokes, setStrokes] = useState<string[] | null | undefined>(initial);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (initial !== undefined) return;
    let alive = true;
    fetch(`/strokes/${hex(char)}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { strokes: string[] } | null) => alive && setStrokes(d?.strokes ?? null))
      .catch(() => alive && setStrokes(null));
    return () => {
      alive = false;
    };
  }, [char, initial]);

  if (strokes === null) return <p className="text-sm text-muted">{t('missing')}</p>;
  if (!strokes) return <div style={{ width: size, height: size }} className="animate-pulse rounded-card bg-surface-2" />;

  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <svg key={run} viewBox="0 0 109 109" width={size} height={size} role="img" aria-label={t('label', { char, count: strokes.length })} className="rounded-card border border-line bg-surface">
        <path d="M54.5 0v109M0 54.5h109" stroke="var(--line)" strokeDasharray="3 3" />
        {strokes.map((d, i) => (
          <path key={`bg${i}`} d={d} fill="none" stroke="var(--line)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {strokes.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-draw"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </svg>
      <figcaption className="flex items-center gap-2 text-xs text-muted">
        {t('count', { count: strokes.length })}
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded border border-line px-2 py-0.5 hover:bg-surface-2">
          {t('replay')}
        </button>
      </figcaption>
    </figure>
  );
}
