'use client';

import { useEffect, useState } from 'react';
import { EmbedWord } from '@/components/embed-word';
import { wordOfDayIndex } from '@/lib/word-of-day';

type W = Parameters<typeof EmbedWord>[0]['word'];

/** Shows the first word until hydration (no-JS fallback), then today's word in Vietnam time. */
export function WordOfDay({ words }: { words: W[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [date, setDate] = useState('');
  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date is only known in the browser
    setIndex(wordOfDayIndex(now, words.length));
    setDate(new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'medium' }).format(now));
  }, [words.length]);
  return (
    <div className="space-y-1">
      <EmbedWord word={words[index ?? 0]} label={date ? `日本語 · ${date}` : '日本語'} />
    </div>
  );
}
