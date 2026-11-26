---
version: 3
name: Bindu-home
description: Bindu's homepage system from r54. One reference, sublime.app, measured from its live CSS on 25 Nov 2026, built step by step with Austin. Colours and fonts are Bindu's (frozen); everything else follows Sublime.
sources:
  - sublime.app (live CSS and markup, 25 Nov 2026): type scale, tracking, section rhythm, radii, buttons, panels, nav, footer, reveal motion. getdesign.md has no Sublime DESIGN.md (screenshots only), so this file is our own measurement.
  - previous systems: v1 (x.ai / Together / Apple) at e51c51c; v2 (parallel.ai shapes, kami background) kept at docs/home/rounds/DESIGN-v2-r52.md, superseded before r53 was built.
status:
  step-1-foundation: approved (Austin, 25 Nov 2026)
  step-2-components: approved (Austin, 25 Nov 2026)
  step-3-motion: approved (Austin, 25 Nov 2026)
  step-4-sections: approved (Austin, 25 Nov 2026); spec rounds/round-54.md
frozen:
  colours: features/landing/home/styles/tokens.css, both themes
  fonts: Inter (sans), IBM Plex Mono (mono); Sublime's Control Upright is a paid face and is not used
---

# Bindu homepage design system (v3, Sublime)

Applies to the homepage (`/`). Other pages follow `docs/DESIGN.md`.
Rule: every section uses only what is in this file. A section may have its own motion idea, never its own type sizes, buttons, panels or radii.

## 1. Frozen: colours
Unchanged values from tokens.css. Mapping of Sublime's roles onto ours:
| Sublime role | Sublime (light) | Bindu token |
|---|---|---|
| Page | `#fafbfc` | `--canvas` (`#F1ECE1` light, `#0A0A0A` dark) |
| Headline ink | stone-1 `#181816` | `--on-dark` / `--ink` |
| Quiet copy | stone-4 `#908f8e` | `--on-dark-mute` |
| Filled panel, secondary button | stone-6 `#efefef` | `--canvas-mid` (`#E7E1D3` light, `#1C1D21` dark) |
| Signup accent fill / label | green-2 `#cbffa6` / green-1 `#38744d` | `--brand-yellow` fill / ink label |
| System, links | blue | cobalt, as today |
One canvas everywhere; no colour bands. Yellow and cobalt keep their jobs (yellow = act, Live, proof dots; cobalt = the system).

