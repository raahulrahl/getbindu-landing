# Round 60 findings

Priorities: P0 blocks, P1 major, P2 minor, P3 polish. "Conflict" = a skill finding that clashes with DESIGN.md v4 or one of Austin's keeps (not fixed). Method for every pass: single context (no isolated sub-agents were spawned: this run is itself a sub-agent), code read plus screenshots of the running page at 1440x900 light (scroll positions per section) and the reduced-motion full page at 1440 and 375, light and dark.

## Pass 1: critique-impeccable

Method: degraded single-context critique (the impeccable detect engine is not installed here; avoid-ai-design's detect.mjs is run in pass 6). Design specificity: the page is authored for Bindu (a dot map under every section, the ship, the departures board, the cobalt/yellow pair, real shipment vocabulary). Not interchangeable with another product. Heuristic scores (landing surface, 7 and 10 n/a): visibility of status 3, match to real world 4, user control 3 (pause, replay, tabs, keys), consistency 3, error prevention 3, recognition 3, aesthetics 3, error recovery 3: 25/32, Good (78%).

| # | Sev | Finding | Where | Status |
|---|---|---|---|---|
| 1 | P2 | "What buyers say." title is left-aligned while every other section title is centred | styles/r44.css:174 (.vc-head), Voices.tsx:186 | fixed (centred) |
| 2 | P2 | Rules tiles: the ghost regulation number (12%) runs under the name and the body copy ("1781", "2006", "40" behind body text), costs legibility | styles/r44.css:227 (.rl-ghost) | fixed (8%); concept kept |
| 3 | P3 | Hero "Pause animation" reads as plain text (ghost button on the map), low affordance | styles/site.css:75 | left: hero control is part of the kept hero, change would be visual redesign |
| 4 | P3 | Map labels in the shipment map (Atlantic, English Channel, Antwerp) are 10 to 11px mono and collide with the caption veil at some zooms | lib/shipcanvas.ts, lib/shipmap.ts | left (r59-0: labels inside a drawing) |
| 5 | P3 | Full Circle act stage is mostly empty space at the first scene (The Fabric): the drawing sits in the right 60% | lib/theatre-stages.ts | left (drawing content, Austin's keep: structure and acts) |
| 6 | P3 | Story step 1 shows only a typing field in a large empty frame before the sentence is typed | components/Flow.tsx | left (motion start state; end state is composed) |
| 7 | info | Section titles are weight 500, hero 600 (open question, left at 500 per Austin) | tokens.css `--display-weight` | not touched |

Persona walk (first-time EU importer, customs broker): both reach "Book a demo" from the nav, the hero and the finale; the broker finds EUR-Lex sources on every rule tile. No blockers found.

Not verified: dark theme by eye in this pass, Safari, real GPU.

## Pass 2: bolder

Reading: the hero, statement and finale carry the conviction (120px title, 40px statement, full-bleed photo); the middle sections announce themselves with a 36px/500 title and then drop to pale grey lead lines that read as footnotes. Within the system the move is contrast, not effects.

| # | Sev | Finding | Where | Status |
|---|---|---|---|---|
| 1 | P2 | Section lead lines (story, Full Circle, shipment, rules) are body grey #737373 at 20px, lighter than the hero sub-line which r59-1 already moved to charcoal | styles/r44.css:20, theatre.css:20, shipment.css:170, r44.css:215 | fixed: charcoal on light, 85% white on dark (styles/r59.css) |
| 2 | P2 | "Full Circle." label is mute grey | styles/r44.css:140 | fixed: body colour |
| 3 | P2 | Rules tiles away from the focus dim to the mute grey, so most of the row reads washed out | styles/r44.css:229 | fixed: dim stops at the body colour; the focused tile stays ink |
| 4 | conflict | Raising section titles to weight 600 would add the most presence | tokens.css `--display-weight` | conflict, not fixed (Austin's open question, titles stay 500) |
| 5 | conflict | Pricing lead and card, FAQ, finale and footer read quieter than the rest | components/Pricing.tsx:46 | conflict, not fixed (keep) |
| 6 | P3 | Story and Full Circle frames start sparse (one field, one line) before the motion fills them | Flow.tsx, theatre-stages.ts | left (not an effect problem; composed end states are full) |

No new colour, font, radius, effect or element added.

## Pass 3: 12-principles-of-animation

Checked: every GSAP timeline and tween, every CSS transition and keyframe in features/landing/home (durations, easing, stagger, exits, press states, reduced motion). Reduced motion: lib/motion.ts `reduceMotion()` gates scenes, headings, hero, flow, theatre, rules, voices and the board; CSS transitions are zeroed by components.css:125.

| # | Sev | Finding | Where | Status |
|---|---|---|---|---|
| 1 | P1 | Two reveals ran on every `.sec-head h2`: the old r20 masked reveal (class `rv`, a CSS `clip-path: inset(0 0 100% 0)` hidden state with a 1200ms transition) and the r54 GSAP SplitText fade. A CSS hidden state on a GSAP target (hard rule) and a double reveal | lib/scenes.ts:14-27, styles/site.css:204-206 | fixed: the `rv` path and its CSS are deleted; lib/headings.ts is the one heading reveal |
| 2 | P3 | Heading reveals are 0.7s expo.out, over the 300ms ceiling (timing-under-300ms) and stagger 0.08s over 50ms | lib/headings.ts:31, Hero.tsx:94, Theatre.tsx:61 | not fixed: scroll-triggered reveals, not user-initiated feedback; Austin's r54 reveal |
| 3 | P3 | No `:active` press scale on buttons (physics-active-state) | styles/components.css, tokens.css:129 `--press-scale: 1` | conflict, not fixed: DESIGN.md v4 (Ollama is static, "no movement of any kind" on buttons) |
| 4 | P3 | Nav wordmark collapse animates `max-width` (a layout property) over 700ms | styles/site.css:202 | not fixed: nav is a keep; it is one 90px span, scroll-triggered |
| 5 | P3 | Theatre timelines stagger 0.15 to 0.4s between nodes (physics-no-excessive-stagger) | lib/theatre-fx.ts:85-171 | not fixed: narrative drawing timeline in the Full Circle acts (structure keep), not a UI list |
| 6 | P3 | Hero: the sheet-lift tween on `.hero-in` (-18%, opacity 0.25) and the title parallax both run over the same scroll | lib/scenes.ts:35, Hero.tsx:89 | not fixed: composed by hand in r59-1; both are transform/opacity scrubs |
| 7 | ok | Linear easing only on typing ticks, belt and day counter (time representation); exits and presence handled by React state, not AnimatePresence; hover/press 160 to 250ms; dialog 320ms | various | no change |

Not verified: the heading reveal by eye after removing the mask (checked by code and computed style only).

## Pass 4: apple-design

Checked: gestures (testimonials drag, rules loop drag, tabs), interruptibility, springs, typography optics, materials, reduced motion / transparency / contrast.

| # | Sev | Finding | Where | Status |
|---|---|---|---|---|
| 1 | P2 | Only `prefers-reduced-motion` was honoured; `prefers-reduced-transparency` (the 10px backdrop blur behind each section window) and `prefers-contrast: more` (hairlines and mute greys) were not | styles/story.css:199-206 | fixed: both media queries added (styles/r59.css): blur becomes the plain canvas fill; hairlines go to hairline-strong and mute greys to the body grey |
| 2 | P3 | Testimonials drag: 1:1 tracking, release velocity projects the landing card (good), but the settle is a Lenis scroll of 0.9s cubic, so release velocity is not handed to it | components/Voices.tsx:128-145 | not fixed: needs a spring-based rebuild of a keep; frame loop already approaches the target exponentially and can be grabbed again |
| 3 | P3 | Large display type has tracking 0 (36px titles, 40px statement); Apple tightens large text | tokens.css:93 `--track-*` | conflict, not fixed: DESIGN.md v4 (Ollama letter-spacing 0 everywhere; hero is the one tightened title, adaptation 8) |
| 4 | P3 | No press-down scale or instant pointer-down feedback on pills | components/ | conflict, not fixed: DESIGN.md v4 static buttons (colour change on :active exists) |
| 5 | P3 | Rules loop drag and the departures board were not re-tested by hand for interrupt and reverse | components/Rules.tsx | unverified |
| ok | | Fast hover/press colour transitions 200ms; dialog scales from its trigger (--ox/--oy origin, spatial consistency); no hard dividers under the nav | | |

## Pass 5: better-ui

Detection table run over styles/*.css and components (transition all, will-change, press scale, hover outside the hover media query, theme-switch transitions, overscroll, icon colours, image outlines).

| Sev | Location | Before | After | Why |
|---|---|---|---|---|
| MEDIUM | styles/components.css:52-157 (btn-secondary, btn-ghost, btn-icon, tlink, link, seg-opt hovers) | `:hover` on touch latches after a tap | wrapped in `@media (hover: hover)` | hover only on hover-capable pointers; desktop unchanged. FIXED |
| MEDIUM | lib/theme.ts:15, styles/r59.css | the theme swap fires every colour transition at once | `theme-swap` class turns transitions off for the swap frame | suppress transitions on theme switch. FIXED |
| LOW | styles/site.css:87 (.dlg-in), styles/mobile.css:11 (.nav-drawer) | scrolling past the end scrolls the page | `overscroll-behavior: contain` | contain scroll in overlays. FIXED |
| LOW | styles/site.css:30,39,115, states.css:20,32-33 (nav links, footer links, FAQ summary), r6-pricing.css:39-41 (pricing button), story.css:52 | same latch on touch | not changed | nav is a keep; pricing, FAQ and footer: Austin said don't change. Reported: touch hover latch, not an accessibility failure |
| LOW | styles/r6-pricing.css:115 `.od-strip { will-change: transform }` | permanent layer on the price odometer | not changed | pricing keep; one small element |
| conflict | tokens.css:129 `--press-scale: 1` | the skill wants 0.96 press scale | not changed | the skill's own header defers to bindu-design and DESIGN.md v4 (static buttons, colour change on :active) |
| ok | | no `transition: all`, no `will-change: all`, bounce 0 everywhere, icons use currentColor (the illustrations' own fills are drawing colours), `-webkit-tap-highlight-color: transparent` on phones | | |

Not verified: theme swap by eye (class logic read, not replayed), touch hover on a real device. Verdict: Approve (no HIGH).

## Pass 6: anti-slop audit (antislop, antislop-ui, avoid-ai-design, hallmark, heydamir-unslop, make-interfaces-feel-better)

Method: `node .claude/skills/avoid-ai-design/scripts/detect.mjs features/landing/home` (77 files): 1 finding (P2 SD4d), now 0. Then each skill's checklist walked by hand against the page; each skill defers to bindu-design and DESIGN.md v4 on themes, palettes and fonts. Hallmark's scripts are not installed (gates read by hand). Copy: no em dashes, no buzzwords or invented numbers found in features/landing/home (grep).

| # | Sev | Finding (skill) | Where | Status |
|---|---|---|---|---|
| 1 | P2 | Meta strings joined with middle dots (avoid-ai-design SD4d, hallmark floor 10) | content.ts:33 (`intro.tag`, unused text, tracked capitals too); components/Examples.tsx:50 (rule dot goods in the verdict line) | fixed: sentence case with a comma; the verdict line is separate spans in the existing flex gap. The footer legal line (content.ts:299) is a keep and carries its own ignore comment |
| 2 | P2 | Tracked capitals on a label: the departures verdict meta line was uppercase, 0.06em (hallmark floor 9, heydamir type pass, DESIGN.md adaptation 7 sentence case) | styles/story.css:106 | fixed: sentence case, untracked, still mono |
| 3 | P3 | Hero illustration label tracked 0.04em | styles/site.css:72 | fixed: 0 |
| 4 | P2 | Testimonial dots are 26px hit areas (make-interfaces-feel-better: 40 to 44px) | styles/r44.css:181 | fixed on touch: 44px under `pointer: coarse` (styles/r59.css) |
| 5 | P3 | Map labels and ship readout in 10px mono with 0.04 to 0.08em tracking | styles/shipment.css:52,53,179 | left (r59-0: labels inside a drawing) |
| 6 | conflict | "Full Circle." act label reads as an eyebrow (hallmark floor 9) | components/Theatre.tsx, r44.css:140 | conflict, not fixed (Austin's keep: Full Circle structure, acts, tabs) |
| 7 | conflict | Arrow glyph on Book a demo (hallmark floor 10, antislop R-08) | Hero.tsx:119, Nav.tsx | conflict, not fixed (nav keep; hero button is the kept Ollama button-primary shape with the one yellow CTA) |
| 8 | conflict | Departures board, rules gallery, curved testimonials, hero map, bento-like story frame would each be a "default shape" to a template reader | | conflict, not fixed (Austin's keeps) |
| 9 | conflict | "Testimonials" section and its "Placeholder" chip (antislop R-18 forbids fictional reviews) | components/Voices.tsx, content.ts | conflict, not fixed: testimonial track is Austin's keep; the quotes are labelled Placeholder and use Example company names. Go-live item: replace with real quotes or remove (see project-context) |
| 10 | info | Lucide icons in the story stage (antislop R-04, library look) | components/Flow.tsx | left: relevant glyphs (file, mail, message) from one set at one stroke, as r59-3 decided |
| 11 | info | Palette: neutrals plus yellow and cobalt only; no gradients on surfaces; no glow; glass limited to the one feathered blur layer Austin asked for (avoid-ai-design-ignore K3) | | clean |

Not verified: Hallmark sloplint (not installed), the silhouette test by eye on a rendered thumbnail, dark theme by eye.

## Pass 7: consistency (one font and one design everywhere, DESIGN.md v4)

Method: a computed-style census in headless Chromium at 1440 (every text element: family, size, weight; every heading; every radius), then the CSS read for each outlier.

| # | Sev | Finding | Where | Status |
|---|---|---|---|---|
| 1 | P1 | The departures verdict story titles (`.bd-h`, h3) were in the body face (Inter 27px) while every other title is the display face | styles/story.css:104 | fixed: display face, weight 500 |
| 2 | P2 | The shipment lead had -0.02em tracking; every other lead is 0 | styles/shipment.css:170 | fixed (styles/r59.css) |
| 3 | P3 | Shipment milestone h3 sizes are fluid 14 to 17px (by window height, to keep one screen) and weight 600, between the scale's 16 and 18 | styles/shipment.css:60,194 | left: functional fit in a pinned window, not a free choice |
| 4 | P3 | Rules tile names are `display-lg` 36px, the same size as the section h2 above them | styles/r44.css:229 | left: the rules gallery concept (keep) |
| 5 | P3 | Full Circle overlay labels 14px sans 500 and 11px floor, map and ship labels 10px mono | theatre.css, shipment.css | left (r59-0, r59-4: labels inside drawings) |
| 6 | P3 | Dialog title 20px, finale wordmark 27px/600, "Your year" and the mini-check titles 20px | site.css:92 | left: pricing, finale and footer are keeps |
| 7 | info | Census: three families only (Nunito/ui-rounded for titles, Inter for text, ui-monospace for data), weights 400/500/600 except hidden board column headers (700, screen-reader only); radii 12px (cards), 8px (small surfaces), pills (9999px), one 28px (the collapsed nav island, a keep) | | consistent |
| 8 | info | Section titles are all 36px/500; hero 115px/600 (adaptation 8); the 500 vs 600 choice is Austin's open question and was not touched | | untouched |

Not verified: 768 to 1024px widths, dark theme census.
