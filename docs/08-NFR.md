# 08 – Yêu cầu phi chức năng

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. SEO

- Trang `(public)` render **SSG** từ `content/`, không đọc cookie/session → CDN cache được, HTML có `<ruby>`.
- `generateMetadata`: title, description theo locale, canonical, hreflang vi/en + `x-default`.
- `sitemap.ts` (chia theo loại, cả 2 locale), `robots.ts`.
- JSON-LD: `WebSite`, `Course`/`LearningResource`, `DefinedTerm`, `BreadcrumbList` – serialize có escape `<`.
- OG image on-demand (`next/og`), cache CDN.
- URL ổn định: `/vi/kanji/日`, `/en/words/jmdict-1358280`.
- Trang `(app)` và `/embed` đặt `noindex`.

## 2. Performance

| Chỉ số | Ngưỡng (p75 mobile) |
|--------|----------------------|
| LCP | < 2.5 s |
| INP | < 200 ms |
| CLS | < 0.1 |
| JS client trang public | < 150 KB gzip |

- Mặc định Server Components; chỉ phần tương tác là Client Components.
- `next/font` cho Noto Sans JP (subset).
- Audio, KanjiVG, thư viện nặng lazy-load.
- Không đưa kuromoji/dictionary vào runtime.
- Neon `ap-southeast-1` + Vercel `sin1`; chấp nhận cold start Neon ở beta, tắt scale-to-zero khi lên gói trả phí.
- Lighthouse CI bật chặn PR từ Phase 2 (khi đã có nội dung thật).

## 3. Security

- **CSP 2 tầng** ([ADR 0007](./adr/0007-two-tier-csp.md)):
  - `(public)`: CSP tĩnh trong `next.config`, `frame-ancestors 'none'`.
  - `(app)`: nonce CSP qua `proxy.ts`.
  - `/embed/*`: CSP tĩnh + `frame-ancestors *`.
- Header khác: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, `Permissions-Policy: camera=(), microphone=()` (route `/speak` mở `microphone=(self)`).
- **Auth & phân quyền:** `proxy.ts` chỉ kiểm cookie lạc quan để redirect. **Mọi Server Action / Route Handler tự kiểm session + quyền.** Admin: quyền cấp tay trong DB, bắt buộc 2FA, ghi `audit_log`.
- **Validate input** bằng zod ở mọi biên.
- **Secret** chỉ ở server (`import 'server-only'`), Vercel sensitive env. **Preview deploy không có key thật.**
- **Preview DB:** Neon branch tạo từ nhánh seed **không chứa dữ liệu người dùng thật**.
- **Chống lạm dụng chi phí:**
  - `/api/tts`: chỉ người dùng đăng nhập, voice trong allowlist, chỉ đọc text do server tạo, có quota.
  - AI: quota/user/ngày trong `ai_usage`, kill-switch theo ngân sách ngày, hạn mức trong console provider.
  - Anonymous user: tạo lười + Turnstile + giới hạn theo IP; không dùng AI/TTS/STT.
  - Vercel Firewall rate-limit cho `/api/*` và auth.
- **XSS:** không `dangerouslySetInnerHTML` với nội dung người dùng/AI; furigana AI parse bằng code app.
- **Embed:** không cookie, không thay đổi state, `postMessage` chỉ gửi chiều cao.
- **Supply chain:** kuroshiro chỉ là dev dependency chạy lúc ingest; Renovate, `npm audit` trong CI, khóa version.

## 4. Quyền riêng tư – PDPL (Luật 91/2025/QH15)

Luật Bảo vệ dữ liệu cá nhân, hiệu lực 01/01/2026, thay Nghị định 13/2023. Xem [ADR 0011](./adr/0011-pdpl-compliance.md). **Cần luật sư review trước launch công khai.**

