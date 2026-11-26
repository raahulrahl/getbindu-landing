Round 21 on branch `v3-story`. Do it after rounds 19 and 20. Round-20 item 3 (swinging tags) is cancelled because item 3 below replaces the tags. Follow CLAUDE.md, the brief and rounds 17–20 except where this changes them. The overall theme stays.

Austin's notes:
- the ship needs more wow and more "Bindu", leaving blue dots as well as yellow
- the "rules let through" section and the app illustration look AI-generated / vibe-coded
- the dashed lines look off-topic
- add sounds, like easter eggs

## 1. Sound system (needed by every other item)
- All sounds are made in code with the Web Audio API (no audio files, no licences): short synthesised clicks, ticks, chimes and a low horn.
- **Off by default.** A small speaker toggle in the nav (icon + "Sound", aria-pressed) turns it on, and the choice is saved in localStorage.
- **Rules:**
  - The AudioContext is created only after the user clicks the toggle.
  - Nothing ever plays before that.
  - Everything is muted when the tab is hidden.
  - Master volume about -20 dB, every sound under 400ms.
  - Scroll-driven sounds are throttled to 8 per second max, and each has a little pitch and volume randomness so it never sounds mechanical.
- Put it in one module (lib/sound.ts) with named cues: `tick`, `dot`, `chime`, `clack`, `horn`, `seal`.
- Reduced motion doesn't change sound, but the toggle is always reachable by keyboard.

