Round 65 on the homepage (`/`, `features/landing/home/`). Small, incremental changes only. Follow CLAUDE.md
and docs/home/project-context.md. Only change what's listed. Austin's calls in this round override the old
taste notes they contradict (fonts, palette, card grid); log each in DECISIONS.md.

## 1. Type: one font, the getbindu.com heading face, everywhere
- Newsreader (as in `app/document-shell.tsx`: variable, opsz axis) for EVERYTHING: headings, body, nav, buttons,
  chips, cards, stage UI, map labels, footer, canvases that draw text. `--font-display` and `--font-sans` both
  point at it (Austin: "the whole site must have the same font"). Mono stays ui-monospace for codes only.
- Load it through next/font in `app/(en)/(home)/layout.tsx` in place of Rubik; drop Rubik; no Inter on `/`.
- Headings weight 500, tracking -0.01em; body 400; buttons and labels 500. Keep every size token as it is,
  but check small text (12 to 14px chips, captions, map labels) stays readable in a serif; raise to the next
  token only where it doesn't.
- Check the hero still fits one sentence per line at 1440 and 390; if it doesn't, reduce the clamp max, not the min.
- Must NOT change: the sizes scale, line heights, mono usage.

## 2. Palette: monochrome with cobalt
- Light (default): canvas `#FAFAF9`, panels/cards `#F2F1EE` (warm grey), nested `#E9E7E3`, hairline `#E2E0DB`,
  ALL text (ink, body, mute, leads, captions) `#111111`; use opacity 0.64 only for small meta such as dates and
  source lines, never for body copy.
- Cobalt is the one accent: links, active tab, active nav pill, progress lines, routes. Keep `#1F55C4` for lines
  and `#08327A` for link text on light, and `#3D7BFF` on dark.
- Yellow is removed: Book a demo becomes a filled cobalt pill with a white label (nav and hero, still the most
  prominent button); the Live chip becomes ink `#111` with a white label; proof dots, map shipments, guide ship
  dots, the testimonial index dots and the ı sunflower switch to cobalt/ink.
  The official Bindu logo image stays unchanged (it is the brand mark).
