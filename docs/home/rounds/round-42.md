Round 42 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed.

## 1. Nav: floating instrument bar (Nav.tsx, nav styles in styles/site.css, phone rules in styles/mobile.css)
- Desktop (>=768px): the header becomes a detached bar: max-width matches the page container, inset 12px from
  the top, radius 14px, 1px hairline border (`--line` or nearest token), background = canvas token at ~72%
  opacity + `backdrop-filter: blur(14px) saturate(140%)`, a 1px inner top edge in cobalt at low alpha
  (inset box-shadow). No glow, no gradient fill, no drop shadow heavier than one soft layer.
- Height 56px at the top of the page, 48px once `is-scrolled` (existing state). Animate height/padding with
  GSAP or a CSS transition on non-hidden properties only (no CSS hidden states).
- Phones (<768px): keep the current full-width bar and drawer; only adopt the border/blur look. No inset.
- Intro: the bar must still sit correctly over the desktop intro; don't change intro timing.

## 2. Nav: section dot (scroll-spy)
- A 6px yellow dot (brand yellow token) sits under the nav link of the section currently in view
  (`nav.links` hrefs are section anchors). It slides between links with GSAP (`power3.out`, ~0.45s).
- No section in view (hero, or a page link) -> the dot fades out. The Regulations button and Blog never get it.
- Use ScrollTrigger (one trigger per anchored section, `start: "top center"`, `end: "bottom center"`), and
  honour the late-sections registry so sections that hydrate later still register.
- Active link also gets `aria-current="location"` and ink colour instead of muted.
- Reduced motion: the dot jumps (no tween).

## 3. Nav: scroll-progress rail
- A 2px rail along the bar's bottom inner edge (inside the radius, clipped by it): track = hairline,
  fill = cobalt, scrubbed to page scroll progress via ScrollTrigger (`scaleX`, transform-origin left).
- A 5px yellow dot rides the tip of the fill.
- Desktop and phones. Reduced motion: keep the fill (it's a position readout) but no smoothing.
- Must not cause layout shift or repaint the blur every frame (transform only).

## Must NOT change
Links, order, labels, the Regulations dropdown behaviour, the theme toggle, the one filled Book-a-demo pill,
the drawer content, copy anywhere. No uppercase mono labels.

## Report
One line per item in docs/home/DECISIONS.md (round 42), judgement calls, screenshots of the nav at the top and
mid-page in both themes at 1440 and 375. Check frame time while scrolling hasn't regressed (rough before/after).
