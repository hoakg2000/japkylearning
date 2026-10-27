import '../globals.css';

// Embed root layout: no app shell, no next-intl, no session. Embedded in other sites (ADR 0013: frame-ancestors *).
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="font-sans">
      <body className="m-0 min-h-dvh bg-bg p-3 text-ink">
        {children}
        <p className="mt-2 text-right text-[11px] text-muted">
          <a href="https://japky.example" target="_blank" rel="noopener noreferrer" className="underline">Japky</a>
        </p>
      </body>
    </html>
  );
}
