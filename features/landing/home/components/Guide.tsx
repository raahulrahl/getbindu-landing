import { getRoot } from "../lib/root";
import { tRaf, tCaf } from "../lib/loop";
import { isPhone } from "../lib/phone";
import { useEffect, useRef } from "react";
import { gsap, reduceMotion, SCRUB_SOFT } from "../lib/motion";
import { rng, smoothPath } from "../lib/guide";
import { isPaused, subscribePause } from "../lib/pause";
import { shipHome, fin, FINP, BREAK_SPAN, outQuart, mapU } from "../lib/shiphome";
import { subscribeTheme } from "../lib/theme";
import { track, scrollPos } from "../lib/pos";
import { readCols, drawShip, buildFrom, SLOTS, NB, type Cols } from "../lib/shipcanvas";

/* Round 18, item 1: the guide is a small container ship. It is drawn by us in ink (side view, about 40px wide on desktop) and sails
   a dashed sea lane down ONE side gutter of the page, meandering about 12px, so it never crosses text. It stays upright: it tilts up
   to 3 degrees with the direction of travel and bobs up to 2px while the page scrolls. At each section anchor (data-guide-anchor) it
   leaves a small yellow proof dot with an ink ring. Where the gutter is too narrow for the ship (phones, small tablets) a 10px yellow
   dot with an ink ring travels the same route. Reduced motion: the lane and every proof dot are drawn. The site pause control freezes it.
   Round 25 item 1: ONE fixed, full-viewport canvas (pointer-events none, dpr 1.5 at most) draws all of it, redrawn only when something changed
   (dirty flag, from the single gsap ticker). Every dash of the lane and every tick is its own straight segment along the local tangent.
   Round 25 item 2, r29 items 3 and 5, r62-1: the ship ends where its lane ends: it breaks into its 34 dots there (a short scatter, then they fade out in place), driven by fin.b
   (the scroll position, smoothed with SCRUB_SOFT). Nothing travels into the finale; the dot of the i builds from its own dots. The map's hand-off (the Bindu mark's dots flying to the gutter ship) is drawn here too, so every dot and the ship are on
   this one canvas. The ship assembles from its dots (and comes apart into them) a part at a time: drawShip takes a Build made from how far each dot has landed. */

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const sm = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, w: number) => a + (b - a) * w;
const SHIP_W = 40;   // the guide ship is about 40px wide (the art is 56 units)

/* the mini mark at each section: nine dots swirl into a small golden-angle sunflower, then settle into the yellow proof dot with a cobalt ring */
const NSW = 9;
const mini = Array.from({ length: NSW }, (_, k) => { const a = k * 2.39996, rr = 9 * Math.sqrt((k + 0.5) / NSW); return { sx: Math.cos(a) * rr, sy: Math.sin(a) * rr, y0: -(k + 1) * 12 }; });

type Model = {
  pinTop: number; range: number;
  H: number; yStart: number; yEnd: number; xAt: (y: number) => number; ship: boolean; k: number;
  band: [number, number] | null; end: { x: number; y: number; r: number } | null;   // the dot of the i, in stage coordinates
};

