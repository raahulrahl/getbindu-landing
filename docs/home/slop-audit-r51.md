# Slop audit, round 51

Scope: `features/landing/home/` (components, styles, content.ts, home-page.tsx, lib). Code only, no screenshots. Tools: `avoid-ai-design/scripts/detect.mjs` (76 files), targeted greps for the antislop, antislop-ui, avoid-ai-design, hallmark, heydamir-unslop, unslop and make-interfaces-feel-better rules, and the CLAUDE.md copy rules. Skipped: placeholder testimonials, anything with `avoid-ai-design-ignore`, and rounds 41 to 50 decisions.

Copy checks: no em or en dashes, no AI-smell words (seamless, elevate, unleash, next-gen, leverage, empower, unlock, end-to-end, effortless), no invented numbers (only the pricing figures, EUDR date and registry data already in the brief).

| ID | Section | Skill | Problem | File:line | Fix | Severity |
|----|---------|-------|---------|-----------|-----|----------|
| S1 | Nav | avoid-ai-design K3 | `backdrop-filter: blur(14px)` on the nav | styles/site.css:221 | None. Floating bar over scrolling content is the allowed case (r42-1, bindu-design "frosted glass only for floating chrome") | P3 (kept) |
| S2 | Intro, footer | avoid-ai-design SD4d | Middle-dot meta strings | content.ts:33, 299 | None. L299 carries an ignore tag; L33 was recorded as kept in r41-3 | P3 (kept) |
| S3 | Phones, mockups | make-interfaces-feel-better | "Illustration" badge is 9px on phones | styles/components.css:144 | Raise to 10 or 11px in a later pass | P2 |
| S4 | Chips in Ask and shipment captions | make-interfaces-feel-better | Chip text 10px, below the 11px chip spec | styles/r44.css:127, styles/shipment.css:112 | Use the 11px chip token | P2 |
| S5 | Departures board, phones | antislop-ui | Flap type 9 to 10px | styles/mobile.css:49, styles/story.css:111 | Decorative flaps, content also in the story line; keep | P3 (kept) |
| S6 | Story, Voices | antislop-ui (GSAP rule) | `opacity: 0` / `visibility: hidden` rules on `.bd-story`, `.fz-dot`, `.vc-map`, `.fl-beat` | styles/story.css:30, 85; styles/r47.css:5; styles/r44.css:38 | Checked: none is a GSAP target. They are CSS state transitions or a pre-hydration fallback gated by `:not([data-flow])`. No change | P3 (kept) |

Counts: P0 0, P1 0, P2 2, P3 4. Nothing to fix at P0 or P1. No gradient text, glow stacks, emoji, bounce or elastic easing, `transition: all`, scale hovers above 1.05, or infinite pulse animations were found.
