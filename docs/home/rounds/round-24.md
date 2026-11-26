Round 24 on branch `v3-story`: performance first, then three fixes. Follow CLAUDE.md and the brief. Context: specs/round-17.md to round-23.md describe what's built; docs/home/DECISIONS.md has the details. Don't change anything not listed.

## 1. Performance: the whole site feels slow and laggy (do this first)
- Load the `animation-performance` skill and follow it.
- **Measure before changing anything:** headless Chrome performance trace (puppeteer-core is available via v3's node_modules; Chrome at C:/Program Files/Google/Chrome/Application/chrome.exe). Use 1440x900, 4× CPU throttle, scroll the whole homepage top to bottom at a steady speed. Record the long tasks (>50ms), average frame time / dropped frames, and the main-thread time per script. Save the numbers in DECISIONS.md.
- **Fix the causes, likely including:**
  - **One loop:** a single animation loop for everything (gsap.ticker). No separate requestAnimationFrame loops for the guide, wake, particles, hero map or board.
  - **Off-screen work:** every canvas or WebGL loop (hero OGL map, wake, finale particles, journey map) stops completely when off-screen (IntersectionObserver) and when the tab is hidden. Nothing animates that isn't visible.
  - **Canvas resolution:** devicePixelRatio capped at 1.5 for all canvases. Particle and wake pools are pre-allocated, with no per-frame allocations or garbage.
  - **Heading scrims:** backdrop-filter blur over moving content is very expensive while scrolling. Replace it with a static feathered canvas-colour gradient scrim (same look, no backdrop-filter).
  - **Scroll handlers:** no layout reads (getBoundingClientRect, offsetHeight) inside them or in per-frame code. Cache positions on resize and refresh ScrollTrigger once.
  - **ScrollTriggers:** fewer of them. Batch the heading reveals (ScrollTrigger.batch). Remove scrub where a play/reverse toggle looks the same.
  - **Paint costs:** content-visibility:auto (with contain-intrinsic-size) for sections well below the fold; will-change only on elements that are animating right now; no animated box-shadow, filter or blur.
  - **Lenis:** check its settings (lerp about 0.1, no extra smoothing on touch), and make sure ScrollTrigger is driven by Lenis's scroll, not both.
- **Measure again with the same method.** Targets: no long tasks over 50ms while scrolling, about 55+ fps at 4× throttle, and the hero visible quickly (LCP under about 2.5s on a local preview build). Report the before/after numbers.

## 2. Ending: smooth dots
- The final burst (yellow ı dot → about 3,000 dots → final map) is still not smooth on a 2D canvas.
- Move it to WebGL points with OGL (already installed): positions animated in the vertex shader from start/end attributes and a single uniform for progress (0→1), with a per-particle delay and curl offset baked into the attributes. The CPU only updates one uniform per frame.
- Keep it time-based (about 0.9s, expo-out), forward on crossing down and reverse on crossing up, and the gentle snap.
- 2D canvas fallback (about 800 dots) only if WebGL is unavailable. Reduced motion: end state only.

## 3. Ship: revert to the previous drawing, smaller
- Remove the Tabler icon ship (it looks big). Restore our r22 redrawn ship: raked bow, bridge with windows, 2×5 containers with one yellow (from git history: the commit "v3 r22 2: redrawn ship…").
- Make it smaller: about 40px wide on desktop in the gutter and about 22px on the map.
- Remove the Tabler entry from LICENSES.md if nothing else uses it. Keep the bob, the horn and the stroke weight.

## 4. End of the map: dots stream into the guide ship (round-23 item 6, unfinished)
- At the destination port, the dots form the small golden-angle Bindu mark (as now, with the chime).
- Then they stream out of the map along the course line in a tidy line, like beads, and assemble into the guide ship in the gutter. The ship does not re-form on the map anymore.
- Use the same WebGL/canvas approach as item 2 if it helps smoothness.
- Time-based, about 1.4s, forward/reverse on crossing, `dash` sound when they leave the map.

## 5. Check
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, no console errors, reduced motion works, no sound before the toggle.
- Commit per item: "v3 r24 N: ...". Stage only changed files (never the unrelated deleted files), LF endings.
- Dev server on port 3010 (start `npx vite --port 3010 --strictPort` in v3 if it's not running).

## Report
Short: one line per item, the before/after performance numbers, judgement calls. No screenshots.
