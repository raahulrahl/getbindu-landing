import { getRoot } from "../lib/root";
import { tRaf, tCaf } from "../lib/loop";
import { useEffect, useRef, useState } from "react";
import { hero } from "../content";
import { useReducedMotion } from "../lib/motion";
import { subscribeTheme } from "../lib/theme";
import { setPaused } from "../lib/pause";
import { track } from "../lib/pos";
import { TM, buildPlan, createGL, flightOf, routeAt, state, type GLRig, type Plan, type Pt } from "../lib/particles";
import { isPhone } from "../lib/phone";
import {
  ORIGINS, PORTS, frame, paintGraticule, paintLandDots, paintLandDotsSweep, paintRoute, paintRouteArc, paintSweep, project, routeFn, type Frame,
} from "../lib/worldmap";

/* One map for the whole homepage: a single fixed canvas behind the page (.stage). The intro draws the dots into the
   map; when the intro ends the same canvas stays put and becomes the hero background, so there is no cut and no
   remount. The intro clock (ic) runs the particles; the hero clock (hc) runs the shipments and starts at the hand-off.
   Colour roles: land is dimmed cobalt dots; the graticule, route lines and ports are cobalt; shipments (their trails,
   heads and glow) are yellow, and so is the filing pulse at each port. A dark veil sits under the hero copy (built from
   its measured rect on resize, faded in with the hero). The static layer is cached per size; each frame moves only the
   routes and the sweep.
   Paused off-screen, in hidden tabs and by the user. Reduced motion gets one still frame of the hero map (no intro). */

export const INTRO_END = 1.0;    // seconds (round 19: about one second): the dots have collapsed into the mark, the hero takes over (Intro.tsx)

/* the hero routes: the six 22e11b0 origins plus six more (round 14), twelve in all, each to an EU port. Houston is North
   America, Cartagena Latin America, Durban Africa, Mumbai and Shanghai Asia, Piraeus Europe (its curve runs north over
   the Balkans). Every route is a curve on the map, not a sea lane. Each has its own speed, phase and intensity. The
   intro's dust still uses ORIGINS (worldmap.ts), so the intro is unchanged. */
