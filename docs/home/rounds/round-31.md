Round 31 on branch `v3-story`. Follow CLAUDE.md. Change only what's listed.

## 1. "What the rules let through, and what they stop": a dynamic story under the board
- Keep the split-flap departures board and its flap animation exactly as it is.
- **Reveal:** the section stays pinned, and each scroll step reveals ONE row: it flaps in, settles, and becomes the "current" row (highlighted: full ink, a small yellow dot at the left). Earlier rows stay, slightly muted. Scrolling up un-reveals in reverse.
- **The story panel:** under the board, a panel shows the current row's story. It changes as each new row becomes current, with a split-flap-style transition on the headline (the same flap characters, quick) and a soft crossfade on the body. Content per row, from getbindu.com's worked examples (text in `C:\Users\HP\AppData\Local\Temp\claude\12675c165a4ba0dd\a4557441-a123-432f-a224-e2c6729f6167\scratchpad\roth\gb\getbindu_com.txt`, section "WHAT THE RULES LET THROUGH, AND WHAT THEY STOP"):
  - the headline (e.g. "Papers lie. Maps don't.", "The satellite has a long memory.", "Draw the map once.")
  - the verdict ("Let through" in cobalt / "Stopped" in the red `--stop` token) and the rule + goods (e.g. "EUDR · Coffee")
  - the route (e.g. "Chikkamagaluru → Hamburg")
  - the two-line story, with the reason it was let through or stopped (getbindu.com wording, lightly shortened if needed)
- **Rows:** use getbindu's examples, at least 6 and up to 10, mixing let-through and stopped across EUDR, textiles/DPP and batteries. Make sure "Papers lie. Maps don't." (EUDR coffee, stopped) and "The satellite has a long memory." (EUDR rubber, stopped) are included.
- **Labelling:** keep the lead line "Illustrations, not customer filings: the verdict on a real shipment belongs to the rules and to the authority that reads them."
- **Optional detail, only if clean:** a tiny map glyph in the panel showing the route as a dotted line between two dots (in tokens).
- **Accessibility:** the board stays a real table. The panel is an aria-live="polite" region that announces the current row's headline.
- **Reduced motion:** all rows shown, with the panel listing every story in order.
- **Phones:** the same one-row-per-step pin, with the panel under the board.
- **Sound (if on):** the existing clack as a row settles. No new sounds.

## 2. Check
- npm run build passes.
- 375 / 1440 / 1920, both themes, reduced motion: no horizontal scroll, no console errors.
- Verify with real mouse-wheel scrolling (as in round 30) that each step reveals one row and the panel matches it, forward and back.
- One commit: "v3 r31 1: departures board reveals one row per step with its story underneath". Stage only changed files, LF. Dev server stays on 3010. Close puppeteer and delete its temp profile.

## Report
Short: what it does, which rows were used, evidence.
