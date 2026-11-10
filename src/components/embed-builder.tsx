'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { myStreakEmbedId } from '@/app/[locale]/embed-code/actions';

type Kind = 'kanji' | 'word' | 'word-of-the-day' | 'streak';
const SIZE: Record<Kind, [number, number]> = { kanji: [360, 170], word: [360, 230], 'word-of-the-day': [360, 250], streak: [360, 120] };

/** "Get embed code" (F12, P7 decision G7): widget, theme and language → one <iframe> snippet. */
export function EmbedBuilder({ firstWordId }: { firstWordId: string }) {
  const t = useTranslations('EmbedCode');
  const [kind, setKind] = useState<Kind>('word-of-the-day');
  const [kanji, setKanji] = useState('学');
  const [wordId, setWordId] = useState(firstWordId);
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [streakId, setStreakId] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- origin is only known in the browser
    setOrigin(window.location.origin);
    myStreakEmbedId().then(setStreakId, () => setStreakId(null));
  }, []);

  const path = kind === 'kanji' ? `kanji/${encodeURIComponent(kanji)}` : kind === 'word' ? `word/${encodeURIComponent(wordId)}` : kind === 'streak' ? `streak/${streakId}` : 'word-of-the-day';
  const query = new URLSearchParams({ ...(lang === 'en' ? { lang } : {}), ...(theme !== 'auto' ? { theme } : {}) }).toString();
  const src = `${origin}/embed/${path}${query ? `?${query}` : ''}`;
  const [w, h] = SIZE[kind];
  const code = `<iframe src="${src}" width="${w}" height="${h}" style="border:0" loading="lazy" title="Japky"></iframe>`;
  const field = 'min-h-10 rounded-card border border-line bg-surface px-2';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col gap-1 text-sm">
          {t('widget')}
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)} className={field}>
            <option value="word-of-the-day">{t('wordOfDay')}</option>
            <option value="word">{t('word')}</option>
            <option value="kanji">{t('kanji')}</option>
            {streakId && <option value="streak">{t('streak')}</option>}
          </select>
        </label>
        {kind === 'kanji' && (
          <label className="flex flex-col gap-1 text-sm">
            {t('kanjiChar')}
            <input value={kanji} maxLength={1} onChange={(e) => setKanji(e.target.value)} lang="ja" className={field} />
          </label>
        )}
        {kind === 'word' && (
          <label className="flex flex-col gap-1 text-sm">
            {t('wordId')}
            <input value={wordId} onChange={(e) => setWordId(e.target.value.trim())} className={field} />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          {t('theme')}
          <select value={theme} onChange={(e) => setTheme(e.target.value as typeof theme)} className={field}>
            <option value="auto">{t('themeAuto')}</option>
            <option value="light">{t('themeLight')}</option>
            <option value="dark">{t('themeDark')}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t('language')}
          <select value={lang} onChange={(e) => setLang(e.target.value as typeof lang)} className={field}>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </label>
        {!streakId && <p className="text-xs text-muted">{t('streakHint')}</p>}
      </form>
      <div className="space-y-3">
        {origin && <iframe key={src} src={src} width={w} height={h} style={{ border: 0, maxWidth: '100%' }} title={t('preview')} />}
        <textarea readOnly value={code} rows={4} aria-label={t('code')} className="w-full rounded-card border border-line bg-surface p-2 font-mono text-xs" />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(code).catch(() => {});
            setCopied(true);
          }}
          className="min-h-10 rounded-card bg-brand px-4 text-sm font-medium text-brand-ink"
        >
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
    </div>
  );
}
