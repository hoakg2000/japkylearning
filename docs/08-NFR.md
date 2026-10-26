# 08 – Yêu cầu phi chức năng

## 1. SEO

- Trang nội dung (kana, kanji, từ, bài học, ngữ pháp, pack ngành) render **SSG/ISR** từ `content/` → HTML đầy đủ, có `<ruby>`.
- `generateMetadata` mỗi trang: title, description theo locale, canonical, `alternates.languages` (hreflang vi/en + `x-default`).
- `sitemap.ts` (chia theo loại, có cả 2 locale), `robots.ts`.
- JSON-LD: `WebSite` + `SearchAction`, `Course`/`LearningResource` cho bài học, `DefinedTerm` cho từ/kanji, `BreadcrumbList`.
- OG image động (`next/og`) cho kanji, từ, streak share card.
- URL đẹp, ổn định: `/vi/kanji/日`, `/en/words/jmdict-1358280`.
- Trang cần đăng nhập và `/embed` đặt `noindex`.

## 2. Performance

| Chỉ số | Ngưỡng (p75 mobile) |
|--------|----------------------|
| LCP | < 2.5 s |
| INP | < 200 ms |
| CLS | < 0.1 |
| JS client trang nội dung | < 150 KB gzip |

- Mặc định Server Components; chỉ phần tương tác là Client Components.
- `next/font` cho Noto Sans JP (subset), `next/image`.
- YouTube dùng facade (ảnh thumbnail, bấm mới tải iframe).
- Âm thanh, KanjiVG SVG, thư viện nặng lazy-load.
- Không đưa kuromoji/dictionary lên client.
- Lighthouse CI chặn PR nếu vượt budget.

## 3. Security

- **Headers** (qua `next.config` + `proxy.ts`): CSP có nonce, `frame-ancestors 'self'` (trừ `/embed/*` → `*`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, `Permissions-Policy: microphone=(self), camera=()`.
- **Auth & phân quyền:** `proxy.ts` chỉ để redirect; **mọi Server Action và Route Handler tự kiểm tra session + quyền** (Server Action là endpoint POST công khai). Admin kiểm tra `role`.
- **Validate input** bằng zod ở mọi biên (form, API, guest merge, content).
- **Secret** chỉ ở server (`import 'server-only'`), không prefix `NEXT_PUBLIC_`.
- **Rate limit** (Upstash) cho `/api/ai`, `/api/tts`, `/api/stt`, `/api/japanese/analyze`, auth.
- **XSS:** không dùng `dangerouslySetInnerHTML` cho nội dung người dùng/AI; markdown từ AI sanitize.
- **SSRF:** oEmbed và mọi fetch URL ngoài dùng allowlist host.
- **iframe ngoài:** `sandbox`, allowlist domain trong CSP `frame-src`.
- **Dependencies:** Renovate, `npm audit` trong CI, khóa version.
- **Dữ liệu cá nhân:** tối thiểu hóa; cho phép export và xóa tài khoản; không gửi PII thừa cho LLM.

## 4. Testing & chất lượng

| Loại | Công cụ | Phạm vi |
|------|---------|---------|
| Unit | Vitest | FSRS wrapper, tính streak + timezone/DST, mora split/diff, căn furigana, adaptive scoring, AI registry, guest merge |
| Content | `validate-content.ts` | Schema, ví dụ bắt buộc, license bài hát, link id hợp lệ |
| Component | Vitest + Testing Library | WordCard variants, quiz option |
| E2E | Playwright | Flow: học kana → quiz → check-in streak; bài học → SRS; đổi locale/theme/mode; embed widget |
| A11y | `@axe-core/playwright` | Trang chính, cả 2 locale |
| Perf/SEO | Lighthouse CI | Budget ở §2 |

## 5. CI/CD

- GitHub Actions: `lint` (ESLint + `tsc --noEmit`) → `validate-content` → `vitest` → `build` → `playwright` → `lhci`.
- Preview deploy mỗi PR (Vercel + Neon branch DB).
- Migration Drizzle chạy trong pipeline deploy, kiểu expand/contract.
- Monitoring: log lỗi (Sentry hoặc tương đương), theo dõi chi phí AI/TTS ở admin.

## 6. Best practices code

- TypeScript `strict`, không `any` tùy tiện.
- Logic thuần tách khỏi UI để test.
- Mỗi feature tự chứa (components, actions, logic, tests).
- Conventional commits; PR nhỏ.
