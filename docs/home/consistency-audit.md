# Consistency audit (r36-1)

Work list for a later fix round. Nothing here has been fixed. The rules are the "Consistency rules" section of `docs/home/DESIGN.md` (R-head, R-type, R-space, R-panel, R-btn, R-link, R-tabs, R-illus, R-focus). Line numbers are from the tree on 22 Nov 2026; the nav lines in `site.css` are being edited by 36-3, so re-check them before fixing. Paths are under `features/landing/home/`.

Severity: A = visible to the reader, B = drift that will bite the next change, C = dead or stale code.

## Top inconsistencies (read these first)
1. Section titles use five sizes, not one (R-head). A.
2. "Illustration" is a chip in some places and a plain sentence in others (R-illus). A.
3. Tabs drop to 11px with different padding on phones, and the pricing row has its own width (R-tabs). A.
4. Mono caps survive in the IT drawer and the board meta line although the system is sentence-case sans (R-type). B.
5. Two press states and two focus-ring colours for the same controls (R-btn, R-focus). B.
6. Hero headline size is set in four places (R-type). B.
7. Panels use 12px, 16px, 10px and 5px radii and three border colours (R-panel). B.
8. Docs, comments and CSS still describe things that no longer exist (sheen, dot-to-arrow, navy band, cool light theme, Four documents). C.

## Per section

### Nav
- `styles/site.css:24`: links are `font: 400 12px` mono after the 36-3 edit; R-type has no 12px mono link and `.tlink` is sans 15px. Fix: decide in 36-3 and record it in DESIGN.md (one nav link style), then delete the old 14px rule if still present.
- `styles/site.css` (`.nav-demo`) sets `min-height: 38px`; R-btn says 44px, and `styles/mobile.css:10` restores 44px on phones only. Fix: keep 38px only if 36-3 records it as the nav exception, with the reason.
- `styles/site.css:38`: the drawer link size (18px) is not on the type scale. Fix: use `--body-lg` (19) or `--body` (17).

### Hero
- `styles/site.css:46`, `styles/story.css:245`, `styles/story.css:159`, `styles/mobile.css:19`: four overrides of `.hero-h` size (84, 76, 44, 38.4px maxima) over `--display-xl`. R-type. Fix: one clamp in one rule, with the phone value coming from a token override in `mobile.css`.
- `styles/r2-hero-cta.css:25`: `.cta .btn { height: auto; padding 12px 0 }` breaks the 44px button height (R-btn). Fix: remove `height: auto` and keep `min-height: var(--btn-h)`; let long labels wrap inside that.
- `components/MapLayer.tsx:334` and `components/Intro.tsx:60` (`styles/intro.css:40`): the map and intro labels are 12px plain sentences beginning "Illustration:", not the chip (R-illus). Fix: chip plus a `t-caption` sentence, in the same bottom-left slot.
- `styles/r10-hero.css:3-4`: text-shadow on headline and label is the only shadow outside the "no shadow" rule (R-panel). Fix: keep only if the scrim is not enough; record the exception.

### Statement
- `styles/story.css:13`: own `clamp(30.4px, 5vw, 68px)` instead of `--display-lg` (R-type). Fix: use `--display-lg` and set the line-height in the rule; delete the clamp.
- `styles/story.css:15`: chip border radius is `--r-pill`; R-panel reserves pills for buttons and chips are 6px. Fix: either document the statement chip as a button-like pill exception in DESIGN.md or change it to `--r-sm`.

### Sound familiar?
- `components/Story.tsx:128` + `styles/story.css:25`: `.ba-pain` has its own `clamp(28px, 3.6vw, 48px)` and `.ba-ans` its own `clamp(20px, 2vw, 26px)` (R-type). Fix: map to `--display-md` and `--display-sm`.
- `styles/story.css:~22` (`.ba-h { margin-bottom: var(--s-8) }`) is right for R-space, but `.ba-h` is applied to the `h2` itself while other sections put the gap on `.sec-head`. Fix: one wrapper class for the head, one gap rule.
- `styles/story.css:~26` (`.ba-n`, 17px) is fine; `styles/mobile.css:21` sets 38ch for it, the lead rule says 44ch centred or 736px left. Fix: pick 38ch phones, 736px desktop for all leads (see Departures board).

