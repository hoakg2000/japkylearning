# Summary: P7 open decisions

- Goal: decide
- Rounds run: 2 of 3 — stopped because converged (3/3 yes, no open disagreement, no research)
- Participants: PM (product-manager), BA (project-analyst), dev (nextjs-developer)

## Outcome
- G1: (a) author lessons 21–30 now with the 11–20 rules (≤ 18 words, 2 grammar points, dialogue, unreviewed, B6), in two batches (M1.1, M1.2, M1.3).
- G2: (a) JLPT N5 mock already shipped (F8) — mark done; its pool grows with the new lessons; listening section is Later (M1.1, M1.2, M1.3).
- G3: (a) restaurant + IT packs on the kaigo pack system, ≥ 40 words each, unreviewed (M1.1, M1.2, M1.3).
- G4: word of the day = static N5 list + client pick by Vietnam date (Intl 'Asia/Ho_Chi_Minh'), flips at 00:00 for every viewer; no-JS fallback word; boundary test (M2.1, M2.2, M2.3).
- G5: (a) build the opt-in streak embed now with guardrails: nullable random id (128-bit), off by default, toggle + rotate in /me, streak count only, same 404 for unknown/rotated/disabled, no-store, no cookies, privacy line in /me, narrow check-static exemption (M2.1, M2.2, M2.3).
- G6: (a) manifest + hand-written service worker caching the shell and visited static pages; review shows an offline message; never cache /api, auth or the streak embed; versioned cache. Offline SRS sync → backlog (M1.1, M1.2, M1.3).
- G7: (a) one `/[locale]/embed-code` page for all widgets with theme + language; streak only when enabled (M1.1, M1.2, M1.3).

Outcome confidence: High

## Agreed
- G1–G4, G6, G7 3/3 in round 1; G5 3/3 in round 2 after PM changed position on F12 evidence (M2.1).

## Open disagreements
- none

## Key evidence
- F12 (02-FEATURES.md:300–311) specifies the streak embed as opt-in, default off, rotatable id (High).
- Next docs: cacheLife 'days' = revalidate 1 day / stale 5 min / expire 1 week, not midnight-aligned (M2.2, High).

## Risks and unknowns
- Content quality of lessons 21–30 and two packs until B6 review.
- Service worker staleness after deploys; must version and clean caches.
- PDPL review before public launch still needed (08-NFR.md:54).

## Next steps
- Implement in order: lessons 21–25, 26–30, packs, widgets + embed-code page, streak embed, PWA — nextjs-developer.
