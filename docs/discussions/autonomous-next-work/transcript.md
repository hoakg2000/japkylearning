# Transcript: Features buildable without owner approval

## Round 1 — critique

### M1.1 — pragmatist (none)
Position: build the small code-only follow-ups first, then content and features, and leave out anything that needs an owner decision or a provider. I judged effort from backlog.md and the brief only. I did not open src/ or 09-ROADMAP.md, so the S/M/L sizes are estimates.

Ordered checklist (all green on lint, typecheck, test, build and e2e):
1. F11, admin HTTP 404, S. Check: an e2e request to `/admin/x` as a non-admin returns status 404. If Cache Components blocks a real 404, fall back to a `proxy` or route-level check.
2. F10, 2FA enable UI, M. Check: an e2e run signs in as admin, enables TOTP with a code generated in the test, and `/admin` opens. This is also the code-only part of R8.
3. F7, missed kana to SRS, S. Check: a unit test shows a wrong kana answer creates a `kana` SRS item, and a repeat miss does not create a duplicate.
4. F6, mature directions unlock, S. Check: a unit test on `isMature` shows production and reading cards appear only after the recognition card is mature.
5. F3, timezone change UI, S. Check: a second change on the same day is rejected, and the first one updates `timezone_changed_on`.
6. F13, daily AI budget enforcement, M. Check: a test with a mock provider shows calls are refused once spend reaches `AI_DAILY_BUDGET_USD`, and the budget is read from env only.
7. F2, anonymous purge job as code only, S. Check: a unit test shows only anonymous users inactive for more than 30 days are deleted. Add a route guarded by a secret from env, and leave the cron wiring for later.
8. F9, WordCard row list page, S. Check: the page renders the `row` layout and passes axe.
9. R3, axe on lesson, kanji, review and me pages, S. Check: the e2e axe run has no serious or critical violations on each page.
10. F12 part 1, AudioButton uses the cloud voice setting, M. Check: with the setting on and `/api/tts` mocked, the button plays that audio, and it falls back to the device voice when the call fails. Build the per-user TTS quota with a mock only.
11. P5 lessons 11-20, L. Check: ingest validates against the schema, with `reviewed: false` on all new content.
12. P5 AI chat beta against the mock provider, M. Check: the kill-switch, quota and budget from item 6 all apply.
13. P5 share card (OG image), M. Check: the OG route returns a PNG and makes no third-party network calls.
14. F8 N5 mock exam (P7), L. Check: a timed run scores correctly, using existing N5 content.

Exclude: B1-B6, R1, R2, R4-R7 (external account, legal review or a human); F14 (owner spec); F4 (art-dependent); P5 kaigo pack (domain-sensitive, needs B6); F5 (conflicts with static public pages, design decision); P8 songs.

Questions: skeptic, is the F10 TOTP secret storage and the F2 purge route's secret guard acceptable as described?
Research requests: none
Confidence: Medium
Converge? no — needs the skeptic's view on items 6, 7, 12 and the user advocate's view on lessons 11-20 vs small fixes.

### M1.2 — skeptic, security + scope (none)
Position: Most candidates are safe. Six need guardrails, and two should wait for the owner: F12 (cloud TTS) and the kaigo pack.

- F10 (2FA enable UI): do it, but it is the highest-risk item. `src/lib/admin.ts:15` gates on role === 'admin' and `twoFactorEnabled`. Guardrails: TOTP enable must require password re-auth; show backup codes once only; never log or return the TOTP secret outside the enroll response; no path that grants role admin (role stays manual/seed); e2e test that a non-admin with 2FA still gets 404. Confirm the twoFactor plugin sends nothing by email or SMS.
- F11 (admin HTTP 404): safe, but if the fix needs a proxy that reads the session, it must not weaken the F10 gate. Keep the in-page check as the authority.
- F2 (purge job): destructive. Ship as an `npm run` script, not a cron route. Dry-run by default; deletion needs `--apply`. Select only `isAnonymous=true`, never admin or any user with an email. Tested cutoff on last activity, not createdAt. Log counts only. No public HTTP route; cron waits for B3.
- F13 (AI budget): numbers are an owner decision. Enforcement fails closed; mock cost counts 0; never trust client cost; per-day counter in DB is fine; default stays in env.
- AI chat beta (mock): only if mock stays the sole provider. Reuse kill-switch and quotas; cap input length with zod; render output as text, never HTML; do not log prompts; F14 stays a stub.
- F12: defer. Cloud voice and caching depend on B1. At most switch `AudioButton` to `/api/tts` with device fallback, but that is a UX change the owner should confirm.
- Agent-authored content: every item ships `reviewed:false`, excluded from "verified" badges, same KANJIDIC2/Unihan cross-check. Lessons 11–20 acceptable. Kaigo should wait for B6 or carry a visible "unreviewed" marker.
- Share card: no PII or display name by default; no external font or network fetch.
- F3: validate IANA zone on the server; enforce once per day on the server.
- F5, F6, F7, F9, R3 low risk. F6/F7 write SRS data, migrations must be backward compatible. F8 fine.

