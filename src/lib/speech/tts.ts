'use client';
// Default TTS: the device's ja-JP voice (docs/05-AI-SPEECH.md §2). Cloud voices come later behind /api/tts.

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function jaVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined && cachedVoice !== null) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  cachedVoice = voices.find((v) => v.lang === 'ja-JP') ?? voices.find((v) => v.lang.startsWith('ja')) ?? null;
  return cachedVoice;
}

export function canSpeakJapanese(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && jaVoice() !== null;
}

/** Speaks Japanese text; returns false when the device has no Japanese voice. */
export function speak(text: string, rate = 0.9): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const voice = jaVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = rate;
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return voice !== null || window.speechSynthesis.getVoices().length === 0;
}
