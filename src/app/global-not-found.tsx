import Link from 'next/link';
import './globals.css';

// Unmatched URLs outside /[locale] (e.g. /foo.txt). Bypasses layouts, so keep it self-contained.
export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body className="grid min-h-dvh place-items-center bg-bg text-ink">
        <main className="text-center">
          <h1 className="text-2xl font-bold">404</h1>
          <p className="mt-2">
            <Link href="/vi" className="text-brand underline">Trang chủ</Link> · <Link href="/en" className="text-brand underline">Home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
