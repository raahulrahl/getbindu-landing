import { gsap, ScrollTrigger, SplitText, reduceMotion } from "./motion";
import { isPending, onReady } from "./ready";

/* Round 54 (DESIGN.md v3 section 5): one reveal for every heading and lead on the page. Each line fades up from 30px below (opacity 0 to 1,
   y 30 to 0), expo-out, 0.7s, lines staggered 0.08s, played ONCE when the heading reaches 92% down the viewport (it does not reverse). The
   line masks of r20 are gone. GSAP SplitText (lines, no mask) re-splits on resize (autoSplit); a heading that already played is not hidden
   again by a re-split. The yellow full stop is gone (r55: Ollama has none); a heading keeps its plain full stop. The lead under a heading
   (.sec-head p, the Full Circle / Story / journey leads) fades up as one block just after it. Body text is not touched; the finale wordmark
   and Full Circle's own heading (data-own) are skipped. Reduced motion: nothing runs, everything shows at once. */
const LEADS = "main .sec-head > p, main .fl-lead, main .ship-sub, main .ex-head > p, main .vc-head > p, main .rl-head > p";
export function startHeadings(): () => void {
  if (reduceMotion()) return () => {};
  const splits: SplitText[] = [];
  const tls = new Map<Element, gsap.core.Timeline>();
  const played = new Set<Element>();
  const batches: ScrollTrigger[][] = [];
  const leadTw = new Map<Element, gsap.core.Tween>();
  let dead = false, fontsReady = false;
  // runs for every heading not split yet; a section that has not hydrated yet is skipped (splitting its text would break hydration) and picked up when it is ready
  const run = () => {
    if (dead || !fontsReady) return;
    const fresh = Array.from(document.querySelectorAll<HTMLElement>("main h2:not(.wm):not([data-own])")).filter((h) => !tls.has(h) && !isPending(h));
    const leads = Array.from(document.querySelectorAll<HTMLElement>(LEADS)).filter((p) => !leadTw.has(p) && !isPending(p));
    if (!fresh.length && !leads.length) return;
    fresh.forEach((h) => {
      splits.push(SplitText.create(h, {
        type: "lines", autoSplit: true, aria: "auto",
        onSplit: (self) => {
          if (played.has(h)) return;   // already revealed: a re-split on resize leaves it shown
          const tl = gsap.timeline({ paused: true, onComplete: () => { played.add(h); } });
          tl.fromTo(self.lines, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 });
          tls.set(h, tl);
          return tl;
        },
      }));
    });
    leads.forEach((p) => {
      const tw = gsap.fromTo(p, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.16, paused: true });
      leadTw.set(p, tw);
    });
    const play = (els: Element[]) => els.forEach((e) => { tls.get(e)?.play(); leadTw.get(e)?.play(); });
    const targets = [...fresh, ...leads];
    batches.push(ScrollTrigger.batch(targets, { start: "top 92%", once: true, onEnter: play }));
    if (!late) ScrollTrigger.refresh();   // a late section's refresh is the one ready.ts does once per batch
  };
  let late = false;
  const off = onReady(() => { late = true; run(); });
  (document.fonts?.ready ?? Promise.resolve()).then(() => { fontsReady = true; run(); late = true; });
  return () => {
    dead = true; off(); batches.forEach((b) => b.forEach((t) => t.kill()));
    tls.forEach((t) => t.kill()); leadTw.forEach((t) => t.kill());
    splits.forEach((s) => s.revert()); leadTw.forEach((_, p) => gsap.set(p, { clearProps: "opacity,transform" }));
  };
}
