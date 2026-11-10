// LRC parsing and line lookup for song lessons (F11). Pure, used at ingest and in the player.
export type LrcLine = { t: number; text: string };

const STAMP = /\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g;

/** Synced lyrics → lines sorted by time (seconds). Metadata tags ([ar:], [ti:]…) and empty lines are dropped; [offset:ms] is applied. */
export function parseLrc(lrc: string): LrcLine[] {
  const offset = Number(/\[offset:\s*([+-]?\d+)\]/i.exec(lrc)?.[1] ?? 0) / 1000;
  const out: LrcLine[] = [];
  for (const raw of lrc.split(/\r?\n/)) {
    const stamps = [...raw.matchAll(STAMP)];
    if (!stamps.length) continue;
    const text = raw.replace(STAMP, '').trim();
    if (!text) continue;
    for (const m of stamps) {
      const t = Number(m[1]) * 60 + Number(m[2].replace(':', '.')) - offset;
      out.push({ t: Math.max(0, Math.round(t * 1000) / 1000), text });
    }
  }
  return out.sort((a, b) => a.t - b.t);
}

/** Index of the line being sung at `time` (binary search), or -1 before the first line. */
export function lineAt(lines: { t: number }[], time: number): number {
  let lo = 0;
  let hi = lines.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lines[mid].t <= time) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}
