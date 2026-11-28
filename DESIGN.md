# DESIGN.md — Bindu

Design system for the Bindu marketing site, extracted from **parallel.ai**
(captured 2026-11-27, viewport 1728px) and adapted for Bindu.

This file is the contract. An agent building any Bindu page reads this and
nothing else. Where a value appears here, use it exactly; do not invent a
nearby one.

Two layers:

- **Layer A — the extracted system.** Real computed values from parallel.ai.
  Treat these as measured facts.
- **Layer B — Bindu substitutions.** The short list of things we deliberately
  change. Marked `[BINDU]`.

---

## 0. Provenance and licensing

Values below were read from the live site's computed styles and CSS custom
properties, in the manner of VoltAgent/awesome-design-md. What we take is the
**visual system**: colour roles, type scale, spacing, grid, component shapes,
section rhythm.

What we do **not** take, and must never appear in this repo:

- Parallel's wordmark, logo or any brand asset.
- The `gerstnerProgramm` and `ftSystemMono` font files. Both are commercial
  (Forgotten Shapes; Formula Type). We ship open substitutes — see §3.
- Parallel's marketing copy, product names, customer names or testimonials.
- Anything implying affiliation with Parallel.

---

## 1. Visual Theme & Atmosphere

**Swiss modernist software documentation.** A technical reference manual that
happens to sell something. The register is *measured, exact, unhurried*. The
page earns trust by looking like it was typeset rather than designed.

Four properties define it. Getting any one wrong loses the look:

1. **Type is small.** The hero H1 is **36px** at a 1728px viewport. Not 72px,
   not clamped to the viewport. Restraint in type size is the single loudest
   signal of this system, and the rule most likely to be broken by habit.
2. **Mono carries the interface.** Every piece of chrome — nav, buttons,
   eyebrows, labels, chips, footer links, status text — is monospace,
   uppercase, 13px, letter-spacing 0.16px. Prose is sans. The two never swap.
3. **Colour is rationed.** The canvas is warm off-white, the ink near-black,
   and exactly one accent exists — cobalt. It appears roughly once per
   viewport: a primary button, a live value, one inline highlight. Muted dusty
   paper-blues and sands do the rest of the work, and are never mistaken for
   the cobalt signal (§2.4).
4. **Depth is nearly absent.** Hairline 1px borders separate things. Shadows
   are so faint they read as paper grain, never as elevation.

Density: **medium-low.** Generous vertical rhythm (80px between sections,
160px at major transitions), but content blocks themselves are tight and
information-dense. Whitespace sits *between* ideas, not inside them.

Anti-mood: SaaS gradient hero, glassmorphism, oversized display type, purple,
glow, floating 3D, "AI shimmer", emoji.

`[BINDU]` Bindu's subject is EU trade regulation. The documentation register is
a gift here: it is what a compliance buyer wants to see. Lean into it. The
product should look like the regulation's own reference implementation.

---

## 2. Colour Palette & Roles

### 2.1 Core

| Token | Hex | Role |
|---|---|---|
| `--color-white` | `#ffffff` | Card and panel surfaces, header background |
| `--color-off-white` | `#f9f8f4` | **Page canvas.** Warm, not grey. Never pure white |
| `--color-black` | `#181818` | Primary ink. Never `#000` |
| `--color-grey` | `#d6d6d5` | Default hairline border |

### 2.2 Grey ramp

| Token | Hex | Role |
|---|---|---|
| `--color-grey-100` | `#f6f6f6` | Inset / tinted panel fill |
| `--color-grey-200` | `#eeeeee` | Chip and tab fill (resting) |
| `--color-grey-300` | `#e5e5e5` | Hairline border, dividers |
| `--color-grey-400` | `#d6d6d6` | Stronger border (`--color-stroke-primary`) |
| `--color-grey-500` | `#adadac` | Disabled text, placeholder |
| `--color-grey-600` | `#858483` | **Secondary text.** Nav links, labels, footer links |
| `--color-grey-700` | `#5c5b59` | Body text on tinted surfaces |
| `--color-grey-800` | `#434343` | Secondary button fill |
| `--color-grey-900` | `#181818` | = black |
| `--color-grey-1000` | `#101010` | Dark band / footer visual |

