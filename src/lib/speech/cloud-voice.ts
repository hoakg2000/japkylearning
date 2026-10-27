import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { ttsVoices } from '@/lib/db/schema';

/** Voices an admin enabled. Only these ids may be chosen by users (docs/05 §TTS, ADR 0011). */
export async function enabledVoices() {
  const db = await getDb();
  return db.select({ id: ttsVoices.id, label: ttsVoices.label }).from(ttsVoices).where(eq(ttsVoices.enabled, true));
}

/** Server-only lookup: the fish.audio reference id never leaves the server. */
export async function resolveVoice(id: string | null | undefined) {
  if (!id) return null;
  const db = await getDb();
  const [v] = await db.select().from(ttsVoices).where(eq(ttsVoices.id, id));
  return v && v.enabled ? v : null;
}

type FishVoice = { referenceId: string };

/**
 * fish.audio TTS (same endpoint and body as the secretary project). Returns the mp3 stream.
 * Throws CLOUD_VOICE_NOT_CONFIGURED when no key is set, so the caller can answer 503.
 */
export async function synthesize(text: string, voice: FishVoice, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const key = process.env.FISH_AUDIO_API_KEY;
  if (!key) throw new Error('CLOUD_VOICE_NOT_CONFIGURED');
  return fetchImpl('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', model: process.env.FISH_TTS_MODEL ?? 's2.1-pro' },
    body: JSON.stringify({ text, reference_id: voice.referenceId, format: 'mp3', latency: 'normal' }),
    signal: AbortSignal.timeout(60_000),
  });
}