## 2. The ship: more wow, more Bindu
- **Trail of dots:** the ship's wake is a trail of small dots: cobalt dots for the route it has sailed (one every about 40px) and the yellow proof dots at each section. Each new dot plays `dot`, softly.
- **Mini mark at each section:** at each section anchor, the dots the ship collected since the last anchor swirl briefly (about 600ms) into a small golden-angle sunflower (the Bindu mark), then settle into one yellow proof dot plus a cobalt ring. Plays `chime`. This is scrubbed: scrolling back un-swirls it.
- **Finale:** all the yellow and cobalt dots left on the page lift off and fly together into the full Bindu sunflower mark (the intro's mark), which then shrinks into the dot of the ı.
  - This combines with round-19 item 8a. Do it in place of the ship dissolving into the mark: the ship docks, and its trail becomes the mark.
  - Plays `seal`. Reversible.
- **Easter egg:** clicking or tapping the ship plays `horn`, and the ship rocks once.
- Reduced motion: the dots and mark are shown in their final positions.

## 2b. UPDATE (Austin, after seeing r19 item 8): the finale and the end of the map
Replaces the finale bullet in item 2 and round-19 items 8a and 8b.
- **End of the map section:** the ship must not sit on top of the dots or the "bındu" marks. When the ship leaves the map at the end, it fades out (200ms) instead of overlapping them. No ship over any dots or wordmark anywhere.
- **Ship → dots:**
  - At the finale the ship does not morph into the mark. It breaks apart into many small dots (about 40, yellow and cobalt, taken from the ship's outline and containers).
  - The dots scatter outward a little with slight drift and stagger, then fly in curved paths and land, one after another, on the dot of the ı in "bındu", building it up until it's one solid yellow dot.
  - The page's trail dots (item 2) join the same flight.
  - Scrubbed and fully reversible. Sound: soft `dot` ticks while they land (throttled), then `seal`.
- **Transition into the last section:** replace the zoom through the d, which looks rough.
  - The yellow ı dot becomes the portal: a circular clip-path grows smoothly from the dot until it fills the screen, revealing the final section (CTA "Book a 15-minute demo" + footer) underneath. The photo-filled wordmark stays as is.
  - Use one eased timeline (power2.inOut) over about 120vh of scroll, transform/clip-path only. The final section is already rendered under the finale (no pin jump, no layout shift at the hand-off).
  - Reverses smoothly.
  - Reduced motion: the dot is already full, and the final section simply follows.

## 1b. UPDATE: sounds must vary
- No cue may sound identical twice in a row. Each cue gets 4–6 variants (different pitch, timbre and envelope).
- The proof `dot` and `chime` cues climb a pentatonic scale as the ship moves down the page, so the page plays a slow rising phrase, and descend when scrolling up.
- Each section has its own timbre family:
  - hero and statement: soft sine/glass
  - Sound familiar?: pencil scratch (filtered noise) for the strike
  - How it works: keyboard-like clicks for typing, a soft "sign" blip
  - journey: low wooden knocks for waypoints
  - departures board: mechanical clack with random flap counts
  - pricing: odometer ticks
  - finale: a bright three-note resolve
- Vary the throttle timing slightly too.

## 2c. UPDATE: the finale ending (replaces the circular portal in 2b)
- Keep 2b's ship breaking into dots that land on the ı (Austin likes the ship becoming Bindu).
- Then, instead of the ı dot opening as a portal, the whole "bındu" wordmark dissolves into many small dots (about 300–600, cobalt and yellow, sampled from the letter shapes, with the photo fill fading out first).
- The dots drift apart and then fly into place as the dot world map behind the final CTA section ("Book a 15-minute demo" + footer), which fades in around them. The letters literally become the map.
- One smooth eased timeline over about 120vh, scrubbed and reversible. Draw on a canvas for performance (no DOM node per dot).
- Sound: a soft rising shimmer as they disperse, then a resolve chord.
- Reduced motion: the wordmark fades to the final section.

## 3. Replace the dashed sea lane with a professional course line
- Remove the wobbly dashes. Use a navigation-chart course line instead:
  - **Ahead of the ship (planned):** a faint, precise dashed line (1px cobalt at 30% opacity, even 4/6 dashes, no wobble).
  - **Behind the ship (sailed):** a solid 1.25px cobalt line.
  - **Waypoint ticks:** small perpendicular ticks every about 120px, like distance marks on a chart.
- Passing a waypoint tick plays `tick` (the "dash sound").
- The same style is used for the route on the shipment map, so the two match.

## 4. "What the rules let through, and what they stop": a departures board
- Replace the tags with a split-flap departures board, like a port or airport board. It's physical, on-theme, and has nothing generic about it.
- **Board:**
  - Columns: Route (e.g. "Chikkamagaluru → Rotterdam") · Goods · Rule · Verdict ("LET THROUGH" in cobalt / "STOPPED" in muted ink).
  - 6 rows from the round-19 examples, flap characters in our mono font, dark flaps on the light theme's ink colour and light flaps on dark. Tokens only.
- **Motion:**
  - The section pins. As you scroll, the rows flap in one by one: each character flips through a few random characters before settling.
  - Each settling row plays `clack` (throttled). Scrolling up flips them back.
  - After the last row, the selected row (start with the first; arrow keys or click to choose) shows its two-line story underneath in body text.
- Keep the lead line "Illustrations, not customer filings…".
- **Accessibility:** the board is a real table for screen readers, and the flap characters are aria-hidden.
- Reduced motion: the rows appear settled, with no flipping.
- Phones: 2 columns (Route + Verdict); tap a row for the story.

## 5. How it works: from product window to kinetic typography
- Replace the vibe-coded app window with a simple, serious typographic sequence (Apple-style), keeping the pinned Describe · Prove · File list.
- **Describe:**
  - One large sentence types in on the right: "1,200 cotton T-shirts from Tiruppur, India to Rotterdam."
  - As you scroll, the key words highlight one by one and lift out of the sentence into the labelled slots of one clean record: Goods · Origin · Destination.
  - The HS code then computes into its slot (digits roll 6109 → 6109 10 → 6109 10 00, like the price odometer).
  - The rule appears: "Textile passport · Live".
- **Prove:** four evidence lines write into the record (fibre composition · mill and dye house · care and repair data · supplier declaration). Each ends with a small cobalt signature tick ("signed") that plays `tick`.
- **File:** the record closes into a single yellow dot seal (`seal`) with the line "Product passport record created". The dot then joins the ship's trail (item 2).
- Everything is scrubbed and reversible. One caption: "Illustration. Not a real customer or filing."
- Big type, lots of air, no window frame, no fake UI chrome.

## 5b. UPDATE: modern, techy, not vibe-coded (applies to item 5, especially Prove and File)
- The style reference is Linear / Vercel / Stripe product storytelling: monochrome ink on the page canvas, precise mono labels, a faint 8px baseline grid, one accent (cobalt) plus the yellow seal. No cartoon objects, no fake window chrome, no gradients.
- **Describe:** as in item 5 (kinetic sentence → fields, HS code rolls).
- **Prove:** a live event log that streams in line by line with the scroll. Mono, small, left-aligned, relative times, made-up (Illustration). For example:
  - `00:02  request → mill (WhatsApp)  fibre composition`
  - `00:41  received  fibre composition  ✓ signed by mill`
  - …one line per evidence item…

  Each ✓ draws itself in cobalt.
- **File:** the log lines collapse (Flip) into one compact record card:
  - title "Product passport record"
  - a generated QR (Illustration)
  - a short signature line `signed · did:web:…(illustration)`
  - "Textile passport · Live"
  - the yellow dot seal

  Keep the card hairline, precise and calm.
- Everything is scrubbed and reversible, and no line wraps on mobile (truncate with an ellipsis).

## 6. More easter-egg sounds (only when sound is on)
- Button letter-roll on hover: a very soft `tick` per character, throttled.
- Hovering the Bindu mark in the nav: a three-note `chime` (only once per page view).
- Theme toggle: a soft click.
- FAQ open/close: a soft tick.
- Price odometer: the digits tick as they roll.
- Keep it tasteful. If any cue is annoying after 3 repeats, cut it and log it in DECISIONS.md.

## 7. Check
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, everything reverses on scroll up, reduced motion works, no console errors, no sound before the toggle is pressed, no long tasks over 50ms while scrolling.
- Run `review-animations` and fix what it flags.
- Commit per item: "v3 r21 N: ...". Stage only changed files, LF endings.

## Report
One line per item, judgement calls, the list of sound cues and where they play. No screenshots.
