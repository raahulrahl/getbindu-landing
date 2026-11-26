import { getRoot } from "../lib/root";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { sunflowerCircles } from "../lib/phyllotaxis";
import { lockScroll, reduceMotion } from "../lib/motion";

/* r25-2b: the site mark is the golden-angle sunflower drawn as dots in two colours: yellow in the inner part, cobalt toward the outside, blended over the middle rings
   (colour-mix of two tokens, so it follows both themes). Same box and spiral as before. This is the site's mark, not Bindu's official logo file; the colour change needs
   Bindu's approval before production (v3/DECISIONS.md). The white variant (the statement chip) stays one colour. */
const MARK_N = 61;
const MARK_DOTS = sunflowerCircles(MARK_N, 100, 4).map((d, i) => {
  const t = i / (MARK_N - 1), p = Math.round(Math.min(1, Math.max(0, (t - 0.3) / 0.45)) * 5) * 20;   // 0 = all yellow, 100 = all cobalt, in steps of 20
  return { x: d.x.toFixed(1), y: d.y.toFixed(1), r: (d.r * 1.25).toFixed(2), fill: p === 0 ? "var(--sun)" : p === 100 ? "var(--cobalt-signal)" : `color-mix(in srgb, var(--cobalt-signal) ${p}%, var(--sun))` };
});
/* r65-10: the statement chip's mark is a sunflower of dots, evenly spaced, in one colour. r65-19: 55 dots (was 34, Austin: more dots), a touch larger each */
const CHIP_DOTS = sunflowerCircles(55, 100, 4).map((d) => ({ x: d.x.toFixed(1), y: d.y.toFixed(1), r: (d.r * 1.2).toFixed(2) }));
export function Mark({ size = 28, white = false, label = false, chip = false }: { size?: number; white?: boolean; label?: boolean; chip?: boolean }) {
  if (chip) return (
    <span className="mark mark-chip" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
        {CHIP_DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="currentColor" />)}
      </svg>
    </span>
  );
  return (
    <span className={`mark${white ? " mark-white" : ""}`} style={{ width: size, height: size }} aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined} aria-label={label ? "Bindu" : undefined}>
      <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
        {MARK_DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={white ? "currentColor" : d.fill} />)}
      </svg>
    </span>
  );
}

/* r36-3: Bindu's official sunflower logo (public/home/bindu-logo-*.webp, PNG fallback), the brand mark in the nav and the footer. The dot-built Mark above stays for the statement chip.
   64px copy for the nav (2x at 24px), 128px for the footer (2x at 40px). The link around it carries the accessible name, so the image itself is decorative. */
export function Logo({ size = 24 }: { size?: number }) {
  const n = size > 32 ? 128 : 64;
  return (
    <picture>
      <source srcSet={`/home/bindu-logo-${n}.webp`} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src={`/home/bindu-logo-${n}.png`} width={size} height={size} alt="" decoding="async" />
    </picture>
  );
}

/* r52 (DESIGN.md v2 section 5): a button's label, with an optional plain arrow after it (for links that leave the section).
   Nothing moves: the magnetic pull, the click dot burst and the arrow nudge are retired with v1. The label is Inter 500 sentence case (r52
   revision; the caps were rejected), and the link gets its accessible name (aria-label) from the label unless it has one. */
export function BtnLabel({ children, arrow = true }: { children: string; arrow?: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const link = host.current?.closest<HTMLElement>("a,button");
    if (link && !link.hasAttribute("aria-label")) link.setAttribute("aria-label", children);
  }, [children]);
  return (
    <>
      <span ref={host} className="btn-l">{children}</span>
      {arrow && (
        <span className="btn-arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
      )}
    </>
  );
}

/* round 15 item 11: the label of a text link (underline grows from the left, text wipes to cobalt, arrow nudges 4px) */
export function LinkLabel({ children, arrow = true }: { children: string; arrow?: boolean }) {
  return (
    <>
      <span className="tlink-l" data-label={children}>{children}</span>
      {arrow && <span className="tlink-a" aria-hidden="true" />}
    </>
  );
}

/* the completed sunflower as precise dots (static): the hero/finale fallback and reduced-motion end state */
export function SunflowerArt({ n = 377, size = 600, className = "" }: { n?: number; size?: number; className?: string }) {
  const dots = useMemo(() => sunflowerCircles(n, size, 6), [n, size]);
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
      {dots.map((d, i) => <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} />)}
    </svg>
  );
}

