import { notFound } from 'next/navigation';
import { StrokeSvg } from '@/components/stroke-svg';
import { getKanji, kanjiList } from '@/lib/content/n5';
import { getStrokes } from '@/lib/content/strokes';

// Static and cookie-free so other sites can embed it (ADR 0013 frame-ancestors * on /embed).

export function generateStaticParams() {
  return kanjiList.map((k) => ({ char: k.char }));
}

export default async function KanjiEmbed({ params }: { params: Promise<{ char: string }> }) {
  const k = getKanji(decodeURIComponent((await params).char));
  if (!k) notFound();
  const strokes = await getStrokes(k.char);
  return (
    <figure className="flex items-center gap-4 rounded-card border border-line bg-surface p-3">
      {strokes ? <StrokeSvg strokes={strokes} size={120} label={`${k.char}`} /> : <span className="size-[120px]" />}
      <figcaption className="space-y-1">
        <p lang="ja" className="text-4xl">{k.char}</p>
        <p className="hanviet font-bold tracking-wide">{k.hanViet.join(' · ')}</p>
        <p className="text-sm">{k.meanings.vi}</p>
        <p className="text-xs text-muted" lang="ja">{k.on.join('、')} · {k.kun.join('、')}</p>
      </figcaption>
    </figure>
  );
}
