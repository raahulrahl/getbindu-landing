# Component review with Austin (from 25 Nov 2026)

Step by step, one component at a time, after rounds 55 to 58 are built. For each: what Austin likes (keep), what he doesn't (fix), and the fix. When the walk-through is done, the fixes go into one round spec, then a consistency pass (one font and one design everywhere, DESIGN.md v4), then an audit with every anti-slop skill (antislop, antislop-ui, avoid-ai-design, hallmark, heydamir-unslop, make-interfaces-feel-better) and its fixes.

Order: 1 nav · 2 hero · 3 statement · 4 story · 5 Full Circle · 6 shipment map · 7 departures board · 8 testimonials · 9 rules · 10 pricing · 11 FAQ · 12 finale and footer · then shared parts: type, buttons, chips, links, panels.

| # | Component | Keep | Fix | Fix written as |
|---|---|---|---|---|
| 1 | Nav | Everything: "looks overall decent" (25 Nov) | Nothing | No change |
| 2 | Hero | The map | Title has no depth, "written randomly"; entrance has no wow; sub-line flat. Check Nunito actually loads first | B only (Austin dropped the dots effect): title larger (to 120px), heavier, tighter tracking and line height; map dots behind the letters dim in a soft halo; title parallax slower than the map on scroll; sub-line 22 to 24px, darker grey, balanced two lines, fades up word by word after the title, then Book a demo |
| 3 | Statement | Size, font, chip, everything else | The light-up transition isn't smooth | Round 59 item 2: continuous, overlapping per-word ramps on one smoothed scrub; chip and mark light with the same curve |
| 4 | Story | The idea and the structure (pin, four steps, left progress, right stage) | Font is off; looks vibecoded; the illustration looks drawn by a kid; the motion feels sluggish | Round 59 item 3: the stage redrawn as real product UI on one grid with one icon set and the page's type tokens; faster, tighter motion (shorter pin, lighter scrub, fewer simultaneous moves) |
| 5 | Full Circle | Structure, acts, tabs | Looks different from the rest; the type isn't strong enough | Round 59 item 4: same type weights and sizes as the other sections, stronger titles and captions, stage in the same app frame and line system as the story |
| 6 | Shipment map | Everything else (tabs, milestones, layout) | Map looks naive; blurs when it zooms; ship path blurred; the animation doesn't land | Round 59 item 5: vector-sharp at every zoom (redraw at the zoomed scale, never scale a bitmap), real coastlines, a camera that follows the ship |
| 7 | Departures board | Board, rows, colours, size | The scroll transition is sluggish, unoptimised, unpleasant; the background map isn't visible at all though the window has empty space | Round 59 item 6: rows change as discrete played steps (not a scrub), lighter flap DOM, the map visible around the board |
| 8 | Testimonials | The look and the 3D track | Animations a little laggy | Round 59 item 7 |
| 9 | Rules | The gallery | Animations a little laggy | Round 59 item 7 |
| 10 | Pricing | Everything: "don't change" | Nothing | No change |
| 11 | FAQ | Decent | Nothing | No change |
| 12 | Finale and footer | Decent | Nothing | No change |

Review done 25 Nov 2026. Fixes: round 59 items 0 to 7. Next (on Austin's go): consistency pass, then the anti-slop audit.
