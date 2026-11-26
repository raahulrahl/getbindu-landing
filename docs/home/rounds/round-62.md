Round 62 on the homepage (`/`): the ending (finale `#demo`, Closing.tsx, the guide ship hand-off). DESIGN.md v4. Only change what's listed. The footer text and layout (keeps) stay.

## 1. The guide ship ends where its path ends
- Today the gutter ship travels down into the finale and hands off to the ı. Instead: wherever the ship's lane ends (its last anchor before the finale), the ship breaks into its 34 dots right there (a short scatter-and-settle, about 0.6s of scroll, scrubbed and reversible, yellow dots with the ink ring), and the dots fade out in place. Nothing travels down into the finale. Scrolling back up reassembles the ship.
- The finale's ı sunflower builds itself as it does now (its own 34 dots), not from the ship's dots.
- Phones and reduced motion: the ship (or the small dot) simply fades out at the lane end.

## 2. The video opens fully
- The mask zoom through the letters of "bındu" must end with the port video covering the whole window (no letter edges, no canvas showing at any viewport ratio, 16:9 to 9:16), and stay full for a short hold before the footer rides up. Compute the final mask scale from the viewport so the counter of the letters always clears the screen corners; add a small margin.

## 3. A clean zoom
- The zoom must feel smooth and centred: one continuous scale on one ScrollTrigger with `SCRUB_SOFT`, an ease that starts slow and accelerates (`power2.in` on scale) and lands without a jump; the zoom origin is the ı dot (the focus stays on it all the way), the video stays centred under the mask (no drift), and the video is drawn at full resolution at every scale (no upscaled blur: scale the mask, not a rasterised layer). No stutter at the start (preload and decode the video before the pin starts; poster until ready).
- Check 1440x900, 1920x1080, 1280x720, 768x1024 and 390x844.

## Report
One line per item, judgement calls, what was not verified. Look at it yourself.
