# Backlog – blockers & follow-ups

Items that could not be finished while implementing the roadmap phases. Each has: why it is blocked, the current fallback, and what is needed to close it.

## Blockers (need the owner or an external account)

| # | Item | Phase | Why blocked | Current fallback | Needed |
|---|------|-------|-------------|------------------|--------|
| B1 | Pre-generated audio (fish.audio → Cloudflare R2) for kana, words, examples | P1/P2 | No R2 bucket / fish.audio key in this project; production use needs a commercial fish.audio plan and a signed voice release (ADR 0012, 05-AI-SPEECH §2) | Device voice via Web Speech API (`src/lib/speech/tts.ts`); `audioUrl` is optional in all content schemas and is used automatically when present | R2 bucket + public domain, `FISH_AUDIO_API_KEY`, chosen voice id with consent; then write `scripts/build-audio.ts` |
| B2 | Cloudflare Turnstile on anonymous-user creation and sign-up | P1 | Needs site + secret keys; widget script also needs a CSP change (`challenges.cloudflare.com` in `script-src`/`frame-src`) | Better Auth built-in rate limit (30 req/min/IP) | Turnstile keys; enable Better Auth `captcha` plugin + client widget |
| B3 | Production database and deploy | P0–P2 | No Neon project / Vercel project connected | Embedded PGlite in `.data/pglite` (auto-migrated) | `DATABASE_URL` (Neon ap-southeast-1), Vercel project pinned to `sin1`, `npm run db:migrate` in the deploy pipeline, real `BETTER_AUTH_SECRET` |
| B4 | Email verification, password reset, reminder emails | P1/P5 | Needs an email provider (Resend) and a verified sending domain | Sign-up works without email verification; no password reset yet. Reminders (P5): opt-in hour in /me, `npm run send:reminders` (dry run; `--apply` sends via `EMAIL_TRANSPORT=console`, logs masked address only) | Resend API key + domain; wire Better Auth `sendVerificationEmail` / `sendResetPassword`; add a `resend` branch in `src/lib/email/transport.ts`; schedule `send:reminders` hourly (needs B3) |
| B5 | Legal review of the privacy page and consent flow (PDPL 91/2025) – **deferred by owner** (project does not need strong legal focus; revisit when an opportunity arises) | P1 | Needs a lawyer | Draft page at `/privacy`, per-purpose consents stored in `consents`, export + delete in `/me` | Legal review before public launch (ADR 0011) |
| B6 | Human review of Hán-Việt (103 kanji) and Vietnamese meanings/examples (331 words, 42 grammar points, lessons 1–20; plus lessons 21–30 (146 words, 20 grammar points), the kaigo, restaurant and IT packs (`content/source/packs/*.ts`, 58 non-N5 kanji); 料理, 弁当, 日本語 Hán-Việt set by hand) | P2 | P2 acceptance needs a native reviewer; content was authored by the agent and cross-checked against KANJIDIC2/Unihan (0 mismatches) but not reviewed by a person | Content ships with `hanVietReviewed: false` / `meaningsViReviewed: false` | Reviewer edits `content/source/n5/*.ts`, sets the flags to `true` in the ingest, runs `npm run ingest:n5` |

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
| F8 | ~~Timed JLPT N5 mock exam~~ – done: `/tests/mock`, 32 questions, 30 min; timer is client-side only (server does not check elapsed time) | P7 (roadmap) |
| F9 | ~~`row` layout of WordCard not used~~ – done: related words on kanji pages are a row list linking to word pages | P5 |
| F10 | ~~Admin 2FA enable UI~~ – done: `/me` enables TOTP with the password, shows the key and backup codes once; sign-in asks for the code. Role admin is still granted only by hand in the DB. No QR code (needs a library) and no disable button yet | P3 gap |
| F11 | ~~Admin 404 returns HTTP 200~~ – done: `src/proxy.ts` rewrites non-admins to a real 404; `requireAdmin` stays the authority | P3 gap |
| F15 | Proxy matcher `.*\..*` is a JS string, so `\.` becomes `.` (any char) and next-intl runs only on `/`. Locale-less paths like `/kana` give 404 instead of redirecting. Fixing it runs next-intl on every page (cookies, caching) – decide and test | found during F11 |
| F12 | Cloud voice works through `/api/tts` and the user setting, but `AudioButton` still uses the device voice; TTS per-user quota and audio caching (R2, B1) are not built | P3 gap |
| F13 | ~~Daily AI budget not enforced~~ – done: over `AI_DAILY_BUDGET_USD` (default 5, unreadable → 0) paid providers are swapped for the free mock. **Owner:** confirm the number | P3 gap |
| F14 | Gateway adapter is a stub (returns unavailable); the universal gateway spec is needed | after owner spec |
| F16 | AI chat tutor (F8) is off by default (P5 decision D5). **Owner:** turn it on in /admin when a real provider is configured for mode `tutor`; with the mock, learners see a "demo" banner. The `/chat` page answers 404 content while off, but its HTTP status may be 200 (notFound inside a Suspense boundary); the API returns a real 404 | P5 |
| F17 | Chat thread history lives only in the browser tab (sessionStorage) – a logged deviation from F8 "lịch sử theo thread" (P5 decision D4). Move to server tables (`src/lib/chat-history.ts` is the single swap point; export/delete must then include them) if learners ask for history across devices | P5 |
| F18 | Streak share card is a canvas PNG the learner downloads; no public share URL (P5 decision D7). A `next/og` route needs a public, rotatable id and a privacy decision | P5 |
| F19 | More STT engines: Azure Pronunciation Assessment (phoneme-level scoring, needs an Azure key and region) and Whisper via openai-compatible/gateway. Add each as one `SttProvider` in `src/lib/speech/stt/` (P6 decision E6: no stub files until then) | P6 / after owner keys |
| F20 | Speaking score is computed in the browser and sent by the client (audio never reaches Japky), so a learner could post any score for their own progress; XP is capped at 2 per word per day. Acceptable for a beta; server-side scoring comes with Azure/Whisper (F19) | P6 |
| F21 | Speaking practice over the learner’s own SRS words (`/speak` without a lesson, P6 decision E1 option b) and sentence-level scoring | P6 later |
| F22 | Offline SRS review (P7 decision G6 option b): ratings queued in IndexedDB and synced later. Today the service worker only serves visited public pages offline; review needs the network. Bump `VERSION` in `public/sw.js` whenever caching rules change | P7 later |
| F23 | Pages that call `notFound()` after the static shell has streamed (`/speak/999`, unknown `/embed/streak/<id>`, `/chat` while off) show the not-found content but answer HTTP 200. Fix needs `dynamicParams`/proxy rewrites per route, like `/admin` (F11) | P6/P7 |
| F24 | JLPT N5 mock: add a listening section (needs recorded or pre-generated audio, B1) | P7 later |
| F25 | Song line translations (vi/en) and AI keywords: the `lyrics-translate` / `lyrics-keywords` modes exist but the environment has no AI key, so songs ship with rule-based keywords and no line translations (P8 decision H4). **Owner:** set `AI_PROVIDER`/`AI_PRESET`/key, run `npm run build:songs`, review the output in a PR | P8 / after AI key |
| F26 | Word-level highlight (Enhanced LRC): none of the 22 LRCLIB entries has word sync, so only line highlight ships | P8 later |
| F27 | Song takedown contact: set `NEXT_PUBLIC_CONTACT_EMAIL` (owner) — until then song pages say the contact address is coming. Removal = add the slug to `content/songs/removed.json` and rebuild. Privacy page should also link Google’s privacy policy for the YouTube player (docs/07 §4) | P8 / owner |
| F28 | Rule-based lyric furigana misses some readings (names, ateji): 1 of 22 songs (Flamingo, 5.1%) is above the 5% unread-kanji flag and shows a note; lyrics, furigana and timing are community data, unreviewed. Lyrics copyright remains the owner-accepted v1 risk (docs/07 §4) | P8 |
| F29 | AI cost is now priced per model (`PRICES` in `src/lib/ai/adapters/openai-compatible.ts`, USD per 1M input/output tokens) so the F13 budget can trigger. The numbers are estimates; a model without a price (e.g. `motapi` `default`) counts at the high `UNKNOWN_PRICE`. When the provider reports no usage, upper bounds are counted. **Owner:** confirm the prices for the models actually used, or set `AI_PRICE_IN_PER_M` / `AI_PRICE_OUT_PER_M` | review 2026-11-10 |
| F30 | Review round 2 follow-ups ([REVIEW-2026-11-10-2](docs/REVIEW-2026-11-10-2.md) N1–N8): N1 (Medium) chat abort before the first word refunds and records no cost although input tokens were billed — record an input-cost estimate once the provider is called; N3/N4 harden chat cost recording (guard finally, finite usage only); N2 cloze+loop pause timing; N5 keep partial answer on provider error; N6 XP UI after a lost race; N7 budget date vs user local date; N8 SW `waitUntil` | P5–P8 review |

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
