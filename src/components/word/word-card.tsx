import { AudioButton } from '@/components/audio-button';
import { StrokeOrder } from '@/components/stroke-order';
import { Link } from '@/i18n/navigation';
import type { Word } from '@/lib/content/schemas';
import { Ruby } from './ruby';

export type Layout = 'inline' | 'row' | 'card' | 'flashcard';
export type Density = 'basic' | 'standard' | 'extended';
type Locale = 'vi' | 'en';

/**
 * One word component, 4 layouts × 3 densities (docs/02-FEATURES.md F13).
 * Density is a field mask: basic = word + furigana + meaning; standard adds romaji, Hán-Việt,
 * part of speech, audio, one example; extended adds all examples, stroke order and a link.
 * Romaji / Hán-Việt / furigana visibility also follows the user's display preferences (CSS).
 */
export function WordCard({
  word,
  locale,
  layout = 'card',
  density = 'standard',
  side = 'front',
  labels,
}: {
  word: Word;
  locale: Locale;
  layout?: Layout;
  density?: Density;
  /** flashcard only */
  side?: 'front' | 'back';
  labels?: { example: string; strokes: string; details: string; pos: Record<string, string> };
}) {
  const meaning = word.meanings[locale];
  const showStandard = density !== 'basic';
  const showExtended = density === 'extended';

  if (layout === 'inline') {
    return <Ruby segments={word.segments} className="ruby-line" />;
  }

  if (layout === 'row') {
    return (
      <div className="flex items-baseline gap-3 py-2">
        <Ruby segments={word.segments} className="ruby-line text-lg" />
        {showStandard && <span className="romaji text-sm text-muted">{word.romaji}</span>}
        <span className="text-sm">{meaning}</span>
      </div>
    );
  }

  const head = (
    <div className="flex items-start justify-between gap-3">
      <div>
        <Ruby segments={word.segments} className="ruby-line text-3xl font-medium" />
        {showStandard && (
          <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
            <span className="romaji">{word.romaji}</span>
            {word.hanViet && <span className="hanviet font-medium tracking-wide text-ink">{word.hanViet}</span>}
            {word.pos.length > 0 && <span>{word.pos.map((p) => labels?.pos[p] ?? p).join(', ')}</span>}
          </p>
        )}
      </div>
      {showStandard && <AudioButton text={word.reading} audioUrl={word.audioUrl} />}
    </div>
  );

  if (layout === 'flashcard' && side === 'front') {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-card border border-line bg-surface p-6 text-center">
        <Ruby segments={word.segments} className="ruby-line text-5xl" />
      </div>
    );
  }

  const examples = showExtended ? word.examples : word.examples.slice(0, 1);
  return (
    <article className="space-y-3 rounded-card border border-line bg-surface p-4">
      {head}
      <p className="text-lg">{meaning}</p>
      {showStandard &&
        examples.map((ex, i) => (
          <div key={i} className="rounded-[calc(var(--radius)-6px)] bg-surface-2 p-3 text-sm">
            {labels && i === 0 && <p className="mb-1 text-xs text-muted">{labels.example}</p>}
            <div className="flex items-start justify-between gap-2">
              <Ruby segments={ex.segments} className="ruby-line text-base" />
              <AudioButton text={ex.ja} audioUrl={ex.audioUrl} className="size-8 shrink-0" />
            </div>
            <p className="romaji text-xs text-muted">{ex.romaji}</p>
            <p>{ex.translation[locale]}</p>
          </div>
        ))}
      {showExtended && (
        <>
          <div className="flex flex-wrap gap-3" aria-label={labels?.strokes}>
            {[...new Set([...word.surface].filter((c) => /[一-鿿]/.test(c)))].map((c) => (
              <StrokeOrder key={c} char={c} size={96} />
            ))}
          </div>
          {labels?.details && (
            <Link href={`/words/${word.id}`} className="inline-block text-sm text-brand underline">
              {labels.details}
            </Link>
          )}
        </>
      )}
    </article>
  );
}
