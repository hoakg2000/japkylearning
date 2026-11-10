# Transcript: P6 open decisions (speaking practice)

## Round 1 — critique

### M1.1 — PM (product-manager)
Position: Ship smallest F10 slice that proves the loop: per-lesson page, open-to-all with gated recording, scores stored cheaply, graceful fallback.
- E1: (a) per-lesson `/speak/[lesson]` — maps to lesson journey, keeps shell static, avoids dynamic SRS page. (b) is Later.
- E2: (a) visible to all, record button gated (sign-in + 16+ + consent) — non-signed users still hear words; sign-in prompt is a funnel; meets spec because recording stays gated.
- E3: (a) `test_attempts` kind `speaking` + small XP — reuses tables, gives progress signal; stores score only, never audio. (c) Later.
- E4: (a) message + listen + self-check — learner still gets value on Firefox; self-check must not award XP or store score (no gaming).
- E5: (c) best of up to 5 alternatives, then (b) if none maps — reduces false failures on homophones; unmappable → "heard: X, try again", no score stored. Reject (a): scoring kanji as wrong mora is unfair/confusing.
- E6: (a) interface + webspeech + mock; Azure/Whisper as backlog notes — throwing stubs are dead code.
Points: success signal = share of attempts that return a mappable result (score-only, no audio); Google consent notice must precede the first recording in every path.
Questions: dev — is maxAlternatives a small scorer change or does it touch the provider interface?
Research requests: none · Confidence: Medium · Converge? yes — unless dev shows E5c adds major code or E2a breaks static checks.

### M1.2 — BA (project-analyst)
Position: Smallest slice meeting F10 + P6 row: per-lesson static page, open-to-all with gated recorder, stored score, clear fallback.
- E1 (a): reuses lesson link, keeps public shell static. AC: given a lesson page, Speak shows only that lesson's words; unknown lesson id → 404. (b) dynamic → backlog.
- E2 (a): AC: guest/minor/no consent → record button disabled, listen-only + sign-in/consent prompt; signed-in 16+ → Google-audio notice before first recording; declining records nothing; mic Permissions-Policy only on this route.
- E3 (a): AC: score produced → speaking row {lessonId, wordId, score} + small XP; no audio; duplicate submit gives no extra XP; DB failure still shows the score.
- E4 (a): AC: no SpeechRecognition → "use Chrome/Edge/Safari", listen mode and self-mark; self-mark stores no score, gives no XP.
- E5 (c)→(b): best of ≤5 alternatives; none maps → "heard: X, not the target word", score 0, no storage. AC: kanji mapped via target reading; no-speech and mic-denied → retry, not scored.
- E6 (a): AC: unit tests cover ゃ, っ, ー and the mock provider.
Questions: dev — does the speaking row fit `test_attempts` without a migration?
Research requests: none · Confidence: Medium · Converge? yes — unless E3(a) needs a migration or the lesson page cannot stay static.

### M1.3 — dev (nextjs-developer)
Position: E1 (a), E2 (a), E3 (a), E4 (a), E5 (c→b), E6 (a) — least code meeting F10.
- E1 (a): reuses lesson generateStaticParams; static shell + client recorder; check-static stays green. (b) breaks the static-public rule. Link from the lesson page.
- E2 (a): client island checks session/age/consent; listen-only via tts.ts otherwise. (b) forces the page dynamic.
- E3 (a): no migration — `kind` is free text, `scope` jsonb; total=1, correct = score ≥ 70; `addXp` small, capped per word per day.
- E4 (a): feature-detect `SpeechRecognition || webkitSpeechRecognition`; self-check stores nothing.
- E5 (c→b): `maxAlternatives=5`, score each with mora.ts, keep the best; all unmapped → "heard X, try again", no score, no storage. (a) gives misleading feedback.
- E6 (a): interface + webspeech + mock (mock for tests/e2e).
- Header risk: `/((?!embed/).*)` sets `microphone=()` everywhere and Next merges matching rules, so exclude the speak path in the negative lookahead and add a dedicated `microphone=(self)` rule; verify headers on both routes.
- Consent asked inside the click handler before the first `start()`, so the page stays static.
Questions: PM — pass threshold and XP for E3? BA — 16+ via existing age field? guest definition?
Research requests: none · Confidence: High · Converge? yes.

### Moderator note (round 1)
- Open disagreements: none — 3/3 on E1 (a), E2 (a), E3 (a), E4 (a), E5 (c then b), E6 (a).
- Questions between roles (moderator answers from the repo): PM→dev: maxAlternatives is a recogniser option plus a loop in the scorer, the provider returns `alternatives[]`. BA→dev: `test_attempts.kind` is free text, `scope` jsonb → no migration. dev→BA: 16+ uses `user.birthYear` + `isOldEnough` (src/lib/auth/age.ts); guest = `user.isAnonymous`. dev→PM: pass = score ≥ 70 (M1.3 proposal, no objection); XP 2 for the first scored attempt per word per study day.
- Research requests: none
- Converge votes: 3/3 → early stop (critique round, no open disagreement, no research).
