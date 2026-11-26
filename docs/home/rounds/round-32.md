Round 32 on branch `v3-story`. Follow CLAUDE.md. Change only what's listed.

## 1. Ending: ship → ı dot slower and clearly visible
- The ship → dots → sunflower ı dot hand-off happens over too little scroll (fin.t runs from 0.56 to 0.18 viewport heights above the pin, about 0.38vh), so it flashes by.
- Make it slow and readable:
  - Pin the finale stage while the hand-off plays, so the ship (in its right gutter) and the "bındu" wordmark are both on screen the whole time.
  - Spread fin.t over about 120vh of scroll inside that pin, before the mask zoom starts.
  - Light smoothing (scrub about 0.8), so slow scrolling feels fluid, not steppy.
  - Order: a short hold with the ship docked on the right; the ship comes apart (about 30% of the range); the dots travel in curves to the ı (about 50%); the sunflower settles and holds (about 20%). Then the zoom begins.
- It stays scroll-driven (round 30's lesson: it must play at any speed and reverse).
- Verify with real wheel scrolling (qa/r30 approach) in both themes at slow and normal speed, and that it reverses.
- Commit: "v3 r32 1: slower, pinned ship → ı hand-off".

## 2. Install the `product-demo` skill (paralect/saas-skills, MIT)
- Copy `C:\Users\HP\AppData\Local\Temp\claude\12675c165a4ba0dd\a4557441-a123-432f-a224-e2c6729f6167\scratchpad\saas-skills\skills\product-demo\` into `c:\Users\HP\projects\bindu\.claude\skills\product-demo\`, plus the repo's LICENSE file as LICENSE.txt in that folder. It has already been read and checked: it installs Playwright into its own scripts folder and drives a local browser, nothing else.
- ffmpeg isn't installed on this PC. Install `ffmpeg-static` (npm) inside the skill's `scripts/` folder only (no system install), and put its binary's folder first on PATH when you run record.mjs.
- Add a line to docs/home/LICENSES.md: "Tooling (not shipped): paralect/saas-skills product-demo, MIT; ffmpeg-static (GPL binary, local use only)".
- Commit the skill folder (not its node_modules): "tooling: product-demo skill (paralect/saas-skills, MIT)". Add `.claude/skills/product-demo/scripts/node_modules/` and `out/` to .gitignore.

## 3. Record a website demo: light and dark
Follow the skill's SKILL.md. Two takes, the same script, one per theme: `out/product-demo/takes/site-light.mjs` and `site-dark.mjs`.
- **URL:** http://localhost:3010/. Set the theme in `prepare(page)` through the site's real localStorage key (`bindu-theme`), and mark the intro as seen only if you want to skip it. Better: let the 1s intro play at the start.
- **Canvas:** landscape, `--width 1600 --height 900 --pad 40`, wallpaper `warm` for light and `dark` for dark, `--scale 1.5`, 30fps.
- **What it shows (about 60–90s), the cursor narrating:**
  1. the intro, then the hero headline; hover the "Book a 15-minute demo" button (letter roll) and the nav items
  2. the sound toggle hovered (not clicked: videos are silent), and the theme toggle hovered
  3. scroll through the statement (Bindu lights up), Sound familiar? (strikes), How it works (typing, log, QR from dots)
  4. the journey map: click one or two tabs, see the ship sail and the dots → ship hand-off
  5. the departures board, rows revealing with the story panel
  6. pricing: hover the tabs, click one, hover "Estimate your cost"
  7. the FAQ: open one question
  8. the ending: the ship → sunflower ı dot, the zoom into the photo, the closing line; hover the final demo button
- **JS animations vs capture speed:** the recorder slows CSS animations to the capture rate, but GSAP, Lenis and canvas loops run in real time, so time-based motion would look sped up.
  - In `ready(t)`, slow them to the same rate: get the app's GSAP instance (try importing the same module URL Vite serves to the page, e.g. via `t.app.evaluate(() => import('/node_modules/.vite/deps/gsap.js'))`, and set `gsap.globalTimeline.timeScale(rate)`).
  - If that isn't possible without changing product code, add a dev-only hook (`if (import.meta.env.DEV) window.__bindu = { gsap }`) and log it in DECISIONS.md as tooling-only.
  - Scroll-driven parts are fine either way; use `t.wheel` with enough frames so they read slowly.
- First do a `--still` framing check for each take, then record.
- **Outputs:** `out/product-demo/site-light.mp4` + `.png` and `site-dark.mp4` + `.png`. Don't commit the videos. Commit only the two take files: "demo: site walkthrough takes (light, dark)".
- Review with the contact-sheet command from the skill, and fix obvious problems (a missing hover state, a jump) by adjusting the take only, never product code (except the dev-only hook above).

## Rules
- Stage by explicit path only. Never stage the unrelated deleted files or v3/dist. LF.
- Dev server stays on 3010.
- Playwright's browsers must be closed; delete temp profiles.
- Report: one line per item; the video paths, sizes and durations; the exact re-render commands (with PATH set for ffmpeg); anything injected for presentation.
