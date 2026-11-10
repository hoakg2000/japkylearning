# Transcript: P7 open decisions

## Round 1 — critique

### M1.1 — PM (product-manager)
Position: Ship roadmap row with least code/risk: build now what's static or already built; defer what needs a privacy decision or adds sync complexity.
- G1 (a) with fallback: author 21–30 now under 11–20 rules, flagged unreviewed; if pace slips cut to (b) 21–25 rather than skip.
- G2 (a): mark done; pool grows; listening is Later.
- G3 (a): both packs on kaigo system, 40 words each, unreviewed.
- G4 (a): deterministic Vietnam-date pick + cacheLife days; (b) shows different words per time zone.
- G5 (b): backlog — exposing user data is a privacy decision the owner hasn't made; needs a schema change. Spec it with default "off, rotatable id".
- G6 (a): hand-written SW, shell + visited static pages offline; skip offline SRS sync (b); (c) alone doesn't meet "offline deck".
- G7 (a): build after G4/G5; list only widgets that exist.
Questions: BA — do F12/roadmap make streak embed required in P7? If so, G5 → (a).
Research requests: none · Confidence: Medium · Converge? yes — unless BA shows F12 makes streak embed mandatory in P7.

### M1.2 — BA (project-analyst)
Position: Build G1 a, G2 a, G3 a, G4 a, G5 a, G6 a, G7 a with guardrails for privacy/network.
- G1 (a): AC: every N5 grammar item in brief mapped to a lesson; validator and build pass (09-ROADMAP.md:75).
- G2 (a): AC: pool includes new lessons; 32 q / 30 min unchanged.
- G3 (a): AC: ≥ 40 words each, unreviewed, `/packs/<id>`, add-to-SRS works.
- G4 (a): AC: same word for every viewer on a Vietnam day, no cookies, check-static passes.
- G5 (a): build — F12 specifies it. AC: off by default (null id); toggle + rotate in /me; old id 404 after rotation; only streak count exposed; no cookies/session; unknown id 404.
- G6 (a): AC: installable; visited static pages open offline; review shows a clear offline message; no auth/API responses cached; versioned cache. (b) → backlog.
- G7 (a): AC: iframe code for all widgets with theme + language; copy works; streak option only when enabled.
Questions: PM — is the streak embed public personal data? If so, a one-line privacy note in /me.
Research requests: none · Confidence: Medium · Converge? yes — unless dev finds a CSP/static blocker for G5/G6.

### M1.3 — dev (nextjs-developer)
Position: lean static-first P7 now (G1–G7 all (a)); offline SRS sync is the one item to cut. (Read brief and persona only; costs are estimates.)
- G1 (a): two commits (21–25, 26–30); content volume only; validator + B6 flags per batch.
- G2 (a): no code.
- G3 (a): reuse pack system; check check-static + sitemap.
- G4 (a): cacheLife 'days' can serve a stale word up to a day after midnight → pick by date index with revalidate ≤ 1h; test the date boundary.
- G5 (a): one nullable column + migration, toggle/rotate in /me, dynamic cookieless embed route; /embed outside proxy/session; 128-bit random id; no-store + frame-ancestors *; same 404 for unknown and disabled.
- G6 (a): ~60-line sw.js, precache shell + stale-while-revalidate for same-origin GET pages; never cache /api, streak embed or authed responses; version + clean caches. Reject (b).
- G7 (a): static client page building the iframe string; streak option only when signed in.
Questions: PM — is a 24h-stale word of the day acceptable, or must it flip at 00:00 Vietnam?
Research requests: none · Confidence: Medium · Converge? yes — unless PM needs G6b or a privacy decision blocks G5.

### Moderator note (round 1)
- Agreed 3/3: G1 (a), G2 (a), G3 (a), G4 (a), G6 (a), G7 (a).
- Open disagreements: G5 — M1.1 (b, privacy decision for owner) vs M1.2 + M1.3 (a, F12 specifies opt-in, off by default, rotatable id).
- Questions between roles: PM→BA: F12 (02-FEATURES.md:305) lists `/embed/streak/[publicId]` "opt-in, mặc định tắt, id ngẫu nhiên đổi được" and the roadmap P7 row says "streak embed opt-in" — it is in scope as a spec, the open question is whether building it needs the owner. BA→PM: privacy note. dev→PM: word-of-the-day freshness at 00:00 Vietnam vs up to a day stale (G4 detail).
- Research requests: none
- Converge votes: 3/3 conditional. Round 2: G5 and the G4 freshness detail only.

