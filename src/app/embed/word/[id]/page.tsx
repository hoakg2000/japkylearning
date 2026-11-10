import { notFound } from 'next/navigation';
import { EmbedWord } from '@/components/embed-word';
import { allWords, getWord } from '@/lib/content/n5';

// Static and cookie-free so other sites can embed it (F12, ADR 0013 frame-ancestors * on /embed).
export function generateStaticParams() {
  return allWords.map((w) => ({ id: w.id }));
}

export default async function WordEmbed({ params }: { params: Promise<{ id: string }> }) {
  const w = getWord((await params).id);
  if (!w) notFound();
  return <EmbedWord word={w} />;
}
