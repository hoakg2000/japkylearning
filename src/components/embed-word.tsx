import { Ruby } from '@/components/word/ruby';
import type { Word } from '@/lib/content/schemas';

/** Compact word card for embeds (F12): both languages rendered, the embed script shows one. */
export function EmbedWord({ word, label }: { word: Pick<Word, 'segments' | 'romaji' | 'hanViet' | 'meanings' | 'examples'>; label?: string }) {
  const ex = word.examples[0];
  return (
    <figure className="space-y-2 rounded-card border border-line bg-surface p-3">
      {label && <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>}
      <Ruby segments={word.segments} className="ruby-line text-3xl" />
      <p className="text-xs text-muted">
        {word.romaji}
        {word.hanViet && <span className="l-vi hanviet"> · {word.hanViet}</span>}
      </p>
      <figcaption className="text-base">
        <span className="l-vi">{word.meanings.vi}</span>
        <span className="l-en">{word.meanings.en}</span>
      </figcaption>
      {ex && (
        <div className="border-t border-line pt-2 text-sm">
          <Ruby segments={ex.segments} />
          <p className="text-muted">
            <span className="l-vi">{ex.translation.vi}</span>
            <span className="l-en">{ex.translation.en}</span>
          </p>
        </div>
      )}
    </figure>
  );
}
