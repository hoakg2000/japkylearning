'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { setConsent } from '@/app/[locale]/me/actions';
import { recordSpeaking, speakStatus, type SpeakStatus } from '@/app/[locale]/speak/actions';
import { Ruby } from '@/components/word/ruby';
import { Link } from '@/i18n/navigation';
import type { Segment } from '@/lib/content/schemas';
import { bestAlternative, type MoraOp } from '@/lib/japanese/mora';
import { MockSttProvider } from '@/lib/speech/stt/mock';
import { SttError, type SttProvider } from '@/lib/speech/stt/types';
import { WebSpeechProvider, webSpeechSupported } from '@/lib/speech/stt/webspeech';
import { speak } from '@/lib/speech/tts';

export type SpeakWord = { id: string; surface: string; reading: string; romaji: string; segments: Segment[]; meaning: string };
type Result = { kind: 'scored'; score: number; ops: MoraOp[]; heard: string } | { kind: 'unmapped'; heard: string } | { kind: 'error'; code: string } | { kind: 'self'; ok: boolean };

/** Test hook: `?stt=mock:<transcript>` replaces the recogniser outside production builds. */
function provider(): SttProvider | null {
  const mock = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_E2E === '1' ? new URLSearchParams(location.search).get('stt') : null;
  if (mock?.startsWith('mock:')) return new MockSttProvider([mock.slice(5)]);
  return webSpeechSupported() ? new WebSpeechProvider() : null;
}

function Mora({ ops }: { ops: MoraOp[] }) {
  const t = useTranslations('Speak');
  return (
    <p lang="ja" className="flex flex-wrap gap-1 text-lg" aria-label={t('moraLabel')}>
      {ops.map((o, i) =>
        o.op === 'ok' ? (
          <span key={i} className="rounded bg-success/15 px-1">{o.mora}</span>
        ) : o.op === 'ins' ? (
          <span key={i} className="rounded bg-warning/20 px-1 line-through" title={t('extra')}>{o.heard}</span>
        ) : (
          <span key={i} className="rounded bg-error/15 px-1 underline" title={o.op === 'sub' ? t('heardAs', { heard: o.heard }) : t('missing')}>
            {o.mora}
          </span>
        ),
      )}
    </p>
  );
}

function WordRow({ word, lessonId, status, onNeedConsent, stt }: { word: SpeakWord; lessonId: string; status: SpeakStatus | null; onNeedConsent: () => Promise<boolean>; stt: SttProvider | null }) {
  const t = useTranslations('Speak');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const abort = useRef<AbortController | null>(null);

  async function record() {
    if (!stt || busy) return;
    if (status === 'consent' && !(await onNeedConsent())) return;
    setBusy(true);
    setResult(null);
    abort.current = new AbortController();
    try {
      const { alternatives } = await stt.listen({ lang: 'ja-JP', signal: abort.current.signal });
      const best = bestAlternative(word.reading, alternatives, word);
      if (best.unmapped) return setResult({ kind: 'unmapped', heard: best.heard });
      setResult({ kind: 'scored', score: best.score, ops: best.ops, heard: best.transcript });
      recordSpeaking({ lessonId, wordId: word.id, score: best.score }).catch(() => undefined); // the score still shows if saving fails
    } catch (e) {
      setResult({ kind: 'error', code: e instanceof SttError ? e.code : 'error' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="space-y-2 rounded-card border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Ruby segments={word.segments} className="ruby-line text-2xl" />
          <p className="romaji text-xs text-muted">{word.romaji}</p>
          <p className="text-sm">{word.meaning}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => speak(word.reading)} className="min-h-11 rounded-card border border-line px-3 text-sm hover:border-brand">
            🔊 {t('listen')}
          </button>
          {stt && status && status !== 'signin' && status !== 'age' && (
            <button type="button" onClick={record} disabled={busy} className="min-h-11 rounded-card bg-brand px-3 text-sm font-medium text-brand-ink disabled:opacity-60">
              {busy ? t('listening') : `🎤 ${t('record')}`}
            </button>
          )}
          {!stt && (
            <>
              <button type="button" onClick={() => setResult({ kind: 'self', ok: true })} className="min-h-11 rounded-card border border-line px-3 text-sm">{t('selfOk')}</button>
              <button type="button" onClick={() => setResult({ kind: 'self', ok: false })} className="min-h-11 rounded-card border border-line px-3 text-sm">{t('selfRetry')}</button>
            </>
          )}
        </div>
      </div>
      <div aria-live="polite">
        {result?.kind === 'scored' && (
          <div className="space-y-1">
            <p className="font-medium">{t('score', { score: result.score })} {result.score >= 70 ? '🎉' : ''}</p>
            <Mora ops={result.ops} />
            <p className="text-xs text-muted">{t('heard', { heard: result.heard })}</p>
          </div>
        )}
        {result?.kind === 'unmapped' && <p className="text-sm">{t('unmapped', { heard: result.heard || '—' })}</p>}
        {result?.kind === 'error' && <p className="text-sm text-error">{t(`errors.${['no-speech', 'not-allowed', 'network'].includes(result.code) ? result.code : 'error'}`)}</p>}
        {result?.kind === 'self' && <p className="text-sm">{result.ok ? t('selfOkMsg') : t('selfRetryMsg')}</p>}
      </div>
    </li>
  );
}

export function SpeakPractice({ lessonId, words }: { lessonId: string; words: SpeakWord[] }) {
  const t = useTranslations('Speak');
  const [status, setStatus] = useState<SpeakStatus | null>(null);
  const [stt, setStt] = useState<SttProvider | null | undefined>(undefined);
  const [consentOpen, setConsentOpen] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  useEffect(() => {
    // Browser capability and session are only known on the client; the page itself stays static.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStt(provider());
    speakStatus().then(setStatus, () => setStatus('signin'));
  }, []);

  const askConsent = () =>
    new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setConsentOpen(true);
    });

  async function answer(ok: boolean) {
    setConsentOpen(false);
    if (ok) {
      try {
        await setConsent('speech_processing', true);
        setStatus('ok');
      } catch {
        ok = false;
      }
    }
    resolver.current?.(ok);
  }

  return (
    <div className="space-y-4">
      {stt === null && <p role="note" className="rounded-card border border-warning/60 bg-warning/10 px-3 py-2 text-sm">{t('unsupported')}</p>}
      {stt && status === 'signin' && (
        <p className="text-sm">
          {t('signIn')} <Link href="/sign-in" className="underline">{t('signInLink')}</Link>
        </p>
      )}
      {stt && status === 'age' && <p className="text-sm">{t('age')}</p>}
      {consentOpen && (
        <div role="dialog" aria-modal="false" aria-labelledby="speak-consent" className="space-y-3 rounded-card border border-brand bg-surface p-4">
          <h2 id="speak-consent" className="font-medium">{t('consentTitle')}</h2>
          <p className="text-sm">{t('consentText')}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => answer(true)} className="min-h-11 rounded-card bg-brand px-4 text-sm font-medium text-brand-ink">{t('consentAgree')}</button>
            <button type="button" onClick={() => answer(false)} className="min-h-11 rounded-card border border-line px-4 text-sm">{t('consentDecline')}</button>
          </div>
        </div>
      )}
      <ul className="space-y-3">
        {words.map((w) => (
          <WordRow key={w.id} word={w} lessonId={lessonId} status={status} onNeedConsent={askConsent} stt={stt ?? null} />
        ))}
      </ul>
    </div>
  );
}
