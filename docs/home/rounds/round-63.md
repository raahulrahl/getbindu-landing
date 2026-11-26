Round 63 on the homepage (`/`): a font trial switcher, for Austin to try fonts. Trial only: it must never show to visitors.

## 1. Font lab (dev only)
- New file `features/landing/home/dev/FontLab.tsx`, mounted from home-page.tsx only when `process.env.NODE_ENV !== "production"` OR the URL has `?fontlab`. Nothing else on the page changes. Not part of merge-back (note it in README.md's merge-back section and in DECISIONS.md).
- A small floating toggle button bottom-left ("Fonts", 44px, ghost pill, above everything, keyboard reachable). It opens a compact panel with two selects: Headings and Body, plus "Reset". Changes apply instantly by setting `--font-display` and `--font-sans` (or whatever the tokens are named) on the document root; the choice is remembered in localStorage (wrapped in try/catch) and cleared by Reset.
- Fonts load on demand from Google Fonts (one `<link>` per chosen family, weights 400/500/600/700, `display=swap`), only when picked. All are SIL OFL / open licences.
- The 20+ choices (both selects list all; current defaults marked):
  Sans: Nunito (current headings), Inter (current body), Manrope, DM Sans, Plus Jakarta Sans, Outfit, Space Grotesk, Sora, Figtree, Onest, Geist, Instrument Sans, Bricolage Grotesque, Hanken Grotesk, Schibsted Grotesk, Public Sans, IBM Plex Sans, Work Sans, Rubik, Lexend, Albert Sans.
  Serif (for headings): Fraunces, Instrument Serif, Newsreader, Source Serif 4.
- Mono stays as it is.
- The panel shows the current pair as text ("Headings: Sora · Body: Inter" without the middle dot: use a slash) so Austin can tell us which pair he likes.
- No analytics, no network calls other than the font stylesheet.

## Report
One line, how to open it (`localhost:3011/?fontlab` or any dev load), what was not verified.
