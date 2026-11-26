Round 18 on branch `v3-story` (continues round 17). Follow CLAUDE.md, docs/home/project-context.md and specs/round-17.md, except where this file changes them. Only change what's listed. Pricing stays as it is (Austin likes it).

Austin's feedback on r17: the scribble ball isn't right (use our shipment theme), "Sound familiar?" doesn't work, How it works looks off, and the shipment journey looks AI-generated. Make it human.

Human means: ink on paper, slight imperfection, real objects (ships, documents, stamps), editing marks. No dashboard UI, no glowing tech, no generic cards, no mono readouts.

## 1. Guide: replace the scribble ball with a container ship
Files: Guide.tsx, lib/guide.ts
- Remove the scribble ball and its loop growth.
- **The ship:** a small container ship drawn by us in ink, side view, about 56px wide on desktop:
  - simple hull plus 2–3 stacked container outlines
  - exactly one solid yellow container
  - 1.25px --line-ink strokes, slightly imperfect lines
  - It stays upright (no rotating along the path). It tilts ±3° with the direction of travel and bobs ±2px while scrolling.
- **The route:** it sails a dashed sea lane (--line-ink, dash about 6/6, slight wobble) that stays in ONE side gutter on desktop and meanders at most about 60px inside it.
  - The route never swings across the page and never crosses text.
  - Remove the extra section padding r17 added for those swings, so sections go back to normal spacing.
  - Also remove the big empty band above the How it works heading.
- **Proof dots:** at each section anchor the ship leaves a small solid yellow proof dot with a tiny ink ring (keeps "every proof is a dot").
- **Phones (≤600px):** no ship. A 10px yellow dot with an ink ring travels the gutter route instead.
- **Reduced motion / pause:** the route and proof dots are drawn, and the ship sits at the finale position.

## 2. "Sound familiar?": corrected notes instead of cards
Files: Story.tsx (pains / before-after part) and its CSS
- No cards. Three full-width rows stacked, separated by whitespace (one hairline max). Section title stays "Sound familiar?".
- Each row:
  - **The pain** as a plain sentence in large display text (existing pain copy, shortened), e.g. "My suppliers won't send the data."
  - **The strike:** when the row scrolls into view, a hand-drawn ink strike-through draws across it (a slightly wavy SVG path, about 500ms, once). The sentence then dims to muted.
  - **The answer:** Bindu's answer writes in underneath in cobalt, revealed left to right, e.g. "Bindu asks them for you, by WhatsApp or email."
- Remove the "With Bindu" labels and the card frames.
- Replace "For EUDR today." with a general line, e.g. "Live for EUDR and textile passports today; more rules are in build." Log the wording.
- Reduced motion: the strike and answer are shown statically.

## 3. How it works: real objects, no card
Files: HowItWorks.tsx and its CSS
- Keep the pinned Describe · Prove · File list on the left.
- Shorten the heading to two lines max. Options, log the choice:
  - "Describe it once. Bindu gathers the proof."
  - "One sentence in. The proof comes back."
- Remove the illustration card frame. The drawings sit straight on the page canvas and are larger (about 55% of the content width, vertically centred with the list). Keep a small "Illustration" caption under the drawing, not a chip.
- Describe:
  - Show a simple message box like a chat composer: hairline, rounded, sans font, not mono.
  - The sentence types in at a natural, uneven rhythm with a blinking caret, then the send arrow pulses once.
  - Sentence: "Two containers of cocoa beans from Ecuador to Antwerp."
- Prove:
  - Four paper sheets (invoice, supplier declaration, data sheet, certificate of origin), each slightly rotated, with a folded top corner and ink scribble lines for text.
  - They slide together into one neat stack, and a paper clip (ink drawing) clips them.
  - A small yellow dot seal appears on the stack, labelled "One record".
- File:
  - A rubber stamp (ink drawing) comes down on the record.
  - It leaves a cobalt stamp mark, rotated -6°, with slightly rough edges: "Reference no." plus a made-up reference number. Keep it generic, not EUDR. Illustration.
- All drawings use --line-ink and paper colours from tokens, and draw or animate with the scroll.

## 4. Follow one shipment: a paper chart, not a dashboard
Files: ShipmentJourney.tsx, Cargo.tsx, shipment.css, lib/shipmap.ts
- **Drop the navy night band.** The section sits on the page canvas like a nautical chart printed on paper. Remove --night-band from use (keep the token if other code needs it).
- **Map:**
  - land as a very light warm wash
  - coastlines as solid ink lines (--line-ink, 1px, slight wobble), not dotted
  - sea lane dashed
  - two or three faint graticule lines like an old chart
  - small ink compass rose in a corner (our own drawing)
  - remove the LAT/LON readout
- **Ship:** the guide ship (item 1) enters this map and sails the route itself in place of the cargo icon, then leaves again below the section.
- **Milestones:** instead of a stacked list on the right, show them as short handwritten-style notes (Inter italic, small) pinned along the route at their points, each with a thin leader line.
  - The current milestone is in full ink with a cobalt stamp-style tick. Past ones are muted. Future ones are hidden until reached.
  - On narrow screens, keep a compact list under the map instead.
- **Status chip:** replace the yellow "EUDR Live" pill with plain text plus a small dot, e.g. "• Live" in the existing Live style. In-build stories still end in "coming".
- Keep the tabs (minimalist), the stories, their routes and the facts. Keep the section in one window.

## 5. Finale: the ship delivers the dot
Files: Closing.tsx / Guide.tsx
- The ship sails up to the "bındu" wordmark. Its yellow container lifts off and becomes the dot of the ı (about 600ms ease), and the ship sails out.
- Reduced motion: the yellow dot is already in place and there's no ship.

## 6. Check
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, the route and ship never cover text, pinned titles visible, reduced motion works, no console errors.
- Log decisions in DECISIONS.md and note our own drawings in LICENSES.md (own work).
- Commit per item: "v3 r18 N: ...". Stage only changed files.

## Report
One line per item, judgement calls, dev-server URL (3010). No screenshots.