## 2. Frozen: fonts
Inter for every word a person reads or clicks; IBM Plex Mono only for data (prices, reference numbers, regulation numbers, flaps, map labels). Sentence case everywhere (Sublime's lowercase copy is not taken).

## 3. Foundation (step 1, approved)

### Type scale (Sublime's ladder, set in Inter)
| Role | Size | Line height | Tracking | Weight | Sublime source |
|---|---|---|---|---|---|
| Display hero | clamp(46px, 8.4vw, 120px) | 0.88 | -0.045em | 500 | landing-heading-1: 46 / 97 / 120px, lh .85 to .9 |
| Display section | clamp(40px, 6vw, 88px) | 0.9 | -0.04em | 500 | same ladder, one step down |
| Copy lead | clamp(22px, 2vw, 28px) | 1.07 | -0.02em | 400, mute | landing-copy-1: 28px, lh 1.07 |
| Body | 18px (17 on phones) | 1.4 | -0.015em | 400 | landing-copy-2: 18px |
| Small | 15px | 1.45 | -0.02em | 400 | text-sm: 15px, -.02em |
| Caption | 12.5px | 1.2 | -0.01em | 400 | landing-copy-3: 12 to 12.5px |
| Button | 14px | 1 | 0 | 500 | landing-button-2: 14px, lh 1 |
| Data (mono) | 13 to 15px | 1.3 | 0 | 400, tabular | ours |
Display weight 500 (Sublime's variable face sits at 450 to 480; Inter 600 is too heavy at 120px). One display size per section; the yellow full stop stays on every h2.

### Section rhythm
- Every section is a centred column: head centred, content centred under it, `min-height: 80svh`, content vertically centred.
- Padding: 56px top and bottom on phones, 128px from 1024px (Sublime `py-14 lg:py-32`). Sections are separated by space only: no rules, no bands, no dividers.
- Widths: copy column max 768px (lead max 32ch); content (stages, boards, tables) max 1200px; full-bleed only for the hero map and the finale.
- Gap headline to lead 24px; lead to content 56px (80px from 1024px).
- Pinned sections keep their pins; the head inside the pin is centred and keeps the same sizes.

### Radii (Sublime's scale)
`--r-xs` 5px (buttons, chips, inputs) · `--r-sm` 10px (small cards, menus) · `--r-md` 15px (cards) · `--r-lg` 20px (panels) · `--r-xl` 25px · `--r-2xl` 30px · `--r-4xl` 40px (large media and the footer card from 1024px). Round shapes only for dots and icon buttons.

### Depth
Flat by default: a panel is a fill, not a border or a shadow (Sublime's landing page uses no shadows on its sections). One soft shadow, only for things that float over the page (dropdown, dialogs, the calculator popup, the nav when it sits over content):
- light: `0 16px 32px rgb(20 26 30 / .07), 0 6px 16px rgb(20 26 30 / .02), 0 1px 4px rgb(20 26 30 / .02)` (Sublime shadow-cloud)
- dark: `0 16px 32px rgb(0 0 0 / .30), 0 6px 16px rgb(0 0 0 / .15), 0 1px 4px rgb(0 0 0 / .10)`
No glows, no gradients except the footer gradient over the finale, no textures.

## 4. Components (step 2, approved)

### Buttons
Sublime's small buttons, sized for touch: 36px tall from 768px, 44px on phones, `--r-xs` 5px, padding 0 14px, Inter 500 14px, no border. Hover = fill and label colour change, 200ms. No movement of any kind (Sublime presses to scale .95; we skip it: Austin, no jiggling).
- `btn-primary`: yellow fill, ink label. Book a demo (hero and nav; a normal-size button, Sublime's giant signup block is not taken).
- `btn-secondary`: `--canvas-mid` fill, mute label; hover one step darker fill, ink label. Estimate your cost, Read the rule.
- `btn-ghost`: ink at 4% fill, mute label; hover `--canvas-mid`. Small controls (carousel, pause).

### Nav
Keep Bindu's floating bar and its collapse (r42/r43): logo, links, theme toggle, Book a demo at the right end of the expanded bar; the collapsed pill past the hero is logo only. Restyled to v3: the bar is a `--canvas-mid` fill at 88% with the backdrop blur it has now, `--r-sm` 10px corners, no border, the soft floating shadow (section 3, Depth); links are Inter 15px mute, hover ink; the active section pill is a `btn-secondary` fill (no cobalt outline), the yellow dot stays; Book a demo is `btn-primary`. Sublime's split header is not taken.

### Panels
`--canvas-mid` fill, no border, no shadow, `--r-lg` 20px (`--r-4xl` 40px for full-width panels from 1024px), padding 24 (40 on large panels). Nested surfaces inside a panel use `--canvas-soft`. The pricing card, departures board, story stage, Full Circle stage, FAQ list and rules tiles all use this one panel.

### Chips
22px tall, `--r-xs` 5px, Inter 500 12px, no border. Live: yellow fill, ink. In build: transparent with a 1px dashed mute outline (the one bordered chip). Illustration / Placeholder: `--canvas-mid` fill, mute label.

### Tabs
A row of `btn-secondary` buttons; the active one is ink fill with canvas label. No underline, no indicator line.

### Links
Inline: cobalt, 1px underline, 4px offset. Nav, footer, "see more": mute Inter 15px, hover ink.

### Footer
Sublime's footer card: one centred panel, max 780px from 1024px (400px on phones), `--r-4xl` 40px from 1024px (`--r-lg` on phones), link columns in a row with 48px gaps, legal line inside the card. It still rides up over the finale.

## 5. Motion (step 3, approved)
Sublime's motion is calm: things fade up once and settle. Every animation on the page follows that.
- **Reveal (all headings and leads):** each line fades up from 30px below (opacity 0 to 1, y 30 to 0), `--ease-out`, about 0.7s, lines staggered 0.08s, once on entry. Replaces the SplitText line masks, the hero's word-by-word entrance and Full Circle's masked title swap (it now fades out up 0.2s, then the new title fades up).
- **Kept, restyled only to v3 panels, radii and type:** the intro dot bloom, the statement words lighting up from the scroll, the story stage, Full Circle's acts, the shipment journey and map, the departures board flaps, the pricing odometer, the FAQ accordion, the rules sideways tile scroll (r52-3), the finale zoom with the 34-dot ı, the ink ship guide, the map blur behind content.
- **Testimonials:** the curved 3D card track is flattened (Austin: go with Sublime): a straight row of v3 panel cards that the scroll moves sideways, no 3D, no rotation, no perspective; cards fade up on entry; the words of the front quote still light up and the yellow dot still travels its dashed route. Phones and reduced motion: a list.
- **Text links:** colour change only on hover (mute to ink, or cobalt deepening for inline links), 200ms. No growing underline, no wipe, no arrow nudge.
- **Buttons:** colour change only (section 4).
- GSAP owns all of it; reduced motion = composed end state, no fade, no pin.

## 6. Motif (unchanged)
Bindu = dot. The 34-dot sunflower in the finale ı, the dot guide ship, the official sunflower logo, yellow proof dots. One sunflower per view.

## 7. Illustration labels (unchanged rule)
Every mock, map, chat, log, board, reference and certificate number carries one Illustration chip (section 4) in its caption row.
