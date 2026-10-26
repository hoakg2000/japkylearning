'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { submitLessonTest } from '@/app/[locale]/learn/n5/[lesson]/actions';
import { QuestionView } from '@/components/question-view';
import { StreakToast } from '@/components/streak-toast';
import { Ruby } from '@/components/word/ruby';
import { Link } from '@/i18n/navigation';
import type { GrammarPoint, Word } from '@/lib/content/schemas';
import { clozeQuestion, lessonTest, listeningQuestion, meaningQuestion, type Question } from '@/lib/lesson-quiz';
import type { StreakInfo } from '@/lib/progress';
import { shuffle } from '@/lib/quiz';
import { playSound } from '@/lib/sound';
import { speak } from '@/lib/speech/tts';

type Props = { lessonId: string; order: number; locale: 'vi' | 'en'; words: Word[]; grammar: GrammarPoint[]; pool: Word[]; allGrammar: GrammarPoint[] };
type Step = 'study' | 'practice' | 'test' | 'result';
type Result = { score: number; correct: number; total: number; passed: boolean; cardsAdded: number; streak: StreakInfo; wrong: string[] };

const STEPS: Step[] = ['study', 'practice', 'test'];

export function LessonPractice(props: Props) {
  const t = useTranslations('Practice');
  const initial = useSearchParams().get('step') === 'test' ? 'test' : 'study';
  const [step, setStep] = useState<Step>(initial);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <ol className="flex gap-2 text-sm" aria-label={t('steps')}>
        {STEPS.map((s, i) => (
          <li key={s} aria-current={step === s ? 'step' : undefined} className="flex-1 rounded-full border border-line px-3 py-1 text-center aria-[current=step]:border-brand aria-[current=step]:bg-brand aria-[current=step]:text-brand-ink">
            {i + 1}. {t(`step.${s}`)}
          </li>
        ))}
      </ol>
      {step === 'study' && <Study {...props} onDone={() => setStep('practice')} />}
      {step === 'practice' && <Practice {...props} onDone={() => setStep('test')} />}
      {(step === 'test' || step === 'result') && <Test {...props} />}
    </div>
  );
}

function Study({ words, locale, onDone }: Props & { onDone: () => void }) {
  const t = useTranslations('Practice');
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const w = words[i];
  const next = () => {
    setFlipped(false);
    if (i + 1 < words.length) setI(i + 1);
    else onDone();
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{t('studyHint', { n: i + 1, total: words.length })}</p>
      <button
        type="button"
        onClick={() => {
          setFlipped((f) => !f);
          playSound('flip');
          if (!flipped) speak(w.reading);
        }}
        className="flex min-h-56 w-full flex-col items-center justify-center gap-2 rounded-card border border-line bg-surface p-6"
        aria-label={t('flip')}
      >
        <Ruby segments={w.segments} className="ruby-line text-5xl" />
        {flipped && (
          <>
            <span className="romaji text-muted">{w.romaji}</span>
            {w.hanViet && <span className="hanviet font-medium tracking-wide">{w.hanViet}</span>}
            <span className="text-xl">{w.meanings[locale]}</span>
            <span className="mt-2 text-sm">
              <Ruby segments={w.examples[0].segments} /> — {w.examples[0].translation[locale]}
            </span>
          </>
        )}
      </button>
      <div className="flex justify-between">
        <button type="button" onClick={onDone} className="text-sm text-muted underline">{t('skipStudy')}</button>
        <button type="button" onClick={next} className="min-h-11 rounded-card bg-brand px-5 text-brand-ink">{t('next')}</button>
      </div>
    </div>
  );
}

function Practice({ words, grammar, pool, allGrammar, locale, onDone }: Props & { onDone: () => void }) {
  const t = useTranslations('Practice');
  const [qs, setQs] = useState<Question[] | null>(null);
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  // Random questions are built after mount (Cache Components: no randomness during prerender).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQs(
      shuffle([
        ...words.map((w) => meaningQuestion(w, pool, locale, Math.random)),
        ...grammar.flatMap((g) => g.cloze.map((_, k) => clozeQuestion(g, allGrammar, locale, Math.random, k))),
        ...shuffle(words).slice(0, 4).map((w) => listeningQuestion(w, pool, Math.random)),
      ]),
    );
  }, [words, grammar, pool, allGrammar, locale]);
  if (!qs) return null;
  const q = qs[i];
  return (
    <div className="space-y-4">
      <progress max={qs.length} value={i} className="h-2 w-full accent-brand" aria-label={t('progress')} />
      <QuestionView key={`${q.id}-${i}`} q={q} locale={locale} onAnswer={() => setAnswered(true)} />
      <div className="flex justify-between">
        <button type="button" onClick={onDone} className="text-sm text-muted underline">{t('toTest')}</button>
        {answered && (
          <button
            type="button"
            autoFocus
            onClick={() => {
              setAnswered(false);
              if (i + 1 < qs.length) setI(i + 1);
              else onDone();
            }}
            className="min-h-11 rounded-card bg-brand px-5 text-brand-ink"
          >
            {t('next')}
          </button>
        )}
      </div>
    </div>
  );
}

function Test({ lessonId, order, words, grammar, pool, allGrammar, locale }: Props) {
  const t = useTranslations('Practice');
  const [qs, setQs] = useState<Question[] | null>(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQs(lessonTest({ words, grammar }, pool, allGrammar, locale, Math.random));
  }, [words, grammar, pool, allGrammar, locale]);

  const submit = (all: { questionId: string; answer: string }[]) =>
    start(async () => {
      try {
        const r = await submitLessonTest({ lessonId, answers: all, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        playSound('complete');
        setResult(r);
      } catch {
        setError(true);
      }
    });

  if (!qs) return null;
  if (result) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-5xl font-bold">{Math.round(result.score * 100)}%</p>
        <p>{t('result', { correct: result.correct, total: result.total })}</p>
        <p className="font-medium">{result.passed ? t('passed', { cards: result.cardsAdded }) : t('failed')}</p>
        <StreakToast streak={result.streak} />
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={`/learn/n5/${order}`} className="inline-flex min-h-11 items-center rounded-card border border-line px-4">{t('backToLesson')}</Link>
          {result.passed ? (
            <Link href="/review" className="inline-flex min-h-11 items-center rounded-card bg-brand px-4 text-brand-ink">{t('toReview')}</Link>
          ) : (
            <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-card bg-brand px-4 text-brand-ink">{t('retry')}</button>
          )}
        </div>
      </div>
    );
  }

  const q = qs[i];
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{t('testHint', { n: i + 1, total: qs.length })}</p>
      <QuestionView
        key={q.id}
        q={q}
        locale={locale}
        showFeedback
        onAnswer={(id) => {
          const all = [...answers, { questionId: q.id, answer: id }];
          setAnswers(all);
          setTimeout(() => {
            if (i + 1 < qs.length) setI(i + 1);
            else submit(all);
          }, 600);
        }}
      />
      {pending && <p className="text-center text-sm text-muted">{t('saving')}</p>}
      {error && <p role="alert" className="text-center text-sm text-error">⚠ {t('saveError')}</p>}
    </div>
  );
}
