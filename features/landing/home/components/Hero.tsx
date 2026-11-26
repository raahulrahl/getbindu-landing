import { getRoot } from "../lib/root";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DEMO_URL, cta, hero } from "../content";
import { gsap, reduceMotion, finePointer } from "../lib/motion";
import { isPhone } from "../lib/phone";
import { subscribeTheme } from "../lib/theme";
import { BtnLabel, SunflowerArt } from "./bits";
import type { SceneApi } from "../hero/scene";

function cssVar(name: string) { return getComputedStyle(getRoot()).getPropertyValue(name).trim(); }

function webglOk() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch { return false; }
}

/* the WebGL scene (lazy) or the static sunflower (reduced motion / no WebGL) */
export function SceneLayer({ final = false, label, pauseText, playText }: { final?: boolean; label: string; pauseText: string; playText: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<SceneApi | null>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "static">("pending");
  const [state, setState] = useState<"playing" | "paused" | "done">("playing");
  useEffect(() => {
    if (reduceMotion() || !webglOk()) { setMode("static"); return; }
    setMode("webgl");
    let cancelled = false;
    const start = () => {
      const el = canvas.current; if (!el || cancelled) return;
      import("../hero/scene").then(({ createScene }) => {
        if (cancelled) return;
        api.current = createScene(el, { final, onState: setState, colors: { cobalt: cssVar("--cobalt-signal"), yellow: cssVar("--brand-yellow") } });
        if (!final) api.current.play();
      });
    };
    let io: IntersectionObserver | null = null;
    if (final) {   // the finale plays once, when it comes into view
      io = new IntersectionObserver((es) => {
        if (!es[0]!.isIntersecting) return;
        if (!api.current) { start(); const wait = setInterval(() => { if (api.current) { clearInterval(wait); api.current.play(); } }, 50); }
        else if (api.current.isDone()) api.current.replay();
        else api.current.play();
      }, { threshold: 0.35 });
      if (canvas.current) io.observe(canvas.current);
    } else {
      // after first paint, so the words load first
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 600 }); else setTimeout(start, 200);
    }
    const unsubTheme = subscribeTheme(() => api.current?.recolour({ cobalt: cssVar("--cobalt-signal"), yellow: cssVar("--brand-yellow") }));
    return () => { cancelled = true; io?.disconnect(); unsubTheme(); api.current?.destroy(); api.current = null; };
  }, [final]);
  const toggle = () => {
    const a = api.current; if (!a) return;
    if (state === "playing") a.pause(); else a.play();
  };
  return (
    <div className={`scene${final ? " scene-final" : ""}`} aria-hidden="false">
      {mode === "static"
        ? <SunflowerArt className="scene-static" />
        : <canvas ref={canvas} className="scene-canvas" aria-hidden="true" />}
      <p className="scene-label">{label}</p>
      {mode === "webgl" && !final && (
        <button type="button" className="btn btn-ghost scene-btn" aria-pressed={state !== "playing"} onClick={toggle}>
          {state === "playing" ? pauseText : state === "done" ? "Replay" : playText}
        </button>
      )}
    </div>
  );
}

/* r59-1 (Austin: no particles): the title simply fades up like the other headings (lines, 30px, expo.out, as r54), then the sub-line word by
   word (0.04s stagger), then Book a demo. On desktop (fine pointer, 768px and up) the title also moves at 0.85 of the scroll speed (it lags by
   0.15 of the distance scrolled), transform only. The starting state is set here, not in CSS; with the intro playing everything waits for it to
   finish. Phones and touch screens: the same fade without the parallax. Reduced motion: nothing runs, everything shows. */
export function Hero() {
  const sec = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = sec.current;
    if (!el || reduceMotion()) return;
    const root = getRoot();
    const h1 = el.querySelector<HTMLElement>(".hero-h");
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".hero-line"));
    const words = Array.from(el.querySelectorAll<HTMLElement>(".hero-w"));
    const cta = Array.from(el.querySelectorAll<HTMLElement>(".hero-in .cta"));
    gsap.set(lines, { opacity: 0, y: 30 });
    gsap.set(words, { opacity: 0, y: 12 });
    gsap.set(cta, { opacity: 0, y: 16 });
    let par: gsap.core.Tween | null = null;
    if (h1 && !isPhone() && finePointer() && window.innerWidth >= 768) {
      par = gsap.to(h1, { y: () => 0.15 * el.offsetHeight, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
    }
    let tl: gsap.core.Timeline | null = null;
    const go = () => {
      tl = gsap.timeline({ delay: 0.15 })
        .to(lines, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 })
        .to(words, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out", stagger: 0.04 }, "-=0.3")
        .to(cta, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, ">-0.25");
    };
    let mo: MutationObserver | null = null;
    if (root.dataset.intro === "on") {
      mo = new MutationObserver(() => { if (root.dataset.intro !== "on") { mo?.disconnect(); mo = null; go(); } });
      mo.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    } else go();
    return () => { mo?.disconnect(); tl?.kill(); par?.scrollTrigger?.kill(); par?.kill(); gsap.set([...lines, ...words, ...cta, ...(h1 ? [h1] : [])], { clearProps: "opacity,transform" }); };
  }, []);
  const subWords = hero.sub.split(" ");
  return (
    <section ref={sec} className="hero band-dark" id="top" aria-labelledby="hero-h" data-guide-anchor="hero" data-guide-side="l">
      <div className="container hero-in">
        {/* avoid-ai-design-ignore: SD5 (no word is accented; every word has its own mask span) */}
        <h1 id="hero-h" className="t-display-xl hero-h" tabIndex={-1}>
          {hero.title.map((line, i) => (
            <span key={i} className="hero-line">{line}</span>
          ))}
        </h1>
        <p className="t-body-lg t-soft hero-sub">
          {subWords.map((w, i) => (<span key={i}>{i > 0 ? " " : ""}<span className="hero-w">{w}</span></span>))}
        </p>
        <div className="cta">
          <a className="btn bh-btn-primary" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.demo}</BtnLabel></a>
        </div>
      </div>
    </section>
  );
}
