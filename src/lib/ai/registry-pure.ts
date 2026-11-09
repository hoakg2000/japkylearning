import { PRESETS, OpenAiCompatibleProvider, type Preset } from './adapters/openai-compatible';
import { MockProvider } from './adapters/mock';
import { AiUnavailableError, type AiMode, type AiProvider } from './types';

/** Per-mode choice stored in app_settings (key `ai`). Adapter and model names only, never URLs or keys. */
export type ModeChoice = { adapter: 'mock' | 'openai-compatible' | 'gateway'; preset?: Preset; model?: string };
export type AiSettings = {
  modes: Partial<Record<AiMode, ModeChoice>>;
  killSwitch: boolean;
};

/** Env defaults: `AI_PROVIDER`, `AI_PRESET`, `AI_MODEL`. Anything unknown means mock. */
export function envDefault(env: NodeJS.ProcessEnv = process.env): ModeChoice {
  const adapter = (env.AI_PROVIDER ?? 'mock') as ModeChoice['adapter'];
  if (adapter === 'openai-compatible' && env.AI_PRESET && env.AI_PRESET in PRESETS) {
    return { adapter, preset: env.AI_PRESET as Preset, model: env.AI_MODEL };
  }
  return { adapter: 'mock' };
}

/** Which choice applies to a mode: its own setting, else the env default. */
export function resolveChoice(settings: AiSettings, mode: AiMode, env: NodeJS.ProcessEnv = process.env): ModeChoice {
  return settings.modes[mode] ?? envDefault(env);
}

/**
 * Provider for a choice. An adapter whose key is missing becomes mock: no silent network call
 * and no error for the learner. A gateway that is not configured is unavailable.
 */
export function buildProvider(choice: ModeChoice, env: NodeJS.ProcessEnv = process.env, fetchImpl?: typeof fetch): AiProvider {
  if (choice.adapter === 'openai-compatible' && choice.preset && env[PRESETS[choice.preset].keyEnv]) {
    return new OpenAiCompatibleProvider(choice.preset, choice.model, fetchImpl, env);
  }
  if (choice.adapter === 'gateway') throw new AiUnavailableError('GATEWAY_NOT_CONFIGURED');
  return new MockProvider();
}