### 2.3 `[BINDU]` Accent — cobalt

The extracted source accent was orange `#fb631b`. We replace it with Bindu's
own cobalt. Every value below is taken from the previous Bindu site's tokens,
as are the contrast ratios, which that codebase had already measured.

| Token | Hex | Role |
|---|---|---|
| `--color-cobalt-100` | `#0047AB` | **Brand.** Primary button, links on light, frames, active states |
| `--color-cobalt-200` | `#1F55C4` | Brand hover |
| `--color-cobalt-300` | `#3D7BFF` | Signal: data trails, progress, active steps, charts |
| `--color-cobalt-400` | `#9DBBFF` | Illustration only, pulses on dark |
| `--color-cobalt-500` | `#E3E8F3` | Pale tint wash background |

Two further cobalts, outside the ramp:

| Token | Hex | Role |
|---|---|---|
| `--color-cobalt-ink` | `#08327A` | Inline links and active text on light bands |
| `--color-cobalt-deep` | `#0A1A3D` | Dark band wash, glow cores, blueprint grid tint |

`#0047AB` is the classic cobalt blue and was the previous site's single source
of truth for the brand.

### 2.4 Supporting families (illustration, data, surfaces — never UI chrome)

| Family | 100 | 200 | 300 | 400 | 500 |
|---|---|---|---|---|---|
| Blue | `#8fb6cc` | `#a5c5d6` | `#bcd3e0` | `#d2e2eb` | `#e9f0f5` |
| Sand | `#ccc7ba` | `#d6d2c8` | `#e0ddd6` | `#ebe9e3` | `#f5f4f1` |

Blue is dusty and desaturated; it is a *paper* blue, not a UI blue. Sand is the
warm neutral used for large demo-panel backgrounds.

> **Two blues now live in this system, and they must never be confused.**
> `--color-blue-*` is a chalky, low-saturation **surface**: it fills panels and
> sits behind things. `--color-cobalt-*` is a saturated **signal**: it is the
> brand and it is never a background for content. If a blue is holding text,
> it is the paper blue. If a blue is the thing you are meant to look at, it is
> cobalt. Never place cobalt text on a paper-blue fill.

### 2.5 Semantic and opaque

| Token | Hex | Role |
|---|---|---|
| `--color-success-100` | `#69be78` | Status dot ("All systems operational"), pass state |
| `--color-success-200` | `#96f1a7` | Success fill on dark |
| `--color-error-100` | `#e14942` | Error, failed check |
| `--color-opaque-100` | `#f5f5f5cc` | Sticky header scrim |
| `--color-opaque-200` | `#d9d9d94d` | Overlay hairline |
| `--color-opaque-300` | `#9191914d` | Overlay on image |
| `--color-opaque-400` | `#5050504d` | Overlay on dark image |
| `--color-opaque-500` | `#222222cc` | Tooltip / dark scrim |

### 2.6 `[BINDU]` Accent — resolved

```css
--color-brand:       var(--color-cobalt-100);  /* #0047AB */
--color-brand-hover: var(--color-cobalt-200);  /* #1F55C4 */
```

Cobalt, carried over from the previous Bindu site. Two consequences worth
knowing, because they change how the page is built:

1. **It is far more legible than the source accent.** White on `#0047AB` is
   8.4:1, against 3.6:1 for white on `#fb631b`. The primary button now passes
   AA for normal text, so the caveat in §2.7 that applied to the orange button
   no longer applies. This is a real gain, not a cosmetic swap.
2. **It reads cooler and more institutional** against the warm `#f9f8f4`
   canvas. The warm-paper / cool-ink contrast is the intended effect: the
   canvas stays warm precisely so the cobalt has something to push against.
   Do not cool the canvas to match it.

Exactly one accent exists. Do not add a second, and do not promote
`--color-blue-100` to an accent: it is a surface and lacks CTA contrast.

### 2.7 Contrast obligations

- `--color-grey-600` `#858483` on `#f9f8f4` is ~3.5:1. Legal for 13px+ UI text
  at the sizes used here, but **never** for body prose. Body prose is
  `--color-black`.
