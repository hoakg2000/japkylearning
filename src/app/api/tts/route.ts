import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getWord } from '@/lib/content/n5';
import { resolveVoice, synthesize } from '@/lib/speech/cloud-voice';

// Only server-produced text is spoken: the client sends a content id, never free text (docs/08 §Security).
const Query = z.object({ word: z.string().regex(/^[a-z0-9-]{1,80}$/), voice: z.string().min(1).max(40) });

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.user.isAnonymous) return new Response('UNAUTHORIZED', { status: 401 });

  const parsed = Query.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) return new Response('BAD_REQUEST', { status: 400 });

  const word = getWord(parsed.data.word);
  if (!word) return new Response('NOT_FOUND', { status: 404 });

  const voice = await resolveVoice(parsed.data.voice);
  if (!voice) return new Response('VOICE_NOT_ALLOWED', { status: 403 });

  try {
    const upstream = await synthesize(word.reading, { referenceId: voice.referenceId });
    if (!upstream.ok || !upstream.body) return new Response('UPSTREAM', { status: 502 });
    return new Response(upstream.body, {
      headers: { 'content-type': 'audio/mpeg', 'cache-control': 'private, max-age=86400' },
    });
  } catch (e) {
    const notConfigured = e instanceof Error && e.message === 'CLOUD_VOICE_NOT_CONFIGURED';
    return new Response(notConfigured ? 'CLOUD_VOICE_NOT_CONFIGURED' : 'UPSTREAM', { status: notConfigured ? 503 : 502 });
  }
}
