Round 56 on the homepage (`/`). Austin's review of r55 in progress, 25 Nov 2026. Build after round 55. Follow DESIGN.md v4 (Ollama + yellow and cobalt accents). Only change what's listed.

## 1. Hero: large title
- The hero h1 is too small at Ollama's 36px. Hero only: clamp(48px, 7vw, 96px), Nunito/ui-rounded 500, line-height 1.05, sentence case. Section titles stay at the file's sizes. Log as DESIGN.md adaptation 8.

## 2. The map behind the whole page
- The fixed dot map shows behind every section, top to bottom, not only the hero (no section paints an opaque full-width background over it).
- Content sits on top and must stay readable: text blocks and panels sit on Ollama hairline cards (canvas fill) or on the feathered blur layer (r41/r48 style, one layer, no tint). Body text must meet WCAG AA over the map in both themes; dim the map's dots behind content if needed, never the whole map.

## 3. Full Circle: lines in cobalt
- The white lines in the Full Circle drawings are invisible on the light canvas: draw every line there in cobalt (`--cobalt-signal` light value on light, dark value on dark).

## 4. Shipment map: centred, same size
- Keep the map stage the size it was. It currently sits on the left side only: centre it in the window (centred in the container, equal space left and right), with the tabs, milestone list and question bubble arranged around it so nothing is pushed to one side. Not full-bleed (Austin, correction).

## 5. Departures board: colour for outcomes
- "Let through" in the pass colour and "Stopped" in the stop colour (existing tokens `--board-pass` and `--board-stop`), as the chip or text of the outcome, in both themes, AA contrast.

## 6. What buyers say: the old wow version, exactly
- If r55 item 2 has not restored it exactly: put back Voices.tsx and its CSS as they were at commit 1ba9176 (the curved 3D card track with sticky window, drag, snap, word light-up, route line and travelling dot). Restyle colours and fonts only. No flattening.

## 7. The rules Bindu covers: a creative revamp
- Replace the sideways tile scroll with a filing drawer: the five rules are five document folders standing in a row with labelled tabs (regulation number on the tab, in mono). The section pins; as you scroll, each folder in turn lifts up out of the drawer and opens to show its card (name, what it asks for, goods, status chip, source, "Read the rule"), then slides back as the next one lifts. One motion idea; scrubbed and reversible; cobalt for the drawer lines, yellow only on the Live chip.
- Phones and reduced motion: the five folders as a stacked list, all open.
- Content, statuses, regulation numbers and source links unchanged. The full title is visible.

## 8. Footer: the old text
- The footer's text content goes back to the pre-r54 version (as at 1ba9176): the link columns, contact details, the roles row ("For importers, exporters and co-ops, customs brokers, traders") and the legal line, word for word. Ollama styling.

## Report
One line per item, judgement calls, what was not verified. Look at the page yourself for every item (screenshots for your own checking only).
