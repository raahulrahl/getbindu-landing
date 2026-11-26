Round 19 on branch `v3-story`. This replaces round-18 items 4–6, which weren't done; round-18 items 1–3 are in. Follow CLAUDE.md and docs/home/project-context.md, plus round 17 and 18 except where this file changes them. Pricing stays as it is.

Austin's direction: more natural, human and professional, with a real "wow" moment, more detail (from getbindu.com), and animations that run both ways with the scroll.

## 0. Before coding: load skills and references
- Load these skills and follow them for every motion and UI decision: `animate`, `animation-performance`, `review-animations` (self-review at the end), `better-ui`, `better-layout`, `better-typography`, `polish`. `bindu-design` wins any conflict.
- Motion bar:
  - **Rothfinder:** scroll-linked, reversible, one guide object, the ending zooms through the wordmark.
  - **Restraint:** Walbi (Awwwards).
  - **Easing:** expo/quart-out for entrances. Scrubbed motion on scroll: when you scroll back, everything plays in reverse (no one-way "once" triggers anywhere on the homepage).
- **Allowed:** GSAP plugins that ship in the installed `gsap` package (free under its standard licence): SplitText, ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, Flip. No new npm dependencies.
- **Copy source:** getbindu.com, its blog (getbindu.com/blog), and the text extract in `C:\Users\HP\AppData\Local\Temp\claude\12675c165a4ba0dd\a4557441-a123-432f-a224-e2c6729f6167\scratchpad\roth\gb\getbindu_com.txt`.
  - Use only facts from there and the brief. Keep the brief's statuses exactly: identity/signed answers Live; sealed transport and agent settlement In build.
  - Never copy "30-minute" and never claim customers or pilots.

## 1. Intro: 0.5s max
- The first-visit intro lasts 0.5s at most (one dot blooming into the mark), then hands off to the hero. Return visits and reduced motion skip it.

## 2. Buttons: getbindu's letter-roll hover, our colours
- Recreate getbindu.com's black CTA hover in our own code, keeping our yellow pill.
  - Its structure: the label is split into characters inside an overflow-hidden wrapper, with a duplicate label below.
  - **On hover:** each character slides up out of view while its duplicate slides in from below. Stagger about 15ms per character, about 350ms each, expo-out. It reverses on mouse leave.
  - Use GSAP SplitText. Keep the accessible label (aria-label on the link; split characters aria-hidden).
- **No hover darkening anywhere:** background and border colours stay the same on hover for every button and pill. Hover feedback comes from motion only (the roll, plus the dot sliding to an arrow).
- Reduced motion: no roll, nothing changes on hover except the focus ring on focus.

## 3. Statement: "Bindu" lights up
- In the statement sentence, the inline Bindu chip "lights up" as it reaches the middle of the screen, scrubbed with scroll and reversing on scroll up:
  - its outline goes from hairline to yellow fill
  - the small dot mark inside it brightens dot by dot
  - the rest of the sentence goes from muted to full ink, word by word
- Remove any one-way trigger here.

## 4. "Sound familiar?": scrubbed, more detail, better fit
- **Scrub:** each ink strike draws with the scroll and un-draws when you scroll up. The answer's left-to-right reveal is tied to the strike's progress.
- **Layout:** each row is one grid line.
  - Left 7/12: the pain sentence (display size).
  - Right 5/12, top-aligned with it: Bindu's answer (cobalt) plus one supporting detail line in body text, taken from getbindu.com:
    - Supplier data → "Before anything leaves, your supplier sees exactly what you'll learn, and can say no. Their files never move."
    - Which rules → "Describe the shipment once. Bindu works out the rules, the HS code and the evidence each rule needs."
    - Customs fear → "Every answer is signed by the company that gave it, so the proof holds up when someone asks."
  - Rows are separated by one hairline and generous space. The section title shares the same grid.
- Match the page theme: ink and paper tokens, same type scale as other sections. No new colours.

## 5. How it works: a serious product walk-through (replaces the r18 paper and stamp drawings)
- Remove the chat bubble, paper sheets, paper clip and rubber stamp drawings.
- Keep the pinned Describe · Prove · File list on the left. Right: one quiet product frame:
  - hairline window, 12px radius
  - a slim top bar with three muted dots and the text "app · illustration"
  - real UI typography, nothing cartoonish
  - It changes state with the scroll, and states reverse on scroll up.
