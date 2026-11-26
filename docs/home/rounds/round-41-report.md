# Round 41 report

Run unattended on branch home-brain. Nothing pushed. No subagents.

- 41-1 done (a3b95f1): whole-map blur reverted; feathered `backdrop-filter` blur behind content blocks.
- 41-2 done (c2e7417): Full Circle plays one act per scroll, 100svh per scene, eased scrub; tabs swap the act.
- 41-3 done (0ca11ee): heydamir-unslop installed and logged in LICENSES.md; audit in `docs/home/slop-audit-r41.md`.

Perf (1440, real wheel events, headless): frame time 8.00 ms with the blur layers vs 7.88 ms without (+0.1 ms), under the 2 ms limit, so the cached bitmap fallback was not used. Checks at 1440 and 375 in both themes: no console errors, no horizontal scroll, `pnpm tsc --noEmit` clean after each item.

Findings: 9 found, 2 fixed (elastic easing in `bits.tsx` and `theatre-fx.ts`), 1 listed (intro label "BINDU · TRADE COMPLIANCE OS", a copy change), 6 kept as deliberate or false positive.

Deviations and notes:
- Port 3021 refused: a dev server for this repo was already running on 3011, so I measured against that (same source, HMR).
- Playwright is not in the repo; I installed `playwright-core` in /tmp and used the cached Chromium.
- heydamir-unslop: copied SKILL.md, signs, tokens, visuals, refs and LICENSE; left out scripts, images, effects.md and rtl.md (unread). Detector ignore comments added for deliberate hits.
- The hallmark, antislop-ui and make-interfaces-feel-better checks were done by targeted greps, not a full re-score.
- `pnpm check:dashes` failed to run on Windows (shell error on `!`); I grepped `content.ts` for em dashes instead (none).

Files: docs/home/slop-audit-r41.md, docs/home/rounds/round-41.md, docs/home/DECISIONS.md, docs/home/LICENSES.md
