# Backlog – blockers & follow-ups

Items that could not be finished while implementing the roadmap phases. Each has: why it is blocked, the current fallback, and what is needed to close it.

## Blockers (need the owner or an external account)

| # | Item | Phase | Why blocked | Current fallback | Needed |
|---|------|-------|-------------|------------------|--------|
| B1 | Pre-generated audio (fish.audio → Cloudflare R2) for kana, words, examples | P1/P2 | No R2 bucket / fish.audio key in this project; production use needs a commercial fish.audio plan and a signed voice release (ADR 0012, 05-AI-SPEECH §2) | Device voice via Web Speech API (`src/lib/speech/tts.ts`); `audioUrl` is optional in all content schemas and is used automatically when present | R2 bucket + public domain, `FISH_AUDIO_API_KEY`, chosen voice id with consent; then write `scripts/build-audio.ts` |
| B2 | Cloudflare Turnstile on anonymous-user creation and sign-up | P1 | Needs site + secret keys; widget script also needs a CSP change (`challenges.cloudflare.com` in `script-src`/`frame-src`) | Better Auth built-in rate limit (30 req/min/IP) | Turnstile keys; enable Better Auth `captcha` plugin + client widget |
| B3 | Production database and deploy | P0–P2 | No Neon project / Vercel project connected | Embedded PGlite in `.data/pglite` (auto-migrated) | `DATABASE_URL` (Neon ap-southeast-1), Vercel project pinned to `sin1`, `npm run db:migrate` in the deploy pipeline, real `BETTER_AUTH_SECRET` |
| B4 | Email verification, password reset, reminder emails | P1 | Needs an email provider (Resend) and a verified sending domain | Sign-up works without email verification; no password reset yet | Resend API key + domain; wire Better Auth `sendVerificationEmail` / `sendResetPassword` |
| B5 | Legal review of the privacy page and consent flow (PDPL 91/2025) – **deferred by owner** (project does not need strong legal focus; revisit when an opportunity arises) | P1 | Needs a lawyer | Draft page at `/privacy`, per-purpose consents stored in `consents`, export + delete in `/me` | Legal review before public launch (ADR 0011) |
| B6 | Human review of Hán-Việt (103 kanji) and Vietnamese meanings/examples (164 words, lessons 1–10) | P2 | P2 acceptance needs a native reviewer; content was authored by the agent and cross-checked against KANJIDIC2/Unihan (0 mismatches) but not reviewed by a person | Content ships with `hanVietReviewed: false` / `meaningsViReviewed: false` | Reviewer edits `content/source/n5/*.ts`, sets the flags to `true` in the ingest, runs `npm run ingest:n5` |

## Follow-ups (no blocker, scheduled later)

| # | Item | Phase |
|---|------|-------|
| F1 | Admin area with mandatory 2FA (plugin is enabled, no admin pages yet) | P3 |
| F2 | Purge job for anonymous users inactive > 30 days – script done (`npm run purge:anonymous`, dry run by default, `-- --apply` deletes); scheduling waits for B3 (Vercel Cron or CI schedule) | P3/P4 |
| F3 | ~~Timezone change limited to once per day~~ – done in `/me` (offers current zone, Vietnam, Japan) | P2+ |
| F4 | Mnemonic images for kana | P1 (nice to have) |
| F5 | Furigana mode "only kanji not learned yet" (setting exists; display treats it as "always" because public pages are static and do not know the user's learned kanji) | P2+ |
| F6 | ~~Production SRS direction unlocks when a word card is mature~~ – done (reading direction not added) | P3 |
| F7 | ~~Kana missed in quizzes become SRS cards~~ – done | P3 |
| F8 | Timed JLPT N5 mock exam | P7 (roadmap) |
| F9 | `row` layout of WordCard is implemented but not used on a page yet (word lists) | P5 |
| F10 | ~~Admin 2FA enable UI~~ – done: `/me` enables TOTP with the password, shows the key and backup codes once; sign-in asks for the code. Role admin is still granted only by hand in the DB. No QR code (needs a library) and no disable button yet | P3 gap |
| F11 | ~~Admin 404 returns HTTP 200~~ – done: `src/proxy.ts` rewrites non-admins to a real 404; `requireAdmin` stays the authority | P3 gap |
| F15 | Proxy matcher `.*\..*` is a JS string, so `\.` becomes `.` (any char) and next-intl runs only on `/`. Locale-less paths like `/kana` give 404 instead of redirecting. Fixing it runs next-intl on every page (cookies, caching) – decide and test | found during F11 |
| F12 | Cloud voice works through `/api/tts` and the user setting, but `AudioButton` still uses the device voice; TTS per-user quota and audio caching (R2, B1) are not built | P3 gap |
| F13 | Daily AI budget (`AI_DAILY_BUDGET_USD`) is documented but not enforced; only the kill-switch and per-user request quotas are enforced | P3 gap |
| F14 | Gateway adapter is a stub (returns unavailable); the universal gateway spec is needed | after owner spec |

## Release (P4 – public beta, moved to backlog by owner)

Owner decision: P4 is parked here. Legal items are deferred until there is an opportunity. Do these when ready to open beta.

| # | Item | Notes |
|---|------|-------|
| R1 | Privacy policy, terms of use, processor list, data export/delete review | Draft exists at `/privacy`; export and delete already in `/me`. Legal review deferred (B5) |
| R2 | PostHog event catalogue (cookieless, autocapture off) | Event list in `docs/08-NFR.md §7`; needs a PostHog key (external account) |
| R3 | Full axe + Lighthouse pass on all main pages | axe e2e now covers home, kana, learn, lesson, practice, kanji, review, tests, me (0 serious/critical). Lighthouse CI still on its existing URLs |
| R4 | Sentry error tracking | Needs DSN |
| R5 | Database backup policy | Neon point-in-time restore on paid plan |
| R6 | Vercel Pro and fish.audio commercial plan (only if opening publicly) | Depends on B1, B3 |
| R7 | Recruit 20 beta testers (priority: Tokutei Ginou learners), collect feedback, measure D1/D7 | Owner action |
| R8 | Close gaps F10 (admin 2FA UI) and F11 (admin HTTP status) before beta | See P3 gaps above |
