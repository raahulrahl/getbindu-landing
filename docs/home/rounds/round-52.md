Round 52 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md and docs/home/project-context.md. Only change what's listed.

## 1. Whole page: adopt DESIGN.md v2 (components only)
- Read `docs/home/DESIGN.md` (v2, rewritten 25 Nov 2026). Do its section 14 audit list, one commit per bullet.
- Buttons: every button on `/` becomes one of `btn-primary` / `btn-solid` / `btn-outline` (v2 section 5): 4px radius, Plex Mono 500 13px UPPER, tracking .05em, padding 9/16/7/16, 36px tall from 768px, 44px on phones. Hero "Book a demo" = `btn-primary`; pricing "Estimate your cost" = `btn-solid`; rules "Read the rule" and labelled carousel controls = `btn-outline`. Remove the magnetic pull, the click dot burst and the arrow nudge on buttons (keep the nudge on text links).
- Tabs (`.seg-track`), chips, radii, nav and footer link voice: v2 sections 6 to 8.
- Any button, chip or tab style that lives in one section's CSS (r44.css, r47.css, shipment.css, r6-pricing.css, story.css) moves to components.css or is deleted. Report the list of what you removed.
- Must NOT change: any colour token, any font family or display size, layout, section order, copy, motion other than button motion.

## 2. Finale (`#demo`): the port video replaces the ship sketch
- Use the clip that runs on getbindu.com's hero: `public/videos/rotterdam-port-hero.av1.webm` (AV1) with `rotterdam-port-hero.webm` (VP9) fallback, loaded the same way `features/landing/story/bindu-landing-story.tsx` does (sources appended in JS, muted, `canplay` then play).
- It sits where the `--photo` background is now: a `<video muted loop playsInline preload="none">` inside the masked photo layer, `object-fit: cover`. The letters of "bındu" mask it exactly as they mask the sketch today; the zoom, the 34-dot sunflower ı and the footer ride-up are unchanged.
- Replace the `IW`, `IH`, `FX`, `FY`, `PX`, `PY` constants with the video's real size and a focus point on the port (choose it; log it). Drive the video's size and position from the precomputed table as `transform` (translate + scale), not width/height, so nothing lays out while scrolling.
- Load: sources added by the existing IntersectionObserver (2 viewports ahead). Play only while the finale is on screen; pause when it leaves and when the hero pause button is on.
- Poster: extract one still from the clip to `public/home/images/port-poster.webp` (ffmpeg, 1920 wide, under 200 KB) and use it as the poster. Under 901px and under reduced motion: the poster only, the clip is never downloaded (same rule as the main site).
- Add the clip to `features/landing/home/LICENSES.md` as "Bindu's own asset from getbindu.com; footage source and licence to confirm" and to the go-live list in `docs/home/usage-audit.md`.
- Must NOT change: the mask shape, zoom curve, footer columns and copy.

## 3. Regulations (`#rules`): calm horizontal card scroll
Reference: awwwards.com/inspiration/cards-horizontal-scroll-the-performance-lab (Austin, 25 Nov 2026), fitted to our theme. Keep the same five tiles and their data; change the motion and the tile look, not the content. "Pick your goods" (option A) is dropped.
- Motion, one idea: the section pins and the vertical scroll moves the row of tiles sideways (GSAP ScrollTrigger, scrubbed, reversible, `--ease-out` smoothing like the other pins). Pin length: just enough to bring the last tile to the container's right edge (about 40svh per tile, about 200svh total). Heading and lead stay fixed on the top row while the row moves.
- Delete: the drag with momentum, tilt, wheel-sideways capture, snap, prev/next buttons, the hint line, the split-flap regulation number and the dashed lane with its travelling dot (Rules.tsx, r47.css, r44.css). Keyboard: each tile's "Read the rule" stays a real link; focusing a tile scrolls the page so that tile is in view.
- Tile, per DESIGN.md v2: `--canvas-soft` panel, 1px `--hairline-dark`, `--r-md` 8px, no shadow, no blur, no tilt. Fixed width about 380px (clamp 300 to 420), height fits the window with the head (1440x900). Inside, top to bottom: the regulation number in mono (`reg`, as text, no flaps), the short name in Inter display-sm, the full name in mute, the description (`d`), "Covers" + goods, status chips (v2), the EUDR date line with its Commission source (EUDR only), the EUR-Lex source link, and "Read the rule" as `btn-outline` at the bottom edge. 24px gutter between tiles; the row starts on the container's left edge.
- The tile nearest the centre of the window is full ink; the others sit at the mute colour (text only, the panels stay). This is driven by the same ScrollTrigger, no extra motion.
- Phones (under 768px), reduced motion and no JS: no pin; a native horizontal scroll-snap row of the same tiles (as today's fallback), tiles 85vw.
- Must NOT change: statuses, regulation numbers, source links, the EUDR date, copy, the section band and blur layer, the sections above and below.
- Copy: keep the current title "The rules Bindu covers." and label.

## Report
One line per item, judgement calls (video focus point, removed one-off styles), screenshots of the hero, pricing, Full Circle tabs and the finale in both themes at 1440 and 375.
