'use client';

import { useState } from 'react';

/** Copyable <iframe> snippet for the kanji embed. The host is taken from the page origin at runtime. */
export function EmbedCode({ char }: { char: string }) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const code = `<iframe src="${origin}/embed/kanji/${encodeURIComponent(char)}" width="360" height="170" style="border:0" loading="lazy" title="Kanji ${char}"></iframe>`;
  return (
    <div className="space-y-2">
      <textarea readOnly value={code} rows={3} className="w-full rounded-card border border-line bg-surface p-2 font-mono text-xs" aria-label="embed code" />
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(code).catch(() => {});
          setCopied(true);
        }}
        className="min-h-10 rounded-card border border-line px-3 text-sm"
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
}
