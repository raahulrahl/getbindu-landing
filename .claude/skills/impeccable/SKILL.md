---
name: impeccable
description: "Use to design, polish, critique or animate a frontend for the Bindu homepage. Core design principles, modes, and the context protocol (docs/home/PRODUCT.md, docs/home/DESIGN.md, bindu-design). Installed without the engine; bindu-design wins any conflict."
license: Apache 2.0
---

> **Installed for the Bindu homepage (project level, 18 Nov 2026), adapted.** Source: github.com/pbakaus/impeccable @ d41d986, `.claude/skills/impeccable/SKILL.md` (skill v4.9.2, Apache-2.0, `LICENSE.txt` alongside). Vetted by reading this file and `reference/polish.md` in full, listing the folder, and grepping the scripts and references for executables, installs, network calls, keys and telemetry.
>
> **Not installed, and why:** `scripts/` (the `impeccable` launcher and `.cmd`, the live-browser and screenshot scripts, the font index). The launcher downloads a native binary from GitHub Releases on first run; this project does not run downloaded executables. Also not installed: the hooks, doctor, foundations, pin and live/generate commands, which need that binary. The Setup below uses the skill's own "launcher unavailable" branch instead.
>
> **Conflicts (`bindu-design` wins):**
> - Persuade mode says "ship real imagery". Bindu uses no photography: app frames and mocks, each labelled "Illustration".
> - "Earn attention and action" and any urgency language: Bindu forbids urgency and invented claims.
> - "Refinement preserves; redesign replaces": a redesign of the committed homepage world needs Raahul's approval, not a skill decision.
> - Motion effects beyond transform and opacity (see `reference/craft-floor.md`): Bindu allows transform and opacity only.
> - Craft-floor's kicker/eyebrow ban, monospace and glass rules: see the provenance note at the top of `reference/craft-floor.md`.

# Impeccable (Bindu)

This skill gives the design judgement and craft standard for the Bindu homepage. Work as a design director would: production-grade code, a clear point of view, a grasp of what the importer needs, and exact craft. The design system is already decided, so this skill refines and checks; it does not restyle.

Core principles:
- Finish the job. The deliverable is complete, except assets Raahul must provide (mark those as placeholders).
- Scale ambition to the surface's mode. On Operate and Read, ambition shows as precision and restraint.
- Verify by looking at the rendered result at the sizes it ships at. Batch the checks, and fix what one look shows before looking again.

## Setup (manual context protocol)

The engine's `impeccable context` command is not installed. Replace it with these reads, once per session, with cwd at the repo root:

1. `docs/home/PRODUCT.md`: product truth (users, purpose, capabilities, prices, what is live and what is in build, placeholders, principles). It was written from the sources below.
2. `docs/home/DESIGN.md`: the design system (tokens, colour roles, type, components, sunflower and dot motif).
3. The `bindu-design` skill: house rules, copy rules, honesty rules and the QA list. These win over everything else.

Do not invent missing context. Where a fact is unconfirmed, use a visible placeholder ("Placeholder: waiting for Raahul"), as `bindu-design` requires.

Then load the playbook for the request:
- A polish or refinement pass: `.claude/skills/polish/SKILL.md`.
- Animation: the installed `animate` skill and `docs/home/MOTION.md`.
- A new surface or a replacement visual world: stop and ask Raahul. The homepage world is committed.

Before any UI edit, including small refinements, read `reference/craft-floor.md` (its verify list, refuse list and bans).

## How to design

- **The brief wins.** The committed homepage world (black canvas, yellow and cobalt roles, dot motif, outline pills) is pinned. Redirecting it toward a different taste is a failure.
- **Refinement preserves.** Keep the existing identity, behaviour, copy and everything outside the scope. Ask before replacing factual copy or adding claims.
- **Loaded symbols stay out of the decoration.** No emblems tied to militarism, supremacy or hate movements as ornament.
- **Visual authority is evidence.** `docs/home/DESIGN.md` and `bindu-design` decide the look. Nothing else does.

## Modes

The mode names what the visitor's success looks like on the surface.

- **Persuade:** the visitor decides and acts. Landing, pricing, final call to action. Design is the product, but within the honesty rules.
- **Operate:** the visitor completes a task. In-app mock screens (labelled Illustration). Scanability and precision outrank expression.
- **Read:** the visitor understands something. FAQ, trust. Structure for comprehension.
- **Experience:** the visitor is inside the work. The finale and the hero, where the sunflower leads.

## Commands

Only `polish` is installed: see `.claude/skills/polish/SKILL.md`. The other commands (critique, audit, animate, bolder, quieter and the rest) are not installed in this project. Motion work uses the installed `animate` skill, and quality checks use the `bindu-design` QA list.
