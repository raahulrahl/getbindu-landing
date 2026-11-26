---
version: 2
name: Bindu-home
description: Bindu's homepage system from r52. Colours and fonts are frozen (yellow + cobalt, ivory and dark themes, Inter + IBM Plex Mono). Everything else (button shapes, radii, panels, tabs, chips, rules, grid) follows one reference, parallel.ai (shapes only; control type stays Inter), measured from its live CSS on 25 Nov 2026.
sources:
  - parallel.ai (live CSS, 25 Nov 2026): button classes, radius, spacing and tracking tokens, 13px body-sm. Structure only; its colours and its typefaces (Gerstner Programm, FT System Mono) are not used.
  - previous system (v1, x.ai / Together / Apple, rounds 1 to 51): in git at commit e51c51c, docs/home/DESIGN.md
frozen:  # never change these in a design round; only Bindu's real hex values may replace the placeholders
  colours: features/landing/home/styles/tokens.css (both themes), section "Colours" below
  fonts: Inter (sans), IBM Plex Mono (mono), self-hosted, through --font-sans / --font-mono only
---

# Bindu homepage design system (v2)

Applies to the homepage (`/`). Other pages follow `docs/DESIGN.md`.
Code: `features/landing/home/styles/tokens.css` (tokens), `styles/components.css` (components).

**Why v2.** Austin, 25 Nov 2026: the page read as "a collection of other webpages". v1 mixed x.ai, Together, Apple, Notion, Rothfinder, Framer and Awwwards pieces section by section. v2 has one rule: every component comes from this file, and this file takes its shapes from one reference. A section may have its own motion idea, never its own buttons, chips, tabs, radii or panel style.

## 1. Frozen: colours and themes
Unchanged from tokens.css. Do not retune in design rounds.
- Yellow `--brand-yellow #FFD400` (placeholder until Bindu sends the hex): the primary button, the Live chip, proof dots. Never text on light.
- Cobalt: the system. Dark `--cobalt-signal #3D7BFF` for lines; light `#1F55C4` for lines, `--brand-cobalt #08327A` for links and text.
- Light (default): canvas `#F1ECE1`, panel `#FBF9F4`, nested `#E7E1D3`, hairline `#CFC8B6`, ink `#0E1A30`, body `#2F3A56`, mute `#434E6A`, band tint `#E3DCCC`.
- Dark: canvas `#0A0A0A`, panel `#141416`, nested `#1C1D21`, hairline `#26282D`, ink lines `#EDE8DA`, band tint `#0A1222`.
- In build: neutral dashed outline, never yellow or cobalt. Never `#000` or `#fff` as a surface. From r53 there are no colour bands: see section 9b.

## 2. Frozen: fonts
Inter + IBM Plex Mono. Display weight 600, negative tracking from the `--track-*` tokens, sentence case. Display sizes unchanged (xl 48 to 96, lg 40 to 72, md 32 to 48, sm 24 to 32, xs 20; phones as in `mobile.css`).

## 3. The two-voice rule
Austin, 25 Nov 2026 (r52): parallel's mono-caps controls did not suit the theme, so controls stay in Inter as before r52. Sans for every word a person reads or clicks; mono only for data.
| Voice | Face | Case | Size | Used for |
|---|---|---|---|---|
| Headline | Inter 600 | sentence | display scale | section titles, step titles |
| Reading | Inter 400 | sentence | 19 / 17 / 15 | leads, paragraphs, captions, FAQ answers |
| Control | Inter 500 | sentence | 15px (chips 12px, min 11px), no tracking | every button, tab, chip |
| Label | Inter 500 | sentence | 14 to 15px | nav and footer links, small section labels ("Full Circle"), table headers |
| Data | Plex Mono 400 | as written | 13 to 15, tabular | prices, reference numbers, HS codes, regulation numbers, the board flaps, map labels |
Never mono paragraphs, never caps anywhere.

## 4. Shape tokens (measured on parallel.ai)
| Token | Value | Use |
|---|---|---|
| `--r-control` | 4px | buttons, inputs, tab indicator ends, chips |
| `--r-ui` | 6px | small cards, popovers, the Regulations dropdown |
| `--r-md` | 8px | cards, nested panels |
| `--r-lg` | 16px | large panels (pricing card, dialogs, the story stage, the departures board) |
| `--r-hero` | 24px | one full-bleed framed media per page at most (the finale frame, if any) |
Pills (9999px) are retired. The only round shapes left are dots, the logo pill of the collapsed nav (r43) and the 44px icon button.

Spacing stays on the 4px base (`--s-1` 4 to `--s-10` 120); parallel's scale (4, 8, 12, 16, 24, 32, 40, 48, 80, 120, 160) maps onto it, so no new tokens.

