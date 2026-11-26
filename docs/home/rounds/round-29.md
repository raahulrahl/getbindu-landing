Round 29 on branch `v3-story`. Follow CLAUDE.md. Change only what's listed. Context: specs/round-28.md and the r28 entries in docs/home/DECISIONS.md.

## 1. Ending wordmark: smaller, just "bındu"
- Remove the rounded-rectangle outline frame from the mask SVG. The mask is only the "bındu" letters (plus the separate yellow ı dot).
- At rest, the wordmark is smaller: about 55vw wide on desktop (max about 900px) and about 80vw on phones, centred.
- Re-tune the zoom so the photo still fills the screen at the end. The origin is in a letter stroke as before, with the same scrub and smoothness. Keep the dot riding and fading.

## 2. Photo: show the containers
- Move the photo's framing up so the cargo containers are clearly visible inside the letters and in the full-bleed final view (Austin wants to see the containers, not mostly sky).
  - Start around background-position-y 70–80%, framed on the right-hand stack of container doors.
  - Use the full photo height, not the top-48% crop. Serve a version with enough resolution for that area.
- Keep the big "Hapag-Lloyd" side lettering (left stacks) out of frame where possible. Small door text is acceptable for the mockup. Update the LICENSES note: "swap for an unbranded photo before production".
- Keep the closing line and the footer readable (AA) on the new framing; adjust the gradient if needed.

## 3. Dots ↔ ship transitions must not "break"
- Both hand-offs look broken (pops, jumps, a frame where nothing is shown, dots and ship on different layers out of step):
  - on the map: Bindu mark dots → beads → guide ship
  - at the ending: ship → dots → ı
- Fix both:
  - **One canvas:** draw the whole hand-off on one canvas (the guide canvas), so no object jumps between canvases or between canvas and DOM mid-motion.
  - **Continuous motion:** each dot's path is continuous (no teleport). Use the same easing family for the dots and the ship, and keep velocity continuous between stages.
  - **The ship assembles progressively:** as the beads arrive, the ship outline draws in segment by segment and its containers fill as their dots land. It must never pop in fully formed. In reverse, it comes apart the same way. The ship splitting into dots at the ending is the mirror of this.
  - **No gaps:** there's never a frame where neither the ship nor its dots are visible.
  - **Same timing both ways:** forward and reverse look the same played backwards.
- Verify by capturing frames at 60fps through each hand-off (forward and reverse) at 1440 in both themes. Check there are no gaps, jumps or double objects, and describe the result in the report.

## 5. UPDATE (Austin): the ending again (overrides parts of 1–3 and r28 2c)
- **Smaller:** the "bındu" wordmark at rest is about 34vw wide on desktop (max about 560px) and about 70vw on phones.
- **The ship breaks on the RIGHT.** It stays in its right-hand gutter on its normal course line (undo r28 2c's curve into the middle). It splits into dots right there, on the right.
- **The dots become exactly the ı dot.** They fly from the right in smooth curves and converge into one solid circle that exactly matches the font's tittle (same size and position as Inter's ı dot at that size). They shrink and merge as they arrive (the last dots fade into the circle), so the end state is one clean yellow dot, never a loose cluster or group.
- **Smooth:** the whole ending must feel smooth at slow and fast scroll.
  - The break-and-fly is time-based (about 1.2s, quart-out, per-dot stagger 0–250ms) and starts on crossing.
  - The zoom is scrubbed (about 0.6) on a promoted layer, with mask-size and mask-position only.
  - No main-thread work during the zoom (precompute everything).
  - Verify with frame timing captures.

## 6. Photo: containers must be recognisable
- At the moment the containers look too big inside the small letters. Scale the photo so whole container stacks (several doors, rows and edges) are visible inside the wordmark at rest: the background-size relative to the wordmark box, not the viewport. Showing about 60–70% of the photo's width across the wordmark is the goal.
- The full-bleed final view can use cover. Keep the big side lettering out where possible.

## 7. Transitions between sections: less pale
- The page reads washed-out because every section sits on the same ivory. Like Rothfinder, give the sections a rhythm of background bands, all from tokens in both themes:
  - hero: canvas
  - statement: pale cobalt tint
  - Sound familiar?: canvas
  - How it works: panel
  - journey: canvas
  - departures board: deep ink band (dark board on a dark band)
  - pricing: canvas
  - FAQ: panel
  - ending: photo
- **Between sections, the page background crossfades** smoothly as you scroll from one band to the next (a body background tween driven by section positions, about 30vh of overlap), instead of hard edges. Text colours swap with it where a band is dark.
- **Each section's content gently rises in** (12px, staggered 60ms) as it enters, and reverses.
- Check AA contrast on every band. No gradients or blobs.

## 4. Check
- npm run build passes.
- 375 / 1440 / 1920, both themes, reduced motion: no horizontal scroll, no console errors.
- Run perf.mjs once and report fps.
- Commit per item ("v3 r29 N: ..."). Stage only changed files, LF. Dev server stays on 3010. Close the puppeteer browser in a finally block and delete its temp profile.

## Report
Short: one line per item, fps, what the frame captures showed. No screenshots as deliverables.
