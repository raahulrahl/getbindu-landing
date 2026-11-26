---
name: bindu-design
description: Design, copy and honesty rules for the Bindu homepage (`/`) in this repo, in `features/landing/home/`. Applies to the homepage only; other pages follow docs/DESIGN.md. Use for any change to the homepage or any copy written for the homepage. Takes precedence over frontend-design and the other taste skills where they conflict, for `/`.
---

# Bindu homepage: house rules

Applies to the homepage (`/`). Other pages follow docs/DESIGN.md.

The homepage of getbindu.com (EU trade-compliance software; The73 B.V., Amsterdam; founder Raahul Dutta),
designed in a separate mockup repo and ported into this repo. **Never publish or deploy anything from this repo**
beyond the normal merge-back to shelley (see README.md): no Artifact tool, no hosting, no public links.

The earthy-sunflower direction (v1) is retired. Its files are not part of this repo.

## Precedence
1. The user's latest instructions.
2. This skill, then `docs/home/DESIGN.md` (the merged design system; this skill summarises it).
3. Taste and motion skills (frontend-design, landing-page-design, better-*, animate, design-motion-principles, etc.)
   only where they don't conflict. Ignore any skill advice to add logos, testimonials, stats, awards or urgency.

## Files
- `docs/home/DESIGN.md`: merged design system (x.ai + Together AI + Apple), with tokens.
- `features/landing/home/styles/tokens.css`, `features/landing/home/styles/components.css`: the tokens and components in code, all scoped under `.bindu-home`.
- `docs/home/MOTION.md`: motion research and the effect list (written before the motion pass).
- `docs/home/DECISIONS.md`: every interpretation and open question, rounds 1 to 35.
- `docs/home/project-context.md`: the brief, with a "Since round 15" section.
- App: React + TypeScript inside this Next.js app. GSAP + ScrollTrigger (scroll scenes), Lenis (smooth
  scroll), OGL or Three.js (WebGL hero, lazy-loaded, with a static fallback). Keep the JS bundle lean.

## Design system
Merged from awesome-design-md (github.com/VoltAgent/awesome-design-md @ fcc7028, MIT): design-md/x.ai,
design-md/together.ai, design-md/apple.

- **Base (x.ai):** near-black canvas `#0A0A0A`; large display type at weight 400 with negative tracking; mono
  uppercase tracked captions and eyebrows; every button is a pill with a 1px translucent-white border
  (`rgb(255 255 255 / .25)`); **only ONE filled pill per view**; hairlines, not shadows.
- **Structure (Together AI):** dark hero bands alternate with bright white reading bands; uppercase mono
  eyebrows and mono-caps button labels; a blueprint style for technical diagrams (cobalt lines on a faint
  cobalt grid, dashed = in build); one primary CTA per viewport.
- **Polish (Apple):** generous whitespace (section padding 80 → 160px), a strict type scale, restraint, crisp
  product framing (app frames are the "product photography"; the one allowed shadow sits under them), press
  state = 1px down (no scale), frosted glass only for floating/sticky chrome.

### Colour roles (strict)
- **Black and greys: ~90% of everything.** Dark: `--canvas #0A0A0A`, `--canvas-soft #141416`, `--canvas-mid
  #1C1D21`, `--hairline-dark #26282D`, text `#FFFFFF` / `#DADBDF` / mute `#8A8E95`. Light (round 14, see
  "Light theme" below): `--canvas #EEF1F5`, `--paper #F8FAFC`, `--paper-soft #E4EAF2`, navy text `#0B1B3A`.
- **YELLOW** `--brand-yellow` (placeholder `#FFD400`): the one filled primary pill ("Book a 30-minute demo"),
  "Live" chips, key numbers (€249, deadlines). Ink text on yellow. Never yellow text on white (1.4:1).
