import { ImageResponse } from 'next/og';

// App icons for the PWA manifest, rendered once at build time (static params).
const SIZES = ['192', '512'] as const;

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  if (!SIZES.includes(size as (typeof SIZES)[number])) return new Response('Not found', { status: 404 });
  const px = Number(size);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b4cca' }}>
        <div style={{ width: '62%', height: '62%', borderRadius: '22%', background: '#e8483d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: px * 0.36, fontWeight: 700 }}>
          J
        </div>
      </div>
    ),
    { width: px, height: px },
  );
}
