import { getRoot } from "./root";
/* Page-wide motion pass (MOTION.md effects 2-5). r60-3: the old masked h2 reveal (class `rv`, a CSS clip-path hidden state) is gone; lib/headings.ts (GSAP SplitText) is the one heading reveal. All scrubbed effects are pure functions of scroll.
   Nothing runs under reduced motion. */
import { gsap, ScrollTrigger, reduceMotion } from "./motion";

export function startScenes(): () => void {
  if (reduceMotion()) { getRoot().classList.add("rm"); return () => getRoot().classList.remove("rm"); }
  getRoot().classList.add("fx");
  const kills: (() => void)[] = [];

  // 4 sheet lift: the hero's words drift up and dim while the next band slides over the hero
  const heroIn = document.querySelector(".hero-in"), hero = document.querySelector(".hero");
  if (heroIn && hero) {
    const t = gsap.to(heroIn, { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
  }

  ScrollTrigger.refresh();
  return () => kills.forEach((k) => k());
}
