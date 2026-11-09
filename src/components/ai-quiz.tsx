'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { AiQuestion } from '@/lib/ai/quiz-gen';
import { playSound } from '@/lib/sound';

/** Runs the AI test questions returned by the server. Feedback comes from the explanation field. */
export function AiQuizRunner({ questions, source, reason }: { questions: AiQuestion[]; source: 'ai' | 'static'; reason?: string }) {
  const t = useTranslations('AiTest');
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (!questions.length) return <p className="rounded-card border border-line p-4 text-sm text-muted">{t('empty')}</p>;
  if (i >= questions.length) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-4xl font-bold">{score}/{questions.length}</p>
        <button type="button" onClick={() => location.reload()} className="min-h-11 rounded-card bg-brand px-5 text-brand-ink">{t('again')}</button>
      </div>
    );
  }
  const q = questions[i];
  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === q.answerIndex;
    if (ok) setScore((s) => s + 1);
    playSound(ok ? 'correct' : 'wrong');
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">
        {source === 'ai' ? t('sourceAi') : t('sourceStatic')}
        {reason && source === 'static' ? ` · ${t(`reason.${reason}`, { default: reason })}` : ''}
      </p>
      <progress max={questions.length} value={i} className="h-2 w-full accent-brand" aria-label={t('progress')} />
      <p lang="ja" className="rounded-card border border-line bg-surface p-5 text-center text-2xl">{q.prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((o, idx) => {
          const cls = picked === null ? 'border-line bg-surface hover:border-brand' : idx === q.answerIndex ? 'border-success bg-success/10' : idx === picked ? 'border-error bg-error/10' : 'border-line opacity-60';
          return (
            <button key={idx} type="button" disabled={picked !== null} onClick={() => choose(idx)} className={`min-h-14 rounded-card border px-4 text-left text-lg ${cls}`}>
              <span lang="ja">{o}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div role="status" className="flex items-center justify-between gap-3 rounded-card bg-surface-2 p-3 text-sm">
          <span>{q.explanation}</span>
          <button type="button" autoFocus onClick={() => { setPicked(null); setI(i + 1); }} className="shrink-0 rounded-card bg-brand px-4 py-2 text-brand-ink">{t('next')}</button>
        </div>
      )}
    </div>
  );
}
