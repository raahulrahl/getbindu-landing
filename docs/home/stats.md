# Homepage stats (round 41 close)

Lighthouse 12, headless, production build (`next start`, port 3041), medians of 5, machine otherwise idle.

## (a) Today

| Metric | Mobile | Desktop |
|---|---|---|
| Performance (runs) | 61 (59-64) | 86 (83-90) |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 69 | 69 |
| FCP | 1.58 s | 0.44 s |
| LCP | 4.30 s | 1.58 s |
| TBT | 1119 ms | 195 ms |
| CLS | 0 | 0.003 |
| Speed Index | 3.33 s | 1.70 s |
| Transfer | 518 KB | 699 KB |
| JS transfer | 292 KB | 474 KB |
| Font requests | 4 | 4 |
| Requests | 42 | 44 |

Desktop is below 90, diagnosis (not fixed): the LCP element is the hero sub-line paragraph, and the whole LCP is
element render delay (about 0.6 s on mobile, up to 3.2 s in the median desktop run) with a 21 ms TTFB, so it is
hydration and the intro gating the first paint of that text, not the network. The two main-thread hogs are the
shared app chunks (`3bmg1it1z229p.js` about 660 ms scripting, `21uv9e_jchh5b.js` about 400 ms); TBT 195 ms sits at the
"good" edge, and the 5 desktop scores spread from 83 to 90, so it is mostly run-to-run noise on this machine.

## (b) History (Perf / LCP / TBT / CLS)

| Run | Mobile | Desktop |
|---|---|---|
| Baseline | 57 / 6.2 s / 810 ms / 0 | 94 / 1.4 s / 100 ms / 0.003 |
| Pass 1 (final) | 53-58 / 4.2-4.6 s / 1.7-2.6 s / 0 | 98 / 0.9 s / 60 ms / 0.003 |
| Pass 2 | 75 / 4.2 s / 460 ms / 0 | 96 / 1.3 s / 60 ms / 0.003 |
| Pass 3 (after) | 79 / 1.52 s / 822 ms / 0 | 73 / 1.56 s / 423 ms / 0.003 |
| Today | 61 / 4.30 s / 1119 ms / 0 | 86 / 1.58 s / 195 ms / 0.003 |

Sources: `web-quality-baseline.md`, `web-quality-report.md`. Machines and load differed between sessions, so only
same-session pairs compare cleanly. Mobile today is below pass 3's reading; the simulated LCP is hydration render delay.

## (c) SEO

SEO is capped near 69 on purpose: `robots.ts` disallows and the pages are noindex (CLAUDE.md: this copy must never
be indexed). Shelley keeps its own robots.

## (d) Scroll frame timing at 1440

Round 41-1 (DECISIONS.md): real wheel scroll costs 8.00 ms a frame with the local map blur and 7.88 ms without.
Finale zoom (r29): avg 7.6 to 8.2 ms a frame.

## (e) Slop audit, round 41 (`slop-audit-r41.md`)

9 rows. P0 0, P1 2 (both keep), P2 5 (2 fixed, 1 listed, 2 keep), P3 3 (keep).

## (f) Rounds since round 36 started

46 commits (`git log --oneline 0cfb152..HEAD`).

- r36: official logo and smaller nav; new "Ask your supply chain" section in the homepage theme.
- r37: hero sub-line trimmed; console errors from render-time `matchMedia` fixed.
- r38: one Regulations dropdown in sans nav type; Ask fits, slower, one clear current step.
- r39: How it works removed; Full Circle takes its slot (id `how`).
- r40: Full Circle becomes scroll-driven and easier to read (r40-3 whole-map blur later reverted).
- r41: map blur only behind content blocks; slop audit and fixes; web quality passes landed alongside.

## Pass 4 (analysis only, no code change kept)

| Run (1 each, this machine) | Perf | LCP | TBT |
|---|---|---|---|
| Mobile | 80 | 4.0 s sim (observed 0.32 s) | 320 ms |
| Desktop | 96 | 1.3 s sim (observed 2.7 s) | 40 ms |

Findings: on phones the hero already paints from SSR (pre-paint script sets `data-intro="off"`; observed LCP 0.32 s), so
the 4 s is Lighthouse's simulated graph over the two big chunks (react-dom 234 KB `3bmg...`, gsap core + ScrollTrigger
`21uv...`); below-fold sections are already lazy, and the eager rest (MapLayer, particles, worldmap, Guide) is needed
for the first view. On desktop the sub-line is hidden by design while the intro plays (intro.css line 28), so its
observed LCP is the intro's choreography; changing it would alter the motion. Nothing kept.
