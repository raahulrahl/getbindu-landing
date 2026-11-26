# Slop audit (round 8)

Checked at 375 and 1440 with headless Chrome: homepage, /eudr, /cbam, /cbam/software, /reach, /ppwr, /dpp/battery, /dpp/textiles, /dpp/others, /blog, /about, /security. No horizontal scroll at 375 on any page; no console errors. Tools: `bindu-design`, `critique` and `audit` (impeccable d41d986, adapted), `polish`, `frontend-design`.

## UI

Before -> after, one line each.

- "Built for your role": four identical bordered cards with 01-04 numbers and outline pill buttons -> ruled list, title / one line / text link, no numbers, no card chrome.
- "Sound familiar?": 01-05 numbers on a list that is not a sequence -> numbers removed; the cobalt hairline, word reveal and dot stay (round 7 motion).
- Module strip: a 01-06 number on each card repeating the 01 / 06 counter -> per-card number removed; counter kept.
- Text links ("Book a 30-minute demo", "Book a demo" in the nav, Pricing) ended in a "→" glyph -> RESTORED at the human's earlier request (round 7 item 1; round 6 pricing spec). The arrow is back, with its 2px hover nudge.
- Buttons "Check if EUDR applies" and "Learn more" used `btn-arrow` (a CSS "→") -> arrow removed; plain pill or text link.
- Hover on cards: lift and cobalt glow on the module strip card -> RESTORED at the human's earlier request (round 7 item 3). Role cards keep no lift and no glow (they are a ruled list now). Reduced motion gets the cobalt border and glow only, no lift.
- Text-link arrow nudge on hover (`cta-text:hover span`, 2px) -> RESTORED with the arrow. The `btn-arrow` nudge stays removed (the pill arrows stay gone).
- Piece icons in the "Prove" board ("WA", "@", "PDF") sat in 28px rounded boxes with a border -> plain mono label, no box.
- Dead CSS left behind by the above (`.pn-n`, `.mod-n`, `.btn-arrow`, role card lift and glow rules) -> deleted. The module card hover rules were restored (see above).

## Kept on purpose

- Mono uppercase eyebrows above headings: part of the bindu-design system (`docs/home/DESIGN.md`); a brand rule overrides the generic "no eyebrow" advice.
- Status chips (Live, In build), and the "Illustration" chips: honesty labels with a job. (The mockup's "Mockup · not the live site" badge is not part of the port.)
- Numbered steps in "Describe. Prove. File." and the shipment milestones: these are sequences, so the numbers are earned.
- Button lift and press states on `.btn`: the round 4-7 hover system the human approved.
- Section order, Sound familiar? rows and motion, minimal pricing, intro, shipment map, paperwork scroll: round 4-7 decisions; no clear tell in them beyond the items above.
- Cobalt glow on the app frames: bindu-design allows it as the system's one glow.

## Not changed (noted for later rounds)

- Sub-page template repeats the same hero -> alternating section rhythm on every sub-page. It is one template by design; the sections already vary (steps, rows, links). Changing it touches content layout across 10 pages, so left for a later round.
- Footer column headings use the eyebrow style. Same reasoning as the eyebrows above.

## Text

Copy only. Each line lists file, old text, new text. Strings not listed were checked and kept.

| # | File | Old | New |
|---|------|-----|-----|
| 1 | `features/landing/home/content.ts` (check) | "Does EUDR apply to you?" | "Simplified EUDR check" (question used as a heading) |
| 2 | `features/landing/home/content.ts` (how.title) | "Describe. Prove. File." | "Describe the shipment. Bindu gathers the proof." (triplet for rhythm) |
| 3 | `features/landing/home/content.ts` (modules.eyebrow) | "One workspace, every EU rule" | "One workspace for several EU rules" (overclaim: other rules are in build) |
| 4 | `features/landing/home/content.ts` (finale.sub) | "Thirty minutes, on your own goods. We'll show you the proof coming together." | "Thirty minutes, on your own goods. We'll show you how the proof for them gets gathered." |
| 5 | `features/landing/home/content.ts` (footer.line) | "Describe your shipment once. Bindu finds the rules that apply, gathers the proof and files it." | "Describe your shipment once. Bindu finds the rules that apply and files the statement." (triplet) |
| 6 | `features/landing/home/content.ts` (faq, supplier item answer) | "Bindu asks them in the way they already work, by WhatsApp or email, without a login, and shows you exactly what's still missing. A statement can only be filed once the proof is complete." | "Bindu asks them on WhatsApp or by email, with no login, and shows you what is still missing. A statement can only be filed once the proof is complete." |
| 7 | mockup sub-page data (not ported) (PPWR "Six steps" body) | "Your role is a fifth axis, and it is answered again in every country you sell into." | "Your role is a fifth factor, and it is answered again in every country you sell into." (jargon) |
| 8 | mockup sub-page data (not ported) (textile h3) | "Built to survive washing and recycling" | "Washing and recycling are the hard cases" (mannered heading) |
| 9 | mockup sub-page data (not ported) (security "The layer underneath") | "The rails we're building on are Eclipse Tractus-X, the same open-source components the German auto industry runs its supply-chain data on." | "We build on Eclipse Tractus-X, the open-source components the German auto industry uses for its supply-chain data." (metaphor) |
| 10 | mockup sub-page data (not ported) (security "Settled" note) | "Your systems and your partners' settle routine paperwork between themselves." | "Your systems and your partners' systems settle routine paperwork between themselves." (grammar: missing subject) |
| 11 | mockup sub-page data (not ported) (security h1) | "Security, and what your IT team needs to know." | "What your IT team needs to know." (9 words to 7; the eyebrow already says "For your IT team") |
| 12 | mockup sub-page data (not ported) (CBAM software h3) | "Who it is for" | "No emissions expertise needed" (announcing heading) |

## Flagged, not changed (for Raahul or the user)

- **Modules item "Textile passports", description:** "The textile passport is live." The textile page says the passport is expected around 2028. Live refers to the collection engine. Wording question (same as r7-5.4).
- **Hero and sub-line, pains answers, pricing, CTA labels, "Sound familiar?", intro lines:** protected by the brief. Not changed. No sloppy wording found in them that needs a suggestion.
