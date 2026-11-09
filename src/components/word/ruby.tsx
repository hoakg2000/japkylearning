import type { Segment } from '@/lib/content/schemas';

/** Japanese text with furigana from parsed segments (data only, no HTML strings). */
export function Ruby({ segments, className = '' }: { segments: Segment[]; className?: string }) {
  return (
    <span lang="ja" className={className}>
      {segments.map((s, i) =>
        s.reading ? (
          <ruby key={i}>
            {s.surface}
            <rp>(</rp>
            <rt>{s.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={i}>{s.surface}</span>
        ),
      )}
    </span>
  );
}
