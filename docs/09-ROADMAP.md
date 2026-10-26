# 09 – Roadmap

Mỗi phase kết thúc bằng bản chạy được, có test, deploy preview. Ước lượng tính cho 1 developer full-time, chỉ mang tính tương đối.

## Phase 0 – Nền tảng (~1 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Xóa app Expo, giữ `src/constants/letter.json` → `content/kana/` | Repo chỉ còn Next.js; dữ liệu 46 kana cũ còn nguyên |
| Scaffold Next.js 16 + TS strict + ESLint + Tailwind v4 + shadcn/ui | `npm run build` pass |
| Pin version thư viện (`npm view`) cho các mục **[verify]** | Version ghi vào `package.json` và cập nhật [03](./03-ARCHITECTURE.md) |
| next-intl `/vi` `/en` + hreflang | Đổi ngôn ngữ giữ nguyên trang |
| Theme light/dark + mode full/minimal (cookie, không nháy) | Reload không nháy giao diện |
| Security headers + `proxy.ts` | Kiểm tra header bằng curl |
| CI GitHub Actions (lint, typecheck, vitest, build) | Pipeline xanh |
| Bổ sung kana đủ bộ (dakuten, yōon, kana nhỏ, katakana mở rộng) | Schema `Kana` validate pass |

## Phase 1 – MVP học (~3–4 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Module kana: bảng, audio, stroke order, quiz | [F1](./02-FEATURES.md#f1-bảng-chữ-cái-kana) |
| Pipeline ingest N5: ~800 từ, ~100 kanji, Hán-Việt review, furigana/romaji | `validate-content` pass; 100% từ có ví dụ |
| WordCard đủ variant + toggle hiển thị | [F13](./02-FEATURES.md#f13-component-từ-vựng-wordcard) |
| Trang kanji/từ SSG + SEO | Lighthouse SEO ≥ 95 |
| Bài học N5 1–10 | [F4](./02-FEATURES.md#f4-bài-học-n5) |
| DB + Drizzle + Better Auth + guest merge | Đăng nhập không mất tiến độ guest |
| SRS FSRS + trang ôn tập | [F5](./02-FEATURES.md#f5-flashcard-srs--kiểm-tra) |
| Check-in & streak | [F2](./02-FEATURES.md#f2-daily-check-in--streak), unit test timezone |
| TTS browser + fish proxy + cache | [F9](./02-FEATURES.md#f9-voice-tts) |
| Âm thanh action + mute | [06 §4](./06-UI-UX.md#4-âm-thanh-action) |

## Phase 2 – Kiểm tra & kanji ngành (~3 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| Test theo bài, test tổng hợp, lưu `skill_tags` | Câu hỏi chỉ từ nội dung đã học |
| Mock JLPT N5 có hẹn giờ | Có 3 phần, chấm điểm theo phần |
| Pack ngành: kaigo, nhà hàng, chế tạo, IT | Mỗi pack ≥ 50 từ + kanji liên quan |
| Bài học N5 11–30 | Đủ lộ trình N5 |

## Phase 3 – AI (mock trước) (~3 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| `AiProvider` interface + registry + adapter `mock` + stub `gateway` | Unit test registry chọn đúng provider theo app_settings → env → mock |
| Admin: chọn provider/model theo mode, test prompt, thống kê | Chỉ admin truy cập được |
| Quota + rate limit + validate output | Vượt quota → thông báo thân thiện |
| Test với AI | [F6](./02-FEATURES.md#f6-test-với-ai) |
| Adaptive path (rule-based + LLM) | [F7](./02-FEATURES.md#f7-ai-learning-mode-adaptive-path) |
| Chat tutor + roleplay | [F8](./02-FEATURES.md#f8-ai-chat-tutor) |
| Adapter thật (openai-compatible/gemini/claude) hoặc nối gateway | Khi gateway có spec |

## Phase 4 – Speech & bài hát (~3 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| `SttProvider` + mock + webspeech | Hoạt động trên Chrome/Edge; trình duyệt khác báo không hỗ trợ |
| Mora split/diff + chấm điểm + UI shadowing | Unit test mora (ゃ, っ, ー) |
| Azure / fish ASR / Whisper adapter | Chọn 1 sau khi so sánh chi phí/chất lượng |
| Songs: player YouTube + LRC + highlight dòng/từ | Lệch đồng bộ < 150 ms sau khi chỉnh offset |
| Từ đáng chú ý → WordCard → SRS; chế độ điền lỗ | [F11](./02-FEATURES.md#f11-học-qua-bài-hát) |
| 5 bài đồng dao public domain đã kiểm tra license | Trường `license` hợp lệ |

## Phase 5 – Sharing & hoàn thiện (~2–3 tuần)

| Task | Acceptance criteria |
|------|---------------------|
| `/embed/*` widgets + trang lấy embed code | Nhúng chạy trên domain khác; trang thường không nhúng được |
| oEmbed endpoint + discovery | Dán link vào WordPress ra widget |
| Share card streak (OG image) | |
| PWA (manifest, offline deck) | Lighthouse PWA pass |
| League / quest / badge | |
| Admin CMS nội dung | Sửa furigana sai không cần sửa file tay |

## Sau v1

- N4 (thêm `content/levels/n4/`), rồi N3 → N1.
- Pack ngành còn lại.
- Từ điển đầy đủ, graded reader, luyện viết tay.

## Rủi ro chính

| Rủi ro | Giảm thiểu |
|--------|-----------|
| Bản quyền lyrics | Chỉ nội dung public domain/CC/có license ([ADR 0006](./adr/0006-song-content-policy.md)) |
| Chi phí AI/TTS | Mock-first, cache, quota, pre-generate audio |
| Chất lượng Hán-Việt / dịch tiếng Việt | Review tay, trạng thái `reviewed` |
| kuroshiro không còn maintain | Chỉ dùng lúc ingest; phương án lindera-wasm |
| Share-alike CC BY-SA | Phát hành dataset nội dung theo CC BY-SA |
| STT trên trình duyệt không đồng đều | Interface provider, fallback server-side |
