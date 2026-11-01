# Transcript: Next 16.4 cacheComponents vs nonce CSP vs i18n library

## Round 1 — critique

### M1.1 — skeptic (none)
Position: Disable cacheComponents for now, use a single static-header CSP (no nonce) plus strict output sanitisation, and start with native i18n instead of next-intl.

Responds to: none (transcript empty). Based on the brief digest only; I did not read R01 or R02 in full.

Points:
- cacheComponents is global and cannot be turned off per route, and a nonce cannot be put into the PPR static shell (R02). ADR 0007's two-tier CSP is therefore not implementable as written with cacheComponents on. The project is in Phase 0, so keeping a flag that breaks a written decision is the riskiest option. (evidence: R02, brief)
- A "static CSP with 'unsafe-inline'" gives little XSS protection exactly where it matters: the (app) routes that render AI output and user text. The SRI option still needs unsafe-inline for the inline `__next_f` scripts (R02). Keeping PPR therefore weakens security in the area the brief flags as the XSS surface. (evidence: R02, brief constraint)
- Disabling cacheComponents keeps public pages static. Pages with no cookie or header reads are still SSG, so the SEO constraint holds. Per-route nonce CSP is then possible by making only the (app) routes dynamic. (evidence: brief constraints; R02 lists this option; I have not verified it end to end)
- next-intl's cacheComponents support is recent. It needs Next 16.3+ and `next/root-params`, and it has a possibly stale `Link` issue inside `use cache` (R01, Medium confidence). For vi/en only, native `app/[lang]` plus JSON dictionaries is fewer dependencies and less code. Native i18n is a documented path, so it is not deprecated. Hreflang and localized URLs are still hand-written, but that is small for two locales. (evidence: R01, brief)
- Unverified: whether the nonce middleware (the file Next now calls proxy) forces the whole app dynamic. Public pages must be checked after the change.

Questions: pragmatist: what concrete benefit of PPR do you need in Phase 0 that justifies giving up the nonce CSP? | domain expert: can nonce be scoped to (app) only, while public pages keep a static hash or header CSP, once cacheComponents is off?

Research requests: Build a minimal Next 16.4.3 test with cacheComponents off, a nonce proxy matcher limited to (app), and `next build`. Confirm the public routes still show as static (○/●) in the build output.

Confidence: Medium

Converge? no — I would change my mind if the build test shows nonce CSP can coexist with PPR, or if the domain expert shows 'unsafe-inline' risk is acceptable given strong output sanitisation.

### M1.2 — pragmatist (none)
Position: Keep cacheComponents on, use a single static CSP with 'unsafe-inline' for scripts plus strict other directives, and use next-intl. Revisit nonce later.

Responds to: no prior messages (transcript empty). Relies on brief digest R01 and R02. I did not open the R01/R02 files.

Points:
- cacheComponents: keep it. The public pages must be static for SEO. Disabling it is the opt-out path, and the scaffold default is the supported path. (evidence: R02; brief constraints)
- CSP: nonce CSP forces dynamic rendering, and cacheComponents cannot be turned off per route. Two-tier CSP (ADR 0007) therefore means turning cacheComponents off for the whole app, which gives up PPR and static shells. That cost is too high for Phase 0. (evidence: R02)
- The XSS risk on (app) routes is better handled by escaping and sanitizing AI and user text, which React does by default. Add object-src 'none', base-uri 'self', frame-ancestors 'none' and a tight connect-src and img-src. 'unsafe-inline' in script-src is a known weakness. Mark it with a comment: "shortcut: no nonce, upgrade when experimental SRI covers inline scripts or the app is dynamic anyway". (evidence: R02)
- i18n: next-intl 4.x supports cacheComponents on Next 16.3+ via next/root-params. It gives localized URLs, hreflang helpers and ICU messages with no code of ours. Native i18n means hand-writing the routing, the alternates and the plural handling. That is more code for a solo developer. (evidence: R01)
- Caveat: the `Link` inside `use cache` issue may be stale. A 30-minute spike should confirm it before we commit. Native i18n is the fallback if the spike fails.

Questions: domain expert: how much real protection does a nonce add over 'unsafe-inline' if all user and AI text goes through React escaping and a sanitizer? Which sinks, such as dangerouslySetInnerHTML or markdown rendering, would we actually have?

