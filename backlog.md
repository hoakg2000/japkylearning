# Backlog – blockers & follow-ups

Items that could not be finished while implementing the roadmap phases. Each has: why it is blocked, the current fallback, and what is needed to close it.

## Blockers (need the owner or an external account)

| # | Item | Phase | Why blocked | Current fallback | Needed |
|---|------|-------|-------------|------------------|--------|
| B1 | Pre-generated audio (fish.audio → Cloudflare R2) for kana, words, examples | P1/P2 | No R2 bucket / fish.audio key in this project; production use needs a commercial fish.audio plan and a signed voice release (ADR 0012, 05-AI-SPEECH §2) | Device voice via Web Speech API (`src/lib/speech/tts.ts`); `audioUrl` is optional in all content schemas and is used automatically when present | R2 bucket + public domain, `FISH_AUDIO_API_KEY`, chosen voice id with consent; then write `scripts/build-audio.ts` |
| B2 | Cloudflare Turnstile on anonymous-user creation and sign-up | P1 | Needs site + secret keys; widget script also needs a CSP change (`challenges.cloudflare.com` in `script-src`/`frame-src`) | Better Auth built-in rate limit (30 req/min/IP) | Turnstile keys; enable Better Auth `captcha` plugin + client widget |
| B3 | Production database and deploy | P0–P2 | No Neon project / Vercel project connected | Embedded PGlite in `.data/pglite` (auto-migrated) | `DATABASE_URL` (Neon ap-southeast-1), Vercel project pinned to `sin1`, `npm run db:migrate` in the deploy pipeline, real `BETTER_AUTH_SECRET` |
| B4 | Email verification, password reset, reminder emails | P1 | Needs an email provider (Resend) and a verified sending domain | Sign-up works without email verification; no password reset yet | Resend API key + domain; wire Better Auth `sendVerificationEmail` / `sendResetPassword` |
| B5 | Legal review of the privacy page and consent flow (PDPL 91/2025) | P1 | Needs a lawyer | Draft page at `/privacy`, per-purpose consents stored in `consents`, export + delete in `/me` | Legal review before public launch (ADR 0011) |

## Follow-ups (no blocker, scheduled later)

| # | Item | Phase |
|---|------|-------|
| F1 | Admin area with mandatory 2FA (plugin is enabled, no admin pages yet) | P3 |
| F2 | Purge job for anonymous users inactive > 30 days (Vercel Cron) | P3/P4 |
| F3 | Timezone change limited to once per day (`timezone_changed_on` column exists, no UI to change timezone yet) | P2+ |
| F4 | Mnemonic images for kana | P1 (nice to have) |
