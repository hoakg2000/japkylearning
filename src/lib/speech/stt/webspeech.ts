// Web Speech API recogniser (Chrome/Edge/Safari). Chrome sends the audio to Google, so callers must show
// the notice and have the `speech_processing` consent first (F10). Nothing is recorded or stored by Japky.
import { SttError, type SttProvider, type SttResult } from './types';

type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function ctor(): (new () => Recognition) | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const webSpeechSupported = () => !!ctor();

const ERRORS: Record<string, SttError['code']> = { 'no-speech': 'no-speech', 'not-allowed': 'not-allowed', 'service-not-allowed': 'not-allowed', network: 'network', aborted: 'aborted', 'audio-capture': 'not-allowed' };

export class WebSpeechProvider implements SttProvider {
  readonly id = 'webspeech';

  listen({ lang, signal }: { lang: 'ja-JP'; signal?: AbortSignal }): Promise<SttResult> {
    const Ctor = ctor();
    if (!Ctor) return Promise.reject(new SttError('unsupported'));
    return new Promise((resolve, reject) => {
      const r = new Ctor();
      r.lang = lang;
      r.interimResults = false;
      r.continuous = false;
      r.maxAlternatives = 5;
      let done = false;
      r.onresult = (e) => {
        done = true;
        const first = e.results[0];
        const alternatives = Array.from(first ?? [], (a) => a.transcript).filter(Boolean);
        resolve({ alternatives, confidence: first?.[0]?.confidence });
      };
      r.onerror = (e) => {
        done = true;
        reject(new SttError(ERRORS[e.error] ?? 'error'));
      };
      r.onend = () => {
        if (!done) reject(new SttError('no-speech'));
      };
      signal?.addEventListener('abort', () => r.abort(), { once: true });
      r.start();
    });
  }
}
