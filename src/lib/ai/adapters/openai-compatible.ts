import type { z } from 'zod';
import { AiInvalidOutputError, AiUnavailableError, type AiProvider, type AiResult, type AiUsage, type ObjectInput, type TextInput } from '../types';

/** Presets: only the base URL and env var name. Keys are read from env, never stored in the DB (ADR 0010). */
export const PRESETS = {
  openai: { baseUrl: 'https://api.openai.com/v1', keyEnv: 'OPENAI_API_KEY', model: 'gpt-4o-mini' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', keyEnv: 'GEMINI_API_KEY', model: 'gemini-2.5-flash' },
  claude: { baseUrl: 'https://api.anthropic.com/v1', keyEnv: 'ANTHROPIC_API_KEY', model: 'claude-haiku-5-5' },
  motapi: { baseUrl: 'https://motapis.com/v1', keyEnv: 'MOTAPI_API_KEY', model: 'default' },
  'github-models': { baseUrl: 'https://models.github.ai/inference', keyEnv: 'GITHUB_MODELS_TOKEN', model: 'openai/gpt-4o-mini' },
} as const;
export type Preset = keyof typeof PRESETS;

/**
 * USD per 1M tokens [input, output] for the preset models. Estimates, owner to confirm (backlog F29).
 * `AI_PRICE_IN_PER_M` / `AI_PRICE_OUT_PER_M` override them. A model without a price counts as
 * expensive (UNKNOWN_PRICE), never free, so the F13 daily budget still stops it (fail closed).
 */
export const PRICES: Record<string, readonly [number, number]> = {
  'gpt-4o-mini': [0.15, 0.6],
  'openai/gpt-4o-mini': [0.15, 0.6],
  'gemini-2.5-flash': [0.3, 2.5],
  'claude-haiku-5-5': [1, 5],
};
export const UNKNOWN_PRICE = [15, 75] as const;

const price = (v: string | undefined) => (v?.trim() && Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : undefined);

export function costUsd(model: string, tokensIn: number, tokensOut: number, env: NodeJS.ProcessEnv = process.env): number {
  const [pin, pout] = PRICES[model] ?? UNKNOWN_PRICE;
  return (tokensIn * (price(env.AI_PRICE_IN_PER_M) ?? pin) + tokensOut * (price(env.AI_PRICE_OUT_PER_M) ?? pout)) / 1e6;
}

/** Without usage from the provider, count upper bounds (1 token per char in, the full output budget) rather than 0. */
const charsOf = (messages: TextInput['messages']) => messages.reduce((n, m) => n + m.content.length, 0);

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
    const tokensIn = data.usage?.prompt_tokens ?? charsOf(messages);
    const tokensOut = data.usage?.completion_tokens ?? maxOutputTokens;
    return { value: content, provider: this.id, model: this.model, tokensIn, tokensOut, costUsd: costUsd(this.model, tokensIn, tokensOut, this.env) };
  }

  async *streamText(input: TextInput & { signal?: AbortSignal }): AsyncGenerator<string, AiUsage> {
    const res = await this.fetchImpl(`${PRESETS[this.preset].baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.key()}` },
      body: JSON.stringify({
        model: this.model,
        messages: input.messages,
        max_tokens: input.maxOutputTokens ?? 500,
        temperature: 0.4,
        stream: true,
        stream_options: { include_usage: true },
      }),
      signal: input.signal ? AbortSignal.any([input.signal, AbortSignal.timeout(60_000)]) : AbortSignal.timeout(60_000),
    });
    if (!res.ok || !res.body) throw new AiUnavailableError(`HTTP_${res.status}`);
    const usage: AiUsage = { tokensIn: charsOf(input.messages), tokensOut: input.maxOutputTokens ?? 500, costUsd: 0 };
    const priced = () => ({ ...usage, costUsd: costUsd(this.model, usage.tokensIn, usage.tokensOut, this.env) });
    let buffer = '';
    const decoder = new TextDecoder();
    for await (const bytes of res.body as unknown as AsyncIterable<Uint8Array>) {
      buffer += decoder.decode(bytes, { stream: true });
      const { events, rest } = splitSse(buffer);
      buffer = rest;
      for (const data of events) {
        if (data === '[DONE]') return priced();
        const chunk = parseChunk(data);
        if (chunk.usage) Object.assign(usage, chunk.usage);
        if (chunk.text) yield chunk.text;
      }
    }
    return priced();
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

/** Splits a Server-Sent Events buffer into complete `data:` payloads and the unfinished rest. */
export function splitSse(buffer: string): { events: string[]; rest: string } {
  const blocks = buffer.replace(/\r\n/g, '\n').split('\n\n');
  const rest = blocks.pop() ?? '';
  const events = blocks.flatMap((b) =>
    b
      .split('\n')
      .filter((l) => l.startsWith('data:'))
      .map((l) => l.slice(5).trim()),
  );
  return { events, rest };
}

type StreamChunk = { choices?: { delta?: { content?: string } }[]; usage?: { prompt_tokens: number; completion_tokens: number } };

/** Text delta and usage from one Chat Completions stream chunk; malformed chunks are ignored. */
export function parseChunk(data: string): { text?: string; usage?: Pick<AiUsage, 'tokensIn' | 'tokensOut'> } {
  try {
    const c = JSON.parse(data) as StreamChunk;
    return {
      text: c.choices?.[0]?.delta?.content || undefined,
      usage: c.usage ? { tokensIn: c.usage.prompt_tokens, tokensOut: c.usage.completion_tokens } : undefined,
    };
  } catch {
    return {};
  }
}
