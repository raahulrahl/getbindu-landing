# Bindu homepage: motion research and effect list

Study only. Nothing was downloaded, copied or reused from any reference: no code, video, images or layouts. Every effect below is rebuilt in our own code with our design system (black + yellow + cobalt, dots).

## How the research was done
- **Browser.** Headless Microsoft Edge (Chromium) driven over the DevTools protocol, with a normal desktop user-agent and a 1440 × 900 viewport. JavaScript-rendered pages render fully this way. For each site I recorded:
  - the libraries detectable from the page (globals, script names, generator meta);
  - the headings and body text;
  - screenshots at 0 / 12 / 30 / 50 / 75 % of the page;
  - for Rothfinder, timed frames of the load and a slow wheel-scroll.
- **/refs/ is empty.** There are no recordings yet. Anything added later will be studied the same way and appended here.
- **Codrops** (tympanus.net/codrops) didn't render for the headless browser (likely a bot check), so it isn't covered. The **Awwwards "Elements"** clips are videos; I used their titles and the page's tags rather than frame-by-frame study.
- **Library detection is limited.** Most sites bundle their libraries (no `window.gsap` or `THREE` globals), so for those only the framework and the canvas or WebGL presence are known.

## Rothfinder (the quality bar)
- **Awwwards:** https://www.awwwards.com/sites/rothfinder, Honorable Mention (31 Aug 2026).
  - **Credits:** Griflan (studio), Justin Lerner, BryBry.
  - **Elements listed:** Interactive Scroll; JSON Animations (Lottie-style vector animation); Loader + Header Animation; Menu; Carousel.
  - **Tags:** Business & Corporate, Technology, Startups, Animation, Scrolling, Microinteractions, SVG.
  - **Tools:** Adobe Illustrator, DatoCMS.
  - **Palette:** `#899BFF` on `#000000`.
- **Site:** https://rothfinder.com. It's a Nuxt (Vue) build with 11 canvases, some WebGL; the motion library is bundled, not global.
- **Effects seen:**
  1. **Loader → header.** A long loader (about 6–7 s) types the wordmark, then the wordmark collapses to an "R" monogram in the header once you scroll.
  2. **Hero figure card.** A financial result card whose numbers rewrite when you pick 500K / 1M / 2M (number roll).
  3. **Sheet lift.** The hero panel slides up and away like a sheet, revealing a cream page underneath.
  4. **Statement with an inline logo chip,** centred, revealed as you arrive.
  5. **Media card grows.** A rounded media card rises from below and scales up towards full width, scrubbed by scroll; content fades in inside it.
  6. **Pinned steps.** "From first conversation to closed case": numbered steps on the left, coloured cards stacking in from the right.
  7. **State flip.** "Complex → Clear" cards flip state with an arrow chip.
  8. **Features accordion** with a highlighted active tab.
- **Feel:** slow, confident eases (expo-out), large scrubbed transforms, very little bounce, generous holds between beats. Motion carries the argument, not decoration.
- **Related work by the studio:** not reachable in this pass. The Awwwards credits name Griflan; their portfolio is the next stop if we want more of this hand.

## Other references
- **trajectory.ai.** A soft atmospheric hero, then "The platform": a product mock with a checklist of steps beside it, then a slider of "field notes" cards. 6 canvases and WebGL. **Used for:** How it works (product mock + numbered steps).
- **mailerbot.com** (Next.js). Huge display type ("MAIL, REVIEW IT, AND SEND"); a black "Designer" panel with mono button links; "Three steps to the mailbox" with line-drawn device outlines; pricing in coloured cards. **Used for:** the three steps, the line drawing, the clean pill buttons and the role cards.
- **belli.ai** (Astro). Product screens framed on a cream page, with a "01 / 06" counter and a left list that marks the active module; one rotating module section instead of many. **Used for:** the 01 / 06 module strip.
- **driessenarchitectuur.nl** (WordPress). Rendered only its intro screen headless; no notes beyond "full-bleed video intro". The futuristic feel comes from the brief's description.
- **x.ai, together.ai.** Structure only (see DESIGN.md).
- **godly.website.** A wall of dark cards; the strongest recurring motifs are glowing orbs, dotted concentric rings and radar-like dot fields on black. That confirms "points of light" as the right language for the dot system.
- **gsap.com/showcase.** A 3D carousel of showcase sites (Docusaurus). The common thread across the GSAP Showreel picks is scroll-scrubbed transforms, text reveals and pinned storytelling.

## The 10 effects chosen for Bindu
| # | Effect (source) | Where | Built with | Reduced motion |
|---|---|---|---|---|
| 1 | **Particle globe → sunflower**: routes as dotted light trails, a yellow pulse per filing, dots flow into the golden-angle sunflower (brief; Godly's points of light) | 1 Hero, 6 Finale | OGL points (3 programs, additive), lazy init, stops when done, Pause/Replay | Static yellow sunflower SVG |
| 2 | **Header wordmark collapses to the mark** on scroll (Rothfinder loader + header) | Nav | CSS width/opacity transition on a scroll class | Instant |
| 3 | **Masked line reveal** for headlines (Rothfinder statements) | Hero h1, every h2 | CSS keyframe on an overflow mask, triggered in view | Shown at once |
| 4 | **Sheet lift**: the hero content drifts up and dims as the next band slides over it (Rothfinder) | Hero → Sound familiar? | GSAP ScrollTrigger scrub on the hero content; the next band has a rounded top edge over the hero | No scrub |
| 5 | **Media frame grows** into place as it enters (Rothfinder media card) | 3 How it works app frame | ScrollTrigger scrub: scale .9 → 1, radius, glow | Static |
| 6 | **Pinned storytelling with a live product mock** (Trajectory "The platform", Rothfinder pinned steps) | 3 How it works | CSS sticky + ScrollTrigger progress → pure-function scene | Three end states stacked |
| 7 | **Documents converge into one glowing record**, scroll-linked and reversible (brief; Mailerbot process) | 3 Prove step | Transforms from the edges to the record rows | End state |
| 8 | **Line draws itself + plots outline then check** (Mailerbot line drawings) | 3 Prove/File, 5 blueprint | SVG stroke-dashoffset and clip-path sweep | Drawn |
| 9 | **Rotating module strip with a 01 / 06 counter and a gliding tab marker** (Belli) | 3 module strip | ScrollTrigger progress → translateX; marker transform | Swipeable row |
| 10 | **Number roll / terminal resolve** for deadlines, the €249 price and the TRACES reference (Rothfinder figure card) | 1 Hero, 3 File, 4 Pricing | rAF text scramble; tabular mono figures | Plain text |

Also in: magnetic yellow pills and a cursor-following cobalt glow (fine pointers only); card flips (2); a calculator popup that scales from its button, with the total ticking (4); a glass IT drawer (5); hover tilt on the role cards (6); Lenis inertial scroll (off under reduced motion).

## Rules applied
- 60fps budget: transforms and opacity only; one rAF per frame; WebGL paused off-screen and in hidden tabs; the WebGL scene starts after first paint.
- Scroll scenes are pure functions of scroll progress: they reverse when scrolling up and replay on every pass.
- Anything that moves for more than 5 s on its own has a pause control (the hero scene); the others finish in under 5 s.
- `prefers-reduced-motion`: every scene shows its end state, still; no smooth-scroll hijack; no WebGL animation.
