// Multiple-choice helpers (ported from the Expo LearningScreen: 1 answer + distractors, shuffled).

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Options for one question: the answer plus up to `count - 1` distinct distractors. */
export function buildOptions<T>(answer: T, pool: readonly T[], count: number, key: (x: T) => string, rng: Rng = Math.random): T[] {
  const seen = new Set([key(answer)]);
  const distractors: T[] = [];
  for (const x of shuffle(pool, rng)) {
    if (distractors.length >= count - 1) break;
    const k = key(x);
    if (seen.has(k)) continue;
    seen.add(k);
    distractors.push(x);
  }
  return shuffle([answer, ...distractors], rng);
}

/** Next prompt, weighted towards items answered wrong more often. */
export function pickWeighted<T>(items: readonly T[], misses: (x: T) => number, rng: Rng = Math.random): T {
  const weights = items.map((x) => 1 + 2 * misses(x));
  let r = rng() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

/** Placement: passing the kana skip test (ratio of correct answers). */
export const SKIP_PASS_RATIO = 0.9;

/** Deterministic RNG (mulberry32), so a mock exam can be rebuilt after a page refresh. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
