Round 55 on the homepage (`/`, `features/landing/home/`). Follow CLAUDE.md, docs/home/project-context.md and docs/home/DESIGN.md v4 (the Ollama DESIGN.md, copied whole, plus the "Bindu adaptation" list at its end). Only change what's listed; copy changes keep the honesty rules (no invented facts, Illustration labels).

## 1. Whole page: the Ollama system, exactly
- tokens.css: replace every colour, type, radius and spacing token with the Ollama file's values (light default) and the adaptation's dark set. Retire yellow, cobalt, IBM Plex Mono. Fonts per adaptation 1 (self-host Nunito 500/600 OFL, add to LICENSES.md).
- Components exactly as the file: `button-primary` (black pill, 36px, 8px 20px, 14px 500) and `button-secondary` (white pill, 1px hairline-strong); cards 12px with a 1px hairline, no shadow; the one inverted `#171717` surface used once on the page (the pricing card); chips, inputs, links as the file. On phones buttons stay 44px tall (the file's Touch Targets).
- Type: hero 36px display-xl, section titles 30px display-lg, body 16px, etc. (the file's hierarchy table). Headings stay sentence case. Drop the yellow full stop.
- Everything drawn (map dots and routes, guide ship, proof dots, the finale ı sunflower, story and Full Circle art) uses `ink` / greys only.
- Nav, motion, testimonials and finale per adaptation 4 to 6.

## 2. What buyers say (`#voices`): bring back the old one
- Restore the curved 3D card track from before r54 (Voices.tsx and its CSS as at commit 1ba9176): sticky window, scroll + drag + arrow keys, snap, words light up, the dashed route with the travelling dot. Restyle with Ollama tokens only. Placeholder chip stays.

## 3. Finale and footer: bring back the old ending
- Restore the pre-r54 ending (Closing.tsx footer and its CSS as at 1ba9176): the footer rides up over the photo with link columns, roles row and legal. Keep the port clip from r52-2. Ollama tokens only.

## 4. One shipment, four steps (`#story`)
- The step number shows once only: in the round marker on the progress line. Remove the second number from the big step line.
- Replace the four-dot progress line with a more striking progress element in the Ollama style, e.g. a thin black line that draws itself between four round markers, the current marker filling solid and its label sliding in beside it (choose; log it). It must use the page's display font.
- Fewer words, more motion: cut each step's caption to one short line (6 to 10 words; pick wording, log it, keep the facts), and let the stage carry the meaning. Step titles stay.

## 5. Shipment map (`#shipment`): readability
- Find and fix overlapping lines and labels (routes over route labels, milestone labels over each other, the question bubble over the route). Offset or stack labels, give them a canvas-colour backing, and keep one label per point. Nothing overlaps at 1440, 1024 and 375 for every tab.

## 6. Departures board (`#examples`): make it readable
- Replace the flap font inside the board with the Ollama body and mono stacks at readable sizes (at least 14px, 16px for the main line).
- Cut the words: each row shows the goods, the rule and one clear outcome ("Let through" / "Stopped") plus one short reason (max 10 words). Move the longer story out (or drop it).
- Add one plain line above the board that says how to read it (wording options: "Each row is a shipment. Scroll to see what the rules decide." / "Scroll: each row is one shipment at the EU border."). Keep the scroll-step behaviour; make the current row obvious (ink, others mute).

## 7. The rules Bindu covers (`#rules`): fix
- The tiles do not move and half the title is cut off. Fix the pin so the vertical scroll moves the row sideways (check the ScrollTrigger is created after the section hydrates, that the pin length is set and that Lenis drives it), and make sure the full h2 is visible (no clipping, no overflow hidden on the head, correct top offset under the nav).

## 8. What each filing costs (`#pricing`): fix
- The price number is cut in half: fix the odometer's clip box and line height so the whole number shows in every state and both themes.
- The button has lost its colour: "Estimate your cost" must render as a visible Ollama button (on the inverted dark card: `button-pill-on-dark`).

## Report
One line per item, judgement calls, what was not verified. Check items 4 to 8 by looking at the page yourself (screenshots for your own checking only; do not save them in the repo).
