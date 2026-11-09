# ADR 0013 – Cache Components + một CSP tĩnh + next-intl qua root-params

- **Trạng thái:** Accepted (2026-10-26). Thay [ADR 0007](./0007-two-tier-csp.md)
- **Nguồn:** group-discussion 2 vòng, đồng thuận 3/3 (biên bản cục bộ `docs/discussions/cache-components-csp-i18n/`, không commit)

## Bối cảnh
Next.js 16.4.3 scaffold bật sẵn `cacheComponents` (Partial Prerendering). Docs Next: PPR không tương thích với nonce CSP, và `cacheComponents` là cờ toàn cục, không tắt theo route được (R02). ADR 0007 (nonce cho route `(app)`) vì vậy không làm được nếu giữ PPR. next-intl 4.x hỗ trợ Cache Components qua `next/root-params` (R01); smoke test trong repo cho thấy next-intl + `Link` trong `use cache` chạy được, `/vi` `/en` static (R04).

## Quyết định
- **Giữ `cacheComponents: true`.**
- **Một CSP tĩnh** trong `next.config.ts` cho mọi trang: `script-src 'self' 'unsafe-inline'` (dev thêm `'unsafe-eval'`), `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'` (riêng `/embed/*` là `*`), `connect-src`/`img-src` chặt. Kèm comment `shortcut:` ghi điều kiện nâng cấp.
- **Bù cho việc không có nonce:** ESLint `react/no-danger` = error (ngoại lệ duy nhất: JSON-LD đã escape `<`); AI output không bao giờ render HTML; furigana markup parse thành React element.
- **next-intl 4.14.9** (pin), locale đọc từ `next/root-params` trong `src/i18n/request.ts`, root layout tại `app/[locale]/layout.tsx` có `generateStaticParams`. Route Handler / Server Action truyền locale tường minh.
- CI build kiểm tra `/vi`, `/en` vẫn static.

## Hệ quả
- (+) Trang public static + PPR cho trang app; ít code; không cần proxy ghép nonce.
- (−) `'unsafe-inline'` cho script là điểm yếu đã biết. Nâng cấp lên nonce/SRI nếu `(app)` phải render HTML thô, hoặc khi SRI hỗ trợ inline script.
