# Brief: Next 16.4 cacheComponents vs nonce CSP vs i18n library

- Goal: decide
- Date: 2026-10-26
- Rounds: 2 · Word limit: 200 · Model: sonnet

## Question
The fresh Next.js 16.4.3 scaffold enables `cacheComponents: true` (Partial Prerendering). Decide:
1. Keep or disable `cacheComponents`.
2. CSP strategy. ADR 0007 (`docs/adr/0007-two-tier-csp.md`) wants a static CSP for public pages and a nonce CSP for authenticated `(app)` routes. Next docs (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`) say "PPR is incompatible with nonce-based CSP since static shell scripts won't have access to the nonce".
3. i18n library: next-intl 4.14.9 (planned in `docs/03-ARCHITECTURE.md`) vs Next native i18n (`app/[lang]` + `next/root-params` + JSON dictionaries, see `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`).

## Constraints
- Solo developer, Phase 0 of the roadmap (`docs/09-ROADMAP.md`). Least new code, fewest dependencies.
- Public pages (kana, kanji, words, lessons) must be static/SSG for SEO; no cookies read there.
- `(app)` routes render AI output and user text (XSS surface).
- vi/en with localized URLs and hreflang.
- Must stay on a supported Next.js path (no deprecated APIs).

## Participants
| # | Role | Persona |
| --- | --- | --- |
| 1 | skeptic | none |
| 2 | pragmatist | none |
| 3 | domain expert (web security + Next.js architecture) | none (no persona agent installed) |

## Research questions
| ID | Question | Scope |
| --- | --- | --- |
| R01 | Does next-intl 4.x support Next.js `cacheComponents` / PPR? What setup is required (setRequestLocale, rootParams, known issues)? | open web: next-intl.dev, github.com/amannn/next-intl |
| R02 | In Next 16.4 with cacheComponents, what CSP options exist (nonce, SRI hashes, static header), and can nonce CSP apply per-route if cacheComponents is on? | folder `node_modules/next/dist/docs` |

## Research digest
- R01: next-intl 4.x supports cacheComponents on Next 16.3+ via `next/root-params` (root layout in `app/[locale]`, no setRequestLocale, runtime `notFound()`, explicit locale in Route Handlers/Server Actions); `Link` inside `use cache` had an unfixed issue (may be stale) (Medium)
- R02: cacheComponents is global, cannot be disabled per route; PPR static shell cannot carry a nonce; options = static CSP with 'unsafe-inline', experimental SRI (JS files only, inline `__next_f` scripts still need unsafe-inline), or disable cacheComponents and go fully dynamic for nonce routes (Medium)
- R03: next-intl #2229 (Link in `use cache`) closed without a confirmed fix; 4.14.5 improved Link/useRouter for Cache Components (Low-Medium)
- R04: local smoke test — with cacheComponents ON, next-intl + root-params + `Link` inside `use cache` builds and renders, /vi /en static (High); with cacheComponents OFF, public pages stay SSG and /home is dynamic, but nonce + next-intl proxy composition needs extra code and did not work on first try (Medium)