/* spiral progress: `on` dots lit in cobalt; complete = every dot yellow */
export function Spiral({ n = 34, on, size = 56, label }: { n?: number; on: number; size?: number; label?: string }) {
  const dots = useMemo(() => sunflowerCircles(n, size, 2), [n, size]);
  const lit = Math.round(on * n);
  return (
    <svg className={`spiral${on >= 1 ? " is-complete" : ""}`} viewBox={`0 0 ${size} ${size}`} width={size} height={size}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} className={i < lit ? "on" : undefined} />)}
    </svg>
  );
}

export function Status({ s }: { s: string }) {
  return s === "live" ? <span className="chip chip-live">Live</span> : <span className="chip chip-build">In build</span>;
}

/* Native modal dialog: background inert, Esc closes, focus moves in and returns to the opener.
   Opens with a scale-in from the button that opened it. */
export function Dialog({ open, onClose, opener, title, label, children, id }:
  { open: boolean; onClose: () => void; opener: HTMLElement | null; title: string; label?: string; children: ReactNode; id: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);   // the portal target is in the document, which the server does not have
  useEffect(() => setMounted(true), []);
  /* r61-10: every way out (the button, Esc, a click on the backdrop, the parent closing it) fades the window and the backdrop out in 160ms
     (a CSS transition on `.is-out`, a class GSAP does not touch) and then closes the native dialog, which returns focus to the opener. Reduced motion: at once. */
  const leaving = useRef<number | null>(null);
  const dismiss = useCallback(() => {
    const d = ref.current;
    if (!d || !d.open || leaving.current !== null) return;
    if (reduceMotion()) { d.close(); return; }
    d.classList.add("is-out");
    leaving.current = window.setTimeout(() => { leaving.current = null; d.classList.remove("is-out"); if (d.open) d.close(); }, 160);
  }, []);
  useEffect(() => () => { if (leaving.current !== null) window.clearTimeout(leaving.current); }, []);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) {
      d.classList.remove("is-out");
      if (opener) {
        const r = opener.getBoundingClientRect();
        d.style.setProperty("--ox", `${r.left + r.width / 2}px`); d.style.setProperty("--oy", `${r.top + r.height / 2}px`);
      }
      d.showModal(); lockScroll(true);
      d.classList.remove("is-in"); void d.offsetWidth; d.classList.add("is-in");
    } else if (!open && d.open) dismiss();
  }, [open, opener, mounted, dismiss]);
  useEffect(() => {   // Tab wraps inside the dialog (native modal focus can leave to the browser UI)
    const d = ref.current; if (!d) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const f = [...d.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !d.contains(at))) { e.preventDefault(); last!.focus(); }
      else if (!e.shiftKey && (at === last || !d.contains(at))) { e.preventDefault(); first!.focus(); }
    };
    d.addEventListener("keydown", trap);
    return () => d.removeEventListener("keydown", trap);
  }, []);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    const onClosed = () => { lockScroll(false); onClose(); opener?.focus(); };
    const onClick = (e: MouseEvent) => { if (e.target === d) dismiss(); };
    const onCancel = (e: Event) => { e.preventDefault(); dismiss(); };   // Esc
    d.addEventListener("close", onClosed); d.addEventListener("click", onClick); d.addEventListener("cancel", onCancel);
    return () => { d.removeEventListener("close", onClosed); d.removeEventListener("click", onClick); d.removeEventListener("cancel", onCancel); };
  }, [onClose, opener, mounted, dismiss]);
  if (!mounted) return null;
  return createPortal(
    <dialog ref={ref} className={`dlg${reduceMotion() ? " no-motion" : ""}`} aria-modal="true" aria-labelledby={`${id}-h`}>
      <div className="dlg-in band-dark">
        <div className="dlg-head">
          <h2 id={`${id}-h`} className="t-display-sm">{title}</h2>
          <button type="button" className="btn-icon dlg-x" onClick={dismiss} aria-label="Close">×</button>
        </div>
        {label && <p className="chip chip-illus dlg-label">{label}</p>}
        {children}
      </div>
    </dialog>,
    getRoot(),
  );
}
