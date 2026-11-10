// Songs built by scripts/build-songs.ts (validated in scripts/validate-content.ts). Server-side only: the JSON is large.
import 'server-only';
import songsJson from '../../../content/songs/songs.json';
import type { Song } from './schemas';

export const songs = songsJson as Song[];
export const getSong = (slug: string) => songs.find((s) => s.slug === slug);

/** Above this share of kanji without furigana the page shows a note (P8 decision H2). */
export const UNREAD_FLAG = 0.05;
