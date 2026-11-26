Round 57 on the homepage (`/`): the rules section. Build after rounds 55 and 56. DESIGN.md v4 (Ollama + yellow and cobalt). Only change what's listed.

## 1. The rules Bindu covers (`#rules`): an infinite, minimal gallery with one wow moment
Reference: awwwards.com/inspiration/infinite-scrolling-gallery-daydream (Austin, 25 Nov 2026), made more minimal. It must not look AI-generated: no gradients, glows, icons, blobs, badges, glass or card shadows.
- **Layout:** the title and one-line lead centred on top (full title always visible). Below, one endless horizontal row of the five rule tiles, repeated so it never ends (loop by wrapping transforms, not by cloning DOM on scroll). Not pinned.
- **Tiles, type only:** the Ollama card (canvas fill, 1px hairline, 12px). Inside, top to bottom: the regulation number very large in mono, ghosted (`mute` at low contrast), filling most of the tile as the visual; over it the short name in the display face; one plain line of what it asks for; the goods; the status chip (Live in yellow, In build hairline); "Read the rule" as a cobalt text link. Tile about 360px wide, 4:5.
- **Motion (the wow):** the row drifts slowly on its own (about 20px/s). Scrolling the page adds the scroll velocity to the drift (the faster you scroll, the faster it runs, then it eases back), and while it runs fast the tiles bend: each tile skews and turns slightly with the speed (max about 8 degrees, the shape of a page being flicked), and the ghost number slides a little inside its tile (parallax). At rest everything is flat and still apart from the drift. Drag and a sideways wheel move it too, with momentum. Hovering a tile pauses the drift and lifts its name to full ink, others go mute. GSAP ticker, transforms only, one quickSetter per tile; pause when off screen.
- **Accessibility:** each tile's link is real and focusable; focus pauses the drift and scrolls that tile into view; keyboard arrows step a tile. Duplicated loop tiles are `aria-hidden` and not focusable, so a screen reader reads five rules once.
- **Phones, reduced motion, no JS:** a native horizontal scroll-snap row of the five tiles (no loop, no drift, no bend).
- **Delete** the current #rules motion (pinned sideways scroll and anything left of the carousel, flaps and lane).
- **Must NOT change:** content, statuses, regulation numbers, source links, the EUDR date, the sections above and below.

## Report
One line, judgement calls (drift speed, max bend), what was not verified. Look at it yourself in both themes at 1440 and 375.
