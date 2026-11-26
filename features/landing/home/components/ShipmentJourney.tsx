import { getRoot } from "../lib/root";
import { isPhone } from "../lib/phone";
import { tRaf, tCaf } from "../lib/loop";
import { track, viewH } from "../lib/pos";
import { shipHome, mapU } from "../lib/shiphome";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { journey } from "../content";
import { gsap, getLenis, useReducedMotion } from "../lib/motion";
import { subscribeTheme } from "../lib/theme";
import { readCols, drawShip, buildFrom, SLOTS, NB, type Cols } from "../lib/shipcanvas";
import { toRgb } from "../lib/shipcanvas";
import {
  LAND, GRAT_D, DOTS, MAP_H, MAP_W, MILESTONES, SHIP_GEO, dropAt, routeAt,
  type Frame,
} from "../lib/shipmap";
import "../styles/shipment.css";

const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const LEAN = 0.3;          // extra zoom as the ship reaches a milestone
const PULL = 1.0;          // the zoom at the end, relative to the story's framing (the whole route in view)
const ZOOM = 1.6;          // camera zoom while following the ship, on top of the story's framing
const WAKE_PX = 70;        // length of the fading wake behind the ship, in screen pixels
const GATHER = 0.86;       // the trail dots start to gather into the sunflower at this point (the ship nears the port)
const CAM_EASE = 0.14;     // the camera moves a seventh of the way to its framing each frame (about half a second)

// the ship's place along the route: 0 at the origin, 1 at the port; scroll is mapped to this
const shipProgress = (p: number) => clamp((p - 0.04) / 0.92);
/* r30-1: the pin ends with TAIL (a share of the viewport height; the CSS adds the same 80vh to the pin) of pinned scroll after the ship has arrived: the hand-off to the guide ship
   is a pure function of how far into that tail the scroll is, so it plays at any scroll speed while the map is still on screen, and in reverse going back up. */
const tail = () => (isPhone() ? 0.5 : 0.8);   // r35: a shorter tail on phones (the CSS pin is 220svh there: 170 for the route and 50 for the tail)

/* r25-1, rebuilt in r59-5: one canvas, everything vector and redrawn at the camera's scale every frame (the old pre-rendered land bitmap was scaled by the camera, which is what
   made the map blur when it zoomed in). Land is Natural Earth, drawn ring by ring (only the rings in view, cached Path2D, constant screen-width strokes); the route, the trail,
   the dots, the markers and the ship are drawn on top. Milestone notes and labels stay real HTML text, positioned with transforms and written only when they change. */
/* built on first use: Path2D does not exist on the server, where this module is also evaluated */
let gratPath: Path2D | null = null;

/* r19 item 6: the milestone notes sit beside the route at their points: (dx, dy) in screen pixels, alternating above and below */
const NOTE_OFF: [number, number][] = [[16, -26], [-16, 30], [16, -26], [-16, 30], [16, -26], [-16, 30]];

