# Round 61 audit (13 skills, audit only, no product code edited)

Date: 25 Nov 2026. Branch web-quality. Scope: the whole homepage, `features/landing/home/`. Governing docs: CLAUDE.md, docs/home/DESIGN.md (v4, Ollama plus yellow and cobalt, the only system), docs/home/component-review.md (Austin's keeps), docs/home/rounds/round-60-findings.md (already found, not repeated).

Priorities: P0 blocks, P1 major, P2 minor, P3 polish. Tags: **fits** (fits DESIGN.md v4 and the keeps), **conflict** (would break DESIGN.md v4, a keep or a CLAUDE.md rule; the rule is named), **style** (a taste change for Austin to decide).

Method: each of the 13 skills was loaded one at a time and walked against the code (greps over styles/, components/, lib/, plus targeted reads). No browser was available (the chrome-devtools MCP timed out and no Playwright is installed), so every visual finding is read from source and marked "unverified by eye" where it matters. The impeccable detect engine and Hallmark scripts are not installed. Skills that prescribe their own look (swiss-design, taste-skill, container-lines) are used as references only. Because several skills look at the same thing, some findings are cross-referenced and counted under each skill, but appear once in the ranking.

## Summary

### Counts per skill

| Skill | Findings | fits | conflict | style |
|---|---|---|---|---|
| typeset | 5 | 4 | 0 | 1 |
| layout | 4 | 1 | 2 | 1 |
| colorize | 5 | 4 | 0 | 1 |
| distill | 7 | 3 | 1 | 3 |
| improve-animations | 6 | 5 | 0 | 1 |
| find-animation-opportunities | 6 | 1 | 3 | 2 |
| gsap-scrolltrigger-storytelling | 3 | 2 | 0 | 1 |
| 12-principles (springs) | 2 | 1 | 1 | 0 |
| taste-skill | 4 | 1 | 3 | 0 |
| swiss-design | 3 | 0 | 3 | 0 |
| container-lines | 2 | 0 | 1 | 1 |
| better-interface | 4 | 4 | 0 | 0 |
| improve-ui | 2 | 2 | 0 | 0 |
| rams | 3 | 3 | 0 | 0 |
| Total | 56 | 31 | 14 | 11 |

(No P0 or P1 found. Totals double count the four cross-references: pause control, dot colour, intro skip, dialog exit. Distinct findings are about 50.)

### Top 10 "fits" fixes, ranked

1. **Testimonial active dot is yellow on white in the light theme** (C1, I2, B4): `#FFD400` on `#FFFFFF` is about 1.4:1, so the active state reads fainter than the grey inactive ones. Add `stroke: var(--yellow-outline)` (the token that exists for the edge on yellow fills). r47.css:16-17.
2. **`color-scheme` is never set to dark** (C2): the dark theme shows light scrollbars, radios and the range slider. Add `color-scheme: dark` under `[data-theme="dark"]` in tokens.css; the only declaration today is `light`, in app/custom.css:15.
3. **The Rules loop drifts forever with no stop control** (R1, B1, V4): content that moves on its own for more than 5s needs a pause control (WCAG 2.2.2). Hover and focus pause it, touch and AT users cannot. Add one pause button in the style of the hero's "Pause animation". Rules.tsx:16, 89.
4. **Scroll-driven `aria-live="polite"` regions** (B2): the departures verdict panel and the Full Circle beat line announce on every scroll step. Drop `aria-live` from the scroll-fed ones (keep it on the Estimate total and the EUDR check, which answer a click). Examples.tsx:264, Theatre.tsx:210.
5. **Keyboard focus on a rule tile glides 0.7s** (A1): focus jumps are keyboard-initiated and should be instant or at most about 200ms. Rules.tsx:126-128, 132.
6. **One scrub vocabulary** (A2): scrub smoothing is 0.4 (Flow), 0.6 (Story, zoom), 0.8 (finale) and the Flow header comment still says scrub 1. Name two tokens in lib/motion.ts and use them. Flow.tsx:13, 261; Story.tsx:39; Closing.tsx:186, 190.
7. **Type sizes off the token scale** (T1): 17, 15, 13, 11 and 10.5px sit between 14/16/18. Map them to `--caption`, `--body-sm`, `--body`, with 12px as the floor. site.css:157,172; subpages.css:46; mobile.css:29,38,49; shipment.css:109.
8. **`text-wrap: pretty` is on six rules, not on body copy** (T2): add it to `.t-body` and the FAQ and rules paragraphs. components.css:20.
9. **Hero text-shadow breaks the "no shadows" rule** (I1): remove the two `text-shadow` declarations; the map canvas already draws the fade. r10-hero.css:3-4. Check by eye after removal.
10. **Dialog closes with no exit** (A4, F1): the enter animation exists (dlg-in), the close snaps. Add a 160ms fade on close. site.css:94, bits.tsx:136-140.

Next in line: tokenise the hard-coded `#000` and `#fff` (C3), delete dead tokens and the dead phone type block (D2, D3), one `gsap.context` per scene (G3), verify Flow after resize (G2).

### Top 5 "style" ideas for Austin

1. **Trim the pinned runway** (G1): the five pins plus the finale spacer add up to about 2000svh of scroll before Pricing (board 420, story 360, shipment 420 to 460, finale 395 plus Full Circle). Shorter pins on the story and the board would make the page feel faster without losing a step.
2. **Intro once per session** (F6, D6): the dot intro plays on every full load. Returning visitors skip it after the first time.
3. **Drop the Rail dots** (D5): the right-gutter progress dots repeat what the nav active state and the guide lane already say.
4. **Replace the 10px backdrop blur on the section windows with a plain canvas fill** (A6): seven large blur layers sit over a canvas that redraws each frame; the plain fill is cheaper and nearly identical on the flat page.
5. **Theme: follow the OS on the first visit, and swap with a view transition from the toggle** (C5, F2): the page always opens light; one View Transition from the toggle would be the single piece of delight in a rare moment.

---

## 1. typeset

Roles: titles (Nunito 500, 36px), hero (600, up to 120px), body Inter 18/1.5, caption 14, mono for data. Families are three and each earns its place. Delivery (Nunito through next/font) carries automatic fallback metrics; the loaded weights were not checked.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| T1 | P2 | Several | site.css:157, 172; subpages.css:46; mobile.css:29, 38, 49; shipment.css:109 | Sizes of 17, 15, 13, 11 and 10.5px sit between the 14/16/18 tokens, and some are under the 12px caption floor. | Map each to `--caption`, `--body-sm` or `--body`, floor 12px outside drawings and the board flaps. | fits (board flaps and drawing labels stay: r59-0 keep) |
| T2 | P2 | All | components.css:20 | `text-wrap: pretty` is on six rules; `.t-body`, FAQ answers and the verdict paragraph wrap with the default. | Add `text-wrap: pretty` to `.t-body`. | fits |
| T3 | P3 | Board, phones | story.css:125-148 vs mobile.css:37-50 | The 600px and 900px board type sizes (9px, 11px, 13px) are the same selectors as the phone block, loaded later, so they never apply on a phone. | Delete one of the two sets. | fits |
| T4 | P3 | Dark theme | tokens.css:`--lh-body` | Light text on dark gets the same weight and leading as dark on light; the skill asks for a touch more leading in dark. | `--lh-body: 1.55` under the dark theme only. | style |
| T5 | P3 | Tokens | tokens.css (`--mono-eyebrow`, `--mono-chip`) vs components.css:27 | Token names say mono, the eyebrow is now 16px sans; names no longer describe the role. | Rename or remove the unused mono-eyebrow/chip tokens. | fits |

Clear: measure (leads 52ch, captions 30ch, board 64ch, all inside 45 to 75); hero and statement scale with clamp; headings balance; tabular numbers already on prices and the Estimate.

## 2. layout

Spatial thesis: one centred column per section with the dot map as the common ground. Reading order is stable.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| L1 | P3 | Board | story.css:66 | `.ex-pin { height: 420vh }` has no `svh` pair, while the other pins carry both, so the board pin resizes with the phone URL bar on tablets. | Add `height: 420svh` after it. | fits |
| L2 | P3 | Nav | site.css:59, Nav.tsx:201 | The nav collapses at 860px but the phone layouts start at 767px and DESIGN.md names 768; between 768 and 860 a hamburger sits over the desktop pinned layouts. | Move the nav breakpoint to 768. | conflict (nav is a keep) |
| L3 | P3 | All | site.css:55 (1320), r59.css:3 (1400), tokens.css `--container` (1200), r6-pricing.css:5 (1080), site.css:20 (768), site.css:162 (720) | Six content widths; DESIGN.md says one 720px column with 960 for pricing. | One shared `--container` for windows and the hero title; leave the nav wider. | style |
| L4 | P3 | All | site.css:20 | Every section is a centred title, centred lead and one window; at squint level the sections differ only by their picture. | Keep. A left-aligned head in one section would break the rhythm on purpose. | conflict (DESIGN.md Layout: centred column) |

Not verified: 768 to 1024px by eye.

## 3. colorize

Palette: Ollama neutrals, yellow for the Book a demo pill, Live chip, proof dots and shipments, cobalt for lines and actives. The scheme is right and restrained.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| C1 | P2 | Testimonials | r47.css:16-17 | `.vc-dot.is-on` fills yellow (`--proof-dot`) with no edge; on white that is about 1.4:1, so the active dot reads fainter than the grey ones. Unverified by eye. | Add `stroke: var(--yellow-outline)` to the svg, as `.vc-travel` already does with its border. | fits (DESIGN.md adaptation 2 allows yellow for proof dots) |
| C2 | P2 | Dark theme | app/custom.css:15 (`color-scheme: light`), tokens.css | The dark theme never sets `color-scheme: dark`, so scrollbars, the EUDR radios and the Estimate range slider render light on `#171717`. | `.bindu-home[data-theme="dark"] { color-scheme: dark; }`. | fits |
| C3 | P3 | Buttons, chips, board | components.css:49, 92, 93, 158; r44.css:92; story.css:17, 94-96; site.css:109 | `#000` and `#fff` are written in nine rules instead of tokens. | Add `--on-yellow` and `--on-fill` and use them. | fits |
| C4 | P3 | Tokens | tokens.css (light theme comment) | The block comment still describes warm ivory `#F5F1E8` and navy `#14213D`; the values are Ollama white. | Rewrite the comment. | fits |
| C5 | P3 | Theme | home-page.tsx (layout effect) | Theme is dark only if localStorage says so; the OS preference is never read after the first visit. | Read `prefers-color-scheme` when nothing is stored. | style (DESIGN.md says light is the default) |

Clear: `--ink-mute #737373` on `#FAFAFA` is about 4.5:1, with no headroom but passing (prefers-contrast already steps it up); the red appears only on "Stopped"; no gradients on surfaces.

## 4. distill

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| D1 | P3 | Files | components/Cargo.tsx, styles/cargo.css, lib/landdata.ts, styles/r3-qa.css (98 bytes), r13-pricing.css (131 bytes) | `Cargo.tsx` has no importer, so `cargo.css` is dead; `landdata.ts` has no importer found by grep; two stylesheets are one or two rules. | Delete or merge after checking shelley still uses them. | style (merge-back is path for path, CLAUDE.md) |
| D2 | P3 | Tokens | tokens.css (`--glow-*`, `--cobalt-glow`, `--yellow-glow`, `--frame-shadow`, `--shadow-float`, `--glow-card-*`, `--navy-*`); r2-cobalt.css:7 | Tokens that resolve to `none` or `transparent`, and a `box-shadow` transition on a card that has no shadow. | Delete after a grep of the consumers. | fits (DESIGN.md: no glows, no shadows) |
| D3 | P3 | Board, testimonials | story.css:125-148 (overridden by mobile.css); r44.css:182-183 vs r47.css:14-15 | Duplicate rule sets: phone board type, and the old ring dot (`::before`) next to the new svg dot (`content: none`). | Remove the losing copy. | fits |
| D4 | P3 | Tokens | tokens.css (`--r-md`, `--r-lg`, `--r-xl`, `--r-2xl`, `--r-4xl`, `--r-hero`) | Six names for 12px. | Collapse to `--r-md`, keep one alias list for merge-back. | fits |
| D5 | P2 | Page | components/Rail.tsx | The right-gutter dots repeat the nav active state and the guide lane. | Remove Rail. | style |
| D6 | P3 | Intro | components/Intro.tsx:21 | The intro replays on every full load (`seen` is a module variable). | Remember it for the session. | style |
| D7 | P3 | Story | Flow, Full Circle, shipment map, departures board | Four pinned explainers tell one idea in four ways; a distill pass would merge two. | None proposed. | conflict (all four are Austin's keeps) |

## 5. improve-animations

Stack: GSAP and ScrollTrigger on one ticker with Lenis, a few CSS transitions on tokens (`--ease-ui`, `--t-ui`). Duration and easing tokens exist and are used well; no `transition: all`, two `will-change`. Settled and not repeated: heading reveal length, press scale, Lenis settle.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| A1 | P2 | Rules | Rules.tsx:126-128, 132 | Focusing a tile with Tab runs a 0.7s `power3.out` tween (and locks the drift) on every focus. | `gsap.set` for focus, keep the 0.7s for click only. | fits |
| A2 | P2 | Scenes | Flow.tsx:261 (0.4), Story.tsx:39 (0.6), Closing.tsx:186 (0.8), :190 (0.6); Flow.tsx:13 says scrub 1 | Four scrub values for the same kind of motion, and a stale comment. | Two named constants in lib/motion.ts; fix the comment. | fits |
| A3 | P3 | Finale | Closing.tsx:107 | `matchMedia("(min-width: 901px)")` is read once at setup, so a window resize across 901 keeps the old branch. | Re-run on `onPhoneChange` or a media listener. | fits |
| A4 | P3 | Dialogs | site.css:94-95, bits.tsx:136-140 | The dialog zooms in from the trigger (from scale 0.4) but `close()` removes it at once. | 160ms opacity out before `close()`; start the zoom at 0.9. | fits |
| A5 | P3 | Full Circle | theatre.css:33-35, Theatre.tsx:210 | The beat line is re-mounted by `key`, so a fast scroll restarts the 320ms keyframe from zero each beat. | A transition on the existing node. | fits |
| A6 | P2 | Section windows | story.css:206 | Seven large `backdrop-filter: blur(10px)` layers sit over a canvas that redraws per frame. Not measured on a real GPU. | A plain canvas fill at about 0.9. | style (Austin asked for the feathered blur layer, adaptation 11) |

## 6. find-animation-opportunities

Gate (frequency, purpose, speed, function) applied to every static state change.

| ID | Pri | Where | Today | Suggested motion | Tag |
|---|---|---|---|---|---|
| F1 | P3 | Dialogs (site.css:94) | Close snaps. Purpose: preventing a jarring change; occasional. | 160ms opacity out, `--ease-out`. Same as A4. | fits |
| F2 | P3 | Theme toggle (lib/theme.ts:15) | Instant swap, by design (r60-5). Rare, spatial purpose. | One View Transition, circle reveal from the toggle, 400ms, reduced motion off. | style |
| F3 | P3 | FAQ answers (site.css:196) | `details` opens with no height change; only the icon turns. | Height and opacity 200ms. | conflict (component-review row 11: FAQ, change nothing) |
| F4 | P3 | Nav drawer (site.css:54) | `hidden` toggle. | 200ms opacity and 8px rise. | conflict (nav is a keep) |
| F5 | P3 | EUDR check result, Estimate total (EudrCheck.tsx:30, Estimate.tsx:54) | Text swaps. | Fade 200ms, odometer on the total. | conflict (Pricing: "don't change") |
| F6 | P3 | Intro (Intro.tsx:21) | Plays every load. 100% of returning visits see it again. | Remember per session (see D6). | style |

Rejected: Rules arrow keys and Tab (keyboard, never animate), nav link hover (frequent), button press scale (DESIGN.md: static buttons), a second reveal on the departures verdict (the data is read and acted on).

## 7. gsap-scrolltrigger-storytelling

The page already follows the skill: pinned stages, scrubbed timelines, transform and opacity, `invalidateOnRefresh` on the hero, function-based starts on the finale, `ScrollTrigger.refresh` batched in lib/ready.ts, one ticker.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| G1 | P2 | Pins | story.css:36, 66; r44.css:10; shipment.css:10, 82 | The runway before Pricing is about 2000svh of pinned scroll on desktop (board 420, story 360, shipment 420 to 460, finale spacer 395, plus Full Circle). The skill warns against trapping the reader. | Shorten the story and board pins by about 20%. | style (structure is a keep; length is not) |
| G2 | P2 | Story | Flow.tsx:107, 181-184, 261 | The timeline bakes pixel measurements (offset widths, `big.x`, clip insets) at build; the trigger has no `invalidateOnRefresh`. A resize or late font load can leave them stale. Not verified by resizing. | Rebuild on `ScrollTrigger` refresh or set `invalidateOnRefresh: true` on the timeline's trigger. | fits |
| G3 | P3 | Scenes | Hero.tsx:89, Story.tsx:39, Closing.tsx:186 | Only Flow and theatre-fx use `gsap.context`; the rest kill tweens by hand. | One `gsap.context` per component so unmount kills triggers. | fits |

## 8. 12-principles-of-animation (spring rules)

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| S1 | P2 | Rules | Rules.tsx:88, 126-128, 151 | `spring-for-interruptible`: the drag friction is an exponential decay (good), but a click-to-tile tween holds `st.lock` until it completes; whether a new drag during that 0.7s takes over cleanly was not tested (r60 left it unverified too). | Test by hand; if it stalls, kill the tween on pointerdown. | fits (unverified) |
| S2 | P3 | Gestures | Voices.tsx:62, Rules.tsx | `physics-spring-for-overshoot` and `spring-for-gestures`: nothing overshoots; every settle is an expo or power ease, bounce 0. | None. A spring with bounce would add a motion the system does not have. | conflict (DESIGN.md: static; r60 pass 4) |

## 9. taste-skill

Used as a reference only. Its rules for photographs, drawn icons and effects target pages that have none of the Bindu constraints.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| V1 | P3 | Page | whole | "More and better real photographs": the page has one photo (the finale). | None. | conflict (DESIGN.md: no photography; finale is the exception, adaptation 6) |
| V2 | P3 | Mocks | Intro.tsx:61, Hero, board | "No caption under a visual": the page labels every mock "Illustration". | None. | conflict (DESIGN.md adaptation 7 and the honesty rules) |
| V3 | P3 | Headings | lib/headings.ts | "No fade-in on scroll": every heading reveals as it enters. | None. | conflict (r54 reveal, MOTION.md) |
| V4 | P2 | Rules loop | Rules.tsx:16 | "Anything moving past 5s has a pause button": the Rules loop has none (same as R1). | Pause button. | fits (counted once, see R1) |

Clear by the skill's own gate: first screen says what is sold with one hard fact (the deadline date), one section per screen on the pins, hero enters once, reduced motion rests.

## 10. swiss-design

Reference only (IBM Plex Sans, stone palette, 8px grid, rectilinear).

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| W1 | P3 | Type | tokens.css | Swiss asks for IBM Plex Sans and light weights; the page uses Nunito 500/600 and Inter. | None. | conflict (DESIGN.md adaptation 1; IBM Plex is retired) |
| W2 | P3 | Colour | tokens.css | Hierarchy by opacity, one accent. The page uses three fixed greys and two accents. | None. | conflict (DESIGN.md palette plus yellow and cobalt) |
| W3 | P3 | Shape | tokens.css `--r-control` | No border radius on structural elements; the page is pills and 12px cards. | None. | conflict (DESIGN.md pill geometry) |

What it would improve inside our system is already in place: body measure is under 60ch everywhere (52, 56, 64ch), and numbers use tabular figures on prices and the Estimate (components.css:32, r6-pricing.css:55).

## 11. container-lines

Reference only.

| ID | Pri | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| K1 | P3 | All | n/a | Vertical guide lines with corner squares would sit on the dot map. | None. | conflict (DESIGN.md: no decorative dividers, the map is the ground; adaptation 11) |
| K2 | P3 | Windows | story.css:206 and the section windows | If a measured feel is wanted, the hairline windows already give the edges; one 6px corner square on the hero sub-line baseline would be the whole device. | None recommended. | style |

## 12. better-interface

Scope: the whole homepage, source only. Project docs read: CLAUDE.md, docs/home/*. The domain skills `better-writing` and `better-motion` are not installed here: those two domains are Not reviewed (motion is covered above by improve-animations and the 12-principles). The other `better-*` skills were not loaded one by one; accessibility, layout, type, colour and polish were checked directly.

| ID | Sev | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| B1 | MEDIUM (P2) | Rules | Rules.tsx:16, 89 | Auto-moving row with no pause control (see R1). | Pause button. | fits |
| B2 | MEDIUM (P2) | Board, Full Circle | Examples.tsx:264, Theatre.tsx:210 | `aria-live="polite"` on text that changes with scroll. | Remove from the scroll-fed regions. | fits |
| B3 | LOW (P3) | Intro | Intro.tsx:59 | A click-only region with Escape on the window; no visible skip control. | A "Skip" button, same size as the hero's Pause. | fits |
| B4 | MEDIUM (P2) | Testimonials | r47.css:16-17 | Active state carried by a yellow fill that is 1.4:1 on white (see C1). | Edge stroke. | fits |

No escalation trigger is confirmed: icon buttons carry names (bits.tsx:140), the focus ring is drawn on every control (site.css:12-13), reduced motion is honoured (r60 pass 3), no positive tabindex. Not verified: 320px and 200% zoom by eye, screen-reader pass.

## 13. improve-ui

Surface: the homepage. Design language: DESIGN.md v4 plus its adaptation list; owners are tokens.css and r59.css. Explicit exceptions: none documented beyond adaptations 1 to 11.

| ID | Pri | Problem | Evidence | Proposed change | Scope | Confidence |
|---|---|---|---|---|---|---|
| I1 | P3 | Hero title and sub-line carry a glow `text-shadow`. | DESIGN.md "Don't ... drop shadows" and adaptation 5 "No shadows"; r10-hero.css:3-4 is imported by home-page.tsx and reaches `.hero-h` and `.hero-sub`; its own comment says the map canvas already draws the fade. | Remove both `text-shadow` declarations. | r10-hero.css | Medium (legibility over dots checked by eye only after removal) |
| I2 | P2 | Active testimonial dot is a bare yellow fill. | `--yellow-outline` is defined for the edge on yellow fills (tokens.css) and used by `.vc-travel` (r47.css:13); `.vc-dot.is-on svg` (r47.css:17) does not use it. | `stroke: var(--yellow-outline)` on the active svg. | r47.css | Medium (svg shape not inspected) |

Improve first: I2, the strongest evidence and the smallest change. No other supported findings.

## 14. rams

| ID | Level | Section | file:line | Finding | Fix | Tag |
|---|---|---|---|---|---|---|
| R1 | Serious (P2) | Rules | Rules.tsx:16, 89 | WCAG 2.2.2: content that moves automatically for more than 5s alongside other content has no pause, stop or hide control. Hover and focus pause it, but touch, switch and screen-reader users have neither. | Pause button reusing the hero's "Pause animation" style. | fits |
| R2 | Moderate (P3) | Intro | Intro.tsx:59 | `role="region"` with `onClick` and no key handler on the element itself (Escape works on the window). | A real Skip button. | fits |
| R3 | Moderate (P3) | Testimonials | Voices.tsx:195, 220 | The track and its dot list share the same `aria-label`. | Give the dot list its own name ("Choose a testimonial"). | fits |

Critical: none (no image without alt, icon buttons named, no clickable div without role beyond R2, no `tabIndex` above 0, headings in order h1, h2, h3). Summary: 0 critical, 1 serious, 2 moderate.

---

## Unverified and left open

- Nothing was looked at in a browser: C1, C2, I1, G2 and T1 need a look at 1440 and 390, light and dark.
- A6 and G1 (blur cost, pin length) are judgements from source; a real GPU run is needed.
- Safari, 768 to 1024px and the dark census are still open from round 60.
- No product code was edited in this round; every fix above is a proposal.
