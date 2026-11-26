Round 60 on the homepage (`/`): enhancement passes with the skills Austin picked (25 Nov 2026), one at a time, after round 59 is built. DESIGN.md v4 and docs/home/component-review.md (Austin's keeps) are fixed points: a skill finding never overrides them; it is noted instead.

Run in this order. For each pass: invoke the skill (Skill tool), audit the whole homepage against it, list findings P0 to P3 with file:line, fix P0 and P1 (and P2 where small), one commit per pass, log the pass in DECISIONS.md under "Round 60", then send a short report and wait for the next pass.

1. `critique-impeccable` (pbakaus/impeccable critique + rubric): scored critique of every section; fixes only where they don't change Austin's keeps.
2. `bolder` (pbakaus/impeccable): raise the sections that read safe or bland to the conviction the rest of the page has, without new effects or rebuilds.
3. `12-principles-of-animation` (raphaelsalaja userinterface-wiki rules): every animation against the timing, easing, exit, reduced-motion and container rules.
4. `apple-design` (emilkowalski): motion physics (interruptible, momentum, springs where it fits), typography optics, restraint, reduced motion.
5. `better-ui` (jakubkrehel): radii, optical alignment, icon states, surfaces, exact values.
6. Anti-slop audit (Austin, earlier): `antislop`, `antislop-ui`, `avoid-ai-design` (with `scripts/detect.mjs`), `hallmark`, `heydamir-unslop`, `make-interfaces-feel-better`; fix what is found.
7. Consistency pass: one font and one design everywhere (DESIGN.md v4); list and fix every section-specific font, size, weight, radius, colour or component.

Pricing, FAQ, finale and footer: Austin said don't change; only fix bugs or accessibility failures there, and report them.
