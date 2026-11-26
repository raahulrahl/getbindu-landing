# Usage audit: animations, code, assets and design references

Homepage mockup (`v3/` on branch `v3-story` in the mockup repo, after round 35), checked 22 Nov 2026. It is now ported to `features/landing/home/`.
Question: can Bindu use everything on the homepage commercially, on getbindu.com?
This is a practical check, not legal advice.

## Verdict
Yes, with three things to do before production:
1. **Swap the cargo photo.** It's fine to use under the Unsplash licence, but it shows Hapag-Lloyd's name on the container doors, and the licence doesn't cover their trademark (it could look like an endorsement). Use an unbranded port photo, or retouch the branding out.
2. **Get Bindu's OK on the mark colours.** The Bindu mark is Bindu's own trademark. Using it in yellow and cobalt is a brand change, not a licence question.
3. **Don't ship the leftover files.** `public/images/port-duotone.jpg` and `.webp` are no longer used but still get copied into the build. Leave them out of the migration.

Everything else is either our own code, permissively licensed (MIT, Unlicense, Apache 2.0, OFL, CC0, public domain), or GSAP's free licence.

## 1. Libraries that ship in the page
| Library | Version | Licence | Commercial use | Notes |
|---|---|---|---|---|
| GSAP core, ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin | 3.15.1 | GSAP Standard "no charge" licence | Yes | Free for commercial use, all plugins included, since Webflow bought GSAP (30 Apr 2025). The one restriction: you can't build a visual, no-code animation tool that competes with Webflow. A compliance SaaS website is fine. No credit required. |
| @gsap/react (target repo only) | 2.1.2 | Same GSAP Standard licence | Yes | Already in getbindu-landing. |
| Lenis (smooth scroll) | 1.3.27 | MIT | Yes | Keep the MIT notice in the bundle's licence file (bundlers usually do this). |
| OGL (WebGL particles) | 1.0.11 | Unlicense (public domain) | Yes | Replaced by three.js in the migration. |
| three.js (target repo only) | 0.184.0 | MIT | Yes | Already in getbindu-landing. |
| React, React DOM | 18.3.1 | MIT | Yes | |

Build-only tools in the mockup (not shipped): Vite (MIT), TypeScript (Apache 2.0), Lighthouse (Apache 2.0).

## 2. Assets
| Asset | Where | Licence | Commercial use | Action |
|---|---|---|---|---|
| Inter, IBM Plex Mono (self-hosted woff2) | `public/fonts/` | SIL OFL 1.1 | Yes | None. In the migration they come from `next/font`, which is the same fonts under the same licence. |
| "bındu" finale mask (Inter 600 turned into SVG outlines) | `src/lib/maskdata.ts` | OFL (the font) | Yes | Outlining a word as artwork is allowed. It isn't a redistribution of the font. |
| Interface sounds (Kenney, 22 clips, trimmed) | `public/sounds/` | CC0 | Yes, no credit needed | The licence text is kept next to the files. |
| World land shapes (Natural Earth 1:50m, simplified) | `src/lib/landdata.ts` | Public domain | Yes, no attribution needed | None. |
| Cargo photo (Unsplash 1605732562742, cropped) | `public/images/port-cargo.webp` | Unsplash Licence | Yes | **Swap it.** The Hapag-Lloyd lettering and container IDs show. Unsplash doesn't license the trademarks in its photos. |
| Old duotone photo | `public/images/port-duotone.*` | Unsplash | (unused) | Delete it or don't port it. |
| Bindu mark | `src/assets/bindu-mark.svg`, favicon | Bindu's own | Bindu's call | Colour change needs Bindu's approval. |
| Role pages | `public/roles/*.html` | Our own (mockup) | n/a | Not part of the homepage port. |

## 3. Animations and effects: who made what
Every animation on the page is our own code, written for this project. No code was copied from a template, CodePen or component library.