Questions: pragmatist — Can F10 and F11 be one change without touching the gate? | user advocate — Would an unreviewed kaigo pack harm learners?
Research requests: Does `/api/tts` enforce auth and a per-user limit today? Scope: `src/app/api/tts`, `src/lib/speech`.
Confidence: Medium
Converge? no — wants the guardrails accepted as acceptance checks, and F12, kaigo and F13 numbers moved to owner-decision list.

### M1.3 — user advocate (none)
Position: Order by learner payoff. Small learner-facing fixes first (F7, F6, F3), then lessons 11-20 (core value), then kaigo pack, then N5 mock. AI chat and share card go last or stay out.

1. F7: beginners fail on kana first; schema supports `kana`. Check: miss "ち" in a quiz, it shows up in /review the same day.
2. F6: `isMature` exists, only wiring. Check: new card shows one direction; after maturity the reverse appears; immature never shows it.
3. F3: workers moving UTC+7 → UTC+9 can break streaks. Check: change timezone, streak and "due today" follow; second change same day refused with a clear message.
4. Lessons 11-20, biggest value. Ship `reviewed:false`; one-tap add to SRS; 0 ingest errors; visible unreviewed banner/flag; KANJIDIC2/Unihan cross-check 0 mismatches.
5. Kaigo pack (50+ words) before mock exam; unreviewed flag; one button adds the whole pack, idempotent.
6. F8 mock exam only after lessons 11-20. Timer survives refresh; wrong items can go to SRS; works on small phones.
7. F9 together with item 5. F5 defer.
8. F10/F11 admin-only, release hygiene (R8). F12 skip (needs key). F13 safety, not learner feature.
9. AI chat on mock: low value, may mislead; if built, label "demo" behind a flag. Share card skip.
10. R3 cheap, slot right after small fixes.

Questions: pragmatist — is client-side F5 acceptable? | skeptic — does unreviewed Vietnamese content need a visible label?
Research requests: none
Confidence: Medium
Converge? no — wants pragmatist cost estimates and skeptic view on unreviewed content.

### Moderator note (round 1)
- Open disagreements: M1.1 vs M1.3: kaigo pack (exclude vs build with unreviewed flag); M1.1 vs M1.2/M1.3: F12 (build part 1 vs defer); M1.1 vs M1.2: F2 purge as secret-guarded route vs CLI script with dry-run; M1.1 vs M1.3: AI chat and share card (build vs skip/demo flag); order — small admin fixes first (M1.1) vs learner fixes first (M1.3); F13 numbers owner decision (M1.2) vs build (M1.1).
- Questions between roles: skeptic → pragmatist: F10+F11 in one change without touching gate? skeptic → user advocate: does unreviewed kaigo harm learners? user advocate → skeptic: visible label for unreviewed content?
- Research requests: `/api/tts` auth + per-user limit → R01
- Converge votes: 0/3

## Round 2 — converge

### M2.1 — pragmatist (none)
Position: Build small code-only fixes first with the skeptic's guardrails. Then lessons 11-20 and the mock exam. Defer F12, the kaigo pack, the share card and F13's numbers. Effort sizes are estimates (grepped src/: isMature in srs.ts, kana in schema.ts, twoFactor in auth/index.ts and admin.ts).

Responds to:
- M1.2 agree: F2 becomes an `npm run` script, dry-run by default, `--apply` to delete, only `isAnonymous=true` with no email, cutoff on last activity, counts-only logs. Cron waits for B3.
- M1.2 agree: F12 deferred (R01).
- M1.2 agree: F13 enforcement only; fails closed, mock cost 0, default from env; numbers to owner list.
- M1.2 question: F10 and F11 go in two commits. F11 keeps the in-page check as authority; a proxy may only add a 404, never grants access.
- M1.3 agree: order F7, F6, F3 first, then admin work.
- M1.3 agree: kaigo out (needs B6 or a domain expert), even with a flag.
- M1.3 agree: share card and AI chat out.
- M1.3 question: F5 deferred (conflicts with static public pages).

