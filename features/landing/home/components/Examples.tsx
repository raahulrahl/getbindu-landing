import { tRaf, tCaf } from "../lib/loop";
import { track, viewH } from "../lib/pos";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap, useReducedMotion } from "../lib/motion";

/* Round 21, item 4 (r31-1 reworked): "What the rules let through, and what they stop." as a split-flap departures board. Eight rows adapted
   from getbindu.com's worked examples (the wording is theirs). The section pins and each scroll step reveals ONE row: it flaps in, settles
   (clack) and becomes the current row (full ink, a yellow dot at the left; earlier rows muted). A pure function of scroll, so scrolling up
   un-reveals in reverse. Under the board a panel (not a live region since r61-4: it is scroll-fed) shows the current row's verdict, rule, route, headline (flap transition) and
   story. The board is a real table; the flap characters are aria-hidden. Reduced motion: no pin, every row settled, every story listed.
   Illustrations, not customer filings. Battery passports are In build, so those stories say so. */

type Row = { route: string; goods: string; rule: string; verdict: "pass" | "stop"; head: string; story: string; build?: boolean };
const ROWS: Row[] = [
  { route: "Chikkamagaluru → Rotterdam", goods: "Coffee", rule: "EUDR", verdict: "pass", head: "Draw the map once.", story: "An estate maps its plots before harvest. The coordinates sit outside the forest cover cleared after 2020, so the dossier can carry the plot file, the operator's risk assessment and the statement reference the buyer needs." },
  { route: "Chikkamagaluru → Hamburg", goods: "Coffee", rule: "EUDR", verdict: "stop", head: "Papers lie. Maps don't.", story: "Good beans, but one field sits on land the paperwork never covered. With no plot the estate can stand behind, there is nothing to put in the statement, and the buyer goes to the estate next door." },
  { route: "Kanchipuram → Paris", goods: "Silk", rule: "DPP", verdict: "pass", head: "Weave the proof in.", story: "A sari carries its GI certificate in the product record: the co-op, the loom, the zari. A boutique in Paris scans the code and reads the file the weaver filled in." },
  { route: "Unknown mill → delisted", goods: "Textiles", rule: "DPP", verdict: "stop", head: "Cheap needs an alibi.", story: "A “pashmina” lot with no passport and no trail. The lab finds polyester, and the marketplace has nothing to put behind the listing." },
  { route: "Sumatra → Antwerp", goods: "Rubber", rule: "EUDR", verdict: "stop", head: "The satellite has a long memory.", story: "One plot overlaps forest cleared after 2020. The images are dated and the boundary is not in dispute, so that lot cannot go into the dossier." },
  { route: "Srinagar → Milan", goods: "Pashmina", rule: "DPP", verdict: "pass", head: "One scan settles it.", story: "A shawl with its GI certificate inside the passport. A thousand lookalikes hang in the same street, and one of them can show where the wool came from." },
  { route: "Ulsan → Bratislava", goods: "EV", rule: "Battery", verdict: "pass", build: true, head: "Cells that carry their own file.", story: "Cells leave the plant with their chemistry, carbon footprint and recycled content already recorded. The line downstream reads the file instead of emailing for it." },
  { route: "No QR → held at customs", goods: "Pack", rule: "Battery", verdict: "stop", build: true, head: "2027 doesn't negotiate.", story: "A pack with no code, no chemistry and no carbon number. From 18 February 2027 the passport is what lets it on the EU market, so it waits in the warehouse." },
];
const COLS = ["route", "goods", "rule", "verdict"] as const;
const label = (r: Row, c: (typeof COLS)[number]) => (c === "verdict" ? (r.verdict === "pass" ? "Let through" : "Stopped") : r[c]);
const FLAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
/* the character a flap shows at row progress r: blank before the row starts, a few other characters while it flips, then its own */
const flapChar = (ch: string, j: number, len: number, r: number) => {
  if (r <= 0) return "";
  const settle = 0.25 + 0.6 * (j / Math.max(1, len));
  if (r >= settle) return ch;
  if (!/[A-Z0-9]/.test(ch)) return ch;   // arrows and punctuation just appear
  return FLAP[(Math.floor(r * 26) * 7 + j * 5 + ch.charCodeAt(0)) % FLAP.length];
};

const N = ROWS.length;
const STEP = 40;   // svh of scroll per row
const verdictText = (r: Row) => (r.verdict === "pass" ? "Let through" : "Stopped");

