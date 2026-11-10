import { WordOfDay } from '@/components/word-of-day';
import { words } from '@/lib/content/n5';

// Static page; the browser picks the word by the Vietnam date (P7 decision G4), so it flips at 00:00 with no cache.
export default function WordOfDayEmbed() {
  const list = words.map((w) => ({ segments: w.segments, romaji: w.romaji, hanViet: w.hanViet, meanings: w.meanings, examples: w.examples.slice(0, 1) }));
  return <WordOfDay words={list} />;
}
