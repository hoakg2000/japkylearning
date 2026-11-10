// Speech-to-text behind one interface (docs/05-AI-SPEECH.md §3). Beta: Web Speech in the browser.
// Azure Pronunciation Assessment and Whisper come later (backlog), each as one more SttProvider.
export type SttResult = { alternatives: string[]; confidence?: number };

export type SttErrorCode = 'unsupported' | 'no-speech' | 'not-allowed' | 'network' | 'aborted' | 'error';

export class SttError extends Error {
  constructor(readonly code: SttErrorCode) {
    super(code);
  }
}

export interface SttProvider {
  readonly id: string;
  /** Records one utterance after the user pressed the button; resolves with up to 5 transcripts. */
  listen(opts: { lang: 'ja-JP'; signal?: AbortSignal }): Promise<SttResult>;
}
