'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import type { Kana } from '@/lib/content/schemas';
import { buildOptions, shuffle } from '@/lib/quiz';
import { playSound } from '@/lib/sound';
import { speak } from '@/lib/speech/tts';

const LENGTH = 5;

/** 5 hiragana questions on the landing page, no sign-up (F0). The score feeds onboarding. */
export function FirstRunQuiz({ pool }: { pool: Kana[] }) {
  const t = useTranslations('FirstRun');
  const router = useRouter();
  type Q = { kana: Kana; options: Kana[] };
  const [questions, setQuestions] = useState<Q[] | null>(null);
  // Random questions are built after mount: the page itself is prerendered static.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestions(shuffle(pool).slice(0, LENGTH).map((kana) => ({ kana, options: buildOptions(kana, pool, 4, (k) => k.romaji) })));
  }, [pool]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  if (!questions) return <div className="mx-auto h-72 max-w-sm animate-pulse rounded-card bg-surface-2" />;
  const q = questions[i];

  const pick = (o: Kana) => {
    if (picked) return;
    const ok = o.char === q.kana.char;
    setPicked(o.char);
    if (ok) setScore((s) => s + 1);
    playSound(ok ? 'correct' : 'wrong');
    speak(q.kana.char);
    setTimeout(() => {
      if (i + 1 < LENGTH) {
        setI(i + 1);
        setPicked(null);
      } else {
        playSound('complete');
        router.push({ pathname: '/onboarding', query: { score: String(score + (ok ? 1 : 0)) } });
      }
    }, 700);
  };

  return (
    <div className="mx-auto max-w-sm rounded-card border border-line bg-surface p-5 text-left shadow-sm minimal:shadow-none">
      <p className="text-sm text-muted">{t('question', { n: i + 1, total: LENGTH })}</p>
      <p lang="ja" className="my-3 text-center text-6xl">{q.kana.char}</p>
      <p className="mb-3 text-center text-sm">{t('prompt')}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((o) => {
          const state = !picked ? '' : o.char === q.kana.char ? 'border-success bg-success/10' : o.char === picked ? 'border-error bg-error/10' : 'opacity-60';
          return (
            <button key={o.char} type="button" onClick={() => pick(o)} disabled={!!picked} className={`min-h-12 rounded-card border border-line text-lg ${state}`}>
              {o.romaji}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-muted">{t('noSignup')}</p>
    </div>
  );
}
