import type { z } from 'zod';

// Modes from docs/05-AI-SPEECH.md §1. Each mode can point at its own adapter/model.
export const AI_MODES = ['quiz-gen', 'adaptive', 'tutor', 'grading', 'lyrics-keywords', 'lyrics-translate'] as const;
export type AiMode = (typeof AI_MODES)[number];

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type TextInput = { mode: AiMode; messages: ChatMessage[]; maxOutputTokens?: number };
export type ObjectInput<T extends z.ZodType> = { mode: AiMode; messages: ChatMessage[]; schema: T; name: string; maxOutputTokens?: number };

export type AiUsage = { tokensIn: number; tokensOut: number; costUsd: number };
export type AiResult<T> = { value: T; provider: string; model: string } & AiUsage;

/**
 * Provider-agnostic interface (ADR 0010). Feature code only talks to this.
 * `generateObject` validates against a zod schema; invalid output throws AiInvalidOutputError.
 */
export interface AiProvider {
  readonly id: string;
  readonly model: string;
  generateText(input: TextInput): Promise<AiResult<string>>;
  generateObject<T extends z.ZodType>(input: ObjectInput<T>): Promise<AiResult<z.infer<T>>>;
  /** Text chunks as they arrive; the generator's return value is the usage. Used by the chat tutor (F8). */
  streamText(input: TextInput & { signal?: AbortSignal }): AsyncGenerator<string, AiUsage>;
}

export class AiUnavailableError extends Error {
  constructor(message = 'AI_UNAVAILABLE') {
    super(message);
  }
}

export class AiInvalidOutputError extends Error {
  constructor(message = 'AI_INVALID_OUTPUT') {
    super(message);
  }
}
