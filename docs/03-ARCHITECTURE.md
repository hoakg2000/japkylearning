# 03 – Kiến trúc

## 1. Tech stack

Version ghi theo research ngày 2026-10-26. Mục **[verify]** phải chạy `npm view <pkg> version` ở Phase 0 trước khi pin.

| Lớp | Lựa chọn | Ghi chú |
|-----|----------|---------|
| Framework | **Next.js 16** App Router, React Server Components, TypeScript `strict` | `proxy.ts` thay `middleware.ts` |
| i18n | **next-intl v4** | `/vi`, `/en`, localized pathnames, hreflang |
| UI | **Tailwind CSS v4**, **shadcn/ui** (Radix), `lucide-react` | Design tokens qua CSS variables |
| Animation | `motion` **[verify]** | Tôn trọng `prefers-reduced-motion` |
| Theme | `next-themes` (light/dark) + cookie `ui-mode` (full/minimal) | |
| Âm thanh | `use-sound` (howler.js) | Lazy-load |
| DB | **Postgres (Neon)** + **Drizzle ORM** **[verify]** | Branching DB cho preview |
| Auth | **Better Auth** | Email + Google OAuth |
| Rate limit / cache | `@upstash/ratelimit` + `@upstash/redis` | |
| Validation | **Zod** | Mọi biên: form, API, content, output LLM |
| SRS | **ts-fsrs 5.x** | |
| Tiếng Nhật | `kuroshiro` + `kuroshiro-analyzer-kuromoji` (ingest, server), `wanakana` (client) | [ADR 0003](./adr/0003-precompute-furigana-romaji.md) |
| Stroke order | **KanjiVG** SVG, animate bằng `stroke-dashoffset` | |
| AI | Interface riêng `AiProvider`, mock-first | [ADR 0004](./adr/0004-ai-provider-abstraction.md) |
| Test | Vitest, Playwright + `@axe-core/playwright`, Lighthouse CI | |
| Hosting | Vercel (hoặc self-host Docker Node) | Không dùng Edge runtime cho route nặng |

## 2. Cấu trúc thư mục

```
.
├─ content/                         # Nội dung git-versioned (JSON/MDX), validate bằng zod khi build
│  ├─ kana/                         # hiragana.json, katakana.json (seed từ letter.json cũ)
│  ├─ levels/n5/
│  │  ├─ lessons/01-greetings.json
│  │  ├─ vocab.json
│  │  ├─ kanji.json
│  │  └─ grammar/*.mdx
│  ├─ packs/<sector>.json           # kaigo, food-service, manufacturing, it…
│  └─ songs/<slug>.{json,lrc}
├─ scripts/ingest/                  # Build dữ liệu: JMdict, KANJIDIC2, KanjiVG, Unihan Hán-Việt, furigana
├─ public/                          # sounds/, kanjivg/, og/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ (marketing)/            # landing, about, credits
│  │  │  ├─ (learn)/                # kana, lessons, kanji, words, packs
│  │  │  ├─ (practice)/             # review (SRS), tests, shadowing
│  │  │  ├─ songs/
│  │  │  ├─ chat/
│  │  │  ├─ me/                     # profile, streak, settings
│  │  │  └─ admin/                  # AI provider, nội dung AI sinh ra, thống kê
│  │  ├─ embed/[type]/[id]/         # Widget iframe (không cookie)
│  │  └─ api/
│  │     ├─ tts/  stt/  ai/  oembed/  auth/[...all]/
│  ├─ features/                     # Mỗi module: components, server actions, logic thuần, tests
│  │  ├─ kana/  kanji/  lessons/  srs/  streak/  tests/
│  │  ├─ ai/  speech/  songs/  embed/  settings/
│  ├─ components/
│  │  ├─ ui/                        # shadcn
│  │  └─ word/                      # WordCard + variants, Ruby, AudioButton
│  ├─ lib/
│  │  ├─ db/                        # drizzle schema, client
│  │  ├─ auth/
│  │  ├─ i18n/                      # routing, request config
│  │  ├─ ai/                        # AiProvider interface, registry, adapters/
│  │  ├─ speech/                    # TtsProvider, SttProvider, mora utils
│  │  ├─ japanese/                  # furigana align, mora split, normalize
│  │  └─ content/                   # loader + zod schemas
│  ├─ messages/{vi,en}.json         # UI strings
│  └─ proxy.ts                      # locale routing, CSP nonce, auth redirect
└─ docs/
```