- **Consent theo từng mục đích** (bảng `consents`): tài khoản, analytics, xử lý AI, xử lý giọng nói, email nhắc học. Không dùng ô tick sẵn; im lặng không phải là đồng ý; rút lại được bất cứ lúc nào.
- **Tuổi:** chỉ **16+** được tạo tài khoản và dùng AI/STT. Hỏi năm sinh khi đăng ký. Dưới 16 → chỉ học nội dung tĩnh dạng khách.
- **Chuyển dữ liệu ra nước ngoài:** hosting tại Singapore đã là chuyển dữ liệu xuyên biên giới → chuẩn bị **hồ sơ đánh giá tác động chuyển dữ liệu** theo luật.
- **Danh sách bên xử lý** (công bố trong privacy policy): Vercel, Neon, Cloudflare (R2, Turnstile), PostHog, Resend, Sentry, Google (Web Speech STT), LLM provider đang bật (OpenAI / Google / Anthropic / MotAPI / GitHub), fish.audio.
- **Tối thiểu hóa:** không gửi PII cho LLM; không gửi gì ngoài nội dung học cho MotAPI; không lưu audio giọng nói.
- **Quyền chủ thể dữ liệu:** xuất dữ liệu, xóa tài khoản trong `/me`.
- **Privacy policy** nêu rõ việc Web Speech gửi audio tới Google.

## 5. Testing & chất lượng

| Loại | Công cụ | Phạm vi |
|------|---------|---------|
| Unit | Vitest (+ fast-check) | FSRS wrapper, streak (property-based, DST), mora split/diff, furigana markup parser, adaptive scoring, AI registry + kill-switch, quota |
| Content | `validate-content.ts` | Schema, ví dụ bắt buộc, ≤ 18 từ/bài, tombstone, license + `rightsProof` bài hát |
| Component | Vitest + Testing Library | WordCard layout × density, QuizOption |
| E2E | Playwright | First-run quiz → onboarding → bài 1 → đăng ký giữ tiến độ; SRS; đổi locale/theme/mode; embed chạy trên domain khác, trang thường không nhúng được |
| A11y | `@axe-core/playwright` | Trang chính, 2 locale, Full + Minimal |
| Perf/SEO | Lighthouse CI | Budget §2 |

## 6. CI/CD & vận hành

- GitHub Actions: `lint` + `tsc --noEmit` → `validate-content` → `vitest` → `build` → `playwright` → `lhci`.
- Preview deploy mỗi PR (Vercel + Neon branch không PII, AI = mock).
- Migration Drizzle trong pipeline deploy, kiểu expand/contract.
- Sentry cho lỗi; backup Neon (point-in-time restore của gói trả phí).
- Vercel Cron: nhắc học, xóa anonymous user > 30 ngày, cập nhật JMdict hằng tháng.

## 7. Analytics

PostHog cookieless, tắt autocapture & session replay, chỉ gửi khi có consent `analytics`.

| Event | Thuộc tính chính |
|-------|------------------|
| `session_start` | locale, ui_mode, is_anonymous |
| `first_run_completed` | score, level_estimate |
| `onboarding_completed` | goal, sector, daily_goal |
| `signup_completed` | from_anonymous |
| `kana_completed` | script |
| `lesson_started` / `lesson_completed` | lesson_id, duration, score |
| `review_answered` | item_type, rating, elapsed_ms |
| `study_day_recorded` | streak, freeze_used |
| `test_finished` | kind, score, skill_scores |
| `ai_request` | mode, adapter, preset, tokens, cost_usd, outcome |
| `pronunciation_scored` | score |
| `song_played` / `song_gap_completed` | slug, accuracy |
| `embed_viewed` | type (server-side, không định danh) |

## 8. Chi phí ước tính (USD/tháng)

| Hạng mục | 1k MAU | 10k MAU | Điểm vọt chi phí |
|----------|--------|---------|------------------|
| Vercel | $20 (Pro) | $20–60 | Bot traffic, OG image |
| Neon | $0–19 | $40–120 | `review_logs` ~1 GB/tháng ở 10k MAU |
| Audio pre-generate | 1 lần < $20 | như cũ | Cloud TTS cho chat (không làm) |
| AI (model nhỏ, có quota) | $5–15 | $50–150 | Model lớn + quota cao |
| STT | $0 (Web Speech) | $0 (Azure ~$170 nếu bật) | Phút ghi âm |
| Resend / PostHog / Sentry | $0 | $0–90 | Số email, số event |
| **Tổng** | **~$45–90** | **~$200–450** | |

- Beta riêng tư có thể chạy free tier. **Trước launch công khai:** Vercel Pro, fish.audio commercial, Neon trả phí.
- Ngân sách AI mục tiêu: ≤ $0.10 / MAU / tháng.

## 9. Best practices code

- TypeScript `strict`, không `any` tùy tiện.
- Logic thuần tách khỏi UI để test.
- Mỗi feature tự chứa (components, actions, logic, tests).
- Conventional commits; PR nhỏ.
