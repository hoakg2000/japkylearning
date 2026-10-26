// FSRS wrapper (ADR 0005): maps ts-fsrs cards to the srs_cards columns and back.
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade } from 'ts-fsrs';

export { Rating };
export type CardRow = {
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: Date | null;
};

const scheduler = fsrs(generatorParameters({ request_retention: 0.9, enable_fuzz: true, maximum_interval: 3650 }));

const toCard = (r: CardRow): Card => ({
  due: r.due,
  stability: r.stability,
  difficulty: r.difficulty,
  elapsed_days: r.elapsedDays,
  scheduled_days: r.scheduledDays,
  learning_steps: r.learningSteps,
  reps: r.reps,
  lapses: r.lapses,
  state: r.state,
  last_review: r.lastReview ?? undefined,
});

const toRow = (c: Card): CardRow => ({
  due: c.due,
  stability: c.stability,
  difficulty: c.difficulty,
  elapsedDays: c.elapsed_days,
  scheduledDays: c.scheduled_days,
  learningSteps: c.learning_steps,
  reps: c.reps,
  lapses: c.lapses,
  state: c.state,
  lastReview: c.last_review ?? null,
});

/** A new card due now. */
export const newCard = (now = new Date()): CardRow => toRow(createEmptyCard(now));

/** Next state after a rating (1 Again, 2 Hard, 3 Good, 4 Easy). */
export function review(row: CardRow, rating: Grade, now = new Date()) {
  const { card, log } = scheduler.next(toCard(row), now, rating);
  return { row: toRow(card), state: log.state };
}

/** Probability of recall now (0–1); used by the adaptive plan to find weak items. */
export const retrievability = (row: CardRow, now = new Date()) => scheduler.get_retrievability(toCard(row), now, false);

/** A card counts as mature once its interval reaches 21 days (then other directions unlock, F5). */
export const isMature = (row: CardRow) => row.scheduledDays >= 21;
