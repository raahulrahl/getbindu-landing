Round 35 on branch `v3-story`: mobile only. Follow CLAUDE.md. Desktop must not change at all.

Austin: "the whole thing is not optimised for mobile… only for mobile, the PC part don't change; the mobile part looks a little too much to handle."

## Scope rule (most important)
- Every change goes inside mobile-only conditions: `@media (max-width: 767px)` in CSS, and in JS a single shared `isPhone()` (matchMedia "(max-width: 767px)", updated on change).
- Touch-only behaviour may also use `(hover: none) and (pointer: coarse)`.
- Nothing changes at 768px and up.
- **Proof:** before you start, take full-page screenshots at 1440x900 and 1024x768 in both themes (scrolled to fixed offsets after the intro). Re-take them at the end and pixel-compare. They must match, apart from animation timing noise. Report the comparison.

## Step 1: mobile critique (before any code)
- Load the skills `ui-craft` (core: read its SKILL.md, references/responsive.md, layout.md and accessibility.md), `ui-craft-adapt` and `ui-craft-audit` from .claude/skills/. Also load `bindu-design` (it wins any conflict) and `critique`.
- Walk the whole homepage at 375x667, 390x844 and 360x640 with real touch scrolling: puppeteer-core with hasTouch/isMobile device emulation, swiping with page.touchscreen or CDP Input.dispatchTouchEvent through Lenis, slow and normal. Do both themes and reduced motion.
- Write `qa/r35/CRITIQUE.md` (mockup repo, not copied) with a prioritised P0–P3 list of everything that's broken, cramped or "too much to handle" on phones, per section. Cover:
  - layout and overflow
  - type sizes and line length
  - tap targets (≥44px)
  - safe areas
  - pinned sections that hijack too much scroll
  - motion density (too many things moving at once)
  - the guide ship / dot on a narrow gutter
  - the departures board fit
  - the map readability
  - the ending zoom with touch
  - nav and drawer
  - performance on a throttled mobile CPU

## Step 2: fix, mobile only
Fix every P0 and P1, and P2 where cheap. Direction for "too much to handle":
- **Calmer:** on phones, fewer things move at once. Hide the guide's course line, wake and trail on phones, keeping only the small proof dots, or nothing if it still crowds. Keep the hand-offs simple: the map → ship hand-off can just finish at the port, and at the ending the ı sunflower simply assembles.
- **Shorter pins:** cut pinned scroll lengths on phones roughly in half (journey, departures board, How it works, finale), or unpin where a plain stacked layout reads better (e.g. How it works steps stacked with their visual under each).
- **Readable:**
  - body ≥16px, headings scaled down so a heading is at most 3 lines, line length ≤ about 38ch, consistent 20px side gutters, more vertical breathing room between blocks
  - the departures board shows 2 columns (Route, Verdict) with readable tiles and fits 360x640 without overflow, with the story panel under it
  - the journey map: notes go to the list under the map; the map is a clean full-width image
- **Touch:** tap targets ≥44px; no hover-only effects (scope them with `@media (hover:hover)`); the magnetic button effect off; the sound toggle reachable in the drawer; safe-area padding on the nav and any fixed elements.
- **Light:** on phones, drop the heavier effects that don't add much: fewer hero map dots, no heading scrims if they're not needed, a lower DPR (1), the particle counts in the hand-offs halved.
- **The ending:** the zoom works with touch scrolling; the wordmark size suits a phone; the final photo view is cropped so the containers read in portrait.
- Keep the content and honesty rules. Don't remove sections or copy (only layout, motion and density on phones).

## Step 3: verify
- Re-run the Step-1 walk on 375x667, 390x844 and 360x640, both themes and reduced motion: no horizontal scroll, no overlaps, no console errors, every pinned section finishes, the hand-offs complete with touch.
- Run v3/qa/r24/perf.mjs with mobile emulation (4x CPU throttle, 390x844) before and after, and report the numbers.
- Do the desktop pixel comparison (see the scope rule).
- Update CRITIQUE.md with what was fixed or left.

## Rules
- Commit per logical group ("v3 r35 N: mobile …"). Stage only changed files, by explicit path; never the unrelated deleted files or v3/dist; LF.
- npm run build passes.
- The dev server stays on 3010.
- Close puppeteer in a finally block and delete its temp profiles.
- Log decisions in DECISIONS.md under Round 35.
- Commit the new skills folders (.claude/skills/ui-craft, ui-craft-adapt, ui-craft-audit) in their own commit: "tooling: ui-craft skills (educlopez/ui-craft, MIT)". Add a line to docs/home/LICENSES.md under tooling.

## Report
Short: the top critique findings, what was fixed per section, the before/after mobile perf, the desktop comparison result, and anything left for Austin.
