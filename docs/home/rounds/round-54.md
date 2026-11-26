Round 54 on the homepage (`/`, `features/landing/home/`): build DESIGN.md v3 (Sublime). Follow CLAUDE.md, docs/home/project-context.md and docs/home/DESIGN.md v3. Colour token values, fonts, copy, content, section order and section motion ideas stay. Round 53 is cancelled.

## 1. Tokens and foundation (DESIGN.md v3 section 3)
- tokens.css: v3 type scale (hero clamp 46 to 120, section display clamp 40 to 88, weight 500, lead 22 to 28 mute, body 18/17), tracking, radii `--r-xs` 5 / `--r-sm` 10 / `--r-md` 15 / `--r-lg` 20 / `--r-xl` 25 / `--r-2xl` 30 / `--r-4xl` 40, the soft floating shadow (light and dark). Remap old radius tokens to these.
- Retire the band crossfade (`lib/bands.ts`, `bands.css`): one `--canvas` everywhere. No section rules or dividers.
- Section rhythm: centred column heads, `min-height: 80svh`, padding 56 (phones) / 128 (from 1024px), gaps per v3.

## 2. Components (v3 section 4)
- Buttons `btn-primary` / `btn-secondary` / `btn-ghost`: 36px (44 phones), 5px, Inter 500 14px, no border, colour-only hover, no movement.
- One panel: `--canvas-mid` fill, no border, no shadow, 20px (40px full-width from 1024px). Chips, tabs (row of secondary buttons, active ink fill), links (colour only), footer card.
- Nav: keep the floating bar and collapse; restyle per v3 Nav (fill 88% + existing blur, 10px, no border, soft shadow, secondary-fill active pill, yellow dot kept). Book a demo in the expanded bar only.

## 3. Motion (v3 section 5)
- Replace SplitText line masks, the hero word-by-word entrance and Full Circle's masked title swap with the 30px fade-up (GSAP, once on entry, 0.7s, 0.08s stagger). The yellow full stop stays.
- Testimonials: flatten the curved 3D track to a straight sideways row of panel cards moved by the scroll; keep the word light-up and the route dot; phones and reduced motion: a list.
- Text links: colour only.

## 4. Sections (v3 step 4)
- Hero centred; statement centred; Story and Full Circle: head centred above one panel, captions inside the panel on the left; shipment: head and tabs centred, question bubble a panel card with the soft shadow; departures board, testimonials, pricing: centred heads, panels; rules: finish the uncommitted `Rules.tsx` (pinned sideways tile scroll, r52-3) and style its tiles as v3 panels; FAQ: centred head over a centred list (max 768px) in one panel; footer: Sublime's centred card (max 780px, 40px from 1024px), still riding up over the finale.

## Report
One line per item, judgement calls, screenshots of every section in both themes at 1440 and 375 (screenshots/r54/), what was not verified.
