Round 23 on branch `v3-story`. Do it after the remaining round-22 items (10, 11 rest, 13, 16, 17, 8 check). Where this conflicts with round 22, this file wins. Same rules as before.

## 1. "Stopped" in red
- In the departures board, the "STOPPED" verdict uses a new semantic token `--stop`: a clear but not neon red. Light: about #B42318; dark: about #FF6B5E. It must pass AA on its background.
- Only the verdict text (and its small mark, if any) uses it. "LET THROUGH" stays cobalt. Log the new token in DECISIONS.md.

## 2. Ship: use a professionally drawn icon instead of our drawing
- Our own drawing still doesn't look good. Compare the container/cargo ship icons in Lucide (ISC), Tabler Icons (MIT) and Phosphor (MIT). Pick the cleanest side-view cargo ship and copy its SVG path into our code (no npm dependency).
- Adapt it: stroke in --line-ink, one container filled yellow, the rest outlined. Keep the stroke weight consistent at 28 and 56px.
- Add the icon set and its licence to LICENSES.md.
- Keep the horn easter egg and the gentle bob.

## 3. Course line: gently wiggly again (overrides r22 item 18's straight runs)
- Austin wants the track to wiggle, but it must stay professional. Give it a smooth, regular sine-like meander (amplitude about 10–14px, wavelength about 220px), the motion of a ship on water. No jitter or hand-drawn noise.
- Keep the crisp dashes ahead, the solid line behind, the ticks perpendicular to the local direction, and the `dash` sound on transitions.

## 4. Many more blue dots while the ship moves
- The cobalt wake spawns dots by speed: the faster you scroll, the more dots (up to about 1 every 8px), with slight sideways drift (±6px) and fade-out over about 1.5s, so it looks like a living wake rather than a fixed dotted line.
- Keep a sparse permanent trail (1 every about 30px) behind so the route stays readable.

## 5. Journey map inside the borders (overrides r22 item 11's bleed)
- The map no longer bleeds past the right edge. It fills the content container exactly: left edge aligned with the section title, right edge with the content's right edge, same grid as every other section. No overflow at any width.
- Keep the fuller land context and the arrival inset, fitted inside the frame. The milestone notes stay on the map, inside the frame.

## 6. End of the map: nicer dots, then into the guide ship
- When the ship reaches the destination port, its dots gather into a small golden-angle Bindu mark (sunflower) on the port, neat and evenly spaced, instead of a loose cluster.
- Then the dots stream out of the map along the course line in a tidy line, like beads on the route, and assemble into the hovering guide ship in the gutter.
- Time-based, about 1.4s total, forward on crossing down and reverse on crossing up (as r22 item 7). Sound: one chime when the mark forms, a dash when they leave the map.

## 7. The ending must not look sluggish: no text → dots
- Stop sampling the wordmark letters into particles; that's what looks sluggish. Instead:
  1. The ship's dots land on the ı (as now).
  2. The wordmark itself stays crisp and slides up and fades quickly (about 300ms).
  3. The yellow ı dot bursts: it multiplies into about 3,000 dots that shoot out radially with varied speeds and a slight curl, then settle into the dot world map behind the final CTA section. So it's dot to dots, which reads as natural.
- Total about 0.9s, expo-out, starting the moment the trigger is crossed (no scrub delay), and the reverse plays back in.
- WebGL points via OGL (the canvas fallback can use fewer dots). Gentle snap to the two resting states stays.

## 8. Check
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, the map inside its borders, headings readable, reduced motion works, no console errors, smooth at slow and fast scroll.
- Commit per item: "v3 r23 N: ...". Stage only changed files, LF endings.

## Report
One line per item, judgement calls. No screenshots.