- **COBALT** `--brand-cobalt` (placeholder `#0047AB`) = the system: app frames, active steps, links, data
  lines, glows, progress, the agent-layer diagram. On black use `--cobalt-signal #3D7BFF` for lines and glows
  (5.2:1). **No cobalt text on black** (2.4:1): links on dark are white with a cobalt underline. Cobalt links
  and frames on white are fine (8.4:1).
- **Never give yellow and cobalt the same job.** Yellow = "act / live / the number that matters";
  cobalt = "the machine working". In-build chips are neutral dashed outlines, never yellow, never cobalt.
- The real hexes come from Raahul (open question in `docs/home/DECISIONS.md`). Until then keep the placeholders and
  derive every other step from them in `tokens.css`, so changing two values updates the whole site.
- No other accent colours. No decorative gradients except light (glows, trails) in cobalt or yellow.

### Light theme (round 14)
- Colour values only: `[data-theme="light"]` in `tokens.css`. Layout, sizes and animation match dark; boxes are identical in both themes.
- Base is a cool blue-grey `#EEF1F5`, not white. Panels a step lighter (`#F8FAFC`), the alternate band `#E4EAF2`.
- Navy `#0B1B3A` text and light navy-grey hairlines. Cobalt is for the system and links: `#0047AB` for text (7.45:1), `#2A63D8` for lines (4.78:1).
- Yellow `#FFC400` is for the highlights and shipments only, never text on light. Navy on yellow is 10.7:1.
- Inspiration: ClickHouse (yellow used sparingly) and Miro (yellow with blue on light surfaces). Keep yellow scarce.

### Sunflower and dot system (Bindu means dot)
- The sunflower is still the brand mark, made futuristic: precise geometric dots and points of light. No
  illustrated or photographic petals, no clip-art, no petal bullets.
- One dot = one piece of proof; dots on the golden-angle spiral make the sunflower = the filing.
- Colour roles hold: gathering dots are cobalt (the system); the completed sunflower is yellow (filed, live);
  a lone divider dot is neutral white.
- Mark: `features/landing/home/assets/bindu-mark.ts` (the SVG string; geometric redraw, one colour, yellow or white on black) in nav (28px),
  footer (40px) and favicon. It's a proposal until Raahul approves it.
- Uses: hero (globe dots flow into the yellow sunflower as filings land), spiral progress and loading, the
  single-dot section divider, the completed sunflower in the finale. At most one sunflower per view; never as
  decoration on white reading bands; never beside In build items as if they were done.

### Type
- Inter (display/body) + IBM Plex Mono (labels), both via `next/font` (round 16, see `docs/home/DECISIONS.md`).
- Display: weight 400, sentence case, tracking −0.018 to −0.025em: 96 / 72 / 48 / 32 / 20 (fluid; 48 at the hero
  minimum on phones). Body 17px / 1.47; lead 19px; small 15px; caption 13px.
- Mono uppercase: eyebrows 12px +0.12em; button labels 13px +0.06em weight 500; chips 11px +0.08em; numbers in
  mono with tabular figures. Never set paragraphs in mono; never set headlines in caps.

### Components (from the source systems only; don't invent new ones)
- Buttons: primary yellow pill (one per view) · outline pill on dark (1px white 25%) · outline pill on light
  (1px black 12%) · 44px circular icon button · text link. Min height 44px. Press = 1px down.
- Chips (pill): Live (yellow fill, ink text, dot) · In build (dashed outline, no fill) · neutral · Illustration.
- Cards: 8px radius, hairline border (`#141416` on dark, white on light). App frame: 18px radius, cobalt
  hairline + soft cobalt glow, mono title bar, "Illustration" chip. Blueprint panel for the agent layer.
- Steps / progress: cobalt signal for active. Section bands alternate dark ↔ light; the colour change is the
  divider (no decorative dividers).
