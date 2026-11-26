import { useLayoutEffect, useRef } from "react";
import { statement } from "../content";
import { gsap, ScrollTrigger, reduceMotion, SCRUB_SOFT } from "../lib/motion";
import { subscribeTheme } from "../lib/theme";
import { Mark } from "./bits";

/* Round 19 item 3, rebuilt in r59-2 so the light travels smoothly. One GSAP timeline on one ScrollTrigger, scrubbed with a 0.6s smoothing
   (not raw scroll progress). Every word ramps opacity from its dim value to full over a window three words long, and the windows overlap, so the
   light moves through the sentence as a wave. The Bindu chip's yellow fill, its text and the dots of its mark are on the same timeline with the same
   ease, starting when the wave reaches the chip. Opacity (and colour on the two chip glyphs) only: no CSS transition on the words, no layout read
   while scrolling (ScrollTrigger caches positions), `will-change: opacity` only while the section is on screen. Scrubbed, so it reverses on scroll up.
   The start state is set here; with no JS, or under reduced motion, the sentence is fully lit. */
const DIM = 0.45, SPAN = 3;   // dim opacity of an unlit word; the ramp window in words
export function Statement() {
  const sec = useRef<HTMLElement>(null);
  const words = [...statement.before.split(" "), "\u0000", ...statement.after.split(" ")];
  useLayoutEffect(() => {
    const el = sec.current;
    if (!el || reduceMotion()) return;
    const ws = Array.from(el.querySelectorAll<HTMLElement>(".stmt-w"));
    const chip = el.querySelector<HTMLElement>(".stmt-chip")!;
    const chipBg = chip.querySelector<HTMLElement>(".stmt-chip-bg")!;
    const chipInk = [chip.querySelector<HTMLElement>(".stmt-w")!];   // r65-10: the mark keeps its cobalt; only the word goes to black
    // r65-19: 55 dots in two groups (alternate dots of the sunflower, so both groups spread over the whole mark). The first group lights bottom
    // to top with the yellow; the second lights from the centre outward as you keep scrolling after the fill. Long overlapping fades, no flicker.
    const all = Array.from(chip.querySelectorAll<SVGCircleElement>("svg circle"));
    const withFill = all.filter((_, i) => i % 2 === 0).sort((a, b) => Number(b.getAttribute("cy")) - Number(a.getAttribute("cy")));
    const afterFill = all.filter((_, i) => i % 2 === 1);   // sunflower order is centre outward
    const dots = all;
    const ease = "sine.inOut";
    gsap.set(ws, { opacity: DIM });
    const EMPTY = "inset(100% 0% 0% 0% round 6px)", FULL = "inset(0% 0% 0% 0% round 6px)";
    gsap.set(chipBg, { clipPath: EMPTY });
    gsap.set(dots, { opacity: 0.25 });
    const build = () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease } });
      ws.forEach((w, i) => tl.to(w, { opacity: 1, duration: SPAN }, i));
      return tl;
    };
    let tl = build();
    const st = ScrollTrigger.create({ trigger: el, start: "top 80%", end: "center 40%", animation: tl, scrub: SCRUB_SOFT });   // r65-14: a longer scroll window, so each word lights over more scroll
    // r65-17: the chip has its own scroll range, so it fills only while it is on screen and you scroll. r65-19: the range runs on past the fill:
    // from the chip fully in view (its bottom at 90%) to its top at 15%. The yellow rises bottom to top over the first 55% (clip-path, linear),
    // with the first dot group; the second dot group lights over the rest of the range.
    const FILL = 0.55, DOT = 0.2;   // the fill's share of the range; each dot's fade
    const chipTl = gsap.timeline({ paused: true });
    chipTl.fromTo(chipBg, { clipPath: EMPTY }, { clipPath: FULL, duration: FILL, ease: "none" }, 0);
    const stagger = (group: Element[], from: number, span: number) => group.forEach((d, i) =>
      chipTl.to(d, { opacity: 1, duration: DOT, ease: "sine.inOut" }, from + (i / Math.max(1, group.length - 1)) * (span - DOT)));
    stagger(withFill, 0, FILL);
    stagger(afterFill, FILL - 0.05, 1 - FILL + 0.05);
    const cst = ScrollTrigger.create({ trigger: chip, start: "bottom 90%", end: "top 15%", animation: chipTl, scrub: SCRUB_SOFT });
    const on = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top",
      onToggle: (s) => ws.forEach((w) => { w.style.willChange = s.isActive ? "opacity" : ""; }) });
    const unTheme = subscribeTheme(() => tl.invalidate());
    return () => {
      unTheme(); on.kill(); st.kill(); tl.kill(); cst.kill(); chipTl.kill();
      gsap.set([...ws, chipBg, ...dots, ...chipInk], { clearProps: "opacity,color,willChange,clipPath" });
    };
  }, []);
  return (
    <section ref={sec} className="band-dark sec stmt" id="statement" aria-label="What Bindu does" data-guide-anchor="statement" data-guide-side="r">
      <div className="container">
        <p className="stmt-t t-display-lg">
          {words.map((w, i) => w === "\u0000"
            ? <span key={i}><span className="stmt-chip"><span className="stmt-chip-bg" /><Mark size={26} chip /><span className="stmt-w">Bindu</span></span>{" "}</span>
            : <span key={i}><span className="stmt-w">{w}</span>{" "}</span>)}
        </p>
      </div>
    </section>
  );
}

/* r44-1: "Sound familiar?" (BeforeAfter, #pains) is gone; "What Bindu does" (components/Flow.tsx, #story) replaced it. */
