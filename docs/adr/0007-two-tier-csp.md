# ADR 0007 – CSP 2 tầng

- **Trạng thái:** Superseded by [ADR 0013](./0013-static-csp-cache-components.md) (2026-10-26) – nonce không tương thích với Cache Components/PPR

## Bối cảnh
Docs Next.js: "To use a nonce, your page must be dynamically rendered." Áp nonce CSP cho mọi trang sẽ làm mất SSG/CDN cache của các trang SEO (kanji, từ, bài học).

## Quyết định
| Tầng | Route | CSP |
|------|-------|-----|
| Public tĩnh | `(public)/*` | Header tĩnh trong `next.config`: `script-src 'self' 'unsafe-inline'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'self'`, `frame-ancestors 'none'` |
| App động | `(app)/*` (home, review, tests, speak, chat, me, admin) | Nonce CSP từ `proxy.ts`, `'strict-dynamic'` |
| Embed | `embed/*` | CSP tĩnh + `frame-ancestors *` |

Điều kiện cho tầng public: không render nội dung người dùng hoặc AI; không đọc cookie/session; không `dangerouslySetInnerHTML` ngoài JSON-LD đã escape `<`. Dashboard chuyển từ `/[locale]` sang `/[locale]/home`.

## Hệ quả
- (+) Trang SEO giữ static; trang có nội dung AI/người dùng được bảo vệ chặt.
- (−) `'unsafe-inline'` trên trang public; chấp nhận được vì các trang đó không có nội dung không tin cậy.
