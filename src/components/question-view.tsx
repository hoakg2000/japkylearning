'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Ruby } from '@/components/word/ruby';
import type { Question } from '@/lib/lesson-quiz';
import { playSound } from '@/lib/sound';
import { speak } from '@/lib/speech/tts';

/** One multiple-choice question (meaning / reading / listening / cloze) with keyboard 1–4 support. */
export function QuestionView({ q, locale, onAnswer, showFeedback = true }: { q: Question; locale: 'vi' | 'en'; onAnswer: (optionId: string, correct: boolean) => void; showFeedback?: boolean }) {
  const t = useTranslations('Practice');
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (q.type === 'listening') speak(q.word.reading);
  }, [q]);

  const pick = (id: string) => {
    if (picked) return;
    const ok = id === q.answer;
    setPicked(id);
    playSound(ok ? 'correct' : 'wrong');
    if (q.type !== 'cloze') speak(q.word.reading);
    onAnswer(id, ok);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length && !(e.target instanceof HTMLInputElement)) pick(q.options[n - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const state = (id: string) => {
    if (!picked || !showFeedback) return picked === id ? 'border-brand bg-brand/10' : 'border-line bg-surface hover:border-brand';
    if (id === q.answer) return 'border-success bg-success/10';
    if (id === picked) return 'border-error bg-error/10';
    return 'border-line opacity-60';
  };

  return (
    <div className="space-y-5">
      <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-card border border-line bg-surface p-5 text-center">
        <p className="text-sm text-muted">{t(`prompt.${q.type}`)}</p>
        {q.type === 'meaning' && <Ruby segments={q.word.segments} className="ruby-line text-4xl" />}
        {q.type === 'reading' && <span lang="ja" className="text-5xl">{q.word.surface}</span>}
        {q.type === 'listening' && (
          <button type="button" onClick={() => speak(q.word.reading)} aria-label={t('replay')} className="rounded-full border border-line px-6 py-3 text-2xl">🔊</button>
        )}
        {q.type === 'cloze' && (
          <>
            <p lang="ja" className="text-2xl">
              {q.before}
              <span className="mx-1 inline-block min-w-12 border-b-2 border-brand">{picked ? (showFeedback ? q.answer : picked) :' '}</span>
              {q.after}
            </p>
            <p className="text-sm text-muted">{q.translation}</p>
          </>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <button key={o.id} type="button" disabled={!!picked} onClick={() => pick(o.id)} className={`flex min-h-14 items-center gap-3 rounded-card border px-4 text-left text-lg ${state(o.id)}`}>
            <span className="text-xs text-muted">{i + 1}</span>
            {o.segments ? <Ruby segments={o.segments} /> : <span lang={q.type === 'meaning' ? locale : 'ja'}>{o.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
