// F11 v1 songs: `npm run build:songs` (needs `npm run ingest:fetch` and `npm run ingest:n5` first).
// For each curated song (content/source/songs.ts): YouTube oEmbed must name the official channel, LRCLIB must have
// syncedLyrics; then rule-based furigana + keywords, AI keywords/translations when a real AI provider is configured
// (AI_PROVIDER/AI_PRESET env), written to content/songs/songs.json. Slugs in content/songs/removed.json are skipped.
// Network only here, never at runtime; requests are spaced out and carry a User-Agent (LRCLIB asks for one).
import { readFileSync, writeFileSync } from 'node:fs';
import { aiLyricsKeywords, aiLyricsTranslate } from '../src/lib/ai/lyrics';
import { buildProvider, envDefault } from '../src/lib/ai/registry-pure';
import { Song, Word } from '../src/lib/content/schemas';
import { parseLrc } from '../src/lib/songs/lrc';
import { songs } from '../content/source/songs';
import { loadFurigana, loadJmdict } from './ingest/datasets';
import { addEntry, inflections, segmentLine, type DictEntry } from './ingest/lyrics';

const UA = 'japky-ingest/1.0 (https://github.com/hoakg2000/japkylearning)';
const UNREAD_FLAG = 0.05;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson<T>(url: string): Promise<T | null> {
  await sleep(1200);
  const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20_000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

type LrcLib = { id: number; trackName: string; artistName: string; syncedLyrics: string | null };

/** Credit lines (作詞/作曲/編曲…) and lines carrying someone's translation (→) are not lyrics. */
const JUNK_LINE = /^(作[词詞曲]|[编編]曲|词|曲)\s*[:：]|→/;

async function lyricsFor(title: string, artist: string): Promise<LrcLib | null> {
  const q = new URLSearchParams({ track_name: title, artist_name: artist });
  const exact = await getJson<LrcLib>(`https://lrclib.net/api/get?${q}`);
  const found = (await getJson<LrcLib[]>(`https://lrclib.net/api/search?${q}`)) ?? [];
  // Community uploads vary: prefer the exact title with the fewest credit/translation lines.
  const score = (r: LrcLib) => (r.trackName === title ? 0 : 100) + parseLrc(r.syncedLyrics!).filter((l) => JUNK_LINE.test(l.text)).length;
  return [exact, ...found].filter((r): r is LrcLib => !!r?.syncedLyrics).sort((a, b) => score(a) - score(b))[0] ?? null;
}

/** Our words first (they have WordCards and SRS), then JMdict common, each with conjugation stems. */
function buildDictionary() {
  const dict = new Map<string, DictEntry>();
  const ours: Word[] = [...JSON.parse(readFileSync('content/levels/n5/words.json', 'utf8')), ...JSON.parse(readFileSync('content/packs/words.json', 'utf8'))];
  for (const w of ours) {
    const e = { surface: w.surface, segments: w.segments, wordId: w.id };
    addEntry(dict, e);
    for (const i of inflections(e, w.pos)) addEntry(dict, i);
  }
  const furigana = loadFurigana();
  for (const w of loadJmdict()) {
    const reading = w.kana[0]?.text;
    for (const k of w.kanji) {
      const parts = reading && furigana.get(`${k.text}|${reading}`);
      if (!parts) continue;
      const e = { surface: k.text, segments: parts.map((p) => (p.rt ? { surface: p.ruby, reading: p.rt } : { surface: p.ruby })) };
      addEntry(dict, e);
      for (const i of inflections(e, w.sense[0]?.partOfSpeech ?? [])) addEntry(dict, i);
    }
  }
  return { dict, wordIds: new Set(ours.map((w) => w.id)), bySurface: new Map(ours.map((w) => [w.surface, w.id])) };
}

async function main() {
  const removed: string[] = JSON.parse(readFileSync('content/songs/removed.json', 'utf8'));
  const { dict, bySurface } = buildDictionary();
  const provider = buildProvider(envDefault());
  const out: Song[] = [];
  const report: string[] = [];

  for (const s of songs) {
    if (removed.includes(s.slug)) {
      report.push(`${s.slug}\tSKIP removed`);
      continue;
    }
    try {
      const oembed = await getJson<{ author_name: string }>(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${s.youtubeId}`)}&format=json`);
      if (oembed?.author_name !== s.channel) {
        report.push(`${s.slug}\tFAIL channel "${oembed?.author_name ?? 'not found'}"`);
        continue;
      }
      const lrc = await lyricsFor(s.title, s.artist);
      if (!lrc?.syncedLyrics) {
        report.push(`${s.slug}\tFAIL no syncedLyrics on LRCLIB`);
        continue;
      }
      const parsed = parseLrc(lrc.syncedLyrics).filter((l) => !JUNK_LINE.test(l.text));
      let kanji = 0;
      let unread = 0;
      const ruleKeywords: Song['keywords'] = [];
      const lines = parsed.map((l, i) => {
        const r = segmentLine(l.text, dict);
        kanji += r.kanji;
        unread += r.unread;
        for (const tok of r.tokens) if (tok.entry.wordId) ruleKeywords.push({ line: i, start: tok.start, end: tok.end, wordId: tok.entry.wordId });
        return { t: l.t, text: l.text, segments: r.segments };
      });
      const texts = parsed.map((l) => l.text);
      const ai = provider.id === 'mock' ? null : await aiLyricsKeywords(provider, texts, 'N5–N4');
      const aiKeywords = ai?.flatMap((k) => {
        const wordId = bySurface.get(k.lemma) ?? bySurface.get(k.surface);
        return wordId ? [{ line: k.lineIndex, start: k.start, end: k.end, wordId }] : [];
      });
      const translations = provider.id === 'mock' ? null : await aiLyricsTranslate(provider, texts);
      const song = Song.parse({
        ...s,
        lrclibId: lrc.id,
        lines: lines.map((l, i) => (translations ? { ...l, translation: translations[i] } : l)),
        keywords: aiKeywords?.length ? aiKeywords : ruleKeywords,
        keywordSource: aiKeywords?.length ? 'ai' : 'rules',
        unreadKanji: kanji ? Math.round((unread / kanji) * 1000) / 1000 : 0,
      });
      out.push(song);
      report.push(`${s.slug}\tOK ${lines.length} lines, ${song.keywords.length} keywords, unread kanji ${(song.unreadKanji * 100).toFixed(1)}%${song.unreadKanji > UNREAD_FLAG ? ' FLAG' : ''}`);
    } catch (e) {
      report.push(`${s.slug}\tFAIL ${e instanceof Error ? e.message : e}`);
    }
  }

  writeFileSync('content/songs/songs.json', JSON.stringify(out, null, 1) + '\n');
  console.log(report.join('\n'));
  console.log(`\n${out.length}/${songs.length} songs built (target 20).${provider.id === 'mock' ? ' AI is the mock: rule-based keywords, no translations.' : ''}`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
