Round 36 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed.

Status rule (Austin, 22 Nov 2026): whatever is shown on getbindu.com is live. "Ask your
supply chain" (the questions theatre) is on the live site, so it is live.

Items run as separate agents in this order: 36-1 and 36-2 (docs, skills) in parallel; then
36-3, 36-4, 36-5 one after another; then 36-6. One commit per item. Don't push.

## 36-1. Docs: one consistent design system (docs only, no code)
- Fold DECISIONS.md rounds 17 to 35 into docs/home/project-context.md: rewrite sections 9
  (design system) and 10 (page structure) to describe the current build, delete the
  "Since round 15" block once its lines live in the right sections. Keep under ~300 lines,
  update "Last updated", add r36 to "Recent rounds".
- Add a "Consistency rules" section to docs/home/DESIGN.md, measured from the current code
  (tokens.css, components.css, story.css), not invented: one section-head pattern (mono-caps
  label, title, lead: sizes, gaps, max-widths), the type scale in use, the spacing rhythm
  (section padding, head-to-content gap), one panel style (surface, border, radius), buttons,
  text links, tabs, "Illustration" labels.
- Write docs/home/consistency-audit.md: per homepage section, each place it breaks those rules
  (file:line, rule, fix). This is the work list for a later fix round. Do not fix code.

## 36-2. Slop skills (tooling only)
- From github.com/GetBindu/awesome-claude-code-and-skills "AI Slop Elimination", install into
  `.claude/skills/`: Nutlope/hallmark, funboy322/avoid-ai-design, miqdadbadjuber/anti-slop,
  jakubkrehel/make-interfaces-feel-better. Check each licence first; skip any that isn't
  open for commercial use and say why. Log each in docs/home/LICENSES.md.
- Add a line to each installed SKILL.md (or a wrapper note in bindu-design): for `/`,
  bindu-design wins every conflict; use the gates and checks only, never their themes,
  palettes or fonts.
- Run nothing on the code yet.

## 36-3. Logo and a smaller nav
- Logo: the official Bindu sunflower (github.com/GetBindu/Bindu, assets/bindu_logo.png,
  499x499 PNG, 420 KB). Make optimised copies (e.g. 64 and 128 px WebP + PNG fallback) in
  `public/home/`, and use it as the brand mark in the homepage nav, the footer and the
  phone drawer, replacing the dot-spiral `Mark` there. Keep `aria-label`. Record the source
  in features/landing/home/LICENSES.md (Bindu's own asset).
- Must NOT change: the ı-dot sunflower of dots and the guide ship (they stay dot-built).
- Nav like parallel.ai: first screenshot parallel.ai's header in a real browser (1440 and
  375) and note height, logo size, link grouping, type size, CTA style, background. Then
  bring ours closer: bar about 56px tall (measure ours first and report before/after),
  logo about 24px, links smaller and quieter (mono-caps or small sans, muted, full contrast
  on hover), links grouped together, demo button smaller (same pill, same motion, shorter).
  Keep the theme toggle and the drawer.
- Phones: 44px tap targets and safe-area padding stay (r35-6).

## 36-4. "Ask your supply chain", rebuilt in the homepage theme
- Port `features/landing/story/questions-theatre.tsx` into a new homepage section in
  `features/landing/home/` (don't edit the original file). Placement: between How it works
  and the journey.
- Copy: keep the head "Stop chasing documents. Just ask." and the five captions (You ask. /
  The question goes out. / Their data stays with them. / A person approves the answer. /
  You get it back, signed.). Keep the three scenarios (coffee, textiles, batteries).
- Restyle: home tokens only. Yellow = the question and the signed answer; cobalt = pipes,
  relay and supplier nodes; navy/ivory ink from tokens. Inter + IBM Plex Mono via tokens.
  Works in ivory and dark. Scenario switcher = the standard minimalist tab row.
- Layout: one window. Heading, lead and the five captions stacked on one left edge (the
  current caption at full contrast); the stage on the right.
- Motion: scrubbed by scroll in a pin (pure function of scroll position, reverses on scroll
  up), not auto-play. One idea only, no extra effects. Respect the site pause control.
- Honesty: label the example references and certificate numbers "Illustration". Drop
  "declaration mandatory since Feb 2025" from the battery scenario unless a EUR-Lex source
  confirms it; replace it with a neutral line and log the choice.
- Phones (<768px): heading, tabs and the three answer cards, as the original does below
  901px. Reduced motion: the composed final frame, tabs still swap.
- Must NOT change: How it works, the journey, the guide ship lane (check the gutter lane
  still passes the new section cleanly).

## 36-5. Traceability through documents
- The idea: every answer and every filing traces back to the supplier document behind it.
  Not EUDR-specific.
- Four documents become one record: each line of the record gets a thin cobalt thread back
  to the source document it came from; hover (desktop) or tap (phone) a record line to
  highlight its thread and show "from <document> · <supplier>" (labelled Illustration).
  Keep the existing beams; the threads are the resting state after the beams land.
- Copy, add the trace angle in: the hero sub-line, the statement, the "Prove" step of How
  it works, and one FAQ answer. Give 2-3 options for each in the report; pick one and log
  it. Headlines stay 8 words or fewer; no banned words; no new facts.
  Example directions (not final): "Every line traces back to the document behind it." /
  "Each answer points to the supplier document that proves it."

## 36-6. Slop pass
- Run the 36-2 gates (hallmark slop tests, avoid-ai-design scanner, anti-slop gate) plus
  `audit` on the whole homepage. Fix only what they flag as failing in sections touched in
  36-3 to 36-5; list the rest in docs/home/consistency-audit.md. Scan again until those pass.

## Report
One line per item, judgement calls, screenshots of changed sections in both themes at 1440
and 375 (nav, new section, Four documents).
