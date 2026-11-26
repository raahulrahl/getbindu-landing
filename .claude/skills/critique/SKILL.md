---
name: critique
description: "Design critique of a Bindu homepage section: design specificity, Nielsen's 10 heuristics scored 0-4, cognitive load, and persona walk-throughs, with P0-P3 priority issues. Use after a change to judge whether the page still reads as Bindu. Reports only; it does not edit."
license: Apache 2.0
---

Applies to the homepage (`/`). Other pages follow docs/DESIGN.md.

> **Installed for the Bindu homepage (project level, 18 Nov 2026), adapted.** Source: github.com/pbakaus/impeccable @ d41d986, `.claude/skills/impeccable/reference/critique.md` and `critique-rubric.md` (Apache-2.0, `LICENSE.txt` alongside). Vetted by reading all three files in full, plus a grep of the folder for executables, installs, network calls, keys and telemetry. Instructions only; nothing from `scripts/` was copied.
>
> **Adapted:** the engine is not installed, so Assessment B (the `impeccable detect` scan, the browser overlay, the live server and `critique-storage`) is removed. Assessment B's work is done by hand with the `bindu-design` QA list. The sub-agent split is not available either, so the run is single-context and the report carries the degraded banner. Nothing is saved to `.impeccable/`. The persona set and the rubric are unchanged (`reference/critique-rubric.md`). `bindu-design` wins any conflict, including its honesty and copy rules and its ban on urgency and invented claims.

Judge one stable target: a page, a section or a component in `features/landing/home`. Resolve it to a file path (`features/landing/home/components/Hero.tsx`) or the route `/`. Prefer the source path; the dev port drifts.

## Run

**First line of the report**, always:
`⚠️ DEGRADED: single-context (engine not installed; detector and browser overlay not run)`

1. Read `docs/home/PRODUCT.md`, `docs/home/DESIGN.md` and the target source. Read `reference/critique-rubric.md` before scoring.
2. Look at the rendered result at 375 and 1440 wide, in a browser if one is available. Judge the layout, not just the code.
3. Judge design specificity first, before any checklist: could an unrelated product use this section unchanged? Write that verdict down before you go on.
4. Score the 10 Nielsen heuristics 0-4. Mark a heuristic `n/a` only when it truly cannot apply (heuristics 7 and 10 are the usual ones on a marketing page), and renormalise the total (for example 24/32).
5. Run the cognitive load checklist (8 items) and count the decision points with more than 4 visible options.
6. Walk two or three personas through the primary action: Jordan (first-timer), Riley (stress tester) and Casey (mobile) for a landing page. Add the project persona from `docs/home/PRODUCT.md` (the EU importer with no compliance team). Name the element that breaks for each one.
7. Check the Bindu-specific rules: one filled yellow pill per view; "In build" never shown as Live; every illustration labelled; no invented customers, numbers or certifications; prices exactly as in `bindu-design`; sentence case; no banned words ("AI-powered", "seamless", "leverage", "unlock").

## Report

Use this order. The chat reply is the deliverable.

1. Header line and method.
2. **Design health**: the heuristic table (score and key issue each), the total with its applicable maximum, and the band. Bands: 36-40 Excellent, 28-35 Good, 20-27 Acceptable, 12-19 Poor, 0-11 Critical. With `n/a` rows, read the band off the percentage (90% Excellent, 70% Good, 50% Acceptable, 30% Poor).
3. **Design specificity verdict**: authored for Bindu, or category-interchangeable? Start with this.
4. **Overall impression**: one paragraph, plus the single biggest opportunity.
5. **What's working**: two or three specific things and why they work.
6. **Priority issues** (3 to 5), each tagged P0-P3, with what, why it matters, the fix, and the skill to run (`polish`, `frontend-design`, `bindu-design`).
7. **Persona red flags**: the exact elements that fail each persona.
8. **Minor observations**.
9. **Questions to consider**: two or three provocative ones.

Be direct and specific. Say what is wrong and why it matters to a visitor. Do not soften the verdict.

Finish with the questions the user should answer before the next pass (two to four, each with concrete options taken from the findings), or the literal line `Questions skipped: <reason>` when there are fewer than three priority issues. End with `polish` as the final step if any fixes were recommended.
