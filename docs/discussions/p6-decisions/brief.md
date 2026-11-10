# Brief: P6 open decisions (speaking practice, F10)

- Goal: decide
- Date: 2026-11-10
- Rounds: 3 (max) · Word limit: 220 · Model: sonnet

## Question
The agent implements P6 (`docs/09-ROADMAP.md`): `SttProvider` + `webspeech` + mora scoring, Google consent, single words only, unit tests for ゃ, っ, ー. Already fixed by the spec (`docs/02-FEATURES.md` F10, `docs/05-AI-SPEECH.md` §3): pipeline STT → hiragana (kanji in the result mapped via the target word's reading) → mora split → Levenshtein → score 0–100 + wrong-mora highlight; store score only, never audio; `speech_processing` consent + notice that audio goes to Google before the first recording; signed-in 16+; `Permissions-Policy: microphone=(self)` only on the speaking route. Decide:

- **E1 Route and entry point.** (a) One page `/[locale]/speak/[lesson]` per N5 lesson (words of that lesson, linked from the lesson page), static shell + client recorder; (b) one page `/[locale]/speak` that lists the learner's SRS words (dynamic, signed-in); (c) both.
- **E2 Who can open it.** Spec says signed-in 16+. (a) Page visible to all, recording button only for signed-in non-guest users with consent (others see listen-only + sign-in prompt); (b) page itself gated.
- **E3 Score storage.** (a) `test_attempts` row kind `speaking` (scope {lessonId, wordId}, score) + small XP; (b) score shown only, nothing stored; (c) store best score per word in a new table.
- **E4 Browsers without `SpeechRecognition`** (Firefox, some in-app browsers). (a) Show "not supported, use Chrome/Edge/Safari" and keep listen + self-check (learner marks themselves); (b) only the message.
- **E5 Transcript that cannot be mapped to kana** (kanji not in the target word, or a different word). (a) Score it as is (kanji characters count as wrong mora); (b) show "heard: X — not the target word, try again" with score 0 and no storage; (c) use the best of up to 5 alternatives (`maxAlternatives`) before deciding.
- **E6 Provider scope.** (a) `SttProvider` interface + `webspeech` + `mock` only; Azure/Whisper stay backlog notes (no stub files); (b) also add stub files that throw "not configured".

## Constraints
- Next.js 16, static CSP in `next.config.ts` (ADR 0013), public pages stay static (`scripts/check-static.mjs`); existing helpers: `wanakana`, `src/lib/speech/tts.ts` (device voice), consents in `src/lib/progress.ts`, `addXp`, `test_attempts`.
- No real money, legal or external accounts. Least code that meets F10 and the roadmap row.
- Reading list: `docs/09-ROADMAP.md` (P6), `docs/02-FEATURES.md` (F10), `docs/05-AI-SPEECH.md` §3, `docs/08-NFR.md` (privacy), `next.config.ts`, `src/lib/db/schema.ts`.

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
