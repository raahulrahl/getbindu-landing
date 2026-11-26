---
name: polish
description: "Final quality pass before shipping a frontend: fixes drift from the design system, missing states, spacing, type, contrast, motion and copy consistency. Refinement, never a hidden redesign."
license: Apache 2.0
---

Applies to the homepage (`/`). Other pages follow docs/DESIGN.md.

> **Installed for the Bindu homepage (project level, 18 Nov 2026).** Source: github.com/pbakaus/impeccable @ d41d986, `.claude/skills/impeccable/reference/polish.md` (skill v4.9.2, Apache-2.0, `LICENSE.txt` alongside). Vetted by reading the file in full and grepping the skill folder for scripts, installs, network calls, keys and telemetry: none in this file. Instructions only; nothing from the folder's `scripts/` was copied.
>
> **Adapted:** section 2's `critique-storage` command and section 5's `impeccable context` / detector references need the engine binary, which is not installed, so they are replaced by Bindu's QA list below. `bindu-design` wins any conflict (palette, buttons, honesty, copy). Conflicts with `bindu-design` are logged in `explore/SKILLS.md` Part 0b.
>
> **Bindu context:** the design authority is `docs/home/DESIGN.md` plus the `bindu-design` skill, read through `docs/home/PRODUCT.md`. The quality bar is the `bindu-design` QA list (widths 375/768/1440/1920, Lighthouse ≥85 on the built output, reduced motion, keyboard, contrast, console errors, demo links).

> **Additional context needed**: quality bar and shipping constraints.

Polish is refinement, never concealed redesign. Preserve the incumbent visual world, content, behavior, and everything outside scope. If the concept itself is wrong, say so and recommend redesign or `bolder` instead of smuggling in a replacement.

A detector result is defect evidence, not proof of quality. Inspect the rendered experience and real interaction path.

## 1. Establish the system

Read DESIGN.md and representative tokens, shared components, patterns, and neighboring flows. If no formal system exists, use coherent project conventions.

Classify each drift before fixing it:

- **missing token:** the system needs a reusable value;
- **one-off implementation:** an existing shared component or pattern should replace it;
- **conceptual mismatch:** the flow, information architecture, or hierarchy differs from comparable product areas;
- **local defect:** the implementation is simply incomplete or inconsistent.

Fix the cause at the narrowest correct level. Ask when a binding system principle cannot be inferred.

## 2. Gather the evidence

Use the feature yourself at the surface's representative sizes: desktop and mobile on the web; on a native platform (`ios` / `android` / `adaptive`), the shipped device classes on the simulator, emulator, or hardware, captured per the platform reference's Verifying the build section. Determine:

- whether the path is functionally complete;
- the intended quality bar and time available;
- known constraints or deliberately unfinished work;
- the states, content lengths, roles, and input methods users will actually encounter.

Bindu note: the critique-storage helper is not installed (it needs the engine binary). There is no stored critique snapshot to read, so do an independent pass.

## 3. Triage

Separate functional defects from cosmetic ones and fix in this order:

1. broken or blocked tasks, data loss, misleading state, and inaccessible paths;
2. missing loading, empty, error, success, disabled, and permission states;
3. flow, hierarchy, responsive, and design-system drift;
4. visual and motion inconsistencies;
5. code and asset cleanup.

Do not perfect one corner while leaving the rest below the same quality bar.

## 4. Polish the whole path

### Flow and hierarchy

- Match neighboring mental models, terminology, disclosure, routing, save behavior, and optimistic or pessimistic patterns.
- Make the primary task and current state obvious without flattening every element to equal weight.
- Ensure arrival, transition, empty, and recovery paths connect instead of behaving as isolated screens.

### Layout and type

- Align to the project's grid and spacing scale; fix optical as well as mathematical alignment.
- Group related content tightly and separate distinct groups generously.
- Keep same-role typography consistent; test measure, wrapping, localization expansion, zoom, and font loading.
- Verify every supported viewport rather than correcting only the current screenshot.

### Color, imagery, and icons

- Use semantic tokens and stable color meanings across themes.
- Verify text, control, and focus contrast in every state.
- Keep icon families, stroke/weight, sizing, and optical alignment coherent.
- Prevent image layout shift; use correct aspect ratios, responsive sources, and useful alt text.

### Interaction and state

- Every control needs appropriate default, hover, focus, active, disabled, loading, error, and success behavior.
- Preserve visible keyboard focus, logical tab order, labels, and platform-appropriate touch targets.
- Keep motion coherent, interruptible, and performant. Do not add animation merely to make polish visible.
- Validate long, missing, localized, offline, slow, and permission-limited content where the product can encounter it.

### Content and code

- Keep terminology, capitalization, punctuation, and factual copy consistent. Ask before changing claims.
- Remove debug output, dead code, unused imports, obsolete styles, and polish-created duplication.
- Replace custom implementations with shared components where the system owns the pattern.
- Promote genuinely reusable values to tokens; do not create a system abstraction for one local exception.

## 5. Verify and finish

Walk the complete path again with mouse, keyboard, and touch where applicable. Check:

- mobile, intermediate, and wide layouts on the web; phone and tablet size classes in both supported orientations on native;
- loading, empty, error, success, disabled, long-content, and missing-content states;
- zoom, contrast, focus, semantics, and screen-reader names;
- console errors, layout shift, interaction latency, and image loading everywhere; supported browsers on the web; supported OS versions, runtime warnings, and dropped frames on native;
- agreement with DESIGN.md, neighboring features, and the user's scope.

Bindu note: no detector hook is installed. Run the `bindu-design` QA list (widths 375/768/1440/1920 with no horizontal scroll, Lighthouse ≥85 on the built output, reduced motion, keyboard and focus, contrast, console errors, demo links). Fix real defects and document only narrow intentional exceptions. A clean check does not replace visual judgment.

Finish with a source diff: remove accidental churn, orphaned code, redundant values, and temporary artifacts. Ship only when the feature is functionally complete and consistently finished across the path.

Bindu note: there is no critique snapshot to close.

This closes only the snapshot this pass actually processed; if a newer critique landed meanwhile, its backlog stays live. Do not close when no snapshot was read, when `snapshot_file` was not retained, or when Priority Issues remain.
