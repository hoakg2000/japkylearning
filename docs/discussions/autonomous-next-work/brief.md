# Brief: Features buildable without owner approval

- Goal: decide
- Date: 2026-10-27
- Rounds: 2 · Word limit: 220 · Model: sonnet

## Question
Which items from `backlog.md` and roadmap P5–P7 (`docs/09-ROADMAP.md`) can the agent build now **without the owner's approval or any external account/key/decision**, in what order, and with what acceptance check each? Output must be an ordered implementation checklist.

## Constraints
- Repo `C:\project\japkylearning`, branch `feat/nextjs-docs`, Next.js 16.4.3 (cacheComponents), Better Auth, PGlite locally, next-intl vi/en.
- Out of scope: anything needing an external account or secret (Neon, Vercel, Resend, fish.audio, R2, Turnstile, PostHog, Sentry, real LLM keys), legal review (B5, deferred), human content review (B6), pushing to GitHub, release items R1–R8 except code-only gaps.
- Security: secrets only in env, never in DB or client; validate at trust boundaries; admin requires role admin + 2FA; no new network calls to third parties.
- Do not work outside the project folder. No new dependencies unless unavoidable.
- Each item must keep `npm run lint`, `typecheck`, `test`, `build`, e2e green.
- Songs (P8) are last by owner decision — exclude.
- Content authored by the agent ships with `reviewed: false` flags (B6 stays open).

## Candidates (from backlog.md)
F3 timezone change UI · F5 furigana "unlearned" · F6 mature SRS directions · F7 missed kana → SRS · F8 N5 mock exam (P7) · F9 WordCard row list · F10 2FA enable UI · F11 admin HTTP 404 · F12 AudioButton cloud voice + TTS quota · F13 daily AI budget enforcement · F2 anonymous purge job (code only, cron later) · P5: lessons 11–20, kaigo pack, AI chat beta (mock), share card (OG image) · R3 axe on all main pages.

## Participants
| # | Role | Persona |
| --- | --- | --- |
| 1 | pragmatist | none |
| 2 | skeptic (security + scope) | none |
| 3 | user advocate | none |

## Research questions
None (scope is this repo; participants read `backlog.md`, `docs/`, `src/`).

## Research digest
- R01: /api/tts requires signed-in non-anonymous user and admin-enabled voice, but has no per-user quota; AudioButton never uses cloud voice (High)
