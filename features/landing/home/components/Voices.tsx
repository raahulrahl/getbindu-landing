import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { TESTIMONIALS_PLACEHOLDER as QUOTES, voices as c } from "../content";
import { gsap, ScrollTrigger, reduceMotion, getLenis, SCRUB_SOFT } from "../lib/motion";

/* "What buyers say" (id `voices`). r65-12 built it as a Legora-style endless row; r65-20 (Austin: more wow, scroll-driven, a better transition, cheap)
   makes the row one continuous scene. Every card's place is a pure function of one number, p (the current card, fractional while moving):
   its circular distance d from p sets its x, its scale (big when current, small at the sides, top-aligned), a slight 3D turn away from the centre,
   its dimming, the parallax of the product screen inside its window, and the quote's fade and rise. Transforms and opacity only, written once per
   frame and only while p changes (r65-12 tweened width and height, which cost a layout per frame).
   Desktop (861px and up, motion allowed): the section is a sticky stage and the page's scroll drives p, scrubbed, with a hold on each quote so the
   row rests on a card rather than between two. Arrows, dots and a click on a side card scroll the page to that card. Phones and reduced motion:
   not pinned; arrows, dots, swipe and arrow keys move p (tweened, or set at once under reduced motion), endless.
   The quotes are PLACEHOLDERS (content.ts), so the Placeholder chip stays. The windows show real Bindu product screens with example data
   (public/images/eudr), labelled Illustration; no faces, because the people are not real yet. */

const SHOTS = ["/images/eudr/journey-1-farms.webp", "/images/eudr/chain-supplier.webp", "/images/eudr/journey-5-file.webp", "/images/eudr/close-receipt.webp", "/images/eudr/chain-share.webp"];
const N = QUOTES.length;
const PIN_MQ = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";   // the same query as the sticky stage in r65.css
const EDGE = 0.3, HOLD = 0.22;   // scroll spent resting before the first and after the last card; share of each step spent holding on a card
const circF = (x: number) => { let d = ((x % N) + N) % N; if (d > N / 2) d -= N; return d; };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sine = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

type Geo = { big: number; small: number; gap: number; h: number; cx: number };
function geo(width: number, pinned: boolean): Geo {
  const phone = width < 640;
  let big = phone ? Math.round(width * 0.78) : Math.min(560, Math.round(width * 0.42));
  if (pinned) big = Math.max(360, Math.min(big, Math.round((window.innerHeight - 64 - 420) / 0.6)));   // the stage must fit one screen
  const small = phone ? Math.round(width * 0.42) : Math.min(260, Math.round(width * 0.2));
  return { big, small, gap: phone ? 16 : 40, h: Math.round(big * (phone ? 0.72 : 0.6)), cx: width / 2 };
}
/* scroll progress (0..1) to p, with a hold on each card */
function holdP(t: number) {
  const T = clamp(t * (N - 1 + 2 * EDGE) - EDGE, 0, N - 1), i = Math.min(N - 2, Math.floor(T)), f = T - i;
  return i + (f < HOLD ? 0 : f > 1 - HOLD ? 1 : sine((f - HOLD) / (1 - 2 * HOLD)));
}