Research requests: (1) Is the next-intl `Link` in `use cache` issue fixed in 4.14.9? Check the GitHub issues. (2) Do the experimental SRI hashes in Next 16.4 cover the inline `__next_f` scripts? Check the Next docs and changelog.

Confidence: Medium

Converge? no — I would change my mind if the domain expert shows a concrete XSS sink in (app) that only a nonce mitigates, or if the next-intl spike fails.

### M1.3 — domain expert: web security + Next.js (none)
Position: Keep cacheComponents on; use one static CSP (script-src 'self' 'unsafe-inline', plus strict non-script directives) everywhere; adopt next-intl 4.x. Do not run a nonce tier.

Responds to: none (transcript empty); builds on brief R01/R02 digests.

Points:
- Nonce CSP needs dynamic rendering. R02 says it conflicts with the PPR static shell, and cacheComponents is global. Turning it off for one nonce tier would make the whole app dynamic, which breaks the SSG/SEO constraint for public pages. ADR 0007's two-tier plan is therefore unworkable as written and should be superseded. (evidence: R02, brief)
- 'unsafe-inline' on script-src weakens XSS defence. The real XSS risk is AI and user text, which should be handled by React escaping and never using dangerouslySetInnerHTML. If Markdown is rendered, sanitise it. Add object-src 'none', base-uri 'self', frame-ancestors 'none', form-action 'self', and Trusted Types report-only. These controls cover most of what the nonce would have added. (evidence: R02; no evidence on app code)
- Experimental SRI covers JS files only. The inline __next_f scripts still need unsafe-inline, so SRI is a later hardening step, not a fix. (evidence: R02)
- next-intl is the better choice for vi/en with localized URLs and hreflang. It supports cacheComponents on Next 16.3+ via next/root-params. That avoids hand-writing routing, pathnames and alternates code, which fits "least new code" for a solo developer. Pin the version and test the Link inside `use cache` issue in Phase 0. (evidence: R01, medium confidence, possibly stale)
- Native i18n is an acceptable fallback if the Link issue bites. It adds no dependency but needs custom middleware and hreflang code. (evidence: brief)

Questions: skeptic: what XSS vector remains in (app) that a nonce would block and escaping plus the other directives would not?

Research requests: Verify next-intl issue status for Link inside `use cache` on 4.14.9. Scope: github.com/amannn/next-intl issues, plus a Phase 0 smoke test.

Confidence: Medium
Converge? no — I would change my mind if the (app) routes must render raw HTML from AI output; that would justify a separate nonce deployment or sanitiser-only approach.

### Moderator note (round 1)
- Open disagreements: M1.1 vs M1.2/M1.3: disable cacheComponents to keep a nonce tier for (app) vs keep cacheComponents with one static CSP; M1.1 vs M1.2/M1.3: native i18n vs next-intl.
- Questions between roles: skeptic → domain expert: can nonce be scoped to (app) with cacheComponents off while public stays static? pragmatist/domain expert → skeptic: which concrete XSS vector does a nonce block that escaping + strict directives do not? (Project fact for all: docs/05-AI-SPEECH.md says AI output is never rendered as HTML; furigana uses an app-parsed markup.)
- Research requests: next-intl Link inside `use cache` on 4.14.9 → R03; smoke test of next-intl + cacheComponents build and of cacheComponents off + scoped nonce proxy → R04 (orchestrator experiment); SRI coverage of inline scripts → answered by R02 (JS files only).
- Converge votes: 0/3

## Round 2 — converge

### M2.1 — skeptic (none)
Position: Converge on keeping cacheComponents ON, one static CSP, and next-intl 4.14.9. R03 and R04 changed my mind on all three points.

Responds to:
- M1.2 agree: R04 Test B shows the two-tier CSP costs PPR app-wide and needs custom proxy composition. That did not work on the first try.
- M1.3 agree: the project fact in the moderator note (docs/05-AI-SPEECH.md) says AI output is never rendered as HTML. That removes the concrete XSS sink I had no answer for, so I cannot name one that a nonce blocks and escaping plus strict directives do not.
- M1.2 and M1.3 agree on next-intl: R04 Test A shows `Link` inside `use cache` works on 4.14.9 / Next 16.4.3. This overrides my concern from R01 and the "no confirmed fix" reading of R03. I withdraw my native i18n position.