## 5. Buttons: one set, everywhere
Measured from parallel.ai's `button` classes: `font-mono rounded-sm border px-16 pt-8+1px pb-8-1px uppercase active:scale-.98 text-body-sm`.
- **Shape:** 4px radius, 1px border on every variant (transparent where not visible, so all variants are the same size), 16px side padding, label optically centred, height 36px from 768px, 44px on phones.
- **Label:** Inter 500, 15px, sentence case, no tracking (r52 revision; parallel's mono caps rejected). A plain arrow `→` after the label for links that leave the page section; no other icons.
- **Variants (only these three):**
  - `btn-primary`: yellow fill, ink label, `--yellow-outline` border. One per view. "Book a demo".
  - `btn-solid`: ink fill (`--ink` on light, `--on-dark` on dark), canvas label, transparent border. Secondary actions that still need weight: "Estimate your cost".
  - `btn-outline`: transparent, 1px `--hairline-dark` border, ink label; hover fills `--canvas-mid`. Tertiary: "Read the rule", carousel prev/next with a label.
- **States:** hover = colour change only, 200ms `--ease-ui`. Buttons never move: no magnetic pull, no dot burst, no arrow nudge, no press scale (Austin: "remove the jiggling"). Focus = 2px cobalt ring, 2px offset. Disabled = mute label, nested fill, no motion.
- **Retired with v1:** yellow pill, magnetic pull, click dot burst, the arrow nudge and press scale on buttons.
- **Nav (r52):** Book a demo `btn-primary` at the right end of the floating bar; the collapsed pill past the hero is logo only (r43), no demo button.
- Applies to every button on `/`: nav drawer, hero, Full Circle tabs' neighbours, pricing, calculator popup, rules, voices controls, FAQ, footer.

## 6. Text links
Inter 500 15px sentence case for nav, footer and "see more" links; Inter for links inside a paragraph. Rest: mute colour. Hover: ink (dark: `--on-dark`), 200ms. Inline paragraph links: cobalt, 1px underline, 4px offset. Links that leave the site end in `↗`; in-page links end in `→`.

## 7. Tabs
One component (`.seg-track`), restyled: Inter 500 15px sentence-case labels, mute at rest, ink when active; the active tab gets a 1px ink border box with 4px radius (a button in the outline style), no underline, no fill. Row sits on one hairline. Arrow keys and roving tabindex unchanged. Journey tabs, pricing tabs and Full Circle acts all use it.

## 8. Chips
Inter 500, 12px (min 11px), sentence case, 22px tall, 4px radius, 1px border.
- Live: yellow fill, ink label, `--yellow-outline` border.
- In build: transparent, 1px dashed mute border, mute label.
- Illustration / Placeholder: transparent, 1px solid hairline, mute label.
Minimum 11px on every width (fixes the r51 P2 9px and 10px chips).

## 9. Panels and rules
- Prefer rules to boxes. A section sits on the canvas, split by 1px hairlines; a box only where content is a thing (a record, a receipt, a board).
- Panel: `--canvas-soft`, 1px `--hairline-dark`, no shadow, no blur, radius by size (section 4).
- Tables (pricing included list, rules, FAQ): full-width rows on 1px hairlines, mono label column left, sans content right, 16px row padding.
- Section head: an optional mono label (section 3, "Label") 12px above the h2, then the lead. One pattern for every section; the yellow full stop on the h2 stays.

## 9b. Backgrounds (r53, from kami)
Reference: open-design.ai kami ("paper and ink"), adapted from tw93/kami (MIT); the idea is rebuilt in our code, credited in LICENSES.md. Only the background rules are taken; kami's serif type, ink-blue accent and hover shadow are not.
- **One paper.** The page is `--canvas` from top to bottom in both themes. The scroll crossfade between `--band-canvas`, `--band-tint` and `--band-panel` is retired; `--band-tint` stays defined but unused.
- **Sections are split by rules, not colour.** Each section from the statement on gets one full-width 1px `--hairline-dark` rule on its top edge, edge to edge of the viewport (not the container). No rule above the hero, none between the FAQ and the finale (the finale photo is its own edge). Pinned sections carry the rule on the section, so it scrolls away with the pin's start.
- **Panels are always the one panel.** `--canvas-soft` with a 1px `--hairline-dark`, radius by size (section 4). `--canvas-mid` only nested inside a panel. Nothing else gets a fill.
- **Depth is a hairline.** No shadows, no glows, no gradients, no texture or noise. The one exception stays the dark gradient that brings the footer up over the finale.
- **The map is the only thing behind the paper.** The fixed dot map and the r41/r48 feathered blur behind content are unchanged.

## 10. Layout
Container 1200px, gutter 16 to 32px (20px on phones), section padding `clamp(80px, 11vw, 160px)`. Every section fits one window; two-column sections share one grid and one top line. Left-aligned heads everywhere except pricing.

## 11. Motif (unchanged)
Bindu = dot. Sunflower of 34 dots in the finale ı; the guide ship of dots; the official sunflower logo in nav and footer. One sunflower per view. Yellow dots = proof; cobalt dots = the system at work.

## 12. Motion (unchanged)
See `MOTION.md`. One motion idea per section; scroll-linked and reversible; GSAP owns it; reduced motion = composed end states. v2 removes button motion only (section 5).

## 13. Illustration labels (unchanged rule, new chip style)
Every mock, map, chat, log, board, reference and certificate number carries one Illustration chip (section 8), in the figure's caption row.

## 14. Audit list (what v2 changes in existing code)
For the r52 coding agent; tick off as done.
- `.btn` set and every button on `/` to section 5; remove magnetic pull and dot burst code.
- `.seg-track` to section 7.
- `.chip*` to section 8; Illustration chip on phones to 11px.
- `--r-sm` 12px cards to `--r-md` 8px; add `--r-control`, `--r-ui`, `--r-hero`.
- Nav: Book a demo back in the bar and the collapsed pill.
- Any component style that exists in one section only: either moved into components.css as one of the above, or deleted.
