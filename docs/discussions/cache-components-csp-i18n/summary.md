# Summary: Next 16.4 cacheComponents vs nonce CSP vs i18n library

- Goal: decide
- Rounds run: 2 of 2 — stopped because rounds reached (converged 3/3 in round 2)
- Participants: skeptic (none), pragmatist (none), domain expert – web security + Next.js (none)
- Note: participants were run one at a time (user asked for no parallel subagents); the setup confirmation step was skipped because the user asked for self-resolution.

## Outcome
Keep `cacheComponents` ON. Use one static CSP for the whole app. Adopt next-intl 4.14.9, pinned. Supersede ADR 0007 (→ ADR 0013). Vote 3/3 in round 2 (M2.1, M2.2, M2.3).

## Agreed
- The two-tier nonce CSP costs PPR across the whole app and needs custom proxy composition, which failed on the first attempt (R02, R04, M2.2, M2.3).
- AI output is never rendered as HTML and furigana uses app-parsed markup, so no concrete XSS sink exists that a nonce blocks and escaping plus strict directives do not (M2.1).
- CSP: `script-src 'self' 'unsafe-inline'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`, tight `connect-src`/`img-src`, Trusted Types report-only, with a "shortcut: …, upgrade when …" comment (M2.1, M2.2, M2.3).
- ESLint rule banning `dangerouslySetInnerHTML`; furigana parsed into React elements only (M2.1, M2.2).
- next-intl works with cacheComponents on Next 16.4.3, including `Link` inside `use cache`; `/vi` and `/en` build static (R04), overriding earlier doubt (R01, R03).
- Keep the R04 Test A setup as a permanent CI build check (M2.2, M2.3).

## Open disagreements
- none (M2.1 withdrew the native-i18n and disable-cacheComponents positions from M1.1).

## Key evidence
- R02: cacheComponents is global; a PPR static shell cannot carry a nonce; SRI covers JS files only (Medium).
- R04: cacheComponents ON + next-intl + root-params + `Link` in `use cache` builds and renders, `/vi` `/en` static (High); cacheComponents OFF keeps public SSG but nonce + next-intl proxy composition failed on first try (Medium).
- R01: next-intl 4.x supports cacheComponents on Next 16.3+ via `next/root-params` (Medium).
- R03: next-intl #2229 closed without a confirmed fix (Low-Medium).

## Risks and unknowns
- `script-src 'unsafe-inline'` is a known XSS weakness; acceptable only while no raw HTML is rendered in `(app)` routes.
- R04 tested one setup; the Test B failure was a single attempt.
- A future next-intl upgrade could regress `Link` inside `use cache` (R03 Low-Medium).

## Next steps
1. ADR superseding 0007 — done: `docs/adr/0013-static-csp-cache-components.md`.
2. CSP headers in `next.config.ts` with shortcut comment — implementer.
3. ESLint ban on `dangerouslySetInnerHTML`; furigana parser emits React elements only — implementer.
4. Pin next-intl 4.14.9; CI build check that `/vi` `/en` stay static — implementer.
5. Update `docs/03-ARCHITECTURE.md` and `docs/08-NFR.md` — docs.
6. Revisit nonce if `(app)` ever renders raw HTML or SRI covers inline scripts — owner.
