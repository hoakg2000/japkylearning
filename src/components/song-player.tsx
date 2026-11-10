'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addWordsToReview, learnedWordIds } from '@/app/[locale]/songs/actions';
import { Ruby } from '@/components/word/ruby';
import { Link } from '@/i18n/navigation';
import type { Segment } from '@/lib/content/schemas';
import { lineAt } from '@/lib/songs/lrc';
import { hiddenAt, linePieces } from '@/lib/songs/pieces';

export type PlayerLine = { t: number; segments: Segment[]; translation?: { vi: string; en: string } };
export type PlayerKeyword = { line: number; start: number; end: number; wordId: string };
export type KeywordWord = { id: string; surface: string; reading: string; meaning: string; jlpt: string | null };

type YTPlayer = { getCurrentTime(): number; seekTo(s: number, allow: boolean): void; pauseVideo(): void; playVideo(): void; setPlaybackRate(r: number): void; getPlayerState(): number; destroy(): void };
type YTNamespace = { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer; PlayerState: { PLAYING: number } };
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Loads the IFrame API once, only after the learner presses play (P8 decision H5: no YouTube request before). */
function loadYouTube(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => reject(new Error('youtube'));
    document.head.append(s);
  });
}

const CLOZE = [0, 10, 25, 50, 100] as const;

