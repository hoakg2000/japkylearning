import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { words } from '@/lib/content/n5';
import { OpenAiCompatibleProvider, PRESETS } from './adapters/openai-compatible';
import { MockProvider } from './adapters/mock';
import { buildProvider, resolveChoice, envDefault, type AiSettings } from './registry-pure';
import { DAILY_LIMITS, dailyBudgetUsd, underLimit } from './limits';
import { QuizSchema, staticQuestions, validateQuiz, generateQuiz, type GeneratedQuiz } from './quiz-gen';
import { AiInvalidOutputError, AiUnavailableError, type AiProvider } from './types';

const sample = words.slice(0, 4);
const env = (o: Record<string, string | undefined>) => o as NodeJS.ProcessEnv;

describe('provider choice', () => {
  it('defaults to mock when nothing is configured', () => {
    expect(envDefault(env({}))).toEqual({ adapter: 'mock' });
    expect(resolveChoice({ modes: {}, killSwitch: false }, 'quiz-gen', env({}))).toEqual({ adapter: 'mock' });
  });

  it('per-mode settings win over env', () => {
    const settings: AiSettings = { killSwitch: false, modes: { 'quiz-gen': { adapter: 'openai-compatible', preset: 'openai' } } };
    expect(resolveChoice(settings, 'quiz-gen', env({ AI_PROVIDER: 'mock' }))).toEqual({ adapter: 'openai-compatible', preset: 'openai' });
    expect(resolveChoice(settings, 'tutor', env({ AI_PROVIDER: 'mock' }))).toEqual({ adapter: 'mock' });
  });

  it('an adapter without its key falls back to mock, never a network call', () => {
    const p = buildProvider({ adapter: 'openai-compatible', preset: 'openai' }, env({}));
    expect(p).toBeInstanceOf(MockProvider);
  });

  it('gateway is unavailable until it is configured', () => {
    expect(() => buildProvider({ adapter: 'gateway' }, env({}))).toThrow(AiUnavailableError);
  });
});

describe('quota', () => {
  it('stops at the daily limit per mode', () => {
    expect(underLimit(0, 'quiz-gen')).toBe(true);
    expect(underLimit(DAILY_LIMITS['quiz-gen'] - 1, 'quiz-gen')).toBe(true);
    expect(underLimit(DAILY_LIMITS['quiz-gen'], 'quiz-gen')).toBe(false);
    expect(DAILY_LIMITS['quiz-gen']).toBe(5);
    expect(DAILY_LIMITS.adaptive).toBe(1);
  });
});

describe('daily budget', () => {
  it('defaults to 5 USD and fails closed on unreadable values', () => {
    expect(dailyBudgetUsd({})).toBe(5);
    expect(dailyBudgetUsd({ AI_DAILY_BUDGET_USD: '12.5' })).toBe(12.5);
    for (const bad of ['', 'abc', '-1', 'Infinity']) expect(dailyBudgetUsd({ AI_DAILY_BUDGET_USD: bad })).toBe(0);
  });
});

describe('quiz output checks', () => {
  const good: GeneratedQuiz = {
    questions: sample.map((w) => ({
      wordId: w.id,
      prompt: `「${w.surface}」の意味は？`,
      options: [w.meanings.vi, 'sai 1', 'sai 2', 'sai 3'].map((x, j) => (j === 0 ? x : `${x}${j}`)),
      answerIndex: 0,
      explanation: 'giải thích',
    })),
  };

  it('accepts a valid quiz and keeps only words that were asked about', () => {
    const q = validateQuiz(good, sample);
    expect(q).toHaveLength(sample.length);
    expect(q.every((x) => x.source === 'ai')).toBe(true);
  });

  it('drops questions for unknown words and duplicate options', () => {
    const bad: GeneratedQuiz = {
      questions: [
        { ...good.questions[0], wordId: 'made-up-word' },
        { ...good.questions[1], options: ['a', 'a', 'b', 'c'] },
        good.questions[2],
      ],
    };
    const q = validateQuiz(bad, sample);
    expect(q.map((x) => x.wordId)).toEqual([sample[2].id]);
  });

  it('throws when nothing valid is left', () => {
    expect(() => validateQuiz({ questions: [{ ...good.questions[0], wordId: 'nope' }] }, sample)).toThrow(AiInvalidOutputError);
  });

  it('rejects malformed objects at the schema', () => {
    expect(QuizSchema.safeParse({ questions: [{ wordId: 'x', prompt: 'ab', options: ['a'], answerIndex: 9, explanation: '' }] }).success).toBe(false);
  });

  it('static fallback always has a correct answer among four options', () => {
    const q = staticQuestions(sample, words, 'vi', Math.random);
    for (const x of q) {
      expect(x.options).toHaveLength(4);
      expect(x.options[x.answerIndex]).toBe(sample.find((w) => w.id === x.wordId)!.meanings.vi);
    }
  });
});

