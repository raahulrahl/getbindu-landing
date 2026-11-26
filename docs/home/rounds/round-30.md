Round 30 on branch `v3-story`. Follow CLAUDE.md. Change only what's listed. Context: rounds 24–29 in docs/home/DECISIONS.md.

Austin, in his own browser (http://localhost:3010, normal Chrome, he usually uses the LIGHT theme, scrolling with a mouse wheel or trackpad through Lenis):
- the map → ship hand-off does not happen
- the ship → dots → ı hand-off does not happen
Round 29's agent saw them only in headless dark-theme captures, so something differs in real use.

## 1. Find out why the two hand-offs don't happen in real use, and fix it
- **Reproduce first, exactly like Austin:**
  - Chrome via puppeteer-core at 1440x900, LIGHT theme (set it the way the site's theme toggle does; check the actual storage key in the code, don't guess)
  - first visit, intro playing
  - then scroll with real mouse-wheel events (page.mouse.wheel in steps of 100px every 16ms) all the way down, at three speeds (slow, normal, fast)
  - also scroll back up
  - also do it after resizing the window once mid-page
  - repeat in dark theme and at 375x667 with touch-like scrolling
- **Log the triggers:** add temporary console logging of each hand-off's trigger crossing and stage state, and capture frames at the hand-off points. Find the cause. Likely suspects:
  - trigger positions measured before fonts, images or the intro finished, and never refreshed
  - Lenis versus ScrollTrigger position mismatch
  - a "crossing" check that misses when one wheel step jumps past a small trigger window
  - the theme or band code changing heights after measurement
  - the guide canvas skipping redraws (the dirty flag never set by the hand-off)
- **Fix it robustly:**
  - trigger by state ("scroll position is past X") rather than by a crossing event in a narrow window
  - recompute positions on load, after fonts and images are ready (document.fonts.ready + image decode), on resize, and whenever section heights change (ResizeObserver on main)
  - make sure the hand-off tweens mark the canvas dirty every frame while running
- **Prove it:** frame captures in light AND dark, at all three speeds, forward and back, show each hand-off fully playing. Remove the temporary logs.

## 2. The ı dot is a collection of dots (not the font's tittle)
- Austin: "I want the dot to itself be a collection of dots."
- Use the wordmark with a dotless ı and no font tittle at all. The ı's dot is a small disc made of many tiny dots: a tight golden-angle sunflower (like the Bindu mark), about 40–60 dots, yellow in the middle blending to cobalt at the rim, sized and placed where the tittle would sit (its overall diameter about the tittle size, or slightly larger so the dots read).
- The ship's dots fly in and become exactly those dots: each ship dot is assigned one sunflower slot and lands in it. The finished state is a neat sunflower disc of dots, not one solid circle.
- In the zoom, the sunflower rides the mask transform and then fades, as the dot did before.
- Reduced motion: the finished sunflower disc.

## 3. Check
- npm run build passes.
- Item 1's evidence: describe the frame captures (themes, speeds, directions) in the report.
- 375 / 1440 / 1920, both themes: no horizontal scroll, no console errors.
- Commit per item ("v3 r30 N: ..."). Stage only changed files, LF. Dev server stays on 3010. Close puppeteer in a finally block and delete its temp profile.

## Report
Short: the root cause you found, one line per item, the evidence.
