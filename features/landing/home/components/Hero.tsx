import { Pause, Play } from "lucide-react";
import { getRoot } from "../lib/root";
import { useEffect, useRef, useState } from "react";
import { DEMO_URL, cta, hero } from "../content";
import { reduceMotion } from "../lib/motion";
import { loadPortVideo, PORT_POSTER } from "../lib/port-video";
import { subscribeTheme } from "../lib/theme";
import { BtnLabel, SunflowerArt } from "./bits";
import { ExplainBindu } from "./ExplainBindu";
import { HeroQuestions } from "./HeroQuestions";
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

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (!video.querySelector("source")) loadPortVideo(video);
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }

  return (
    <section className="hero band-dark" id="top" aria-labelledby="hero-h" data-guide-anchor="hero" data-guide-side="l">
      <div className="container hero-in">
        <div className="hero-copy">
          <p className="hero-eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-h" className="t-display-xl hero-h" tabIndex={-1}>
            {hero.title.join(" ")}
          </h1>
          <p className="t-body-lg t-soft hero-sub">{hero.sub}</p>
          <div className="cta">
            <a className="btn bh-btn-primary" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.demo}</BtnLabel></a>
            <ExplainBindu />
          </div>
        </div>
      </div>
      <div className="container hero-media">
        <div className="hero-showcase" style={{ backgroundImage: `url("${PORT_POSTER}")` }}>
          <video id="hero-video" ref={videoRef} className="hero-video" poster={PORT_POSTER} preload="none" muted playsInline aria-hidden="true"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
          <div className="hero-showcase-in">
            <HeroQuestions />
          </div>
          <button type="button" className="btn hero-motion" aria-controls="hero-video"
            aria-label={playing ? "Pause port video" : "Play port video"} title={playing ? "Pause port video" : "Play port video"} onClick={toggleVideo}>
            {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