- **Cobalt `#0047AB` is safe where the source accent was not.** White on
  `#0047AB` is 8.4:1 and `#0047AB` on white is 8.4:1, so it clears AA for
  normal text as a button fill, as an inline link and as a frame. Use
  `--color-cobalt-ink` `#08327A` for inline links on the off-white canvas where
  you want the link to sit slightly below the brand in loudness.
- **Never put cobalt `#0047AB` small text on a dark band**: it is 2.4:1 there.
  On dark, step up to `--color-cobalt-300` `#3D7BFF`, which is 5.2:1 and is the
  value intended for lines, progress and active steps on black.
- Never place `--color-grey-500` text on `--color-grey-100`.

---

## 3. Typography

### 3.1 Families

| Role | Parallel ships | `[BINDU]` we ship | Fallback stack |
|---|---|---|---|
| Sans / display | `gerstnerProgramm` | **Geist Sans** | `ui-sans-serif, system-ui, sans-serif` |
| Mono / UI | `ftSystemMono` | **Geist Mono** | `ui-monospace, SFMono-Regular, Menlo, monospace` |

Both Parallel faces are licensed and cannot be used. Geist Sans/Mono are the
closest open pair: neutral grotesque with a flat, engineered mono companion,
and they are designed as a family so the sans/mono pairing stays coherent.

Acceptable substitutes if Geist is unavailable: **Inter** + **JetBrains Mono**,
or **Instrument Sans** + **IBM Plex Mono**. If budget exists for a closer match
to Gerstner Programm, **ABC Diatype** or **Suisse Int'l** are the commercial
equivalents.

```css
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
--font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
--font-display: var(--font-sans);   /* display IS the sans. No serif anywhere. */
```

Weights in use: **400** and **500** only. No 600, no 700, no light. Headings are
500; everything else is 400.

### 3.2 Scale (desktop, measured)

| Role | Size / line-height | Weight | Tracking | Family | Case |
|---|---|---|---|---|---|
| H1 hero | `36px / 40px` (1.11) | 500 | normal | sans | sentence |
| H2 section | `32px / 36px` (1.125) | 500 | normal | sans | sentence |
| H2/H3 sub | `26px / 32px` (1.23) | 500 | normal | sans | sentence |
| H2 minor | `20px / 28px` (1.4) | 500 | normal | sans | sentence |
| Lead / body-lg | `16px / 24px` (1.5) | 400 | `0.16px` | sans | sentence |
| Body | `16px / 24px` (1.5) | 400 | normal | sans | sentence |
| **UI / chrome** | `13px / 16px` (1.23) | 400 | `0.16px` | **mono** | **UPPERCASE** |
| Chip / tab | `14px / 20px` | 400 | normal | mono | sentence |
| Micro | `12px / 16px` | 400 | normal | mono | UPPERCASE |

Tailwind-equivalent ramp also present: `--text-xs .75rem`, `--text-sm .875rem`,
`--text-base 1rem`, `--text-lg 1.125rem`, `--text-xl 1.25rem`, `--text-2xl 1.5rem`.

Other tokens: `--tracking-normal 0em`, `--tracking-wide .025em`,
`--tracking-wider .05em`, `--leading-tight 1.25`, `--leading-relaxed 1.625`.

### 3.3 Rules

- **H1 is 36px.** It does not scale with the viewport. On mobile it drops to
  28px. It never grows past 36px.
- Headings are sentence case. Never title case, never all-caps.
- The `0.16px` letter-spacing on 13px mono is not optional; it is what stops the
  uppercase chrome from closing up.
- Measure: body prose caps at **`--container-xl` (36rem / 576px)**. Long-form
  reading columns never run the full grid.
- No italics. No underlines except on hover for inline links.
- Inline link colour in body copy: `--color-cobalt-ink` `#08327A`. (The source
  site used `#0d6ea5`; we take the Bindu cobalt instead, for one blue family.)
  Elsewhere links are `--color-black` with a hover to `--color-grey-600`.

---

## 4. Component Stylings

### 4.1 Buttons

All buttons: **34px tall**, `border-radius: 4px`, mono 13px, uppercase,
letter-spacing 0.16px, `padding: 9px 16px 7px`.

> The asymmetric vertical padding (9 top / 7 bottom) is an optical baseline
> correction for uppercase mono. Keep it. Symmetric padding looks wrong.

