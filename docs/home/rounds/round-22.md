Round 22 on branch `v3-story`. Do it after the remaining round-21 items. Follow CLAUDE.md, the brief and rounds 17–21 except where this changes them.

## 1. Far fewer sounds
Keep only these cues (still off by default, still varied):
- the proof chime at each section anchor (rising pentatonic)
- the departures-board clack
- the primary-button hover clack
- the ship horn when the ship is clicked (easter egg)
- the finale resolve

Remove everything else:
- route dot ticks and waypoint ticks
- typing clicks, the pencil scratch, the sign blip
- odometer ticks
- FAQ, theme-toggle and nav-mark sounds
- the dispersal shimmer

Log the final list in DECISIONS.md.

## 2. A better-looking ship
- Redraw the guide ship with more care. It's still a side view in ink, still about 56px desktop / 28px on the map:
  - a proper hull with a raked bow and a flat stern, waterline and boot-topping line
  - the bridge / superstructure aft with windows
  - containers in neat stacked rows (2 tiers, 5–6 bays), exactly one yellow, the rest outlined in cobalt
  - a short white-water wake line
- Clean, consistent 1.25px strokes; no wobble on the ship itself.
- It sits on the course line, not floating above it.

## 3. More blue dots while it sails
- Make the cobalt trail denser: one cobalt dot every about 20px (was 40), slightly varied sizes (2–4px) and opacities. Older dots fade to about 40% further back, so the trail reads as a soft cobalt wake.
- Yellow stays reserved for proof dots at section anchors.

## 4. A more realistic map (journey section)
- Replace the hand-typed coastlines with Natural Earth land data (public domain, free for commercial use; 1:50m or 1:110m, simplified to keep the bundle small, under about 150 KB).
  - Project it with the same equirectangular framing per story.
  - Draw it in the ink style: crisp 1px coastlines, a light land wash in tokens, faint graticule, small port dots and labels.
- Add the source to LICENSES.md ("Natural Earth, public domain").
- Must work in both themes with tokens only.

## 5. On the map: ship → dots → ship
- In the journey section only: when the ship reaches the destination port, it breaks into dots (yellow and cobalt) that settle on the port like a little cluster on the map.
- The dots then flow back together and re-form the ship, which sails out of the map into the opposite gutter.
- This replaces the r21 "ship fades at the end of the map".
- Time-based (about 1.2s total), triggered at the arrival point; it plays forward when crossing it downward and in reverse when crossing it upward (see item 7). Reduced motion: no break-up.

## 6. Headings clearly visible again
- The r20 masked line reveal leaves headings hidden or half-shown too long, and some are hard to read.
- Fix:
  - the heading is fully readable by the time its top is 85% down the viewport
  - the reveal uses only the masked translateY (opacity always 1, no blur, no colour fade)
  - headings in pinned sections are shown immediately when the pin starts
  - nothing (route, dots, ship) is ever drawn over a heading
- Check heading contrast in both themes against the brief (AA minimum; they were clearer before r20). If the masks clip descenders, add padding to the mask.

## 7. Finale: smooth at any scroll speed
- The finale (ship breaks into dots that land on the ı; the wordmark dissolves into dots that become the map) looks sluggish when you scroll slowly, because every in-between frame is tied to the scroll.
- Make both moments time-based instead of scrubbed:
  - each has a fixed-duration timeline (about 0.9–1.4s, expo/quart-out, with per-dot stagger and varied speeds so it feels alive)
  - crossing the trigger point downward plays it forward at full speed; crossing upward plays it in reverse
  - snap the scroll gently to the two resting states, so the reader is never parked mid-transition
- Keep the drawing on canvas and target 60fps.
- Keep the idea: the ship becoming Bindu, and the letters becoming the map.
- Reduced motion: no animation, just the end states.

## 9. Button: back to the old animation, arrow only (overrides r21 item 8)
- Go back to the round-19 letter-roll hover: characters slide up and their duplicates come in from below, with a stagger.
- No dot. A plain arrow after the label, which nudges 4px right on hover. Drop the decode effect and the arrow cell / divider.
- Yellow fill never changes on hover. Keep the magnetic pull and the soft clack (if sound is on).

## 10. Ship: really make it look good (adds to item 2)
- Base its proportions on a real feeder container ship's side profile: length about 6.5× hull height, bridge at about 80% of the length toward the stern, a slight sheer line.
- Draw it as a careful SVG at 4× size, then scale it down, so it stays crisp at 28–56px.
- Show it to yourself at 1440 and 375 and refine until it reads instantly as a container ship.