export function Guide() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = cv.current;
    if (!el) return;
    const ctx = el.getContext("2d")!;
    const rm = reduceMotion();
    const root = getRoot(), docEl = document.documentElement;
    let cols: Cols = readCols();
    const rgbaOf = (a: number) => `rgba(${cols.rr},${cols.rg},${cols.rb},${a})`;
    let CW = 0, CH = 0, dpr = 1;
    let m: Model | null = null;
    let ftk: ReturnType<typeof track> | null = null;   // r30-1: the finale's place, re-measured whenever the page's layout has changed (the model below is rebuilt later, debounced)
    // the lane: straight dashes (x1, y1, x2, y2 in page pixels), ticks the same, the sailed line as short smooth pieces
    let dashes = new Float32Array(0), ticks = new Float32Array(0), tickYs: number[] = [], lastTick = -1;
    let sailed: { y0: number; y1: number; p: Path2D }[] = [];
    let trail = { y: new Float32Array(0), x: new Float32Array(0), r: new Float32Array(0), o: new Float32Array(0) };
    let proofsData: { y: number; x: number; u: number }[] = [];
    let raf = 0, lastKey = "";
    let lastTy = -1;
    // r23-4: a living wake. The faster the page scrolls, the more cobalt dots the ship sheds, each drifting up to 6px sideways and fading over about 1.5s
    // (r24: a fixed pool, nothing allocated while it runs)
    const NW = 110, wT = new Float64Array(NW).fill(-1e9), wX = new Float32Array(NW), wY = new Float32Array(NW), wDx = new Float32Array(NW), wR = new Float32Array(NW);
    let wi = 0, wakeAlive = false;
    const intro = { t: 1 };
    let introTween: gsap.core.Tween | null = null;
    const rock = { a: 0 };
    const shipAt = { x: -99, y: -99, a: 0, sc: 0 };

    // r28-7: a coordinate snapped to the middle of a device pixel (a 1px line then covers exactly one pixel row or column, at any pixel ratio)
    const sn = (v: number) => (Math.floor(v * dpr) + 0.5) / dpr;

    const size = () => {
      dpr = isPhone() ? 1 : Math.min(1.5, window.devicePixelRatio || 1);   // r35: DPR 1 on phones
      CW = docEl.clientWidth; CH = window.innerHeight;
      el.width = Math.round(CW * dpr); el.height = Math.round(CH * dpr);
      el.style.width = `${CW}px`; el.style.height = `${CH}px`;
    };

    /* ---------- measure and build (once per resize) ---------- */
    const build = () => {
      size();
      const W = docEl.clientWidth, sy = window.scrollY, vh = window.innerHeight;
      const H = Math.max(docEl.scrollHeight, document.body.scrollHeight);
      const secs = Array.from(document.querySelectorAll<HTMLElement>("main [data-guide-anchor]"));
      if (!secs.length) { m = null; return; }
      const lefts = Array.from(document.querySelectorAll<HTMLElement>("main .container, main [data-guide-gutter]"))
        .filter((n) => n.offsetWidth > 0)
        .map((n) => n.getBoundingClientRect().left + parseFloat(getComputedStyle(n).paddingLeft || "0"));
      const gl = Math.max(10, Math.min(...lefts));          // the width of the left gutter: nothing but the page canvas
      const ship = W > 600 && gl - 10 >= 40;
      const k = ship ? Math.min(1, (gl - 10) / SHIP_W) : 1;
      const half = ship ? (SHIP_W * k) / 2 : 5;
      const xc = Math.min(gl / 2, 140);
      const amp = Math.max(0, Math.min(30, ship ? gl / 2 - half - 6 : gl / 2 - half - 2, xc - half - 2));
      const A = Math.min(12, amp);   // r23-3: a smooth, regular sine meander (about 12px, wavelength about 220px): the motion of a ship on water, no noise
      const xLeft = (y: number) => xc + A * Math.sin((y * 2 * Math.PI) / 220);

      const anchors = secs.map((s) => ({ id: s.dataset.guideAnchor || "", y: s.getBoundingClientRect().top + sy, h: s.offsetHeight }));
      const hero = anchors.find((a) => a.id === "hero");
      if (hero) hero.y += vh * 0.5;
      const finale = anchors.find((a) => a.id === "finale");
      const finaleEl = secs.find((n) => n.dataset.guideAnchor === "finale");
      ftk = finaleEl ? track(finaleEl) : null;
      const shipSec = anchors.find((a) => a.id === "ship");
      const exSec = anchors.find((a) => a.id === "examples");   // the tags run edge to edge, so the ship stays out of that section too
      const band: Model["band"] = shipSec ? [shipSec.y, (exSec ?? shipSec).y + (exSec ?? shipSec).h] : null;
      // the dot of the dotless i and the wordmark, measured against the sticky stage (so it does not depend on the scroll position)
      const wm = document.querySelector<HTMLElement>(".fz-dot"), stage = document.querySelector<HTMLElement>(".fz-stage");
      let end: Model["end"] = null;
      if (wm && stage && finale) {
        // layout offsets (not rects), so a dot that is transformed at the moment of measuring gives the same numbers; summed up the offsetParent chain, relative to the stage
        const off = (e: HTMLElement) => { let x = 0, y = 0; for (let n: HTMLElement | null = e; n; n = n.offsetParent as HTMLElement | null) { x += n.offsetLeft; y += n.offsetTop; } return { x, y }; };
        const so = off(stage), d0 = off(wm), r = wm.offsetWidth / 2;
        end = { x: d0.x - so.x + r, y: d0.y - so.y + wm.offsetHeight / 2, r: Math.max(4, r) };
      }
      const bandEnd = band ? band[1] : Infinity;
      const xAt = (y: number) => (y >= bandEnd - 1 ? W - xLeft(y) : xLeft(y));   // r19: after the map the ship returns in the opposite gutter
      const yStart = anchors[0]!.y;
      const yEnd = finale ? finale.y - vh * 0.1 : H - 200;   // r29-5: the lane runs on to just above the ending, the ship parks at its end
      const ranges: [number, number][] = band && band[1] + 40 < yEnd ? [[yStart, band[0]], [band[1] + 1, yEnd]] : [[yStart, yEnd]];

      // r25: every dash is a straight 4px segment along the tangent at its start (4px dash, 6px gap), snapped to the half pixel; ticks are straight, perpendicular to the tangent
      const ds: number[] = [];
      for (const [y0, y1] of ranges) {
        let L = 0, next = 0, px = xAt(y0);
        for (let y = y0 + 0.5; y <= y1; y += 0.5) {
          const x = xAt(y); L += Math.hypot(x - px, 0.5); px = x;
          if (L >= next) {
            next += 10;
            const sl = (xAt(y + 2) - xAt(y - 2)) / 4, n = Math.hypot(sl, 1), tx = sl / n, ty = 1 / n;
            ds.push(sn(x), sn(y), sn(x + tx * 4), sn(y + ty * 4));
          }
        }
      }
      dashes = new Float32Array(ds);
      tickYs = []; const ts: number[] = [];
      for (let y = Math.ceil(yStart / 120) * 120; y < yEnd; y += 120) {
        if (band && y > band[0] && y < band[1]) continue;
        const x = xAt(y), sl = (xAt(y + 6) - xAt(y - 6)) / 12, n = Math.hypot(1, sl), nx = 1 / n, ny = -sl / n;   // r21-3: waypoint ticks every about 120px
        ts.push(sn(x - nx * 4), sn(y - ny * 4), sn(x + nx * 4), sn(y + ny * 4));
        tickYs.push(y);
      }
      ticks = new Float32Array(ts);
      // the solid sailed line stays a smooth curve, in pieces of about 600px
      sailed = [];
      for (const [y0, y1] of ranges) {
        for (let a = y0; a < y1; a += 600) {
          const b = Math.min(y1, a + 600), pts: [number, number][] = [];
          for (let y = a; y < b; y += 12) pts.push([xAt(y), y]);
          pts.push([xAt(b), b]);
          sailed.push({ y0: a, y1: b, p: new Path2D(smoothPath(pts)) });
        }
      }
      // r22-3: the permanent trail: one dot every about 30px, sizes 2 to 4px, varied opacities
      const tr = rng(17), tY: number[] = [], tX: number[] = [], tR: number[] = [], tO: number[] = [];
      for (const [y0, y1] of ranges) for (let y = y0 + 10; y < y1; y += 30) { tX.push(xAt(y) + (tr() - 0.5) * 2); tY.push(y); tR.push(1 + tr()); tO.push(0.55 + tr() * 0.45); }
      trail = { y: new Float32Array(tY), x: new Float32Array(tX), r: new Float32Array(tR), o: new Float32Array(tO) };
      proofsData = anchors.filter((a) => a.id !== "finale").map((a) => ({ y: a.y, x: xAt(a.y), u: -1 }));
      m = { pinTop: finale ? finale.y : 0, range: finale ? Math.max(1, finale.h - vh) : 1, H, yStart, yEnd, xAt, ship, k, band, end };
      fin.b = bv.v = rm ? 0 : rawB();
      lastKey = "";
      draw();
    };

    // first index in a sorted flat array (stride step, y at offset 1 for the segments) whose y is not below v
    const lb = (arr: Float32Array, step: number, off: number, v: number) => { let a = 0, b = arr.length / step; while (a < b) { const c = (a + b) >> 1; if (arr[c * step + off]! < v) a = c + 1; else b = c; } return a * step; };

    /* ---------- one frame: a pure function of scroll and fin.t ---------- */
    // r34-2: the finale's zoom starts at FINP.zoom viewport heights into its pin (the same place the finale's own scroll trigger uses)
    const isGone = (sy: number) => !!ftk && sy >= ftk.top + FINP.zoom * CH;
    let goneNow = false;
    const onScrollGone = () => { if (rm && isGone(scrollPos()) !== goneNow) kick(); };   // reduced motion has no scroll redraw: only the hide and show change
    const draw = () => {
      raf = 0;
      const mm = m;
      if (!mm || !CW) return;
      const s = scrollPos(), vh = CH, W = CW;   // r65-13: no layout read inside the frame
      // r34-2: from the start of the finale's zoom on, the lane, the ship and its dots are not drawn (the final view is the photo, the button and the footer); they come back on scroll up
      goneNow = isGone(s);
      if (goneNow) { if (lastKey !== "gone") { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, vh); lastKey = "gone"; } wakeAlive = false; shipAt.a = 0; return; }
            const ty = rm ? mm.yEnd : clamp(s + vh * 0.55, mm.yStart, mm.yEnd);
      const key = `${ty.toFixed(1)}|${s.toFixed(0)}|${intro.t.toFixed(2)}|${fin.b.toFixed(3)}|${fin.z.toFixed(2)}|${shipHome.brk.toFixed(4)}|${rock.a.toFixed(1)}`;
      if (key === lastKey && !wakeAlive) return;
      lastKey = key;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, vh);
      const sr = Math.round(s * dpr) / dpr, lo = s - 20, hi = s + vh + 20;   // r28-7: the scroll offset is a whole number of device pixels, so every dash stays on the pixel grid
      // r35: on phones the course line, the sailed line, the trail dots, the ticks and the wake are not drawn: only the travelling dot and the proof dots stay
      const phone = isPhone();
      // the lane: straight dashes
      ctx.lineCap = "butt"; ctx.lineWidth = 1; ctx.strokeStyle = cols.route; ctx.globalAlpha = 0.3;
      ctx.beginPath();
      if (!phone) for (let i = lb(dashes, 4, 1, lo - 8); i < dashes.length && dashes[i + 1]! < hi; i += 4) { ctx.moveTo(dashes[i]!, dashes[i + 1]! - sr); ctx.lineTo(dashes[i + 2]!, dashes[i + 3]! - sr); }
      ctx.stroke();
      ctx.globalAlpha = 1;
      // what has been sailed: a solid smooth line that fades to about 40% further back, the trail dots, and the ticks (clipped at the ship)
      if (ty - s > 0 && !phone) {
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, W, ty - s); ctx.clip();
        ctx.translate(0, -s);
        const g = ctx.createLinearGradient(0, ty - 1500, 0, ty);
        g.addColorStop(0, rgbaOf(0.4)); g.addColorStop(1, rgbaOf(1));
        ctx.strokeStyle = g; ctx.lineWidth = 1.25;
        for (const c of sailed) if (c.y1 > lo && c.y0 < Math.min(hi, ty)) ctx.stroke(c.p);
        ctx.fillStyle = cols.route;
        for (let i = lb(trail.y, 1, 0, lo) ; i < trail.y.length && trail.y[i]! < Math.min(hi, ty); i++) {
          ctx.globalAlpha = trail.o[i]! * (0.4 + 0.6 * clamp((trail.y[i]! - (ty - 1500)) / 1500));
          ctx.beginPath(); ctx.arc(trail.x[i]!, trail.y[i]!, trail.r[i]!, 0, 6.2832); ctx.fill();
        }
        ctx.restore();
        ctx.globalAlpha = 1; ctx.strokeStyle = cols.route; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = lb(ticks, 4, 1, lo - 8); i < ticks.length && ticks[i + 1]! < hi; i += 4) if (ticks[i + 1]! <= ty) { ctx.moveTo(ticks[i]!, ticks[i + 1]! - sr); ctx.lineTo(ticks[i + 2]!, ticks[i + 3]! - sr); }
        ctx.stroke();
      }
      // passing a waypoint tick plays the tick cue (forward only)
      let ti = lastTick; while (ti + 1 < tickYs.length && tickYs[ti + 1]! <= ty) ti++; while (ti >= 0 && tickYs[ti]! > ty) ti--;
      lastTick = ti;
      // r21-2: at each anchor the dots sailed since the last one swirl into a small sunflower (the Bindu mark), then settle into one yellow
      // proof dot with a cobalt ring (the chime). A pure function of ty, so scrolling back un-swirls it.
      proofsData.forEach((pd, pi) => {
        const u = rm ? 1 : clamp((ty - (pd.y - 50)) / 150);
        pd.u = u;
        const py = pd.y - s;
        if (py < -30 || py > vh + 130) return;
        const e = sm(u), col = sm((u - 0.7) / 0.3), rot = (1 - e) * 2.2, cs = Math.cos(rot), sn = Math.sin(rot);
        ctx.fillStyle = cols.route;
        if (col < 1) for (let k = 0; k < NSW; k++) {
          const m0 = mini[k], tx = m0!.sx * cs - m0!.sy * sn, ty2 = m0!.sx * sn + m0!.sy * cs, a = clamp((ty - (pd.y + m0!.y0)) / 6) * (1 - col);
          if (a <= 0.01) continue;
          ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(pd.x + lerp(0, tx, e) * (1 - col), py + lerp(m0!.y0, ty2, e) * (1 - col), 1.7, 0, 6.2832); ctx.fill();
        }
        if (col > 0.01) {
          ctx.globalAlpha = col; ctx.strokeStyle = cols.route; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(pd.x, py, 6.5, 0, 6.2832); ctx.stroke();
          ctx.fillStyle = cols.yellow; ctx.beginPath(); ctx.arc(pd.x, py, 3.2, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
      // where the sailor is: x from the lane, a small tilt with the direction of travel, a small bob with the scroll
      let px = mm.xAt(ty), py = ty;
      const slope = (mm.xAt(ty + 16) - mm.xAt(ty - 16)) / 32;
      const tilt = clamp(slope * 14, -1, 1) * 3, bob = rm ? 0 : 2 * Math.sin(ty / 26);
      let vis = 1;
      if (mm.band) {
        const [bt, bb] = mm.band;
        vis = ty <= bt ? 1 - sm((ty - (bt - 120)) / 120) : ty < bb ? 0 : sm((ty - bb) / 120);
      }
      // r24-4, r29-3: at the end of the map the dots of the mark stream into the gutter ship, which builds itself from them here; it fades out over the last 120px of the band
      const bk = rm ? 0 : shipHome.brk, handing = !phone && !!mm.band && ty < mm.band[1] && bk > 0.4 && shipHome.markOn;   // r35: no map to ship hand-off on phones
      if (handing) vis = Math.max(vis, shipHome.pres * (1 - sm((ty - (mm.band![1] - 120)) / 120)));
      // the wake
      const now = performance.now();
      if (!rm && !phone && lastTy >= 0 && vis > 0.3 && intro.t >= 1) {
        const dy = ty - lastTy, n = Math.min(8, Math.floor(Math.abs(dy) / 8));
        for (let k = 1; k <= n; k++) { const yy = lastTy + (dy * k) / n, w = wi++ % NW; wT[w] = now; wX[w] = mm.xAt(yy) + (Math.random() - 0.5) * 3; wY[w] = yy; wDx[w] = (Math.random() - 0.5) * 12; wR[w] = 1 + Math.random() * 1.4; }
      }
      lastTy = ty;
      wakeAlive = false;
      ctx.fillStyle = cols.route;
      for (let i = 0; i < NW; i++) {
        const a = (now - wT[i]!) / 1500;
        if (a >= 1 || a < 0) continue;
        wakeAlive = true;
        ctx.globalAlpha = 0.85 * (1 - a); ctx.beginPath(); ctx.arc(wX[i]! + wDx[i]! * a, wY[i]! - s, wR[i]!, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (isPaused()) wakeAlive = false;
      let sc = mm.k * (0.4 + 0.6 * vis);
      if (intro.t < 1) {
        const e = sm(intro.t), cx = W / 2, cy = s + vh / 2;
        px = cx + (px - cx) * e; py = cy + (py - cy) * e; sc *= 0.25 + 0.75 * e;
      }
      shipHome.x = px; shipHome.y = py - s; shipHome.ship = mm.ship; shipHome.k = mm.k;
      let sx = px, sy = py - s + bob, sRot = tilt, sAlpha = Math.max(0, vis), sScale = mm.ship ? (SHIP_W / 56) * sc : 0.12, dotA = 1, showShip = mm.ship, bd: ReturnType<typeof buildFrom> | undefined;
      // slot j of the ship on screen (the ship's own tilt included)
      const cr = Math.cos((sRot * Math.PI) / 180), sr2 = Math.sin((sRot * Math.PI) / 180);
      const slotAt = (j: number, o: { x: number; y: number }) => { const a = SLOTS[j]!.x * sScale, b = SLOTS[j]!.y * sScale; o.x = sx + a * cr - b * sr2; o.y = sy + a * sr2 + b * cr; };
      const sp = { x: 0, y: 0 }, bead = (x: number, y: number, r: number, a: number, yel: boolean) => {
        if (a <= 0.003) return;
        ctx.globalAlpha = a; ctx.fillStyle = yel ? cols.yellow : cols.route; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
        if (yel) { ctx.lineWidth = 0.8; ctx.strokeStyle = cols.yOut; ctx.stroke(); }
        ctx.globalAlpha = 1;
      };
      const land = new Float32Array(NB);
      if (mm.end && rm) { sAlpha = 0; dotA = 0; }
      const B = rm ? 0 : fin.b;
      if (mm.end && !rm && B > 0 && (!mm.ship || phone)) { dotA = 1 - sm(B / 0.6); sAlpha *= 1 - sm(B / 0.6); }   // r62-1: phones and small gutters: the dot (or the ship) simply fades out at the lane end
      // r29-3: the map's hand-off. The 34 dots of the Bindu mark leave from where they are (shipHome.mark), fly a curve to their slot on the gutter ship (quart-out, staggered)
      // and the ship draws itself in as each lands. One function of the break value, so scrolling back plays it in reverse.
      if (handing) {
        const q = clamp((bk - 0.4) / 0.6), mk = shipHome.mark;
        let cx0 = 0, cy0 = 0; for (let j = 0; j < NB; j++) { cx0 += mk[2 * j]!; cy0 += mk[2 * j + 1]!; } cx0 /= NB; cy0 /= NB;
        for (let j = 0; j < NB; j++) land[j] = sm((mapU(q, j) - 0.85) / 0.15);
        if (land[NB - 1]! < 0.999) bd = buildFrom(land);
        sAlpha = Math.max(sAlpha, vis); showShip = true;
        const fade = 1 - sm((q - 0.9) / 0.1);
        ctx.save(); ctx.lineCap = "butt"; ctx.lineWidth = 1; ctx.strokeStyle = cols.route; ctx.setLineDash([4, 6]); ctx.globalAlpha = 0.4 * fade * sm(q / 0.15);
        ctx.beginPath(); ctx.moveTo(Math.floor(cx0) + 0.5, Math.floor(cy0) + 0.5); ctx.quadraticCurveTo((cx0 + sx) / 2, Math.min(cy0, sy) - 70, Math.floor(sx) + 0.5, Math.floor(sy) + 0.5); ctx.stroke(); ctx.restore();
        for (let j = 0; j < NB; j++) {
          const u = mapU(q, j); if (land[j]! >= 0.999) continue;
          slotAt(j, sp);
          const ax = mk[2 * j], ay = mk[2 * j + 1], mx = (ax! + sp.x) / 2 + ((j % 7) - 3) * 5, my = Math.min(ay!, sp.y) - 70, v = 1 - u;
          bead(v * v * ax! + 2 * v * u * mx + u * u * sp.x, v * v * ay! + 2 * v * u * my + u * u * sp.y, 1.5 + 0.7 * Math.min(1, u * 3), 1 - land[j]!, shipHome.markFilled);
        }
      }
      // r62-1: the end of the lane. The ship breaks into its 34 dots right where the lane ends: each dot leaves its slot, scatters a short way and settles (quart-out, staggered), then
      // fades out in place. A pure function of fin.b (scroll), so scrolling back up reassembles the ship. Nothing flies into the finale.
      if (mm.end && !rm && !phone && mm.ship && B > 0) {
        for (let j = 0; j < NB; j++) land[j] = 1 - sm(outQuart((B - (0.3 * j) / (NB - 1)) / 0.7) / 0.15);
        bd = buildFrom(land);
        sAlpha = Math.max(0, vis); showShip = true;
        for (let j = 0; j < NB; j++) {
          const u = outQuart((B - (0.3 * j) / (NB - 1)) / 0.7); if (u <= 0.0001) continue;
          const a = sm(u / 0.1) * (1 - sm((B - 0.55 - (0.25 * j) / (NB - 1)) / 0.4));
          if (a <= 0.003) continue;
          slotAt(j, sp);
          const ang = j * 2.39996 + 0.7, dist = (10 + 22 * (((j * 7) % 11) / 10)) * u;   // each dot scatters its own way, 10 to 32px
          ctx.globalAlpha = a * vis; ctx.fillStyle = cols.yellow; ctx.strokeStyle = cols.ink; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(sp.x + Math.cos(ang) * dist, sp.y + Math.sin(ang) * dist - 6 * u, lerp(2.2, 1.9, u), 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
      if (showShip && sAlpha > 0.002) {
        shipAt.x = sx; shipAt.y = sy; shipAt.a = sAlpha; shipAt.sc = sScale;
        drawShip(ctx, cols, sx, sy, sRot, sScale, 1, sAlpha, rock.a, bd);
      } else shipAt.a = 0;
      if (!mm.ship && dotA > 0.01 && vis > 0.01) {
        ctx.globalAlpha = vis * dotA; ctx.fillStyle = cols.yellow; ctx.strokeStyle = cols.ink; ctx.lineWidth = 1.25;
        ctx.beginPath(); ctx.arc(px, py - s, 5, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
      }
            if (wakeAlive) kick();
    };
    const kick = () => { if (!raf && !isPaused()) raf = tRaf(draw); };
    // r62-1: the break of the ship at the end of its lane follows the scroll position (SCRUB_SOFT), starting where the ship reaches the lane end
    const rawB = () => (m ? clamp((scrollPos() - (m.yEnd - CH * 0.55)) / (BREAK_SPAN * CH)) : 0);
    const bv = { v: fin.b };   // private, so the finale's own cleanup (killTweensOf(fin)) cannot stop it
    const onScrollB = () => { const r = rawB(); if (r !== bv.v) gsap.to(bv, { v: r, duration: SCRUB_SOFT, ease: "power2.out", overwrite: true, onUpdate: () => { fin.b = bv.v; kick(); } }); };
    shipHome.kick = kick; shipHome.now = () => { if (raf) { tCaf(raf); raf = 0; } draw(); };

    /* ---------- wiring ---------- */
    let timer = 0, stopIntro = () => {};
    const rebuild = () => { window.clearTimeout(timer); timer = window.setTimeout(build, 120); };
    if (root.dataset.intro === "on") {
      intro.t = 0;
      const mo = new MutationObserver(() => {
        if (root.dataset.intro !== "off" || introTween) return;
        mo.disconnect();
        el.classList.add("is-on");
        introTween = gsap.to(intro, { t: 1, duration: 0.5, ease: "power2.inOut", onUpdate: kick, onComplete: () => { introTween = null; } });
        kick();
      });
      mo.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
      stopIntro = () => mo.disconnect();
    } else el.classList.add("is-on");
    const ro = new ResizeObserver(rebuild);
    ro.observe(getRoot());
    // clicking the ship sounds its horn and rocks it (the canvas takes no pointer events, so the click is tested against the ship's place)
    const near = (e: MouseEvent) => shipAt.a > 0.3 && Math.hypot(e.clientX - shipAt.x, e.clientY - (shipAt.y - 8 * shipAt.sc)) < Math.max(18, 28 * shipAt.sc);
    const onClick = (e: MouseEvent) => {
      if (!near(e)) return;
      gsap.killTweensOf(rock);
      gsap.to(rock, { keyframes: [{ a: -7, duration: 0.13 }, { a: 5, duration: 0.2 }, { a: -2, duration: 0.2 }, { a: 0, duration: 0.12 }], ease: "power2.out", onUpdate: kick });
    };
    let over = false;
    const onMove = (e: PointerEvent) => { const n = near(e); if (n !== over) { over = n; root.classList.toggle("g-over", n); } };
    window.addEventListener("click", onClick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", rebuild);
    window.addEventListener("guide:refresh", rebuild);
    window.addEventListener("load", rebuild);
    if (!rm) { window.addEventListener("scroll", kick, { passive: true }); window.addEventListener("scroll", onScrollB, { passive: true }); }
    else window.addEventListener("scroll", onScrollGone, { passive: true });
    const unPause = subscribePause(() => { if (!isPaused()) { lastKey = ""; kick(); } });
    const unTheme = subscribeTheme(() => { cols = readCols(); lastKey = ""; kick(); });
    document.fonts?.ready.then(rebuild);
    // r30-1: images that finish loading after the first measure change heights too
    const onImg = () => rebuild();
    Array.from(document.images).forEach((im) => { if (!im.complete) im.addEventListener("load", onImg, { once: true }); });
    build();
    return () => {
      window.clearTimeout(timer); tCaf(raf); shipHome.kick = () => {}; shipHome.now = () => {}; stopIntro(); ro.disconnect(); introTween?.kill(); unPause(); unTheme(); gsap.killTweensOf(rock);
      window.removeEventListener("resize", rebuild); window.removeEventListener("guide:refresh", rebuild);
      window.removeEventListener("scroll", kick); window.removeEventListener("scroll", onScrollB); gsap.killTweensOf(bv); fin.b = 0; window.removeEventListener("scroll", onScrollGone); window.removeEventListener("load", rebuild);
      window.removeEventListener("click", onClick); window.removeEventListener("pointermove", onMove); root.classList.remove("g-over");
    };
  }, []);

  return <canvas ref={cv} className="guide" aria-hidden="true" />;
}