| Variant | Fill | Text | Border | Use |
|---|---|---|---|---|
| **Primary** | `--color-brand` `#0047AB` | `#ffffff` | `1px solid transparent` | One per viewport. The single main action |
| **Secondary** | `--color-grey-800` `#434343` | `#ffffff` | `1px solid transparent` | Paired with primary |
| **Tertiary** | `#ffffff` | `--color-black` | `1px solid #d6d6d6` | Section-level actions, "API playground" |
| **Ghost** | transparent | `--color-grey-600` | none | Nav links |

States: hover shifts fill one step (`--color-brand-hover` `#1F55C4`; grey-800 →
grey-700). Focus is a 2px outline in the fill colour, offset 2px. No transform,
no scale, no shadow change. Transition `120ms ease-out` on colour only.

The same `:focus-visible` treatment — 2px outline in `--color-brand`, offset
2px — applies to links, inputs, chips and the toggle. Never remove it, and
never replace it with a colour change alone.

Buttons often carry a trailing glyph (`↗`, `⌘`) in the same mono at the same
size, separated by 8px.

### 4.2 Chips, tabs, labels

- Resting: `--color-grey-200` `#eee` fill, `--color-black` text, `4px` radius,
  mono 14px, `padding: 0 8px 2px`, height 24px.
- Active tab: `#ffffff` fill with `1px solid #e5e5e5`.
- Micro label (e.g. `RUN`): `--color-grey-600` fill, `--color-grey-500` text,
  mono 12px uppercase, `padding: 2px 4px`, height 24px.
- Status dot: 6px circle, `--color-success-100`, followed by mono 13px text.

### 4.3 Cards and panels

- Surface `#ffffff` on the off-white canvas, or `--color-grey-100` for inset.
- Border `1px solid --color-grey-300`.
- Radius `--radius-ui: 6px` for UI cards; `--radius-hero: 24px` for the large
  hero/demo panel only.
- Shadow: usually **none**. Where used: `--shadow-card: 0 1px 2px #1818180a,
  0 8px 24px #18181814`.

### 4.4 Inputs

- Height 44px, radius 4px, `1px solid --color-grey-300`, fill `#ffffff`.
- Text: sans 16px, `--color-grey-700`; placeholder `--color-grey-500`.
- Focus: border → `--color-black`. No glow, no ring.
- The newsletter input in the footer is a borderless variant with a bottom
  hairline and a trailing `→` button.

### 4.5 Header

```
sticky · height 74px · background #ffffff · padding 0 48px · no bottom border
```

Left: wordmark, sans 16px, weight 500, `--color-black`.
Centre-right: nav items, **mono 13px uppercase, `--color-grey-600`**, 24px
apart; dropdown parents carry a `⌄`.
Far right: two 34px buttons — tertiary/secondary, then primary.

Dropdown panels are white, `1px solid --color-grey-300`, radius 6px, and their
items are **sans 13px** `--color-black` (note: panel items are sans, top-level
nav is mono — this contrast is deliberate).

Above the header sits an optional **announcement bar**: full width, mono 13px,
centred, link in `--color-cobalt-ink` `#08327A`, with a dismiss `×` at the right.
It is 34px tall on desktop but **must be auto-height below 768px** — the text
wraps to two lines on a phone, and a fixed height clips it and drops the `×`
on top of the link. Reserve 36px of horizontal padding for the `×`.

### 4.6 Footer

Light footer on the page canvas, then a full-bleed dark visual band beneath it.

```
Row 1 — 5 columns on the 12-col grid:
  col 1-3   "GET UPDATES" + email input with → button
  col 4-5   PRODUCTS      (6-8 links)
  col 6-7   SOLUTIONS     (6-8 links)
  col 8-9   RESOURCES     (6-8 links)
  col 10-12 COMPANY  +  LEGAL  (stacked, two groups)

Row 2 — bottom bar, hairline above, 48px tall:
  left   social icon row (16px glyphs, --color-grey-600) · status dot + "ALL SYSTEMS OPERATIONAL"
  right  compliance badge · "<Company> Inc. <year>" · "Cookie preferences"

Row 3 — full-bleed dark band, height --footer-visual-height: 240px,
         background --color-grey-1000, holding a centred toggle pill.
```

