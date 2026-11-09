# ADR 0001 – Next.js full-stack thay app Expo

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Repo hiện là app Expo React Native chỉ có kana quiz. Mục tiêu mới là website song ngữ, SEO tốt, có backend cho tiến độ, AI, TTS/STT.

## Quyết định
Thay thế app Expo bằng **Next.js (App Router) + TypeScript** full-stack trong cùng repo. Giữ `src/constants/letter.json` làm seed cho `content/kana/`. Mobile dùng PWA ở v1.

## Hệ quả
- (+) SSR/SSG cho SEO, một codebase cho UI + API.
- (+) Server Actions/Route Handlers giữ secret (AI, fish.audio) ở server.
- (−) Mất app native; nếu cần sau này có thể tách monorepo và dùng chung `content/` + logic thuần.
