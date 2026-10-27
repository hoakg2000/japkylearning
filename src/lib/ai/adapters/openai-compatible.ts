import type { z } from 'zod';
import { AiInvalidOutputError, AiUnavailableError, type AiProvider, type AiResult, type ObjectInput, type TextInput } from '../types';

/** Presets: only the base URL and env var name. Keys are read from env, never stored in the DB (ADR 0010). */
export const PRESETS = {
  openai: { baseUrl: 'https://api.openai.com/v1', keyEnv: 'OPENAI_API_KEY', model: 'gpt-4o-mini' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', keyEnv: 'GEMINI_API_KEY', model: 'gemini-2.5-flash' },
  claude: { baseUrl: 'https://api.anthropic.com/v1', keyEnv: 'ANTHROPIC_API_KEY', model: 'claude-haiku-5-5' },
  motapi: { baseUrl: 'https://motapis.com/v1', keyEnv: 'MOTAPI_API_KEY', model: 'default' },
  'github-models': { baseUrl: 'https://models.github.ai/inference', keyEnv: 'GITHUB_MODELS_TOKEN', model: 'openai/gpt-4o-mini' },
} as const;
export type Preset = keyof typeof PRESETS;

type ChatResponse = { choices: { message: { content: string } }[]; usage?: { prompt_tokens: number; completion_tokens: number } };

/** Minimal OpenAI-compatible chat client (Chat Completions). No SDK: fewer dependencies. */
export class OpenAiCompatibleProvider implements AiProvider {
  readonly id: string;
  readonly model: string;

  constructor(
    private readonly preset: Preset,
    model?: string,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly env: NodeJS.ProcessEnv = process.env,
  ) {
    this.id = preset;
    this.model = model ?? PRESETS[preset].model;
  }

  private key(): string {
    const key = this.env[PRESETS[this.preset].keyEnv];
    if (!key) throw new AiUnavailableError(`MISSING_KEY:${PRESETS[this.preset].keyEnv}`);
    return key;
  }

  private async chat(messages: TextInput['messages'], maxOutputTokens: number, json: boolean): Promise<AiResult<string>> {
    const res = await this.fetchImpl(`${PRESETS[this.preset].baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.key()}` },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: maxOutputTokens,
        temperature: 0.4,
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new AiUnavailableError(`HTTP_${res.status}`);
    const data = (await res.json()) as ChatResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new AiInvalidOutputError('EMPTY');
    return {
      value: content,
      provider: this.id,
      model: this.model,
      tokensIn: data.usage?.prompt_tokens ?? 0,
      tokensOut: data.usage?.completion_tokens ?? 0,
      costUsd: 0, // filled from the price table by the registry
    };
  }

  generateText(input: TextInput): Promise<AiResult<string>> {
    return this.chat(input.messages, input.maxOutputTokens ?? 400, false);
  }

  async generateObject<T extends z.ZodType>(input: ObjectInput<T>): Promise<AiResult<z.infer<T>>> {
    const r = await this.chat(input.messages, input.maxOutputTokens ?? 800, true);
    let parsed: unknown;
    try {
      parsed = JSON.parse(r.value);
    } catch {
      throw new AiInvalidOutputError('NOT_JSON');
    }
    const checked = input.schema.safeParse(parsed);
    if (!checked.success) throw new AiInvalidOutputError('SCHEMA');
    return { ...r, value: checked.data };
  }
}