Column headers: mono 13px uppercase `--color-grey-600`, 16px below.
Column links: **sans 13px** `--color-black`, 12px apart.
(Same sans/mono split as the header: headers mono, links sans.)

### 4.7 `[BINDU]` The HUMAN / MACHINE toggle

Parallel's signature element: a pill in the dark band toggling the page between
a human view and a machine-readable view (`--machine-container-width: 640px`).

Worth stealing outright. Bindu's whole pitch is *explainable* compliance, and a
machine view is the natural home for the structured version of every page: the
regulation citations, the status of each rule, the price table, as something an
agent or an auditor can parse. It also gives `/llms.txt` a visible front door.

Pill: dark band, mono 13px uppercase white, two options with a radio glyph
(`◉` active / `○` inactive), centred, 8px gap.

---

### 4.8 Tables

§7 forbids icon-badge feature grids and sends you to hairline tables instead,
so the table is a first-class component here, not an afterthought.

- No outer border, no zebra striping, no vertical rules. A single
  `1px solid --color-grey-300` under every row, including the header.
- Header cells: mono 12px uppercase, ls 0.16px, `--color-grey-600`, weight 400.
- Body cells: sans 14px, `--color-black`. Cells holding a number, price, code
  or reference switch to **mono 13px** `--color-grey-700` — figures align and
  read as data.
- Padding `10px 12px`, `vertical-align: baseline`.
- Status inside a cell uses the §4.2 dot + mono pattern, not a coloured pill.
  A "live" row takes `--color-success-100`; an inactive one takes a
  `--color-grey-400` dot with `--color-grey-500` text.

### 4.9 Dark bands

The footer visual, and any band on `--color-grey-1000` or `--color-cobalt-deep`,
inverts as follows. This is the only inversion in the system; there is no dark
mode for the site as a whole.

| Element | On light | On dark |
|---|---|---|
| Primary text | `--color-black` | `#ffffff` |
| Secondary text | `--color-grey-600` | `--color-grey-500` `#adadac` |
| Hairline | `--color-grey-300` | `rgba(255,255,255,.12)` |
| Signal / accent | `--color-cobalt-100` `#0047AB` | `--color-cobalt-300` `#3D7BFF` |

**The accent swap is mandatory, not stylistic.** Cobalt `#0047AB` on `#101010`
is 2.4:1 and is unreadable; `#3D7BFF` is 5.2:1. Never ship the brand cobalt as
text or as a thin line on a dark band.

## 5. Layout Principles

### 5.1 Grid

```css
--max-container-width: 1504px;   /* content */
main { max-width: 1600px; padding: 0 48px; }
section {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-48);          /* 48px desktop */
  padding-inline: var(--space-24);
}
```

12 columns, 48px gutters. Every section is itself the grid — children place
themselves with `col-start-*` / `col-span-*`. There is no inner wrapper div.

### 5.2 Spacing scale

Tokens are **named for their desktop pixel value** and collapse on mobile. This
is the whole responsive system; there are almost no other breakpoint rules.

| Token | Mobile (base) | Desktop (≥ `--breakpoint-xl` 80rem) |
|---|---|---|
| `--space-0` | 0 | 0 |
| `--space-2` | 2px | 2px |
| `--space-4` | 4px | 4px |
| `--space-8` | 8px | 8px |
| `--space-12` | 12px | 12px |
| `--space-16` | 16px | 16px |
| `--space-24` | 16px | **24px** |
| `--space-32` | 24px | **32px** |
| `--space-40` | 24px | **40px** |
| `--space-48` | 24px | **48px** |
| `--space-80` | 40px | **80px** |
| `--space-120` | 40px | **120px** |
| `--space-160` | 80px | **160px** |

Section vertical rhythm: `padding: var(--space-80) 0` as standard,
`var(--space-160)` at a major transition, `0` where two bands butt together
deliberately.

### 5.3 Row anatomy — the repeating pattern

The page is a stack of rows that nearly all share one shape:

