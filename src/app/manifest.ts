import type { MetadataRoute } from 'next';

// PWA manifest (P7, decision G6). Icons are rendered at build time by src/app/pwa-icon/[size]/route.tsx.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Japky – Học tiếng Nhật mỗi ngày',
    short_name: 'Japky',
    description: 'Học tiếng Nhật từ bảng chữ cái tới JLPT N5.',
    start_url: '/vi/home',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b4cca',
    lang: 'vi',
    icons: [
      { src: '/pwa-icon/192', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
