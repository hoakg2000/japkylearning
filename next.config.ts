import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isDev = process.env.NODE_ENV === 'development';

// One static CSP for every page (docs/adr/0013-static-csp-cache-components.md).
// shortcut: script-src allows 'unsafe-inline' (no nonce, PPR shell cannot carry one);
// upgrade if (app) routes ever render raw HTML or when SRI covers inline scripts.
const csp = (frameAncestors: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "media-src 'self' blob:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    // Only on HTTPS deployments; local `next start` runs on http://localhost.
    ...(process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://') ? ['upgrade-insecure-requests'] : []),
  ].join('; ');

const common = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy-Report-Only', value: "require-trusted-types-for 'script'" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // PGlite loads its WASM via import.meta.url; it must stay a plain Node dependency.
  serverExternalPackages: ['@electric-sql/pglite'],
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
  async headers() {
    return [
      {
        // Speaking practice is the only route allowed to use the microphone (F10); it gets its own rule below.
        source: '/((?!embed/|vi/speak/|en/speak/).*)',
        headers: [...common, { key: 'Content-Security-Policy', value: csp("'none'") }, { key: 'X-Frame-Options', value: 'DENY' }],
      },
      { source: '/embed/:path*', headers: [...common, { key: 'Content-Security-Policy', value: csp('*') }] },
      {
        source: '/:locale(vi|en)/speak/:path*',
        headers: [
          ...common.map((h) => (h.key === 'Permissions-Policy' ? { ...h, value: 'camera=(), microphone=(self), geolocation=()' } : h)),
          { key: 'Content-Security-Policy', value: csp("'none'") },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
