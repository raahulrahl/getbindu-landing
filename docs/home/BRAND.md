# Bindu brand

Authored 2026-11-27. This file replaces the borrowed systems: the Ollama scrape
that was `docs/home/DESIGN.md`, and the x.ai + Together AI + Apple merge in the
`bindu-design` skill. Those three disagreed on canvas, geometry, accent and
type, which is why the page needed 29 stylesheets to hold together.

One system now. Where this file and an older one disagree, this one wins.

## The idea

**বিন্দু** means point, dot, origin.

A plot of land is a point. A supplier's geolocation is a point. A filing is the
full stop at the end of the evidence. The product takes many points and
resolves them into one.

So the mark is a dot, and the system is the dot repeated, aligned and reduced.
Nothing else is ornament. This was already written in the product's own copy
(`content.ts` splits the wordmark as `b` / `ı` / `ndu`, and the hero art label
reads "every proof is a dot") and was never made the system. It is now.

The sunflower is retired. It had to be labelled "Illustration", it carried no
meaning the buyer could read, and a golden-angle spiral is decoration.

## Register

Dutch signage precision. Grid, hairline, one accent, mono numerals, no
decoration. Think NS and Total Design, not Silicon Valley.

This is chosen, not borrowed. The company is in Amsterdam, the buyer is a
European importer, and the product's job is to be exact about a regulation. A
page that looks like an instrument earns more trust here than one that looks
like a product launch. It lands in the same place as parallel.ai's restraint,
arrived at honestly.

What it is not: no eco-green, no leaf, no globe, no earth tones. Deforestation
regulation does not mean the brand is about nature. It is about filing.

## Colour

Black and greys carry about 90% of the page. One accent, one hue, three stops,
each stop existing because a specific contrast case needs it.

| Token | Hex | Job |
|---|---|---|
| `--signal` | `#D33A12` | fills and large numerals. White on it is 4.8:1 |
| `--signal-lift` | `#FF6A40` | small accent text on dark only (6.9:1) |
| `--signal-ink` | `#A82B08` | small accent text on paper only (6.2:1) |

Yellow and cobalt are retired. Yellow `#FFD400` cannot carry text on white at
1.4:1, which forced a rule about where it may never go; and yellow plus blue is
the palette every EU compliance vendor already uses.

The accent means one thing: **this is the action, or this is the number that
matters**. One filled element per view. In-build status stays a neutral dashed
outline, never the accent.

Dark is the primary theme. Paper is the second, and both are first-class.

## Type

Two families, both already bundled by `app/(en)/(home)/layout.tsx`. No new
network cost, and one fewer family than before (Inter is dropped from `/`).

- **Geist** for display and body. Neutral grotesque, good numerals.
- **JetBrains Mono** for eyebrows, labels, data and buttons.

The headline is quiet: `clamp(32px, 3.2vw, 52px)` at weight 450. The old hero
had drifted to 72px/600, which is three times the sub-line and reads as a
product launch. Hierarchy here comes from colour and space, not size.

Mono is not decoration. It marks the things a machine produced or will consume:
reference numbers, HS codes, prices, dates, status.

## Geometry

**Radius 0 on structure, 2px on controls. No pills.**

This is the sharpest break from the old page, which took pill-everything from
the Ollama scrape and pill-with-translucent-border from the x.ai one. A pill
reads consumer. A square reads instrument.

Structure is drawn with hairlines, never shadows. The vertical frame rules
(`::before` / `::after` on the inner containers) are the best thing the old page
had, and they stay: they are the grid made visible.

Content box is 1456px, the measured width of the reference.

## Motion

GSAP owns it. Two moves exist:

1. Section entry: 16px rise plus opacity, 60ms stagger, 0.5s, `power2.out`.
2. Hairlines draw from zero width.

Nothing scales, rotates, parallaxes or pins. `prefers-reduced-motion` shows the
end state with no movement, and the page reads fully with motion off.

## Voice

Sentence case. Short sentences. Active voice. Headlines of eight words or
fewer. Buttons say exactly what happens. Explain a term before naming it.

No em dashes. None of "Seamless", "Elevate", "Unleash", "Next-Gen". No invented
numbers. Every regulation fact cites a public primary source.

The buyer is the owner or managing director of an importing business with no
compliance team and no developers. Plain business language, not developer
language, even though the page looks technical.

## Honesty

Only what is live is shown as live. EUDR filing and identity signing (W3C DID)
are live. CBAM, product passports, PPWR, REACH, HS classification, the supplier
exchange and the agents are in build, and are visibly not live.

There are no customers, logos, testimonials, metrics or certifications yet, so
the page has none. `TESTIMONIALS_PLACEHOLDER` in `content.ts` is not to be
rendered.

Never claim Bindu takes on legal liability, never promise an outcome at customs,
never say "fully compliant" or "guaranteed compliance".
