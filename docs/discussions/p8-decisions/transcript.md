# Transcript: P8 open decisions (songs v1)

## Round 1 — critique

### M1.1 — PM (product-manager)
Position: Minimal low-risk F11 v1 that still targets 20 songs; defer anything needing an AI key or owner input.
- H1 (a) with a quality bar: keep only songs with LRCLIB syncedLyrics + oEmbed official channel; ship what passes, log shortfall. (b) too few songs; (c) blocks on owner.
- H2 (a): longest-match on JmdictFurigana, no dependency; flag unread kanji. (b) only if the unresolved rate is too high.
- H3 (a): rules now + AI mode with anti-invention filter.
- H4 (a): implement AI mode; ship without line translations under the mock; (b) adds derivative-copyright exposure; backlog to run with a key.
- H5 (a): click-to-load facade (privacy-minimal, matches cookie disclosure).
- H6 (a): removal link + removed.json honoured by the build; (b) does not meet "takedown from v1".
- H7 (a): exclude plain-lyrics-only songs.
Questions: dev — is rule-based furigana quality acceptable; if not, is H2 (b) cheap?
Research requests: none · Confidence: Medium · Converge? yes — unless a sample shows too many unread kanji.

### M1.2 — BA (project-analyst)
Position: Small spec-faithful v1 with lowest legal/privacy exposure: H1a–H7a.
- H1 (a): public-domain 童謡 first to fill quota; drop songs without a verified id. AC: every shipped song has syncedLyrics, oEmbed 200, official channel; build prints a pass/fail table.
- H2 (a): AC: kana pass through; unread kanji flagged in the build log; songs above a threshold (suggest 5%) excluded or flagged; deterministic test.
- H3 (a): AC: `line.slice(start,end) === surface` in tests; inflected stems found; AI output dropped if a surface is not in the line.
- H4 (a): AC: no empty or placeholder translation shown; toggle hidden when none; backlog item for a key.
- H5 (a): AC: no request to youtube.com / youtube-nocookie.com before play; CSP extended only on songs routes; check-static passes; cookie notice at the facade.
- H6 (a): AC: slug in removed.json not generated, page 404; env placeholder flagged as owner TODO.
- H7 (a): AC: build rejects songs without syncedLyrics, with a reason.
Questions: PM — acceptable unread-kanji share (5%?); dev — mailto build-time only?
Research requests: none · Confidence: Medium · Converge? yes — unless fewer than ~12 songs pass H1.

### M1.3 — dev (nextjs-developer)
Position: Lean rule-based v1 with a facade player; no new dependencies, no invented translations.
- H1 (a): automated gate in the script (~40 lines, delay + User-Agent); pad with public-domain 童謡.
- H2 (a): reuse the JmdictFurigana index from build-n5.ts; ~80 lines; reject (b) (~17 MB dictionary dependency for ingest only).
- H3 (a): stem table for verbs/adjectives; charStart/charEnd in code points (`Array.from`) with unit tests.
- H4 (a): mock returns null so the UI hides translations; (b) adds licensing risk.
- H5 (a): exclude `songs/` from the catch-all header rule (like embed/ and speak/) and add a songs rule allowing script-src youtube.com, frame-src youtube-nocookie.com, img-src i.ytimg.com; two CSP headers would both be enforced; add a test.
- H6 (a): mailto from `NEXT_PUBLIC_CONTACT_EMAIL` + removed.json filtered in the build and generateStaticParams; SSG-safe.
- H7 (a): exclude.
Questions: PM — is a final count below 20 acceptable if the gate cuts songs?
Research requests: none · Confidence: Medium · Converge? yes.

### Moderator note (round 1)
- Open disagreements: none — 3/3 on H1 (a), H2 (a), H3 (a), H4 (a), H5 (a), H6 (a), H7 (a).
- Questions between roles: below-20 count — M1.1 and M1.2 both say ship what passes and log the shortfall (answers M1.3). Unread-kanji threshold — 5% (M1.2), no objection. Mailto is build-time (M1.3 answers M1.2). Rule-based furigana quality — measured during the build; songs above 5% unread kanji are flagged.
- Research requests: none
- Converge votes: 3/3 → early stop.