### How it works
- `styles/story.css:45`: `h2` is `clamp(28px, 2.9vw, 40px)` and `:102` `clamp(24px, 6vw, 36px)` (R-head: `--display-md`). A. Fix: use `--display-md`; if the left column is too narrow at 1024 to 1200px, narrow the right column, not the title.
- `components/HowItWorks.tsx:144`: the log label is `log · illustration`, lowercase mono (`styles/story.css:73`), not the chip (R-illus). Fix: replace with the chip; keep "log" as the caption text.
- `components/HowItWorks.tsx:171`: "Made-up code · Illustration" is plain `kt-mute` text. Fix: chip.
- `components/HowItWorks.tsx:200` (`how-cap`): "Illustration. Not a real customer or filing." is a plain caption under the figure. Fix: chip + caption in the `.cargo-cap` pattern; one label per figure, not three inside it.
- `styles/story.css:~70` (`.kt-rec dt` 13px, `.kt-live` 13px, `.kt-mute` 13px): three separate 13px declarations; use `--caption`. B.
- `styles/story.css:~52`: `.how-step` has no panel and uses a 1px top rule with a cobalt active rule; consistent with R-panel (whitespace and rules). No change.

### One shipment from origin to customs
- `styles/shipment.css:172`: title is `min(var(--display-lg), 6.6svh)` (lg) while every other title is md; the earlier rule at `:23` is overridden and now dead. A. Fix: R-head says md; if the journey title is meant to be larger, record that exception in DESIGN.md. Delete the dead rule either way.
- `styles/shipment.css:173`: the story line is `clamp(15px, 2.3svh, 20px)` in full ink; R-head lead is 19px `t-soft`. Fix: `--body-lg` with `--on-dark-body`, keeping the `svh` clamp only as a floor.
- `styles/shipment.css:174` and `:106`: phone titles 24px and 20px; the phone token is 28px. Fix: `min(var(--display-md), 4.4svh)` with a floor of 22px, recorded once.
- `styles/shipment.css:187`: `.ship-note::before` radius 10px, off the scale (R-panel). Fix: `--r-sm` (12px) or 6px.
- `styles/shipment.css:56`, `:108`, `:112`: the Illustration chip is resized to 11px and 22px tall inside the journey (R-illus). Fix: keep the chip at 12px and 24px; shrink the caption row instead.
- `components/ShipmentJourney.tsx:409-411`: chip and caption are inline text, not the `.cargo-cap` flex row. Fix: use the same row as `Cargo.tsx:19`.

### Departures board
- `components/Examples.tsx:138`: the lead is `t-body t-soft` (17px) where R-head says `t-body-lg`; and "Illustrations, not customer filings" is a sentence, not a chip (R-illus). A. Fix: `t-body-lg`, and a chip beside the board.
- `styles/story.css:168`: `.ex-head h2 { max-width: 20ch }` is the only title with a width cap. Fix: drop the cap or apply it to `.sec-head h2` everywhere.
- `styles/story.css:226` and `styles/mobile.css:43`: the title is forced to 24px on phones (token is 28px); `story.css:228` and `mobile.css:44` set the lead to 11px then 13px (below `--caption`). A. Fix: let the pin height absorb it (the pin is already `18svh` per row), keep the title at 28px, lead at 15px.
- `styles/story.css:173`: the board is a `--canvas-mid` panel at 12px with no border: allowed by R-panel (nested surface). No change; note that its flaps keep navy colours by design (`--board-pass`, `--board-stop`).
- `styles/story.css:195`: the meta line is mono caps 12px with 0.06em tracking, the only caps label on the page besides the IT drawer. B. Fix: sentence-case sans 12px, or record "meta lines are mono caps" as a rule.