## 11. Journey map: fuller and more realistic, no empty right side (adds to item 4)
- The map fills the section's full width and bleeds to the right edge of the viewport, so there's no empty right half. Milestone notes sit on the map (with leaders), not in a separate column.
- Show more real land context around the route (neighbouring coasts, inland faint country borders from Natural Earth admin-0 at very low opacity, a few major port names in small caps).
- At the destination end (right side), add a small inset of the arrival port area at larger scale, drawn the same way.
- Keep it in one window and in tokens, in both themes.

## 12. Journey headings bigger
- In the journey section, the section title steps up one size (display-lg).
- Each story's description line (e.g. "2 containers of cocoa beans, Guayaquil (Ecuador) to Antwerp…") becomes body-lg in full ink (not muted), max 60ch, directly under the title and above the tabs.

## 13. Light theme: more contrast, and more "Bindu = dot"
- **Contrast (light only, tokens):**
  - canvas a touch deeper (around #F1ECE1)
  - cards and panels lighter (around #FBF9F4)
  - body text and ink lines deeper navy (around #0E1A30)
  - ink lines 1.25px
  - cobalt links a step deeper
  - check AA everywhere
- **The dot motif, kept restrained:**
  - section dividers become a dotted rule: small cobalt dots with one yellow dot
  - list bullets become small Bindu dots
  - a thin scroll-progress rail of dots in the right gutter, which fill cobalt as you read, with the current section's dot yellow
  - no dot-grid backgrounds (still rejected)
- The same motif in dark with dark tokens.

## 14. Final transition: many more dots (adds to item 7)
- The wordmark → map dissolve uses many more particles (about 2,500–4,000), so it reads as one fluid flow rather than a few sluggish dots.
- Render with WebGL points via OGL (already installed), with a 2D canvas fallback at about 800 dots.
- Per-particle varied speed and a slight curl/noise drift, then they ease into the map positions.
- Still time-based, forward and reverse (item 7), 60fps, and paused when off-screen.

## 15. Hero headline on two lines
- "Describe a shipment. / Bindu handles the rules." sits on exactly two lines at 768 and up (one sentence per line). Adjust the size and max-width; don't change the words. At 375, up to 3 lines is fine.

## 16. Soft backdrop behind headings
- Behind every section heading (and the hero headline), add a soft local scrim so moving dots, routes or the map never disturb it:
  - a feathered canvas-coloured patch with backdrop-filter blur about 8px
  - edges fading out over about 40px through a radial mask
  - no border, no visible box, no glass look
  - padding hugs the text block
- Fallback without backdrop-filter: a canvas-colour gradient at 85% opacity.
- Both themes, tokens only.

## 17. More Bindu dots, tastefully
- **Every heading's full stop is a Bindu dot:** in each heading that ends with ".", the full stop renders as a small yellow dot (same size as the period). It drops in last, after the line reveal (about 200ms, slight settle). Screen readers still read the text normally.
- **Denser hero map:** about 30% more cobalt dots and a few more yellow shipments on routes. Keep the headline readable (item 16 helps).
- **Primary-button click:** 6–8 tiny yellow and cobalt dots burst outward from the arrow and fade (about 400ms), on pointer devices only, never under reduced motion.
- No dot-grid backgrounds.

## 18. Course line: straight and professional, plus a dash sound on transitions
- The gutter course line has no curves or wobble. Straight vertical runs, with any change of position (gutter side switch, entering or leaving the map) made as a clean 45° segment with a small rounded corner (radius about 8px), like a transit or chart line.
- **Dashes:** ahead of the ship, crisp even dashes (4px dash / 6px gap, butt caps, 1px). Behind the ship, a solid 1.25px line. The waypoint ticks are perfectly perpendicular and evenly spaced.
- Everything is pixel-snapped (0.5px offsets for 1px lines) so it renders sharp.
- **Sound:** add back one cue, `dash`: a short, soft, airy swoosh (filtered noise, about 180ms, 4 variants). It plays when the ship makes a transition (each 45° segment, entering and leaving the map, the gutter switch), and only then. This adds to the five cues kept in item 1. Off unless sound is on.
- The same straight style applies to the map route segments where it makes sense (sea lanes can keep gentle great-circle curves, but no wobble).

## 8. Check
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, headings readable, reduced motion works, no console errors, no sound before the toggle, smooth at slow and fast scroll.
- Commit per item: "v3 r22 N: ...". Stage only changed files, LF endings.

## Report
One line per item, judgement calls. No screenshots.
