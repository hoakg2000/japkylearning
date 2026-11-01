# Summary: Features buildable without owner approval

- Goal: decide
- Rounds run: 2 of 2 — stopped because rounds reached (converged 3/3)
- Participants: pragmatist (none), skeptic security + scope (none), user advocate (none)

## Outcome
Build 11 items now, in this order (M2.1 list, accepted by M2.2 and M2.3 with small changes). Each keeps lint, typecheck, test, build and e2e green. Agent-authored content ships `reviewed:false` with a visible "unreviewed" badge (M2.2, M2.3).

Checklist (status updated during implementation):
- [x] 1. F7 missed kana → SRS. Check: one `kana` card per miss, no duplicate on repeat; "ち" shows in /review same day; no destructive migration (M2.1, M2.3, M1.2).
- [x] 2. F6 mature directions. Check: new card one direction; reverse only when `isMature`; existing rows unchanged (M2.1).
- [x] 3. F3 timezone UI. Check: server validates IANA zone; second change same day refused with vi/en message (M2.1, M2.3).
- [x] 4. R3 axe on lesson, kanji, review, me. Check: 0 serious/critical (M2.1).
- [x] 5. F11 admin HTTP 404. Check: non-admin gets 404; in-page gate stays the authority; proxy may only add 404 (M2.1, M2.2).
- [x] 6. F10 2FA enable UI. Check: password re-auth; backup codes once; secret never logged; no path grants admin; no email/SMS; e2e enables TOTP (M1.2, M2.1).
- [x] 7. F2 anonymous purge script. Check: dry-run default, `--apply` to delete, only `isAnonymous=true`, cutoff on last activity, counts-only logs, no HTTP route (M1.2, M2.1, M2.2).
- [x] 8. F13 daily AI budget enforcement. Check: fails closed; mock cost 0; cap from env only; client never supplies cost (M1.2, M2.1).
- [x] 9. F9 WordCard row list. Check: axe clean, readable at 360px (M2.1, M2.3).
- [x] 10. Lessons 11-20. Check: ingest 0 errors, cross-check 0 mismatches, `reviewed:false` + banner, one tap to SRS (M2.1, M2.2, M2.3).
- [x] 11. F8 N5 mock exam. Check: timer survives refresh, scoring correct, wrong answers to SRS, small phones (M2.1, M2.3).

## Agreed
- Learner fixes first, then axe, then admin work (M2.1, M2.3).
- F2 is a dry-run CLI script, not a route (M1.2, M2.1, M2.2, M2.3).
- F12 deferred: cloud TTS needs a key and has no per-user quota (R01, M2.1, M2.2, M2.3).
- F13 enforcement built; numbers are the owner's (M2.1, M2.2, M2.3).
- F10 and F11 separate commits, gate unchanged (M2.1, M2.2).
- Every `reviewed:false` item gets a visible badge (M2.2, M2.3).
- Not built: share card, F5, F4, F14, B1-B6, R1, R2, R4-R7, P8 (M2.1, M2.2, M2.3).

## Open disagreements
- Kaigo pack: user advocate builds it with an unreviewed marker after lessons 11-20 (M2.3) vs pragmatist and skeptic wait for B6/owner (M2.1, M2.2). 2/3 → not built.
- AI chat demo: skeptic builds it behind a flag with mock only (M2.2) vs pragmatist and user advocate leave it out (M2.1, M2.3). 2/3 → not built.

## Key evidence
- R01: /api/tts needs a signed-in non-anonymous user and an enabled voice, no per-user quota; AudioButton never calls it (High).
- M1.2: `src/lib/admin.ts` gates on role admin + `twoFactorEnabled`.

## Risks and unknowns
- Cache Components may block a real 404 for F11 (M1.1).
- F6/F7 write SRS data; a bad change could damage rows.
- TOTP secret storage format and plugin delivery not verified (M1.2).
- Lessons 11-20 are unreviewed Vietnamese content; B6 stays open (M2.3).
- Effort sizes never checked against code.

## Next steps
- Main session: work items 1-11 in order, one commit each, full checks.
- Owner: F13 numbers, F12, kaigo pack, AI chat demo, share card, F5, F4, F14, B1-B6.
