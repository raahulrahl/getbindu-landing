Round 58 on the homepage (`/`). Build after rounds 55 to 57. Only change what's listed.

## 1. Shipment map (`#shipment`): sharp and smooth
- The page's background dot map must not show through the shipment map: hide or mask the fixed background dots behind the map stage (the stage gets an opaque canvas backing, or the background layer is clipped out under it).
- Sharper: render the map and ship canvases at the real devicePixelRatio up to 2 on desktop (1.5 on phones), snap thin lines to half pixels, and draw the ship from a vector path or a 2x sprite so it is crisp at every zoom. No CSS blur or filter on the stage itself (the r41/r48 blur belongs only behind text).
- Smoother: find what makes it sluggish (profile one full scroll through the pin): long scrub smoothing, redraws of the whole canvas every frame, layout reads in the loop, backdrop-filter repaints over the map. Fix the causes: shorter scrub smoothing (about 0.3s), redraw only what moves, cache static layers (land, routes) to an offscreen canvas, no layout reads per frame. Target a steady 60fps at 1440 on a laptop.
- Must NOT change: the map's size, centring, colours and look from round 56.

## 2. Departures board (`#examples`): crisp split-flap transitions
- Same concept (the airport board, one row per scroll step), better animation:
  - Real split-flap: each character is a top and bottom half; the top half folds down (rotateX 0 to -90deg) and the next character's bottom half folds down after it, about 70ms per flip, `power2.in` on the fold then a tiny settle (2deg overshoot back), like a mechanical flap.
  - Characters flip left to right with a 15 to 20ms stagger, and each character runs through 2 to 4 random letters before landing (not the whole alphabet), so a row lands in under 0.6s.
  - Rows change on the scroll step at once (no slow crossfade); the outcome (Let through / Stopped, in the pass/stop colours) flips last, with one soft click-in scale (1.0 to 1.04 to 1.0, 120ms).
  - Scrolling back reverses cleanly; a fast scroll skips to the final characters instead of queueing flips.
- Performance: transforms only, `backface-visibility: hidden`, one GSAP timeline per row reused, no layout reads during flips.
- Reduced motion: characters swap instantly.
- Must NOT change: the board layout, rows, content, colours, map behind it.

## Report
One line per item, what caused the sluggishness (with frame times before and after if you can measure), what was not verified.