const HERO_ORIGINS = [
  ...ORIGINS,
  [-95.4, 29.8], [72.8, 19.1], [31.0, -29.9], [23.6, 37.9], [-75.5, 10.4], [121.5, 31.2],   // Houston, Mumbai, Durban, Piraeus, Cartagena, Shanghai
] as typeof ORIGINS;
const ROUTES = HERO_ORIGINS.slice(0, 6).map((o, i) => ({
  from: o, to: PORTS[i % PORTS.length]!.at,
  period: 8 + (i % 3) * 1.5, phase: (i * 0.23) % 1, k: 0.55 + 0.45 * ((i * 0.61) % 1),
}));

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeIO = (t: number) => { const c = clamp(t); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
function cssVar(name: string) { return getComputedStyle(getRoot()).getPropertyValue(name).trim(); }
type Rgb = [number, number, number];
const rgbOf = (hex: string): Rgb => { const n = parseInt(hex.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const css = (c: Rgb) => `rgb(${c[0]},${c[1]},${c[2]})`;
const mixRgb = (a: Rgb, b: Rgb, w: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i]! - v) * w)).join(",")})`;

// edge: the darker outline round the yellow shipments, light theme only (--ship-outline is transparent on dark)
type Colors = { cobalt: string; yellow: string; mute: string; mono: string; edge: string };
const LAND_A = 0.2;   // round 17: quieter map, land dots at 20% so the type and the guide lead

/* the static map layer, scaled by a (0 to 1): the graticule, each route's faint line, and the ports with the first name */
function paintStatic(ctx: CanvasRenderingContext2D, f: Frame, c: Colors, a: number) {
  paintGraticule(ctx, f, c.cobalt, 0.1 * a);
  for (const r of ROUTES) paintRouteArc(ctx, f, r.from, r.to, c.cobalt, (0.05 + 0.07 * r.k) * a);
  for (const p of PORTS) {
    const [x, y] = project(f, p.at[0], p.at[1]);
    ctx.globalAlpha = 0.9 * a; ctx.fillStyle = c.cobalt; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
  }
  const [ax, ay] = project(f, PORTS[0]!.at[0], PORTS[0]!.at[1]);
  ctx.globalAlpha = a; ctx.font = `500 10px ${c.mono}`; ctx.fillStyle = c.mute; ctx.fillText(PORTS[0]!.name.toUpperCase(), ax + 8, ay - 8);
  ctx.globalAlpha = 1;
}

export function MapLayer({ intro, onIntroEnd }: { intro: boolean; onIntroEnd: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const ui = useRef<HTMLDivElement>(null);
  const introRef = useRef(intro);
  const endRef = useRef(onIntroEnd);
  endRef.current = onIntroEnd;
  const gl = useRef<{ el: HTMLCanvasElement; rig: GLRig | null; gone: boolean; timer: number } | null>(null);
  const outRef = useRef(1);                       // seconds since the intro ended, 0 to 1 (the dust fades out)
  const kickRef = useRef<() => void>(() => {});
  const control = useRef<((on: boolean) => void) | null>(null);
  const pausedRef = useRef(false);
  const still = useReducedMotion();
  const [playing, setPlaying] = useState(true);

  /* the intro ends: the dust freezes where it is and fades out (CSS), then its WebGL context is released */
  useEffect(() => {
    const wasIntro = introRef.current;
    introRef.current = intro;
    if (intro || !wasIntro) return;   // only the hand-off starts the fade
    outRef.current = 0;
    const g = gl.current;
    if (g) {
      g.el.classList.add("is-out");
      g.timer = window.setTimeout(() => retire(g), 1100);
    }
    kickRef.current();
  }, [intro]);

  useEffect(() => {
    const el = canvas.current, camEl = cam.current, uiEl = ui.current, ctx = el?.getContext("2d");
    if (!el || !camEl || !ctx) return;
    // the colours come from the theme tokens; they are read again on a theme change (see readColours below)
    let cobaltRgb: Rgb = [0, 0, 0], yellowRgb: Rgb = [0, 0, 0], veilRgb: Rgb = [0, 0, 0];
    let col: Colors = { cobalt: "", yellow: "", mute: "", mono: "", edge: "" };
    let edgeOn = false;   // true only in the light theme, where --ship-outline is a colour
    const readColours = () => {
      cobaltRgb = rgbOf(cssVar("--cobalt-signal")); yellowRgb = rgbOf(cssVar("--ship-fill"));
      veilRgb = cssVar("--canvas-rgb").split(/\s+/).map(Number) as Rgb;
      col = { cobalt: css(cobaltRgb), yellow: css(yellowRgb), mute: cssVar("--on-dark-mute"), mono: cssVar("--font-mono"), edge: cssVar("--ship-outline") };
      edgeOn = col.edge !== "" && col.edge !== "transparent";
    };
    readColours();
    const bg = document.createElement("canvas"), bctx = bg.getContext("2d")!;   // the cached static layer
    const veil = document.createElement("canvas"), vctx = veil.getContext("2d")!;   // the soft shade under the hero copy
    let VW = 1, VH = 1, dpr = 1, f: Frame = frame(1, 1), plan: Plan = buildPlan(1, 1), ships: number[] = [];
    const pt: Pt = { x: 0, y: 0, a: 0, size: 0, w: 0 };
    let ic = 0, hc = still ? 3 : 0, last = 0, lastDraw = 0, raf = 0, visible = true, ended = false, done = false;
    let drawnFade = 1;   // the shipment fade the last hero frame was drawn with (see shipFade)
    let on = !still && !pausedRef.current;

    /* r33-3: the yellow shipments leave with the hero. 1 while the hero is on screen, falling to 0 once it is 60% out of view
       (measured from the cached hero position, so no layout read in the frame loop). The hero's shipments and their trails
       and filing rings take this factor on top of the hero fade-in. */
    const heroBox = track(document.getElementById("top") ?? el);
    const shipFade = () => 1 - clamp((-heroBox.rectTop()) / (0.6 * Math.max(1, heroBox.h)));
    const size = () => {
      VW = window.innerWidth; VH = window.innerHeight;
      dpr = isPhone() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);   // r35: 1 on phones
      el.width = Math.round(VW * dpr); el.height = Math.round(VH * dpr);
      bg.width = el.width; bg.height = el.height;
      f = frame(VW, VH);
      plan = buildPlan(VW, VH);
      ships = [];
      for (let i = 0; i < plan.meta.length / 2; i++) if (plan.meta[2 * i + 1] === 1) ships.push(i);
      paintBase();
    };
    const paintBase = () => {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, VW, VH);
      paintLandDots(bctx, f, col.cobalt, LAND_A);
      paintStatic(bctx, f, col, 1);
      buildVeil();
    };

    /* the fade: a soft radial shade centred on the hero copy's measured rect (the union of its children) and on the
       Illustration label. No box: one ellipse per block whose alpha falls smoothly from about 50% black at the centre to
       0 well past the copy, so the dots and routes under the text are dimmed without a visible edge. Measured once per
       size (a layout read, never in the frame loop). */
    const shade = (l: number, t: number, r: number, b: number, reach: number, a0: number) => {
      const cx = (l + r) / 2, cy = (t + b) / 2, rx = (r - l) / 2 + reach, ry = (b - t) / 2 + reach;
      vctx.save();
      vctx.translate(cx, cy); vctx.scale(1, ry / rx);   // the gradient is a circle in this space, so it lands as an ellipse
      const g = vctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      // a flat core under the copy (the corners of a wide headline sit near 0.8 of the radius), then a long feather to 0
      const [vr, vg, vb] = veilRgb, vc = (a: number) => `rgba(${vr},${vg},${vb},${a})`;
      g.addColorStop(0, vc(a0)); g.addColorStop(0.55, vc(a0 * 0.97));
      g.addColorStop(0.75, vc(a0 * 0.8)); g.addColorStop(0.9, vc(a0 * 0.38)); g.addColorStop(0.96, vc(a0 * 0.1)); g.addColorStop(1, vc(0));
      vctx.fillStyle = g; vctx.fillRect(-2 * rx, -2 * rx, 4 * rx, 4 * rx);
      vctx.restore();
    };
    const buildVeil = () => {
      veil.width = el.width; veil.height = el.height;
      vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      vctx.clearRect(0, 0, VW, VH);
      /* r59-1: a halo round the title's own box (strong, so the title sits on the map), and a lighter one round the sub-line and button */
      const rect = (nodes: HTMLElement[]) => {
        let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
        for (const n of nodes) {
          const q = n.getBoundingClientRect();
          if (q.width <= 0 || q.height <= 0) continue;
          l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom);
        }
        return l < r && t < b ? { l, t, r, b } : null;
      };
      const kids = Array.from(document.querySelectorAll<HTMLElement>(".hero-in > *"));
      const title = rect(kids.filter((n) => n.classList.contains("hero-h"))), rest = rect(kids.filter((n) => !n.classList.contains("hero-h")));
      if (title) shade(title.l, title.t, title.r, title.b, 180, 0.8);
      if (rest) shade(rest.l, rest.t, rest.r, rest.b, 120, 0.8);
      const lab = document.querySelector<HTMLElement>(".stage-ui .scene-label")?.getBoundingClientRect();
      if (lab && lab.width > 0 && lab.height > 0) shade(lab.left, lab.top, lab.right, lab.bottom, 90, 0.75);
    };

    /* the dust, drawn on the 2D canvas only when WebGL is missing (the GL path draws it otherwise) */
    const dust = (t: number, a: number) => {
      for (let i = 0; i < plan.meta.length / 2; i++) {
        state(plan, i, t, pt);
        if (pt.a <= 0.002) continue;
        ctx.globalAlpha = pt.a * a;
        ctx.fillStyle = pt.w <= 0.001 ? col.cobalt : pt.w >= 0.999 ? col.yellow : mixRgb(cobaltRgb, yellowRgb, pt.w);
        const r = pt.size / 2;
        ctx.fillRect(pt.x - r, pt.y - r, pt.size, pt.size);
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const live = introRef.current, rig = gl.current?.rig ?? null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, VW, VH);
      if (live) {
        // the map draws in from the west as the mark scatters
        const mapA = easeIO((ic - TM.mapAt) / TM.mapDur);
        if (mapA >= 1) ctx.drawImage(bg, 0, 0, VW, VH);
        else if (mapA > 0) {
          paintLandDotsSweep(ctx, f, col.cobalt, LAND_A, (xn) => clamp(mapA * 1.4 - xn * 0.4));
          paintStatic(ctx, f, col, mapA);
        }
        // shipments: a yellow route trail to the port, then a yellow filing pulse there
        for (const i of ships) {
          const [f0, fEnd] = flightOf(plan, i);
          if (ic >= f0 && ic < fEnd) {
            if (edgeOn) paintRoute(ctx, (s) => routeAt(plan, i, s), easeIO((ic - f0) / (fEnd - f0)), 0.3, col.edge, 2.4, 1);
            paintRoute(ctx, (s) => routeAt(plan, i, s), easeIO((ic - f0) / (fEnd - f0)), 0.3, col.yellow, 1.2, 1);
          } else if (ic >= fEnd && ic - fEnd < 0.35) {
            const q = (ic - fEnd) / 0.35, [px, py] = routeAt(plan, i, 1);
            if (edgeOn) { ctx.globalAlpha = (1 - q) * 0.9; ctx.strokeStyle = col.edge; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(px, py, 3 + 16 * ease(q), 0, Math.PI * 2); ctx.stroke(); }
            ctx.globalAlpha = (1 - q) * 0.9; ctx.strokeStyle = col.yellow; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px, py, 3 + 16 * ease(q), 0, Math.PI * 2); ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        if (rig) rig.draw(ic);
        else dust(ic, 1);
      } else {
        // the hero: the same map, with the routes starting in over the first second
        const heroA = Math.min(1, hc / 1.2);
        ctx.globalAlpha = still ? 1 : heroA; ctx.drawImage(bg, 0, 0, VW, VH); ctx.globalAlpha = 1;   // the map fades in after the intro
        const sA = heroA * shipFade();
        drawnFade = shipFade();
        if (sA > 0) for (const r of ROUTES) {
          const p = (hc / r.period + r.phase) % 1;
          const at = routeFn(f, r.from, r.to);
          const [x, y] = at(p);
          const fade = Math.min(1, p / 0.08) * Math.min(1, (1 - p) / 0.1) * sA * r.k;   // fades in at the origin, out at the port
          if (edgeOn) {   // light theme: the darker edge first, so the yellow reads on the pale base
            paintRoute(ctx, at, p, 0.22, col.edge, 2.4, fade);
            ctx.globalAlpha = fade; ctx.fillStyle = col.edge; ctx.beginPath(); ctx.arc(x, y, 3.1, 0, Math.PI * 2); ctx.fill();
          }
          paintRoute(ctx, at, p, 0.22, col.yellow, 1.2, fade);
          ctx.globalAlpha = fade; ctx.fillStyle = col.yellow; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
          if (p > 0.94) {   // the filing: a yellow ring at the port
            const q = (p - 0.94) / 0.06, [px, py] = project(f, r.to[0], r.to[1]);
            if (edgeOn) { ctx.globalAlpha = (1 - q) * 0.9 * sA * r.k; ctx.strokeStyle = col.edge; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(px, py, 3 + 12 * q, 0, Math.PI * 2); ctx.stroke(); }
            ctx.globalAlpha = (1 - q) * 0.9 * sA * r.k; ctx.strokeStyle = col.yellow; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px, py, 3 + 12 * q, 0, Math.PI * 2); ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        // the veil goes over the routes too, so nothing bright sits under the copy; it ramps in with the copy.
        // r43-4: it leaves with the hero (shipFade), so past the hero the map is sharp and only the per-block blur (story.css) softens it
        const vA = heroA * drawnFade;
        if (vA > 0) { ctx.globalAlpha = vA; ctx.drawImage(veil, 0, 0, VW, VH); ctx.globalAlpha = 1; }
        if (!gl.current?.rig && outRef.current < 1) dust(INTRO_END, 1 - ease(outRef.current));
      }
      paintSweep(ctx, VW, VH, -0.15 + 1.3 * (((live ? ic : hc) / 16) % 1), col.cobalt);
    };

    const running = () => !document.hidden && (introRef.current || outRef.current < 1 || (on && visible));
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (introRef.current) {
        ic += dt;
        if (!ended && ic >= INTRO_END) { ended = true; endRef.current(); }
      } else {
        if (on) hc += dt;
        if (outRef.current < 1) outRef.current = Math.min(1, outRef.current + dt);
      }
      // r24: the ambient hero map is drawn at about 30 fps (the routes crawl; 60 fps buys nothing visible); the intro keeps full rate
      if (introRef.current || now - lastDraw >= 30) { lastDraw = now; draw(); }
      if (running()) raf = tRaf(tick); else last = 0;
    };
    const kick = () => { if (!raf && running()) raf = tRaf(tick); };
    kickRef.current = kick;

    size();
    // the copy's measured rect changes once the webfonts land: re-measure the veil then
    document.fonts?.ready.then(() => { if (!done) { buildVeil(); draw(); } });
    if (introRef.current && !isPhone()) {   // phones skip the intro (Intro.tsx), so they never download three.js for its dust
      // the intro's dust needs WebGL; the 2D path runs until (or instead of) it. OGL loads on its own chunk.
      const glEl = document.createElement("canvas");
      glEl.className = "intro-gl";
      glEl.setAttribute("aria-hidden", "true");
      camEl.appendChild(glEl);
      const g = { el: glEl, rig: null as GLRig | null, gone: false, timer: 0 };
      gl.current = g;
      createGL(glEl, VW, VH, plan, dpr, cobaltRgb.map((v) => v / 255), yellowRgb.map((v) => v / 255))
        .then((r) => {
          if (done || g.gone || !r) { r?.dispose(); return; }
          g.rig = r;
          r.resize(VW, VH, plan);
        })
        .catch(() => { /* no WebGL: keep the 2D path */ });
    }

    control.current = (v: boolean) => {
      on = v;
      if (v) kick();
      else if (!introRef.current) { tCaf(raf); raf = 0; last = 0; }
    };
    // the hero's shipments run only while the hero is on screen (the stage is behind the sections, so it is covered)
    const heroEl = document.getElementById("top") ?? el;
    const io = new IntersectionObserver(([e]) => {
      visible = e!.isIntersecting;
      uiEl?.classList.toggle("is-hero", e!.isIntersecting);
      if (!visible && drawnFade > 0) draw();   // the hero left in one step: clear its shipments before the loop stops
      kick();
    }, { threshold: 0 });
    io.observe(heroEl);
    const onVis = () => kick();
    // reduced motion (and the paused map) has no frame loop: the hero is redrawn on scroll only while its shipment and veil fade changes
    const onScroll = () => { if (!raf && !introRef.current && Math.abs(shipFade() - drawnFade) > 0.001) draw(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    // a theme change re-reads the colours and repaints the cached layer; the timeline keeps running
    const unsubTheme = subscribeTheme(() => { readColours(); paintBase(); draw(); });
    const onResize = () => { size(); gl.current?.rig?.resize(VW, VH, plan); draw(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    draw(); kick();
    return () => {
      done = true;
      tCaf(raf); io.disconnect(); control.current = null; kickRef.current = () => {};
      document.removeEventListener("visibilitychange", onVis); window.removeEventListener("resize", onResize); window.removeEventListener("scroll", onScroll);
      unsubTheme();
      const g = gl.current;
      if (g) retire(g);
      gl.current = null;
    };
  }, [still]);

  const toggle = () => {
    const next = !playing;
    pausedRef.current = !next;
    setPaused(!next);   // r17: the one pause control also freezes the ink guide
    setPlaying(next);
    control.current?.(next);
  };
  return (
    <>
      <div className="stage" aria-hidden="true">
        <div ref={cam} className="stage-cam">
          <canvas ref={canvas} className="scene-canvas" />
        </div>
      </div>
      <div ref={ui} className="stage-ui">
        <p className="scene-label">Illustration: shipments to EU ports on a map. Not live data.</p>
        {!still && (
          <button type="button" className="btn btn-ghost scene-btn" aria-pressed={!playing} onClick={toggle}>
            {playing ? hero.pause : hero.play}
          </button>
        )}
      </div>
    </>
  );
}

/* releases a dust WebGL context once (the intro's fade-out is over, or the page is leaving) */
function retire(g: { el: HTMLCanvasElement; rig: GLRig | null; gone: boolean; timer: number }) {
  if (g.gone) return;
  g.gone = true;
  window.clearTimeout(g.timer);
  g.rig?.dispose();
  g.rig = null;
  g.el.remove();
}
