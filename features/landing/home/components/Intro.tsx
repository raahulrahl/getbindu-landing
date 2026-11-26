import { getRoot } from "../lib/root";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { lockScroll, reduceMotion } from "../lib/motion";
import { intro as text } from "../content";
import { MapLayer } from "./MapLayer";
import "../styles/intro.css";

/* Intro, about seven and a half seconds, over the homepage stage (MapLayer). "Every proof is a dot": one dot appears,
   thousands of bindus arrive from every side and swirl into the golden-angle sunflower, the sunflower resolves into the
   mark, the dots scatter to the map origins, and the shipments fly to EU ports (a yellow pulse on arrival). Once the map
   is drawn, one mono label ("BINDU · TRADE COMPLIANCE OS") fades in under the dot line. At the end the same map stays
   on screen as the hero background: the camera settles, the headline masks in, then the sub-line, buttons and nav slide
   in (CSS keyed off <html data-intro>). Focus moves to the h1 when it finishes.
   Skip: the button, Esc or a click (all land on the same final state). It plays once per full page load; a remount
   after a sub-page does not replay it. Reduced motion never plays it and gets the static hero map. The sub-pages are
   static HTML without this script, so it never shows there. */

type Phase = "intro" | "out" | "gone";

let seen = false;   // set when the intro finishes; a remount in this page load skips it

export function Intro() {
  const [phase, setPhase] = useState<Phase>("intro");   // the same on the server and the first client render; the layout effect below skips it when needed
  const finish = useCallback(() => {
    seen = true;
    setPhase((p) => (p === "intro" ? "out" : p));
  }, []);

  // before paint, so the hero's headline, sub-line, buttons and nav are already in their intro state
  useLayoutEffect(() => {
    if (phase === "intro" && (seen || reduceMotion())) { setPhase("gone"); return; }
    if (phase === "intro" && window.innerWidth < 768) { getRoot().dataset.intro = "off"; setPhase("gone"); return; }   // phones skip the intro so the hero text paints at once
    getRoot().dataset.intro = phase === "intro" ? "on" : "off";
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro") return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [phase, finish]);

  // the hand-off: focus moves to the headline (no scroll), and the overlay is removed once its copy has faded
  useEffect(() => {
    if (phase !== "out") return;
    document.getElementById("hero-h")?.focus({ preventScroll: true });
    const t = window.setTimeout(() => setPhase("gone"), 800);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <>
      <MapLayer intro={phase === "intro"} onIntroEnd={finish} />
      {phase !== "gone" && (
        <div className={`intro${phase === "out" ? " is-out" : ""}`} role="region" aria-label="Introduction" onClick={finish}>
          <p className="intro-line">{text.dot}</p>
          <p className="intro-label">Illustration: a dot becomes a filing. Not live data.</p>
        </div>
      )}
    </>
  );
}
