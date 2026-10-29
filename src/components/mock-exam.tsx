'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { submitMockExam } from '@/app/[locale]/tests/mock/actions';
import { QuestionView } from '@/components/question-view';
import { StreakToast } from '@/components/streak-toast';
import { Link } from '@/i18n/navigation';
import type { GrammarPoint, Word } from '@/lib/content/schemas';
import { MOCK_MINUTES, mockExam } from '@/lib/lesson-quiz';
import type { StreakInfo } from '@/lib/progress';
import { seededRng } from '@/lib/quiz';
import { playSound } from '@/lib/sound';

type Run = { seed: number; startedAt: number; answers: { questionId: string; answer: string }[] };
type Result = { score: number; correct: number; total: number; cardsAdded: number; streak: StreakInfo };

// Per-tab progress, so a refresh keeps the same questions, answers and clock.
const KEY = 'japky-mock-n5';
const load = (): Run | null => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
  } catch {
    return null;
  }
};
const save = (run: Run | null) => {
  try {
    if (run) sessionStorage.setItem(KEY, JSON.stringify(run));
    else sessionStorage.removeItem(KEY);
  } catch {}
};

export function MockExam({ words, grammar, locale }: { words: Word[]; grammar: GrammarPoint[]; locale: 'vi' | 'en' }) {
  const t = useTranslations('Mock');
  const [run, setRun] = useState<Run | null>(null);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();
  const sent = useRef(false);

  // sessionStorage exists only after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRun(load());
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const seed = run?.seed;
  const qs = useMemo(() => (seed === undefined ? [] : mockExam(words, grammar, locale, seededRng(seed))), [seed, words, grammar, locale]);
  const left = run ? Math.max(0, run.startedAt + MOCK_MINUTES * 60_000 - now) : 0;
  const i = run?.answers.length ?? 0;

  const submit = (answers: Run['answers']) => {
    if (sent.current) return;
    sent.current = true;
    const all = qs.map((q) => answers.find((a) => a.questionId === q.id) ?? { questionId: q.id, answer: '' });
    start(async () => {
      try {
        const r = await submitMockExam({ answers: all, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        save(null);
        playSound('complete');
        setResult(r);
      } catch {
        sent.current = false;
        setError(true);
      }
    });
  };

  // Time is up: send what was answered; the rest counts as wrong.
  useEffect(() => {
    if (run && now && left === 0 && !result) submit(run.answers);
  });

  if (result) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <p className="text-5xl font-bold">{Math.round(result.score * 100)}%</p>
        <p>{t('result', { correct: result.correct, total: result.total })}</p>
        {result.cardsAdded > 0 && <p>{t('cards', { count: result.cardsAdded })}</p>}
        <StreakToast streak={result.streak} />
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/review" className="inline-flex min-h-11 items-center rounded-card bg-brand px-4 text-brand-ink">{t('toReview')}</Link>
          <Link href="/tests" className="inline-flex min-h-11 items-center rounded-card border border-line px-4">{t('toTests')}</Link>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <p>{t('intro', { count: 32, minutes: MOCK_MINUTES })}</p>
        <button
          type="button"
          onClick={() => {
            const next = { seed: Math.floor(Math.random() * 2 ** 31), startedAt: Date.now(), answers: [] };
            save(next);
            setRun(next);
            setNow(Date.now());
          }}
          className="min-h-12 rounded-card bg-brand px-6 font-medium text-brand-ink"
        >
          {t('start')}
        </button>
      </div>
    );
  }

  const q = qs[i];
  const mm = Math.floor(left / 60_000);
  const ss = String(Math.floor((left % 60_000) / 1000)).padStart(2, '0');
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <progress max={qs.length} value={i} className="h-2 flex-1 accent-brand" aria-label={t('progress')} />
        <span>{Math.min(i + 1, qs.length)}/{qs.length}</span>
        <span role="timer" aria-label={t('timeLeft')} className={`font-mono ${left < 60_000 ? 'text-error' : ''}`}>{mm}:{ss}</span>
      </div>
      {q && (
        <QuestionView
          key={q.id}
          q={q}
          locale={locale}
          showFeedback={false}
          onAnswer={(id) => {
            const next = { ...run, answers: [...run.answers, { questionId: q.id, answer: id }] };
            save(next);
            setTimeout(() => {
              setRun(next);
              if (next.answers.length >= qs.length) submit(next.answers);
            }, 300);
          }}
        />
      )}
      {pending && <p className="text-center text-sm text-muted">{t('saving')}</p>}
      {error && (
        <p role="alert" className="text-center text-sm text-error">
          ⚠ {t('saveError')} <button type="button" className="underline" onClick={() => { setError(false); submit(run.answers); }}>{t('retry')}</button>
        </p>
      )}
    </div>
  );
}