- Dark theme: same rule. Canvas `#0A0A0A`, panels `#161616`, all text `#F2F2F2`, cobalt `#3D7BFF`, no yellow.
- Update `styles/tokens.css` values only (keep the token names); hunt for hard-coded `#FFD400`/yellow in
  canvases (lib/*.ts) and CSS and point them at the tokens.
- The pricing inverted card stays inverted (`#111` with white text on light).
- Must NOT change: layouts, the dot map itself (just its colours), the departures board pass/stop colours.

## 3. Nav: add GitHub, Docs, Sign in (as on getbindu.com)
- Expanded bar, right side, in this order: GitHub badge (GitHub icon + live star count, `useGithubStars` and
  `githubBadgeLabel` as used by `features/landing/chrome/island-header.tsx`; shows "GitHub" until the count
  loads), Docs (ghost pill, docs.getbindu.com, new tab, same href as the main header), Sign in (ghost pill, same
  href and the "Dashboard" label logic as the main header), then Book a demo.
- Phone drawer: the same four, 44px targets, Book a demo last and highlighted.
- Collapsed pill stays logo-only. Theme toggle stays.
- Must NOT change: the link list, the Regulations dropdown, collapse/expand motion.

## 4. Full Circle (`#how`): remove
- Unmount `Theatre` from home-page.tsx and delete `components/Theatre.tsx`, `lib/theatre-stages.ts`,
  `lib/theatre-fx.ts` and `styles/theatre.css` if nothing else imports them.
- Repoint the nav's "How it works" link to `#story`. Remove `#how` from the guide ship's stops, the rail and
  the ready registry.
- Story then flows straight into the shipment map; check the pin spacing between them at 1440 and 390.

## 4b. Hero: new title
- `hero.title` in content.ts becomes three lines: "Ship it." / "Trace it." / "Bindu." (Austin's words).
- Keep the sub-line and the button. Check it fits one window at 1440 and 390 (three short lines, may allow a
  slightly larger clamp max; don't change the min).

## 5. Regulations (`#rules`): parallel-style static grid with the site videos (option 1, confirmed)
- Card recipe, measured on parallel.ai ("Everything your agent needs to work with the web", 25 Nov 2026), to be
  rebuilt in our own CSS (no copied code, assets or their gerstnerProgramm font):
  - container: `#F5F4F1`, 4px radius, no border, no shadow, about 255px tall in a 3-column row, `overflow: hidden`;
  - tray: an inner layer inset about 8px, 10px radius, fill `rgba(31,27,12,.03)`, inset shadow
    `inset 0 0 18px rgba(31,27,12,.04)`;
  - window: a white panel (4px radius, hairline ring `0 0 0 .66px rgba(0,0,0,.06)` plus a 1 to 3px soft shadow)
    set low and to the left so it bleeds off the right and bottom edges; the video plays inside it;
  - a floating white chip (4.5px radius, long soft layered shadow) on top of the window with one line of the
    record, e.g. "Reference returned" for EUDR (Illustration, no invented numbers);
  - below the container: a 16px outlined icon in a small 1px-ring square, then the title 20/500, then a 13px/500
    muted description (`#858483`, two lines max).
  This supersedes the container/shadow values in the bullets below where they differ.
- Replace the infinite drifting gallery with a static 3-column grid (2 rows) of 6 cards, 24px gap, container
  1200px: EUDR (Live), Textile passport (Live), Battery passport (In build), CBAM (In build), REACH (In build),
  PPWR (In build). Statuses exactly as in brief section 2.
- Each card: a large warm-grey container (`#F2F1EE`, 8px radius, 1px hairline) holding the regulation's
  getbindu.com video as a framed "mockup" (inset 24px, 6px radius, one subtle shadow
  `0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06)`, the only shadow on the page), aspect 4:3.
  Videos from `public/videos/`: eudr-forest-hero, dpp-textiles-hero, dpp-battery-hero, cbam-steel-hero,
  reach-tide-hero, ppwr-recycling-hero (muted, loop, playsinline, `preload="none"`, play only while in view,
  poster frame first; reduced motion and phones: poster only).
- Under the container, small: a 16px monochrome Lucide icon + name (body 16/500), a one-line muted description
  (14px, what the rule asks, reuse the current tile copy), the status chip, and a small link
  "Read about EUDR" / "Read about CBAM" etc. (14px cobalt) to the same sub-page the nav dropdown uses.
- Keep the section title; lead line options (agent logs its choice):
  a) "Six EU rules, and where each one stands."
  b) "The EU rules Bindu covers, and where each one stands."
- Phones: 1 column; 768 to 1023: 2 columns. No drift, no skew, no drag, no pause button (remove the Rules loop).
- Keep the source links (EUR-Lex) on each card as a small secondary line or in the description; don't drop them.
- Must NOT change: the regulation facts, numbers and EUDR date.

## 6. New: blog carousel after pricing (`#blog`, between Pricing and FAQ)
- Title options: a) "From the blog." b) "Notes on EU trade rules." c) "Read before you file."
- A horizontal row of the same card style as item 5 (warm-grey container with the post's existing thumbnail
  SVG from its frontmatter `image`, then the title 18/500, a muted date and a "Read" link), 3 cards visible on
  desktop, about 1.15 on phones.
- Posts (all have thumbnails): eudr-traces, cbam-report, digital-product-passport-textiles, battery-passport,
  reach-compliance, eudr-timeline. Read title, date and image from the post frontmatter at build time (no hand
  copies); links go to `/blog/<slug>`. A "All posts" link to `/blog` at the top right of the head.
- Controls: two small round arrow buttons (prev/next, disabled at the ends), native scroll-snap, swipe and
  keyboard. No auto-play, no drift, no 3D.
- Not pinned. Add `#blog` to the ready registry (late hydration like the others) and to the guide's stops.
- Must NOT change: pricing and FAQ.

## Report
One line per item, judgement calls, screenshots of changed sections in both themes at 1440 and 375 (layout
changed). Record Newsreader (OFL) in LICENSES.md; Rubik removed.
