import { getRoot } from "./root";
import { getLenis } from "./motion";
/* Round 24 item 1: cached element positions, so scroll handlers and per-frame code never read layout. A tracker measures
   once (document top, height) and again only after the layout may have changed (resize, body size change, fonts, load).
   Use: const t = track(el); t.top (document y), t.h, t.rectTop(scrollY) (viewport y). */
let ver = 0;
let hooked = false;
/* r65-13 (performance): the scroll position without touching layout. Reading window.scrollY (or innerHeight) inside a frame, after GSAP or a canvas has written styles,
   makes the browser lay the page out again on the spot (a forced reflow: the trace showed about 0.6s of it per 6s of scrolling, mostly from the guide). Lenis already
   knows where it has scrolled to, so with Lenis nothing reads the browser at all. Without Lenis (phones, reduced motion) it falls back to window.scrollY. A cached copy
   from a scroll listener was tried and was worse: the listener ran right after ScrollTrigger's own one had written pin styles, so it forced the reflow itself. */
let VH = typeof window === "undefined" ? 0 : window.innerHeight;
export const scrollPos = () => { const l = getLenis(); return l ? l.animatedScroll : window.scrollY; };
export const viewH = () => VH;
function hook() {
  if (hooked || typeof window === "undefined") return;
  hooked = true;
  const bump = () => { ver++; };
  window.addEventListener("resize", () => { VH = window.innerHeight; }, { passive: true });
  window.addEventListener("resize", bump);
  window.addEventListener("load", bump);
  document.fonts?.ready.then(bump);
  if (typeof ResizeObserver !== "undefined") {
    let t = 0;
    new ResizeObserver(() => { window.clearTimeout(t); t = window.setTimeout(bump, 120); }).observe(getRoot());
  }
}
export const invalidatePositions = () => { ver++; };
export function track(el: HTMLElement) {
  hook();
  let v = -1, top = 0, h = 0;
  const m = () => {
    if (v === ver) return;
    const r = el.getBoundingClientRect();
    top = r.top + window.scrollY; h = r.height; v = ver;
  };
  return {
    get top() { m(); return top; },
    get h() { m(); return h; },
    rectTop: (sy: number = scrollPos()) => { m(); return top - sy; },
  };
}
