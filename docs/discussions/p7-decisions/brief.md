# Brief: P7 open decisions (finish N5: lessons 21–30, packs, widgets, PWA)

- Goal: decide
- Date: 2026-11-10
- Rounds: 3 (max) · Word limit: 230 · Model: sonnet

## Question
The agent implements P7 (`docs/09-ROADMAP.md`): lessons N5 21–30 + JLPT N5 mock; restaurant + IT packs; widgets `word`, `word-of-the-day`, opt-in streak embed; PWA (manifest, offline deck). Decide:

- **G1 Lessons 21–30.** (a) Author now with the lessons 11–20 rules (≤ 18 words, 2 grammar points, dialogue, unreviewed flags, B6) covering the remaining N5 grammar (te-form chains, plain/dictionary form, ~た form, ～と思います, ～でしょう, ～つもり, counters, ～ている…), ~150 new words; (b) fewer lessons now (e.g. 21–25) and the rest later; (c) backlog + skip until B6.
- **G2 JLPT N5 mock.** Already shipped (F8, `/tests/mock`, 32 questions/30 min). (a) Mark done; its pool grows automatically with lessons 21–30; (b) add a second exam format (listening section).
- **G3 Restaurant + IT packs.** (a) Build now with the kaigo pack system (≥ 40 words each, unreviewed); (b) backlog until B6.
- **G4 Word of the day.** (a) Deterministic pick from N5 words by Vietnam date, page `/embed/word-of-the-day` rendered with a daily cache (cacheLife 'days') so it stays mostly static; (b) client-side pick in a static page (date from the viewer's clock).
- **G5 Streak embed `/embed/streak/[publicId]`.** Spec: opt-in, off by default, random id the user can rotate, only public data, no cookies. (a) Build now: `user_settings.streak_public_id` (null = off), toggle + rotate in `/me`, embed page reads the streak (dynamic, no session); (b) backlog (needs a privacy decision).
- **G6 PWA offline deck.** (a) Manifest + small hand-written service worker: cache the app shell and visited static pages (lessons, words, kanji, packs) for offline reading; review needs the network; (b) (a) plus offline SRS review with ratings queued in IndexedDB and synced later; (c) manifest only.
- **G7 "Get embed code" page.** (a) One page `/[locale]/embed-code` to choose widget (kanji/word/word-of-the-day/streak), theme and language and copy the `<iframe>`; (b) keep per-page embed snippets only.

## Constraints
- Next.js 16 with cacheComponents, static CSP (ADR 0013; `/embed/*` gets `frame-ancestors *`, no cookies), public pages static (`scripts/check-static.mjs`), next-intl `/vi` `/en`.
- No new dependency unless needed (no workbox/next-pwa unless decisive). No real money, legal or external accounts. Least code meeting the roadmap row and F12.
- Reading list: `docs/09-ROADMAP.md` (P7), `docs/02-FEATURES.md` (F4, F5, F12), `docs/08-NFR.md`, `backlog.md`, `src/app/embed/`, `src/components/embed-code.tsx`, `next.config.ts`, `src/lib/content/n5.ts`, `content/source/n5/lesson-20.ts`.

## Participants
| # | Role | Persona |
| --- | --- | --- |
| 1 | PM | G:\project\jacky-the-skiller\agents\product-manager.md |
| 2 | BA | G:\project\jacky-the-skiller\agents\project-analyst.md |
| 3 | dev | G:\project\jacky-the-skiller\agents\nextjs-developer.md |

## Research questions
None at start.

## Research digest
- none
