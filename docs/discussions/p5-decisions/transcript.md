# Transcript: P5 open decisions

## Round 1 — critique

### M1.1 — PM (product-manager)
Position: Ship minimal privacy-safe P5 slice now; skip what needs external accounts or creates public-URL/PII risk.
Responds to: none (first round)
Points:
- D1 (a) Build now. P5 acceptance is "add to SRS with 1 button"; lessons 11–20 precedent for unreviewed note. Waiting on B6 stalls entire phase. (evidence: roadmap P5 lines 60–66)
- D2 (a) Pack holds word ids; extend shared word set. Avoids duplicate words with separate SRS state; one source of truth, least code.
- D3 (a) Streaming. Roadmap explicitly says "SSE" — it's the acceptance criterion. Mock provider keeps it testable. (evidence: roadmap line 66)
- D4 (b) Client-only history, server sends last N turns. Beta tutor; avoids new PII tables, delete/export scope. Revisit if beta users ask for persistence.
- D5 (a) Visible to all signed-in users. Gates (sign-in, 16+, consent, 20/day) already exist. Page must label mock as "demo answers, not a real tutor" so users are not misled. Flag adds scope without safety gain.
- D6 (a) Build opt-in setting + EmailTransport interface + console transport + dry-run job. Resend wiring stays B4. Setting must be explicit opt-in, separate consent, visible off-switch (no dark patterns).
- D7 (b) Client-side canvas image, user downloads. No public URL, no ID-guessing risk, public pages stay static. Defer (a) to backlog.
Questions: dev — does extending word set break static checks or existing SRS ids?
Research requests: none
Confidence: Medium
Converge? yes — unless dev shows D2(a) or D3(a) cost exceeds "minimal code" constraint significantly.

### M1.2 — BA (project-analyst)
Position: Build D1–D4, D6 as specced; gate D5 with flag; D7 client-only. Scope fixed by F8/P5 text.
Responds to: none (round 1)
Points:
- D1 (a) build now. P5 acceptance is "Thêm vào SRS bằng 1 nút" (09-ROADMAP.md:64); lessons 11–20 shipped unreviewed (:65). AC: ≥50 words + related kanji; `validate-content` passes; "unreviewed" note shown; both review flags false; B6 covers pack.
- D2 (a) ids-only pack JSON. Avoids duplicate word objects; WordCard/SRS paths unchanged. AC: every pack id resolves in word set; no duplicate ids; added words carry `tags:['pack:kaigo']`; one button adds whole pack; re-click creates no duplicate SRS cards; kaigo pack page static.
- D3 (a) streaming. F8 says "Route Handler SSE" (02-FEATURES.md:204); roadmap "SSE" (:66) — (b) contradicts spec. AC: mock streams fixture chunks; unauth/guest/<16/no `ai_processing` consent/over-quota refused before stream opens; provider failure or client abort ends stream cleanly; partial message not double-counted against 20/day; CSP not broken.
- D4 (a) server tables. F8 requires "lịch sử theo thread" (:204). AC: threads+messages included in account delete and data export; user can delete a thread; last N turns only sent to model; no PII to AI; owner-only read.
- D5 (b) `app_settings` flag, default off. Mock-only chat presented as live tutor misleads users (F2 no dark patterns). AC: page and API return 404 when flag off; UI labels "demo" when mock provider active; flip requires no code change.
- D6 (a) with gates. AC: opt-in, separate consent, default off; unsubscribe one-click in every email; script only sends in chosen hour, reads user timezone; no double-send per day; Resend wiring stays B4.
- D7 (b) client-side canvas download. Public og route needs non-guessable id exposing identity; CSP/static rules make it costly; roadmap row has no AC (:67). AC: no upload; image shows no PII beyond streak count + user-chosen display name; guest sees sensible state. Move (a) to backlog.
Questions: PM — is "demo" labelling enough for D5 if owner prefers visible beta?
Research requests: none
Confidence: Medium
Converge? yes — would change D7 if owner wants public share links for growth; D5 if mock is clearly labelled and cheap.