| Section | Animation | Built with | Origin |
|---|---|---|---|
| Intro | 1s dot intro, particles | Canvas / OGL | Our own |
| Whole page | Ink container ship guide, straight-dash course line, wake, proof dots | One canvas, GSAP ticker | Our own. The idea of one guide travelling the whole page comes from Rothfinder (look only). |
| Hero | World dot map, shipment dots fading after the hero | Canvas, Natural Earth data | Our own |
| Headings | Light-up words, heading scrims | GSAP SplitText + ScrollTrigger | GSAP plugin (licensed), our own timing |
| Statement / Sound familiar? | "Bindu" lights up on scroll, ink strikes on the pains | CSS + ScrollTrigger | Our own. The row layout follows Rubie (layout only). |
| How it works | Typing, log feed, reference scramble, dots forming a QR-style pattern | GSAP, canvas | Our own. The pattern is made up and isn't a real QR code. |
| Four documents | Animated beams between documents | SVG + CSS | Idea from Magic UI's Animated Beam (MIT), rebuilt from scratch |
| Shipment journey | Map with route drawing, ship sailing, map-to-ship dot hand-off, notes | Canvas + DrawSVG/MotionPath | Our own; the hand-offs follow the scroll position |
| Departures board | Split-flap rows, one per scroll step, story panel, clack sound | CSS 3D flips + ScrollTrigger | Our own. Split-flap boards are a common public pattern (Solari). The row wording is getbindu.com's own worked examples. |
| Pricing | Split card, border beam, tabs | CSS | Split card from time.fyi (layout only). Border beam from Magic UI (MIT), rebuilt. |
| Estimate | Odometer numbers | Our own | Our own |
| Buttons | Small magnetic jiggle, label stays still, arrow | GSAP | Our own. Shimmer idea from Magic UI (MIT), rebuilt. The pasted hover-link snippet was rewritten from scratch. |
| Section changes | Background band crossfades | CSS | Our own |
| Finale | Ship breaks into 34 dots, golden-angle sunflower dot on the ı, photo zooming through the "bındu" letter mask | Canvas + CSS mask, ScrollTrigger pin | Our own code. The mask-zoom ending uses the same technique as Rothfinder's ending. See section 4. |
| Sound toggle | 6 recorded cues, off by default | Web Audio | Kenney CC0 clips, our own logic |

The sunflower dot uses the golden angle (phyllotaxis). That's a mathematical pattern, so nobody owns it.

## 4. Design references: can we take inspiration from them?
Copyright protects code, images, text and specific artwork. It doesn't protect ideas, layouts in general, or techniques (such as "an image inside big letters that zooms"). We copied no code, images or copy from any of these.

| Reference | What we took | Risk | Note |
|---|---|---|---|
| Rothfinder (rothfinder.com) | The one-guide-through-the-page idea, and the photo-inside-the-wordmark zoom ending | **Low legally, medium for reputation** | This is the closest one. The ending follows their sequence on purpose. Ours uses our own ship, dots, wordmark, photo and copy, so it isn't a copy of their work. The risk is that design-savvy visitors notice the likeness. Don't name or link Rothfinder publicly as the source, and keep our own elements (the ship, the dot sunflower, the departures board) prominent. |
| Magic UI (magicui.design) | Animated Beam, Border Beam, Shimmer Button ideas | None | MIT licence. We'd be allowed to copy the code itself with the notice, and we didn't. |
| Difault (Webflow template) | General tone | None | Inspiration only. We used no template files, and buying the template isn't needed. |
| Rubie (via maxibestof) | Three-row pain → answer layout | None | Layout only. |
| time.fyi (via unsection) | Split pricing card | None | Layout only. |
| Made With GSAP | Pricing motion ideas | None | Inspiration only, no code taken. |
| Awwwards references in the brief | Mood | None | Inspiration only. |
| getbindu.com | Copy for the departures board rows and the blog-based wording | None | It's Bindu's own content. |

## 5. Tooling (never shipped)
| Tool | Licence | Note |
|---|---|---|
| paralect/saas-skills product-demo | MIT | Used only to record the demo videos |
| Playwright | Apache 2.0 | Local recording |
| ffmpeg-static | GPL (binary) | Used locally to encode video. The GPL doesn't carry over to the videos it makes. It's never bundled in the site. |
| educlopez/ui-craft skills | MIT | Instructions only |
| puppeteer-core QA scripts | Apache 2.0 | Local QA only |

**Demo videos on Drive:** they show the Hapag-Lloyd photo too. Fine for internal review. Re-record them after the photo swap before sharing them publicly.

## 6. Content honesty (checked against the brief's rules)
- Illustrations carry an Illustration label. The reference numbers and the QR-style pattern are marked as made up.
- No invented customers, metrics or prices. Pricing comes from getbindu.com.
- "In build" items aren't shown as live.
- One open item: the demo link (`CAL_URL`) is still a placeholder. The migration switches it to getbindu-landing's real demo link.

## 7. Checklist before going live
- [ ] Swap `port-cargo.webp` for an unbranded photo (Unsplash or Bindu's own), and update LICENSES.md.
- [ ] Bindu approves the yellow + cobalt mark.
- [ ] Finale port clip (r52): confirm the footage source and licence of `public/videos/rotterdam-port-hero*.webm` (and the poster `public/home/images/port-poster.webp` cut from it). It is Bindu's own asset from getbindu.com, but where the footage came from is not recorded.
- [ ] Leave `port-duotone.*` and the `roles/` pages out of the port.
- [ ] Keep a licences note in getbindu-landing: GSAP Standard, Lenis MIT, three MIT, Kenney CC0, Natural Earth public domain, Inter and Plex OFL, the photo's source.
- [ ] Re-record the demo videos after the photo swap if they'll be shared outside the team.
- [ ] Testimonials (`#voices`): replace `TESTIMONIALS_PLACEHOLDER` in `content.ts` with quotes Raahul has approved (real names, roles, companies, countries) and remove the "Placeholder" chip (`voices.placeholder` in Voices.tsx). No logos, avatars, ratings or numbers.
