Round 41 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed. One commit per item. Don't push.
TOKEN BUDGET IS THE TOP PRIORITY: grep before reading, read only line ranges you need, no
full-file reads of large files, few screenshots and only look at the ones you must judge,
short reports. Don't re-verify what a tool already confirmed.

## 41-1. Map: blur only behind content, not the whole map
- Austin: blur the content areas, not the whole map. Undo r40-3's whole-layer blur/dim
  (commit 8c35077): the map is sharp again everywhere (keep r33-3's shipment fade).
- Instead, each content block past the hero (heading + lead blocks, caption columns,
  FAQ list, pricing card, the departures board, the Ask and Full Circle text columns)
  gets a soft local blur of the map behind it: a feathered-edge area (mask fading out,
  no visible box, no border, no shadow) about 12 to 24px beyond the text.
- Cost first: try `backdrop-filter: blur(8px)` on those blocks with a radial/linear mask;
  measure scroll frame time at 1440 with real wheel events (Lenis). If it adds more than
  ~2ms per frame, use the existing cached blurred bitmap (`.scene-soft`) shown only
  through masks matching those blocks' cached rects. Report the numbers in one line.
- Solid panels (Full Circle stage, pricing card) already hide the map: no change there.
- Reduced motion and phones: same look, no ramp.

## 41-2. Full Circle: one act per scroll, slower
- Austin: only the chosen act plays on scroll, not all three; one small scroll makes the
  whole thing run off.
- The pin covers ONE act: the selected act's scenes only (default The Fabric). Tabs switch
  the act (instant swap of the stage to that act's scene 1, scroll position goes to the pin
  start); they no longer scroll to other acts.
- Slower: about 100svh of scroll per scene (pin length = the longest act's scenes x 100svh,
  so acts with fewer scenes hold their last scene). Add a smoothed scrub (scrub 0.8 to 1)
  so a small wheel tick moves the scene a little, never a whole scene.
- Must NOT change: the layout, captions, colours, phones and reduced motion.

## 41-3. Slop audit and fixes, all skills
- Install github.com/heydamir/unslop (CC-BY-4.0: commercial use allowed with attribution;
  log it in docs/home/LICENSES.md with the attribution line) into
  `.claude/skills/heydamir-unslop/` (the existing `unslop` is a different, writing skill).
  Read every copied file; run none of its scripts unless you read them. Add the header:
  "For the Bindu homepage (`/`): bindu-design wins every conflict. Use its checks only,
  never its themes, palettes or fonts."
- Audit the whole homepage with: avoid-ai-design (`node .claude/skills/avoid-ai-design/
  scripts/detect.mjs` over features/landing/home), hallmark gates
  (references/gates.md), antislop + antislop-ui (Delivery Gate), make-interfaces-feel-
  better (quick review), heydamir-unslop, unslop (copy in content.ts only). Run the
  checks by reading code and the rendered page at 1440 only; skip re-running a check that
  found nothing.
- Write docs/home/slop-audit-r41.md: one table, one row per finding (section, file:line,
  skill, tell, severity P0 to P3, fix or "keep, deliberate" with the reason from
  bindu-design or DECISIONS.md). Merge duplicates across skills into one row.
- Fix P0 and P1 iteratively: fix, re-run only the check that flagged it, until it passes
  (max 3 passes). P2/P3 that are one-line token/class fixes: fix. Anything that changes
  layout, motion or the copy's meaning: list it, don't fix. Known open items from
  consistency-audit.md "r36-6 scan" are in scope (elastic easing, accented last word,
  middle-dot meta strings).
- Never fix by breaking: honesty rules, Illustration labels, the yellow+cobalt palette,
  Inter + IBM Plex Mono, both themes, reduced motion, phone rules.

## Report
At the end, append a "Round 41" entry to docs/home/DECISIONS.md and write
docs/home/rounds/round-41-report.md (under 40 lines): one line per item, perf numbers,
counts of findings found / fixed / listed, commits. No screenshots in the report beyond
4 file paths.
