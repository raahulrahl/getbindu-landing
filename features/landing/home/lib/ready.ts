/* Late sections. Every section is in the server HTML. Below-the-fold ones hydrate later (home-page.tsx, Lazy), so the page-wide systems that
   query `main` once (heading reveals, band rise-ins) must skip a section until it has hydrated, and pick it up when it does.
   Systems: isPending(el) to skip, onReady(fn) to be told, afterSettle(fn) to run once the layout has settled (pins in, one refresh). */
import { ScrollTrigger, getLenis } from "./motion";
import { invalidatePositions } from "./pos";

const pending = new Set<string>();
const subs = new Set<(id: string) => void>();
const settled = new Set<() => void>();
let timer = 0;

export const addPending = (id: string) => { pending.add(id); };
export const isPendingId = (id: string) => pending.has(id);
export const isPending = (el: Element) => { const s = el.closest("main > section"); return !!s && pending.has(s.id); };
export const anyPending = () => pending.size > 0;
export const onReady = (fn: (id: string) => void) => { subs.add(fn); return () => { subs.delete(fn); }; };

/* the layout (pin spacers) has changed: re-measure cached positions and refresh ScrollTrigger once per batch of sections */
export function markReady(id: string) {
  if (!pending.delete(id)) return;
  subs.forEach((f) => f(id));
  invalidatePositions();
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    ScrollTrigger.refresh();
    getLenis()?.resize();   // Lenis caches the scroll limit; the pin spacers of late sections made the page taller
    invalidatePositions();
    window.dispatchEvent(new Event("guide:refresh"));
    timer = 0;
    const fns = Array.from(settled); settled.clear(); fns.forEach((f) => f());
  }, 120);
}
export function afterSettle(fn: () => void) {
  if (!pending.size && !timer) { fn(); return; }
  settled.add(fn);
}

/* mount triggers: a section hydrates ~1.5 viewports before it is reached, or on idle (one section per idle slot, in page order), whichever first */
const gates = new Map<string, () => void>();
const queue: string[] = [];
let idleStarted = false;
const open = (id: string) => { const g = gates.get(id); if (g) { gates.delete(id); g(); } };
export function openAll() { Array.from(gates.keys()).forEach(open); }
function idleNext() {
  const id = queue.find((q) => gates.has(q));
  if (!id) return;
  open(id);
  const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(idleNext, { timeout: 2500 }); else window.setTimeout(idleNext, 300);
}
function startIdle() {
  if (idleStarted) return;
  idleStarted = true;
  const go = () => window.setTimeout(idleNext, 1200);
  if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
}
export function gate(id: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const el = document.getElementById(id);
  if (!el || location.hash) return Promise.resolve();   // a deep link (/#faq) mounts everything at once so the anchor lands once
  return new Promise<void>((res) => {
    queue.push(id);
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) open(id); }, { rootMargin: "150% 0px 150% 0px" });
    io.observe(el);
    gates.set(id, () => { io.disconnect(); res(); });
    startIdle();
  });
}

/* an in-page link to a section whose neighbours have not mounted would land on the wrong place: mount everything, wait for the layout, then follow the link */
export function guardAnchors(): () => void {
  const on = (e: MouseEvent) => {
    if (!anyPending()) return;
    const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a || a.getAttribute("href") === "#") return;
    e.preventDefault(); e.stopImmediatePropagation();
    openAll();
    afterSettle(() => a.click());
  };
  document.addEventListener("click", on, true);
  return () => document.removeEventListener("click", on, true);
}
