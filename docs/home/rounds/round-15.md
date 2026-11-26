Round 15 on /v3. Small, incremental changes only. Follow CLAUDE.md and docs/home/project-context.md. Only change what's listed.

Do the items in order, one commit per item ("v3 r15 N: ..."). Stage only the files you changed (the working tree has unrelated deleted .claude/skills files; don't stage or restore them). Likely files are listed per item; read only those plus tokens.css / components.css.

## 1. Light theme: palette (site-wide, tokens only)
Files: features/landing/home/styles/tokens.css (light block only)
- Warm ivory (chosen by Austin): page background #F5F1E8, cards and panels #FBF8F1, navy text #14213D, links and active states cobalt #0A3A8C, yellow #FFD400 with a #B38F00 outline on light. No #fff.
- Calm feel, Difault as the reference (webflow.com/templates/html/difault-website-template, look only). Must not drift into the rejected earthy theme: keep the ivory low-saturation, with no browns or terracotta.
- Check text and button contrast at WCAG AA on the new base.
- Dark theme, layout and copy: unchanged.

## 2. Light theme: yellow shipment dots and routes (map in hero and journey)
Files: tokens.css, MapLayer.tsx / lib/particles.ts / hero/scene.ts (whichever reads the shipment colour)
- In light only: deeper gold fill (#E0B000) with a 1.5px outline (#8A6A00) so the dots don't look flat on the ivory.
- Cobalt map dots: palette change only (from item 1).

## 3. How it works (Describe the shipment): fit and alignment
Files: HowItWorks.tsx, site.css (how-* rules)
- Reduce the heading size until it sits fully inside its box at 1440 and 1920. At 375 and 768 it wraps inside the box, no overflow.
- Left column: heading, then the three step labels Describe · Prove · Find. Heading and all three labels share one left edge (the box's inner padding), equal spacing between them.
- Right illustration: unchanged.
- The whole section fits one viewport at 1440x900.

## 4. Four documents become one record
Files: Paperwork.tsx, paperwork.css
- More futuristic: illustration panel on a deep navy surface token in both themes, a faint dot-pattern background, the one record in yellow.
- Connectors: replace the plain lines with "animated beams" (idea from Magic UI's Animated Beam, MIT, rebuilt in our own SVG + GSAP; no new dependencies). It's a thin cobalt path from each document to the record, with a short bright-cobalt pulse travelling along it, tied to the existing scroll progress. Under reduced motion: static cobalt lines.
- Fill the gap under the title: list the four input documents (Invoice · Supplier declaration · Data sheet · Certificate of origin) as compact mono rows with a small dot each, then "→ one compliance record → reference number". Label the block "Illustration". No new copy beyond these labels.
- Must NOT change: the step order, the generic (non-EUDR) wording, the section's scroll length.
- Fits one viewport at 1440x900.

## 5. Sound familiar?: horizontal rows
Files: Pains.tsx, its CSS
- Three full-width rows, stacked. In each row: pain statement on the left, Bindu answer on the right, read left to right in one line. No alternating sides.
- Keep 01 / 02 / 03 and the existing copy.
- Layout reference (Austin likes its layout; rebuild in our own code): maxibestof.one/sections/rubie-section-feature-a8oopu.
- Fits one viewport at 1440x900.

## 6. Section titles: one style
Files: bits.tsx (shared title, if any), each section's title markup
- Every section title uses the same component and tokens as the How it works title (same size scale, mono-caps eyebrow, display title). Change only the titles that differ.
- Must NOT change: the copy of any title.

## 7. One shipment from origin to customs: colours
Files: ShipmentJourney.tsx, Cargo.tsx, shipment.css, lib/shipmap.ts
- Route lines in bright cobalt (#3D7BFF on dark, deeper cobalt on light), cargo icon and milestone markers in yellow with the item 2 outline on light.
- Stronger contrast on the "coming" end state for in-build stories (no completed look).
- Animation timing, segmented control and pinned layout: unchanged. Title stays visible while pinned.

## 8. What each filing costs: centred top, one split card, one window
Files: Pricing.tsx, EudrCheck.tsx, r6-pricing.css (+ r13 side styles)
- Main reference (Austin's pick): time.fyi monthly plan pricing section, unsection.com/section/time-fyi-monthly-plan-pricing-section. Light, minimal, visible border, centred text on top, split layout below, a toggle and a checklist. Secondary: Made With GSAP's pricing (madewithgsap.com). Look only; rebuild in our own code.
- Layout, top to bottom:
  1. Centred: heading "What each filing costs." and the intro line, as now.
  2. Centred: the tabs as a pill toggle (EUDR first, default). Reuse the sliding-indicator style of the shipment segmented control.
  3. One card with a 1px hairline border, split into two equal halves on one top line:
     - Left (the receipt): big price (e.g. €249) with its label and one-line note, then the breakdown as a ledger: four rows, label left, amount right-aligned in one column, hairline between rows. Rows: €199 to file · €50 to keep 5 years · €100 option to keep 10 years · €20/month workspace. Other tabs: "Pricing on request", same position.
     - Right: what's included as a short checklist (small cobalt dot, not icons in circles), then the "Estimate your cost" pill, then small trust notes underneath (per filing, no seats, excl. VAT, EU-hosted).
- Motion: one idea only. When the section enters view, a slow "border beam" (idea from Magic UI's Border Beam, rebuilt in CSS) travels once around the card in cobalt with a yellow tip, then stops. None under reduced motion.
- The whole section fits one viewport at 1440x900 and 1920x1080 with no scroll inside the section. At 375 and 768 the halves stack (receipt first).
- Buttons: the only filled pill is "Estimate your cost". In the EUDR tab, turn the outline "check" button (EudrCheck) into a text link that opens the same check (style from item 11). Keep its source link. No demo button in this section.
- Don't take from the references: avatar rows or "Join N+" social proof, checkout buttons, any invented numbers.
- Must NOT change: the prices, the wording of each breakdown line, the footnotes.

## 9. Estimate your cost popup: size
Files: Estimate.tsx and its CSS
- Reduce the popup so it fits one window at 1440x900 and 375x667: smaller padding, input heights and type sizes, all from tokens. No stretched fields.
- Keep the Book a demo button at the end of the popup.

## 10. One shipment from origin to customs: overflow
Files: ShipmentJourney.tsx, shipment.css
- The section still spills out of its window. While pinned, title, segmented control, map and milestone labels all sit inside one viewport at 375 / 768 / 1440 / 1920. Nothing is clipped or runs past the edge, including the longest story's ports and labels.
- Fix by scaling the map frame and label sizes to the viewport height (for example clamp() with vh/dvh). Don't remove content.
- Must NOT change: the routes, the stories, the animation, item 7's colours.

## 11. Buttons and text links: new style, cleaner transitions
Files: components.css, tokens.css (motion tokens), and the button markup in Nav.tsx, Hero.tsx, Closing.tsx, Pricing.tsx, Estimate.tsx (only if a wrapper span is needed)
- Filled pill (primary, everywhere it's used now): yellow pill, mono-caps label, a small navy dot at the right end.
  - Hover: the dot slides 4px right and becomes an arrow. A soft light sheen sweeps once across the pill, left to right (idea from Magic UI's Shiny / Shimmer Button). The label colour wipes from navy to deep cobalt, left to right (idea from the hover snippet Austin pasted: clip/width wipe on a ::before copy of the label).
  - Timing: one shared easing token, cubic-bezier(0.22, 1, 0.36, 1). 200ms for the colour and arrow, 600ms for the sheen. Animate transform, opacity and clip-path only (no width/left). No bounce.
  - Active: scale 0.98. Focus-visible: 2px cobalt ring with offset. Disabled: muted fill, no motion.
- Text links (secondary: the EUDR check link, the demo link on sub-pages, "Read more" style links): the pasted snippet's pattern. A 1px cobalt underline grows from the left on hover (transform: scaleX, not width), the text colour wipes to cobalt, and a small arrow nudges 4px right.
- Colours only from tokens. Replace the snippet's #111 / #c84747 with navy / cobalt tokens. Write the CSS fresh; don't paste the snippet.
- Reduced motion: no sheen, no wipe. State changes are instant colour swaps.
- Must NOT change: button labels, positions, sizes, which buttons are filled.

## 12. LICENSES.md
Files: docs/home/LICENSES.md (new)
- Create it: GSAP (GSAP Standard "no charge" licence, commercial use free since 30 Apr 2025), Lenis (MIT), OGL (Unlicense), React (MIT), Geist Sans + Geist Mono (SIL OFL 1.1), map coastlines (own, hand-typed).
- "Ideas from MIT libraries, rebuilt in our code, no code copied": Magic UI (Animated Beam, Border Beam, Shiny/Shimmer Button), and the hover-link snippet Austin supplied (source unknown, rewritten from scratch).
- "Inspiration only, no code or assets copied": Difault, Rubie (via maxibestof), time.fyi (via unsection), Made With GSAP, the Awwwards references in the brief.

## 13. How it works, step 03 "File": remove the EUDR line
Files: features/landing/home/content.ts (line ~93)
- Delete "Today it files EUDR and returns the reference number customs asks for." The homepage isn't EUDR-specific.
- Remaining text: "Bindu builds one compliance record. Some rules are still in build." ("Other" becomes "Some" so it reads on its own.) Log the wording in DECISIONS.md.
- Must NOT change: steps 01 and 02, the step labels.

## 14b. UPDATE (Austin, after seeing it): both sliders are too much, make them minimalist
Applies to the One shipment control AND the pricing tabs (item 8). This replaces the visual style in item 14 below; keep its keyboard, roles and reduced-motion rules.
- No track fill, no dot pattern, no glow, no pulse, no status dots, no pill background.
- Plain mono-caps text labels in a row, muted colour (text-soft token). Active label: full-contrast text plus a 2px cobalt underline that slides between options (transform only, 250ms, shared easing token). One 1px hairline under the whole row.
- Hover: label goes to full contrast, nothing else. Focus-visible: cobalt ring.
- Both controls look identical.

## 14. One shipment: segmented control (EUDR · CBAM · DPP · REACH · PPWR), futuristic restyle (style superseded by 14b)
Files: ShipmentJourney.tsx, shipment.css
- Track: one slim pill, 1px hairline border on a deep navy surface token (both themes), with a faint inner dot-pattern. No glass and no blur.
- Options: mono-caps labels. Each has a small status dot before it, taken from that story's own status: solid yellow = Live, grey dashed ring = In build (honesty rule; never show In build as live).
- Active: a cobalt indicator slides under the active option (shared easing token from item 11, 300ms, transform only), with a soft bright-cobalt glow beneath it. The active label is off-white and its dot gets a single soft pulse.
- Hover: label brightens and the dot scales 1.15. Focus-visible: cobalt ring. Keyboard: arrow keys move between options (roving tabindex, role="tablist").
- Reduced motion: the indicator jumps, no pulse.
- No border beam here (item 8's pricing card is the neighbouring section; one motion idea per section). Item 8's pricing toggle reuses this control's style.
- Must fit the item 10 one-window layout. At 375 it scrolls horizontally inside the track only (no page scroll) or wraps to two rows, whichever looks cleaner. Log the choice.
- Must NOT change: the order of options, the stories, the map animation.

## Report
- One line per item, judgement calls (also log them in docs/home/DECISIONS.md).
- Screenshots of changed sections in both themes at 1440; also 375 for items 3, 4, 5, 8, 9 and 10.
- Leave the dev server running and give the URL. No recordings.
