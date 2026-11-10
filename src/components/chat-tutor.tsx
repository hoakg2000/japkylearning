'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { answerParts, MAX_CHARS, MAX_TURNS } from '@/lib/ai/answer';
import { loadThreads, newThread, saveThreads, type ChatStore, type ChatThread } from '@/lib/chat-history';

/** Assistant text with furigana markup rendered as ruby; plain text otherwise (no HTML from the model). */
function Answer({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap">
      {answerParts(text).map((p, i) =>
        'surface' in p ? (
          <ruby key={i} lang="ja">
            {p.surface}
            <rp>(</rp>
            <rt>{p.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </p>
  );
}

export function ChatTutor({ locale }: { locale: 'vi' | 'en' }) {
  const t = useTranslations('Chat');
  const [store, setStore] = useState<ChatStore>({ threads: [], currentId: null });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    // sessionStorage is client-only; read it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStore(loadThreads());
  }, []);

  const current = store.threads.find((th) => th.id === store.currentId) ?? null;

  const update = (fn: (s: ChatStore) => ChatStore) =>
    setStore((s) => {
      const next = fn(s);
      saveThreads(next);
      return next;
    });

  const setTurns = (id: string, fn: (th: ChatThread) => ChatThread) => update((s) => ({ ...s, threads: s.threads.map((th) => (th.id === id ? fn(th) : th)) }));

  async function send() {
    const question = input.trim();
    if (!question || busy) return;
    let thread = current;
    if (!thread) {
      thread = { ...newThread(), title: question.slice(0, 40) };
      const created = thread;
      update((s) => ({ threads: [created, ...s.threads], currentId: created.id }));
    }
    const id = thread.id;
    const turns = [...thread.turns, { role: 'user' as const, content: question }];
    setTurns(id, (th) => ({ ...th, title: th.title || question.slice(0, 40), turns: [...turns, { role: 'assistant', content: '' }] }));
    setInput('');
    setError(null);
    setBusy(true);
    abort.current = new AbortController();
    let answer = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // The server uses only the last MAX_TURNS and rejects long arrays, so a long thread must not send everything.
        body: JSON.stringify({ locale, messages: turns.slice(-MAX_TURNS) }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) {
        const { error: code } = (await res.json().catch(() => ({ error: 'ERROR' }))) as { error: string };
        throw new Error(code);
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() ?? '';
        for (const block of blocks) {
          const event = /^event: (.+)$/m.exec(block)?.[1];
          const data = JSON.parse(/^data: (.+)$/m.exec(block)?.[1] ?? '{}');
          if (event === 'meta') {
            setDemo(data.demo);
            setRemaining(data.remaining);
          } else if (event === 'delta') {
            answer += data.t;
            const text = answer;
            setTurns(id, (th) => ({ ...th, turns: [...turns, { role: 'assistant', content: text }] }));
          } else if (event === 'error') throw new Error(data.error);
        }
      }
    } catch (e) {
      const code = e instanceof Error ? e.message : 'ERROR';
      const aborted = code === 'AbortError' || e instanceof DOMException;
      if (!aborted) setError(code);
      // Stopped by the learner: keep the text already shown (the server counted it). Otherwise drop the unfinished answer.
      const kept = aborted && answer.trim() ? [...turns, { role: 'assistant' as const, content: answer }] : turns;
      setTurns(id, (th) => ({ ...th, turns: kept }));
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }

  const errorText = (code: string) => (['QUOTA', 'CONSENT', 'AGE', 'UNAUTHORIZED', 'AI_UNAVAILABLE', 'NOT_FOUND'].includes(code) ? t(`errors.${code}`) : t('errors.ERROR'));

  return (
    <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
      <aside aria-label={t('threads')} className="space-y-2">
        <button type="button" onClick={() => update((s) => ({ ...s, currentId: null }))} className="w-full rounded-card border border-line px-3 py-2 text-sm hover:border-brand">
          + {t('newThread')}
        </button>
        <ul className="space-y-1 text-sm">
          {store.threads.map((th) => (
            <li key={th.id} className="flex items-center gap-1">
              <button
                type="button"
                aria-current={th.id === store.currentId ? 'true' : undefined}
                onClick={() => update((s) => ({ ...s, currentId: th.id }))}
                className="flex-1 truncate rounded px-2 py-1 text-left hover:bg-surface-2 aria-[current=true]:bg-surface-2"
              >
                {th.title || t('untitled')}
              </button>
              <button
                type="button"
                aria-label={t('deleteThread')}
                onClick={() => update((s) => ({ threads: s.threads.filter((x) => x.id !== th.id), currentId: s.currentId === th.id ? null : s.currentId }))}
                className="px-2 text-muted hover:text-ink"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">{t('historyNote')}</p>
      </aside>

      <section className="space-y-3">
        {demo && (
          <p role="note" className="rounded-card border border-warning/60 bg-warning/10 px-3 py-2 text-sm">
            {t('demo')}
          </p>
        )}
        <ol aria-live="polite" className="space-y-3">
          {(current?.turns ?? []).map((m, i) => (
            <li key={i} className={`rounded-card border border-line p-3 ${m.role === 'user' ? 'ml-8 bg-surface-2' : 'mr-8 bg-surface'}`}>
              <span className="sr-only">{m.role === 'user' ? t('you') : t('tutor')}: </span>
              {m.role === 'assistant' ? <Answer text={m.content || '…'} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
            </li>
          ))}
        </ol>
        {!current?.turns.length && <p className="text-sm text-muted">{t('hint')}</p>}
        {error && <p role="alert" className="text-sm text-error">{errorText(error)}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <label className="sr-only" htmlFor="chat-input">{t('label')}</label>
          <textarea
            id="chat-input"
            value={input}
            maxLength={MAX_CHARS}
            rows={2}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="min-h-12 flex-1 rounded-card border border-line bg-surface px-3 py-2"
            placeholder={t('placeholder')}
          />
          {busy ? (
            <button type="button" onClick={() => abort.current?.abort()} className="min-h-12 rounded-card border border-line px-4">
              {t('stop')}
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="min-h-12 rounded-card bg-brand px-4 font-medium text-brand-ink disabled:opacity-60">
              {t('send')}
            </button>
          )}
        </form>
        {remaining !== null && <p className="text-xs text-muted">{t('remaining', { n: remaining })}</p>}
      </section>
    </div>
  );
}
