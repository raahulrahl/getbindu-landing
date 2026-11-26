# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

The homepage is built with React and TypeScript inside this Next.js app, in `features/landing/home/`. GSAP with ScrollTrigger for scroll scenes, Lenis for smooth scroll, and a lazy-loaded WebGL hero with a static fallback. Keep the JS bundle lean.

## Users

EU importers of goods covered by the EU Deforestation Regulation (EUDR) and related trade rules. The person who files the due diligence statement is often the owner or managing director, with no compliance team and no developers on staff. They need plain language for business owners, not developer language.

## Product Purpose

Bindu files the EU due diligence statement that importers must submit before placing EUDR-covered goods on the EU market, and keeps the records. The filing reference number goes on the customs declaration. The homepage is the new design for getbindu.com (The73 B.V., Amsterdam; founder Raahul Dutta). It was designed in a separate mockup repo and ported here. The live site is still served by shelley.

Success for a visitor: they understand what they must file, what it costs, and they book a 30-minute demo.

## Positioning

A filing tool for the importer who has no compliance team: one EUDR filing at €249 with no seats and no annual contract. Bindu is built on Eclipse Tractus-X. Identity signing (W3C DID) is live.

Claims must stay within the facts in the Capabilities section below.

## Operating Context

- Importers submit the due diligence statement in TRACES, the EU's system. Its reference number goes on the customs declaration.
- Customs agents often handle the declaration. Suppliers and co-ops provide plot and geolocation data.
- Records are kept for five years (€50 included). An optional €100 keeps them for ten years.
- Visitors read on phones at work and on desktops; the site must work at 375, 768, 1440 and 1920px.

## Capabilities and Constraints

Live now:
- EUDR filing (due diligence statement in TRACES, reference number out).
- Identity signing (W3C DID).

In build, never shown as live: CBAM, product passports, PPWR packaging, REACH, HS classification, the supplier exchange (Sealed: mTLS + OAuth2), and agents (Settled: A2A + x402).

Prices (exclude VAT): €249 per EUDR filing = €199 to file + €50 to keep records five years. Optional €100 keeps records ten years. Workspace €20 a month. No seats, no annual contract.

EUDR dates (source: European Commission EUDR page, checked 12 Nov 2026): goods must not come from land deforested after 31 December 2020. 30 December 2026 applies to medium and large companies; 30 June 2027 applies to most micro and small companies. Never give one date as if it applies to everyone.

Undecided, placeholder only: the exact brand hex values (yellow `#FFD400`, cobalt `#0047AB` are placeholders), security certification, data-ownership wording, customer logos, and the FAQ answers marked "Answer from Raahul".

Never claim Bindu takes on the customer's legal liability, never promise outcomes at customs, and never say "fully compliant" or "guaranteed compliance".

## Brand Commitments

- Design authority: `docs/home/DESIGN.md` (tokens and rules) and the `bindu-design` skill (copy, honesty and QA). Where they disagree with a taste skill, they win.
- Palette: black and greys for about 90% of the page. Yellow means act, live or the number that matters (one filled pill per view). Cobalt means the system working. Never give the two the same job. In-build status is a neutral dashed outline.
- Motif: the sunflower as geometric dots on a golden-angle spiral (one dot = one piece of proof). A proposal until Raahul approves the mark.
- Voice: sentence case, short sentences, active voice, headlines of eight words or fewer, buttons that say exactly what happens. Explain a term before naming it.
- Every illustration (app frames, feeds, maps, example shipments) carries a visible "Illustration" label.

## Evidence on Hand

No customers, logos, testimonials, metrics, certifications, awards or time-saving figures exist yet. Do not invent any of them. Where one is needed, use a clearly marked placeholder such as "Placeholder: waiting for Raahul".

Demo links go to `https://cal.com/raahul-dutta-bpcqoa` (no UTM). No analytics or trackers.

## Product Principles

1. Audience first: the importer who files, not the compliance team they don't have.
2. Show only what is live. Anything in build is visibly not live.
3. Prove every claim with a fact from the record, or leave a placeholder.
4. One idea per section; one primary action per view.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast 4.5:1, UI graphics 3:1. Every control reachable by keyboard with a visible focus ring; dialogs trap and return focus; Esc closes. `prefers-reduced-motion` shows static end states with no movement. Pages read fully with motion off.
