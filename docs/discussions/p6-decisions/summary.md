# Summary: P6 open decisions (speaking practice)

- Goal: decide
- Rounds run: 1 of 3 — stopped because converged (3/3 yes, no open disagreement, no research request)
- Participants: PM (product-manager), BA (project-analyst), dev (nextjs-developer)

## Outcome
- E1: (a) `/[locale]/speak/[lesson]` per N5 lesson, static shell + client recorder, linked from the lesson page (M1.1, M1.2, M1.3).
- E2: (a) page open to all; recording only for signed-in non-guest 16+ users with `speech_processing` consent, asked in the click handler with the Google notice before the first recording (M1.2, M1.3).
- E3: (a) `test_attempts` kind `speaking`, scope {lessonId, wordId}, total 1, correct = score ≥ 70; XP 2 only for the first scored attempt per word per study day (M1.3, moderator note).
- E4: (a) unsupported browser → message + listen + self-check; self-check stores nothing and gives no XP (M1.1, M1.2).
- E5: (c) then (b): best of up to 5 alternatives; if none maps to kana → "heard X, try again", no score, no storage; no-speech/mic-denied → retry (M1.1, M1.2, M1.3).
- E6: (a) `SttProvider` + `webspeech` + `mock`; Azure/Whisper as backlog notes, no stub files (M1.1, M1.2, M1.3).

Outcome confidence: High

## Agreed
- All six decisions 3/3 in round 1 (M1.1, M1.2, M1.3).
- Microphone policy: exclude the speak path from the global `microphone=()` rule and add a `microphone=(self)` rule for it; verify headers (M1.3).

## Open disagreements
- none

## Key evidence
- F10 (02-FEATURES.md:218–224) and 05-AI-SPEECH §3 fix the pipeline, consent and storage rules (High).
- `test_attempts.kind` free text + jsonb scope → no migration (M1.3, repo read).

## Risks and unknowns
- Web Speech availability varies (Firefox none); recogniser "corrects" to real words, so the score measures intelligibility only.
- Next header merging: wrong rule order could leave `microphone=()` on the speak route — needs a header test.

## Next steps
- Implement E1–E6 with unit tests (ゃ, っ, ー, alternatives) and an e2e header check — nextjs-developer.