## Round 2 — critique (G5, G4 freshness)

### M2.1 — PM (product-manager)
Position: Changed G5 to (a), build now, with conditions. G4 must flip at 00:00 Vietnam.
Responds to: M1.2 agree — F12 (02-FEATURES.md:305) + roadmap P7 row already spec opt-in/default-off/rotatable id; building the spec'd opt-in is not a new privacy decision (changes M1.1). M1.3 agree — least-risk design (nullable column, 128-bit id, same 404 for unknown/disabled, no-store, no cookies). M1.3 question G4 — 24h-stale is not acceptable; "today's word" must be today's; pick by Vietnam date index, revalidate ≤ hourly, test date boundary.
Points: G5 guardrails — only the streak count (no name/avatar); one line in /me "anyone with the link can see the count"; rotation makes the old link 404 (M1.2 AC). PDPL review before public launch unaffected; default-off keeps the beta clean (08-NFR.md:54).
Questions: dev — does revalidate-hourly keep check-static passing?
Research requests: none · Confidence: Medium · Converge? yes — unless the dynamic streak route breaks static CSP / check-static.

### M2.2 — dev (nextjs-developer)
Position: G5 build now (a), one dynamic route outside check-static. G4: static page + tiny client component picking by Vietnam date; no cacheLife.
Responds to: M1.1 disagree on G5 (F12 + roadmap spec it; risk bounded by spec). M1.2 agree on G5 + one-line privacy note in /me. M1.3 (own) revise on G4: revalidate ≤ 1h is not enough — cacheLife 'days' = revalidate 1 day, stale 5 min, expire 1 week (node_modules/next/dist/docs cacheLife table), not aligned to midnight.
Points: G4 — ship the N5 word list statically; client computes the date with Intl.DateTimeFormat 'Asia/Ho_Chi_Minh' and indexes by day number; flips at 00:00 Vietnam for everyone, no cache/cookie, check-static green; placeholder = day-0 word before hydration. G5 — /embed already excluded from proxy and gets frame-ancestors *; streak route is the first dynamic embed: Suspense + uncached DB read + no-store, exempt from check-static.
Questions: none · Research requests: none · Confidence: Medium · Converge? yes

### M2.3 — BA (project-analyst)
Note: the moderator appended M2.1/M2.2 to the file before this call; BA read them (process slip, recorded here).
Position: G5 (a) build now with fixed guardrails; G4 flips at 00:00 Vietnam via dev's client pick.
Responds to: M2.1 agree (moved to (a) on F12 + roadmap row; no stale word). M2.2 agree on G4 (cacheLife 'days' not midnight-aligned; static + Intl 'Asia/Ho_Chi_Minh' client pick is least code). M2.2 build-on G5: check-static exemption explicit and narrow (/embed/streak/* only).
Points: G4 AC — word changes at 00:00 Vietnam for every viewer regardless of time zone; same word on a Vietnam day, index wraps; no-JS fallback (day-0 word) with visible date; test for the 23:59→00:00 boundary. G5 AC — streak count only; 404 for unknown/rotated/disabled id; off sets id null, on issues a new id; rotate shows the new link and updates the snippet; no-store, no cookies, frame-ancestors *; /me privacy line; streak option on the embed-code page only when enabled; docs record the check-static exemption.
Questions: none · Research requests: none · Confidence: Medium · Converge? yes

### Moderator note (round 2)
- Open disagreements: none — G5 (a) 3/3 (M2.1 changed); G4 freshness: all require the flip at 00:00 Vietnam; M2.2 and M2.3 choose the client-side pick, which meets M2.1's requirement and makes its "revalidate hourly" question moot.
- Questions between roles: none open.
- Research requests: none
- Converge votes: 3/3 → early stop after round 2.
