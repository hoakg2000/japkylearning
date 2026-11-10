# Brief: P8 open decisions (songs v1, F11)

- Goal: decide
- Date: 2026-11-10
- Rounds: 3 (max) · Word limit: 230 · Model: sonnet

## Question
The agent implements P8 (`docs/09-ROADMAP.md`): `scripts/build-songs.ts` (LRCLIB → LRC → furigana → AI `lyrics-keywords` + `lyrics-translate`), YouTube player with line/word highlight, keywords, cloze, 20–30 songs. Fixed by the spec (`docs/02-FEATURES.md` F11, ADR 0012, `docs/07-CONTENT-LICENSING.md` §4): owner deferred lyrics copyright for v1 (risk recorded), takedown mechanism from v1, no LRCLIB at runtime (pages SSG), nocookie YouTube player, YouTube cookies disclosed, rule-based keyword fallback when AI is off, keyword `charStart/charEnd` tested. Facts checked by the moderator today: LRCLIB `/api/search` answers (e.g. YOASOBI 夜に駆ける has lyrics); YouTube oEmbed (`/oembed?url=…`) answers 200 with title and channel, so a curated `youtubeId` can be verified to exist and to belong to an official channel. This environment has **no AI key** (the AI provider is the mock), and kuroshiro is not installed.

Decide:
- **H1 Song list.** (a) The agent curates 20–30 songs (popular J-pop/anime/ballads at N5–N4 level plus some public-domain 童謡 like さくらさくら, ふるさと), looks up official YouTube ids (web search) and keeps only songs where LRCLIB has `syncedLyrics` **and** oEmbed confirms an official channel; ship what passes, log the shortfall; (b) only public-domain children's/folk songs (no lyric copyright) even if fewer than 20; (c) backlog + skip (owner must pick songs).
- **H2 Furigana for lyrics without kuroshiro.** (a) Rule-based segmentation at ingest: longest-match against JMdict/JmdictFurigana (already downloaded) and our word list, kana passes through, kanji left without reading are flagged; (b) add a tokenizer dependency (e.g. kuromoji + dictionary) as a devDependency used only at ingest; (c) no furigana in v1, romaji only from what is kana.
- **H3 Keywords.** With no AI key, the mock must fall back to rules. (a) Rule-based: find our N5/pack word surfaces (and inflected stems for verbs/adjectives) in each line, keep JLPT level, compute charStart/charEnd by index; implement the `lyrics-keywords` AI mode too, used when a real provider is configured, with the anti-invention filter; (b) rule-based only, AI mode later.
- **H4 Line translations (`lyrics-translate`).** No AI key now. (a) Implement the AI mode; with the mock, songs ship without line translations (keywords carry meanings), backlog to run it when a key exists; (b) the agent writes vi/en translations itself into the song files (derivative of copyrighted lyrics, unreviewed); (c) skip translations entirely in v1.
- **H5 Player and privacy.** (a) Click-to-load facade: no YouTube request until the learner presses play, then load the IFrame API from youtube.com and the player from youtube-nocookie.com; CSP extended only on `/[locale]/songs/*` (script-src/frame-src for YouTube); a one-line cookie notice at the facade; (b) load the player on page load.
- **H6 Takedown.** (a) A "request removal" link on every song page (mailto to a configurable `NEXT_PUBLIC_CONTACT_EMAIL`, placeholder until the owner sets it) + `content/songs/removed.json` the build honours; (b) only a note in docs.
- **H7 Plain-lyrics-only songs** (no timestamps). (a) Exclude from v1 (spec needs syncedLyrics for 20 songs); (b) include as static lyrics marked "waiting for engine v2".

## Constraints
- Next.js 16, cacheComponents, static CSP (ADR 0013), song pages SSG (`scripts/check-static.mjs`), next-intl `/vi` `/en`; reuse WordCard, `addCards`, AI provider abstraction (`src/lib/ai/`), content pipeline patterns (`scripts/ingest/build-n5.ts`).
- No real money or external accounts. Network use at ingest only, polite (User-Agent, no bursts). Least code meeting F11 v1.
- Reading list: `docs/09-ROADMAP.md` (P8), `docs/02-FEATURES.md` (F11), `docs/adr/0012-song-source-and-engine.md`, `docs/07-CONTENT-LICENSING.md` §4, `docs/05-AI-SPEECH.md` §1, `next.config.ts`, `src/lib/ai/`.

## Participants
| # | Role | Persona |
| --- | --- | --- |
| 1 | PM | G:\project\jacky-the-skiller\agents\product-manager.md |
| 2 | BA | G:\project\jacky-the-skiller\agents\project-analyst.md |
| 3 | dev | G:\project\jacky-the-skiller\agents\nextjs-developer.md |

## Research questions
None at start (LRCLIB and oEmbed reachability checked by the moderator).

## Research digest
- none