export function SongPlayer({ youtubeId, title, lines, keywords, words, locale }: { youtubeId: string; title: string; lines: PlayerLine[]; keywords: PlayerKeyword[]; words: Record<string, KeywordWord>; locale: 'vi' | 'en' }) {
  const t = useTranslations('Songs');
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [offset, setOffset] = useState(0);
  const [rate, setRate] = useState(1);
  const [loop, setLoop] = useState<number | null>(null);
  const [cloze, setCloze] = useState<(typeof CLOZE)[number]>(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [furigana, setFurigana] = useState(true);
  const [translate, setTranslate] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState('');
  const pausedFor = useRef(-1);
  // Latest control values for the rAF loop, which must not restart on every change.
  const state = useRef({ offset, loop, cloze, revealed });
  useEffect(() => {
    state.current = { offset, loop, cloze, revealed };
  }, [offset, loop, cloze, revealed]);

  const byLine = useMemo(() => {
    const m = new Map<number, { k: PlayerKeyword; i: number }[]>();
    keywords.forEach((k, i) => m.set(k.line, [...(m.get(k.line) ?? []), { k, i }]));
    return m;
  }, [keywords]);
  const hasTranslation = lines.some((l) => l.translation);
  const wordIds = useMemo(() => [...new Set(keywords.map((k) => k.wordId))], [keywords]);

  useEffect(() => {
    learnedWordIds(wordIds).then((ids) => setLearned(new Set(ids)), () => undefined);
  }, [wordIds]);

  // Highlight loop: rAF while playing; binary search for the current line (F11).
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const tick = () => {
      const p = player.current;
      if (p && typeof p.getCurrentTime === 'function') {
        const { offset: off, loop: lp, cloze: cz, revealed: rv } = state.current;
        const time = p.getCurrentTime() + off;
        const idx = lineAt(lines, time);
        setCurrent((c) => (c === idx ? c : idx));
        const end = (i: number) => lines[i + 1]?.t ?? Infinity;
        if (lp !== null && time >= end(lp) - 0.05) p.seekTo(lines[lp].t - off, true);
        // Cloze: pause at the end of a line that still has hidden keywords.
        const blanks = idx >= 0 && (byLine.get(idx) ?? []).some(({ k, i }) => hiddenAt(cz, k.line, k.start) && !rv.has(i));
        if (cz > 0 && blanks && pausedFor.current !== idx && time >= end(idx) - 0.2) {
          pausedFor.current = idx;
          p.pauseVideo();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, lines, byLine]);

  useEffect(() => {
    document.getElementById(`lyric-${current}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current]);

  useEffect(() => () => player.current?.destroy(), []);

  async function start() {
    setStarted(true);
    try {
      const YT = await loadYouTube();
      player.current = new YT.Player(host.current!, {
        host: 'https://www.youtube-nocookie.com',
        videoId: youtubeId,
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0 },
        events: { onReady: (e: { target: YTPlayer }) => e.target.playVideo() },
      });
    } catch {
      setError(true);
    }
  }

  const seekLine = useCallback((i: number) => player.current?.seekTo(Math.max(0, lines[i].t - offset), true), [lines, offset]);

  async function add(ids: string[]) {
    try {
      const n = await addWordsToReview(ids, Intl.DateTimeFormat().resolvedOptions().timeZone);
      setLearned((s) => new Set([...s, ...ids]));
      setStatus(n ? t('added', { n }) : t('alreadyAdded'));
    } catch {
      setStatus(t('error'));
    }
  }

  const sel = selected ? words[selected] : null;
  const btn = 'min-h-10 rounded-card border border-line px-3 text-sm hover:border-brand aria-pressed:bg-surface-2';

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3 lg:sticky lg:top-16 lg:self-start">
        <div className="relative aspect-video w-full min-w-[200px] overflow-hidden rounded-card bg-surface-2">
          {!started ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
              <button type="button" onClick={start} className="min-h-12 rounded-card bg-brand px-6 font-medium text-brand-ink">
                ▶ {t('play', { title })}
              </button>
              <p className="max-w-sm text-xs text-muted">{t('youtubeNotice')}</p>
            </div>
          ) : (
            <div ref={host} className="absolute inset-0" />
          )}
        </div>
        {error && <p role="alert" className="text-sm text-error">{t('youtubeError')}</p>}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('controls')}>
          <button type="button" className={btn} onClick={() => setOffset((o) => Math.round((o - 0.25) * 100) / 100)} aria-label={t('earlier')}>−0.25s</button>
          <span className="self-center text-sm tabular-nums" aria-live="polite">{t('offset', { s: offset.toFixed(2) })}</span>
          <button type="button" className={btn} onClick={() => setOffset((o) => Math.round((o + 0.25) * 100) / 100)} aria-label={t('later')}>+0.25s</button>
          <button type="button" className={btn} aria-pressed={rate !== 1} disabled={!started} onClick={() => { const r = rate === 1 ? 0.75 : 1; setRate(r); player.current?.setPlaybackRate(r); }}>{t('slow')}</button>
          <button type="button" className={btn} aria-pressed={loop !== null} disabled={current < 0} onClick={() => setLoop((l) => (l === null ? current : null))}>{t('loop')}</button>
          <button type="button" className={btn} aria-pressed={furigana} onClick={() => setFurigana((f) => !f)}>{t('furigana')}</button>
          {hasTranslation && <button type="button" className={btn} aria-pressed={translate} onClick={() => setTranslate((v) => !v)}>{t('translation')}</button>}
          <label className="flex items-center gap-2 text-sm">
            {t('cloze')}
            <select value={cloze} onChange={(e) => { setCloze(Number(e.target.value) as typeof cloze); setRevealed(new Set()); }} className="min-h-10 rounded-card border border-line bg-surface px-2">
              {CLOZE.map((c) => <option key={c} value={c}>{c}%</option>)}
            </select>
          </label>
        </div>
        {sel && (
          <div className="space-y-2 rounded-card border border-brand bg-surface p-3" aria-live="polite">
            <p><span lang="ja" className="text-2xl">{sel.surface}</span> <span lang="ja" className="text-muted">{sel.reading}</span> {sel.jlpt && <span className="ml-1 rounded bg-success/15 px-1 text-xs uppercase">{sel.jlpt}</span>}</p>
            <p>{sel.meaning}</p>
            <div className="flex gap-2">
              <button type="button" className={btn} onClick={() => add([sel.id])}>{t('addOne')}</button>
              <Link href={`/words/${sel.id}`} className={`${btn} inline-flex items-center`}>{t('details')}</Link>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="min-h-10 rounded-card bg-brand px-3 text-sm font-medium text-brand-ink" onClick={() => add(wordIds)}>{t('addAll', { n: wordIds.length })}</button>
          <p role="status" className="text-sm">{status}</p>
        </div>
      </div>

      <ol className={`max-h-[70vh] space-y-1 overflow-y-auto rounded-card border border-line bg-surface p-2 ${furigana ? '' : '[&_rt]:hidden'}`} aria-label={t('lyrics')}>
        {lines.map((line, li) => (
          <li key={li} id={`lyric-${li}`} aria-current={li === current ? 'true' : undefined} className="rounded px-2 py-1 aria-[current=true]:bg-brand/10">
            <div className="flex items-start gap-2">
              <button type="button" onClick={() => seekLine(li)} className="mt-1 shrink-0 text-xs text-muted tabular-nums hover:text-brand" aria-label={t('seek')}>
                {Math.floor(line.t / 60)}:{String(Math.floor(line.t % 60)).padStart(2, '0')}
              </button>
              <p lang="ja" className="ruby-line text-lg leading-loose">
                {linePieces(line.segments, (byLine.get(li) ?? []).map(({ k }) => k)).map((p, pi) => {
                  if (p.keyword === undefined) return <Ruby key={pi} segments={p.segments} />;
                  const { k, i } = byLine.get(li)![p.keyword];
                  const hidden = hiddenAt(cloze, k.line, k.start) && !revealed.has(i);
                  const w = words[k.wordId];
                  return (
                    <button
                      key={pi}
                      type="button"
                      onClick={() => (hidden ? setRevealed((r) => new Set([...r, i])) : setSelected(k.wordId))}
                      className={`rounded px-0.5 underline decoration-2 underline-offset-4 ${w?.jlpt === 'n5' ? 'decoration-success' : 'decoration-info'} ${learned.has(k.wordId) ? 'opacity-60' : ''}`}
                      aria-label={hidden ? t('blank') : `${w?.surface ?? ''}: ${w?.meaning ?? ''}`}
                    >
                      {hidden ? '＿'.repeat(Math.max(2, p.segments.map((s) => s.surface).join('').length)) : <Ruby segments={p.segments} />}
                    </button>
                  );
                })}
              </p>
            </div>
            {translate && line.translation && <p className="pl-10 text-sm text-muted">{line.translation[locale]}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