export function Voices() {
  const [active, setActive] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const p = useRef(0);
  const g = useRef<Geo | null>(null);
  const pinned = useRef(false);
  const st = useRef<ScrollTrigger | null>(null);
  const tw = useRef<gsap.core.Tween | null>(null);
  const swipe = useRef<{ x: number; id: number } | null>(null);
  const shown = useRef(0);
  const parts = useRef<{ img: HTMLElement | null; txt: HTMLElement | null }[]>([]);   // each card's screen and quote, found once

  const render = useCallback((pos: number) => {
    const G = g.current, r = row.current;
    if (!G || !r) return;
    const sm = G.small / G.big, unit = G.big / 2 + G.gap + G.small / 2;
    cards.current.forEach((el, i) => {
      if (!el) return;
      const d = circF(i - pos), a = Math.abs(d), k = sine(clamp(1 - a));
      const off = a <= 1 ? unit * sine(a) : unit + (a - 1) * (G.small + G.gap);
      const x = G.cx + Math.sign(d) * off - G.big / 2;
      const s = sm + (1 - sm) * k, turn = clamp(d, -1.5, 1.5) * -7;
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,0) perspective(1400px) rotateY(${turn.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      el.style.opacity = (clamp(2.4 - a) * (0.62 + 0.38 * k)).toFixed(3);
      el.style.zIndex = a < 0.5 ? "2" : "1";
      const img = parts.current[i]?.img, txt = parts.current[i]?.txt;
      if (img) img.style.transform = `translate3d(${(-d * 28).toFixed(1)}px,0,0) scale(1.08)`;
      if (txt) { txt.style.opacity = clamp(1 - a * 2.2).toFixed(3); txt.style.transform = `translate3d(0,${((1 - k) * 28).toFixed(1)}px,0)`; }
    });
    const cur = ((Math.round(pos) % N) + N) % N;
    if (cur !== shown.current) { shown.current = cur; setActive(cur); }
  }, []);

  const measure = useCallback(() => {
    const r = row.current;
    if (!r) return;
    g.current = geo(r.clientWidth, pinned.current);
    r.style.setProperty("--vx-h", `${g.current.h}px`);
    r.style.setProperty("--vx-big", `${g.current.big}px`);
    r.classList.add("is-live");
    render(p.current);
  }, [render]);

  useLayoutEffect(() => {
    const r = row.current, el = pin.current;
    if (!r || !el) return;
    pinned.current = window.matchMedia(PIN_MQ).matches;
    parts.current = cards.current.map((c) => ({ img: c?.querySelector<HTMLElement>(".vx-img") ?? null, txt: c?.querySelector<HTMLElement>(".vx-text") ?? null }));
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(r);
    if (pinned.current) {
      const state = { t: 0 };
      const anim = gsap.to(state, { t: 1, ease: "none", paused: true, onUpdate: () => { p.current = holdP(state.t); render(p.current); } });
      st.current = ScrollTrigger.create({ trigger: el, start: "top 64px", end: "bottom bottom", scrub: SCRUB_SOFT, animation: anim });
    }
    return () => {
      ro.disconnect(); st.current?.kill(); st.current = null; tw.current?.kill();
      cards.current.forEach((c) => { if (c) { c.style.cssText = ""; c.querySelectorAll<HTMLElement>(".vx-img, .vx-text").forEach((n) => { n.style.cssText = ""; }); } });
    };
  }, [measure, render]);

  /* move to card i (desktop: scroll the page to its hold; otherwise tween p the short way round) */
  const goTo = (i: number) => {
    const s = st.current;
    if (pinned.current && s) {
      const j = clamp(i, 0, N - 1), y = s.start + ((j + EDGE) / (N - 1 + 2 * EDGE)) * (s.end - s.start);
      const l = getLenis();
      if (l) l.scrollTo(y, { duration: 0.9 }); else window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    const target = p.current + circF(i - p.current);
    tw.current?.kill();
    if (reduceMotion()) { p.current = target; render(target); return; }
    const o = { v: p.current };
    tw.current = gsap.to(o, { v: target, duration: 0.85, ease: "power3.inOut", onUpdate: () => { p.current = o.v; render(o.v); } });
  };
  const go = (step: number) => goTo(pinned.current ? active + step : Math.round(p.current) + step);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };
  const down = (e: PointerEvent) => { swipe.current = { x: e.clientX, id: e.pointerId }; };
  const up = (e: PointerEvent) => {
    const s = swipe.current; swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  return (
    <section className="band-dark sec vx" id="voices" aria-labelledby="vc-h">
      <div ref={pin} className="vx-pin">
        <div className="vx-stage">
          <div className="container rl-head vx-head">
            <h2 id="vc-h" className="t-display-lg">{c.title}</h2>
            <span className="chip chip-neutral" title={c.note}>{c.placeholder}</span>
          </div>
          <div ref={row} className="vx-row" role="group" aria-roledescription="carousel" aria-label={c.label} tabIndex={0} onKeyDown={onKey}
            onPointerDown={down} onPointerUp={up} onPointerCancel={() => { swipe.current = null; }}>
            <ul className="vx-track">
              {QUOTES.map((q, i) => (
                <li key={q.name} ref={(el) => { cards.current[i] = el; }} className="pc vx-card" aria-roledescription="slide" aria-label={`${i + 1} of ${N}`}
                  aria-hidden={i === active ? "false" : "true"} onClick={() => { if (i !== active) goTo(i); }}>
                  <div className="pc-box">
                    <div className="pc-tray" aria-hidden="true" />
                    <div className="pc-win">
                      <div className="pc-bar"><span className="pc-url">Illustration</span></div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="pc-media vx-img" src={SHOTS[i % SHOTS.length]} alt="" loading="lazy" decoding="async" draggable={false} />
                    </div>
                  </div>
                  <div className="vx-text">
                    <span className="vx-mark" aria-hidden="true">&rdquo;</span>
                    <blockquote className="vx-q">{q.q}</blockquote>
                    <p className="vx-who"><b>{q.name}</b><span>{q.role}, {q.company}, {q.country}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="container vx-ctl">
            <button type="button" className="btn btn-icon vx-arrow" aria-label={c.prev} onClick={() => go(-1)}>
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4 3 8l4 4" /></svg>
            </button>
            <ol className="vx-dots" aria-label={c.label}>
              {QUOTES.map((q, i) => (
                <li key={q.name}>
                  <button type="button" className={`vx-dot${i === active ? " is-on" : ""}`} aria-label={`${c.label}: ${i + 1} of ${N}`} aria-current={i === active ? "true" : undefined} onClick={() => goTo(i)} />
                </li>
              ))}
            </ol>
            <button type="button" className="btn btn-icon vx-arrow" aria-label={c.next} onClick={() => go(1)}>
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
          </div>
        </div>
      </div>
      <p className="sr">{`${QUOTES[active]!.q} ${QUOTES[active]!.name}`}</p>
    </section>
  );
}
