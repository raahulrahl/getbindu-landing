Round 17 on /v3: "one story" revamp. Austin approved a restructure for this round, so the usual "never redesign" rule is lifted for the items listed here only. Everything else in CLAUDE.md and docs/home/project-context.md still applies (honesty, CTA, tokens only, both themes identical layout, reduced motion, 375/768/1440/1920).

Goal: the page reads as one story, guided by one hand-drawn ink dot, and stops looking AI-generated. Main inspiration is rothfinder.com (look only; do not copy its code, drawings, copy or layout one-to-one). Design reference: Notion's DESIGN.md (warm paper canvas, hairline cards, restraint).

## Setup
- Work on a new branch `v3-story` from master. One commit per numbered item: "v3 r17 N: ...". Stage only files you changed (never the deleted .claude/skills or root files in the working tree).
- Dev server for this branch: `npx vite --port 3010 --strictPort` in v3 (don't touch the 5175 server).
- No new npm dependencies. GSAP is already installed, and its MotionPathPlugin and DrawSVGPlugin are free under the GSAP standard licence. Everything else is our own SVG/TS.

## Phase A: foundation

### 1. Design reference
- Download https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/notion/DESIGN.md to docs/references/notion-DESIGN.md. Add it to docs/home/LICENSES.md (VoltAgent awesome-design-md, MIT; reference only).
- From it, apply to our tokens (both themes; keep our colours, no #000/#fff):
  - Display headings: Inter 600, tight negative tracking (about -0.03em at display sizes), sentence case. Body: 400, 1.5.
  - Cards: level 0 by default (1px hairline, no shadow), 12px radius. Large containers 16px. Pills only for CTAs.
  - One accent for links and focus: cobalt. Yellow is reserved for the primary CTA and the dots/shipments (our "sticker" colour).
  - Whitespace separates sections more than rules or boxes do.
  - One "night band" per page: a full-bleed deep navy band (used for the shipment journey, item 9). In dark theme it's a slightly raised navy so it still reads as a band.
- Add an ink token: --ink (navy #14213D-ish on light, warm off-white on dark) for hand-drawn lines.

### 2. De-AI pass (site-wide)
Remove:
- the pricing border beam
- the button sheen and the label wipe (keep the dot-to-arrow on the primary pill: it's our motif)
- glows
- dot-grid / dot-pattern panel backgrounds
- 01 / 02 / 03 numbering
- most mono-caps eyebrows and chips
Mono stays only for numbers, reference numbers, prices and labels inside illustrations. Headings in sentence case. Log what was removed in DECISIONS.md.

## Phase B: the guide

### 3. The ink dot guide (core of the round)
- One SVG layer spanning the full document height, pointer-events none, behind text.
- **The dot:** a hand-drawn scribble. Several loose, slightly noisy loops drawn procedurally with a seeded random, so it looks pencil-drawn. 1px stroke in --ink, about 70–90px wide on desktop and 40px on phones.
  - It starts with 3 loops and gains 3 more loops at each section it passes ("every proof is a dot"), up to about 24.
- **The line:** the dot trails one thin ink line (1px, slight hand wobble from small noise on the path).
  - It's drawn behind the dot as you scroll (stroke-dashoffset or DrawSVG, ScrollTrigger scrub).
  - The path goes through anchor points that each section declares (data-guide-anchor) and is built as a smooth curve.
  - It runs through margins and gutters and never crosses text or buttons. Rebuild it on resize.
  - On phones it runs down a narrow side gutter with small loops.
- **Proof dots:** at each section anchor the dot leaves behind a small solid yellow dot (6–8px). That's our own touch: every section adds one proof.
- **Reduced motion:** the whole line and all proof dots are shown drawn, and the dot sits in its final place. Nothing scrubs. The site pause control also freezes the guide.
- **Performance:** one path, length measured once per resize, transforms only, 60fps. Fully hidden from screen readers (aria-hidden).

## Phase C: the story (new homepage order)
Each section below declares a guide anchor.

### 4. Intro: shorter
- Keep it to about 3s or less: dots → sunflower → "Every proof is a dot." → the dots collapse into ONE ink dot, and that dot becomes the guide's start position in the hero.
- Return visits skip it, as now. Drop the world-map scatter step if needed to stay short.

### 5. Hero
- The headline reveals word by word (keep the current copy). Under reduced motion it's shown at once.
- Keep the sub-line and "Book a 15-minute demo".
- The map stays but is quieter: fewer dots, lower opacity, so the type and the guide lead.
- New small selector under the CTA ("See what applies:" Coffee · Textiles · Batteries). It updates a small hairline card, labelled "Illustration":
  - Coffee → EUDR (Live)
  - Textiles → Textile passports (Live)
  - Batteries → Battery passports (In build, grey dashed, "coming")
  - Use only the statuses in the brief.

### 6. Statement
- One big centred sentence (display size) with an inline Bindu chip (the logo in a small outlined pill inside the sentence). Pick one, log it:
  - "[Bindu] turns one sentence about your shipment into the proof customs asks for."
  - "Describe a shipment once. [Bindu] works out the rules, gathers the proof and prepares the filing."
- No other content in this section. The guide dot arrives above it.

### 7. Before → after (replaces "Sound familiar?")
- Three hairline cards in a row (stacked on phones).
- Each card shows the "before" (the pain, short), then flips or drops once to the "after" (Bindu's answer) when it scrolls into view. Base it on the existing pains and answers, shortened, e.g. "Suppliers won't reply" → "Bindu asks them for you".
- No numbers, no icons. Under reduced motion both states show, stacked.

### 8. How it works (merges "How it works" and "Four documents become one record")
- Pinned section. Left: Describe · Prove · File as a vertical list; the active step is full contrast and the others are muted. Right: one card per step that slides in as you scroll. Each card has a single-line ink drawing that draws itself:
  - Describe: a speech bubble with one typed sentence about a shipment (Illustration)
  - Prove: four documents (invoice, supplier declaration, data sheet, certificate of origin) folding into one record. This replaces the old Four documents section.
  - File: a stamp and a reference number (Illustration). Generic, not EUDR.
- Remove the standalone Four documents section.
- Titles stay visible while pinned.

### 9. One shipment from origin to customs, inside the night band
- The section sits in the full-bleed navy band. The guide dot enters the band, shrinks onto the route start and becomes the cargo, then re-emerges below the band.
- Keep the tabs (minimalist style), routes, stories and milestones.

### 10. Pricing
- Keep the r15 layout but quiet: no border beam, hairline card, numbers in mono. The guide passes beside the price.

### 11. Remove "Who Bindu is for" from the homepage
- Move its role links into the footer as a "For importers · exporters · brokers · ..." text row, linking where they link now. No content is deleted from sub-pages.

### 12. FAQ
- Keep it as is, with a guide anchor.

### 13. Finale
- A huge wordmark "bındu" in Inter 600–700, lowercase, using the dotless ı (U+0131).
- The guide dot lands exactly where the dot of the i belongs, shrinks to the right size and turns solid yellow. The story ends.
- Below it: "Book a 15-minute demo" and the footer.
- Reduced motion: the dot is already in place.

## Phase D: wrap-up

### 14. Check and log
- npm run build passes.
- 375 / 768 / 1440 / 1920, both themes: no horizontal scroll, the guide never covers text, pinned titles stay visible, reduced motion works, no console errors, demo links go to cal.com.
- Log judgement calls in DECISIONS.md and update LICENSES.md.
- List the lines in docs/home/project-context.md that are now out of date (don't edit the brief).

## Must NOT change
Facts, prices, statuses, the CTA wording, sub-pages (except footer links), the theme toggle, the cal.com config.

## Report
Short: one line per item, judgement calls, the dev-server URL (3010) and the branch name. No screenshots, no recordings.
