Round 39 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed. One commit per item. Don't push.

## 39-1. Remove the How it works section
- Austin: remove the whole window with the paperwork illustration and the QR passport.
- Delete the How it works section (`#how`: kinetic sentence, event log, QR passport, the
  r36-5 File-step document threads) from the page, with its component, CSS, phone rules,
  content strings and band entry. Delete only what nothing else uses.
- Keep working after it is gone: the guide ship lane and its anchors, the scroll-progress
  rail, the band crossfades, the nav link "How it works" (points to the 39-2 section, which
  takes over the `#how` id).
- Keep: the r36-5 trace lines in the hero, statement and FAQ.

## 39-2. Full Circle, in the homepage theme and easier to follow
- Port `features/landing/story/theatre.tsx` (+ theatre-stages.ts, theatre.css; don't edit
  the originals) into a homepage section in the slot How it works had (after the before and
  after section, before Ask your supply chain), id `how`.
- Keep the structure Austin liked: "pick an act, it plays itself". Three acts as the
  standard minimalist tab row: The Fabric, The Bean, The Circle. Each act self-plays when in
  view, pauses off screen and with the site pause control; a scene-dot row under the stage
  shows progress and lets you jump.
- Easier to understand: rewrite the captions in plain buyer language, one short line each
  (no in-jokes, no quotes from characters, no slang like "brother"), max 5 per act. Say
  what happens: who asks, what proof is missing, what Bindu does, what comes back. The
  last caption of the last act names the trace idea: every line points back to the
  document behind it. Section title 8 words or fewer; keep "Full Circle." only if a lead
  line explains it. Give 2-3 options for the title and lead; pick one and log it.
- Pace: slow enough to read. Each caption holds at least 3.5s after its motion settles.
- Theme: home tokens only, both themes (canvas/band like its neighbours, panel, hairline,
  ink, mute). Map the old colours: `--leaf` (ok) to `--board-pass` or cobalt, `--refuse` to
  `--board-stop`, `--ochre` to `--proof-dot` yellow, `--ink` to `--line-ink`. Inter + IBM
  Plex Mono via tokens. Captions on the left in one column with the current one highlighted
  the same way as the Ask section (r38-2): full contrast plus the yellow dot.
- Layout: one window at 1280x720 to 1920x1080; nothing overflows. Captions left, stage
  right, one top line.
- Honesty: people, places and documents in the acts are Illustration (label it once).
  Only regulations and facts already on getbindu.com; In build stays "coming".
- Phones (<768px): the original hides the stage below 901px; on phones show the tabs and
  each act's captions as a short list with a still of its final frame. Reduced motion:
  the composed final frame of the current act, captions all visible, tabs still swap.

## Report
One line per item, the chosen title, lead and captions (quote them), judgement calls,
screenshots: each act at 1440 in both themes, 1280x720, 375.
