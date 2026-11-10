# Summary: P5 open decisions

- Goal: decide
- Rounds run: 3 of 3 — stopped because rounds reached (round 3 converged 3/3)
- Participants: PM (product-manager), BA (project-analyst), dev (nextjs-developer)

## Outcome
- D1: (a) Build the kaigo pack now (≥ 50 words + related kanji, "unreviewed" note, review flags false).
- D2: (a) `content/source/packs/<sector>.ts` → ingest → pack JSON with word ids only; missing words join the word set with `tags: ['pack:kaigo']`.
- D3: (a) Streaming: `streamText` on `AiProvider` + `POST /api/chat` SSE Route Handler.
- D4: (b) Client-only per-thread history (sessionStorage), last N turns sent per request.
- D5: (b) `app_settings` flag, default off.
- D6: (a) Opt-in setting + `EmailTransport` + console transport + dry-run `scripts/send-reminders.ts`; Resend stays B4.
- D7: (b) Client-side canvas image, user downloads; no public URL; `next/og` route → backlog.

Outcome confidence: High

## Agreed
- D1, D2, D6, D7 3/3 in round 1 (M1.1, M1.2, M1.3).
- D3 (a): M3.1, M3.2, M3.3; F8 + roadmap say "SSE" (M1.2, M2.2); cost bounded ~250 LOC (M2.3).
- D3 guards: refuse before stream opens, count once against 20/day, clean abort, refund quota on provider error (M2.2, M2.3).
- D4 (b): all three in round 3; F8 "lịch sử theo thread" met by per-thread sessionStorage; export route hand-lists 9 tables (M2.3). Keep history behind one small module (M3.3).
- D5 (b): all three in round 3; API and page 404 when flag off; demo label when mock provider active (M3.1, M3.2, M3.3).
- Log D3/D4 deviations from F8 wording in docs (M2.1, M3.1, M3.2).

## Open disagreements
- none (round 3 moderator note). D4 and D5 settled by majority acceptance (BA moved on D4, PM on D5).

## Key evidence
- 02-FEATURES.md:204 — "Chatbox streaming (Route Handler SSE), lịch sử theo thread" (High).
- 09-ROADMAP.md:60–67 — P5 AC "Thêm vào SRS bằng 1 nút", SSE named (High).
- M2.3 — `appSettings` + admin upsert exist (admin/actions.ts:39) → flag ~25 LOC (estimate).

## Risks and unknowns
- Unreviewed Vietnamese meanings in kaigo pack (M1.3).
- Pack words may break validator/level counts (M1.3).
- Reminder-hour timezone handling and consent logging (M1.3, M1.2).
- Owner may want cross-device chat history or public share links — would reopen D4 or D7.

## Next steps
- Implement D1/D2 with a validator rule that every pack id resolves.
- Implement D3 with guard ACs and D5 with flag + 404 on API and page.
- Implement D4 as a client history module, D6 dry-run default, D7 canvas download.
- Log D3/D4 deviations from F8 and the D7 backlog item.
