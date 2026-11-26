import { getRoot } from "../lib/root";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useReducedMotion, SCRUB_SOFT } from "../lib/motion";
import { track } from "../lib/pos";
import { isPaused, subscribePause } from "../lib/pause";
import { cdnAsset } from "@/lib/cdn";
import { fin, FIN, FINP, landed, sunSlot, NDOT, SUN_DOT, shipHome } from "../lib/shiphome";
import { faq, finaleWordmark } from "../content";
import { Footer } from "./Footer";
import { MASK } from "../lib/maskdata";
import "../styles/r3-qa.css";

export function Faq() {
  return (
    <section className="band-dark sec" id="faq" aria-labelledby="faq-h" data-guide-anchor="faq" data-guide-side="l">
      <div className="container faq">
        <div className="sec-head">
          <h2 id="faq-h" className="t-display-lg" suppressHydrationWarning>{faq.title}</h2>
        </div>
        <div className="faq-list v3-panel v3-panel-wide">
          {faq.items.map((f) => (
            <details key={f.q} className="faq-item">
              <summary><span className="t-display-sm">{f.q}</span>
                <span className="faq-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14" /><path className="faq-ico-v" d="M12 5v14" /></svg></span>
              </summary>
              <div className="faq-a">
                {f.a && <p className="t-body t-soft">{f.a}</p>}
                {f.pending && <p className="faq-pending"><span className="chip chip-build">{faq.raahul}</span></p>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Round 28, items 2c and 3R: the ending, built the way Rothfinder's is (our own SVG and code). The final section's stage is a sticky full-viewport layer whose background is
   the cargo photo (cover, never moving) and whose CSS mask-image is an SVG of the letters "bindu" only, no frame (lib/maskdata.ts, r29-1: about 55vw wide, max 900px, 80vw on phones). The yellow dot of the i is
   not in the mask: it is a separate circle that the guide ship's dots build, and that rides the same transform. Before the zoom the masked wordmark sits on the page canvas.
   Scrolling animates only mask-size and mask-position (scrubbed, SCRUB_SOFT) around a point inside the stroke of the bowl of the d until the photo fills the screen; then the
   mask is removed. The footer sits on the photo (a dark gradient under it); the final view is the photo and the footer only. The ship's part is unchanged from 2c: the course
   line curves from the gutter into the page and ends above the i; the ship sails there at its normal size, splits into dots and they form the dot (fin.t, time-based,
   queued, reversible; drawn by the Guide canvas). Reduced motion: the masked wordmark with its dot, then the photo section with the content; no zoom. */
const c01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (x: number) => { const t = c01(x); return t * t * (3 - 2 * t); };
/* r65-11 (Austin): the i has no dot of its own in the mask again (r62-2's ellipse is gone): its dot is only the sunflower the bindus build. The zoom dives into a letter
   instead: the right leg of the n, a solid stem in the middle of the word (viewBox x 389 to 430.9, straight from y 160 down to the baseline at 275). */
const MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(MASK.svg)}")`;
const ZOOM = { cx: 409.95, cy: 222, r: 20.9 };   // the zoom origin inside the n's right leg, and the half width of that stem (the largest disc that is all letter)
// r35: FINP is read when used (it changes on phones)   // r32-1: the hand-off plays first (20vh hold, then 120vh); the zoom runs from 140vh into the pin for 150vh

type Lay = { W: number; H: number; mw0: number; x0: number; y0: number; px: number; py: number; K: number; dx: number; dy: number; dw: number; dh: number };
function layout(W: number, H: number): Lay {
  const mw0 = W <= 600 ? W * 0.84 : Math.min(W * 0.34, 560), mh0 = (mw0 * MASK.h) / MASK.w;
  const x0 = (W - mw0) / 2, y0 = (H - mh0) / 2, u = mw0 / MASK.w;
  // r65-11: the zoom grows around a point inside the n's right leg (it stays where it is). The final scale is worked out from the viewport: the stem's disc (its half
  // width) must clear the farthest corner of the window seen from that point, with 12% to spare, so the video fills the window at every ratio (16:9 to 9:16)
  const px = x0 + ZOOM.cx * u, py = y0 + ZOOM.cy * u;
  const R = Math.max(Math.hypot(px, py), Math.hypot(W - px, py), Math.hypot(px, H - py), Math.hypot(W - px, H - py));
  const K = Math.max(6, (1.12 * R) / (ZOOM.r * u));
  const dx = x0 + MASK.dot.cx * u, dy = y0 + MASK.dot.cy * u;   // the dot of the i (the sunflower) stays where the tittle is
  return { W, H, mw0, x0, y0, px, py, K, dx, dy, dw: 2 * MASK.dot.rx * u, dh: 2 * MASK.dot.ry * u };
}
const setMask = (el: HTMLElement, v: string, size: string, pos: string) => {
  for (const pre of ["", "-webkit-"]) {
    el.style.setProperty(`${pre}mask-image`, v); el.style.setProperty(`${pre}mask-repeat`, "no-repeat");
    el.style.setProperty(`${pre}mask-size`, size); el.style.setProperty(`${pre}mask-position`, pos);
  }
};
/* r29-6, r52-2: the picture is the getbindu.com hero clip (public/videos/rotterdam-port-hero.av1.webm + .webm, 1280 x 676, 6s, an aerial view of a container yard),
   with its first frame as the poster (public/home/images/port-poster.webp, 1920 x 1014). It is scaled to the wordmark box at rest: the wordmark is 65% of the picture's
   width, so whole rows of containers show inside the letters. The point under the middle of the wordmark is FX, FY: the coloured stacks right of centre, by the crane.
   During the first quarter of the zoom it grows to the cover size of the full-bleed view (pinned PX, PY), so it always covers whatever the growing letters show.
   The poster is the layer's background (background-size/-position); the clip sits on top as a <video> of its own size moved only by transform (translate + scale). */
const IW = 1280, IH = 676, SHOW = 0.65, FX = 0.62, FY = 0.5, PX = 0.5, PY = 0.5, PHOTO_Q = 0.25, STEPS = 1500;
const POSTER = "/home/images/port-poster.webp";
type Row = { ms: string; mp: string; bs: string; bp: string; v: string; dot: string; g: string };
/* r29-5: everything the zoom needs, worked out once per measure (no arithmetic or string building while scrolling): the row for each of STEPS + 1 points of q */
function table(L: Lay): Row[] {
  const rows: Row[] = [], u0 = L.mw0 / MASK.w;
  const sc = Math.max(L.W / IW, L.H / IH), Pwf = IW * sc, Phf = IH * sc, oxf = (L.W - Pwf) * PX, oyf = (L.H - Phf) * PY;
  const Pw0 = L.mw0 / SHOW, Ph0 = (Pw0 * IH) / IW, ox0 = L.W / 2 - FX * Pw0, oy0 = L.y0 + (L.mw0 * MASK.h) / MASK.w / 2 - FY * Ph0;
  for (let i = 0; i < STEPS; i++) {
    const q = i / STEPS, mw = L.mw0 * Math.pow(L.K, q), u = mw / MASK.w, w = smooth(q / PHOTO_Q);
    const Pw = Pw0 + (Pwf - Pw0) * w, ox = ox0 + (oxf - ox0) * w, oy = oy0 + (oyf - oy0) * w;
    const s = u / u0;
    rows.push({
      ms: `${mw.toFixed(1)}px auto`, mp: `${(L.px - ZOOM.cx * u).toFixed(1)}px ${(L.py - ZOOM.cy * u).toFixed(1)}px`,
      bs: `${Pw.toFixed(1)}px ${(Ph0 + (Phf - Ph0) * w).toFixed(1)}px`, bp: `${ox.toFixed(1)}px ${oy.toFixed(1)}px`,
      v: `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px) scale(${(Pw / IW).toFixed(4)})`,
      // r65-11: the sunflower rides the same zoom about the n: it moves out from the zoom point as it grows (origin at its own centre)
      dot: `translate(${((L.dx - L.px) * (s - 1)).toFixed(1)}px, ${((L.dy - L.py) * (s - 1)).toFixed(1)}px) scale(${s.toFixed(3)})`, g: (1 - smooth((s - 2.5) / 2.5)).toFixed(3),   // r65-11: the sunflower stays on the i while the word grows, and fades as the i leaves the window
    });
  }
  return rows;
}

export function Finale() {
  const pin = useRef<HTMLElement>(null);
  const stg = useRef<HTMLDivElement>(null);
  const ph = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);   // r52-2: the port clip inside the masked layer
  const dotEl = useRef<HTMLElement>(null);
  const grad = useRef<HTMLDivElement>(null);
  const isStatic = useReducedMotion();

  useEffect(() => {
    const sec = pin.current!, stage = stg.current!, photo = ph.current!, dot = dotEl.current!, video = vid.current!;
    /* r52-2: the clip runs only from 901px, with motion allowed and no Data Saver (the main site's rule); everyone else gets the poster alone and never downloads it.
       Sources are attached by the same observer that fetches the poster, about 2 viewports ahead. It plays only while the finale is on screen and the hero pause is off. */
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const useClip = !isStatic && window.matchMedia("(min-width: 901px)").matches && !conn?.saveData;
    let loaded = false, onScreen = false;
    const sync = () => { if (!loaded) return; if (onScreen && !isPaused()) void video.play().catch(() => undefined); else video.pause(); };
    const load = () => {
      for (const [path, type] of [["/videos/rotterdam-port-hero.av1.webm", 'video/webm; codecs="av01.0.05M.08"'], ["/videos/rotterdam-port-hero.webm", 'video/webm; codecs="vp9"']] as const) {
        const source = document.createElement("source"); source.src = cdnAsset(path); source.type = type; video.appendChild(source);
      }
      video.muted = true; video.preload = "auto"; video.hidden = false; video.load(); loaded = true;
      video.addEventListener("canplay", sync, { once: true });
    };
    // r42: the picture is fetched only when the finale is about 2 viewports away
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { sec.style.setProperty("--photo", `url(${cdnAsset(POSTER)})`); if (useClip) load(); io.disconnect(); } }, { rootMargin: "200% 0px 200% 0px" });
    io.observe(sec);
    const vis = new IntersectionObserver((es) => { onScreen = es.some((e) => e.isIntersecting); sync(); }, { rootMargin: "100% 0px 0px 0px" });
    vis.observe(sec);   // r62-3: playing (so decoded) from one viewport before the finale
    const offPause = subscribePause(sync);
    const tk = track(sec), dotDots = Array.from(dot.querySelectorAll<SVGCircleElement>("circle"));
    let L = layout(stage.clientWidth, stage.clientHeight), rows: Row[] = [], lastP = -1, formed = false, dashed = false, resolved = false;
    const zp = { p: 0 };

    // p 0 to 1: the mask grows (0 to 0.8), then the dark gradient under the footer comes in. The zoom only reads a row of the precomputed table and writes mask-size, mask-position,
    // background-size and background-position (and the dot's transform): nothing is calculated here.
    function apply(p: number) {
      if (p === lastP) return;
      lastP = p; fin.z = p;
      const q = c01(p), ct = smooth((p - 0.78) / 0.22);
      if (q >= 1) {
        setMask(photo, "none", "auto", "0 0");
        photo.style.removeProperty("background-size"); photo.style.removeProperty("background-position");
        if (rows.length) video.style.transform = rows[STEPS - 1]!.v;
        dot.style.setProperty("--g", "0");
      } else if (rows.length) {
        const r = rows[Math.round(q * STEPS)] ?? rows[STEPS - 1];
        setMask(photo, MASK_URL, r!.ms, r!.mp);
        photo.style.backgroundSize = r!.bs; photo.style.backgroundPosition = r!.bp; video.style.transform = r!.v;
        dot.style.transform = r!.dot; dot.style.setProperty("--g", r!.g);   // the dot of the i rides the same mapping (same origin, same scale) and fades out once the mask is about twice its size
      }
      if (grad.current) grad.current.style.opacity = String(ct);
      if (p > 0.92 && !resolved) { resolved = true; } else if (p < 0.85) resolved = false;
    }

    // where things are: the mask at fit size, the dot's place (the guide reads it), the growth
    const measure = () => {
      const W = stage.clientWidth, H = stage.clientHeight;
      if (!W || !H) return;
      L = layout(W, H);
      if (!isStatic) rows = table(L);
      stage.style.setProperty("--mw", `${L.mw0.toFixed(1)}px`);
      const dd = 1.45 * Math.max(L.dw, L.dh);   // r30-2: the disc of dots is a little larger than the tittle was, so the dots read
      dot.style.left = `${(L.dx - dd / 2).toFixed(2)}px`; dot.style.top = `${(L.dy - dd / 2).toFixed(2)}px`; dot.style.width = `${dd.toFixed(2)}px`; dot.style.height = `${dd.toFixed(2)}px`;
      if (isStatic) {
        setMask(photo, MASK_URL, `${L.mw0.toFixed(1)}px auto`, `${L.x0.toFixed(1)}px ${L.y0.toFixed(1)}px`);
        const Pw0 = L.mw0 / SHOW, Ph0 = (Pw0 * IH) / IW;
        photo.style.backgroundSize = `${Pw0.toFixed(1)}px ${Ph0.toFixed(1)}px`; photo.style.backgroundPosition = `${(L.W / 2 - FX * Pw0).toFixed(1)}px ${(L.y0 + (L.mw0 * MASK.h) / MASK.w / 2 - FY * Ph0).toFixed(1)}px`;
      }
      else { lastP = -1; apply(zp.p); }
    };
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    measure();
    const stop = () => { io.disconnect(); vis.disconnect(); offPause(); video.removeEventListener("canplay", sync); video.pause(); };
    if (isStatic) { stage.classList.add("is-formed"); return () => { stop(); window.removeEventListener("resize", onResize); }; }

    // the ship's part: the master time fin.t sets how much of the dot of the i exists (the dots that have flown in) and the sounds
    function paint() {
      const T = fin.t;
      for (let j = 0; j < NDOT; j++) { const a = landed(T, j).toFixed(3); if (dotDots[j]!.dataset.a !== a) { dotDots[j]!.dataset.a = a; dotDots[j]!.style.opacity = a; } }
      if (T >= FIN.formed && !formed) { formed = true; stage.classList.add("is-formed"); } else if (T < FIN.formed - 0.05 && formed) { formed = false; stage.classList.remove("is-formed"); }
      if (T > 0.1 && !dashed) { dashed = true; } else if (T < 0.05) dashed = false;
    }
    /* r32-1: the master time is a pure function of the scroll position, scrubbed (SCRUB_SOFT, 0.6): fin.t runs 0 to its resting time over 120vh of the pin (after a 20vh hold with the ship docked
       in its gutter), so the ship comes apart (about the first 30%), the dots travel in curves (about the next 50%) and the sunflower settles and holds (the last 20%); the zoom starts
       after that. It plays at any scroll speed and runs backwards when scrolling up. */
    const tp = { v: 0 };
    const handoff = gsap.fromTo(tp, { v: 0 }, {
      v: 1, ease: "none",
      onUpdate: () => { const T = FIN.formed * c01(tp.v / 0.9); if (T !== fin.t) { fin.t = T; paint(); shipHome.now(); } },
      scrollTrigger: { trigger: sec, start: () => `top+=${FINP.hold * window.innerHeight} top`, end: () => `top+=${(FINP.hold + FINP.span) * window.innerHeight} top`, scrub: SCRUB_SOFT, invalidateOnRefresh: true },
    });
    const tween = gsap.fromTo(zp, { p: 0 }, {
      p: 1, ease: "power2.in", onUpdate: () => apply(zp.p),
      scrollTrigger: { trigger: sec, start: () => `top+=${FINP.zoom * window.innerHeight} top`, end: () => `top+=${(FINP.zoom + FINP.zoomLen) * window.innerHeight} top`, scrub: SCRUB_SOFT, invalidateOnRefresh: true },
    });
    // the page above can change height after load (sections that skip rendering, fonts): re-measure the zoom's start and end when the finale has moved
    let rt = 0, lastTop = tk.top;
    const ro = new ResizeObserver(() => { window.clearTimeout(rt); rt = window.setTimeout(() => { const t = sec.getBoundingClientRect().top + window.scrollY; if (Math.abs(t - lastTop) > 2) { lastTop = t; ScrollTrigger.refresh(); } }, 250); });
    ro.observe(getRoot());
    return () => { stop(); ro.disconnect(); window.clearTimeout(rt); window.removeEventListener("resize", onResize); gsap.killTweensOf(fin); fin.t = 0; fin.z = 0; tween.scrollTrigger?.kill(); tween.kill(); handoff.scrollTrigger?.kill(); handoff.kill(); };
  }, [isStatic]);

  const wordmark = (
    <>
      <h2 id="finale-h" className="sr">{finaleWordmark.label}</h2>
      <div ref={ph} className="fz-photo" aria-hidden="true">
        {/* r52-2: no <source> in the server HTML; the effect attaches them only where the clip runs (see above), so phones, reduced motion and no-JS keep the poster */}
        <video ref={vid} className="fz-video" muted loop playsInline preload="none" poster={POSTER} hidden tabIndex={-1} />
      </div>
      <i ref={dotEl} className="fz-dot" aria-hidden="true">
        <svg viewBox="-1 -1 2 2" width="100%" height="100%" focusable="false">
          {Array.from({ length: NDOT }, (_, j) => { const q = sunSlot(j); return <circle key={j} cx={q.x!.toFixed(4)} cy={q.y!.toFixed(4)} r={SUN_DOT} style={{ "--m": q.m.toFixed(3) } as CSSProperties} />; })}
        </svg>
      </i>
    </>
  );
  return (
    <section ref={pin} className={`band-dark finale${isStatic ? " is-static" : ""}`} id="demo" aria-labelledby="finale-h" data-guide-anchor="finale" data-guide-side="l">
      <div ref={stg} className="fz-stage">
        {wordmark}
        {!isStatic && <div ref={grad} className="fz-grad" aria-hidden="true" />}
      </div>
      <div className="fz-flow">
        {isStatic ? <div className="fz-after" /> : <div className="fz-spacer" aria-hidden="true" />}
        <Footer />
      </div>
    </section>
  );
}
