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

/** Daily spend cap in USD for all users together (docs/05 §Cost). Unset → 5; anything unreadable → 0, so paid calls stop (fail closed). */
export function dailyBudgetUsd(env: Record<string, string | undefined> = process.env): number {
  const raw = env.AI_DAILY_BUDGET_USD ?? '5';
  const n = Number(raw);
  return raw.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : 0;
}
