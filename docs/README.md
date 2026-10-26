# Japky – Tài liệu dự án

Website học tiếng Nhật song ngữ **Tiếng Việt / English**, xây bằng **Next.js (App Router) + TypeScript**. Giai đoạn đầu tập trung **JLPT N5** (cột mốc trên đường tới JFT-Basic / N4); N4 → N1 làm sau trên cùng cấu trúc.

> Docs đã được sửa theo [review panel ngày 2026-10-26](./REVIEW-2026-10-26.md).

> Repo này trước đây là app Expo React Native (kana quiz). App đó sẽ bị thay thế ở Phase 0 (xem [ADR 0001](./adr/0001-nextjs-fullstack-replace-expo.md)). Dữ liệu `src/constants/letter.json` được giữ làm seed cho module bảng chữ cái.

## Mục lục

| # | Tài liệu | Nội dung |
|---|----------|----------|
| 1 | [01-PRD.md](./01-PRD.md) | Tầm nhìn, persona, phạm vi, user stories, KPI |
| 2 | [02-FEATURES.md](./02-FEATURES.md) | Đặc tả từng module + acceptance criteria + bảng traceability |
| 3 | [03-ARCHITECTURE.md](./03-ARCHITECTURE.md) | Tech stack, cấu trúc thư mục, ranh giới module, data flow |
| 4 | [04-DATA-MODEL.md](./04-DATA-MODEL.md) | Schema Postgres, schema nội dung (zod) |
| 5 | [05-AI-SPEECH.md](./05-AI-SPEECH.md) | AI provider abstraction, TTS, STT, chấm phát âm, an toàn prompt |
| 6 | [06-UI-UX.md](./06-UI-UX.md) | Design system, theme, chế độ Full/Minimal, âm thanh, a11y |
| 7 | [07-CONTENT-LICENSING.md](./07-CONTENT-LICENSING.md) | Dataset, license, attribution, chính sách bài hát |
| 8 | [08-NFR.md](./08-NFR.md) | SEO, performance, security, testing, CI/CD |
| 9 | [09-ROADMAP.md](./09-ROADMAP.md) | Các phase, task, acceptance criteria |
| – | [adr/](./adr/) | Architecture Decision Records |
| – | [REVIEW-2026-10-26.md](./REVIEW-2026-10-26.md) | Kết quả review của 5 sub-agent, fact-check, danh sách quyết định D1–D30 |

## ADR

- [0001 – Next.js full-stack thay Expo](./adr/0001-nextjs-fullstack-replace-expo.md)
- [0002 – Drizzle + Neon Postgres + Better Auth](./adr/0002-drizzle-neon-better-auth.md)
- [0003 – Precompute furigana/romaji lúc ingest](./adr/0003-precompute-furigana-romaji.md)
- [0004 – AI provider abstraction, mock-first](./adr/0004-ai-provider-abstraction.md) *(superseded by 0010)*
- [0005 – FSRS cho spaced repetition](./adr/0005-fsrs-srs.md)
- [0006 – Chính sách nội dung bài hát](./adr/0006-song-content-policy.md) *(superseded by 0012)*
- [0007 – CSP 2 tầng](./adr/0007-two-tier-csp.md)
- [0008 – Nội dung chỉ nằm trong git](./adr/0008-git-only-content.md)
- [0009 – Khách là anonymous user](./adr/0009-anonymous-guest-users.md)
- [0010 – Chiến lược AI provider](./adr/0010-ai-provider-strategy.md)
- [0011 – Tuân thủ PDPL](./adr/0011-pdpl-compliance.md)
- [0012 – Nguồn bài hát và song engine](./adr/0012-song-source-and-engine.md)

## Glossary

| Thuật ngữ | Nghĩa |
|-----------|-------|
| Kana | Hiragana + Katakana |
| Kanji | Chữ Hán trong tiếng Nhật |
| Hán-Việt | Âm Hán-Việt của kanji (日 = NHẬT, 学 = HỌC). Cầu nối ghi nhớ quan trọng cho người Việt |
| On'yomi / Kun'yomi | Âm Hán-Nhật / âm thuần Nhật của kanji |
| Furigana | Kana nhỏ ghi cách đọc phía trên kanji (HTML `<ruby>`) |
| Okurigana | Phần kana đi sau kanji trong từ (食**べる**) |
| Romaji | Phiên âm Latin (Hepburn) |
| Mora | Đơn vị âm tiết tiếng Nhật (きゃ = 1 mora, っ = 1 mora, ー = 1 mora) |
| Pitch accent | Trọng âm cao độ |
| SRS | Spaced Repetition System – ôn tập ngắt quãng |
| FSRS | Free Spaced Repetition Scheduler – thuật toán SRS hiện đại (Anki mặc định) |
| LRC | Định dạng lyrics có timestamp `[mm:ss.xx]` |
| Tokutei Ginou (特定技能) | Visa kỹ năng đặc định – 16 lĩnh vực ngành nghề |
| Streak | Số ngày học liên tục |
| Jukujikun (熟字訓) | Từ đọc theo cả cụm, không theo từng chữ (今日 = きょう, 大人 = おとな) |
| JFT-Basic | Bài thi tiếng Nhật cơ bản (A2) dùng cho visa Tokutei Ginou |
| PDPL | Luật Bảo vệ dữ liệu cá nhân Việt Nam (Luật 91/2025/QH15) |