**Quy tắc ranh giới module**
- `features/*` chỉ import từ `lib/*`, `components/*` và chính nó. Không import chéo feature trực tiếp; chia sẻ qua `lib`.
- Logic thuần (FSRS wrapper, streak calc, mora diff, adaptive scoring) nằm trong file không phụ thuộc React → test bằng Vitest dễ.
- Code dùng secret có `import 'server-only'`.

## 3. Data flow

```
content/*.json ──(build: zod validate + precompute furigana)──► RSC pages (SSG/ISR) ──► HTML có <ruby> (SEO)
                                                                         │
User action ──► Server Action / Route Handler ──(auth + zod + rate limit)──► Drizzle ──► Postgres
                                   │
                                   ├─► AiProvider (mock | gateway | openai-compatible | gemini | claude)
                                   ├─► TtsProvider fish ──► api.fish.audio (cache audio)
                                   └─► SttProvider ──► mora scoring
Guest: localStorage ──(đăng nhập)──► merge vào DB
```

- Nội dung học (kana, từ, kanji, bài) là **tĩnh**, đọc từ `content/` lúc build → nhanh, rẻ, SEO tốt.
- Dữ liệu người dùng (tiến độ, SRS, streak) ở Postgres.
- Admin chỉnh được cấu hình runtime (AI provider) qua bảng `app_settings`.

## 4. i18n

- next-intl `defineRouting({ locales: ['vi', 'en'], defaultLocale: 'vi', pathnames })`.
- Mỗi trang có `generateMetadata` với `alternates.languages` (hreflang) và canonical.
- Nội dung học có trường song ngữ (`meanings: { vi, en }`); UI strings ở `src/messages/*.json`.
- Thêm ngôn ngữ mới = thêm locale + file messages + trường dịch (schema cho phép thiếu → fallback `en`).

## 5. Tiếng Nhật: kanji → kana/romaji, furigana

- **Lúc ingest (Node script):** kuroshiro + kuromoji tách từ → `segments: [{ surface, reading }]` + `romaji`. Thuật toán căn furigana chỉ đặt ruby trên phần kanji (食べる → ruby trên 食).
- Kết quả lưu trong `content/` → người biên tập sửa được chỗ phân tích sai (tên riêng, từ hiếm).
- **Runtime cho text người dùng** (chat AI, câu tự nhập): route `/api/japanese/analyze` Node runtime, rate limit + cache. Không chạy trên client (dictionary ~12–17 MB).
- **Client:** `wanakana` cho romaji ↔ kana khi gõ và chuẩn hóa đáp án.
- Tham khảo code đã có: `C:\project\secretary\server\src\ai-agent\services\romaji\romaji.service.ts`.
- Phương án thay thế nếu kuroshiro gây vấn đề: `lindera-wasm` (maintained hơn).

## 6. Provider abstraction (AI, TTS, STT)

Ba nhóm dịch vụ ngoài đều đi qua interface + registry, chọn bằng config → thay provider không đụng feature code. Chi tiết ở [05-AI-SPEECH](./05-AI-SPEECH.md).

```ts
// src/lib/ai/types.ts (phác thảo)
export interface AiProvider {
  id: string;
  chat(input: ChatInput): AsyncIterable<string>;                 // streaming
  generateObject<T>(input: ObjectInput<T>): Promise<T>;          // output validate bằng zod schema
}
export type AiMode = 'tutor' | 'quiz-gen' | 'grading' | 'adaptive';
// registry: getProvider(mode) → đọc app_settings (admin) → fallback env AI_PROVIDER → 'mock'
```

## 7. Mở rộng (extendability)

- Thêm cấp JLPT: thêm `content/levels/n4/`.
- Thêm ngành: thêm `content/packs/<sector>.json`.
- Thêm AI provider: thêm 1 file adapter trong `src/lib/ai/adapters/` + đăng ký vào registry.
- Thêm loại widget: thêm case trong `/embed/[type]`.
- Thêm loại câu hỏi: mỗi loại là 1 component + 1 hàm chấm thuần, đăng ký trong `features/tests/question-types/`.
