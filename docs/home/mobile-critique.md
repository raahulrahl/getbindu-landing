# Round 35: mobile critique (before) and what was done (after)

Walked on emulated phones (puppeteer-core, isMobile + hasTouch, real `page.touchscreen` swipes; Lenis does not take over touch, so scrolling is native): 375x667, 390x844, 360x640, light and dark, plus reduced motion. Scripts: `walk.mjs` (swipe walk and contact sheets), `shots.mjs` (jump to a fraction of each pin), `perf-mobile.mjs`, `desk.mjs` and `compare.mjs` (desktop proof). Not done: a real device, and the ui-craft-adapt / ui-craft-audit / critique skills were not run as separate passes (their checklists were applied by hand: overflow, targets, safe areas, type, motion density, performance).

Status: FIXED, PART (partly), LEFT.

## P0
- Page length on a phone: 16,677px at 375x667 (about 25 screens) because four sections are pinned for 330 to 460svh each. FIXED: 12,397px (-26%); finale 395 to 285svh, journey 460 to 220, how it works 330 to 200, board 460 to 262.
- Journey: the map was 218px wide inside a 335px column, the six-title index was 12px, the whole thing was a squeeze to fit 603px. FIXED: full-width map, one current title (16px) and its sentence (15px) under it. LEFT: the overview of all six titles is gone on phones (reduced motion keeps it).
- Departures board: 8px tiles, every row two lines, nothing readable. FIXED: two columns (Route, Verdict) as a grid, 10px tiles, five rows at a time, story panel at 15px under it.

## P1
- Guide on a 16px gutter: course line, trail, ticks and wake crossed the edge of the text, and the hand-offs (map to ship, ship to ı) flew dots across the screen. FIXED: only the travelling dot and the proof dots are drawn; no hand-off flights; at the ending the sunflower dot assembles by itself. A tiny ship also showed at the finale on phones: FIXED.
- Hero headline wrapped to 4 lines (13ch cap). FIXED: 3 lines.
- Motion density: 3,200 intro particles, dense land dots, DPR up to 1.5 on four canvases. FIXED: 1,600 / 1,000 particles, half the land dots, DPR 1 (hero, intro layer, guide); the journey map keeps up to 1.5 so it stays crisp.
- Perf on a 4x throttled CPU (390x844, dev server): script time 12.7s to 5.4s, 0.68 to 0.40 s per 1,000px scrolled; long tasks 11 to 5, none over 100ms (was 200ms max); frames over 25ms 4.2% to 2.6%. Dev numbers, not a Lighthouse run of the build.

## P2
- Tap targets under 44px (nav demo/menu 38px, hero pause button 36px, footer links 32px, tabs). FIXED.
- Gutter 16px, body-small 15px, display-lg 40px. FIXED: 20px, 16px, 32px (display-md 28px).
- Heading scrims on every h2. FIXED: off on phones (hero keeps its own).
- Safe areas: none. FIXED: `viewport-fit=cover`, nav and drawer use `env(safe-area-inset-*)`. Not tested on a real notched phone.
- Wordmark 70% of the width at the ending. FIXED: 84% (up to 600px). The photo crop already reads as a portrait stack of containers; the zoom is scroll-driven and works with native touch scrolling (checked at 375, 390 and 360).
- Journey map in reduced motion was 150px wide. FIXED: full width.
- Magnetic pull and click burst: already off without hover and a fine pointer. No change.
- Sound toggle: stays in the nav bar (44px, visible) rather than the drawer.

## P3 / left
- A few hover-only colour changes on links remain (they hide nothing).
- `hello@getbindu.com` wraps inside its column at 360px.
- 600 to 767px uses the same phone rules.
- Intro length unchanged (outside this round's list).

## Checks (phone)
375x667, 390x844, 360x640, light and dark, and 375/390/360 in reduced motion: no horizontal scroll, no console errors, every pinned section finishes, the page end is reached by swiping. Frame count in the walks is coarse (about one frame per 1,000px), so pinned states were checked with `shots.mjs` at fixed fractions.

## Desktop and tablet unchanged
`desk.mjs` at 1440x900 and 1024x768, both themes, 21 or 22 offsets each (86 shots) plus a position and size signature of every visible element (25,402 elements): 0 differences against the pre-round code in the final run. Pixel differences: at most 0.07% of a screenshot (the hero canvas and sunflower animate), the same noise as comparing the old code with itself (0.07%). One earlier run showed 144 position differences inside the finale at 1024 while another process was using the CPU; two clean reruns (old code vs old code, new vs old) showed 0, so it was timing noise in the scrubbed zoom, not a code difference.
