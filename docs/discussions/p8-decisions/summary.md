# Summary: P8 open decisions (songs v1)

- Goal: decide
- Rounds run: 1 of 3 — stopped because converged (3/3 yes, no open disagreement, no research)
- Participants: PM (product-manager), BA (project-analyst), dev (nextjs-developer)

## Outcome
- H1: (a) agent-curated list; ship only songs with LRCLIB syncedLyrics and an oEmbed-verified official channel; the build prints a pass/fail table and the shortfall below 20 goes to the backlog (M1.1, M1.2, M1.3).
- H2: (a) rule-based furigana: longest match on JmdictFurigana/JMdict + our word list, kana pass through, unread kanji flagged; songs above 5% unread kanji flagged (M1.2, M1.3).
- H3: (a) rule-based keywords (with inflected stems) now, plus the `lyrics-keywords` AI mode with the anti-invention filter; `line.slice(start,end) === surface` tested (M1.1–M1.3).
- H4: (a) `lyrics-translate` AI mode implemented; with the mock no translations ship and the UI hides the toggle; backlog to run with a key (M1.1–M1.3).
- H5: (a) click-to-load facade; no YouTube request before play; songs routes get their own CSP rule (excluded from the catch-all) with youtube.com / youtube-nocookie.com / i.ytimg.com; cookie notice at the facade (M1.2, M1.3).
- H6: (a) "request removal" mailto from `NEXT_PUBLIC_CONTACT_EMAIL` (owner sets it) + `content/songs/removed.json` honoured by build and static params (M1.2, M1.3).
- H7: (a) exclude plain-lyrics-only songs (M1.1–M1.3).

Outcome confidence: High

## Agreed
- All seven decisions 3/3 in round 1 (M1.1, M1.2, M1.3).

## Open disagreements
- none

## Key evidence
- Moderator check: LRCLIB search and YouTube oEmbed reachable (brief).
- Next header rules are additive; a second CSP header would be enforced too (M1.3).

## Risks and unknowns
- Fewer than 20 songs may pass the gate.
- Rule-based furigana quality on lyrics (names, ateji, archaic readings).
- Lyrics copyright remains an owner-accepted v1 risk (07 §4).

## Next steps
- Implement build-songs.ts gate, furigana, keywords, AI modes, songs pages with facade player, takedown — nextjs-developer.
