import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";
import { useSyncExternalStore } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduceMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* For render. Server and first client render say false, so the markup always hydrates cleanly; a reduced-motion reader
   then gets true on the next render. Use this in markup and state; reduceMotion() stays for effects and handlers. */
const noop = () => () => {};
export const useReducedMotion = (): boolean => useSyncExternalStore(noop, reduceMotion, () => false);

/* r61-6: the two scrub smoothings every scrubbed scene uses (seconds the playhead takes to catch up with the scroll). TIGHT for scenes that
   must track the finger (Flow); SOFT for the slower, cinematic ones (Story light, finale fill and zoom). Theatre keeps its own damped time (TAU). */
export const SCRUB_TIGHT = 0.4;
export const SCRUB_SOFT = 0.6;

export const finePointer = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

let lenis: Lenis | null = null;
let stopLenis: (() => void) | null = null;
let locked = false;

/* Inertial scroll (Lenis) driven by GSAP's ticker so ScrollTrigger scenes stay in sync.
   Off under reduced motion: native scroll, no hijack. Returns a cleanup that puts everything back, so leaving the
   homepage (or a dev remount) leaves no Lenis, ticker callback or click handler behind. */
export function startSmoothScroll(): () => void {
  if (reduceMotion() || lenis || stopLenis) return () => {};
  let dead = false;
  let cancelWait: () => void = () => {};
  stopLenis = () => { dead = true; cancelWait(); };
  /* Lenis is not needed for first paint: on phones (touch scroll is native, Lenis only smooths wheels) it loads on idle, after the load event;
     elsewhere it loads at once. Its chunk is dynamic so it stays out of the hydration bundle. */
  const phone = window.matchMedia("(max-width: 767px)").matches;
  const boot = () => {
    import("lenis").then(({ default: LenisCtor }) => {
      if (dead) return;
      const l = new LenisCtor({ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false });
      lenis = l;
      if (locked) l.stop();
      l.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // in-page anchors scroll through Lenis
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        l.scrollTo(el as HTMLElement, { offset: -64 });
        history.replaceState(null, "", id);
      };
      document.addEventListener("click", onClick);
      stopLenis = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        l.destroy();
        lenis = null;
        stopLenis = null;
      };
    });
  };
  if (!phone) boot();
  else {
    const go = () => { cancelWait(); boot(); };
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = () => {
      const h = ric ? ric(go, { timeout: 2500 }) : window.setTimeout(go, 1200);
      cancelWait = () => (ric ? (window as unknown as { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(h) : clearTimeout(h));
    };
    if (document.readyState === "complete") start();
    else { window.addEventListener("load", start, { once: true }); cancelWait = () => window.removeEventListener("load", start); }
  }
  return () => stopLenis?.();
}

export function lockScroll(lock: boolean) {
  locked = lock;
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export { gsap, ScrollTrigger };

export { SplitText };

export const getLenis = () => lenis;