```
┌──────────────────────┬─│────────────────────────────────────────────┐
│ cols 1-3             │ │ cols 4-12                                  │
│                      │ │                                            │
│ H2  26-32px/500      │ │  demo panel: tinted surface (sand-500 or   │
│ body 16px grey-700   │ │  grey-100), radius 24px, holding a white   │
│ (max 36rem)          │ │  card with the product doing one real      │
│                      │ │  thing — a query, a result, a diff         │
│ [TERTIARY BUTTON]    │ │                                            │
└──────────────────────┴─│────────────────────────────────────────────┘
                         ↑ 1px hairline --color-grey-300, full height
```

Variants: mirror it (panel left, text right) on alternating rows; or go full
width (cols 1-12) for the hero and for the logo wall. Never centre a text
column — text is always left-aligned in its rail.

The vertical hairline between rail and panel is a signature. Keep it.

### 5.4 Other containers

`--container-sm 24rem` · `--container-md 28rem` · `--container-xl 36rem`
(prose measure) · `--container-5xl 64rem` · `--machine-container-width 640px`.

---

## 6. Depth & Elevation

Four levels, and the first three are the ones you will actually use.

| Level | Treatment | Use |
|---|---|---|
| 0 — canvas | `--color-off-white` `#f9f8f4`, no border | Page |
| 1 — delineated | `1px solid --color-grey-300`, no shadow | Cards, panels, inputs, table cells |
| 2 — tinted | `--color-grey-100` or `--color-sand-500` fill, no border | Demo panel backgrounds, insets |
| 3 — lifted | `--shadow-card: 0 1px 2px #1818180a, 0 8px 24px #18181814` | Dropdown, popover, modal only |

Additional measured shadows, for UI controls that must read as physical:

```css
--shadow-ui:    0 1.5px .75px #00000008, 0 3px .5px #00000005, 0 5px .5px #00000003;
--shadow-ui-sm: 0 2px 4px #00000014, 1px 2px 2px #00000005, 2px 5px 2px #00000003;
```

Radii: `--radius-xs 2px` · `--radius-sm 4px` · `--radius-md 8px` ·
`--radius-lg 16px` · `--radius-control 4px` · `--radius-ui 6px` ·
`--radius-hero 24px`.

### 6.1 Motion

Motion is as rationed as colour. The page should be fully legible as a static
document; animation only confirms an interaction that already happened.

- Controls: `120ms ease-out`, **colour properties only** (background, border,
  text). Never `transform`, never `scale`, never a shadow change on hover.
- Panels, dropdowns, disclosure: `200ms ease-out` on opacity and a ≤8px
  translate. Nothing longer than 200ms.
- Never animate layout (width, height, grid position); animate opacity and
  transform instead so nothing reflows.
- Scroll-linked animation is allowed for illustrations only, never for text
  or for anything a reader needs in order to act.
- Under `prefers-reduced-motion: reduce`, all of the above become instant and
  every scroll-linked element renders in its final state.

**Separation is done with hairlines, not shadows.** If you reach for a shadow to
separate two things on the same plane, use a `1px solid --color-grey-300`
instead.

---

## 7. Do's and Don'ts

**Do**

- Keep H1 at 36px. Let the layout, not the type size, carry the hero.
- Put every label, button, nav item, eyebrow and chip in uppercase mono 13px
  with 0.16px tracking.
- Use the warm `#f9f8f4` canvas. It is what makes the near-black feel like ink.
- Separate with 1px hairlines.
- Spend the accent once per viewport.
- Show the product doing one concrete, real thing in each row's panel.
- Left-align text rails; cap prose at 36rem.
- Use `--space-*` tokens only. No arbitrary margins.

**Don't**

- No gradient hero, no mesh, no glow, no glassmorphism, no blur backdrop.
- No display type above 36px. No viewport-clamped headings.
- No font weight above 500, and none below 400.
- No pure `#000` or pure `#fff` page backgrounds.
- No title case, no all-caps sans (uppercase belongs to mono only).
- No border-radius above 8px except the 24px hero/demo panel.
- No drop shadows for separation.
- No second accent colour. Cobalt is the accent; the dusty `--color-blue-*`
  family and sand are surfaces, and neither is ever used for a CTA, a link or
  an active state.
- No icon-heavy feature grids with circular icon badges. This system uses
  product screenshots and hairline tables instead.