export function ShipmentJourney() {
  const isStatic = useReducedMotion();
  const pin = useRef<HTMLDivElement>(null);
  const frameEl = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const notes = useRef<(HTMLSpanElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const flip = useRef(1);
  const at = useRef<{ x: number; y: number } | null>(null);
  const brk = useRef({ v: 0 });
  const mapFig = useRef<HTMLElement>(null);
  const originEl = useRef<HTMLSpanElement>(null);
  // round 13 item 6: the regulation story (ARIA tabs). Each story has its own route, framing, cargo and milestones.
  const [idx, setIdx] = useState(0);
  const story = journey.stories[idx];
  const geo = SHIP_GEO[story!.id];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [current, setCurrent] = useState(isStatic ? MILESTONES.length - 1 : 0);
  /* r44-3: the supply-chain question folded in. At the proof milestone of each story one small question bubble and its answer line appear on the map (and stay for the
     next milestone), driven by the existing `current` milestone, so they reverse with the scroll. GSAP owns the start state, set after hydration; static: always shown. */
  const askEl = useRef<HTMLDivElement>(null);
  const askSeen = useRef(false);
  const ask = story!.ask;
  const askOn = current >= ask.at && current <= ask.at + 1;
  const askOnRef = useRef(false);
  askOnRef.current = askOn;
  useEffect(() => {
    const el = askEl.current;
    if (!el) return;
    if (isStatic) { gsap.set(el, { clearProps: "opacity,visibility,transform" }); return; }
    const first = !askSeen.current;
    askSeen.current = true;
    if (first) { gsap.set(el, { autoAlpha: askOn ? 1 : 0, y: askOn ? 0 : 10 }); return; }
    gsap.to(el, { autoAlpha: askOn ? 1 : 0, y: askOn ? 0 : 10, duration: 0.45, ease: askOn ? "power2.out" : "power2.in", overwrite: true });
  }, [askOn, story, isStatic]);
  // the camera's framing, eased from one story's framing to the next (so the map animates between them)
  const view = useRef<Frame>({ ...(SHIP_GEO[journey.stories[0]!.id])!.frame });

  useEffect(() => {
    const el = pin.current!, fEl = frameEl.current!, cvs = cv.current!, ctx = cvs.getContext("2d")!;
    const { route, frame: target, sun: sunAt } = geo!;
    const live = story!.live;
    let cols: Cols = readCols();
    let ink = "rgba(237,232,218,", dpr = 1;
    const inkRgb = () => { const [r, g, b] = toRgb(cols.ink); ink = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},`; };
    inkRgb();
    let askBox = [0, 0, 0, 0];   // the question card in the frame (measured on resize, never per frame): an obstacle for the notes while it shows
    let ppu = 1;   // screen pixels per map unit, measured on resize
    // round 15 item 10: the frame may be height-limited (the viewBox is letterboxed), so a map unit is min(w / MAP_W, h / MAP_H) pixels
    let vw = MAP_W, vh = MAP_H;
    const tw: number[] = [];   // each label's text width in screen pixels (measured once the font is in)
    const nw: number[] = [], nh: number[] = [];   // the same for the milestone notes (width and height of the label card)
    const noteOff = NOTE_OFF.map((o) => [o[0], o[1]] as [number, number]);   // r55: the offset each note uses (the placement pass may flip or push it); the look is unchanged
    const setCw = () => getRoot().style.setProperty("--cw", `${document.documentElement.clientWidth}px`);   // r22-11: the map bleeds to the right edge
    setCw(); window.addEventListener("resize", setCw);
    // places on the route, computed once per story
    const msPos = MILESTONES.map((m) => routeAt(route, m.t * route.length));
    const dotPos = Array.from({ length: DOTS }, (_, i) => routeAt(route, dropAt(i) * route.length));

    // the base, drawn live: the rings in view, at this frame's scale, as ONE path (one fill, one stroke). px: user units per css pixel; (x0, y0, x1, y1): the view box in map units.
    // Points closer than about a pixel to the last one drawn are skipped, so a wide view does not walk every vertex of every coast.
    const paintBase = (c: CanvasRenderingContext2D, px: number, x0: number, y0: number, x1: number, y1: number) => {
      c.lineJoin = "round"; c.lineCap = "round"; c.setLineDash([]);
      c.lineWidth = px; c.strokeStyle = `${ink}0.1)`; c.stroke((gratPath ??= new Path2D(GRAT_D)));
      const minSize = 0.6 * px, skip = 1.6 * px;   // rings smaller than about half a pixel are not drawn
      c.beginPath();
      for (let i = 0; i < LAND.length; i++) {
        const r = LAND[i]!;
        if (r.x1 < x0 || r.x0 > x1 || r.y1 < y0 || r.y0 > y1 || (r.x1 - r.x0 < minSize && r.y1 - r.y0 < minSize)) continue;
        const pts = r.pts;
        let lx = pts[0]![0], ly = pts[0]![1];
        c.moveTo(lx, ly);
        for (let k = 1; k < pts.length; k++) {
          const q = pts[k]!;
          if (Math.abs(q[0] - lx) + Math.abs(q[1] - ly) < skip && k < pts.length - 1) continue;
          c.lineTo(q[0], q[1]); lx = q[0]; ly = q[1];
        }
        c.closePath();
      }
      c.fillStyle = `${ink}0.05)`; c.fill();
      c.lineJoin = "miter"; c.lineCap = "butt";   // a 0.75px coast needs no round joins, and they are the slow path
      c.strokeStyle = `${ink}0.7)`; c.lineWidth = 0.75 * px; c.stroke();
    };

    const measure = () => {
      const r = fEl.getBoundingClientRect();
      vw = r.width || MAP_W; vh = r.height || MAP_H;
      dpr = Math.min(isPhone() ? 1.5 : 2, window.devicePixelRatio || 1);   // r58: the real device pixel ratio, up to 2 on desktop (was 1.5), so the map and the ship are sharp
      cvs.width = Math.round(vw * dpr); cvs.height = Math.round(vh * dpr);
      ppu = Math.min(vw / MAP_W, vh / MAP_H) || 1;
      const ae = askEl.current; if (ae) askBox = [8, vh - 12 - ae.offsetHeight - 6, 12 + ae.offsetWidth + 6, vh - 6];
      // round 17: where the route start sits in the figure at the start frame (the ink guide's dot lands here and becomes the cargo)
      const fr = mapFig.current?.getBoundingClientRect(), og = originEl.current;
      if (fr && og) {
        const s0 = target.s, [x0, y0] = route.pts[0]!;
        og.style.left = `${(r.left - fr.left + vw / 2 + ppu * s0 * (x0 - target.cx)).toFixed(1)}px`;
        og.style.top = `${(r.top - fr.top + vh / 2 + ppu * s0 * (y0 - target.cy)).toFixed(1)}px`;
        window.dispatchEvent(new Event("guide:refresh"));
      }
    };

    // the scroll position, 0 to 1 (the ship's place is shipProgress of this). Pinned: the pin's own scroll range.
    const tk = track(el);
    const moveRange = () => tk.h - viewH() - tail() * viewH();   // the part of the pin the ship sails in
    const progress = () => {
      const range = moveRange();
      return shipProgress(range > 0 ? clamp(-tk.rectTop() / range) : 0);
    };
    // the hand-off (0 to 1): from the moment the ship is at the port (p = 0.96 of the sailing range) through the tail of the pin
    const handoff = () => {
      const range = moveRange();
      return range > 0 ? clamp((-tk.rectTop() - 0.96 * range) / (tail() * viewH() + 0.04 * range)) : 0;
    };
    let lastT = isStatic ? 1 : progress();
    let raf = 0, tween = 0, fadeRaf = 0;

    // what the last render worked out, for the canvas
    const st = { t: 0, s: 1, cx: 0, cy: 0, fx: 0, fy: 0, ang: 0, bob: 0, d: 0, cur: 0, inited: false };
    // note and label fades (eased by hand, so the text and the lines on the canvas fade together)
    const nA = MILESTONES.map(() => 0), nT = MILESTONES.map(() => 0), lA = geo!.labels.map(() => 0), lT = geo!.labels.map(() => 1);
    // write a DOM value only when it changed
    const last = new WeakMap<Element, string>(), lastO = new WeakMap<Element, string>();
    const putText = (sp: HTMLSpanElement | null, x: number, y: number, endAnchor: boolean, a: number) => {
      if (!sp) return;
      const tf = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)${endAnchor ? " translateX(-100%)" : ""}`;
      if (last.get(sp) !== tf) { last.set(sp, tf); sp.style.transform = tf; }
      const o = a.toFixed(2), ko = lastO.get(sp);
      if (ko !== o) { lastO.set(sp, o); sp.style.opacity = o; }
    };

    let formed = false, left = false;
    const sm01 = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
    // r24-4, r29-3: at the destination port the ship dissolves into the dots of the Bindu mark (b 0 to 0.4, drawn here, on the map's canvas: each ship dot flies into the
    // mark dot it joins), then the mark's dots leave for the gutter ship (b 0.4 to 1) and are drawn by the Guide's canvas, which also draws the ship building itself from them.
    // The mark's dots publish where they are (shipHome.mark) so the beads start exactly there; time-based: one tween of b over 2.4s (the mark takes the first 40%).
    const frOff = { x: 0, y: 0 };
    /* ---------- the live canvas ---------- */
    const circle = (x: number, y: number, r: number) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); };
    let drawT = 0;
    const draw = (soft = false) => {
      if (!st.inited) return;
      const nowT = performance.now();
      if (soft && nowT - drawT < 10) return;   // r58: the fade loop does not repaint a frame the scroll render has just painted
      drawT = nowT;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, vw, vh);
      const { s, cx, cy, t, d } = st, S = ppu * s, X = (x: number) => vw / 2 + S * (x - cx), Y = (y: number) => vh / 2 + S * (y - cy);
      // the base: land and graticule redrawn at the camera's scale (vector, constant-width strokes), never a scaled bitmap
      ctx.save(); ctx.translate(vw / 2, vh / 2); ctx.scale(S, S); ctx.translate(-cx, -cy);
      paintBase(ctx, 1 / S, cx - vw / (2 * S), cy - vh / (2 * S), cx + vw / (2 * S), cy + vh / (2 * S));
      ctx.restore();
      // the route, the trail behind the ship and its bright wake
      const rp = route.pts, trace = (d0: number, d1: number) => {
        const a = routeAt(route, d0), b = routeAt(route, d1);
        ctx.beginPath(); ctx.moveTo(X(a.x), Y(a.y));
        for (let i = 0; i < rp.length; i++) if (route.cum[i]! > d0 && route.cum[i]! < d1) ctx.lineTo(X(rp[i]![0]), Y(rp[i]![1]));
        ctx.lineTo(X(b.x), Y(b.y));
      };
      // the path ahead: dashed cobalt; the path behind: solid cobalt; both 1.5 css px at any zoom. The ship's wake fades out over about 70px behind it.
      ctx.lineCap = "butt"; ctx.lineWidth = 1.5; ctx.strokeStyle = `rgba(${cols.rr},${cols.rg},${cols.rb},0.85)`; ctx.setLineDash([6, 6]);
      if (d < route.length) { trace(d, route.length); ctx.stroke(); }
      ctx.setLineDash([]); ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (d > 0) {
        ctx.strokeStyle = cols.route; trace(0, d); ctx.stroke();
        const wk = WAKE_PX / S, N = 6;
        ctx.lineWidth = 3;
        for (let k = 0; k < N; k++) { ctx.globalAlpha = 0.5 * (1 - k / N); ctx.strokeStyle = cols.route; trace(Math.max(0, d - (k + 1) * wk / N), Math.max(0, d - k * wk / N)); ctx.stroke(); }
        ctx.globalAlpha = 1; ctx.lineWidth = 1.5;
      }
      // the trail dots: each is dropped when the ship passes it, then gathers into the sunflower at the port; yellow with a darker edge once filed
      const filed = t >= 0.995 && live;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < DOTS; i++) {
        const f0 = dropAt(i);
        if (t < f0) continue;
        const gather = smooth(clamp((t - GATHER - 0.06 * (i / DOTS)) / 0.08)), p = dotPos[i], [ax, ay] = sunAt[i]!;
        // r28-8, r29-3: the mark's dots are the ones that leave: dot i hides the moment its bead (drawn by the Guide, from this very spot) sets off, so the mark empties into the stream
        const mxp = X(p!.x + (ax - p!.x) * gather), myp = Y(p!.y + (ay - p!.y) * gather);
        if (i < 34 && shipHome.markOn) { shipHome.mark[2 * i] = frOff.x + mxp; shipHome.mark[2 * i + 1] = frOff.y + myp; }
        const bq = (brk.current.v - 0.4) / 0.6;
        if (bq > 0 && i < 34 && mapU(bq, i) > 0.00001) continue;
        circle(mxp, myp, 1.5);
        if (filed) { ctx.fillStyle = cols.fill; ctx.fill(); ctx.strokeStyle = cols.outline; ctx.stroke(); } else { ctx.fillStyle = cols.cobalt; ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      // the milestone markers and the lines of their notes
      MILESTONES.forEach((_, i) => {
        const mx = X(msPos[i]!.x), my = Y(msPos[i]!.y), reached = i <= st.cur, coming = !live && i === MILESTONES.length - 1;
        if (nA[i]! > 0.01 && window.innerWidth > 860) {   // (under 861px the cards are hidden and the list carries the steps, so no leaders)
          const [dx, dy] = noteOff[i]!;
          ctx.lineWidth = 1; ctx.strokeStyle = `${ink}${nA[i]!.toFixed(2)})`; ctx.beginPath(); ctx.moveTo(Math.floor(mx) + 0.5, Math.floor(my) + 0.5); ctx.lineTo(Math.floor(mx + dx) + 0.5, Math.floor(my + dy) + 0.5); ctx.stroke();   // r28-9: a 1px ink leader
        }
        circle(mx, my, 3.2); ctx.lineWidth = 1.5;
        if (reached && coming) { ctx.fillStyle = cols.canvas; ctx.strokeStyle = cols.onDark; ctx.setLineDash([2, 1.6]); ctx.fill(); ctx.stroke(); ctx.setLineDash([]); }
        else if (reached) { ctx.fillStyle = cols.fill; ctx.strokeStyle = cols.outline; ctx.fill(); ctx.stroke(); }
        else { ctx.fillStyle = cols.canvas; ctx.strokeStyle = cols.route; ctx.fill(); ctx.stroke(); }
      });
      // the guide ship (22px, upright, tilts up to 3 degrees, bobs, faces its direction of travel). At the port (b 0 to 0.4) it comes apart a part at a time: its 34 dots fly in short
      // curves into the dots of the mark (quart-out, staggered) and fade into them. The ship is never drawn whole next to its dots.
      const b = brk.current.v;
      if (b <= 0.00001 || b >= 0.4) { if (b <= 0.00001) drawShip(ctx, cols, X(st.fx), Y(st.fy) + st.bob * 0.8, st.ang, 0.4, flip.current, 1); }
      else {
        const q = b / 0.4, sx = X(st.fx), sy = Y(st.fy) + st.bob * 0.8, fl = flip.current, rr = (st.ang * Math.PI) / 180, cr = Math.cos(rr), sr = Math.sin(rr), land = new Float32Array(NB);
        for (let j = 0; j < NB; j++) land[j] = 1 - sm01(mapU(q, j) / 0.15);
        drawShip(ctx, cols, sx, sy, st.ang, 0.4, fl, 1, 0, buildFrom(land));
        for (let j = 0; j < NB; j++) {
          const u = mapU(q, j); if (u <= 0.0001) continue;
          const a0 = SLOTS[j]!.x * 0.4 * fl, b0 = SLOTS[j]!.y * 0.4, x0 = sx + a0 * cr - b0 * sr, y0 = sy + a0 * sr + b0 * cr;
          const [ax, ay] = sunAt[j]!, x1 = X(ax), y1 = Y(ay), v = 1 - u, mx = (x0 + x1) / 2 + ((j % 5) - 2) * 4, my = Math.min(y0, y1) - 14;
          ctx.globalAlpha = sm01(u / 0.1) * (1 - sm01((u - 0.85) / 0.15));
          circle(v * v * x0 + 2 * v * u * mx + u * u * x1, v * v * y0 + 2 * v * u * my + u * u * y1, 2.1 - 0.6 * u);
          ctx.fillStyle = SLOTS[j]!.yel ? cols.yellow : cols.route; ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    };
    // the text layer: notes and labels as real text, shown only while all of one is inside the frame (never cut by the edge)
    const text = () => {
      const { s, cx, cy, t } = st, S = ppu * s, X = (x: number) => vw / 2 + S * (x - cx), Y = (y: number) => vh / 2 + S * (y - cy);
      geo!.labels.forEach((l, i) => {
        const sp = labels.current[i];
        if (!sp) return;
        if (!tw[i]) tw[i] = sp.offsetWidth;
        const x = X(l.p[0]), y = Y(l.p[1]), a = l.off?.[2] ?? "start", ox = l.off?.[0] ?? 7, oy = l.off?.[1] ?? -6, lf = x + ox - (a === "end" ? tw[i] : 0), top = y + oy - 9, mg = 4;
        lT[i] = lf >= mg && lf + tw[i] <= vw - mg && top >= mg && top + 12 <= vh - mg ? 1 : 0;
        putText(sp, x + ox, y + oy - 8, a === "end", lA[i]!);
      });
      /* r55-5 (kept in r56, look unchanged): notes never overlap each other, a map label or another milestone point. The current note is placed first, then the earlier ones,
         newest first; each tries its own offset, then flipped and pushed ones, and takes the first clear one; an earlier note with no clear place is hidden. */
      const placed: number[][] = [];
      if (askOnRef.current && askBox[2]! > 0) placed.push(askBox);
      geo!.labels.forEach((l, i) => {
        if (!tw[i] || lT[i] === 0) return;
        const a = l.off?.[2] ?? "start", x = X(l.p[0]) + (l.off?.[0] ?? 7), y = Y(l.p[1]) + (l.off?.[1] ?? -6) - 8, lf = x - (a === "end" ? tw[i]! : 0);
        placed.push([lf - 3, y - 2, lf + tw[i]! + 3, y + 16]);
      });
      const pts = msPos.map((q) => [X(q.x), Y(q.y)]);
      const hit = (r: number[], o: number[]) => r[0]! < o[2]! && r[2]! > o[0]! && r[1]! < o[3]! && r[3]! > o[1]!;
      const order = MILESTONES.map((_, i) => i).sort((a, b) => { const ka = a > st.cur ? 1000 + a : st.cur - a, kb = b > st.cur ? 1000 + b : st.cur - b; return ka - kb; });
      order.forEach((i) => {
        const m = MILESTONES[i]!;
        const sp = notes.current[i];
        if (!sp) return;
        if (!nw[i]) { nw[i] = sp.offsetWidth; nh[i] = sp.offsetHeight; }
        const w = nw[i]!, h = nh[i]!, x = pts[i]![0]!, y = pts[i]![1]!, base = NOTE_OFF[i]!;
        const rect = (dx: number, dy: number) => { const lf = dx > 0 ? x + dx : x + dx - w, top = dy < 0 ? y + dy - h : y + dy; return [lf, top, lf + w, top + h]; };
        const cands: [number, number][] = [];
        for (const k of [1, 2.2, 3.6]) for (const hx of [1, -1, 4, -4]) for (const sy of [1, -1]) cands.push([base[0] * hx, base[1] * k * sy]);
        cands.unshift([base[0], base[1]], [-base[0], base[1]], [base[0], -base[1]], [-base[0], -base[1]]);
        let best = cands[0]!, bestScore = Infinity;
        for (const cd of cands) {
          const r = rect(cd[0], cd[1]);
          let score = 0;
          if (!(r[0]! >= 4 && r[2]! <= vw - 4 && r[1]! >= 4 && r[3]! <= vh - 4)) score += 1000;
          for (const o of placed) if (hit(r, o)) score += 100;
          pts.forEach((p, k) => { if (k !== i && hit(r, [p[0]! - 6, p[1]! - 6, p[0]! + 6, p[1]! + 6])) score += 40; });
          score += (Math.abs(cd[0]) + Math.abs(cd[1])) * 0.01;
          if (score < bestScore) { bestScore = score; best = cd; }
        }
        noteOff[i] = best;
        const [dx, dy] = best, right = dx > 0;
        const r = rect(dx, dy), top = r[1]!;
        const inFrame = r[0]! >= 4 && r[2]! <= vw - 4 && top >= 4 && r[3]! <= vh - 4;
        nT[i] = t < m.t - 0.03 || !inFrame || (bestScore >= 100 && i !== st.cur) ? 0 : 1;   // a step shows once it is reached; past steps stay (muted by colour, not by fading)
        if (nT[i]) placed.push(r);
        sp.dataset.state = i < st.cur ? "done" : i === st.cur ? "current" : "next";
        putText(sp, x + dx, top, !right, nA[i]!);
      });
    };
    const fade = () => {
      fadeRaf = 0;
      let more = false;
      const step = (a: number[], tg: number[]) => a.forEach((v, i) => { const dv = tg[i]! - v; if (Math.abs(dv) < 0.02) a[i] = tg[i]!; else { a[i] = v + dv * 0.25; more = true; } });
      step(nA, nT); step(lA, lT);
      text(); draw(true);
      if (more) fadeRaf = tRaf(fade);
    };
    const settleFades = () => { if (isStatic) { nA.forEach((_, i) => (nA[i] = nT[i]!)); lA.forEach((_, i) => (lA[i] = lT[i]!)); } else if (!fadeRaf) fadeRaf = tRaf(fade); };

    const paintBreak = (noDraw = false) => {
      const a = at.current;
      if (!a) return;
      const b = brk.current.v;
      if (b >= 0.4 && !formed) { formed = true; } else if (b < 0.34) formed = false;
      if (b >= 0.5 && !left) { left = true; } else if (b < 0.45) left = false;
      shipHome.dock = sm01((b - 0.9) / 0.1) * shipHome.pres;
      shipHome.brk = b; shipHome.markOn = b > 0.4 && !isStatic; shipHome.markFilled = live && lastT >= 0.995;
      if (b > 0.4) { const r = fEl.getBoundingClientRect(); frOff.x = r.left; frOff.y = r.top; }
      if (!noDraw || b > 0.4) draw();   // the map's frame first (it publishes where the mark's dots are and hides the ones that left), then the Guide's, in the same tick
      shipHome.now();
    };

    // one pure function of the ship's place on the route, so it reverses on scroll-up
    const render = (t: number) => {
      lastT = t;
      const v = view.current;
      const d = t * route.length;
      const f = routeAt(route, d);
      /* r59-5: the camera starts wide on the whole route, eases in to follow the ship, leans in on each milestone as the ship reaches it (a smooth bump either side of the
         milestone), and pulls back out over the last stretch to show the route travelled before the hand-off. A pure function of the scroll, so it reverses. */
      const w = smooth(clamp((t - 0.04) / 0.2));                    // overview first, then follow
      let lean = 0;
      for (let i = 1; i < MILESTONES.length - 1; i++) lean = Math.max(lean, smooth(clamp(1 - Math.abs(t - MILESTONES[i]!.t) / 0.05)));
      const pull = smooth(clamp((t - 0.9) / 0.1));
      const fs = v.s * (1 + (ZOOM - 1) * w) * (1 + LEAN * lean);
      const s = fs + (v.s * PULL - fs) * pull;
      const fcx = v.cx + (f.x - v.cx) * w, fcy = v.cy + (f.y - v.cy) * w;
      const cx = fcx + (v.cx - fcx) * pull, cy = fcy + (v.cy - fcy) * pull;
      const hx = Math.cos((f.angle * Math.PI) / 180), hy = Math.sin((f.angle * Math.PI) / 180);
      if (hx > 0.35) flip.current = 1; else if (hx < -0.35) flip.current = -1;
      at.current = { x: f.x, y: f.y };
      let cur = 0;
      MILESTONES.forEach((m, i) => { if (t >= m.t - 1e-6) cur = i; });
      Object.assign(st, { t, s, cx, cy, fx: f.x, fy: f.y, ang: 3 * hy * flip.current, bob: isStatic ? 0 : Math.sin(t * 70) * 2, d, cur, inited: true });
      // r22-5, r30-1: at the destination port the ship breaks into dots as the pin's tail is scrolled (a function of the scroll position: reverses on scroll-up)
      if (!isStatic) brk.current.v = handoff();   // r30-1: by scroll state, not by a timed tween started on a crossing
      text(); settleFades(); if (isStatic) text();
      draw();
      if (!isStatic) paintBreak(true);
      setCurrent(cur);
    };

    // the camera eases from the previous framing to this story's (exponential, so it slows into place)
    const settle = () => {
      const v = view.current, k = isStatic ? 1 : CAM_EASE;
      v.s += (target.s - v.s) * k; v.cx += (target.cx - v.cx) * k; v.cy += (target.cy - v.cy) * k;
      const near = Math.abs(target.s - v.s) < 1e-3 && Math.abs(target.cx - v.cx) < 0.2 && Math.abs(target.cy - v.cy) < 0.2;
      if (near) Object.assign(v, target);
      render(lastT);
      tween = near ? 0 : tRaf(settle);
    };

    const unTheme = subscribeTheme(() => { cols = readCols(); inkRgb(); draw(); });
    const detach = () => { unTheme(); window.removeEventListener("resize", setCw); };

    if (isStatic) {
      // reduced motion: the full route, every milestone, the ship already at the port with the sunflower filed; no easing
      measure(); setCurrent(MILESTONES.length - 1);
      Object.assign(view.current, target);
      render(1);
      return detach;
    }

    let visible = false;
    const update = () => {
      raf = 0;
      if (!visible) return;   // off-screen: no work at all
      render(progress());
    };
    const onScroll = () => { if (!raf) raf = tRaf(update); };
    const onResize = () => { measure(); onScroll(); };
    /* r58: while this pin is on screen the page scroll is smoothed for about 0.3s (Lenis lerp 0.2) instead of the page's 0.1 (about 0.6s), so the ship answers the wheel */
    const lerpTo = (v: number) => { const l = getLenis(); if (l) l.options.lerp = v; };
    const io = new IntersectionObserver(([e]) => { visible = e!.isIntersecting; lerpTo(visible ? 0.2 : 0.1); if (visible) onScroll(); gsap.to(shipHome, { pres: visible ? 1 : 0, duration: 0.4, overwrite: true, onUpdate: () => paintBreak() }); });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    measure();
    settle();
    onScroll();
    document.fonts?.ready.then(() => { tw.length = 0; nw.length = 0; measure(); onScroll(); });
    return () => {
      detach(); io.disconnect(); lerpTo(0.1); gsap.killTweensOf(shipHome); shipHome.pres = 1; shipHome.dock = 0; shipHome.brk = 0; shipHome.markOn = false; shipHome.kick(); gsap.killTweensOf(brk.current); brk.current.v = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) tCaf(raf);
      if (tween) tCaf(tween);
      if (fadeRaf) tCaf(fadeRaf);
    };
  }, [isStatic, story, geo]);

  // the ARIA tab pattern: arrow keys, Home and End move the selection and the focus
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = journey.stories.length;
    const moves: Record<string, number> = { ArrowRight: (idx + 1) % n, ArrowLeft: (idx + n - 1) % n, Home: 0, End: n - 1 };
    if (!(e.key in moves)) return;
    const next = moves[e.key];
    e.preventDefault();
    setIdx(next!);
    tabs.current[next!]?.focus();
  };

  return (
    <section className="band-dark sec ship" id="shipment" aria-labelledby="ship-h" data-guide-anchor="ship" data-guide-side="l">
      {/* the whole section is pinned: the title, the regulation control and the map share one window while the ship travels */}
      <div ref={pin} className={`ship-pin${isStatic ? " is-static" : ""}`}>
        <div className="ship-stage" data-guide-gutter>
          <div className="sec-head">
            <h2 id="ship-h" className="t-display-lg" suppressHydrationWarning>{journey.title}</h2>
            <p className="t-body-lg ship-sub">{story!.sub}</p>
            <div className="seg-track ship-seg">
              <div
                className="seg-in"
                role="tablist"
                aria-label="Regulation story"
                onKeyDown={onTabKey}
                style={{ "--n": journey.stories.length, "--i": idx } as CSSProperties}
              >
                <span className="seg-ind" aria-hidden="true" />
                {journey.stories.map((s, i) => (
                  <button
                    key={s.id}
                    ref={(el) => { tabs.current[i] = el; }}
                    type="button"
                    role="tab"
                    id={`ship-tab-${s.id}`}
                    aria-selected={i === idx}
                    aria-controls="ship-panel"
                    tabIndex={i === idx ? 0 : -1}
                    className={`seg-opt${i === idx ? " is-on" : ""}`}
                    onClick={() => setIdx(i)}
                  >
                    {s.tab}
                    <span className="sr"> {s.live ? "Live" : "In build"}</span>
                  </button>
                ))}
              </div>
            </div>
            <ul className="ship-chips" aria-label="Status">
              {story!.chips.map((c) => <li key={c.text} className={`ship-status ${c.live ? "is-live" : "is-build"}`}><b aria-hidden="true" />{c.text}{c.live ? "" : ", coming"}</li>)}
            </ul>
          </div>
          <div id="ship-panel" role="tabpanel" aria-labelledby={`ship-tab-${story!.id}`} className="ship-cols">
            <figure ref={mapFig} className="ship-map">
              <span ref={originEl} className="ship-origin" aria-hidden="true" />
              <div ref={frameEl} className="ship-svg" role="img" aria-label={`Map of the example ${story!.tab} route, with six milestones`}>
                <canvas ref={cv} className="ship-cv" />
                <div className="ship-txt">
                  {MILESTONES.map((_, i) => {
                    const label = (story!.milestones[i])!.label, coming = !story!.live && i === MILESTONES.length - 1;
                    return <span key={`${story!.id}-n${i}`} ref={(el) => { notes.current[i] = el; }} className={`ship-note${coming ? " is-coming" : ""}`}><b>{label}</b><i>{(story!.milestones[i])!.detail}</i></span>;
                  })}
                  {geo!.labels.map((l, i) => <span key={`${story!.id}-${l.text}`} ref={(el) => { labels.current[i] = el; }} className="ship-label">{l.text}</span>)}
                </div>
                <div ref={askEl} className="ship-ask">
                  <p className="ship-ask-q"><span className="chip chip-illus">{journey.illus}</span><span>{ask.q}</span></p>
                  <p className="ship-ask-a">{ask.a}</p>
                </div>
              </div>
              <figcaption className="ship-cap">
                <span className="chip chip-illus">{journey.illus}</span> {journey.caption}
              </figcaption>
            </figure>
            <ol className="ship-list">
              {story!.milestones.map((m, i) => (
                <li key={`${story!.id}-${i}`} className={`ship-ms${!story!.live && i === story!.milestones.length - 1 ? " is-coming" : ""}`} data-state={i < current ? "done" : i === current ? "current" : "next"}>
                  <div>
                    <h3>{m.label}</h3>
                    <p>{m.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* phones only (CSS): the current milestone's sentence, once, under the compact index */}
            <p className={`ship-now${!story!.live && current === story!.milestones.length - 1 ? " is-coming" : ""}`} aria-hidden="true">{(story!.milestones[Math.min(current, story!.milestones.length - 1)])!.detail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
