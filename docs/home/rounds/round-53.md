Round 53 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md and docs/home/project-context.md. Only change what's listed. Start after round 52 is committed.

## 1. Whole page: one paper background (DESIGN.md v2 section 9b, ref open-design.ai kami)
- Retire the band crossfade: `lib/bands.ts` stops writing the body colour, the body stays `--canvas` in both themes. Remove the per-section band attributes and `bands.css` rules (or reduce `bands.css` to nothing that changes colour). Keep the `--band-*` tokens defined.
- Add one full-width 1px `--hairline-dark` rule on the top edge of every section from `#statement` to `#faq`, running viewport edge to edge (a pseudo-element on the section, not on the container). No rule above the hero, none above `#demo`.
- Check every panel against section 9b: `--canvas-soft` + 1px `--hairline-dark`; `--canvas-mid` only when nested. Any section that sets its own background fill (other than a panel) loses it. List each one you changed.
- No shadows, gradients, textures or noise anywhere except the existing footer gradient over the finale.
- Add to `features/landing/home/LICENSES.md`: "Background rules adapted from open-design.ai's kami system (from tw93/kami, MIT); no code copied."
- Must NOT change: colour token values, fonts, the dot map and its content blur, layout, copy, motion, the finale.

## Report
One line per item, the list of sections whose fill changed, screenshots of statement, story, Full Circle, pricing and FAQ in both themes at 1440 (375 only if a rule looks wrong there).
