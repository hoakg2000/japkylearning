# 03 – Kiến trúc

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. Tech stack

Version theo research ngày 2026-10-26. Mục **[verify]** phải chạy `npm view <pkg> version` ở Phase 0 trước khi pin.

| Lớp | Lựa chọn | Ghi chú |
|-----|----------|---------|
| Framework | **Next.js 16** App Router, RSC, TypeScript `strict` | `proxy.ts` thay `middleware.ts` |
| i18n | **next-intl v4** | `/vi`, `/en`, localized pathnames, hreflang, `setRequestLocale` ở mọi layout/page để giữ static |
| UI | **Tailwind CSS v4**, **shadcn/ui** (Radix), `lucide-react` | Design tokens qua CSS variables |
| Animation | CSS + View Transitions trên trang public; `motion` **[verify]** chỉ ở trang tương tác | Tôn trọng `prefers-reduced-motion` |
| Theme | `next-themes` (light/dark) + attribute `data-ui` (full/minimal) đặt bằng script trước paint | Không đọc cookie ở server |
| Âm thanh | Web Audio + 1 sprite | [06 §5](./06-UI-UX.md#5-âm-thanh-action) |
| DB | **Postgres (Neon, `ap-southeast-1`)** + **Drizzle ORM** **[verify]** | WebSocket `Pool` cho transaction, `neon-http` cho đọc đơn |
| Hosting | **Vercel**, function region `sin1` | Hobby khi beta riêng tư; **Pro trước launch công khai** (Hobby không cho thương mại) |
| Auth | **Better Auth** + anonymous plugin + 2FA cho admin | [ADR 0009](./adr/0009-anonymous-guest-users.md) |
| Rate limit / quota | Bảng `ai_usage` trong Postgres + rate limit sẵn có của Better Auth + Vercel Firewall | Upstash chỉ thêm khi mở AI/TTS công khai |
| Email | Resend | Xác thực email, nhắc học (opt-in) |
| Cron | Vercel Cron | Nhắc học, xóa anonymous user cũ, cập nhật JMdict hằng tháng |
| Analytics | PostHog (cookieless, tắt autocapture & session replay) | [08 §7](./08-NFR.md#7-analytics) |
| Error tracking | Sentry | |
| Bot protection | Cloudflare Turnstile | Khi tạo anonymous user, đăng ký |
| Object storage | Cloudflare R2 (custom domain) | Audio pre-generate, URL bất biến theo hash |
| Validation | **Zod** | Mọi biên |
| SRS | **ts-fsrs 5.x** | |
| Tiếng Nhật | JMdict + **JmdictFurigana** (readings), markup furigana viết tay cho câu (`src/lib/japanese/markup.ts`), `wanakana` (romaji, gõ kana) | [ADR 0003](./adr/0003-precompute-furigana-romaji.md) |
| Stroke order | **KanjiVG** SVG, animate `stroke-dashoffset` | |
| AI | `AiProvider`: `mock` + `openai-compatible` + `gateway` | [ADR 0010](./adr/0010-ai-provider-strategy.md) |
| Bài hát | **LRCLIB** API (lyrics + timeline), **YouTube IFrame Player API** (phát), YouTube Data API v3 (metadata, v2) | [ADR 0012](./adr/0012-song-source-and-engine.md) |
| Song engine (v2) | Python worker: Demucs, stable-ts / WhisperX, Whisper large-v3 / kotoba-whisper **[verify]** | GPU, tách khỏi Vercel |
| Test | Vitest, Playwright + `@axe-core/playwright`, Lighthouse CI | |

## 2. Cấu trúc thư mục

```
.
├─ content/                         # Nguồn nội dung DUY NHẤT (JSON/MDX), validate zod khi build
│  ├─ kana/                         # hiragana.json, katakana.json (seed từ letter.json cũ)
│  ├─ levels/n5/
│  │  ├─ lessons/01-greetings.json
│  │  ├─ vocab.json  kanji.json  grammar/*.mdx
│  ├─ packs/<sector>.json           # kaigo, food-service, it…
│  ├─ songs/<slug>.json             # v1: youtubeId + lyrics từ LRCLIB + keywords (sinh lúc ingest)
│  └─ tombstones.json               # id đã xóa có chủ đích
├─ scripts/ingest/                  # JMdict, JmdictFurigana, KANJIDIC2, KanjiVG, Unihan Hán-Việt, audio, songs (LRCLIB + AI keywords)
├─ services/song-engine/            # v2: worker Python (GPU) – tách vocal, ASR, forced alignment
├─ public/                          # sounds/, kanjivg/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ (public)/               # landing, kana, learn, kanji, words, packs, songs, about – SSG, KHÔNG đọc cookie/session
│  │  │  └─ (app)/                  # home (Today), review, tests, speak, chat, me, admin – PPR + dynamic data
│  │  ├─ embed/                     # root layout riêng, không app shell, không next-intl proxy
│  │  │  └─ kanji/[char]/
│  │  └─ api/
│  │     ├─ tts/  stt/  ai/  auth/[...all]/  cron/
│  ├─ features/                     # kana, kanji, lessons, srs, streak, tests, ai, speech, songs, embed, settings, onboarding
│  ├─ components/
│  │  ├─ ui/                        # shadcn
│  │  └─ word/                      # WordCard (layout × density), Ruby, AudioButton
│  ├─ lib/
│  │  ├─ db/  auth/  i18n/
│  │  ├─ ai/                        # AiProvider, registry, adapters/
│  │  ├─ speech/                    # TtsProvider, SttProvider
│  │  ├─ japanese/                  # mora split/diff, normalize, furigana markup parser
│  │  ├─ streak/                    # pure function tính streak
│  │  └─ content/                   # loader + zod schemas
│  ├─ messages/{vi,en}.json
│  └─ proxy.ts                      # next-intl locale routing + kiểm tra cookie lạc quan cho (app)
└─ docs/
```

**Quy tắc ranh giới module**
- `features/*` chỉ import `lib/*`, `components/*` và chính nó.
- Logic thuần (FSRS wrapper, streak, mora diff, adaptive scoring) không phụ thuộc React → test bằng Vitest.
- Code dùng secret có `import 'server-only'`.
- Trang trong `(public)` **không** gọi `cookies()`, `headers()` hay session. Dữ liệu cá nhân trên trang public (nếu có) lấy bằng client island.

## 3. Data flow

```
content/*.json ──(build: zod + tombstone check)──► (public) pages SSG ──► HTML có <ruby> (SEO, CDN cache, CSP tĩnh)
                                                                   │
Người dùng / anonymous user ──► Server Action (mutation) / Route Handler (stream) ──(session + zod + quota)──► Drizzle ──► Neon
                                         │
                                         ├─► AiProvider (mock | openai-compatible | gateway)
                                         ├─► TtsProvider fish (allowlist, text do server tạo) ──► R2 cache
                                         └─► mora scoring (STT chạy trên trình duyệt)
Audio nội dung: ingest ──► fish.audio ──► R2 (URL bất biến, ghi vào content JSON)
Bài hát v1:   ingest ──► LRCLIB (syncedLyrics) ──► kuroshiro + AI lyrics-keywords ──► content/songs/*.json ──► trang SSG + YouTube IFrame
Bài hát v2:   người dùng dán URL ──► song_jobs ──► YouTube Data API ──► LRCLIB ──(không có)──► song-engine worker ──► song_tracks
```

### Song engine (v2)

Xem [ADR 0012](./adr/0012-song-source-and-engine.md).

- **Next.js** nhận URL, tạo `song_jobs`, trả trạng thái (poll hoặc SSE). Các bước nhẹ (metadata, nhận diện nhạc, LRCLIB, AI keyword) chạy trong route/cron của Next.js.
- **Worker `services/song-engine`** (Python, GPU – Modal / Replicate / máy riêng) chỉ nhận job cần phân tích audio: Demucs tách vocal → stable-ts / WhisperX (Whisper large-v3 hoặc kotoba-whisper) → forced alignment hoặc ASR → Enhanced LRC + confidence. Gọi về Next.js bằng webhook có chữ ký HMAC.
- Hàng đợi: bảng `song_jobs` trong Postgres (worker lấy job bằng `SELECT … FOR UPDATE SKIP LOCKED`), không thêm queue service mới.
- Kết quả dùng chung qua `song_tracks` (khóa theo `youtube_id`).

- Nội dung học **tĩnh**, đọc từ `content/` lúc build.
- Dữ liệu người dùng (tiến độ, SRS, streak) ở Postgres; `item_id` trỏ tới id trong `content/` – xem quy tắc ổn định id ở §6.
- Admin chỉ đổi cấu hình runtime (AI provider, voice allowlist, kill-switch) qua `app_settings`.

## 4. i18n

- next-intl `defineRouting({ locales: ['vi', 'en'], defaultLocale: 'vi', pathnames })`.
- `generateMetadata` có `alternates.languages` (hreflang) + canonical.
- Nội dung học có trường song ngữ; giải thích ngữ pháp tiếng Việt trước, tiếng Anh fallback "đang cập nhật".
- UI strings ở `src/messages/*.json`.

## 5. Tiếng Nhật: readings, furigana, romaji

- **Readings + furigana cho từ:** JMdict (reading chuẩn) + **JmdictFurigana** (phân đoạn ruby cho từng kanji, xử lý cả jukujikun như 今日, 大人).
- **Câu ví dụ:** viết tay trong `content/source/` bằng markup `{漢字|かんじ}` → ingest (`scripts/ingest/build-n5.ts`) sinh `segments` + `romaji`. Người biên tập sửa trực tiếp file nguồn.
- **Romaji từ:** wanakana chuyển từ reading.
- **Hán-Việt của từ:** chỉ ghép cho đoạn đọc on'yomi; từ có jukujikun gắn cờ, không ghép tự động.
- **Không có** route phân tích runtime. AI tutor tự xuất markup furigana (`{漢字|かんじ}`), validate zod, render bằng parser của app.
- **Client:** `wanakana` cho gõ romaji → kana và chuẩn hóa đáp án.
- Tham khảo code: `C:\project\secretary\server\src\ai-agent\services\romaji\romaji.service.ts`. Phương án thay kuroshiro: `lindera-wasm`.

## 6. Ổn định id nội dung

- Id từ vựng theo JMdict (`jmdict-<seq>`), kanji theo ký tự, bài học theo `level-NN-slug`.
- `validate-content` so danh sách id với commit trước: id biến mất mà không có trong `tombstones.json` → build fail.
- Thẻ SRS trỏ tới id đã tombstone → ẩn khỏi hàng đợi, không xóa lịch sử.

## 7. Provider abstraction (AI, TTS, STT)

```ts
// src/lib/ai/types.ts (phác thảo)
export interface AiProvider {
  id: string;
  chat(input: ChatInput): AsyncIterable<string>;          // streaming qua Route Handler SSE
  generateObject<T>(input: ObjectInput<T>): Promise<T>;   // validate bằng zod schema
}
export type AiMode = 'tutor' | 'quiz-gen' | 'grading' | 'adaptive';
// registry: getProvider(mode) → app_settings (chỉ chọn adapter đã cấu hình, cache + invalidate theo tag) → env AI_PROVIDER → 'mock'
```

Chi tiết ở [05-AI-SPEECH](./05-AI-SPEECH.md).

## 8. CSP

Xem [ADR 0013](./adr/0013-static-csp-cache-components.md) (thay ADR 0007): giữ `cacheComponents`, **một CSP tĩnh** trong `next.config.ts` cho mọi trang, không nonce.

| Tầng | Route | CSP |
|------|-------|-----|
| Public tĩnh | `(public)/*` | Header tĩnh trong `next.config`: `script-src 'self' 'unsafe-inline'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'self'`, `frame-ancestors 'none'`. Riêng `/songs/*` thêm `script-src https://www.youtube.com` và `frame-src https://www.youtube-nocookie.com` |
| App | `(app)/*` | Cùng CSP tĩnh; bù bằng ESLint `react/no-danger`, không render HTML từ AI |
| Embed | `embed/*` | CSP tĩnh + `frame-ancestors *` |

Điều kiện cho tầng public: không render nội dung người dùng hoặc AI; không có `dangerouslySetInnerHTML` ngoài JSON-LD đã escape `<`.

## 9. Mở rộng

- Thêm cấp JLPT / JFT-Basic: thêm `content/levels/<level>/`. N5 prebuild; N4+ dùng `dynamicParams` + ISR.
- Thêm ngành: thêm `content/packs/<sector>.json`.
- Thêm AI provider: thêm preset cho `openai-compatible` hoặc 1 adapter mới.
- Thêm widget: thêm route dưới `embed/`.
- Thêm loại câu hỏi: 1 component + 1 hàm chấm thuần trong `features/tests/question-types/`.
- OG image tạo on-demand, không tạo lúc build.
