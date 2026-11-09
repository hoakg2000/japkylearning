// Presentational stroke animation with no translations or hooks, so it also works in the embed (no next-intl there).
export function StrokeSvg({ strokes, size = 160, label }: { strokes: string[]; size?: number; label: string }) {
  return (
    <svg viewBox="0 0 109 109" width={size} height={size} role="img" aria-label={label} className="rounded-card border border-line bg-surface">
      <path d="M54.5 0v109M0 54.5h109" stroke="var(--line)" strokeDasharray="3 3" />
      {strokes.map((d, i) => (
        <path key={`bg${i}`} d={d} fill="none" stroke="var(--line)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {strokes.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-draw"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </svg>
  );
}