- No stock photography, no 3D renders, no emoji.
- `[BINDU]` No invented numbers, no uncited regulation facts, no em dashes in
  marketing copy, and none of the AI-smell vocabulary ("seamless", "elevate",
  "unleash", "next-gen", "revolutionise").

---

## 8. Responsive Behaviour

One real breakpoint: `--breakpoint-xl: 80rem` (1280px). Almost all adaptation
happens through the spacing-token collapse in §5.2.

| | Mobile `< 768px` | Tablet `768–1279px` | Desktop `≥ 1280px` |
|---|---|---|---|
| Grid | 4 cols | 8 cols | 12 cols |
| Page padding | 16px | 24px | 48px |
| Section rhythm | 40px | 40px | 80px (160px major) |
| Gutter | 16px | 24px | 48px |
| H1 | 28px | 32px | 36px |
| H2 | 24px | 26px | 32px |
| Row anatomy | rail stacks **above** panel; the vertical hairline becomes a horizontal one above the panel | side by side, but the grid drops to **8 columns** and the rail takes cols 1-3 of 8 (~37%) | rail cols 1-3 of 12, panel cols 4-12 |
| Header | wordmark + hamburger; nav in a full-screen white sheet, items mono 16px | as desktop, tighter | full nav |
| Footer | columns stack to a single column, headers stay mono uppercase | 2 columns | 5 columns |

Touch targets: minimum 44×44px. The 34px button grows to 44px below 768px by
adding vertical padding, not by changing font size.

> **The tablet range is where this layout breaks if you ignore it.** A 3-of-12
> rail is about 220px at 1024px wide, which wraps a 36px H1 onto three lines
> and the body copy into a five-line ribbon. Dropping to an 8-column grid
> between 768px and 1279px is not cosmetic; it is what keeps the rail readable.
> Check every new row at 1024px, not just at 1440px and 375px.

Respect `prefers-reduced-motion`: disable all transitions and any scroll-linked
animation; the page must be fully legible and complete with motion off.

---

## 9. Agent Prompt Guide

### 9.1 Paste-ready token block

```css
:root {
  /* canvas + ink */
  --color-white:#fff; --color-off-white:#f9f8f4;
  --color-black:#181818; --color-grey:#d6d6d5;

  /* grey ramp */
  --color-grey-100:#f6f6f6; --color-grey-200:#eee;  --color-grey-300:#e5e5e5;
  --color-grey-400:#d6d6d6; --color-grey-500:#adadac; --color-grey-600:#858483;
  --color-grey-700:#5c5b59; --color-grey-800:#434343; --color-grey-900:#181818;
  --color-grey-1000:#101010;

  /* accent — cobalt */
  --color-cobalt-100:#0047AB; --color-cobalt-200:#1F55C4; --color-cobalt-300:#3D7BFF;
  --color-cobalt-400:#9DBBFF; --color-cobalt-500:#E3E8F3;
  --color-cobalt-ink:#08327A; --color-cobalt-deep:#0A1A3D;
  --color-brand:var(--color-cobalt-100);
  --color-brand-hover:var(--color-cobalt-200);

  /* surfaces */
  --color-blue-100:#8fb6cc; --color-blue-200:#a5c5d6; --color-blue-300:#bcd3e0;
  --color-blue-400:#d2e2eb; --color-blue-500:#e9f0f5;
  --color-sand-100:#ccc7ba; --color-sand-200:#d6d2c8; --color-sand-300:#e0ddd6;
  --color-sand-400:#ebe9e3; --color-sand-500:#f5f4f1;

  /* semantic */
  --color-success-100:#69be78; --color-success-200:#96f1a7; --color-error-100:#e14942;
  --color-stroke-primary:var(--color-grey-400);
  --color-link:var(--color-cobalt-ink);

  /* type */
  --font-sans:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif;
  --font-mono:var(--font-geist-mono),ui-monospace,SFMono-Regular,Menlo,monospace;

  /* shape */
  --radius-xs:2px; --radius-sm:4px; --radius-md:8px; --radius-lg:16px;
  --radius-control:4px; --radius-ui:6px; --radius-hero:24px;

  /* depth */
  --shadow-card:0 1px 2px #1818180a,0 8px 24px #18181814;
  --shadow-ui:0 1.5px .75px #00000008,0 3px .5px #00000005,0 5px .5px #00000003;

  /* layout */
  --max-container-width:1504px; --machine-container-width:640px;
  --footer-visual-height:240px; --breakpoint-xl:80rem;
  --container-xl:36rem;

  /* space — mobile base */
  --space-0:0; --space-2:.125rem; --space-4:.25rem; --space-8:.5rem;
  --space-12:.75rem; --space-16:1rem; --space-24:1rem; --space-32:1.5rem;
  --space-40:1.5rem; --space-48:1.5rem; --space-80:2.5rem; --space-120:2.5rem;
  --space-160:5rem;
}

@media (min-width:80rem){
  :root{
    --space-24:1.5rem; --space-32:2rem;  --space-40:2.5rem; --space-48:3rem;
    --space-80:5rem;   --space-120:7.5rem; --space-160:10rem;
  }
}

body{ background:var(--color-off-white); color:var(--color-black);
      font-family:var(--font-sans); font-size:16px; line-height:1.5; }
```

