# Licenses and sources

Third-party code and assets used by the homepage (`features/landing/home/`), with commercial-use status. The shorter, current list for this repo is `features/landing/home/LICENSES.md`.

## Used in the build
| Item | Licence | Commercial use |
|---|---|---|
| GSAP (and ScrollTrigger) | GSAP Standard "no charge" licence | Yes, free for commercial use since 30 Apr 2025 |
| Lenis | MIT | Yes |
| OGL | Unlicense | Yes |
| React, React DOM | MIT | Yes |
| Newsreader (next/font, r65; every text on the homepage, the getbindu.com heading face). Rubik, Nunito, Inter and IBM Plex Mono are no longer used on the homepage | SIL OFL 1.1 | Yes |
| Map coastlines (`src/lib/worldmap.ts`, `src/lib/shipmap.ts`) | Own work, hand-typed, simplified | Yes |

## Ideas from MIT libraries, rebuilt in our own code (no code copied)
- Magic UI: Animated Beam (Four documents), Border Beam (pricing card), Shiny / Shimmer Button (filled pill sheen).
- The hover-link snippet Austin supplied (source unknown): rewritten from scratch for the text links.

## Reference documents (not shipped)
| Item | Licence | Commercial use |
|---|---|---|
| `docs/references/notion-DESIGN.md` (VoltAgent awesome-design-md, Notion design analysis) | MIT | Reference only; nothing is shipped from it |

GSAP's MotionPathPlugin and DrawSVGPlugin (round 17, the ink guide) ship in the installed `gsap` package and are covered by the same GSAP Standard "no charge" licence listed above.

## Inspiration only, no code or assets copied
- Rothfinder (rothfinder.com): the idea of one hand-drawn scribble ball that travels the page trailing one line. Our guide is our own procedural scribble, written from scratch.
- Difault (Webflow template), Rubie (via maxibestof), time.fyi (via unsection), Made With GSAP.
- The Awwwards references listed in docs/home/project-context.md.

## Photos
| Item | Licence | Commercial use |
|---|---|---|
| Unsplash photo 1605732562742 (shipping containers, original colours): the finale photo `public/images/port-cargo.webp` (r29-2: the right-hand part of the original, 1440 x 3200, full height; framed at 75% down) behind the mask of the wordmark and under the closing line and footer. The big side lettering on the left stacks is cropped out; the small "Hapag-Lloyd" door text and container IDs still show. The original is kept out of the bundle in `docs/references/`. The earlier duotone crop (`port-duotone.*`) is no longer used | Unsplash Licence | Commercial use OK; swap for an unbranded photo before production. |

## Sounds
| Item | Licence | Commercial use |
|---|---|---|
| Kenney "Interface Sounds" (kenney.nl, via opengameart.org), 22 clips used (confirmation, tick, select, click, toggle, scratch, drop, bong): trimmed, level-matched and re-encoded as `public/sounds/*.ogg` and `.mp3` (about 140 KB in all); licence text kept in `public/sounds/Kenney-Interface-Sounds-License.txt` | CC0 (public domain) | Yes, no credit needed (credited here anyway). The "UI Audio" pack was not needed: the Interface Sounds pack covered every cue. |

## Fonts converted to paths
The mask of the finale wordmark (`src/lib/maskdata.ts`) is Inter 600 (SIL Open Font Licence, already used on the site) converted to SVG paths with fontTools.

## Own work (round 18 and 19)
The container ship, the product walk-through frame, the QR-style pattern (made up, not a real code), the worked-example tags and the ink strike are our own SVG and CSS. GSAP SplitText (letter roll on buttons, headings in round 20) ships in the installed `gsap` package under the same GSAP Standard no-charge licence as above.

## Map data
| Item | Licence | Commercial use |
|---|---|---|
| Natural Earth 1:50m land (naturalearthdata.com), simplified and quantised into `src/lib/landdata.ts` (about 60 KB) | Public domain | Yes, no attribution required |


## Tooling
- Tooling (not shipped): paralect/saas-skills product-demo, MIT; ffmpeg-static (GPL binary, local use only)
- Tooling (not shipped): educlopez/ui-craft skills (ui-craft, ui-craft-adapt, ui-craft-audit), MIT, instructions only; commercial use fine

## Slop-check skills (round 36, item 2; instructions only, reviewed before install, none shipped in the site)
Installed in `.claude/skills/`. Each carries a header: bindu-design wins every conflict.

| Name | URL | Licence | Commercial use | Date |
|---|---|---|---|---|
| hallmark (SKILL.md and references/gates.md only) | https://github.com/Nutlope/hallmark | MIT | Yes | 2026-11-22 |
| avoid-ai-design (with scripts/detect.mjs, read-only scanner) | https://github.com/funboy322/avoid-ai-design | MIT | Yes | 2026-11-22 |
| antislop, antislop-ui (core and UI skills only) | https://github.com/miqdadbadjuber/anti-slop | MIT | Yes | 2026-11-22 |
| make-interfaces-feel-better | https://github.com/jakubkrehel/make-interfaces-feel-better | MIT | Yes | 2026-11-22 |

## Performance tooling (23 Nov 2026)
- addyosmani/web-quality-skills (https://github.com/addyosmani/web-quality-skills): MIT, commercial use yes. Installed skills: performance, core-web-vitals, web-quality-audit, best-practices (instructions + one read-only shell script, reviewed).
- ChromeDevTools/chrome-devtools-mcp (https://github.com/ChromeDevTools/chrome-devtools-mcp): Apache-2.0, commercial use yes. Dev-only MCP server in `.mcp.json`, pinned to 1.12.0; not shipped with the site.

## Slop audit tooling (23 Nov 2026, r41-3)
- heydamir/unslop (https://github.com/heydamir/unslop): CC-BY-4.0, commercial use yes with attribution. Attribution: "unslop by Damir Sokolovsky (@heydamir), CC BY 4.0." Installed as `.claude/skills/heydamir-unslop/` (SKILL.md, signs, tokens, visuals, refs, LICENSE). Scripts and images not copied. Dev-only; not shipped with the site.

## SEO tooling (23 Nov 2026)
- addyosmani/web-quality-skills (https://github.com/addyosmani/web-quality-skills): MIT, commercial use yes. Installed skill: seo (`.claude/skills/seo/`, SKILL.md, references/STRUCTURED-DATA.md, LICENSE.txt). Instructions only, dev-only; not shipped with the site.
- squirrelscan/skills (https://github.com/squirrelscan/skills): MIT, commercial use yes. Installed skill: squirrelscan (`.claude/skills/squirrelscan/`, SKILL.md, references/, LICENSE.txt). Instructions and reference files for local audit workflows; not shipped with the site.
- AgriciDaniel/claude-blog (https://github.com/AgriciDaniel/claude-blog): MIT, commercial use yes. Installed skill: blog-analyze (`.claude/skills/blog-analyze/`, SKILL.md, LICENSE.txt). Content and SEO scoring rules for blog articles; not shipped with the site.