Final ordered checklist:
1. F7 — unit test: a miss creates one `kana` item, repeat miss no duplicate; "ち" in /review same day; migration backward compatible.
2. F6 — new card one direction; reverse only when `isMature`; existing rows unchanged.
3. F3 — server validates IANA zone; second change same day refused with clear message; streak and due follow the zone.
4. R3 — 0 serious/critical axe violations on lesson, kanji, review, me.
5. F11 — e2e: non-admin gets 404; non-admin with 2FA still 404.
6. F10 — password re-auth; backup codes once; secret only in enroll response, never logged; no path grants admin; no email/SMS; e2e enables TOTP and `/admin` opens.
7. F2 — purge script with unit test on cutoff, dry-run, admin exclusion.
8. F13 — fails closed; mock provider refused at cap; cap from env only; client never supplies cost.
9. F9 — row list page passes axe.
10. Lessons 11-20 — ingest 0 errors; `reviewed:false`; visible unreviewed banner; 0 KANJIDIC2/Unihan mismatches; excluded from verified badges; one tap to SRS.
11. F8 mock exam after item 10 — timer survives refresh; scoring correct; wrong answers to SRS; small phones.

Owner-decision list: F12, F13 numbers, kaigo (B6), share card, AI chat, F5, F4, F14, B1-B6, R1, R2, R4-R7, P8.
Questions: none · Research requests: none · Confidence: Medium
Converge? yes

### M2.2 — skeptic, security + scope (none)
Position: Build 12 items now, each with guardrails. Four items go to the owner. Unreviewed Vietnamese content needs a visible label.

Responds to:
- M1.1 on F2: disagree on the route. Dry-run `npm run` script needing `--apply`; a secret-guarded HTTP route would be a public destructive endpoint.
- M1.1 on F10 TOTP secret: acceptable only with M1.2 guardrails.
- F10 and F11 can be one change if F11 stays in-page and no proxy reads the session; keep separate commits.
- M1.3 on the label: agree. Every `reviewed:false` item gets a visible "unreviewed" badge; "verified" withheld. Permanent rule.
- M1.3 on kaigo: domain-sensitive; owner decision unless B6 closes first.
- F12: defer (R01).
- AI chat: build only behind a flag, labelled "demo", mock sole provider. Skip share card.

Build now: 1 F11, 2 F10, 3 F7, 4 F6 (backward-compatible migrations), 5 F3 (server IANA validation, once per day), 6 F2 (CLI, `isAnonymous=true` only, never admin or email), 7 F9, 8 R3, 9 lessons 11-20 (`reviewed:false`, badge, cross-check), 10 F13 (fails closed, mock 0, default in env), 11 F8, 12 AI chat demo (flag, zod cap, text output, prompts not logged).
Owner-decision list: F12 + quota, kaigo, F13 numbers, F5, F14, F4, share card.
Questions: none · Research requests: none · Confidence: Medium
Converge? yes

### M2.3 — user advocate (none)
Position: Learner fixes first, then lessons 11-20. Kaigo waits unless it carries a visible "unreviewed" marker. AI chat, share card and F12 stay out. Admin items in the middle.

Responds to:
- M1.2 question: yes, an unreviewed kaigo pack can harm. Workers use kaigo terms on patients and colleagues; a wrong reading, meaning or politeness level is learned with confidence. Ship kaigo only with per-card and per-pack "unreviewed" marker, after lessons 11-20 and after the marker works there.
- M1.1 on kaigo: partly agree; a marked pack is fine.
- F2: agree with M1.2. F13: agree with M1.2. F12: defer (R01).
- Order: F7, F6, F3 first; F11, F10, F13 right after.

Final order: 1 F7, 2 F6, 3 F3 (clear vi/en message), 4 R3, 5 F9 (readable at 360px), 6 F11 → F10 → F13 with M1.2 guardrails, 7 F2 script with dry-run test, 8 lessons 11-20 (0 errors, 0 mismatches, `reviewed:false` + banner, one tap to SRS), 9 kaigo with marker (idempotent add), 10 F8 (timer survives refresh, wrong items to SRS, small phones).
Excluded: F12, F14, F4, F5, AI chat, share card, P8.
Questions: none · Research requests: none · Confidence: Medium
Converge? yes

### Moderator note (round 2)
- Open disagreements: kaigo pack — M2.3 (build with marker after lessons 11-20) vs M2.1/M2.2 (owner/B6); AI chat — M2.2 (demo behind flag) vs M2.1/M2.3 (out). Majority 2/3 on both: not built now.
- Questions between roles: none
- Research requests: none
- Converge votes: 3/3
