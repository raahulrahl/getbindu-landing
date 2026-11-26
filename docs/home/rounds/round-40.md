Round 40 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed. One commit per item. Don't push.

## 40-1. Full Circle: scroll-driven and easier to see
- Austin: it must scroll, not play like a video; it is hard to see and hard to read.
- Motion: no autoplay, no timers, no play/pause/replay button. One pin; the three acts play
  in order (The Fabric, The Bean, The Circle), every beat a pure function of the scroll
  position, reversible. Each beat gets an equal share of scroll (about 50 to 60svh) with a
  hold in its last third. The tab row stays as a progress indicator and jump links (click
  scrolls to that act's start). Respect the site pause control only for any idle loops.
- Layout (different from the Ask section next to it, which has captions on the left):
  - Top row: title + lead left, the act tabs right, on one baseline.
  - The stage below at the full container width and as tall as the window allows: it is
    the main thing in the window.
  - The current caption sits under the stage in one line, body-lg (19px) or larger, full
    ink, with the yellow proof dot; a thin progress row of beat dots next to it.
    Only the current caption shows (it swaps with a short fade on beat change).
- Legibility inside the stage: line weights and node sizes scaled so they read at 1280
  wide; every text label in the stage at least 14px rendered and ink or mute colour on a
  solid stage surface; nothing smaller than the caption's meaning needs. The stage panel
  uses the panel token with one hairline, so the map dots never show through it.
- Fits one window at 1280x720 to 1920x1080 and 768x1024; nothing overflows.
- Phones and reduced motion: unchanged from r39 (final frame per act, caption list, tabs).

## 40-2. Full Circle copy (honesty)
- Act three: textile passports are labelled Live on getbindu.com (Austin's rule: on the
  site = live). Remove the "In build" mark and the "Coming:" prefix. Keep only lines the
  site supports: check getbindu.com's passport pages (or features/landing/regulation/
  dpp-textiles-page.tsx, the same copy) for the shopper scan, the recycler scan and
  customs access; drop or rewrite any caption the site doesn't say.
- The Fabric caption 4: "Supplier C never sends the documents, so nothing comes back."

## 40-3. Blur the map behind content
- Austin: the dot map behind the page hurts readability. Wherever there is content, the
  map should be blurred.
- In the hero the map stays sharp (unchanged). From the hero's exit onward, the fixed map
  layer (`MapLayer.tsx`, `.stage`) is blurred and dimmed behind all content: target about
  8px blur and about 35% of its current strength, ramped by the same scroll measure as
  r33-3's `shipFade()` (pure function of scroll, reverses). Apply it to the canvas element
  (one layer), not as backdrop-filter on every section. Panels with a solid surface stay
  solid.
- Measure the cost: frame timing while scrolling at 1440 with and without the blur (the
  repo has perf scripts in qa/ or use Playwright tracing). If the blur costs more than a
  couple of ms per frame, render the blurred state into a cached bitmap instead of a live
  CSS filter. Report the numbers.
- Reduced motion: the blurred, dimmed map outside the hero, no ramp. Phones: same.

## 40-4. Feel the change from one window to the next
- Austin: moving from one section to the next isn't felt; change the colour a little so
  the step is visible.
- In `lib/bands.ts` / `bands.css`: make sure no two neighbouring sections share a band
  (alternate canvas and tint/panel down the page), and widen the step between band
  colours slightly in both themes so it is visible but calm (aim for a lightness step of
  about 3 to 4% in OKLCH; check text contrast stays AA on every band). The crossfade
  stays scroll-driven. No lines, gradients or shadows added.
- List the final band per section, both themes, with hex values, in the report.

## Report
One line per item, judgement calls, perf numbers for 40-3, screenshots at 1440 both
themes: Full Circle at three beats, one section boundary mid-crossfade, a content section
over the blurred map; plus 1280x720 Full Circle.
