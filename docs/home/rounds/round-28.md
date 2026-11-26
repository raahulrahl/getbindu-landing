Round 28 on branch `v3-story`. Follow CLAUDE.md. Change only what's listed. Reference prototypes are in options/r27/ (gallery at localhost:5195).

## 1. How it works, File step: QR passport assembled from dots (from option A03, cleaner)
- Take options/r27/A03-* as the base and rebuild it properly inside the How it works File step (React + our tokens + GSAP, in the existing pinned sequence; replace the current record-card illustration for File).
- Cleaner than the prototype:
  - a perfect square QR grid (a real, made-up QR pattern for a fake URL, labelled Illustration) built from round dots on an exact grid
  - cobalt dots, with the three finder squares in ink and one yellow dot in the centre (the Bindu dot)
  - dots fly in from the evidence lines of the Prove step and snap into the grid with a short stagger
  - beside it, quiet typography: "Product passport record" · "Textile passport · Live" · a short signature line (illustration)
  - no card chrome and no shadows
- Scroll-linked like the rest of the pinned sequence: forward on the way down, reverse on the way up. Reduced motion: the finished QR.
- Both themes, tokens only.

## 2. Ending, part 1: the ship stays on its path
- The ship does NOT come to the centre any more. It stays on its course line.
- Near the finale, the course line dips down and curves in toward the "bındu" wordmark, passing just above it, close to the ı.
- At the closest point, the ship breaks into dots (about 1.0s, time-based on crossing, reversible) and the dots fly in a short curve to become the yellow dot of the ı.
- Keep the sounds (dash when the line dips, chime when the ı forms).

## 3. Ending, part 2: the image inside the wordmark, then opening through it (like Rothfinder)
- The large "bındu" wordmark letters are filled with the port photo (the duotone version from the earlier rounds, `public/images/port-duotone.*`; crop so no brand lettering is legible). Use background-clip:text or an SVG text mask. The ı dot stays solid yellow, not filled with the image.
- **On scrolling further, the image opens from inside the letters:**
  - the wordmark scales up around a point inside the bowl of the "d" until the image fills the viewport
  - then it's a plain full-bleed image: swap to a normal full-screen image layer at that moment, to avoid rendering giant text
  - the final section's content ("Book a 15-minute demo" + footer) fades in over the image, on a soft canvas-colour scrim for readability