describe('generateQuiz retry policy', () => {
  const schemaOk = good();
  function good(): GeneratedQuiz {
    return {
      questions: sample.map((w) => ({ wordId: w.id, prompt: 'これは何ですか', options: [w.meanings.vi, 'x1', 'x2', 'x3'], answerIndex: 0, explanation: 'e' })),
    };
  }
  const fake = (responses: (() => unknown)[]): AiProvider => {
    let i = 0;
    return {
      id: 'fake',
      model: 'm',
      generateText: async () => { throw new Error('unused'); },
      streamText: async function* () { throw new Error('unused'); },
      generateObject: async <T extends z.ZodType>(input: { schema: T }) => {
        const r = responses[Math.min(i++, responses.length - 1)]();
        if (r instanceof Error) throw r;
        return { value: input.schema.parse(r) as z.infer<T>, provider: 'fake', model: 'm', tokensIn: 1, tokensOut: 1, costUsd: 0 };
      },
    } as AiProvider;
  };

  it('retries once after invalid output, then succeeds', async () => {
    const p = fake([() => new AiInvalidOutputError('SCHEMA'), () => schemaOk]);
    const r = await generateQuiz(p, sample, 'vi');
    expect(r.questions.length).toBeGreaterThan(0);
  });

  it('does not retry when the provider is unavailable', async () => {
    let calls = 0;
    const p = fake([() => { calls++; return new AiUnavailableError('HTTP_500'); }]);
    await expect(generateQuiz(p, sample, 'vi')).rejects.toBeInstanceOf(AiUnavailableError);
    expect(calls).toBe(1);
  });
});

describe('openai-compatible adapter', () => {
  const keyEnv = env({ OPENAI_API_KEY: 'test-key' });
  const schema = z.object({ a: z.number() });
  const reply = (content: string, status = 200) =>
    (async () => new Response(JSON.stringify({ choices: [{ message: { content } }], usage: { prompt_tokens: 5, completion_tokens: 7 } }), { status })) as typeof fetch;

  it('sends the key as a bearer token to the preset URL and parses JSON', async () => {
    let seen: { url: string; auth: string | null } = { url: '', auth: null };
    const f = (async (url: string, init: RequestInit) => {
      seen = { url, auth: new Headers(init.headers).get('authorization') };
      return new Response(JSON.stringify({ choices: [{ message: { content: '{"a":1}' } }] }), { status: 200 });
    }) as typeof fetch;
    const p = new OpenAiCompatibleProvider('openai', undefined, f, keyEnv);
    const r = await p.generateObject({ mode: 'quiz-gen', messages: [], schema, name: 'x' });
    expect(r.value).toEqual({ a: 1 });
    expect(seen.url).toBe(`${PRESETS.openai.baseUrl}/chat/completions`);
    expect(seen.auth).toBe('Bearer test-key');
  });

  it('rejects non-JSON and schema-invalid replies', async () => {
    const p1 = new OpenAiCompatibleProvider('openai', undefined, reply('not json'), keyEnv);
    await expect(p1.generateObject({ mode: 'quiz-gen', messages: [], schema, name: 'x' })).rejects.toBeInstanceOf(AiInvalidOutputError);
    const p2 = new OpenAiCompatibleProvider('openai', undefined, reply('{"a":"x"}'), keyEnv);
    await expect(p2.generateObject({ mode: 'quiz-gen', messages: [], schema, name: 'x' })).rejects.toBeInstanceOf(AiInvalidOutputError);
  });

  it('maps HTTP errors to unavailable', async () => {
    const p = new OpenAiCompatibleProvider('openai', undefined, reply('{}', 429), keyEnv);
    await expect(p.generateText({ mode: 'tutor', messages: [] })).rejects.toBeInstanceOf(AiUnavailableError);
  });
});