### M1.3 — dev (nextjs-developer)
Position: Build D1 a, D2 a, D3 b, D4 b, D5 b, D6 a, D7 b — smallest code, no new public surface.
Responds to: none (round 1)
Points:
- D1 a: build now with "unreviewed" note and reviewed flags false, like lessons 11–20; waiting on B6 blocks the whole pack. Low cost if `scripts/ingest/build-n5.ts` and `validate-content.ts` checks are reused. Risk: unreviewed Vietnamese meanings.
- D2 a: pack JSON holds word ids only; one word store, so SRS and learning code (`src/lib/learning.ts`) need no change. Risk: adding words to the N5 set may break the validator and level counts; mitigate with `pack:kaigo` tag and a validator rule that every id resolves.
- D3 b: one JSON response per message. `streamText` touches `AiProvider`, mock, SSE parsing and a Route Handler; CSP `connect-src 'self'` allows same-origin fetch, so not the blocker — the cost is chunk edge cases and tests. Streaming adds little for a 20-message/day beta; revisit after P5.
- D4 b: sessionStorage plus last N turns in the request. New tables also need migrations, export, delete and PDPL retention. Defer until chat proves useful.
- D5 b: `app_settings` flag, default off, so the mock is never shown as a real tutor. API must enforce it, not only the UI. If on with the mock provider, show a "demo" label.
- D6 a: opt-in setting, `EmailTransport` interface with a `console` transport, `scripts/send-reminders.ts` dry-run by default. Risk: reminder-hour timezone handling; opt-in must be consent-logged. B4 stays in backlog.
- D7 b: client-side canvas download, no public URL. `img-src` already allows blob: and data:.
Questions: BA — do F2/F3/F8 acceptance criteria require streaming or persisted threads? If yes, D3 and D4 flip.
Research requests: none
Confidence: Medium (did not read F2/F3/F8 acceptance criteria)
Converge? yes — unless the acceptance criteria require streaming, persistence or a shareable link.

### Moderator note (round 1)
- Agreed 3/3: D1 (a), D2 (a), D6 (a), D7 (b).
- Open disagreements:
  - D3 streaming: M1.1 (a) + M1.2 (a) vs M1.3 (b). F8 text (02-FEATURES.md:204) says "Chatbox streaming (Route Handler SSE)"; roadmap P5 says "SSE".
  - D4 thread history: M1.2 (a, F8 says "lịch sử theo thread") vs M1.1 (b) + M1.3 (b).
  - D5 access: M1.1 (a, visible + demo label) vs M1.2 (b) + M1.3 (b, flag default off).
- Questions between roles: dev → BA answered by moderator: F8 (02-FEATURES.md:202–208) has no checkbox AC list; its bullets say "Chatbox streaming (Route Handler SSE), lịch sử theo thread". PM → BA/dev: is demo labelling enough for D5?
- Research requests: none
- Converge votes: 3/3 (with conditions) — round 2 limited to D3, D4, D5.

## Round 2 — critique (D3, D4, D5 only)

### M2.1 — PM (product-manager)
Position: D3 (b) non-streaming, D4 (b) client-only, D5 (a) visible to signed-in users with mandatory demo label — changed D3, held D4/D5.
Responds to:
- M1.3 D3 agree: drop (a). F8/roadmap say "SSE" but F8 has no AC checklist; roadmap AC line is "add to SRS with 1 button". Mock streaming proves nothing for users; chunk edge cases, abort, partial-quota rules are scope for a 20 msg/day beta. Accept deviation from spec wording if logged and provider interface can add streaming later.
- M1.2 D3 disagree: spec wording doesn't outweigh cost; no evidence streaming is a ship gate.
- M1.2 D4 disagree: "lịch sử theo thread" is met by in-session threads; server tables add migration/export/delete/PDPL scope.
- M1.3 D4 agree.
- M1.2/M1.3 D5 disagree: demo labelling is enough; gates exist. Flag default off ships nothing visible in P5 and adds an owner step.
Points:
- D5 compromise: mandatory "demo answers, not a real tutor" banner whenever mock is active; if a flag is cheap it should default ON.
- Log D3/D4 deviations from F8 wording in docs so a later phase can reopen them.
Questions: BA — is a logged deviation from F8 wording acceptable for D3/D4?
Research requests: none
Confidence: Medium
Converge? yes — would change D4 only if owner says chat history must survive across devices.

