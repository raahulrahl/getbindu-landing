Round 26 on branch `v3-story` (A version; the lite branch stays as a draft). Follow CLAUDE.md. Change only what's listed.

## 1. Ending: back to "ship breaks into dots → the dot of the ı" with the normal wordmark
- Austin: the dot-lettering ending (r25 item 2) isn't working.
- Restore the normal text wordmark "bındu" (Inter, crisp, as in r23) instead of the dot lettering. Keep the visually hidden heading for screen readers if still needed.
- Keep from r25 item 2:
  - the ship comes down into view and holds
  - it breaks into dots visibly (about 1.0s)
  - the dots fly in curves and build the yellow dot of the ı (about 1.0s + 0.4s hold)
  - stages are time-based, queued, reversible on crossing back, with a gentle snap
  - the sounds
- After the ı is built, use the r23 hand-off: the wordmark slides up and fades (about 300ms), and the yellow ı dot bursts into the about 3,000 WebGL dots that settle into the final map (0.9–1.2s, expo-out).
- Reduced motion: the wordmark with its yellow ı dot, then the final section.
- The r25 2b dot-sunflower mark in the nav and footer stays.

## 2. Less space before the ending
- Close the gap between the previous section and the finale:
  - the finale pin goes from about 250vh to about 160vh (tighten the stage scroll points proportionally)
  - remove extra top padding or spacers, so the ship starts coming down as soon as the previous section's content leaves the viewport
- No empty screen between them at 1440x900 or 375x667.

## 3. Check
- npm run build passes.
- 375 / 1440 / 1920, both themes, reduced motion: no horizontal scroll, no console errors, the ending readable at slow and fast scroll.
- Re-run v3/qa/r24/perf.mjs once and report fps.
- Commit per item ("v3 r26 N: ..."). Stage only changed files, LF. Dev server stays on 3010.

## Report
Short: one line per item, fps. No screenshots.
