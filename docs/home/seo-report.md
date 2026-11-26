# Homepage SEO report (23 Nov 2026)

## Changed
- Skills seo, squirrelscan, blog-analyze reviewed: no scripts shipped (only SKILL.md, LICENSE.txt, references). All MIT, matching docs/home/LICENSES.md. Each got the "CLAUDE.md wins, never index" line.
- `app/(en)/(home)/page.tsx`: added homepage JSON-LD (SoftwareApplication with Offer, FAQPage). Validated: parses, rendered on the dev server.

## Already correct (no change)
- Title: "Bindu: Trade Compliance Software for EU Import & Export"
- Description: "Bindu is trade-compliance software for EU import & export. Describe a shipment once; Bindu screens EUDR, CBAM, DPP and tariff rules and files the artifact."
- Canonical `/`, Open Graph and Twitter image (`/bindu-card.jpg`), one H1 in the hero, h1 > h2 > h3 without skips.
- Organization and WebSite JSON-LD come from `LandingJsonLd` in `app/landing-chrome.tsx` (not duplicated; the new node points at `#org`).
- Full Circle captions are real HTML (`ol.th-beats`); Ask beats are real `h3` text.

## Schema added
- SoftwareApplication: Offer EUR 249 per EUDR dossier, excl. VAT (the only published price).
- FAQPage: the two answered, visible FAQ items plus the supplier-data one; unanswered ("Raahul") items are excluded.

## Left for shelley
- `landing-chrome.tsx` says SoftwareApplication was removed for a rich-result error (no aggregateRating). Decide whether to keep this node.
- Ask scenario text inside the SVG stage is not duplicated in HTML (only captions and beats are).
- Regulation links in the nav and footer were not audited here.
- Re-add FAQ items to the schema as Raahul supplies answers (it follows `faq.items`).
- squirrelscan not run: `squirrel` CLI is not installed locally. Console check at 1440 not run.
