# Brief: P5 open decisions (kaigo pack, AI chat, email reminders, streak share card)

- Goal: decide
- Date: 2026-11-10
- Rounds: 3 (max) · Word limit: 250 · Model: sonnet

## Question
The agent is implementing roadmap phase P5 (`docs/09-ROADMAP.md`) without the owner. Decide each item below. For each, answer with one option (or "backlog + skip" if it truly needs the owner: money, legal sign-off, external accounts/keys).

- **D1 Kaigo pack timing.** (a) Build now (≥ 50 words + related kanji) with the existing "unreviewed" note and `meaningsViReviewed/hanVietReviewed: false`, like lessons 11–20; (b) wait for human review B6 (backlog + skip).
- **D2 Pack data shape.** (a) New `content/source/packs/<sector>.ts` → ingest → `content/packs/<sector>.json` holding word ids; pack words that are not yet in `content/levels/n5/words.json` are added to the word set (with `tags: ['pack:kaigo']`, `jlpt` from source or null); (b) pack JSON holds full word objects separately from N5 words.
- **D3 AI chat streaming.** (a) Add `streamText(input): AsyncIterable<string>` to `AiProvider` (mock yields fixture chunks; openai-compatible parses SSE) and a Route Handler `POST /api/chat` returning `text/event-stream`; (b) no streaming: one JSON response per message.
- **D4 Chat thread history.** (a) DB tables `chat_threads` + `chat_messages` (server-side, deletable with account delete/export); (b) client-only (sessionStorage), server sends last N turns from the request.
- **D5 Chat access when AI is off/mock.** Chat is a beta, behind sign-in (non-guest), 16+, `ai_processing` consent, 20 msgs/day (`limits.ts` tutor: 20). When no real provider is configured the mock answers. Is shipping the page visible to all signed-in users OK, or (b) behind an admin feature flag in `app_settings`?
- **D6 Email reminders without an email provider (B4 blocked: no Resend key/domain).** (a) Build the opt-in setting (reminder hour) + an `EmailTransport` interface with a `console` transport + a `scripts/send-reminders.ts` job (dry-run default, like `purge:anonymous`); real Resend wiring stays in backlog B4; (b) backlog + skip entirely.
- **D7 Streak share card.** (a) `next/og` `ImageResponse` route at `/api/og/streak` + a share button in Today/`/me` (needs a public, non-guessable id or a signed URL so others can open it); (b) client-side generated image (canvas) downloaded by the user, no public URL; (c) backlog.

## Constraints
- Stack: Next.js 16 (see `AGENTS.md`), next-intl `/vi` `/en`, Drizzle + PGlite locally / Neon later, Better Auth (anonymous guests), ts-fsrs. Static CSP in `next.config.ts` (ADR 0013); public pages must stay static (`scripts/check-static.mjs`).
- No real money, legal or product-strategy decisions; no external accounts. Content not reviewed by a human ships with the "unreviewed" note.
- Privacy: PDPL consents per purpose (`docs/08-NFR.md`), no PII to AI, no dark patterns (F2).
- Keep scope minimal: least code that meets the roadmap acceptance criteria (`docs/02-FEATURES.md` F2, F3, F8).
- Reading list: `docs/09-ROADMAP.md` (P5), `docs/02-FEATURES.md` (F2, F3, F8, F13), `docs/05-AI-SPEECH.md`, `docs/04-DATA-MODEL.md`, `backlog.md`, `docs/PROGRESS-2026-10-29.md`, code under `src/lib/ai/`, `src/lib/learning.ts`, `src/lib/progress.ts`, `content/source/`.

## Participants
| # | Role | Persona |
| --- | --- | --- |
| 1 | PM | G:\project\jacky-the-skiller\agents\product-manager.md |
| 2 | BA | G:\project\jacky-the-skiller\agents\project-analyst.md |
| 3 | dev | G:\project\jacky-the-skiller\agents\nextjs-developer.md |

## Research questions
None (decisions rest on repo docs and code).

## Research digest
- none
