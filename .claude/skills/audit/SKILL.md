---
name: audit
description: "Technical quality audit of the Bindu homepage: accessibility, performance, theming tokens, responsive behaviour and implementation integrity, scored 0-4 per dimension with P0-P3 findings. Reports only; it does not fix anything."
license: Apache 2.0
---

Applies to the homepage (`/`). Other pages follow docs/DESIGN.md.

> **Installed for the Bindu homepage (project level, 18 Nov 2026), adapted.** Source: github.com/pbakaus/impeccable @ d41d986, `.claude/skills/impeccable/reference/audit.md` (Apache-2.0, `LICENSE.txt` alongside). Vetted by reading the file in full; no script, install, network call, key or telemetry in it. Instructions only.
>
> **Adapted:** the detector (`impeccable detect`), the desktop CDP scan, the live-server overlay and `audit-storage` need the engine, which is not installed. They are replaced by a manual source scan with `rg` and the browser checks in `bindu-design`'s QA list. Recommended commands are mapped to the skills that exist here (`polish`, `frontend-design`, `bindu-design`). The report is not saved to disk; it goes in chat. `bindu-design` wins any conflict (palette, buttons, honesty, copy, motion limits).

Run a systematic **technical** quality check of the Bindu homepage (`features/landing/home/`) and produce a report. Do not fix issues; document them for the next pass.

This is a code-level audit, not a design critique. Check what is measurable and verifiable in the implementation. Use `critique` for the design judgement.

Scope: the homepage (`/`) at 375 and 1440 widths, in light and dark. Read `docs/home/DESIGN.md` and `bindu-design` first so every finding is judged against the house rules.

## Diagnostic scan

Score each dimension 0-4.

### 1. Accessibility
- **Contrast**: text under 4.5:1 (3:1 for large text); UI graphics under 3:1. Check `features/landing/home/styles/*.css` against the tokens.
- **Motion**: `prefers-reduced-motion` needs an intentional static version. Flag a global `0.01ms` kill that removes useful state change, flashing, and motion that blocks reading or focus.
- **ARIA**: interactive elements without roles, names or states; decorative SVGs without `aria-hidden`.
- **Keyboard**: every control reachable, visible focus (2px white on dark, 2px cobalt on light), no traps; dialogs trap focus, return it, and close on Esc.
- **Semantics**: heading order, landmarks, `div`s used as buttons, a skip link that works.
- **Alt text**: every illustration carries a visible "Illustration" label and a text alternative.
- **Forms**: labels, error text, required markers (the estimate and demo forms).

Score 0 = fails WCAG A; 1 = major gaps; 2 = partial; 3 = AA mostly met, minor gaps; 4 = AA fully met.

### 2. Performance
- **Layout thrash**: reads and writes of layout properties inside loops (grep `offsetTop`, `getBoundingClientRect`, `scrollTo` in `features/landing/home`).
- **Expensive animation**: animating layout properties, unbounded blur/filter/shadow, anything that drops frames. Transform and opacity only.
- **Lazy loading**: WebGL (`ogl`), the world and ship maps, and canvas scenes load on demand and pause off-screen and in hidden tabs.
- **will-change**: set only on known animating elements, not at rest.
- **Bundle**: unused imports and dependencies (`package.json`; only the homepage imports `lenis`); check the `pnpm build` output sizes.
- **Re-renders**: state updated on every scroll tick in React components.

Score 0 = severe; 1 = major problems; 2 = partial; 3 = mostly optimised; 4 = fast, lean.

### 3. Theming
- **Hard-coded colours**: hex or rgb values in component CSS that should be a token from `tokens.css` or `components.css`.
- **Palette roles**: yellow used only for the primary action, live chips and key numbers; cobalt only for the system; no cobalt text on black.
- **Token drift**: spacing, radii and type sizes outside the scale in `DESIGN.md`.

Score 0 = no tokens; 1 = mostly hard-coded; 2 = tokens exist, used inconsistently; 3 = minor hard-coded values; 4 = full token system.

### 4. Responsive
- **Fixed widths** that break below 375.
- **Touch targets**: under 44px (WCAG 2.5.8 minimum 24px with spacing).
- **Overflow**: horizontal scroll at 375, 768, 1440 and 1920.
- **Text scaling**: layouts that break at larger text sizes.

Score 0 = desktop only; 1 = major issues; 2 = works on mobile with rough edges; 3 = minor touch or overflow issues; 4 = fluid at every width.

### 5. Implementation integrity
Look for repeated shortcuts, token drift, decorative content with no job, and structure that could sit unchanged on any other product. Check that every "Illustration" is labelled, that "In build" is never shown as Live, that no customer, metric or certification is invented, and that every demo link is `https://cal.com/raahul-dutta-bpcqoa`.

Score 0 = systemic drift; 1 = major repeated failures; 2 = several verified issues; 3 = minor isolated issues; 4 = coherent and intentional.

## Report

### Health score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | ? | |
| 2 | Performance | ? | |
| 3 | Theming | ? | |
| 4 | Responsive | ? | |
| 5 | Implementation integrity | ? | |
| **Total** | | **??/20** | **[band]** |

Bands: 18-20 Excellent (minor polish), 14-17 Good (fix the weak dimensions), 10-13 Acceptable (significant work), 6-9 Poor (major overhaul), 0-5 Critical.

### Verdict
Pass or fail: does the site express one coherent Bindu system? Cite the evidence.

### Findings by severity
- **P0 Blocking**: stops a visitor finishing a task. Fix now.
- **P1 Major**: significant difficulty or an AA violation. Fix before handover.
- **P2 Minor**: annoyance with a workaround. Next pass.
- **P3 Polish**: fix if time allows. Keep these few.

For each finding give: the name, the location (file and line), the category, the impact on a visitor, the WCAG reference if any, the fix, and the skill to use (`polish`, `frontend-design`, or `bindu-design` for copy and honesty). Name a false positive as one when you verify it.

Also list the patterns (systemic issues) and the positive findings worth keeping.

Close by recommending actions in priority order and ending with `polish` if any fixes were recommended.
