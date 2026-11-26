# Slop audit, round 41

Skills run: avoid-ai-design (`detect.mjs` over `features/landing/home`, 72 files), hallmark gates, antislop and antislop-ui, make-interfaces-feel-better, heydamir-unslop (`references/signs.md`), unslop on `content.ts`. Done by targeted greps of the code plus a render check at 1440 and 375; the detector was re-run after each fix. Heavy visual judgement (hallmark composition gates) was not re-scored: no layout, palette or type finding came out of the greps and earlier rounds (r36-6, r37-3) already cleared them.

| Section | File:line | Skill | Tell | Sev | Fix or reason |
| --- | --- | --- | --- | --- | --- |
| Hero (magnetic CTA) | components/bits.tsx:70 | avoid-ai-design M4, heydamir-unslop (bouncy springs) | `elastic.out(1, 0.45)` on the release | P2 | Fixed: `power3.out`, same 0.8s |
| Full Circle (The Fabric scene) | lib/theatre-fx.ts:124,126 | avoid-ai-design M4, heydamir-unslop | `elastic.out(1, 0.4)` on the refused plug wobble | P2 | Fixed: `power3.out`, same durations |
| Hero | components/Hero.tsx:77 | avoid-ai-design SD5 | "One word accented": no word is accented, each word has its own mask span for the reveal | P1 | Keep, false positive. Marked `avoid-ai-design-ignore: SD5` |
| Intro | content.ts:33 | avoid-ai-design SD4d, heydamir-unslop | Mono label "BINDU · TRADE COMPLIANCE OS" joined with a middle dot | P2 | Listed, not fixed: it is the intro's brand label, changing it changes the copy |
| Ask (mock answers) | content.ts:147,149,151 | avoid-ai-design SD4d | "Answer · order PO-2214", "DDS ... · V-99DK2 · co-op" | P2 | Keep, deliberate: field separators inside mock documents (bindu-design, Illustration labels). Marked ignore |
| Footer | content.ts:331 | avoid-ai-design SD4d | Legal line joined with middle dots | P3 | Keep: conventional footer legal line. Marked ignore |
| Map content blocks | styles/story.css:203 | avoid-ai-design K3 | backdrop-blur | P1 | Keep, deliberate: r41-1, Austin asked for a local map blur behind content. Cost +0.1 ms a frame. Marked ignore |
| Pricing, Intro, tabs | styles/components.css:139, site.css:167, story.css:108 | heydamir-unslop (uppercase tracked labels) | Mono caps labels | P3 | Keep, deliberate: the Together-derived mono-caps label (DECISIONS.md, brief item 4; r15b.14b). Changing it is a visible type change |
| Shipment | styles/shipment.css:130 | heydamir-unslop (glow) | `drop-shadow(0 0 0.5px ...)` on the cargo | P3 | Keep: a 0.5px outline for contrast on the map, not a glow |

Checked and clean: gradient text, `transition: all`, infinite loops, weights 700 to 900, hover scale, glows (apart from the row above), exclamation marks, hype words, em dashes and unverifiable "trusted by" claims in `content.ts`.

Counts: 9 rows. P0 0, P1 2 (both keep), P2 5 (2 fixed, 1 listed, 2 keep), P3 3 (keep).
