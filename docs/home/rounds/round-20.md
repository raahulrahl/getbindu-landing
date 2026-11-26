Round 20 on branch `v3-story`, the "wow" pass. Do it after round 19 is complete. Follow CLAUDE.md, the brief, and rounds 17–19. Austin: the overall theme looks decent, so don't restyle it; add wow moments only. Every effect is scroll-reversible where scroll-linked, works in both themes, has a reduced-motion fallback, and stays at 60fps (transforms and opacity only; one rAF loop). No new npm deps (GSAP plugins in the installed package are fine).

## 1. Hero: camera dive into Europe and the ship launch (the big moment)
- As you scroll out of the hero, the dot world map (existing OGL canvas) tilts back in perspective (about 35°) while the camera eases in toward Europe.
- The yellow shipments on screen converge on EU ports. Then one shipment lifts off at Antwerp and becomes the guide ship, which sails into its gutter lane.
- Scrubbed with scroll; reverses fully.
- Reduced motion or no WebGL: the static map, with the ship already in its lane.
- Keep the hero text readable throughout (the dive starts once the headline has scrolled 30% away).

## 2. Headings: masked line reveals, one system site-wide
- Every section heading (h2) reveals line by line: each line slides up 100% inside its own mask, with a 60ms stagger and expo-out.
- Tied to scroll entry, playing in reverse when you scroll back above it. Use GSAP SplitText (lines + masks); re-split on resize.
- Don't apply it to body text. Reduced motion: shown at once.

## 3. Worked-example tags swing on their strings
- In the round-19 "let through / stop" tags, each tag hangs from its string and swings slightly with the horizontal scroll speed: a damped pendulum, max ±6°, settling in about 1s, with each tag's phase a little different. It looks physical, not bouncy.
- Reduced motion: no swing.

## 4. Price odometer
- In pricing, when the tab changes or the section first enters, the big price digits roll like an odometer (each digit column slides to its number, staggered 40ms), matching the button letter-roll motif.
- "Pricing on request" tabs crossfade instead. Nothing else in pricing changes (Austin likes it).

## 5. Magnetic primary buttons
- On pointer devices only, the yellow primary pills follow the cursor a little within about 80px (max 6px offset, the label 3px further for depth) and spring back on leave.
- Combine with the round-19 letter roll. Off on touch and under reduced motion.

## 6. Check
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, everything reverses on scroll up, reduced motion works, no console errors, no long tasks over 50ms while scrolling.
- Run the `review-animations` skill and fix what it flags.
- Commit per item: "v3 r20 N: ...". Stage only changed files, LF endings.

## Report
One line per item, judgement calls. No screenshots.
