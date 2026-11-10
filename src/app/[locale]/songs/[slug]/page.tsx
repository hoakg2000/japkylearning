import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { SongPlayer, type KeywordWord } from '@/components/song-player';
import { Link } from '@/i18n/navigation';
import { getWord } from '@/lib/content/n5';
import { getSong, songs, UNREAD_FLAG } from '@/lib/content/songs';
import { alternates } from '@/lib/seo';

export function generateStaticParams() {
  return songs.map((s) => ({ slug: s.slug }));
}

async function load(params: Promise<{ slug: string }>) {
  const song = getSong((await params).slug);
  if (!song) notFound();
  return song;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/songs/[slug]'>): Promise<Metadata> {
  const song = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Songs');
  return { title: `${song.title} – ${song.artist}`, description: t('pageDescription', { title: song.title, artist: song.artist }), alternates: alternates(`/songs/${song.slug}`, locale) };
}

/** F11 song lesson: static page; the YouTube player loads only after the learner presses play. */
export default async function SongPage({ params }: PageProps<'/[locale]/songs/[slug]'>) {
  const song = await load(params);
  const locale = (await rootLocale()) as 'vi' | 'en';
  const t = await getTranslations('Songs');
  const words: Record<string, KeywordWord> = {};
  for (const k of song.keywords) {
    const w = getWord(k.wordId);
    if (w && !words[w.id]) words[w.id] = { id: w.id, surface: w.surface, reading: w.reading, meaning: w.meanings[locale], jlpt: w.jlpt };
  }
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <article className="space-y-4">
      <header className="space-y-1">
        <p className="text-sm text-muted"><Link href="/songs" className="underline">{t('title')}</Link></p>
        <h1 className="text-2xl font-bold"><span lang="ja">{song.title}</span> <span className="text-base font-normal text-muted">– {song.artist}</span></h1>
        {song.unreadKanji > UNREAD_FLAG && <p role="note" className="text-xs text-muted">{t('furiganaGaps')}</p>}
        {!song.lines.some((l) => l.translation) && <p className="text-xs text-muted">{t('noTranslation')}</p>}
      </header>
      <SongPlayer
        youtubeId={song.youtubeId}
        title={song.title}
        lines={song.lines.map((l) => ({ t: l.t, segments: l.segments, translation: l.translation }))}
        keywords={song.keywords}
        words={words}
        locale={locale}
      />
      <footer className="space-y-1 border-t border-line pt-3 text-xs text-muted">
        <p>{t('credits', { channel: song.channel })} <a href={`https://lrclib.net/api/get/${song.lrclibId}`} className="underline" rel="noopener noreferrer" target="_blank">LRCLIB</a>.</p>
        <p>
          {t('takedown')}{' '}
          {contact ? (
            <a className="underline" href={`mailto:${contact}?subject=${encodeURIComponent(`Japky removal request: ${song.slug}`)}`}>{t('takedownLink')}</a>
          ) : (
            <span>{t('takedownPending')}</span>
          )}
        </p>
      </footer>
    </article>
  );
}