Points:
- Supersede ADR 0007. Record that script-src 'unsafe-inline' is a known weakness. Add object-src 'none', base-uri 'self', frame-ancestors 'none', form-action 'self', a tight connect-src and img-src, and Trusted Types report-only. Put a "shortcut: ..., upgrade when ..." comment on the CSP line. (evidence: R02, R04)
- Guardrails to pin down:
  - Ban dangerouslySetInnerHTML with a lint rule.
  - Parse the furigana markup into React elements only.
  - Pin next-intl at 4.14.9.
  - Add the R04 Test A setup as a CI build test, so a regression in `Link` inside `use cache` is caught. (evidence: R03, R04)
- Residual risk: R04 only tested one setup, and R03 is Low-Medium confidence.

Questions: none
Research requests: none
Confidence: Medium-High
Converge? yes

### M2.2 — pragmatist (none)
Position: Converge on this package. Keep cacheComponents on. Use one static CSP with script-src 'self' 'unsafe-inline' plus strict non-script directives. Use next-intl 4.14.9. Supersede ADR 0007.

Responds to:
- M1.1 disagree on native i18n. R04 Test A shows next-intl with root-params and Link inside `use cache` builds and renders on 4.14.9 / Next 16.4.3. That removes the Link risk I raised in M1.2 (R03's "unconfirmed" is answered by R04). Native i18n would mean hand-writing routing and hreflang.
- M1.1 disagree on disabling cacheComponents. R04 Test B shows the two-tier nonce setup did not work on the first try and needs custom proxy composition. That is more code and more risk for a solo developer, and it gives up PPR app-wide.
- M1.3 agree. Nonce is not worth its cost while AI output is never rendered as HTML (moderator note, docs/05-AI-SPEECH.md).

Points:
- Add a "shortcut" comment on the CSP: no nonce, upgrade if the (app) routes ever render raw HTML or if SRI covers inline scripts. (evidence: R02)
- Ban dangerouslySetInnerHTML with an ESLint rule. This is cheap and replaces most of what the nonce would have protected. (no evidence; my proposal)
- Keep the Phase 0 smoke test as a permanent CI build check. (evidence: R04)

Questions: none
Research requests: none
Confidence: Medium-High
Converge? yes — I would change my mind only if (app) must render raw HTML.

Skipped: I did not rerun R04. Risk: the nonce proxy composition failure in R04 was a single attempt and is unresolved.

### M2.3 — domain expert: web security + Next.js (none)
Position: Keep cacheComponents ON. Use one static CSP for the whole app. Adopt next-intl 4.14.9. Supersede ADR 0007.

Responds to:
- M1.1 disagree on cacheComponents: R04 Test B shows the nonce tier only works with cacheComponents off and extra custom proxy code. Its first attempt produced no CSP header and `nonce: undefined`. That cost buys little here.
- M1.1 disagree on native i18n: R04 Test A shows next-intl plus root-params builds with `○ /vi` and `○ /en`. Next-intl `Link` inside `use cache` rendered correctly. That resolves the R03 doubt for this setup. Native i18n adds code and removes no real risk.
- M1.2 and M1.3 agree: the ADR 0007 two-tier plan should be dropped.
- M1.1 answered: a nonce can be scoped to (app) only with cacheComponents off (R04). That option is feasible but not worth its cost.

Points:
- The XSS surface is small. AI output is never rendered as HTML, and furigana uses app-parsed markup (moderator note). So the nonce adds little over React escaping plus strict directives. (evidence: M1.1 moderator note, R02)
- Static CSP: `script-src 'self' 'unsafe-inline'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`, and a tight `connect-src` and `img-src`. Add a lint rule that bans `dangerouslySetInnerHTML`. Mark the shortcut: "upgrade to nonce or SRI when needed". (evidence: R02)
- Keep the locale spike as a CI build check: `/vi` and `/en` must stay static, and `Link` inside `use cache` must keep rendering. (evidence: R04)

Questions: none

Research requests: none

Confidence: Medium-High

Converge? yes

### Moderator note (round 2)
- Open disagreements: none (M2.1 withdrew the native-i18n and disable-cacheComponents positions).
- Questions between roles: none
- Research requests: none
- Converge votes: 3/3