/* a tiny route glyph: two dots and a dotted line between them */
const Glyph = () => (
  <svg className="bd-glyph" viewBox="0 0 48 8" width="48" height="8" aria-hidden="true" focusable="false">
    <circle cx="4" cy="4" r="3" /><line x1="10" y1="4" x2="38" y2="4" /><circle cx="44" cy="4" r="3" />
  </svg>
);
const Meta = ({ r }: { r: Row }) => (
  <p className="bd-meta">
    <span className={`bd-verdict is-${r.verdict}`}>{verdictText(r)}</span>
    <span className="bd-rule">{r.rule}</span>
    <span className="bd-goods">{r.goods}</span>
    <span className="bd-route"><Glyph />{r.route}</span>
  </p>
);

export function Examples() {
  const pin = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLTableElement>(null);
  const headEl = useRef<HTMLSpanElement>(null);
  const isStatic = useReducedMotion();
  const [cur, setCur] = useState(isStatic ? N - 1 : -1);   // the current row (-1: none settled yet)

  /* r58: real split-flap flips. Every character is four layers: the static top half (the NEW character), the static bottom half (the OLD one until the flip ends), a flap A
     (the old top half, folds down rotateX 0 to -90, power2.in) and a flap B (the new bottom half, folds down from 90 to 0 after it with a 2 degree settle). One flip is about
     70ms. A row plays when it becomes the current row: characters flip left to right (about 17ms apart, capped so a long route does not delay the end), each through 2 or 3
     random letters before its own, the outcome flips last (Let through and Stopped keep their pass and stop colours) with one soft click-in scale. One GSAP timeline per row,
     built the first time the row plays and restarted after that; a row lands in about half a second. Rows that were passed over in one jump are set to their final characters
     at once (a fast scroll never queues flips); scrolling back blanks a row at once. Transforms only, backface-visibility hidden, no layout reads. Reduced motion: every
     character is final at once. */
  useEffect(() => {
    const root = board.current!;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("tbody tr"));
    type Ch = { fl: HTMLElement; b: HTMLElement[]; fa: HTMLElement; fb: HTMLElement; ch: string; cell: number; j: number };
    const rowCh: Ch[][] = rows.map((tr, i) => {
      const out: Ch[] = []; let k = 0;
      const fls = Array.from(tr.querySelectorAll<HTMLElement>(".fl"));
      COLS.forEach((cn, ci) => {
        const t = label(ROWS[i]!, cn).toUpperCase();
        Array.from(t).forEach((ch, j) => {
          if (ch === " ") return;
          const fl = fls[k++]!;
          const hs = Array.from(fl.querySelectorAll<HTMLElement>(".fh"));
          out.push({ fl, b: hs.map((h) => h.firstElementChild as HTMLElement), fa: hs[2]!, fb: hs[3]!, ch, cell: ci, j });
        });
      });
      return out;
    });
    const faces = (x: Ch, top: string, bot: string, fa: string, fb: string) => { x.b[0]!.textContent = top; x.b[1]!.textContent = bot; x.b[2]!.textContent = fa; x.b[3]!.textContent = fb; };
    const setChar = (x: Ch, v: string) => { faces(x, v, v, v, v); x.fl.classList.toggle("is-blank", v === ""); };
    const idle = (x: Ch) => { gsap.set(x.fa, { scaleY: 0 }); gsap.set(x.fb, { scaleY: 0 }); };   // r59-6: a flap folds by scaleY (2D), not rotateX: a 3D transform makes every flap its own compositor layer
    rowCh.forEach((r) => r.forEach((x) => { setChar(x, isStatic ? x.ch : ""); if (!isStatic) idle(x); }));
    if (isStatic) { setCur(N - 1); return; }
    const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const rnd = (seed: number) => { let s2 = seed * 9301 + 49297; return () => { s2 = (s2 * 9301 + 49297) % 233280; return s2 / 233280; }; };
    const verdictOf = (i: number) => rows[i]!.querySelector<HTMLElement>(".bd-verdict .bd-flaps");
    const tls: (gsap.core.Timeline | null)[] = rows.map(() => null);
    const state: ("off" | "on")[] = rows.map(() => "off");
    /* one character's flips: faces change at the start of each flip, flap A folds the old top half away, flap B folds the new bottom half in; about 70ms a flip */
    const flipSteps = (tl: gsap.core.Timeline, x: Ch, t0: number, seq: string[], from: string) => {
      let old = from;
      seq.forEach((nw, q) => {
        const t = t0 + q * 0.07, o = old;
        tl.call(() => { x.fl.classList.toggle("is-blank", nw === ""); faces(x, nw, o, o, nw); }, undefined, t);
        tl.fromTo(x.fa, { scaleY: 1 }, { scaleY: 0, duration: 0.035, ease: "power2.in", immediateRender: false }, t);
        tl.fromTo(x.fb, { scaleY: 0 }, { scaleY: 1, duration: 0.04, ease: "power2.out", immediateRender: false }, t + 0.035);
        tl.call(() => { x.b[1]!.textContent = nw; gsap.set(x.fb, { scaleY: 0 }); gsap.set(x.fa, { scaleY: 0 }); }, undefined, t + 0.077);
        old = nw;
      });
    };
    const build = (i: number) => {
      const tl = gsap.timeline({ paused: true });
      const r = rnd(i + 3);
      rowCh[i]!.forEach((x) => {
        const isV = x.cell === 3;
        const delay = (isV ? 0.22 : 0) + Math.min(x.j * (isV ? 0.012 : 0.017), isV ? 0.14 : 0.2);
        const seq: string[] = [];
        if (/[A-Z0-9]/.test(x.ch)) { const n = isV ? 1 : 1 + Math.floor(r() * 2); for (let q = 0; q < n; q++) seq.push(LET[Math.floor(r() * 26)]!); }
        seq.push(x.ch);
        flipSteps(tl, x, delay, seq, "");
      });
      const vEl = verdictOf(i);
      if (vEl) {
        const vEnd = 0.22 + 0.14 + 2 * 0.07;
        tl.fromTo(vEl, { scale: 1 }, { scale: 1.04, duration: 0.06, ease: "power1.out", immediateRender: false }, vEnd - 0.1);
        tl.to(vEl, { scale: 1, duration: 0.06, ease: "power1.in" }, vEnd - 0.04);
      }
      tl.eventCallback("onComplete", () => rows[i]!.classList.remove("is-flip"));
      tls[i] = tl;
      return tl;
    };
    /* scrolling back: the row you leave flips back to blank the same way (right to left, one letter on the way, about 0.3s) */
    const outs: (gsap.core.Timeline | null)[] = rows.map(() => null);
    const buildOut = (i: number) => {
      const tl = gsap.timeline({ paused: true });
      const r = rnd(i + 41), n = rowCh[i]!.length;
      rowCh[i]!.forEach((x, k) => {
        const seq = /[A-Z0-9]/.test(x.ch) ? [LET[Math.floor(r() * 26)]!, ""] : [""];
        flipSteps(tl, x, Math.min((n - 1 - k) * 0.006, 0.16), seq, x.ch);
      });
      tl.eventCallback("onComplete", () => rows[i]!.classList.remove("is-flip"));
      outs[i] = tl;
      return tl;
    };
    // flaps are display:none outside a flip and every flip starts by setting its own rotation, so blanking a row is only text and a class (no gsap.set per flap: that was the stall at each step)
    const blank = (i: number) => { rowCh[i]!.forEach((x) => setChar(x, "")); const v = verdictOf(i); if (v && v.style.transform) v.style.transform = ""; };
    const show = (i: number, animate: boolean) => {
      state[i] = "on";
      outs[i]?.pause(0);
      if (animate) { const tl = tls[i] ?? build(i); tl.pause(0); blank(i); rows[i]!.classList.add("is-flip"); tl.restart(); return; }
      tls[i]?.pause(0); rows[i]!.classList.remove("is-flip");
      rowCh[i]!.forEach((x) => setChar(x, x.ch));
      const v = verdictOf(i); if (v && v.style.transform) v.style.transform = "";
    };
    const hide = (i: number, animate: boolean) => {
      state[i] = "off";
      tls[i]?.pause(0);
      if (animate) { rowCh[i]!.forEach((x) => setChar(x, x.ch)); rows[i]!.classList.add("is-flip"); (outs[i] ?? buildOut(i)).restart(); return; }
      outs[i]?.pause(0); rows[i]!.classList.remove("is-flip");
      blank(i);
    };
    /* build every row's timeline ahead of use, one per idle moment, so the first play of a row never stalls the scroll */
    let pre = 0, preT = 0;
    const pump = () => { preT = 0; if (pre < N) { build(pre); buildOut(pre); pre++; preT = window.setTimeout(pump, 40); } };
    preT = window.setTimeout(pump, 300);
    const el = pin.current!;
    let raf = 0, visible = false, last = -2;
    const tk = track(el);
    const update = () => {
      raf = 0;
      if (!visible) return;
      const range = tk.h - viewH();
      const p = range > 0 ? clamp(-tk.rectTop() / range) : 0;
      const q = p * N;   // one row per unit: the row starts to flip at the step and is current from then on
      const c = q > 0.02 ? Math.min(N - 1, Math.floor(q)) : -1;
      if (c === last) return;
      rows.forEach((_, i) => {
        if (i <= c) {
          if (state[i] === "off") show(i, i === c);                  // only the row the scroll stopped on flips; rows jumped over are set at once
          else if (i < c && tls[i]?.isActive()) { tls[i]!.progress(1); rows[i]!.classList.remove("is-flip"); } // a row still flipping when the next one starts lands now
        } else if (state[i] === "on") hide(i, c === i - 1 && last === i);   // only the row just left flips back; a jump over several blanks them at once
      });
      last = c; setCur(c);
    };
    const kick = () => { if (!raf) raf = tRaf(update); };
    const io = new IntersectionObserver(([e]) => { visible = e!.isIntersecting; if (visible) kick(); });
    io.observe(el);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();
    return () => { io.disconnect(); window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); tCaf(raf); tls.forEach((t) => t?.kill()); outs.forEach((t) => t?.kill()); clearTimeout(preT); };
  }, [isStatic]);

  /* the headline flaps: each letter shows a few other flap characters, then its own, left to right (about 0.4s) */
  useEffect(() => {
    const el = headEl.current;
    if (!el || isStatic || cur < 0) return;
    const text = ROWS[cur]!.head;
    const t0 = performance.now(), D = 420;
    let raf = 0;
    const tick = (now: number) => {
      const r = clamp((now - t0) / D);
      el.textContent = Array.from(text).map((ch, j) => {
        const settle = 0.2 + 0.8 * (j / Math.max(1, text.length));
        if (r >= settle || !/[A-Za-z0-9]/.test(ch)) return ch;
        return FLAP[(Math.floor(r * 30) * 7 + j * 5 + ch.charCodeAt(0)) % FLAP.length];
      }).join("");
      if (r < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); el.textContent = text; };
  }, [cur, isStatic]);

  /* the board's markup never depends on the current row (the row classes are written below), so React renders it once and skips it on every step */
  const tableEl = useMemo(() => (
    <table ref={board} className="bd">
              <caption className="sr">Worked examples: route, goods, rule and verdict</caption>
              <thead className="sr"><tr><th>Route</th><th>Goods</th><th>Rule</th><th>Verdict</th></tr></thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.route} className="bd-row">
                    {COLS.map((c) => {
                      const t = label(r, c);
                      return (
                        <td key={c} className={`bd-c bd-${c}`}>
                          <span className="sr">{t}</span>
                          <span className="bd-flaps" aria-hidden="true">
                            {t.toUpperCase().split(" ").map((w, wi) => (
                              <span key={wi} className="bd-word">{Array.from(w).map((_, j) => <span key={j} className={`fl is-blank${c === "verdict" ? ` is-${r.verdict}` : ""}`}><span className="fh fh-t"><b /></span><span className="fh fh-b"><b /></span><span className="fh fh-fa"><b /></span><span className="fh fh-fb"><b /></span></span>)}</span>
                            ))}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
  ), []);
  useEffect(() => { board.current?.querySelectorAll<HTMLElement>("tbody tr").forEach((tr, i) => { tr.classList.toggle("is-cur", i === cur); tr.classList.toggle("is-past", i < cur); }); }, [cur]);

  const story = cur >= 0 ? ROWS[cur] : null;

  return (
    <section className="sec ex" id="examples" aria-labelledby="ex-h" data-guide-anchor="examples" data-guide-side="r">
      <div ref={pin} className={`ex-pin${isStatic ? " is-static" : ""}`} style={isStatic ? undefined : ({ height: `${100 + N * STEP}svh`, "--ex-n": N } as CSSProperties)}>
        <div className="ex-stage">
          <div className="container ex-head">
            <h2 id="ex-h" className="t-display-lg">What the rules let through, and what they stop.</h2>
            <p className="t-body t-soft">Illustrations, not customer filings: the verdict on a real shipment belongs to the rules and to the authority that reads them.</p>
          </div>
          <div className="container">
            {tableEl}
            {isStatic ? (
              <div className="bd-list">
                {ROWS.map((r) => (
                  <article key={r.route} className="bd-story is-open">
                    <Meta r={r} />
                    <h3 className="bd-h">{r.head}</h3>
                    <p className="t-body t-soft">{r.story}{r.build ? " Battery passports are in build." : ""}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className={`bd-story${story ? " is-open" : ""}`}>
                {story && (
                  <>
                    <span className="sr">{story.head}. {verdictText(story)}, {story.rule} {story.goods}, {story.route}.</span>
                    <div key={cur} className="bd-fade" aria-hidden="true">
                      <Meta r={story} />
                      <h3 className="bd-h"><span ref={headEl}>{story.head}</span></h3>
                      <p className="t-body t-soft">{story.story}{story.build ? " Battery passports are in build." : ""}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
