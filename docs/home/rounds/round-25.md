Round 25: the speed fix (A), the ending slowed down so it can be seen, then a draft with less motion (B) on its own branch for comparison. Follow CLAUDE.md and the brief. specs/round-17.md to round-24.md and docs/home/DECISIONS.md describe what's built. Change only what's listed.

## Part 1, on branch `v3-story`

### 1. Speed fix A: draw the moving parts on canvas
- Replace the SVG-per-dot rendering with one canvas each:
  - **Guide:** one fixed, full-viewport canvas (pointer-events none, dpr ≤1.5) draws the course line (dashes, ticks, sine meander), the cobalt wake and permanent trail, the yellow proof dots, the mini marks, and the ship. Draw the ship from cached Path2D objects (or one pre-rendered offscreen bitmap per size). Same look as now.
  - **Journey map:** coastlines, land wash and graticule are pre-rendered once to an offscreen canvas per story and frame size (redraw only on resize, theme or story change). The route, moving dots and markers go on a live canvas layer above. Milestone notes and labels stay as real HTML text (for accessibility and indexing), positioned with transforms only and updated only when they change.
  - Only redraw a canvas when something on it changed (dirty flag), from the single gsap.ticker loop. Stop when off-screen.
- Re-run the round-24 measurement (v3/qa/r24/perf.mjs, same settings). Report before/after; targets as in round 24.

### 2. Ending: slower, visible, staged
Sequence (pin the finale over about 250vh):
1. **Ship comes down:** the ship comes down from the gutter into clear view, centred above the "bındu" wordmark, and holds for a moment.
2. **Break-up:** the ship breaks into dots visibly (about 1.0s): the outline and containers come apart into yellow and cobalt dots that drift a little.
3. **The ı dot:** the dots fly in curved paths and build the dot of the ı one by one (about 1.0s), with a short hold (about 0.4s).
4. **Burst:** the ı dot bursts into the about 3,000 WebGL dots that settle into the final map (about 1.2s), while the wordmark slides up and fades.

How it plays:
- Each stage is time-based and starts when its scroll point within the pin is crossed. Crossing back reverses it. That way slow scrolling shows each stage clearly without sluggish in-between frames, and fast scrolling still plays every stage in order (queue them, don't skip).
- Gentle snap to each stage's resting point.
- Sounds (if on): a dash when the ship descends, a chime when the ı forms, the resolve at the burst.
- Reduced motion: the end state only.

Commit each item: "v3 r25 N: ...". Build must pass.

## Part 2, the draft: branch `v3-story-lite` (created from v3-story after Part 1)

### 3. B: do less at once (draft for comparison only)
- **Wake:** the cobalt wake is thinner, at most 1 dot per 20px, the permanent trail 1 per 40px, and drift is off.
- **Hero map:** the ambient animation runs at 20 fps with about 30% fewer moving shipments. The intro stays full rate.
- **Phones (≤600px):** no wake or trail; just the guide dot and the proof dots.
- **Departures board:** fewer random flips per character (1–2).
- **Heading reveals:** shorter (300ms).
- Measure with the same script and report the numbers next to Part 1's.
- Run its dev server on port 5194 (`npx vite --port 5194 --strictPort` in a separate git worktree at ../bindu-lite, so 3010 keeps serving v3-story). Don't merge anything.

## Rules
- Stage only changed files; never the unrelated deleted files. LF endings. No new npm deps. No screenshots as deliverables.
- Stop the stray preview servers on ports 5192 and 5193 (round 24's) before you start. Leave 3010.
- Report: one line per item, before/after numbers for A and for A+B, which URL shows which, and judgement calls.