- Scrubbed with light smoothing (scrub about 0.5), transform/opacity only, with the layer promoted only during the zoom. Fully reversible. It must look smooth at slow scroll; test it.
- **Remove:** the 3,000-dot burst into the map and the dot map behind the final section. The final section now sits on the image.
- **Reduced motion:** the wordmark with the image fill and the yellow dot, then the final section on the image, no zoom.
- **LICENSES.md:** keep the Unsplash entry (it's used again) with the crop note.

## 2b. (clarifies item 2) The ship never grows
- At the end, the ship keeps its normal gutter size (about 40px) and stays on its own trajectory the whole time. No scaling up and no moving to the centre.
- The dots split off from the ship right where it is on its path and fly to the ı.

## 5. Better sounds: real recorded UI sounds instead of synthesised ones
- The synthesised cues sound cheap. Replace them with recorded sounds from Kenney's CC0 audio packs (public domain, free for commercial use): "Interface Sounds" and "UI Audio" from kenney.nl.
  - Download the packs, pick the files, convert them to small .ogg (with .mp3 fallback) at -18 LUFS-ish matched loudness, and keep the total under about 300 KB.
  - Put them in public/home/sounds/ and add a LICENSES.md entry (Kenney, CC0).
- Keep lib/sound.ts and its rules (off by default, toggle, only after a gesture, muted when hidden, throttle). Play decoded AudioBuffers via Web Audio (fetch + decodeAudioData, loaded lazily the first time sound is turned on). No new npm deps.
- **Cues:**
  - proof chime (soft confirmation)
  - board clack (mechanical click)
  - button hover (very soft tick)
  - dash (short soft swipe)
  - ship horn: keep, or use a soft low "drop" if Kenney has no good horn; log the choice
  - finale resolve (gentle confirmation)
- 3–4 different files per cue where possible, plus ±4% playback-rate variation. Never the same file twice in a row.

## 6. "Sound familiar?" strike lines straight, sound in sync
- The strike-through lines over the pain sentences are still wavy. Make each one a perfectly straight horizontal line through the middle of the x-height of each text line (one segment per wrapped line), 1.5px ink, square caps, drawn left to right with the scroll.
- The strike sound (the `dash` cue) must be in sync: it plays exactly when a line's draw progress crosses 2% going down, at most once per crossing, and the swipe's length matches the line's draw. When scrolling up there's no sound.
- The same straight-line rule applies to any other strike or underline marks on the page.

## 7. Course-line dashes and dash sound in sync (guide)
- Re-check the guide course line: every dash is a straight segment (r25 rule). Fix any that render curved or blurry (half-pixel snap, butt caps).
- The `dash` cue for guide transitions plays exactly when the ship reaches the transition point (tie it to the ship's path position, not a separate ScrollTrigger), once per crossing.

## 3R. REPLACES item 3: the ending done exactly the Rothfinder way
Rothfinder's technique, measured:
- The final section is a sticky, full-viewport layer whose background is the photo (cover, never moving).
- That layer has CSS `mask-image` set to an SVG of the logo (wordmark + rounded-rectangle outline frame), with mask-repeat none.
- Scrolling animates `mask-size` from fitting the screen width (about 92vw) up to about 5–6× (they end around 6624px wide on a 1440 screen), and `mask-position` together, so the growth is centred on a point inside the frame. The logo shape grows until the photo fills the screen; then the mask is removed.
- Their closing line and footer sit on the photo, with a dark gradient at the bottom.

Build ours the same way (our own SVG and code):
- **Photo:** the original cargo photo Austin sent (`public/images/port-unsplash-1605732562742.jpg`, original orange colours, not duotone). Serve a resized webp/jpg (about 2000px wide). Position it so the large "Hapag-Lloyd" lettering is out of frame or as small as possible. Keep the LICENSES note.
- **Mask SVG:** "bındu" (dotless ı, Inter 600 outlines converted to paths) inside a rounded-rectangle outline frame (stroke about 22px at fit size, corner radius about 0.45 × frame height), centred. The ı's dot is NOT in the mask. It's a separate solid yellow circle positioned over the ı, transformed with the same scale and origin as the mask, so it rides along, and it fades out once the mask is about 2× its size.
- **Before the zoom:** the masked wordmark sits on the page canvas, like Rothfinder's first state.
- **Zoom:** a scrubbed ScrollTrigger (scrub about 0.6, about 150vh), animating mask-size and mask-position only (plus the dot's transform).
  - Origin: inside the counter of the "d", or between "n" and "d", whichever opens cleanest.
  - At the end, set mask-image to none, so the full photo shows.
  - Promote the layer during the zoom only.
- **Final content over the photo:**
  - a large centred closing line in white: pick from "Bring your next shipment. We'll keep the folder." (getbindu.com wording) or "Describe your next shipment. Bindu keeps the proof."
  - the "Book a 15-minute demo" yellow button
  - the footer grid (links, role row, legal) at the bottom over a dark gradient
  - AA contrast for all of it
- **Reduced motion:** the masked wordmark, then the photo section with the content (no zoom).
- Remove anything left of the old burst and the dot map in the ending.

## 2c. (overrides 2b on position) The ship comes to the middle, but stays small and on its path
- Austin: "the ship at the end doesn't come to the middle, it stays on the right."
- The course line itself leaves the gutter near the finale and curves smoothly into the centre of the page, ending just above the ı of the wordmark. The ship sails along it to the middle at its normal size (no growing).
- There, the dots split from the ship and drop into the ı dot (about 1.0s, time-based, reversible). Then the zoom (3R) can start.

## 8. Map: the dots → guide ship transition is missing
- At the end of the journey map, the dots form the Bindu mark on the port, then must stream along the course line into the guide ship in the gutter (round-24 item 4). It's currently missing or broken, possibly since the canvas move in r25.
- Restore it on the canvas renderer, time-based about 1.4s, reversible, with the dash cue. Verify it with frame captures.

## 9. Map: the step notes must be clearly readable
- The milestone notes on the map ("Origin plots mapped", "Supplier proof received", …) are hard to see.
- Make each note a small label card with a soft canvas-colour scrim (no border or shadow):
  - title body-md, weight 600, full ink
  - description body-sm, in the ink-soft token, max 32ch
  - leader line 1px ink
- The current step's title is in cobalt with a small yellow dot. Past steps are muted but readable (≥4.5:1 contrast). Future steps are hidden until reached.
- On phones, keep the compact list under the map with the same hierarchy.
- The journey title and story line stay as round 22 made them.

## 4. Check
- npm run build passes.
- 375 / 1440 / 1920, both themes, reduced motion: no horizontal scroll, no console errors, the ending smooth at slow and fast scroll, the CTA readable on the image.
- Run v3/qa/r24/perf.mjs once and report fps.
- Commit per item ("v3 r28 N: ..."). Stage only changed files, LF. Dev server stays on 3010.

## Report
Short: one line per item, fps, judgement calls. No screenshots as deliverables.