### M2.2 — BA (project-analyst)
Position: D3 (a) streaming, D4 (a) server tables, D5 (b) flag default off + demo label. Final.
Responds to:
- M1.3 D3 (b) disagree: F8 names "Route Handler SSE", roadmap "SSE". Dev's only argument is cost; the brief asks for least code that meets the criteria, and (b) fails them. CSP point accepted.
- M1.1 D3 (a) agree; keep guards: refuse before stream opens, count once, clean abort.
- M1.3/M1.1 D4 (b) disagree: "lịch sử theo thread" is a stated requirement; sessionStorage is lost on tab close. Tables add scope (account delete + export in AC). If owner prefers (b), they can drop the F8 bullet.
- M1.1 D5 (a) disagree (answers PM's question): demo label alone is insufficient. Flag is one app_settings row + 404 check enforced in API too (M1.3). Flag on + mock active → demo label.
Points:
- Tie D4 to D3: persist user message before streaming; persist assistant message only on stream completion.
Questions: none
Research requests: none
Confidence: Medium
Converge? yes — would move on D4 only if owner drops the thread-history line from F8.

### M2.3 — dev (nextjs-developer)
Position: D3 flips to (a) streaming; D4 stays (b) with thread-scoped client storage; D5 stays (b) flag, default off.
Responds to:
- M1.1/M1.2 D3 agree: F8 says "Route Handler SSE" (moderator note). My M1.3 objection was cost only, and it is bounded, so I drop it. Adopt M1.2's ACs: guards before the stream opens, abort/provider error refunds quota, partial message not double-counted.
- M1.2 D4 disagree: F8 says "lịch sử theo thread", not server-side. Per-thread history in sessionStorage meets that text. Delete/export/retention ACs only apply if we persist; the export route hand-lists 9 tables (src/app/api/me/export/route.ts).
- M1.1 D4 agree: revisit when beta users ask for persistence.
- M1.1 D5 disagree: demo label doesn't stop a mock from reaching every signed-in user; the flag is cheap (`appSettings` + admin upsert exist, admin/actions.ts:39, registry.ts) — only a new key.
Points (cost estimates, not evidence):
- D3 (a) ≈ 6 files / 250 LOC; (b) ≈ 120 LOC.
- D4 (a) ≈ 5 files / 200 LOC; (b) ≈ 20 LOC.
- D5 (b) ≈ 25 LOC.
Questions: none
Research requests: none
Confidence: Medium
Converge? yes — D4 → (a) only if owner/PM says threads must survive reload/device change; D5 → (a) if PM accepts demo label as sole safeguard.

### Moderator note (round 2)
- Tally: D3 (a) 2 [M2.2, M2.3] vs (b) 1 [M2.1]; D4 (b) 2 [M2.1, M2.3] vs (a) 1 [M2.2]; D5 (b) 2 [M2.2, M2.3] vs (a) 1 [M2.1, accepts a flag if default ON].
- Open disagreements: D3 M2.1 vs M2.2/M2.3; D4 M2.2 vs M2.1/M2.3; D5 M2.1 vs M2.2/M2.3.
- Questions between roles: PM → BA: is a logged deviation from F8 wording acceptable? (answered in effect by M2.2: only if the owner drops the bullet).
- Research requests: none
- Converge votes: 3/3 conditional. Round 3 = converge on D3, D4, D5.

## Round 3 — converge (D3, D4, D5)

### M3.1 — PM (product-manager)
Position: Accept majority — D3 (a) streaming, D4 (b) client-only history, D5 (b) flag. Moving on D5.
Responds to: M2.2 D5 agree (flag = one app_settings row + API 404 check; mock tutor to every signed-in user is a bigger risk than one owner step); M2.3 D5 agree (~25 LOC, reuses appSettings + admin upsert); M2.2/M2.3 D3 agree (cost bounded ~250 LOC; F8 + roadmap say "SSE"); M2.2 D4 disagree but accept majority (per-thread sessionStorage meets the F8 text; export route hand-lists 9 tables).
Points:
- Keep the demo banner whenever the flag is on and the mock provider is active (M2.2).
- Log the D4 deviation; persistence returns if beta users ask (M2.1).
Questions: none · Research requests: none · Confidence: Medium · Converge? yes

### M3.2 — BA (project-analyst)
Position: Accept majority D3 (a), D4 (b), D5 (b). Moving on D4; D5 unchanged.
Responds to: M2.3 D3 agree (guard ACs adopted; F8/roadmap "SSE" holds); M2.1 D3 disagree (cost bounded, (b) deviates from F8); M2.3 D4 agree — changed (F8 has no AC list; sessionStorage per thread satisfies the text; export/delete scope only applies if persisted); M2.1 D5 disagree (default off is safer; a mock must not reach users as a tutor).
Points:
- Log the D4 deviation in docs; reopen if the owner wants cross-device history.
- D5 ACs: API and page 404 when flag off; demo label when mock active.
Questions: none · Research requests: none · Confidence: Medium · Converge? yes

### M3.3 — dev (nextjs-developer)
Position: Accept majority: D3 (a), D4 (b), D5 (b) flag default off + demo label when mock is active.
Responds to: M2.2 agree on D3 guards (refuse before stream opens, count once, clean abort, refund on provider error) and D5; M2.2 disagree on D4 (F8 says "lịch sử theo thread", not server-side); M2.1 disagree on D5 (label alone doesn't stop the mock reaching every signed-in user); M2.1 agree to log D3/D4 deviations.
Points:
- D4: per-thread client storage, last N turns per request, history behind one small module so a later swap to server tables is cheap.
- D5: API must 404 when flag off, not only the UI (M1.3).
Questions: none · Research requests: none · Confidence: Medium · Converge? yes

### Moderator note (round 3)
- Open disagreements: none — 3/3 accept D3 (a), D4 (b), D5 (b).
- Questions between roles: none
- Research requests: none
- Converge votes: 3/3