### 9.2 Quick reference

```
canvas   #f9f8f4      ink      #181818      accent  #0047AB (cobalt)
hairline #e5e5e5      muted    #858483      panel   #f5f4f1
H1 36/500   H2 32/500   sub 26/500   body 16/400
chrome = MONO 13 UPPERCASE ls .16px
button = 34px tall, r4, pad 9/16/7
grid   = 12 col, 48px gutter, 1600 max, 48 pad
section= 80px rhythm, 160px major
```

### 9.3 Prompts

**New section:**
> Build a section on the 12-column grid, `gap: var(--space-48)`, `padding:
> var(--space-80) 0`. Text rail in cols 1-3: H2 at 32px weight 500 sentence
> case, body 16px `--color-grey-700` capped at 36rem, then one tertiary button
> (34px, r4, mono 13 uppercase, 1px `#d6d6d6` border). Vertical 1px `#e5e5e5`
> hairline, then cols 4-12 holding a `--color-sand-500` panel at radius 24px
> with a white card showing the product doing one real thing. No shadows, no
> gradients, no icons.

**Header:**
> Sticky header, 74px, `#ffffff`, `padding: 0 48px`, no bottom border. Wordmark
> sans 16px/500 left. Nav mono 13px uppercase `#858483` ls .16px. Right: one
> tertiary and one primary button, both 34px tall, r4, mono 13 uppercase,
> `padding: 9px 16px 7px`; primary fill `#0047AB` white text.

**Footer:**
> Footer on the page canvas, 12-col grid. Cols 1-3 "GET UPDATES" mono 13
> uppercase `#858483` plus a borderless email input with a bottom hairline and
> a trailing → button. Then four link columns: headers mono 13 uppercase
> `#858483`, links sans 13px `#181818` 12px apart. Bottom bar above a 1px
> `#e5e5e5` hairline: social glyphs and a `#69be78` status dot on the left,
> compliance badge, copyright and cookie link on the right. Beneath it a
> full-bleed `#101010` band 240px tall with a centred mono 13 uppercase
> HUMAN / MACHINE toggle in white.

**Self-check before shipping any page:**
> 1. Is every button, label and nav item uppercase mono 13px at ls .16px?
> 2. Is the H1 exactly 36px (28px mobile) and nothing larger anywhere?
> 3. Is the canvas `#f9f8f4`, not white and not grey?
> 4. Does the accent appear at most once per viewport?
> 5. Is every separation a 1px hairline rather than a shadow?
> 6. Are all font weights 400 or 500?
> 7. Does every spacing value come from a `--space-*` token?
> 8. Is prose capped at 36rem and left-aligned?

---

## 10. `[BINDU]` Open decisions

1. ~~**Accent**~~ — resolved: cobalt `#0047AB` (§2.6).
2. **Wordmark** — Bindu needs its own. *Bindu* means "dot"; the previous site
   built on "every proof is a dot". A dot-based mark sits naturally in a Swiss
   grid system and in the hairline/bracket motif.
3. **Machine view** — adopt the HUMAN/MACHINE toggle (§4.7) or ship `/llms.txt`
   alone.
4. **Fonts** — confirm Geist Sans/Mono, or budget for ABC Diatype / Suisse Int'l
   for a closer match to Gerstner Programm.
