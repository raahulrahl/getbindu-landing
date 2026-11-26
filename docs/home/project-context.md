Bindu landing page: project context

Read this before planning or writing anything. It is the source of truth for facts, design and rules. Decisions here override older notes, skills and earlier rounds. When something here is wrong or out of date, update this file.

Last updated: 26 Nov 2026 (r65-20 What buyers say is a pinned scroll-driven scene on desktop, endless tap and swipe row on phones; r65-19 statement chip word at full sentence size, 55 dots in two lighting groups; r65-18 Work Sans for all homepage text, switcher removed; r65-17 the statement chip fills bottom to top on its own scroll range with its dots lighting upward, pinned titles 10px under the nav; r65-15 chip fill; r65-16 font trial (removed in r65-18); r65 built, see DECISIONS.md "Round 65 (built)"; spec: Newsreader everywhere, monochrome with cobalt, nav GitHub/Docs/Sign in, Full Circle removed, rules video grid, blog carousel, see rounds/round-65.md; r64 built: font trial switcher removed, Rubik for headings and body, see DECISIONS.md Round 64; r62 built: the ending, see DECISIONS.md Round 62; r61 built: the ten audit "fits" fixes, see DECISIONS.md Round 61; r60 built: seven enhancement passes, see rounds/round-60-findings.md; r59 built from the component review: fonts, hero, statement, story, Full Circle, shipment map, board, testimonials and rules; r55 to r58 built before it: DESIGN.md v4, Ollama with yellow and cobalt accents; r52 built; r51 done, PR #2 open)

1. The project
What: the redesigned Bindu homepage (`/`), designed in a separate mockup repo and ported into this repo in `features/landing/home/` (React + TypeScript in Next.js, GSAP + ScrollTrigger, Lenis, three.js for WebGL). Where this brief mentions sub-pages, those were mockup-only: this repo's real pages are used instead.
Who: built by Austin Dcosta (contractor) for Bindu.
Raahul Dutta: founder, final decisions.
Suraj Biswas (suraj@getbindu.com): reviewer; daily sync at 8 PM IST.
Status: ported into getbindu-landing; the live site is still served by shelley until the merge-back. The mockup badge is not part of the port. Status rule (Austin, 22 Nov 2026): whatever is shown on getbindu.com is live, so Full Circle is live (the "Ask your supply chain" theatre was removed in r44 and folded into the shipment map). Never add "in build" or "Coming" to something that is on getbindu.com.
Repo: this repo mirrors shelley's paths for merge-back (see README.md). Keep the homepage portable: no absolute paths; config (cal.com link, theme defaults, copy) in clearly named files (`features/landing/home/config.ts`, `content.ts`).
Baseline: the dark design that ran on the 5182 build is the approved layout. Light theme = same layout, colours only.
2. The company (facts, don't change them)
Bindu, run by The73 B.V., Amsterdam. "Bindu" means "dot".
EU trade-compliance software ("trade-compliance OS"). You describe a shipment once in plain language; Bindu works out which EU rules apply, the HS code and the evidence each rule needs, gathers proof from suppliers (email/WhatsApp), and files or prepares the paperwork.
Regulations and status (use exactly these labels):
Area	Status
EUDR (deforestation): files the due diligence statement to TRACES, returns the reference customs asks for	Live
Textile passports (ESPR / DPP)	Live (as labelled on getbindu.com)
Battery passports, other DPP groups	In build
CBAM	In build (site claims it in present tense, no label; Raahul to confirm)
REACH, PPWR	In build
HS code classification	Tab exists on the site; status unconfirmed
Identity layer: every answer signed (W3C DID)	Live
Sealed transport (mTLS + OAuth2), agent settlement (A2A + x402)	In build
Agent layer is open source (github.com/GetBindu/Bindu), built on Eclipse Tractus-X. Workspaces are single-tenant; no data crosses between companies until the exchange layer ships.
EU-hosted, GDPR compliant.
3. Pricing (exact, from getbindu.com)
Title: "What each filing costs." Intro: "One platform for five regulations. You pay per filing, not per seat."
Tabs: EUDR (first, default) · HS Code · CBAM · DPP · PPWR · REACH.
EUDR due-diligence dossier: €249 = €199 to file the statement to TRACES and return the reference + €50 to keep the dossier the 5 years the law requires. Option: €100 to keep it 10 years (site doesn't say if this replaces or adds to the €50). Workspace: €20/month.
Per filing; no seats; no annual licence. Competitors bill per seat or per year. Prices excl. VAT.
Other tabs: no published price → "Pricing on request". Never invent prices.
4. Key dates

EUDR applies from 30 Dec 2026 for medium/large companies and 30 Jun 2027 for most micro/small companies (micro/small timber already under the old EUTR: 30 Dec 2026). Proof: goods not from land deforested after 31 Dec 2020, and produced legally.

5. Audience
Lead buyer: the EU importer (first placer) with no compliance team, often the owner or MD. Also exporters, co-ops, customs brokers, traders.
80%+ are 35 or older and mostly use light-mode tools.
Goods: coffee, cocoa, rubber, textiles, batteries, chemicals, packaged goods.
Top pains: suppliers won't send data; unsure which rules apply and by when; fear of goods held at customs; cost; no staff for it; trust in a small vendor.
6. Messaging rules
The homepage is NOT EUDR-specific. Present Bindu's core technology across all regulations. EUDR detail belongs only in the EUDR tab, the EUDR story in the shipment journey, and the EUDR sub-page.
Main angle (r36): traceability through documents. Every line of the record points back to the supplier document behind it. Not EUDR-specific.
Customer is the hero; Bindu is the guide. Plain language for business owners.
Headlines ≤ 8 words. Explain a term before naming it.
Use buyer words: shipment, supplier, proof, record, filing, reference number, customs, due diligence statement (EUDR only).
Avoid: seamless, effortless, unlock, empower, streamline, revolutionise, leverage, elevate, AI-powered, next-generation, end-to-end, "guaranteed" or "fully compliant", regulation numbers, unexplained acronyms.
7. Honesty rules (always)
No invented customers, logos, testimonials, metrics, certifications, prices or time savings.
All example shipments, documents, routes, chats and reference numbers are labelled "Illustration".
In build is never shown as live. In build stories end in "coming", never in a completed filing.
Bindu does not take on the customer's legal liability; don't imply it.
8. Calls to action
Primary everywhere: "Book a 15-minute demo" (or just "Book a demo"). Never "30-minute". Highlighted (yellow pill or clearly highlighted link).
Demo CTA only in: nav and hero (r34-4 removed the final-view button at Austin's request). No demo buttons repeated in every section.
"Estimate your cost" is secondary: only in the pricing section and the calculator popup (which ends with the Book a demo button).
cal.com link lives in one config value. TODO: need the 15-minute event URL from Bindu.
9. Design system
r55: docs/home/DESIGN.md v4 is the one design system: the Ollama DESIGN.md copied whole (VoltAgent awesome-design-md, MIT), then a "Bindu adaptation" list (fonts, yellow and cobalt accents, dark theme from the file's dark tokens, floating nav, Bindu motion, 3D testimonials and finale kept, hero title size, outcome colours, dot map behind everything). v3 (Sublime) is at `rounds/DESIGN-v3-r54.md`, v2 at `rounds/DESIGN-v2-r52.md`, v1 in git e51c51c; the component lines below that describe v1 to v3 (bands, mono caps, Sublime radii, shadows, masks) are history where they disagree with this paragraph. Tokens in `features/landing/home/styles/tokens.css` keep their old NAMES with Ollama VALUES.
Look (r17 on): ink-and-paper, in the spirit of Notion. Display weight 600 in Inter, tight negative tracking, body line-height 1.5, no glows or shadows (the tokens are set to `none`/`transparent`), one hairline everywhere. Key numbers are plain text colour (`--key-num`); yellow is for the primary pill, the Live chip and the dots.
Colours (r65, wins over the rest of this paragraph and the next): monochrome with cobalt, except the two Bindu moments (the statement chip and the finale ı sunflower), which stay yellow #FFD400 (r65-8). All text one ink (#111 light, #F2F2F2 dark), light canvas #FFFFFF, dark #0A0A0A; no yellow anywhere (Book a demo is a cobalt pill with a white label, the Live chip an ink fill, dots and shipments cobalt); the only shadows are the r65 cards. History: yellow `#FFD400` and cobalt were placeholders until Bindu sends exact hex. Yellow = the main action, the Live chip, proof dots. Cobalt = the system: lines, links, active states, progress, QR data dots; on dark `--cobalt-signal #3D7BFF`, on light `#1F55C4` for lines and `#08327A` for links and text. "In build" chips: grey dashed outline. Never `#000` or `#fff` as a surface.
Light theme (default, set in tokens.css, r22-13): canvas `#F1ECE1`, panels `#FBF9F4`, nested `#E7E1D3`, hairline `#CFC8B6`, ink `#0E1A30`, body `#2F3A56`, mute `#434E6A`; yellow stays `#FFD400` with `--yellow-outline` as its edge. Dark theme: canvas `#0A0A0A`, panels `#141416`, nested `#1C1D21`, off-white ink lines `#EDE8DA`. Both themes: identical layout; only colour tokens differ. Saved in localStorage, no flash (inline head script).
Ink line: `--line-ink` draws the guide ship, the strike lines and the single-line drawings. Dots: `--proof-dot` (yellow, with `--yellow-outline`) and `--route-line` / `--cobalt-signal`.
Backgrounds (r56): no section paints a background; the fixed dot map shows behind every section. Content sits on hairline canvas cards or on the r48 feathered blur layer. Nothing is inverted except the one pricing card (`#171717` with white text on light; white with black text on dark).
Type (r65-18): Work Sans (variable, next/font, `--font-work-sans`) for every text, headings 500, code ui-monospace; Newsreader (r65-1) and the r64 line below are history. Type (v4, r64): Rubik (400 to 700 via next/font) for headings and body, code `ui-monospace`, set through `--font-display`, `--font-sans`, `--font-mono`. Section titles 36px/500/1.2 (display-lg, r56 +6), hero `clamp(48px, 7vw, 96px)` lh 1.05 (r56), heading-lg 28/600, heading-md 22, heading-sm 20, lead 20, body 18/1.5, small 16, caption 14, buttons 16 (r56 type bump), letter-spacing 0. Sentence case. Mono for regulation numbers, codes, map labels and prices of ledger rows. r59: the hero title is `clamp(48px, 8vw, 120px)`, weight 600, tracking -0.035em, line height 0.98 (adaptation 8); every h1 to h6 is the display face at weight 600 (no synthetic bold); stage UI (story, Full Circle) is body face 14 to 16px, labels 500 and values 400, ui-monospace for codes, Lucide icons (ISC) at 16px 1.5px stroke.
Spacing (v4): 8px base, container 1200px, gutter 16 to 32px (20 on phones). Sections have no min-height; padding 88px (64px from 640px down to 1023, 48px under 640); head to content 32px. Radii: pills `9999px` (buttons, chips, tabs, nav), cards 12px, code chips 6px. No shadows anywhere.
Buttons (v4; r65-9: every control is a 6px-radius rectangle, no pills; nav bar 12px): one `.btn` set, 36px (44 on phones), pill, padding 0 20px, Inter 500 14px, 1px border, colour-only hover. `bh-btn-primary` is yellow with a black label (Book a demo only); `btn-secondary` white with a hairline-strong border; `btn-ghost` surface-soft. Tabs are secondary pills, the active one cobalt with a white label. Chips are 24px pills: Live yellow with a black label, In build a hairline outline, Illustration surface-soft.
Nav (v4): the floating bar is canvas with a 1px hairline and full radius, no shadow, no blur; links Inter 14px 500 mute; the active section pill is a cobalt tint; Book a demo (yellow) in the expanded bar only; collapses to a logo-only pill (r42/r43).
Headings and motion (v4): every `main h2` and its lead fade up 30px, once on entry (GSAP, `lib/headings.ts`); the yellow full stop is gone. Everything else animates as before (MOTION.md), drawn in Ollama greys with cobalt lines and yellow dots. No CSS hidden states for GSAP targets.
Motif: "Bindu = dot". The dot of the dotless ı in the finale is a sunflower of 34 dots (yellow centre, cobalt rim); the guide ship is built from the same 34 dots; the nav and footer logo is Bindu's official sunflower (r36-3: `public/home/bindu-logo-*.webp`, from GetBindu/Bindu `assets/bindu_logo.png`); the dot `Mark` stays only on the statement chip.
The ink ship guide (r17 to r30): a small container ship drawn in ink sails a dashed lane in the gutter (straight 4px dashes, 6px gap, perpendicular ticks), tilts up to 3 degrees, bobs up to 2px, and is drawn on one fixed canvas. It stops at each section anchor and drops yellow proof dots. Where the gutter is under 50px it is a 10px yellow dot with an ink ring. The hand-offs (map to gutter ship, ship to the ı dot) are pure functions of the scroll position, so they play at any speed and reverse on scroll up. The scroll-progress dot rail sits in the right gutter from 1100px.
Motion: calm, readable, scroll-linked and reversible; GSAP + ScrollTrigger + Lenis; the hero's pause button freezes the guide and the map; reduced motion = composed end states, no pins; canvases cap DPR at 1.5 (1 on phones); WebGL lazy-loaded. Sounds are not part of this repo (removed after the port). Recreate reference effects in our own code.
Phones (r35, r54): everything behind `@media (max-width: 767px)` in `styles/mobile.css` or the shared `isPhone()`; 768px and up is untouched. Gutter 20px, body 17px, body-small 16px, tap targets 44px, safe-area padding. Section display is the v3 40px floor; pinned heads on phones stay small so the window fits. Phones skip the intro, three.js and the eager Lenis load (speed, r41 web-quality). Shorter pins: journey 220svh, departures board 100svh + 18svh per row, finale 285svh. See `docs/home/mobile-critique.md`.
Round 60 additions (25 Nov 2026): section lead lines and the Full Circle label use the body colour (charcoal on light, 85% white on dark), not the mute grey; hover colours on shared buttons, links and tabs only inside `@media (hover: hover)`; `prefers-reduced-transparency` removes the section blur layers and `prefers-contrast: more` steps hairlines and mute greys up; the theme swap suspends all transitions for one frame (`theme-swap` class from lib/theme.ts); the one heading reveal is lib/headings.ts (the old `rv` CSS clip-path mask is deleted); labels are sentence case and untracked (no tracked capitals, no middle-dot meta strings). Section titles are weight 600 (r60 follow-up, Austin approved). Go-live: the testimonials are labelled Placeholder; replace with real quotes or remove.
10. Page structure (current homepage, in order)

Source of truth: `features/landing/home/home-page.tsx`. Update this list when it changes.

Intro (first visit, about one second): one dot blooms into the mark, then hands off to the hero. Returning visits and reduced motion skip it.
Nav: 24px official logo and wordmark; links How it works (#story, r65), Pricing, FAQ, one "Regulations" dropdown (EUDR, CBAM, REACH, PPWR, Passports; r38-1), Blog; theme toggle; GitHub stars, Docs, Sign in (r65, from 1180px, drawer below); Book a demo on the expanded bar (r52); a drawer on phones (44px targets) that keeps "Book a demo". Desktop is the floating bar of section 9 (r42/r43); past the hero it collapses (GSAP, 0.7s) to a 56px round pill with only the logo; hover or focus expands it. No progress rail, no sound button, no skip-intro button.
1. Hero (`#top`): r65 title "Ship it. / Trace it. / Bindu."; centred headline at `clamp(48px, 7vw, 96px)` (r56), one sub-line, the yellow demo button (all fade up 30px after the intro), a pause button, over the dot-map with yellow shipments that fade out with the hero (r33-3). r59-1: title `clamp(48px, 8vw, 120px)` (up to 1400px wide, one sentence per line), a strong halo of the map's dimming round the title box and a lighter one round the sub-line, the title moves at 0.85 of the scroll speed on desktop, the sub-line is 20 to 24px charcoal in two balanced lines and fades up word by word, then the button. No particle effect (dropped by Austin).
2. Statement (`#statement`): "Describe your shipment. Bindu handles the rules, codes, evidence and filing." (r65-14) One full window (`min-height: 100svh`), `clamp(34px, 5.2vw, 76px)`; words, the yellow Bindu chip and the mark light up from mute to ink as you scroll. r59-2: one GSAP timeline on one ScrollTrigger (`scrub: 0.6`); each word's opacity ramps 0.45 to 1 over a window three words long, overlapping its neighbours; the chip fill, its text and the mark's dots are on the same timeline.
3. Story (`#story`, `Flow.tsx`, r44 to r50, r55): "One shipment, four steps." One pinned, scrubbed stage (500svh) in one hairline panel. Left: a progress line (a cobalt line drawing between four round markers 1 to 4; the current marker fills ink and its name slides in under it) and the step title with a one-line caption (the step number shows once, in the marker). Right: a sentence types in, docks into a filing record, two suppliers answer on cobalt routes, a reference comes back. Phones and reduced motion: the four steps as a list and the finished record. All an Illustration. r59-3: pin 360svh, `scrub: 0.4`, each step plays in its first half and holds, at most two things move at once; the stage is an app frame (40px title bar, text input, key/value record table, 28px chips, message cards, Lucide icons), no hand-drawn paths.
4. (Removed in r65.) Full Circle (`#how`, `Theatre.tsx`, r39-2, r41-2, r44, r54; replaces How it works, removed in r39-1): "Full Circle." is a small label; the h2 is a buyer question per act (Fabric "Where did the cotton come from?", Bean "Can this coffee prove its farm?", Circle "Who can read this shirt's record?") and fades out up then up on tab change. r54: a centred head (label, title, lead, tab row of secondary buttons) above ONE panel that holds the stage and, under it on the left, the current caption with its yellow dot and scene dots. Pinned and scroll-driven, never a video: only the chosen act plays, 100svh per scene, eased scrub; tabs swap the act. One Illustration chip. Phones and reduced motion: the final frame of the act with every caption listed. r59-4: the act title is the same size and weight as every section title, the current caption is body 18px ink 500, the stage is the story's app frame with the act name and the Illustration chip, one 1.5px cobalt stroke width, drawing labels in the body face at 14px (11px on a small stage).
5. One shipment from origin to customs (`#shipment`, look as at dbe0844, r58): pinned (420svh); a centred head (title, story line, tabs EUDR, CBAM, DPP, REACH, PPWR, status) on a feathered canvas fill; the map is a centred frame with a solid canvas ground (the page dots do not show through) and its own canvases at dpr up to 2; the question and its answer sit in the map's bottom-left corner; milestone notes sit beside the route and are placed so they never overlap each other, the question card or a map label. Each tab has its own route and cargo. Phones: map, then the compact milestone list; reduced motion: the stacked page. r59-5: the land is redrawn as vector at the camera's scale every frame (the old pre-rendered bitmap that the camera scaled is gone; that was the blur), Natural Earth 1:50m coast (`lib/landfine.ts`), the five routes are generated sea lanes that stay off the land (`lib/sealanes.ts`, `scripts/gen-sealanes.mjs`), the camera starts wide, follows the ship, leans in at each milestone and pulls back at the end, the wake fades over 70px.
6. Departures board (`#examples`, split-flap as at dbe0844, r58 flips): "What the rules let through, and what they stop." Pinned, one row per scroll step (8 rows, 4 let through, 4 stopped; EUDR, DPP, Battery in build); each flap is a real two-half split-flap (about 70ms per flip, left to right, a few random letters before the real one); "Let through" and "Stopped" tiles use `--board-pass` and `--board-stop`; the current row is ink with a yellow dot, earlier rows muted; the story, headline and verdict show under the board; the board has no opaque ground, so the dot map shows behind it. r59-6: the board is a solid panel and the dot map shows around it (the r48 blur layer no longer covers `.ex-stage`); flaps fold by scaleY and exist as layers only while a row flips; every row's flip and flip-back timelines are built on idle; scrolling back flips the row you leave back to blank.
6b. Testimonials (`#voices`, `Voices.tsx`): r65-12, an endless Legora-style row (big current card with a product screen, quote and speaker; small cards either side; arrows and a dot pill). History: the curved 3D card track as at commit 1ba9176 (sticky window, drag, arrow keys, snap, words light up, a route lane with a travelling yellow dot, sunflower index dots; phones swipe). Placeholder quotes and chip stay. r59-7: one style write per card per frame (no `gsap.set`). r60-1: the title is centred like every other section title; touch dots are 44px.
6c. Regulations (`#rules`, `Rules.tsx`): r65, a static 3-column grid of six parallel-style cards (warm-grey box, white window with the getbindu.com clip, one floating chip; icon, name, status, one line, "Read about X", source). History: r57, an infinite minimal gallery. A centred title and the line "Five EU rules, and where each one stands.", then one endless row of the five type-only tiles (ghosted mono regulation number, name, what it asks, goods, status chip, cobalt "Read the rule", source link; EUDR date unchanged). The row drifts at 20px/s, scroll velocity speeds it up and bends the tiles (skew up to 8 degrees, flat at rest); drag, sideways wheel, hover pause, focus and arrow keys. Not pinned. Phones and reduced motion: a native scroll-snap row. r59-7: only the tiles in view are bent, and they are layers only while the row bends.
Map blur (r48): one feathered 10px backdrop-blur layer behind each content window past the hero, no tint (Austin: "I shouldn't be able to tell the difference"). r59-6: the departures board window (`.ex-stage`) is no longer in the blur list; the board is a solid panel and its heading and verdict story sit on a plain canvas fill with feathered edges.
7. What each filing costs (`#pricing`, r55-8): centred head + tab row; one inverted card (`#171717` with white text on light, white with black text on dark) split in two (receipt left, included list and a white "Estimate your cost" pill right); the price is display-lg in the display face with an odometer whose clip box shows the whole number.
7b. Blog (`#blog`, `Blog.tsx`, r65): "From the blog.", a scroll-snap row of six post cards (same card), arrows and "All posts"; posts from frontmatter.
8. FAQ (`#faq`): a centred head over a 720px list in one hairline card, accordion rows divided by hairlines, plus/minus icons.
9. Finale (`#demo`): the getbindu.com port clip (`rotterdam-port-hero`, poster on phones and reduced motion; r52-2) seen through the letters of "bındu"; it zooms to the end of the scroll; (r62) the guide ship breaks into its 34 dots where its lane ends and they fade there, and the ı builds its own 34-dot sunflower; (r65-11) the mask is the letters only, the ı dot is only the yellow sunflower, and the mask zooms around the right leg of the n until the video fills the whole window, holds a moment; then the footer rides up over it (r55-3, as at 1ba9176: brand and four link columns on one grid, the roles row, a rule and the legal line, white text on the dark gradient). No closing title, no demo button in the final view (r34-2, r34-4).

Removed for good: How it works with the QR/paperwork window (r39-1); "Start with EUDR"; "Who's behind Bindu" (moved to /about); "Who Bindu is for" role cards (r17-11); "Four documents become one record" (deleted with r17-8; its idea lives in How it works); the hero selector (r34-3); the old earthy theme; sounds (this repo); "Sound familiar?" `#pains` and the Ask theatre `#ask` (r44).

Sub-pages: matching the main site (EUDR, CBAM, REACH, PPWR, passports, blog index, about), same design system, short.

11. Working rules for coding agents
Only change what the spec lists. Never redesign, restructure or restyle anything else.
Edit in place; one commit per numbered item; keep `features/landing/home/` as the only homepage.
Every section fits one viewport; titles stay visible in pinned sections; two-column sections share one grid and top line.
QA: 375 / 768 / 1440 / 1920, both themes, no horizontal scroll, demo links → cal.com, reduced motion, no console errors.
Report briefly: one line per item, judgement calls, a few screenshots. No recordings.
Third-party code, effects, fonts, data: record in docs/home/LICENSES.md with commercial-use status. Hyperiux Vault: free effects only.
12. Open questions for Bindu
Exact brand yellow and cobalt hex values (from the main app).
The 15-minute cal.com event URL.
CBAM, battery passport and HS code status.
Does the €100 ten-year option replace or add to the €50?
Volume pricing (a 600-container importer pays about €149k/year at €249).
Hosting/security details and any certification (ISO 27001 / SOC 2).
Real customers or pilots that can be named; filings accepted so far.
Single long page vs multi-page (Austin's research task; leaning: short homepage + separate indexable pages per regulation, pricing and FAQ).
Commercial-use clearance for every animation and asset (Austin's task).
A ~3840px ship sketch for the finale (the 1920px source blurs at DPR 2).
Real testimonial quotes (exist; need Raahul's approval) to replace the placeholders.
Footage source and licence of the port clip (`public/videos/rotterdam-port-hero*.webm`, named Rotterdam; Austin calls it the Amsterdam port video).
Verify the `#rules` regulation numbers and EUR-Lex links (written from memory) and CBAM's status.
13. Taste notes (what Austin liked and rejected)

Liked:

The dark 5182 build; dot/sunflower intro; world map with yellow shipments.
Full Circle-style "pick an act, it plays itself" storytelling.
The shipment journey animation; scroll-linked motion that replays.
Clean, minimal, editorial layouts (x.ai, Together AI, Apple).
Motion quality bar: Rothfinder; restraint: Walbi (Awwwards).
parallel.ai's compact header; the old "Ask your supply chain" questions theatre.

Rejected (don't bring these back):

Anything that looks AI-generated: card grids (except the r65 parallel-style rules and blog cards, Austin's call), icons in circles, badges, "solved" chips, gradient blobs, glassmorphism everywhere.
Too much text in the hero or intro; long paragraphs over animation.
Many repeated demo buttons; "Estimate your cost" as the main CTA.
Titles sliding out of pinned sections; empty halves; small text next to big animations; left/right misalignment; content popping on alternating sides (use linear chains instead).
EUDR-specific copy or visuals on the homepage.
Big redesigns when only small changes were asked for.
Flat single-colour maps; bright flashy yellow; the old earthy theme.
Busy tab/slider controls (navy track, glow, dot pattern, status dots): too much (r15).
Social-proof avatar rows or "Join N+" lines (we have no customer numbers).
Cool blue-grey light theme (r15 first pass): too cold; same for a blue tint band (r40).
Full Circle as an autoplaying video, or playing every act on scroll, or scrubbing too fast (r41).
Blurring or dimming the whole map (r40-3): blur only behind content.
"In build" or "Coming" on anything live on getbindu.com.
A tinted or colour-washed blur behind content (r48); nested blur layers (they glitch).
Busy nav chrome: section labels, progress rail (r43). Book a demo is back in the expanded bar (r52), never in the collapsed pill.
Mono uppercase button, tab and chip labels (r52, parallel style); any button motion (magnetic pull, dot burst, nudge, press scale).
A different look per section, borrowed from a different site each time (r52: one system, DESIGN.md v2). Changing the colour theme or fonts in a design round unless Austin asks (he did in r65).
Stiff, linear or "vibe-coded" story motion (r46 to r49); bland tiles and cards with nothing of the theme (r47).
14. References
Background (r53): open-design.ai kami (open-design.ai/plugins/design-system-kami, from tw93/kami, MIT). Components (r52): parallel.ai, shapes only.
Design files: github.com/VoltAgent/awesome-design-md (x.ai, together.ai, apple; clickhouse + miro for the light theme).
Motion: awwwards.com/sites/rothfinder; awwwards.com/inspiration/ scroll-animation-walbi-2; awwwards.com/inspiration/ map-interaction-sweeping-corp; Hanwha Ocean ship scroll animations; Stripe's sunflower-dot globe (stripe.com/blog/globe); Madar route lines.
Section patterns: trajectory.ai (product mock + steps), mailerbot.com (process, "tailored for you"), belli.ai (one rotating module section).
Effects library: Hyperiux Vault (free effects only, marked commercial-friendly).
Free MIT libraries (ideas rebuilt in our code; record any copied code in LICENSES.md): Magic UI, Uiverse, HyperUI, Flowbite core. Check Aceternity and Preline licences first.
Galleries (look only; maxibestof is personal-viewing only): maxibestof.one, unsection.com, Awwwards inspiration (pricing: Finsight, Klub, Good Fella, HeyOrca; buttons: Strakk, Edifis, Modulus).
Licences: see docs/home/LICENSES.md (created r15): GSAP standard no-charge, Lenis MIT, three.js MIT (replaced OGL, Unlicense), React MIT, Inter and IBM Plex Mono OFL 1.1.
Skills installed in the repo: frontend-design, bindu-design, polish / impeccable, Unslop, UI/UX Pro Max (layout only, not its palettes), strategic-narrative; slop checks (gates only): hallmark, avoid-ai-design (scanner `scripts/detect.mjs`), antislop + antislop-ui, make-interfaces-feel-better, heydamir-unslop (r41-3); enhancement (r60): critique-impeccable and bolder (pbakaus/impeccable, Apache-2.0), 12-principles-of-animation (raphaelsalaja userinterface-wiki, MIT), apple-design (emilkowalski, MIT), better-ui (jakubkrehel, MIT); web quality (addyosmani, MIT): performance, core-web-vitals, web-quality-audit, best-practices; SEO: seo, squirrelscan, blog-analyze; product-demo (videos in `out/product-demo/`, gitignored). `.mcp.json` adds chrome-devtools-mcp.
15. Speed and SEO (web-quality branch, 23 Nov 2026)
Speed passes: font preloads 10 to 4, Ask logo webp, Lenis on idle on phones, below-the-fold sections hydrate late (a ready registry lets headings, bands, guide and rail pick them up). Numbers in `docs/home/stats.md`; laptop Lighthouse is noisy (mobile 61 to 80, desktop 72 to 96), so judge on PageSpeed Insights from a deployed preview. Remaining levers: react-dom + gsap on phones; on desktop the intro hides `.hero-sub` (LCP ~2.7s), an open decision (shorten intro or show the hero text under it).
SEO: title "Bindu: Trade Compliance Software for EU Import & Export", canonical "/", og image `/bindu-card.jpg`, JSON-LD FAQPage only. No SoftwareApplication node: its rich result needs ratings we don't have (never fabricate). SEO 69 here is the deliberate noindex; `app/robots.ts` is never copied back to shelley, so production indexing is unaffected. Suraj accepts a 2 to 3% score hit only for deliberate creative choices.


16. Recent rounds
19 Nov 2026 · r14 to r16: pinned journey with own routes; pricing split card; warm ivory light theme; Inter + IBM Plex Mono.
Rounds 17 to 35 (branch v3-story, one story): ink-and-paper restyle with no glows (r17); ink ship guide, straight dashes, staged hand-offs as pure functions of scroll (r18 to r30); How it works with kinetic type, event log and QR passport (r21, r28); departures board, one row per scroll step (r31, r33); page bands that crossfade (r29-7); the finale as a photo through the wordmark with the 34-dot sunflower ı (r28 to r34); performance passes (r24, r25); phone pass (r35). Details: DECISIONS.md.
22 Nov 2026 · r36: brief consolidated + consistency rules (r36-1); slop-check skills (r36-2); official logo + 56px nav (r36-3); Ask your supply chain section (r36-4); traceability threads in the File step + trace copy in hero, statement, Prove, FAQ (r36-5); slop pass, nothing failed (r36-6).
22 Nov 2026 · r37: shorter hero sub-line, hydration console errors fixed (`useReducedMotion`), consistency-audit fixes.
22 Nov 2026 · r38: one Regulations dropdown, sans nav type; Ask fits one window, 500svh, clear current step.
22 Nov 2026 · r39: How it works removed; Full Circle ported into `#how`.
23 Nov 2026 · r40: warm light tint, hero-only heading scrim, "Live" chip copy.
23 Nov 2026 · r41: map blur only behind content; Full Circle one act per scroll, slower; heydamir/unslop audit (scheduled headless run).
23 Nov 2026 · web-quality: speed passes 1 to 4, late hydration, finale ship sketch, SEO metadata, SoftwareApplication removed, demo videos + stats.
23 Nov 2026 · r42: floating nav bar, section dot, scroll-progress rail (commit 5373bb2).
24 Nov 2026 · r43: nav collapses to a logo-only pill, rail and bar demo button removed; hydration mismatches on late sections fixed.
24 Nov 2026 · r44 to r50: Story replaces #pains, Full Circle titles per act, Ask folded into the map, departures board fits one window, testimonials + rules carousel, map blur one layer per window, story motion rebuilt (r50).
24 Nov 2026 · r51: scheduled slop audit, 0 P0/P1, 2 P2 (chip sizes) left. PR #2 opened (fork web-quality to raahulrahl main).
25 Nov 2026 · r52 (spec): DESIGN.md v2 (frozen colours and fonts, parallel.ai components everywhere); finale ship sketch to the getbindu.com port clip; #rules as a horizontal card scroll (ref The Performance Lab); controls stay Inter; no button motion; Book a demo back in the expanded nav bar only.
25 Nov 2026 · r53 (spec): one paper background (kami): band crossfade retired, hairline rules between sections, one panel style.
25 Nov 2026 · r54 (in progress): DESIGN.md v3 from sublime.app replaces v2; step 1 foundation approved; r53 cancelled.
25 Nov 2026 · r54 (built): DESIGN.md v3 (Sublime) implemented in four commits (tokens and foundation, components, motion, sections); r52 built with it (r52-3 rules finished); screenshots skipped on request.
25 Nov 2026 · r55 (spec): Ollama DESIGN.md exactly; old testimonials and finale ending back; story, map, board, rules and pricing fixes.
25 Nov 2026 · r55 (built): DESIGN.md v4 (Ollama + yellow and cobalt) in tokens, components and drawings; story marker and one-line captions, shipment map without overlaps, readable departures board, rules pin fix, inverted pricing card, old testimonials and footer restored. Notes in DECISIONS.md "r55 build".
25 Nov 2026 · r56 (built): large hero title, dot map behind every section, Full Circle lines in cobalt, shipment map centred, board outcome colours, rules as a filing drawer. Notes in DECISIONS.md "Round 56 build".
25 Nov 2026 · r56 corrections: shipment map and board back to their dbe0844 looks, rules drawer reverted, type bump, full-window statement. r57: rules as an infinite gallery. r58: shipment map sharp and smooth, split-flap board. Notes in DECISIONS.md.

25 Nov 2026 · r59 (built): the component review with Austin. Fonts verified in build and start; every heading on the display stack; hero (bigger title, halo, parallax, sub-line, fade-up; the dots-build-the-title idea was dropped); statement wave; story as product UI with crisper motion; Full Circle type and app frame; shipment map vector redraw with real coast and sea lanes; departures board map visible and lighter flaps; testimonials and rules lag removed. Notes in DECISIONS.md "Round 59". Open: a long frame at each board row change in software raster, a real GPU and Safari untested.

25 Nov 2026 · r60 (built): seven enhancement passes, one commit each, findings in rounds/round-60-findings.md. Critique (title centred, ghost numbers quieter), bolder (leads one step darker), animation (removed the retired masked h2 reveal, a CSS hidden state on a GSAP target), apple-design (reduced transparency and more contrast), better-ui (hover only on hover pointers, theme-swap suppression, contained overlay scroll), anti-slop (no tracked capitals or middle dots in labels; detect.mjs at 0), consistency (departures story titles in the display face, one lead tracking). Conflicts not fixed are listed in the findings file.
25 Nov 2026 · r61: ten audit fixes: yellow-outline on the active testimonial dot, `color-scheme` follows the theme, pause button on the Rules loop, no `aria-live` on scroll-fed text, instant keyboard focus in Rules, `SCRUB_TIGHT`/`SCRUB_SOFT` in lib/motion, off-scale type sizes mapped to tokens (12px floor), `text-wrap: pretty` on body copy, hero text-shadow removed (map halo stronger), 160ms dialog exit. Permanent: no text-shadow on the hero; scenes use the two scrub constants; no live regions on scroll-fed text.
25 Nov 2026 · r62: the guide ship breaks into dots where its lane ends (nothing travels into the finale); the finale zoom dives into the ı dot and ends with the port video filling the window, then a short hold.
25 Nov 2026 · r64: the r63 font trial switcher removed; Rubik for headings and body (Nunito and Inter no longer loaded by the homepage), checked at 1440 and 390.
25 Nov 2026 · r65 (spec): Newsreader for all text; monochrome near-white/near-black with cobalt only (no yellow); nav adds GitHub stars, Docs, Sign in; Full Circle removed; #rules a static 3-col grid with the site videos; #blog carousel after pricing. Not built.
25 Nov 2026 · r65 (built): Newsreader everywhere; monochrome with cobalt (no yellow); nav GitHub/Docs/Sign in; Full Circle removed; hero "Ship it. Trace it. Bindu."; #rules parallel-style video cards; #blog row after pricing. Open: verify the battery regulation link; check 768/1920, reduced motion, board and story colours.
26 Nov 2026 · r65-15/16: the statement chip fills left to right with the scroll (clip-path wipe); the font trial picked Work Sans for headings and body (r65-18, switcher removed); the chip now fills bottom to top only while on screen, dots light upward; pinned titles in story, shipment and board sit 10px under the nav (r65-17); the chip word is the sentence's size with balanced padding, 55 dots, half light with the fill and half as you scroll on (r65-19); What buyers say is now a pinned, scroll-driven card scene on desktop with a hold on each quote, transforms and opacity only (r65-20).
