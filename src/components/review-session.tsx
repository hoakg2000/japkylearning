'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { rateCard } from '@/app/[locale]/review/actions';
import { StreakToast } from '@/components/streak-toast';
import { Ruby } from '@/components/word/ruby';
import { Link } from '@/i18n/navigation';
import type { GrammarPoint, Kana, Word } from '@/lib/content/schemas';
import type { StreakInfo } from '@/lib/progress';
import { playSound } from '@/lib/sound';
import { speak } from '@/lib/speech/tts';

export type ReviewItem =
  | { cardId: number; kind: 'word' | 'listening'; word: Word }
  | { cardId: number; kind: 'grammar'; grammar: GrammarPoint; clozeIndex: number }
  | { cardId: number; kind: 'kana'; kana: Kana };

const RATINGS = [
  { value: 1, key: 'again', cls: 'border-error text-error' },
  { value: 2, key: 'hard', cls: 'border-warning' },
  { value: 3, key: 'good', cls: 'border-success text-success' },
  { value: 4, key: 'easy', cls: 'border-info text-info' },
] as const;

export function ReviewSession({ items, locale }: { items: ReviewItem[]; locale: 'vi' | 'en' }) {
  const t = useTranslations('Review');
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [error, setError] = useState(false);
  const [, start] = useTransition();
  const shownAt = useRef(0);
  const item = items[i];

  useEffect(() => {
    shownAt.current = performance.now();
    if (item?.kind === 'listening') speak(item.word.reading);
  }, [item]);

  const reveal = () => {
    if (revealed || !item) return;
    setRevealed(true);
    playSound('flip');
    if (item.kind === 'kana') speak(item.kana.char);
    else if (item.kind !== 'grammar') speak(item.word.reading);
  };

  const rate = (rating: 1 | 2 | 3 | 4) => {
    if (!revealed || !item) return;
    const elapsedMs = Math.round(performance.now() - shownAt.current);
    playSound(rating === 1 ? 'wrong' : 'correct');
    start(async () => {
      try {
        const r = await rateCard({ cardId: item.cardId, rating, elapsedMs });
        setStreak(r.streak);
      } catch {
        setError(true);
      }
    });
    setRevealed(false);
    setI((n) => n + 1);
    if (i + 1 >= items.length) playSound('complete');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        reveal();
      } else if (['1', '2', '3', '4'].includes(e.key)) rate(Number(e.key) as 1 | 2 | 3 | 4);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!item) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-2xl font-bold">🎉 {t('done', { count: items.length })}</p>
        {streak && <StreakToast streak={streak} />}
        {error && <p role="alert" className="text-sm text-error">⚠ {t('saveError')}</p>}
        <Link href="/home" className="inline-flex min-h-11 items-center rounded-card bg-brand px-4 text-brand-ink">{t('toToday')}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-3 text-sm text-muted">
        <progress max={items.length} value={i} className="h-2 flex-1 accent-brand" aria-label={t('progress')} />
        {i + 1}/{items.length}
      </div>
      <button type="button" onClick={reveal} className="flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-card border border-line bg-surface p-6 text-center" aria-label={t('reveal')}>
        <span className="text-xs uppercase tracking-wide text-muted">{t(`kind.${item.kind}`)}</span>
        <Front item={item} revealed={revealed} />
        {revealed && <Back item={item} locale={locale} />}
        {!revealed && <span className="mt-4 text-sm text-muted">{t('tapToReveal')}</span>}
      </button>
      {revealed && (
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button key={r.value} type="button" onClick={() => rate(r.value)} className={`min-h-14 rounded-card border-2 bg-surface text-sm font-medium ${r.cls}`}>
              <span className="block text-xs text-muted">{r.value}</span>
              {t(`rating.${r.key}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Front({ item, revealed }: { item: ReviewItem; revealed: boolean }) {
  if (item.kind === 'kana') return <span lang="ja" className="text-6xl">{item.kana.char}</span>;
  if (item.kind === 'word') return <Ruby segments={item.word.segments} className="ruby-line text-5xl" />;
  if (item.kind === 'listening') return revealed ? <Ruby segments={item.word.segments} className="ruby-line text-5xl" /> : <span className="text-5xl">🔊</span>;
  if (item.kind !== 'grammar') return null;
  const c = item.grammar.cloze[item.clozeIndex];
  const at = c.ja.indexOf(c.blank);
  return (
    <p lang="ja" className="text-2xl">
      {c.ja.slice(0, at)}
      <span className="mx-1 inline-block min-w-12 border-b-2 border-brand">{revealed ? c.blank : ' '}</span>
      {c.ja.slice(at + c.blank.length)}
    </p>
  );
}

function Back({ item, locale }: { item: ReviewItem; locale: 'vi' | 'en' }) {
  if (item.kind === 'kana') return <p className="text-2xl">{item.kana.romaji}</p>;
  if (item.kind === 'grammar') {
    const c = item.grammar.cloze[item.clozeIndex];
    return (
      <div className="space-y-1">
        <p className="text-sm">{c.translation[locale]}</p>
        <p className="font-medium"><span lang="ja">{item.grammar.pattern}</span> — {item.grammar.meaning[locale]}</p>
      </div>
    );
  }
  const w = item.word;
  return (
    <div className="space-y-1">
      <p className="romaji text-sm text-muted">{w.romaji}</p>
      {w.hanViet && <p className="hanviet text-sm font-medium tracking-wide">{w.hanViet}</p>}
      <p className="text-xl">{w.meanings[locale]}</p>
      <p className="text-sm"><Ruby segments={w.examples[0].segments} /> — {w.examples[0].translation[locale]}</p>
    </div>
  );
}
