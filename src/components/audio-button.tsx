'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { speak } from '@/lib/speech/tts';

export function AudioButton({ text, audioUrl, className = '' }: { text: string; audioUrl?: string; className?: string }) {
  const t = useTranslations('Audio');
  const [noVoice, setNoVoice] = useState(false);

  const play = () => {
    if (audioUrl) {
      void new Audio(audioUrl).play();
      return;
    }
    setNoVoice(!speak(text));
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label={`${t('play')}: ${text}`}
      title={noVoice ? t('noVoice') : t('play')}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-line text-sm hover:bg-surface-2 ${className}`}
    >
      <span aria-hidden>{noVoice ? '🔈' : '🔊'}</span>
    </button>
  );
}