- Use a textiles example so the homepage isn't EUDR-only:
  1. **Describe:** an input line types "1,200 cotton T-shirts from Tiruppur, India to Rotterdam" (uneven, natural rhythm). It then resolves into neat fields that fade in one by one:
     - Goods: cotton T-shirts, knitted
     - HS code: 6109 10 00 (a small tree line shows heading 6109 → 6109 10 → 6109 10 00)
     - Origin · Destination
     - Rules that apply: Textile passport (Live)
  2. **Prove:** an evidence checklist (fibre composition · mill and dye house · care and repair data · supplier declaration).
     - Each row shows "asked by WhatsApp" or "asked by email", then a status that ticks to "received · signed".
     - A short note explains that the supplier sees what you'll learn before anything leaves.
     - A tiny signature mark appears (identity layer: Live).
  3. **File:** the record assembles into one product passport card: a QR code (generic, made-up, labelled Illustration) and the line "Product passport record created". Also a muted line "Other rules use the same flow; some are in build."
- Under the frame, a small caption: "Illustration. Not a real customer or filing."
- Motion: quiet fades and short y-shifts (8–12px), the typed text, check ticks drawn with DrawSVG. No bounce, no cartoon objects.

## 6. Follow one shipment: our theme, the same ship
- **Theme:** the map uses the page's own tokens in both themes. Light: ivory paper, ink coastlines, a very light land wash, cobalt route. Dark: the same layout on the dark canvas, with off-white ink and the same cobalt. Check both themes side by side; nothing may look like a different site.
  - Remove the navy band, the dotted coastlines, the LAT/LON readout and the yellow status pill (use plain "• Live" or "• In build, coming" text).
- **The ship:**
  - **On the map:** the guide ship from round 18 leaves its gutter, shrinks to about 28px and sails the route inside the map only, scrubbed with the scroll and reversing on scroll up.
  - **On the way out:** after the map it returns to the gutter on the opposite side (left ↔ right) and continues from there.
- **Milestones:** short notes pinned along the route with thin leader lines, revealed as the ship passes and hidden again on scroll up. Use a compact list on phones.
- Keep the tabs, the stories, routes and facts, and the one-window fit.

## 7. New section after the journey: "What the rules let through, and what they stop."
- Adapted from getbindu.com's worked examples. Lead line: "Illustrations, not customer filings: the verdict on a real shipment belongs to the rules and to the authority that reads them."
- Show 6 of them as shipping-label style tags (paper tag, punched hole, string line drawn in ink), in a horizontal row that scrolls sideways while the section is pinned. It reverses with the scroll.
- Each tag:
  - small caps line with the rule and goods (e.g. "EUDR · Coffee")
  - a verdict stamp, "Let through" (cobalt) or "Stopped" (muted ink)
  - the one-line headline and its two-line story from getbindu.com
  - the route (e.g. "Chikkamagaluru → Rotterdam")
- Mix the rules: EUDR, textiles, batteries.
- Phones: native horizontal swipe, no pin.

## 8. Finale: ship → Bindu mark → the i, then zoom-through
- **8a. Morph:** as the reader reaches the finale, the ship turns into the Bindu dot mark (its outline dissolves into dots that gather into the mark). The mark then shrinks and settles as the dot of the ı in the large "bındu" wordmark. Scrubbed and fully reversible.
- **8b. Zoom-through:** like Rothfinder's ending.
  - The wordmark letters work as a mask filled with our own world dot-map (the hero map visual, static frame or live canvas).
  - Scrolling on scales the wordmark up until the view passes through the counter of the "d" (or the ı's dot) into the last section: the final CTA ("Book a 15-minute demo") and the footer on the full-bleed map.
  - Reverses on scroll up.
- Performance: transform and scale only, no layout thrash. Reduced motion: no zoom; the wordmark and the final section sit one after the other.

## 9. More detail, carefully (copy pass)
Make sections a little richer with facts from getbindu.com, without clutter (one supporting sentence per block at most):
- Hero sub-line may add "whether you import six containers a year or six hundred" if it fits at 375x667.
- Statement may mention HS code + evidence + filing.
- FAQ: add 2 questions with answers drawn from the brief/getbindu:
  - "Do my suppliers need an account?" Answer from "no login for them" and "they can say no".
  - "Is my data shared with other companies?" Single-tenant: nothing crosses until the exchange layer ships (In build).
Log every copy choice in DECISIONS.md.

## 10. Check and self-review
- Run the `review-animations` skill over the homepage and fix what it flags.
- npm run build passes. 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, the ship and route never cover text, pinned titles visible, everything reverses on scroll up, reduced motion works, no console errors, demo links go to cal.com, 60fps (no long tasks over 50ms while scrolling on a mid laptop profile).
- Commit per item: "v3 r19 N: ...". Stage only changed files, LF endings.

## Report
One line per item, judgement calls, dev-server URL (3010), and anything that needs Austin (assets, approvals). No screenshots.
