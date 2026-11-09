'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { recordKanaQuiz } from '@/app/[locale]/kana/actions';
import { StreakToast } from '@/components/streak-toast';
import { Link } from '@/i18n/navigation';
import type { Kana } from '@/lib/content/schemas';
import { isRomajiAnswer } from '@/lib/kana-answer';
import { buildOptions, pickWeighted, shuffle, SKIP_PASS_RATIO } from '@/lib/quiz';
import { playSound } from '@/lib/sound';
import { speak } from '@/lib/speech/tts';
import type { StreakInfo } from '@/lib/progress';

type Mode = 'choose' | 'reverse' | 'listen' | 'type';
type Config = { scripts: ('hiragana' | 'katakana')[]; groups: ('basic' | 'voiced' | 'yoon')[]; mode: Mode | 'mixed'; length: number };
type Question = { kana: Kana; mode: Mode; options: Kana[] };

const MODES: Mode[] = ['choose', 'reverse', 'listen', 'type'];
const inGroup = (k: Kana, groups: Config['groups']) =>
  (groups.includes('basic') && k.group === 'basic') ||
  (groups.includes('voiced') && (k.group === 'dakuten' || k.group === 'handakuten')) ||
  (groups.includes('yoon') && k.group === 'yoon');

export function KanaQuiz({ hiragana, katakana }: { hiragana: Kana[]; katakana: Kana[] }) {
  const t = useTranslations('KanaQuiz');
  const isSkip = useSearchParams().get('mode') === 'skip';
  const [config, setConfig] = useState<Config>({ scripts: ['hiragana'], groups: ['basic'], mode: 'choose', length: 10 });
  const [started, setStarted] = useState(false);

  const effective: Config = isSkip ? { scripts: ['hiragana', 'katakana'], groups: ['basic', 'voiced'], mode: 'mixed', length: 20 } : config;
  const pool = [...(effective.scripts.includes('hiragana') ? hiragana : []), ...(effective.scripts.includes('katakana') ? katakana : [])].filter((k) => inGroup(k, effective.groups));

  if (!started && !isSkip) {
    const toggle = <K extends 'scripts' | 'groups'>(key: K, v: Config[K][number]) =>
      setConfig((c) => {
        const list = c[key] as string[];
        const next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
        return next.length ? { ...c, [key]: next } : c;
      });
    const chip = 'rounded-full border border-line px-4 py-2 text-sm aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-ink';
    return (
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2 font-medium">{t('script')}</legend>
          <div className="flex flex-wrap gap-2">
            {(['hiragana', 'katakana'] as const).map((s) => (
              <button key={s} type="button" className={chip} aria-pressed={config.scripts.includes(s)} onClick={() => toggle('scripts', s)}>{t(s)}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-medium">{t('groups')}</legend>
          <div className="flex flex-wrap gap-2">
            {(['basic', 'voiced', 'yoon'] as const).map((g) => (
              <button key={g} type="button" className={chip} aria-pressed={config.groups.includes(g)} onClick={() => toggle('groups', g)}>{t(`group.${g}`)}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-medium">{t('mode')}</legend>
          <div className="flex flex-wrap gap-2">
            {([...MODES, 'mixed'] as const).map((m) => (
              <button key={m} type="button" className={chip} aria-pressed={config.mode === m} onClick={() => setConfig((c) => ({ ...c, mode: m }))}>{t(`modes.${m}`)}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-medium">{t('length')}</legend>
          <div className="flex gap-2">
            {[10, 20, 40].map((n) => (
              <button key={n} type="button" className={chip} aria-pressed={config.length === n} onClick={() => setConfig((c) => ({ ...c, length: n }))}>{n}</button>
            ))}
          </div>
        </fieldset>
        <button type="button" onClick={() => setStarted(true)} className="min-h-12 rounded-card bg-brand px-6 font-medium text-brand-ink">
          {t('start', { count: pool.length })}
        </button>
      </div>
    );
  }

  return <QuizRun key={String(isSkip)} pool={pool} config={effective} isSkip={isSkip} onRestart={() => setStarted(false)} />;
}

function QuizRun({ pool, config, isSkip, onRestart }: { pool: Kana[]; config: Config; isSkip: boolean; onRestart: () => void }) {
  const t = useTranslations('KanaQuiz');
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [answered, setAnswered] = useState<{ ok: boolean; picked?: string } | null>(null);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<{ score: number; passedSkip: boolean; streak: StreakInfo } | null>(null);
  const [saving, startSaving] = useTransition();
  const [saveError, setSaveError] = useState(false);

  const makeQuestion = (missCounts: Record<string, number>): Question => {
    const kana = pickWeighted(pool, (k) => missCounts[k.char] ?? 0);
    const mode = config.mode === 'mixed' ? shuffle(MODES)[0] : config.mode;
    const sameScript = pool.filter((k) => k.script === kana.script);
    return { kana, mode, options: buildOptions(kana, sameScript, 5, (k) => (mode === 'choose' ? k.romaji : k.char)) };
  };

  const [q, setQ] = useState<Question>(() => makeQuestion({}));
  const done = index >= config.length;

  const answer = (ok: boolean, picked?: string) => {
    if (answered) return;
    setAnswered({ ok, picked });
    playSound(ok ? 'correct' : 'wrong');
    if (q.mode !== 'listen') speak(q.kana.char);
    if (ok) setCorrect((c) => c + 1);
    else {
      setMisses((m) => ({ ...m, [q.kana.char]: (m[q.kana.char] ?? 0) + 1 }));
      setMissed((m) => (m.includes(q.kana.char) ? m : [...m, q.kana.char]));
    }
  };

  const next = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setAnswered(null);
    setTyped('');
    if (nextIndex < config.length) {
      const nq = makeQuestion(misses);
      setQ(nq);
      if (nq.mode === 'listen') speak(nq.kana.char);
      return;
    }
    playSound('complete');
    startSaving(async () => {
      try {
        const r = await recordKanaQuiz({
          mode: isSkip ? 'skip' : 'practice',
          total: config.length,
          correct: correct,
          missed,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setResult(r);
      } catch {
        setSaveError(true);
      }
    });
  };

  if (done) {
    const ratio = correct / config.length;
    return (
      <div className="space-y-4 text-center">
        <p className="text-5xl font-bold">{Math.round(ratio * 100)}%</p>
        <p>{t('result', { correct, total: config.length })}</p>
        {isSkip && <p className="font-medium">{ratio >= SKIP_PASS_RATIO ? t('skipPassed') : t('skipFailed', { pass: SKIP_PASS_RATIO * 100 })}</p>}
        {missed.length > 0 && (
          <p className="text-muted">
            {t('missed')} <span lang="ja" className="text-lg text-ink">{missed.join(' ')}</span>
          </p>
        )}
        {saving && <p className="text-sm text-muted">{t('saving')}</p>}
        {saveError && <p role="alert" className="text-sm text-error">⚠ {t('saveError')}</p>}
        {result && <StreakToast streak={result.streak} />}
        <div className="flex justify-center gap-2">
          <button type="button" onClick={onRestart} className="min-h-11 rounded-card border border-line px-4">{t('again')}</button>
          <Link href="/home" className="inline-flex min-h-11 items-center rounded-card bg-brand px-4 text-brand-ink">{t('toToday')}</Link>
        </div>
      </div>
    );
  }

  const optionClass = (o: Kana) => {
    const isAnswer = o.char === q.kana.char;
    const base = 'min-h-14 rounded-card border px-3 text-lg transition disabled:cursor-default';
    if (!answered) return `${base} border-line bg-surface hover:border-brand`;
    if (isAnswer) return `${base} border-success bg-success/10`;
    if (answered.picked === o.char) return `${base} border-error bg-error/10`;
    return `${base} border-line opacity-60`;
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-3 text-sm text-muted">
        <progress max={config.length} value={index} className="h-2 flex-1 accent-brand" aria-label={t('progress')} />
        {index + 1}/{config.length}
      </div>

      <div className="flex min-h-40 flex-col items-center justify-center rounded-card border border-line bg-surface p-6">
        <p className="mb-2 text-sm text-muted">{t(`prompt.${q.mode}`)}</p>
        {q.mode === 'listen' ? (
          <button type="button" onClick={() => speak(q.kana.char)} className="rounded-full border border-line px-6 py-3 text-2xl" aria-label={t('replay')}>🔊</button>
        ) : q.mode === 'reverse' ? (
          <p className="text-4xl font-bold">{q.kana.romaji}</p>
        ) : (
          <p lang="ja" className="text-7xl">{q.kana.char}</p>
        )}
      </div>

      {q.mode === 'type' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (answered) next();
            else answer(isRomajiAnswer(typed, q.kana), typed);
          }}
          className="flex gap-2"
        >
          <input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={!!answered}
            aria-label={t('typeLabel')}
            autoCapitalize="none"
            autoComplete="off"
            className="min-h-12 flex-1 rounded-card border border-line bg-surface px-3 text-lg"
          />
          <button type="submit" className="min-h-12 rounded-card bg-brand px-4 text-brand-ink">{answered ? t('next') : t('check')}</button>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {q.options.map((o, i) => (
            <button key={o.char} type="button" disabled={!!answered} onClick={() => answer(o.char === q.kana.char, o.char)} className={optionClass(o)}>
              <span className="mr-1 text-xs text-muted">{i + 1}</span>
              {q.mode === 'choose' ? o.romaji : <span lang="ja">{o.char}</span>}
            </button>
          ))}
        </div>
      )}

      {answered && (
        <div role="status" className={`flex items-center justify-between rounded-card p-3 ${answered.ok ? 'bg-success/10' : 'bg-error/10'}`}>
          <span>
            {answered.ok ? '✓ ' + t('correct') : '✗ ' + t('wrong')} — <span lang="ja">{q.kana.char}</span> = {q.kana.romaji}
          </span>
          {q.mode !== 'type' && (
            <button type="button" autoFocus onClick={next} className="rounded-card bg-brand px-4 py-2 text-brand-ink">{t('next')}</button>
          )}
        </div>
      )}
    </div>
  );
}
