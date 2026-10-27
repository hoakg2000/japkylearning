import type { AiMode } from './types';

/** Daily request limits per user and mode (docs/05-AI-SPEECH.md §Quota). Pure, no DB. */
export const DAILY_LIMITS: Record<AiMode, number> = {
  'quiz-gen': 5,
  adaptive: 1,
  tutor: 20,
  grading: 20,
};

export function underLimit(used: number, mode: AiMode): boolean {
  return used < DAILY_LIMITS[mode];
}
