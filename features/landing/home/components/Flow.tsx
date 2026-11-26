import { useEffect, useRef, useState } from "react";
import { CustomEase } from "gsap/CustomEase";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { FileText, Mail, MessageSquare } from "lucide-react";
import { story } from "../content";
import { gsap, ScrollTrigger, SplitText, useReducedMotion, SCRUB_TIGHT } from "../lib/motion";
import { isPhone, onPhoneChange } from "../lib/phone";
import { isPending, onReady } from "../lib/ready";

gsap.registerPlugin(CustomEase, MotionPathPlugin);

/* Round 50 (r50-1): "What Bindu does", id `story`. Same structure as r49 (a pinned window in a 500svh track: the step line held on the left, ONE object on the stage on the right),
   new motion. One GSAP timeline, four units long (one per step), scrubbed by the scroll with smoothing (SCRUB_TIGHT, 0.4). Each step plays in its first ~60% and then holds still to be read.
   Choreography, one lead per step and supporting parts on overlapping offsets:
     1 an ink caret blinks on the empty stage; the sentence types at a human cadence (irregular gaps, longer between words); the caret settles into the yellow dot
     2 the sentence docks into the record (lead); the record surface unfolds from the sentence's row; labels and rules lines follow; the key words are underlined and
       the rule chips and the customs code travel out of them on arcs
     3 the record slides left (lead); the cobalt routes draw; the two suppliers settle in; a cobalt packet runs each route and lands as the request in the supplier's
       card; the file appears under it like an attachment and curves back into the proof row
     4 the cobalt bar runs under the header (lead); the reference types in mono behind a caret; the yellow dot leaves the sentence and lands on the reference on an
       arc; then "Filed" rises in and the yellow edge closes the record
   The step line on the left is part of the same timeline (SplitText lines, r54: faded up 30px, no masks), so it changes exactly where the stage changes, and reverses with it.
   Two eases for motion: OUT (expo out, the --ease-out token) for anything arriving, MOVE (the --ease-in-out token as a CustomEase) for anything travelling or
   morphing; keystrokes are instant steps and opacity ramps are linear. Only transform and opacity animate (plus clip-path on the record surface and the routes).
   Geometry is read once per build and the build reruns when the stage size changes; never per frame.
   GSAP owns every hidden state: the server HTML (and the reduced-motion page) is the finished frame. The carets, the yellow dot and the packets are made by the effect.
   Phones (767px and under) and reduced motion: no pin, no timeline, the four steps as a list and the finished record. Everything on the stage is an Illustration. */

const OUT = "expo.out";
const MOVE = CustomEase.create("flowMove", "0.65,0,0.35,1");
const TICK = 0.004;   // the length of one keystroke (a step change), in step units

type Pt = { x: number; y: number };
/* top-left and size of an element in `root`'s coordinates, from offsets (ignores transforms, so it is the same at any scroll position) */
function box(el: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0, n: HTMLElement | null = el;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}
const mid = (el: HTMLElement, root: HTMLElement): Pt => { const b = box(el, root); return { x: b.x + b.w / 2, y: b.y + b.h / 2 }; };
/* a cubic arc from a to b, bowed sideways by `bend` of its length (positive bows to the left of the direction of travel) */
function arc(a: Pt, b: Pt, bend: number): Pt[] {
  const vx = b.x - a.x, vy = b.y - a.y, nx = -vy * bend, ny = vx * bend;
  return [a, { x: a.x + vx / 3 + nx, y: a.y + vy / 3 + ny }, { x: a.x + (2 * vx) / 3 + nx, y: a.y + (2 * vy) / 3 + ny }, b];
}
/* keystroke times: irregular gaps, longer before a new word, scaled to fill [t0, t1]; seeded, so every build types the same */
function cadence(chars: HTMLElement[], t0: number, t1: number, wordGap: number) {
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const gaps = chars.map((c, i) => {
    const newWord = i > 0 && c.parentElement !== chars[i - 1]!.parentElement;
    return (0.65 + rnd() * 0.7) * (newWord ? wordGap : 1);
  });
  const sum = gaps.reduce((a, b) => a + b, 0);
  let t = t0;
  return gaps.map((g) => (t += (g / sum) * (t1 - t0)));
}

/* r59-3: one icon set, Lucide (ISC), 16px, 1.5px stroke */
const ic = { size: 16, strokeWidth: 1.5, className: "fl-ic", "aria-hidden": true } as const;