- Focus: 2px cobalt ring on dark (cobalt-signal #3D7BFF, 5.2:1) and on light (brand cobalt, 8.4:1), always visible.

### Motion
- References (effects only; never copy code, assets or layouts): rothfinder.com (the quality bar),
  trajectory.ai, mailerbot.com, driessenarchitectuur.nl, x.ai, together.ai, belli.ai. See `docs/home/MOTION.md`.
- 60fps: transforms and opacity, one rAF per frame, WebGL paused off-screen and in hidden tabs.
- Scroll scenes are pure functions of scroll progress (they reverse on scroll-up and replay every pass).
- Easing: expo-out for reveals, in-out for scrubs. Anything that loops for more than 5s gets a pause control.
- `prefers-reduced-motion`: show every end state, static; no smooth-scroll hijack, no WebGL animation.

## Copy rules
- Audience first: the EU importer who files the due diligence statement and has no compliance team (often the
  owner or managing director). Plain language for business owners, not developers.
- Headlines 8 words or fewer; one idea per section; short sentences; sentence case; active voice; a button says
  exactly what happens.
- Use buyer vocabulary: due diligence statement, TRACES, reference number, plot, geolocation, shipment,
  supplier, co-op, five-year records, customs agent.
- Avoid: "agentic AI", "AI-powered", "end-to-end", "holistic", "guaranteed compliance", "fully compliant",
  seamless, leverage, unlock, empower, cutting-edge, regulation numbers, unexplained acronyms.
- Explain a term before naming it ("proof your goods weren't grown on cleared forest (EUDR)").

## Honesty rules (non-negotiable)
- No invented customers, logos, metrics, testimonials, certifications, awards or time savings. Where something
  is unconfirmed (security certification, data-ownership wording, customer logos), leave a clearly marked
  placeholder ("Placeholder: waiting for Raahul"), never invented content.
- Every illustration (app mocks, feeds, maps, chats, example shipments) carries a visible "Illustration" label.
- In build is never shown as live. Status today: **EUDR filing Live; identity signing (W3C DID) Live.**
  **In build:** CBAM, product passports, PPWR packaging, REACH, HS classification, the supplier exchange
  (Sealed: mTLS + OAuth2) and agents (Settled: A2A + x402). Built on Eclipse Tractus-X.
- Prices exactly: €249 per EUDR filing = €199 to file + €50 to keep records five years; optional €100 keeps
  them ten years; workspace €20 a month; no seats, no annual contract; prices exclude VAT.
- Never claim Bindu takes on the customer's legal liability, and never promise outcomes at customs.
- FAQ answers only from facts in this skill or the brief; anything else is marked "Answer from Raahul".

### EUDR facts (fixed; European Commission EUDR page, checked 12 Nov 2026)
Source (link it wherever the dates appear):
https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en
- Cut-off: goods must not come from land deforested after 31 December 2020.
- 30 December 2026: medium and large companies. 30 June 2027: most micro and small companies. "Small" is the
  EU company-size definition, not shipment volume. Never give one date as if it applies to everyone.
- The proof is a due diligence statement filed in TRACES (the EU's system); its reference number goes on the
  customs declaration.

## QA before handing over
- Widths 375 / 768 / 1440 / 1920: no horizontal scroll.
- Lighthouse performance ≥ 85 on desktop (built output, not dev server).
- `prefers-reduced-motion`: end states, static; page reads fully.
- Keyboard: every control reachable, visible focus, dialogs trap and return focus, Esc closes.
- Every demo link uses this repo's demo link (`DEMO_URL` in `features/landing/home/config.ts`, built from `lib/demo-url`). No analytics or trackers.
- No console errors.
- WCAG AA contrast for all text; 3:1 for UI graphics.
- Screenshot and look before reporting; report interpretations as a list; log them in `docs/home/DECISIONS.md`.

## Installed third-party skills
All instructions-only, project level, each with its own LICENSE file in `.claude/skills/`. Their provenance notes are at the top of each SKILL.md.

