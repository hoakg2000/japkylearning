import '../globals.css';

// Embed root layout: no app shell, no next-intl, no session. Embedded in other sites (ADR 0013: frame-ancestors *).
// ?theme= and ?lang= are applied by /embed-boot.js before paint so the pages stay static (F12).

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="font-sans" suppressHydrationWarning>
      <head>
        {/* Applies theme and language before paint; a file, not inline, to fit the CSP (ADR 0013). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/embed-boot.js" />
      </head>
      <body className="m-0 bg-bg p-3 text-ink">
        {children}
        <p className="mt-2 text-right text-[11px] text-muted">
          <a href="https://japky.example" target="_blank" rel="noopener noreferrer" className="underline">Japky</a>
        </p>
      </body>
    </html>
  );
}
