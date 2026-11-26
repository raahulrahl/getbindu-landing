Round 44 on the homepage (`/`, `features/landing/home/`). Follow CLAUDE.md and docs/home/project-context.md. Only change what's listed.
Do NOT touch: nav, intro, hero, statement, pricing, the shipment map's existing routes and motion, FAQ, finale.

New order in `home-page.tsx`: Hero, Statement, Story (new, replaces `#pains`), Full Circle, Shipment map, Departures board,
Testimonials (new), Regulations (new), Pricing, FAQ, Finale. Ask is removed. New sections hydrate late like the others
(`late(...)` in home-page.tsx, the ready registry) and get a band in `lib/bands.ts` so no two neighbours share one.

## 1. Story: what Bindu does (`#story`, replaces `#pains` "Sound familiar?")
- Delete the `#pains` section and its CSS. One heading (<= 8 words), e.g. "From one sentence to a filed record." / "What Bindu does with a shipment." / "One shipment, four steps."
- One horizontal row of four stops joined by a cobalt line: 1 Describe the shipment (a plain sentence, e.g. "40 bags of coffee from Huila to Rotterdam"),
  2 Rules and HS code (rule chips + a code in mono), 3 Proof from suppliers (an email and a WhatsApp doc arrive), 4 Filing and reference (a reference number in mono).
- A yellow Bindu dot travels the line, scrubbed to scroll (not pinned), and each stop draws its single-line ink drawing (`--line-ink`) and one caption line as the dot arrives. Reverses on scroll up.
- Illustration chip; not EUDR-specific (use generic rule names, status labels exactly as in the brief).
- Phones: the row becomes a vertical chain. Reduced motion: the finished row.

## 2. Full Circle: titles change per act (Theatre.tsx, content.ts)
- "Full Circle." stays only as a small sans label above the heading. The h2 and lead become per act, a buyer question each, written from that act's beats, e.g. The Fabric: "Where did the cotton come from?"; The Bean: "Can this coffee prove its farm?"; The Circle: write one in the same voice.
- On tab change the old title lines mask out and the new ones mask in (same line-mask reveal as `lib/headings.ts`, ~0.5s); lead crossfades. Keep `aria-labelledby` pointing at the h2. Reduced motion: instant swap.

## 3. Ask, folded into the shipment map (`#shipment`)
- Remove `#ask` (Ask.tsx, ask.css, its content, its band, its blur selector, any nav or guide anchor to it).
- In the shipment map, at the proof milestone of each tab, one small question bubble appears (e.g. "Which supplier hasn't sent the plot coordinates?") and one answer line under it, scrubbed with the existing milestone, labelled Illustration. One question per tab, short, in the map's existing caption style. Nothing else in the map changes.

## 4. Departures board (`#examples`): smaller and readable
- It overflows the viewport. Fit the whole board (head + rows + story) inside one window at 1440x900 and 1920x1080: smaller flap type, tighter rows, a max width on the board, the story text at body size with comfortable line length.
- Keep the pinned one-row-per-step behaviour, colours and data. Phones keep their five-rows-at-a-time rule; check nothing clips at 375.

## 5. Testimonials (`#voices`, new, above Regulations)
- Reference: https://www.awwwards.com/inspiration/testimonials-vibe3d (study it). Very dynamic, but in our theme: large quote cards on a curved 3D track (CSS 3D transforms via GSAP, transforms and opacity only), driven by scroll and by drag, with momentum and snap. The front card is full ink at display-sm size; cards behind recede in depth and dim. Name, role, company, country under each quote; a yellow dot for the active index.
- Content: PLACEHOLDER quotes for now (5, varied buyers: importer, co-op, customs broker, trader, brand), stored in one clearly named array `TESTIMONIALS_PLACEHOLDER` in content.ts, and the section shows a visible "Placeholder" chip until real quotes replace them. Add a go-live item to `docs/home/usage-audit.md`: replace with Raahul-approved real quotes and remove the chip. No logos, no avatars, no star ratings, no numbers.
- Keyboard: arrow keys move cards; quotes readable as text for screen readers. Reduced motion: a plain vertical list. Phones: one card at a time, swipe.

## 6. Regulations (`#rules`, new, above Pricing)
- Reference: https://www.framer.com/marketplace/components/velocity-carousel/ but more minimal. A draggable carousel with weighted momentum, a slight tilt under velocity and snap on release; wheel/trackpad sideways, arrow buttons, keyboard; vertical page scroll never blocked.
- One tile per rule: EUDR, CBAM, Product passports (DPP), REACH, PPWR. Each tile is typographic, no icons: the name, what it means in one plain sentence, the goods it covers, a Live or In build chip (exactly as the brief), and "Read the rule" linking to the matching `NAV_REGULATIONS` page. Dates only where the brief has them, cited to the public source; no prices (pricing is right below).
- Tiles: panel token, 1px hairline, `--r-lg`; active tile full contrast, neighbours peek. Tap opens the link, a swipe drags. Reduced motion: no momentum, plain snap.

## Report
One line per item in docs/home/DECISIONS.md (round 44), judgement calls, screenshots of changed sections in both themes at 1440 and 375.
No console errors (late sections must not hydrate-mismatch). `pnpm typecheck` clean. Note rough frame time on the new sections.
