'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AudioButton } from '@/components/audio-button';
import { StrokeOrder } from '@/components/stroke-order';
import type { Kana } from '@/lib/content/schemas';
import { playSound } from '@/lib/sound';
import { speak } from '@/lib/speech/tts';

type Row = { row: string; group: Kana['group']; items: Kana[] };
type Charts = { hiragana: Row[]; katakana: Row[] };

const GROUPS: Kana['group'][] = ['basic', 'dakuten', 'handakuten', 'yoon', 'small', 'extended'];

export function KanaChart({ charts }: { charts: Charts }) {
  const t = useTranslations('Kana');
  const [script, setScript] = useState<keyof Charts>('hiragana');
  const [selected, setSelected] = useState<Kana | null>(null);
  const rows = charts[script];

  const select = (k: Kana) => {
    setSelected(k);
    speak(k.char);
    playSound('tap');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div>
        <div role="tablist" aria-label={t('script')} className="mb-4 inline-flex rounded-card border border-line p-1">
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={script === s}
              onClick={() => {
                setScript(s);
                setSelected(null);
              }}
              className="rounded-[calc(var(--radius)-4px)] px-4 py-1.5 text-sm aria-selected:bg-brand aria-selected:text-brand-ink"
            >
              {t(s)}
            </button>
          ))}
        </div>

        {GROUPS.map((g) => {
          const groupRows = rows.filter((r) => r.group === g);
          if (!groupRows.length) return null;
          return (
            <section key={g} className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-muted">{t(`group.${g}`)}</h2>
              <div className="space-y-2">
                {groupRows.map((r) => (
                  <div key={r.row} className="grid grid-cols-5 gap-2">
                    {r.items.map((k) => (
                      <button
                        key={k.char}
                        type="button"
                        onClick={() => select(k)}
                        aria-pressed={selected?.char === k.char}
                        className="flex min-h-16 flex-col items-center justify-center rounded-card border border-line bg-surface transition hover:-translate-y-0.5 hover:border-brand aria-pressed:border-brand aria-pressed:ring-2 aria-pressed:ring-brand/30 minimal:min-h-12 minimal:hover:translate-y-0"
                      >
                        <span lang="ja" className="text-2xl minimal:text-xl">{k.char}</span>
                        <span className="text-xs text-muted">{k.romaji}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside aria-live="polite" className="lg:sticky lg:top-20 lg:self-start">
        {selected ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-surface p-4">
            <p lang="ja" className="text-6xl">{selected.char}</p>
            <p className="text-lg">{selected.romaji}</p>
            <AudioButton text={selected.char} audioUrl={selected.audioUrl} />
            {[...selected.char].map((c) => (
              <StrokeOrder key={c} char={c} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-line p-4 text-sm text-muted">{t('pick')}</p>
        )}
      </aside>
    </div>
  );
}
