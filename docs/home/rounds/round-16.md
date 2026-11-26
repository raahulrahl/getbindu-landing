Round 16 on /v3. Small, incremental change only. Read CLAUDE.md and docs/home/project-context.md first. Only change what's listed.

## 1. Font swap (site-wide, tokens only)
Font pair: IBM Plex Sans (display + body) and IBM Plex Mono (labels, buttons, numbers). Both SIL OFL 1.1.
- Install @fontsource/ibm-plex-sans and @fontsource/ibm-plex-mono. Self-host the woff2 files in public/home/fonts the same way Geist is now (latin; Sans 400/500/600, Mono 400/500), with font-display: swap and the existing preload pattern. Remove the Geist files, @font-face rules and the @fontsource/geist-* packages.
- Change only --font-sans and --font-mono in features/landing/home/styles/tokens.css. No font-family anywhere else.
- Re-tune tracking for Plex: the --track-* display tokens toward -0.01em to -0.02em. Mono-caps letter-spacing stays 0.06–0.12em. Display weight 400 (500 if 400 looks thin on ivory; log which).
- Check that nothing overflows or wraps worse with the new metrics: hero headline, pinned section titles, buttons, the tab rows, pricing numbers (tabular figures).
- Update docs/home/LICENSES.md (Geist out, IBM Plex in, OFL 1.1) and log the choice in docs/home/DECISIONS.md.
- Must NOT change: sizes scale, layout, colours, copy, any motion.

## Done when
- npm run build passes with no TypeScript errors.
- Quick check at 375 and 1440 in both themes: no horizontal scroll, no overlaps, no console errors.
- One commit: "v3 r16 1: font swap to IBM Plex Sans + Mono". Stage only the files you changed (never the deleted .claude/skills files).
- Leave the dev server running and give the URL.
- Report in 3–5 lines. No screenshots, no recordings.