/* the two routes, from the record's right edge (56%, 50%) to each supplier left edge (68%, 24% and 76%), as S-curves; the pills use the same curve in pixels */
const ROUTES = [{ a: [56, 50], b: [68, 24] }, { a: [56, 50], b: [68, 76] }] as const;
const routeD = (r: (typeof ROUTES)[number]) => `M${r.a[0]} ${r.a[1]} C${(r.a[0] + r.b[0]) / 2} ${r.a[1]} ${(r.a[0] + r.b[0]) / 2} ${r.b[1]} ${r.b[0]} ${r.b[1]}`;

export function Flow() {
  const sec = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const isStatic = useReducedMotion();
  const [step, setStep] = useState(3);
  const s = story.stage;
  const prev = useRef(3);

  /* r55: the current marker's label slides in beside it when the step changes (GSAP; the label only exists for the current step, so the
     server HTML and the reduced-motion page show step 4 with no hidden state) */
  useEffect(() => {
    const was = prev.current; prev.current = step;
    const el = pin.current;
    if (isStatic || was === step || !el || el.dataset.flow !== "on") return;
    const l = el.querySelector<HTMLElement>(".fl-pd.is-on .fl-pl");
    if (l) gsap.fromTo(l, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, ease: "expo.out", overwrite: true });
  }, [step, isStatic]);

  useEffect(() => {
    const root = sec.current, el = pin.current, st8 = stage.current;
    if (!root || !el || !st8 || isStatic) return;
    let ctx: gsap.Context | null = null;
    let made: HTMLElement[] = [];
    let built = false;
    let size = "";

    const teardown = () => {
      ctx?.revert(); ctx = null;
      made.forEach((m) => m.remove()); made = [];
      delete el.dataset.flow;
      setStep(3);
    };

    const build = () => {
      if (isPending(root)) return;   // the layout above is still settling: wait for onReady
      built = true;
      teardown();
      if (isPhone()) return;
      size = `${st8.offsetWidth}x${st8.offsetHeight}`;
      el.dataset.flow = "on";        // the step line is driven by the timeline from here on (r44.css drops its class-based states)
      ctx = gsap.context(() => {
        const q = <T extends HTMLElement>(sel: string, r: ParentNode = st8) => r.querySelector<T>(sel)!;
        const qa = <T extends HTMLElement>(sel: string, r: ParentNode = st8) => Array.from(r.querySelectorAll<T>(sel));
        const card = q(".fl-card"), bg = q(".fl-card-bg"), recT = q(".fl-rec-t"), shipL = q(".fl-ship-l");
        const say = q(".fl-say"), sayIn = q(".fl-say-in");
        const slots = qa(".fl-slot");   // rules, code, proof, reference
        const nodes = qa(".fl-node"), routes = qa(".fl-route");
        const bar = q(".fl-bar"), status = q(".fl-status"), ring = q(".fl-ring");
        const refT = q(".fl-ref-t"), refDot = q(".fl-ref .fl-dot");
        const chips = [...qa(".fl-fly[data-beat='1']")];   // the two rule chips, then the code chip
        const files = qa(".fl-fly[data-beat='2']");
        const W = st8.offsetWidth, H = st8.offsetHeight;

        const mk = (cls: string, text?: string) => {
          const e = document.createElement(text === undefined ? "i" : "span");
          e.className = cls; if (text) e.textContent = text;
          made.push(e); return e;
        };

        /* the text is split once per build; the context reverts the splits on teardown */
        const sayChars = SplitText.create(sayIn, { type: "words,chars", aria: "none" }).chars as HTMLElement[];
        const refChars = SplitText.create(refT, { type: "chars", aria: "none" }).chars as HTMLElement[];
        const beats = qa<HTMLElement>(".fl-beat", el).map((li) => ({
          lines: [
            ...(SplitText.create(q(".fl-t", li), { type: "lines", linesClass: "fl-ln", aria: "none" }).lines as HTMLElement[]),
            ...(SplitText.create(q(".fl-cap", li), { type: "lines", linesClass: "fl-ln", aria: "none" }).lines as HTMLElement[]),
          ],
        }));
        const caret = mk("fl-caret"); sayIn.appendChild(caret);
        const caret2 = mk("fl-caret"); refT.appendChild(caret2);
        const pilot = mk("fl-pilot"); sayIn.appendChild(pilot);   // the yellow dot: the full stop of the sentence, later the proof stamp
        const packets = s.threads.map(() => { const e = mk("fl-pk"); st8.appendChild(e); return e; });
        const asks = qa(".fl-node-ask");

        /* geometry, read here once (the build reruns on resize) */
        const cx = (W - card.offsetWidth) / 2;   // while the record is alone it sits in the middle
        const sb = box(say, st8), ib = box(sayIn, st8);
        const k = Math.min(2.4, (W * 0.84) / ib.w);
        const big = { x: (W - ib.w * k) / 2 - sb.x - cx - (ib.x - sb.x) * k, y: H * 0.46 - (ib.h * k) / 2 - sb.y - (ib.y - sb.y) * k, scale: k };
        const right = (c: HTMLElement, r: HTMLElement) => { const b = box(c, r); return b.x + b.w; };
        const row = box(say, card).y + say.offsetHeight / 2, ch = card.offsetHeight;
        const radius = getComputedStyle(bg).borderTopLeftRadius;
        const px = (p: readonly number[]): Pt => ({ x: (p[0]! / 100) * W, y: (p[1]! / 100) * H });
        const curve = (r: (typeof ROUTES)[number]): [Pt, Pt, Pt, Pt] => { const a = px(r.a), b = px(r.b), m = (a.x + b.x) / 2; return [a, { x: m, y: a.y }, { x: m, y: b.y }, b]; };

        const tl = gsap.timeline({ defaults: { ease: MOVE } });
        /* r59-3: step i owns [i, i + 1]; its choreography plays in the first half (S(i, f) is a position f of the way through that half, D(f) a duration
           of f of it) and the second half holds still to be read. Groups below are sequenced so at most two things move at once; the step line's own
           change always rides with the lead. */
        const HALF = 0.5;
        const S = (i: number, f: number) => i + f * HALF, D = (f: number) => f * HALF;

        /* ---- the step line (left): number, title and sentence; lines fade up (r54) ---- */
        beats.forEach((b, i) => {
          if (i === 0) return;
          const p = beats[i - 1]!;
          tl.fromTo(p.lines, { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: D(0.2), stagger: 0.012, immediateRender: false }, S(i, 0));
          tl.fromTo(b.lines, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: OUT, duration: D(0.45), stagger: 0.028 }, S(i, 0.1));
        });
        const fill = q(".fl-prog-line", el);
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1 / 3, duration: D(0.35) }, S(1, 0));
        tl.fromTo(fill, { scaleX: 1 / 3 }, { scaleX: 2 / 3, duration: D(0.35), immediateRender: false }, S(2, 0));
        tl.fromTo(fill, { scaleX: 2 / 3 }, { scaleX: 1, duration: D(0.35), immediateRender: false }, S(3, 0));

        /* ---- step 1: a caret on the empty stage; the sentence types at a human cadence (the only mover); the caret becomes the yellow dot ---- */
        tl.fromTo(caret, { x: 0, opacity: 1 }, { opacity: 0, duration: TICK, immediateRender: true }, S(0, 0.94));
        cadence(sayChars, S(0, 0.04), S(0, 0.88), 2.2).forEach((t, i) => {
          const c = sayChars[i]!;
          tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: TICK, ease: "none" }, t);
          tl.fromTo(caret, { x: i ? right(sayChars[i - 1]!, sayIn) : 0 }, { x: right(c, sayIn), duration: TICK, ease: "none", immediateRender: false }, t);
        });
        tl.fromTo(pilot, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, ease: OUT, duration: D(0.2) }, S(0, 0.9));

        /* ---- step 2: the sentence docks (lead) while the record unfolds; the rows come in with the key words underlined; the chips travel out ---- */
        tl.fromTo(say, { x: big.x, y: big.y, scale: big.scale, transformOrigin: "0 0" }, { x: 0, y: 0, scale: 1, duration: D(0.45) }, S(1, 0.02));
        tl.fromTo(card, { x: cx }, { x: cx, duration: TICK }, 0);   // alone, centred, until step 3
        tl.fromTo(bg, { opacity: 0 }, { opacity: 1, ease: OUT, duration: D(0.2) }, S(1, 0.2));
        tl.fromTo(bg, { clipPath: `inset(${row - 22}px 4% ${ch - row - 22}px 4% round ${radius})` }, { clipPath: `inset(0px 0% 0px 0% round ${radius})`, duration: D(0.4) }, S(1, 0.2));
        tl.fromTo([recT, shipL], { opacity: 0, y: 8 }, { opacity: 1, y: 0, ease: OUT, duration: D(0.25), stagger: 0.02 }, S(1, 0.4));
        const slotIn = (sl: HTMLElement, f: number, d = 0.25) => {
          tl.fromTo(q(".fl-hr", sl), { scaleX: 0 }, { scaleX: 1, duration: D(d) }, S(sl === slots[2] ? 2 : sl === slots[3] ? 3 : 1, f));
          tl.fromTo(q("dt", sl), { opacity: 0, y: 6 }, { opacity: 1, y: 0, ease: OUT, duration: D(d) }, S(sl === slots[2] ? 2 : sl === slots[3] ? 3 : 1, f + 0.04));
        };
        slotIn(slots[0]!, 0.5); slotIn(slots[1]!, 0.56);
        tl.fromTo(qa(".fl-ul", sayIn), { scaleX: 0 }, { scaleX: 1, duration: D(0.2), stagger: 0.02 }, S(1, 0.55));
        /* each chip comes out from under its underlined word (never on top of it, so the sentence stays readable), kept inside the record, and arcs down into its row */
        const inner = box(sayIn, st8).x;
        chips.forEach((c, i) => {
          const wb = box(q(`[data-w="${c.dataset.from}"]`, sayIn), st8), b = mid(c, st8);
          const a = { x: Math.max(wb.x + wb.w / 2, inner + c.offsetWidth / 2), y: wb.y + wb.h + c.offsetHeight / 2 + 4 };
          const t = S(1, 0.74 + i * 0.05);
          tl.fromTo(c, { opacity: 0 }, { opacity: 1, ease: "none", duration: D(0.12) }, t);
          tl.fromTo(c, { scale: 0.94 }, { scale: 1, duration: D(0.22) }, t);
          tl.fromTo(c, { x: a.x - b.x, y: a.y - b.y }, { motionPath: { path: arc({ x: a.x - b.x, y: a.y - b.y }, { x: 0, y: 0 }, 0.04), type: "cubic" }, duration: D(0.22) }, t);
        });

        /* ---- step 3: the record slides left (lead) with the proof row; routes draw while the suppliers settle; the requests run; the files come back ---- */
        tl.fromTo(card, { x: cx }, { x: 0, duration: D(0.3), immediateRender: false }, S(2, 0));
        slotIn(slots[2]!, 0.06, 0.2);
        routes.forEach((r, i) => {
          const a = ROUTES[i]!.a[0], b = ROUTES[i]!.b[0];
          tl.fromTo(r, { clipPath: `inset(0% ${100 - a}% 0% ${a}%)` }, { clipPath: `inset(0% ${100 - b - 0.5}% 0% ${a}%)`, duration: D(0.22) }, S(2, 0.32 + i * 0.03));
        });
        tl.fromTo(nodes, { opacity: 0, x: 14 }, { opacity: 1, x: 0, ease: OUT, duration: D(0.22), stagger: 0.02 }, S(2, 0.36));
        /* a request is a cobalt packet that runs the route; it lands as the message in the supplier's card */
        packets.forEach((pk, i) => {
          const path = curve(ROUTES[i]!), t = S(2, 0.6 + i * 0.03);
          tl.fromTo(pk, { opacity: 0 }, { opacity: 1, ease: "none", duration: D(0.04) }, t);
          tl.fromTo(pk, { x: path[0].x, y: path[0].y, xPercent: -50, yPercent: -50 }, { motionPath: { path, type: "cubic" }, duration: D(0.2) }, t);
          tl.fromTo(pk, { opacity: 1 }, { opacity: 0, ease: "none", duration: D(0.04), immediateRender: false }, t + D(0.18));
          tl.fromTo(asks[i]!, { opacity: 0, y: 8 }, { opacity: 1, y: 0, ease: OUT, duration: D(0.18) }, t + D(0.18));
        });
        /* the file appears under the supplier's message (an attachment), leaves the card level, curves back to the record's edge and settles in the proof row */
        files.forEach((f, i) => {
          const a = curve(ROUTES[i]!)[0], e = mid(f, st8), ab = box(asks[i]!, st8), reach = (a.x - e.x) * 0.45;
          const s0 = { x: ab.x + f.offsetWidth / 2, y: ab.y + ab.h + 8 + f.offsetHeight / 2 };
          const out = { x: box(nodes[i]!, st8).x - 8, y: s0.y }, m = (out.x + a.x) / 2;
          const pts = [s0, { x: s0.x + (out.x - s0.x) / 3, y: s0.y }, { x: s0.x + (2 * (out.x - s0.x)) / 3, y: s0.y }, out,
            { x: m, y: out.y }, { x: m, y: a.y }, a, { x: a.x - reach, y: a.y }, { x: e.x + reach, y: e.y }, e]
            .map((p) => ({ x: p.x - e.x, y: p.y - e.y }));
          const t = S(2, 0.8 + i * 0.03);
          tl.fromTo(f, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, ease: OUT, duration: D(0.1) }, t);
          tl.fromTo(f, { x: pts[0]!.x, y: pts[0]!.y }, { motionPath: { path: pts, type: "cubic" }, duration: D(0.2) }, t);
        });

        /* ---- step 4: the bar runs (lead); the reference types; the yellow dot lands on it; the status rises and the yellow edge closes the record ---- */
        slotIn(slots[3]!, 0.02, 0.2);
        tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: D(0.3) }, S(3, 0));
        tl.fromTo(caret2, { opacity: 0, x: 0 }, { opacity: 1, duration: TICK }, S(3, 0.34));
        cadence(refChars, S(3, 0.36), S(3, 0.56), 1.6).forEach((t, i) => {
          const c = refChars[i]!;
          tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: TICK, ease: "none" }, t);
          tl.fromTo(caret2, { x: i ? right(refChars[i - 1]!, refT) : 0 }, { x: right(c, refT), duration: TICK, ease: "none", immediateRender: false }, t);
        });
        tl.fromTo(caret2, { opacity: 1 }, { opacity: 0, duration: TICK, immediateRender: false }, S(3, 0.58));
        const p0 = mid(pilot, st8), p1 = mid(refDot, st8), d = { x: p1.x - p0.x, y: p1.y - p0.y };
        tl.fromTo(pilot, { x: 0, y: 0 }, { motionPath: { path: arc({ x: 0, y: 0 }, d, -0.12), type: "cubic" }, duration: D(0.22) }, S(3, 0.6));
        tl.fromTo(pilot, { scale: 1 }, { scale: refDot.offsetWidth / pilot.offsetWidth, duration: D(0.22), immediateRender: false }, S(3, 0.6));
        tl.fromTo(pilot, { opacity: 1 }, { opacity: 0, duration: TICK, immediateRender: false }, S(3, 0.82));
        tl.fromTo(refDot, { opacity: 0 }, { opacity: 1, duration: TICK }, S(3, 0.82));
        tl.fromTo(ring, { opacity: 0 }, { opacity: 1, ease: OUT, duration: D(0.18) }, S(3, 0.82));
        tl.fromTo(status, { opacity: 0, y: 6 }, { opacity: 1, y: 0, ease: OUT, duration: D(0.18) }, S(3, 0.84));   // "Filed" confirms once the reference is back
        tl.to({}, { duration: 0.001 }, 3.999);   // exactly four steps long, so the last one holds too

        /* the step the stage is on (for aria-current and the progress dots), from the timeline's own time, so it lags the scroll exactly as the picture does */
        let last = -1, idle = 0;
        tl.eventCallback("onUpdate", () => {
          /* a caret is solid while it moves and blinks once it rests, as in an editor */
          caret.classList.add("is-busy"); caret2.classList.add("is-busy");
          clearTimeout(idle); idle = window.setTimeout(() => { caret.classList.remove("is-busy"); caret2.classList.remove("is-busy"); }, 500);
          const t = tl.time(); let b = 0;
          for (let i = 1; i < 4; i++) if (t >= i + 0.1) b = i;
          if (b !== last) { last = b; setStep(b); }
        });
        ScrollTrigger.create({ animation: tl, trigger: el, start: "top 64px", end: "bottom bottom", scrub: SCRUB_TIGHT });
        setStep(0);   // the timeline starts at step 1; the marker follows from here (its onUpdate takes over once the scroll moves)
        ScrollTrigger.refresh();
      }, root);
    };

    build();
    const offReady = onReady(() => { if (!built) build(); else ScrollTrigger.refresh(); });
    const off = onPhoneChange(() => { built = false; build(); });
    /* the geometry (and the step line's line breaks) belong to one stage size: rebuild when it changes */
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(() => { if (built && ctx && `${st8.offsetWidth}x${st8.offsetHeight}` !== size) build(); }, 200); };
    window.addEventListener("resize", onResize);
    return () => { off(); offReady(); clearTimeout(rt); window.removeEventListener("resize", onResize); teardown(); };
  }, [isStatic]);

  return (
    <section ref={sec} className="band-dark sec flow" id="story" aria-labelledby="flow-h" data-guide-anchor="story" data-guide-side="l">
      <div ref={pin} className={`fl-pin${isStatic ? " is-static" : ""}`}>
        <div className="fl-win container">
          <div className="flow-head fl-top">
            <h2 id="flow-h" className="t-display-lg">{story.title}</h2>
            <p className="t-body-lg t-soft fl-lead">{story.lead}</p>
          </div>
          <div className="fl-panel v3-panel v3-panel-wide">
          <div className="fl-left">
            <div className="fl-prog" aria-hidden="true">
              <span className="fl-prog-line" />
              {story.stops.map((b, i) => (
                <span key={b.id} className={`fl-pd${i <= step ? " is-done" : ""}${i === step ? " is-on" : ""}`}>
                  <b className="fl-pm">{i + 1}</b>
                  {i === step && <span className="fl-pl">{b.short}</span>}
                </span>
              ))}
            </div>
            <ol className="fl-beats" aria-label={story.label}>
              {story.stops.map((b, i) => (
                <li key={b.id} className={`fl-beat${i === step ? " is-on" : i < step ? " is-past" : " is-next"}`} aria-current={i === step ? "step" : undefined}>
                  <h3><span className="fl-t">{b.t}</span></h3>
                  <p className="fl-cap">{b.cap}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="fl-right">
            <div className="fl-app" aria-hidden="true">
            <div className="fl-appbar"><span className="fl-appname">Bindu</span><span className="chip chip-illus">{story.illus}</span></div>
            <div ref={stage} className="fl-stage">
              <div className="fl-card">
                <span className="fl-card-bg" />
                <span className="fl-ring" />
                <div className="fl-card-h">
                  <span className="fl-rec-t">{s.record}</span>
                  <span className="fl-status"><i className="fl-dot" />{s.filed}</span>
                  <span className="fl-bar" />
                </div>
                <div className="fl-ship">
                  <span className="fl-ship-l">{s.slots.ship}</span>
                  <span className="fl-say"><span className="fl-say-in">{s.say.map((p, i) => (p.k ? <span key={i} className="fl-w" data-w={p.k}>{p.t}<i className="fl-ul" /></span> : p.t))}</span></span>
                </div>
                <dl className="fl-slots">
                  <div className="fl-slot"><i className="fl-hr" /><dt>{s.slots.rules}</dt><dd className="fl-chips">
                    {s.rules.map((r) => (
                      <span key={r.t} className="fl-chip fl-fly" data-beat="1" data-from={r.from}>{r.t}<em className={r.live ? "is-live" : "is-build"}>{r.live ? s.live : s.build}</em></span>
                    ))}
                  </dd></div>
                  <div className="fl-slot"><i className="fl-hr" /><dt>{s.slots.code}</dt><dd><span className="fl-chip fl-code fl-fly" data-beat="1" data-from="coffee">{s.code}</span></dd></div>
                  <div className="fl-slot"><i className="fl-hr" /><dt>{s.slots.proof}</dt><dd className="fl-chips fl-docs">
                    {s.threads.map((t, i) => (<span key={t.file} className="fl-chip fl-fly" data-beat="2" data-from={`node${i}`}><FileText {...ic} />{t.file}</span>))}
                  </dd></div>
                  <div className="fl-slot"><i className="fl-hr" /><dt>{s.slots.ref}</dt><dd className="fl-ref"><span className="fl-ref-t">REF {s.ref}</span><i className="fl-dot" /></dd></div>
                </dl>
              </div>
              <div className="fl-routes">
                {ROUTES.map((r, i) => (
                  <svg key={i} className="fl-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={routeD(r)} /></svg>
                ))}
              </div>
              {s.threads.map((t, i) => (
                <div key={t.ch} className={`fl-node n${i}`} data-w={`node${i}`}>
                  <span className="fl-node-h"><span className="fl-av" aria-hidden="true">{t.who.charAt(0)}</span><b>{t.who}</b>{i === 0 ? <Mail {...ic} /> : <MessageSquare {...ic} />}<span className="fl-node-c">{t.ch}</span></span>
                  <span className="fl-node-ask">{t.ask}</span>
                </div>
              ))}
            </div>
            </div>
            <p className="sr">
              {`${story.stops[0]!.say}. `}
              {story.stops[1]!.rules!.map((r) => `${r.t} ${r.live ? "Live" : "In build"}`).join(", ")}. {story.stops[1]!.code}. {story.stops[2]!.files!.join(", ")}. {story.stops[3]!.ref}.
            </p>
            <p className="cargo-cap fl-illus"><span className="t-caption t-muted">{story.caption}</span></p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
