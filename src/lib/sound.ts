'use client';
// Action sounds (docs/06-UI-UX.md §5) synthesized with Web Audio: no asset files to load.
// One pentatonic palette (C major pentatonic), soft envelopes, master volume 0.6.

export type SoundName = 'tap' | 'correct' | 'wrong' | 'flip' | 'complete' | 'streak';

const STORAGE_KEY = 'japky-sound';
let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // storage unavailable: keep default
  }
}

type Note = { f: number; at: number; dur: number; type?: OscillatorType; gain?: number };

const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, A3 = 220;

const palette: Record<SoundName, Note[]> = {
  tap: [{ f: 1200, at: 0, dur: 0.03, type: 'triangle', gain: 0.25 }],
  correct: [
    { f: E5, at: 0, dur: 0.12, type: 'sine' },
    { f: A5, at: 0.09, dur: 0.18, type: 'sine' },
  ],
  wrong: [{ f: A3, at: 0, dur: 0.22, type: 'sine', gain: 0.5 }],
  flip: [{ f: 2400, at: 0, dur: 0.05, type: 'triangle', gain: 0.12 }],
  complete: [
    { f: C5, at: 0, dur: 0.14 },
    { f: E5, at: 0.11, dur: 0.14 },
    { f: G5, at: 0.22, dur: 0.3 },
  ],
  streak: [
    { f: D5, at: 0, dur: 0.5, gain: 0.3 },
    { f: A5, at: 0.08, dur: 0.6, gain: 0.25 },
    { f: C6, at: 0.16, dur: 0.7, gain: 0.2 },
  ],
};

export function playSound(name: SoundName) {
  if (typeof window === 'undefined' || !isSoundEnabled()) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    for (const n of palette[name]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = n.type ?? 'sine';
      osc.frequency.value = n.f;
      const peak = 0.6 * (n.gain ?? 0.4);
      g.gain.setValueAtTime(0.0001, now + n.at);
      g.gain.exponentialRampToValueAtTime(peak, now + n.at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + n.at + n.dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + n.at);
      osc.stop(now + n.at + n.dur + 0.02);
    }
    if (name === 'correct' || name === 'wrong') navigator.vibrate?.(name === 'correct' ? 15 : [20, 40, 20]);
  } catch {
    // Audio is a nicety; never break the UI.
  }
}
