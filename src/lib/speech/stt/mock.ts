import type { SttProvider, SttResult } from './types';

/** Returns fixed transcripts; used by tests and when `?stt=mock` is set in development e2e runs. */
export class MockSttProvider implements SttProvider {
  readonly id = 'mock';
  constructor(private readonly alternatives: string[]) {}
  async listen(): Promise<SttResult> {
    return { alternatives: this.alternatives, confidence: 1 };
  }
}