### What each filing costs
- `styles/r6-pricing.css:7` and `:9`: padding `--s-7` and `88px 0 --s-6` instead of `--section-y` (R-space). B. Fix: record it as a pinned-window exception (done in DESIGN.md) and keep the `88px` as `calc(64px + var(--s-5))`.
- `styles/r6-pricing.css:19`: tab row max 640px; `.seg-track` is 720px (R-tabs). A. Fix: delete the override.
- `styles/components.css:189-191`: under 600px, tabs shrink to 11px/0.02em and the pricing row scrolls sideways inside a 470px track. A. Fix: one phone rule for all tab rows: 14px, equal columns where they fit; scroll only when six labels cannot fit, with a fade at the edge.
- `styles/r6-pricing.css:31-33`: `.r6-tag` and `.r6-inc-h` re-declare eyebrow colour and height already in `.bh-eyebrow` (`styles/components.css:23-25`). C.
- `styles/r6-pricing.css:24`: card radius `--r-lg`, border `--line-white-12`, surface `--canvas-soft`: the reference panel. No change.
- `components/Pricing.tsx:78` and `:100`: eyebrows are 14px sans; the type table lists 14px for eyebrows only, but the head above has none (R-head). B. Fix: keep, they are labels inside a panel, not section eyebrows.

### FAQ
- `styles/site.css:153`: `.it summary` is mono 13px caps with 0.06em tracking (`--mono-button`) (R-type, R-btn). A. Fix: sans 500 15px sentence case. Same for `styles/site.css:169` (`.ph`, mono 12px with a dashed 6px box) and `:167` (`.it-layers code`, 5px radius): make them chips or drop the mono.
- `styles/site.css:152`: `.it` panel is `--hairline-dark` border, 16px; the pricing card uses `--line-white-12`. Same visual result today, different tokens (R-panel). Fix: one border token name.
- `styles/site.css:13` vs `:181`: global focus ring is `--focus-dark` (on-dark, white in dark theme); FAQ and footer use `--focus-ring-dark` (cobalt) (R-focus). B. Fix: make the global rule `--focus-ring-dark` and delete the per-component overrides.
- `components/Closing.tsx:14-17`: the head is a `.sec-head` inside a two-column grid; it is the only head with no lead and a left column. Fine, but `margin-bottom: --s-8` on the head (`styles/site.css:17`) leaves a 64px gap under it in the left column with nothing below. Fix: `margin-bottom: 0` for `.faq .sec-head`.
- `styles/site.css:189`: answers max 640px, leads 736px. Fix: one measure for running text (640px) in the system, applied to leads too, or write down why not.

### Finale and footer
- `styles/site.css:102`: `.foot-mark` is 22px sans, off the type scale; footer column links use 6px padding (`styles/site.css:~105`) while `mobile.css:15` sets 12px. B. Fix: `--display-xs` (20) and a single link row height of 44px at all widths.
- `styles/story.css:~148` (finale): the footer overrides four colour tokens locally for the on-photo case. Consistent, but it is the only place that redefines `--on-dark*` inside a component. Fix: add `.on-photo` scope class in `tokens.css` and reuse it.

## Cross-cutting
- Buttons: `styles/components.css:62` presses with `scale(0.98)`; `styles/states.css:12-17` says "1px down, not a scale" and lifts on hover with `translateY(var(--lift))`. The two apply to different selectors (`.bh-btn-primary` vs `.btn`), so the primary pill and the outline pill behave differently (R-btn). A. Fix: one press and one hover rule for every `.btn`; DESIGN.md says scale .98, so keep that and delete the `translateY` pair.
- Stale rules: `styles/components.css:51-60` still comments on the sheen and the dot-to-arrow; `:~66` has reduced-motion rules for `.btn-dot` (no such element). `styles/components.css:130` (`.step .step-n` mono) has no user. `styles/r8-slop.css` styles `.roles`, removed in r17-11. `styles/tokens.css:92-94` still describe mono-caps tokens (`--mono-button` is only used by the IT drawer). C.
- Colour: `styles/tokens.css:166` says the light base is `#F5F1E8`; `--canvas` is `#F1ECE1` (`:175`). `docs/home/DESIGN.md` front matter (colours, display weight 400, 96/72px sizes, 30-minute demo) is out of date; the new Consistency rules section says so but the front matter should be regenerated from `tokens.css` in the fix round. C.
- Hex outside tokens: only `styles/story.css:253` (`#000` inside a mask gradient, which is a mask, not a colour). No fix needed.
- Radii in use: 2px (progress, focus), 5px (`.it-layers code`), 6px (chips, `.ph`), 10px (`.ship-note`), 12px, 16px, pill. R-panel allows 6, 12, 16, pill. Fix: move 5px and 10px onto the scale.
- Heading phone sizes in use: 20, 24, 28, 32px (journey, board, how it works, md and lg tokens). Fix: two sizes only, 28 for titles and 32 for the statement.
- Lead measure: 38ch (`mobile.css:21`), 44ch (`r6-pricing.css:16`), 60ch (`shipment.css:173`), 736px (`site.css:17`), 640px (`site.css:189`). Fix: one `--measure` token for leads (736px) and one for running text (640px), `ch` only on phones.
- Not covered here (outside the Consistency rules): canvas drawings (guide, map, burst), the intro and the calculator dialog's internals (`styles/site.css:77-135`). The dialog panel itself follows R-panel (16px, hairline).

