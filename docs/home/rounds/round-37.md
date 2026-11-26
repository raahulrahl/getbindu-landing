Round 37 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed. One commit per item. Don't push.

## 37-1. Hero sub-line: shorter
- Cut "whether you import six containers a year or six hundred." Keep the r36-5 trace line.
- Must NOT change: the headline, the demo button.

## 37-2. Console errors
- Find and fix the root cause of the hydration error under reduced motion (server and client
  render different markup; usually a matchMedia / localStorage read during render). Fix it
  in the homepage code only, never in `shims/`, `app/root-shell.tsx` or `app/providers.tsx`.
- Find the "script tag" warning (likely a `<script>` rendered by a React component). Fix it
  only if the cause is in `features/landing/home/`; otherwise report where it comes from.

## 37-3. Consistency fixes
- Work through docs/home/consistency-audit.md (including the "r36-6 scan" list), applying the
  "Consistency rules" in docs/home/DESIGN.md: one section-title size (via tokens), one panel
  radius and border token, one "Illustration" label style, one button press state, one focus
  ring colour, hero headline size set in one place, stale comments that describe removed
  things deleted.
- Token-level and class-level fixes only. No layout, motion or copy changes. If a fix would
  visibly change a section's layout, skip it and list it.
- Mark each audit line done or skipped (with why) in consistency-audit.md.

## Report
One line per item, skipped audit items, before/after screenshots at 1440 and 375 in both
themes of any section whose look changed.
