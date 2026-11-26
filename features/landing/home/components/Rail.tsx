import { useEffect, useRef, useState } from "react";
import { scrollPos, viewH } from "../lib/pos";

/* Round 22, item 13: a thin scroll-progress rail of dots in the right gutter. One dot per section; the dots fill cobalt as you read and the current
   section's dot is yellow. Hidden where the gutter is too narrow (under 1100px). aria-hidden; no dot-grid background anywhere. */
export function Rail() {
  const [n, setN] = useState(0);
  const [cur, setCur] = useState(0);
  const ys = useRef<number[]>([]);
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>("main [data-guide-anchor]"));
    setN(secs.length);
    const measure = () => { ys.current = secs.map((s) => s.getBoundingClientRect().top + window.scrollY); };
    let lastCur = -1;
    const on = () => {
      const y = scrollPos() + viewH() * 0.45;   // r65-13: no layout read in the scroll handler
      let c = 0; ys.current.forEach((v, i) => { if (y >= v) c = i; });
      if (c !== lastCur) { lastCur = c; setCur(c); }
    };
    measure(); on();
    window.addEventListener("scroll", on, { passive: true });
    const re = () => { measure(); on(); };
    window.addEventListener("resize", re);
    window.addEventListener("guide:refresh", re);   // late sections hydrated: their pins moved what is below
    const t = window.setTimeout(() => { measure(); on(); }, 1500);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", re); window.removeEventListener("guide:refresh", re); window.clearTimeout(t); };
  }, []);
  return (
    <div className="rail" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <i key={i} className={i === cur ? "is-cur" : i < cur ? "is-done" : ""} />)}
    </div>
  );
}