## r36-6 scan

Scanner: `node .claude/skills/avoid-ai-design/scripts/detect.mjs` over `features/landing/home/` (70 files): 5 findings, none in the round 36 sections (nav, Ask, File-step threads). Not fixed here.

- `components/bits.tsx:70` (M4, elastic easing): the magnetic button settles with `elastic.out(1, 0.45)`. Fix: `power3.out` over 0.8s, or keep and record it as a deliberate play moment.
- `components/Hero.tsx:76` (SD5, one word accented in the headline): the last word carries the accent. Fix: accent the whole clause, or none, or log it as the brand's yellow full stop.
- `components/HowItWorks.tsx:149, 206, 207` (SD4d, middle-dot meta strings): "log · illustration", "signed · did:web:... (illustration)", "Made-up code · Illustration". Fix: use the `.chip-illus` chip for the label and drop the dots.
- `content.ts:32, 100, 113, 114` (+6) (SD4d): the same middle-dot joins in copy. Fix: split into separate spans or sentences.
- `styles/site.css:76` (K3, backdrop-blur): the calculator dialog backdrop blurs 4px. Fix: a flat shade is enough; drop the blur.
- Round 36 sections: nothing failed the hallmark, antislop-ui or make-interfaces-feel-better checks on read (tokens only, no `transition: all`, one focus ring, 44px phone targets, nav blur not used, the nav only changes background-color).

## r37-3 status

Done (token and class level, screenshots pixel-identical at 1440 and 375, both themes):
- Hero: one headline size (`--hero-h-size`); the 84, 44 and the duplicate phone overrides removed.
- Cross-cutting: one press state (`scale(.98)`, `states.css`); the `translateY` press is gone (the hover lift stays).
- FAQ and global: one focus ring (`--focus-ring-dark` and `--focus-ring-light`, global, `.opt`, range, IT summary, pricing card); the `.it` panel border uses `--line-white-12`.
- Radii: `.it-layers code` 5px to 6px; `.ship-note::before` 10px to `--r-sm`.
- Stale: `.btn-dot` rules, the sheen and dot-to-arrow comments, `.step-n`, `r8-slop.css` (`.roles`), `--t-sheen`, `--press-down`, the light base comment (`#F1ECE1`).
- r36-6 scan: calculator backdrop blur dropped.

Skipped (each would visibly change a layout, motion or copy, which this round forbids):
- Section title sizes (How it works, Sound familiar, journey, board, statement, `.ba-ans`): tried the tokens on How it works; the title wrapped to three lines at 1440. Needs a layout round.
- Illustration chips (map, intro, log, made-up code, `how-cap`, journey, board): markup and layout change.
- Tabs on phones and the pricing tab row width: layout.
- Nav drawer link size, `.nav-demo` height: nav is under 36-3 and recorded there.
- `.cta .btn` height, `.faq .sec-head` margin, `.ba-h` wrapper, `.ex-head h2` cap, board phone title and lead sizes, journey lead and phone titles, pricing padding, statement chip radius, `kt-*` 13px declarations, `.r6-tag` duplicates, footer link rows and `.foot-mark`, the `.on-photo` scope, lead measures: layout or structure changes.
- IT drawer mono caps and `.ph` / `code` mono: visible typography change.
- Text-shadow on the hero (kept, scrim not enough on the map), tokens mono-caps comments and the DESIGN.md front matter regeneration (docs round).
- r36-6: elastic easing (motion), accented last word and middle-dot copy (copy).

