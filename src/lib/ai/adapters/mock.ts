import type { z } from 'zod';
import { AiUnavailableError, type AiProvider, type AiResult, type ObjectInput, type TextInput } from '../types';

/**
 * Deterministic provider for dev, tests, CI and previews (ADR 0010, never calls the network).
 * `generateObject` returns a fixture that the caller's schema must accept; callers still validate.
 */
export class MockProvider implements AiProvider {
  readonly id = 'mock';
  readonly model = 'mock-1';

  async generateText(input: TextInput): Promise<AiResult<string>> {
    const last = input.messages.at(-1)?.content ?? '';
    return this.result(`[mock:${input.mode}] ${last.slice(0, 120)}`);
  }

  async generateObject<T extends z.ZodType>(input: ObjectInput<T>): Promise<AiResult<z.infer<T>>> {
    // Fixtures live in the caller (quiz-gen builds its own fallback); the mock only signals "no model".
    const fixture = mockFixtures[input.name];
    if (!fixture) throw new AiUnavailableError('MOCK');
    return this.result(fixture as z.infer<T>);
  }

  private result<V>(value: V): AiResult<V> {
    return { value, provider: this.id, model: this.model, tokensIn: 0, tokensOut: 0, costUsd: 0 };
  }
}

/** Fixtures keyed by the schema name. Kept small on purpose. */
const mockFixtures: Record<string, unknown> = {
  adaptive_comment: { comment: 'Hôm nay hãy ôn từ vựng đến hạn trước, rồi làm một bài ngắn.' },
};
