Round 59 on the homepage (`/`): fixes from Austin's component-by-component review (docs/home/component-review.md). Items are added as the review goes; build each as it arrives. DESIGN.md v4 (Ollama + yellow and cobalt). Only change what's listed.

## 0. Fonts load everywhere
- Confirm Nunito (display) and Inter (body) actually load in dev and in `next build` + `next start` (the r55 run was offline and fell back to system fonts). Every heading on the page uses the display stack, every other text the body stack, data uses the ui-monospace stack. Fix any section that sets its own font family or weight outside the tokens. List them.

## 1. Hero: a bigger title with depth (review item 2)
- Entrance: no dots effect (Austin dropped it: "the bigger title itself is enough"). The title fades up like the other headings, then the sub-line, then Book a demo.
- Then the sub-line fades up word by word (0.04s stagger), then Book a demo fades up.
- Type: title up to clamp(48px, 8vw, 120px), display face weight 600, tracking -0.035em, line-height 0.98, sentence case, balanced lines.
- Depth: the map dots behind the title area dim in a soft halo (a radial falloff drawn in the map canvas around the title's box, not a CSS overlay), so the title sits on the map. On scroll the title moves at 0.85 of the scroll speed (slight parallax), transforms only.
- Sub-line: 22 to 24px, `charcoal` (#525252 light; on-dark-mute dark), max width so it breaks into two balanced lines.
- Phones and reduced motion: the finished title, sub-line and button, no dots effect, no parallax.
- Must NOT change: the map, the pause button, the copy, the intro dot bloom (the title effect starts after it).

## 2. Statement (`#statement`): smooth light-up (review item 3)
- Austin: the light-up "doesn't feel very smooth"; everything else stays. Find the cause (words switching in steps, a class toggle, a CSS transition fighting the scroll, unsmoothed scroll progress, per-frame layout reads) and fix it:
  - One GSAP timeline on one ScrollTrigger with `scrub: 0.6` (smoothed), not raw progress.
  - Each word ramps opacity continuously from its dim value to full over a window about 3 words long, overlapping its neighbours, so the light travels through the sentence like a wave instead of switching word by word. Animate opacity (and at most a 2px y settle) only.
  - The Bindu chip and the mark light on the same timeline and the same ease as the words, no separate CSS transition.
  - No `transition` on the words; no layout reads during the scroll; `will-change: opacity` only while the section is on screen.
- Reduced motion: the sentence fully lit.
- Must NOT change: size, font, copy, the full-window layout, the chip.

## 3. Story (`#story`): looks like real product, moves crisply (review item 4)
Austin loves the idea and the structure (pin, four steps, progress left, stage right). Problems: the font is off, it "looks vibecoded", the illustration "looks drawn by a kid", the motion is sluggish. Keep the structure, steps, copy and statuses.
- **Type:** every text on the stage uses the page tokens only: the body face at 14 to 16px for UI text, the display face for the step titles, the ui-monospace stack for codes and the reference. No per-element font sizes or weights outside the scale; one weight for labels (500), one for values (400).
- **Redraw the stage as real product UI, not drawings.** One app frame (Ollama card: 12px, 1px hairline, canvas fill) with a 40px title bar (app name and an Illustration chip). Inside, on one 8px grid with equal gutters: a proper text input (the typed sentence), the filing record as a tidy key/value table (label column 120px, hairline rows, 40px row height), rule chips in the Ollama chip style (Live yellow, In build hairline), supplier messages as two clean message cards (initial avatar circle 24px, sender name, one line, an attachment row with a file icon and file name). One icon set only (Lucide, ISC licence; add to LICENSES.md), 16px, 1.5px stroke, ink or mute. Delete every hand-drawn or wobbly SVG path, uneven stroke and arbitrary offset; lines are 1px, straight, pixel-aligned; routes between record and suppliers are clean cobalt curves of one stroke width.
- **Motion, crisp not sluggish:** profile it first and report the cause. Then: pin 360svh (was 500), `scrub: 0.4`, each step plays in its first 50% and holds; at most two things move at once; durations 0.35 to 0.6s on the timeline scale; one ease for arrivals (`--ease-out`) and one for travel; no MotionPath arcs longer than the gap they cross; transforms and opacity only; no per-frame layout reads; no backdrop-filter on the stage.
- Phones and reduced motion: as now (steps as a list and the finished record), with the new UI styling.

## 4. Full Circle (`#how`): one look with the rest, stronger type (review item 5)
- Austin: it "looks different", the type is not strong. Keep structure, acts, tabs, copy, motion idea.
- Type: the per-act h2 uses the same section-title size and weight as every other section (display face, 600); the "Full Circle" label at the page's small-label style; captions at body 18px, the current caption in ink at 500, the others in charcoal (not the light mute); no section-specific font sizes, weights or families.
- Stage: the same app frame as the story (Ollama card, 40px title bar with the act name and the Illustration chip) so the two sections read as one product. Drawings use the story's line system: cobalt strokes at one width (1.5px), round caps, straight or clean curves, pixel-aligned, labels in the body face 14px; remove any thin, faint or uneven strokes.
- Tabs: the page's tab component, unchanged otherwise.
- Must NOT change: the acts, their scenes, the pin behaviour.

## 5. Shipment map (`#shipment`): realistic, sharp at every zoom, an animation that lands (review item 6)
Austin: the map "looks very naive", it blurs when it zooms in, the ship path is blurred, "the animation is not hitting". Keep the tabs, milestones, question card, layout, size, centring and colours.
- **Sharp at every zoom:** find why it blurs (a bitmap or canvas scaled with CSS `transform: scale`, or a low-res cached layer reused while zoomed). Never scale a rasterised map. Redraw land, routes and ship each frame at the current camera scale through the canvas transform (`ctx.setTransform` with the zoom), with cached Path2D geometry, so lines stay 1px and crisp at any zoom; or render the map as SVG with `vector-effect: non-scaling-stroke`. DPR up to 2 on desktop.
- **Realistic:** real coastlines from Natural Earth (public domain; 1:50m for the zoomed views, 1:110m for wide views; add to LICENSES.md) in one equal-area or Robinson projection; land a quiet fill, coastline 0.75px, no country borders except a very faint line in zoomed views; real port positions for each milestone; sea routes that follow real shipping lanes (waypoints through Suez, Gibraltar, the Channel as the route needs), never crossing land.
- **Ship and path:** the ship is a crisp vector drawn at the current scale (same silhouette), with a short fading wake behind it; the path ahead is a dashed cobalt line, the path behind solid, both stroked at a constant screen width.
- **The animation that lands:** a camera that follows the ship: it starts wide on the whole route, eases in toward the ship as it sails (smooth damped pan and zoom, no jumps), slows and frames each milestone port as it arrives (the milestone label appears there), and pulls back out at the end to show the full route travelled before the hand-off. Scrubbed by the scroll, reversible, `scrub: 0.4`.
- Performance: 60fps target at 1440; Path2D caching; no layout reads per frame; no CSS filters on the stage.
- Phones and reduced motion: as now, with the sharper drawing.

## 6. Departures board (`#examples`): smooth steps, the map visible (review item 7)
Austin: the transition while scrolling "looks very sluggish and not optimised, unpleasing"; the background map "is not visible at all even though there is empty space". Keep the board, rows, colours, size, the split-flap concept.
- **Profile first** (a full scroll through the pin) and report the cause: likely flips tied to the smoothed scroll position, too many elements (two halves per character across 8 rows), timelines rebuilt per step, or layout reads.
- **Steps, not a scrub:** the pin tracks which row is current; when the step changes, that row's flip timeline PLAYS at its own speed (about 0.5s for the row) and is not scrubbed by the scroll. Fast scroll: jump to the final state of skipped rows. Scrolling back: the row flips back the same way (play reversed), not a blank.
- **Lighter:** build each row's flaps once, reuse one timeline per row, only the characters that change get two halves (unchanged characters stay a single static cell); `contain: layout paint` on each row; transforms and opacity only; no layout reads during flips; no backdrop-filter in the section.
- **The map behind:** find why the fixed dot map is invisible in this section (hidden or faded after the shipment hand-off, an opaque section or pin background, the board's panel stretched to the window). The map must show in the empty space around the board in both themes, with the board itself a solid panel so the flaps stay readable.
- Reduced motion: instant swaps.

## 7. Testimonials (`#voices`) and rules (`#rules`): remove the lag (review items 8 and 9)
Austin: both look right, the animations are "a little laggy". Change nothing visible.
- Profile each (scroll through, drag, at 1440) and report the cause and frame times before and after.
- Likely fixes: drive transforms from one GSAP ticker with quickSetters, never React state per frame; no layout reads (getBoundingClientRect, offsetWidth) inside the loop, measure on resize only; transforms and opacity only (no animating filter, box-shadow, width or clip-path); `will-change: transform` only while moving; pause the loops when the section is off screen (IntersectionObserver); the testimonials' word light-up as one batched opacity write per frame; the rules' three looping copies culled when off screen; no backdrop-filter behind moving cards; the r57 velocity bend read from Lenis velocity once per frame.
- Must NOT change: looks, timings, behaviour.

Not in this round (Austin): pricing, FAQ, finale and footer stay as they are.

## Report
One line per item, judgement calls, what was not verified. Look at the page yourself.
