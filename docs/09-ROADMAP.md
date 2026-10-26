# 09 – Roadmap

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

1 developer, **~24 tuần**, trong đó **~9 tuần (≈38%) là viết và review nội dung**. Public beta khoảng **tuần 13**. Mỗi phase kết thúc bằng bản chạy được, có test, có preview deploy. Ước lượng chỉ mang tính tương đối.

## P0 – Nền tảng (1.5 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Xóa app Expo; chuyển `src/constants/letter.json` → `content/kana/` | Repo chỉ còn Next.js; 46 kana cũ còn nguyên |
| Scaffold Next.js 16 + TS strict + ESLint + Tailwind v4 + shadcn/ui; pin version các mục **[verify]** | `npm run build` pass |
| next-intl `/vi` `/en`, route group `(public)` / `(app)` / `embed` | Trang public build ra static |
| Design tokens, light/dark, Full/Minimal bằng script trước paint | Reload không nháy giao diện |
| CSP 2 tầng + security headers | Kiểm tra header bằng curl cho cả 3 tầng |
| Sound sprite + nút mute | |
| CI (lint, typecheck, vitest, build) | Pipeline xanh |

## P1 – Kana + first-run (2 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Bổ sung kana đủ bộ + audio pre-generate lên R2 | Schema `Kana` pass |
| Module kana: bảng, stroke order, quiz, bài kiểm tra bỏ qua kana | [F1](./02-FEATURES.md#f1-bảng-chữ-cái-kana) |
| DB + Drizzle + Better Auth (anonymous, 2FA), Turnstile, consent, cổng tuổi 16+ | Đăng ký sau khi học → giữ tiến độ |
| First-run quiz + onboarding + Today v0 + bottom nav | [F0](./02-FEATURES.md#f0-first-run-onboarding--màn-hình-today) |
| Streak (pure function + freeze tuần) | [F2](./02-FEATURES.md#f2-daily-check-in--streak), property-based test |

## P2 – N5 core (5 tuần: dev 3 + nội dung 2)

| Task | Acceptance criteria |
|------|---------------------|
| Pipeline ingest: JMdict, JmdictFurigana, KANJIDIC2, KanjiVG, Unihan, Tatoeba | `validate-content` pass |
| WordCard: `inline`, `card` × 3 density, `flashcard` | [F13](./02-FEATURES.md#f13-component-từ-vựng-wordcard) |
| Trang kanji / từ SSG + SEO + credits | Lighthouse SEO ≥ 95; bật Lighthouse CI |
| SRS FSRS: thẻ nhận diện từ vựng + thẻ ngữ pháp + thẻ nghe | [F5](./02-FEATURES.md#f5-flashcard-srs--kiểm-tra) |
| Test cuối bài, lưu `skill_tags`; adaptive rule-based cho Today | [F7](./02-FEATURES.md#f7-ai-learning-mode-adaptive-path) |
| **Nội dung:** bài N5 1–10 (≤ 18 từ/bài, kanji phân bài, bài nghe), review Hán-Việt ~100 kanji N5, nghĩa tiếng Việt cho từ bài 1–10 | Mọi từ có ví dụ + `meaningsViReviewed` |

## P3 – Showcase cho chủ dự án (3 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| `AiProvider` + registry + `mock` + `openai-compatible` (preset openai, gemini, claude, motapi, github-models) + stub `gateway` | Unit test registry: app_settings → env → mock |
| Admin: chọn adapter/preset/model theo mode, kill-switch, ngân sách, thống kê, audit log | Chỉ admin có 2FA vào được |
| Test với AI (beta, 5 lượt/ngày) + nhận xét adaptive bằng LLM | [F6](./02-FEATURES.md#f6-test-với-ai-beta) |
| Voice allowlist + `/api/tts` khóa chặt | [F9](./02-FEATURES.md#f9-voice-tts) |
| Embed `/embed/kanji/[char]` + trang lấy mã nhúng | Nhúng chạy trên domain khác; trang thường không nhúng được |

## P4 – Public beta (1.5 tuần) → ~tuần 13

| Task | Acceptance criteria |
|------|---------------------|
| Privacy policy, terms, danh sách processor, xuất/xóa dữ liệu | Luật sư review PDPL |
| PostHog event catalogue | [08 §7](./08-NFR.md#7-analytics) |
| Axe + Lighthouse cho mọi trang chính | Không lỗi axe nghiêm trọng |
| Sentry, backup, Vercel Pro, fish.audio commercial (nếu launch công khai) | |
| 20 beta tester (ưu tiên người học Tokutei Ginou) | Thu feedback, đo D1/D7 |

## P5 – Pack kaigo + bài 11–20 (4 tuần: dev 1.5 + nội dung 2.5)

| Task | Acceptance criteria |
|------|---------------------|
| Pack kaigo (≥ 50 từ + kanji liên quan) | Thêm vào SRS bằng 1 nút |
| Bài N5 11–20 | Như P2 |
| AI chat beta (chỉ ngữ pháp, 20 tin/ngày, SSE) | [F8](./02-FEATURES.md#f8-ai-chat-tutor-beta) |
| Email nhắc học (opt-in), share card streak | |

## P6 – Bài hát + luyện nói (3 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Songs v1: `build-songs.ts` (LRCLIB → LRC → furigana → AI `lyrics-keywords` + `lyrics-translate`), player YouTube + highlight dòng/từ + keyword + điền lỗ, 20–30 bài | [F11](./02-FEATURES.md#f11-học-qua-bài-hát) |
| `SttProvider` + `webspeech` + mora scoring, consent Google, chỉ từ đơn | [F10](./02-FEATURES.md#f10-chấm-phát-âm-beta); unit test mora (ゃ, っ, ー) |

## P7 – Hoàn thiện N5 (4 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Bài N5 21–30 + mock JLPT N5 | Đủ lộ trình N5 |
| Pack nhà hàng + IT | |
| Thêm widget (`word`, `word-of-the-day`), streak embed opt-in | |
| PWA (manifest, offline deck) | |

## Sau v1

- N4, nội dung + mock JFT-Basic, rồi N3 → N1 (ISR).
- Pack ngành còn lại; roleplay AI; Azure Pronunciation Assessment.
- **v2 – Song engine** (~5–6 tuần, [ADR 0012](./adr/0012-song-source-and-engine.md)):
  1. Dán link YouTube → `song_jobs`, YouTube Data API, nhận diện nhạc, tách artist/title (1 tuần).
  2. Tra LRCLIB nhiều biến thể tên, cache `song_tracks`, thư viện bài của người dùng (1 tuần).
  3. Worker Python: Demucs + forced alignment (có `plainLyrics`) + ASR word-level (không có lyrics), webhook HMAC (2–3 tuần).
  4. Báo lỗi lyrics/timing, trang review, đóng góp ngược LRCLIB (1 tuần).
  - **Trước khi build:** quyết định lại cách lấy audio (YouTube ToS) – xem [07 §4](./07-CONTENT-LICENSING.md#4-bài-hát).
- Nhắc học qua Zalo, league/quest, oEmbed.
- Nối universal AI gateway của chủ dự án khi có spec.

## Rủi ro chính

| Rủi ro | Giảm thiểu |
|--------|-----------|
| Thời gian viết nội dung | Đã dành ~38% roadmap; AI dịch nháp + review; giới hạn 18 từ/bài |
| Pháp lý PDPL (tuổi, chuyển dữ liệu) | Chặn < 16, consent theo mục đích, luật sư review trước launch |
| Bản quyền lyrics (tạm chấp nhận ở v1) | Có cơ chế takedown; xem lại trước giai đoạn thương mại ([07 §4](./07-CONTENT-LICENSING.md#4-bài-hát)) |
| LRCLIB thiếu bài tiếng Nhật / ngừng hoạt động | v1 lưu kết quả vào `content/` (không phụ thuộc runtime); v2 có engine tự xây |
| Song engine v2 tải audio YouTube trái ToS | Quyết định lại nguồn audio trước khi build v2 |
| Chất lượng ASR với giọng hát | Tách vocal trước; ưu tiên forced alignment khi đã có lyrics; nhãn độ tin cậy + người dùng báo lỗi |
| Chi phí AI/TTS | Mock-first, audio pre-generate, quota, kill-switch |
| Lạm dụng TTS (deepfake, cost DoS) | Voice allowlist, chỉ text do server tạo |
| MotAPI là processor chưa kiểm chứng | Không gửi PII; có thể tắt trong admin |
| Chất lượng Hán-Việt / tiếng Việt | Review tay, cờ `reviewed` |
| kuroshiro không còn maintain | Chỉ dùng lúc ingest cho câu ví dụ; phương án lindera-wasm |
| Thông tin chưa kiểm chứng (năm mất tác giả, license JmdictFurigana, điều khoản fish.audio) | Kiểm trước khi phát hành phần liên quan ([REVIEW §6](./REVIEW-2026-10-26.md#6-còn-mở)) |
