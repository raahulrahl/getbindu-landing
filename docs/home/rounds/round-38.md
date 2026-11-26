Round 38 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed. One commit per item. Don't push.

## 38-1. Nav: one "Regulations" dropdown, design-doc type
- Austin: parallel.ai doesn't list every product in its bar. Group the regulation pages.
- Bar, left to right after the logo: How it works · Pricing · FAQ · Regulations (dropdown) ·
  Blog. Then the theme toggle and the demo pill (unchanged).
- Dropdown items (from `links.ts` NAV_PAGES, same URLs): EUDR, CBAM, REACH, PPWR,
  Passports. One short plain line under each is optional; if used, only facts already on
  the site, no status claims. No icons, no cards, no glow: a simple panel on the theme
  surface with one hairline border, `--r-sm` radius, the same item type as the bar.
- Behaviour: a real disclosure button (`aria-expanded`, `aria-controls`), opens on click
  and on hover with a short delay on fine pointers, closes on Esc, click outside, and focus
  leaving; arrow keys move between items. Chevron rotates 180deg, 200ms, the house easing.
  Reduced motion: no transition.
- Type (fixes the r36-3 mono caps): follow docs/home/DESIGN.md and brief section 9: sentence
  case, `--font-sans`, body-sm size, weight 500, muted colour, full contrast on hover and
  for the open dropdown. No mono, no caps, no letter-spacing. Same in the dropdown.
- Phone drawer: the same order; Regulations is a group heading with its five links under
  it (no nested toggle needed). 44px targets stay.
- Must NOT change: bar height (56px), logo, demo pill, theme toggle, footer.

## 38-2. Ask your supply chain: fit, pace, highlight
- Austin: the steps flow out of the box, the animation plays too fast, and the current step
  isn't clearly highlighted.
- Fit: the whole section (heading, lead, five captions, tabs, stage) fits one window at
  1280x720, 1440x900 and 1920x1080, and at 768x1024. Nothing overflows its box or the
  viewport. Shrink the stage before the text; the captions stay readable (body-sm or larger).
  Captions and stage share one top line.
- Pace: slower. Lengthen the pin (try 300 to 500svh) and give each of the five beats an
  equal share with a hold at the end of each beat (the animation settles, then waits about
  a third of the beat before the next starts). Scenario changes happen only by the tabs,
  not by scroll.
- Highlight: the current caption is full-contrast ink with a yellow proof dot at its left
  (the same dot as the departures board's current row); past captions are muted, future
  ones are lighter muted; a 2px cobalt progress line runs down the left edge of the caption
  list and fills to the current beat. One clear current step at every scroll position.
- Must NOT change: the copy, the three scenarios, the Illustration label, the phone layout
  (no pin), reduced motion (final frame, all captions visible).

## Report
One line per item, judgement calls, screenshots in both themes: nav closed and open at 1440,
the drawer at 375; the Ask section at three beats at 1440 and at 1280x720.
