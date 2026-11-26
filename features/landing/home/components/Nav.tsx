import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reduceMotion } from "../lib/motion";
import { onReady } from "../lib/ready";
import { scrollPos } from "../lib/pos";
import { DEMO_URL, cta, nav } from "../content";
import { BtnLabel, Logo } from "./bits";
import { getTheme, setTheme, useTheme } from "../lib/theme";
import { NAV_BLOG, NAV_REGULATIONS } from "../links";
import { useAuthStore } from "@shelley/core/auth";
import { GitHubMark, githubBadgeLabel, githubRepoLabel, githubUrl, useGithubStars } from "../../shared";

/* r65-3: the getbindu.com header actions (as in features/landing/chrome/island-header.tsx): the GitHub badge with its live star count, Docs
   and Sign in, before Book a demo. Same hrefs, same signed-in label, same badge wording, so the two headers never disagree. */
const DOCS_HREF = "https://doc.getbindu.com/guides/overview";
function useSignIn() {
  const user = useAuthStore((s) => s.user);
  return { href: user ? "/" : "/login", label: user ? "Dashboard" : "Sign in" };
}
function GitHubBadge({ className }: { className: string }) {
  const stars = useGithubStars();
  return (
    <a className={className} href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={githubBadgeLabel(stars)} title={githubRepoLabel}>
      <GitHubMark className="nav-gh-mark" />
      <span>{stars ?? "GitHub"}</span>
      <span aria-hidden="true" className="nav-gh-star">&#9733;</span>
    </a>
  );
}

/* round 13: the light or dark switch. The icon shows the theme it switches to (a moon in light, a sun in dark). */
function ThemeToggle() {
  const theme = useTheme();
  const toDark = theme === "light";
  return (
    <button type="button" className="btn btn-icon theme-toggle" aria-label={toDark ? nav.theme.toDark : nav.theme.toLight}
      onClick={() => setTheme(getTheme() === "light" ? "dark" : "light")}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* both icons are always in the DOM and CSS hides one (opacity), so the boxes are the same in both themes */}
        <g className="ic-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" /></g>
        <path className="ic-moon" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}

/* r38-1: the Regulations disclosure. A button (aria-expanded, aria-controls) over a plain list of links. Opens on click, and
   on hover after a short delay for a mouse; closes on Esc (focus returns to the button), a click outside, or focus leaving.
   Arrow keys, Home and End move between the items. */
function RegulationsMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const items = () => Array.from(root.current?.querySelectorAll<HTMLAnchorElement>(".nav-reg-panel a") ?? []);
  const clear = () => window.clearTimeout(timer.current);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);
  useEffect(() => clear, []);
  const onKey = (e: React.KeyboardEvent) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); btn.current?.focus(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); requestAnimationFrame(() => items()[e.key === "ArrowDown" ? 0 : list.length - 1]?.focus()); return; }
      const next = e.key === "ArrowDown" ? (i + 1) % list.length : (i <= 0 ? list.length - 1 : i - 1);
      list[next]?.focus();
    } else if (open && (e.key === "Home" || e.key === "End") && i >= 0) {
      e.preventDefault(); list[e.key === "Home" ? 0 : list.length - 1]?.focus();
    }
  };
  const hover = (on: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clear();
    timer.current = window.setTimeout(() => setOpen(on), on ? 120 : 200);
  };
  return (
    <div ref={root} className={`nav-reg${open ? " is-open" : ""}`} onKeyDown={onKey}
      onPointerEnter={hover(true)} onPointerLeave={hover(false)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
      <button ref={btn} type="button" className="nav-reg-btn" aria-expanded={open} aria-controls="nav-reg-panel"
        onClick={() => { clear(); setOpen(!open); }}>
        {nav.regulations}
        <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
      </button>
      <div id="nav-reg-panel" className="nav-reg-panel" hidden={!open}>
        {NAV_REGULATIONS.map((l) => <a key={l.u} href={l.u} onClick={() => setOpen(false)}>{l.t}</a>)}
      </div>
    </div>
  );
}

const NAV_LINKS = nav.links;

/* r43: a pill box around a link, in the coordinates of the links row (so it works for the Regulations button too). */
function pillRect(row: HTMLElement, a: HTMLElement) {
  const r = a.getBoundingClientRect(), o = row.getBoundingClientRect();
  return { x: r.left - o.left - 22, y: r.top - o.top + r.height / 2 - 14, width: r.width + 34 };
}

/* The nav: logo, links, the Regulations menu, the theme toggle and (r52) Book a demo at the right end of the floating bar.
   Phones get a drawer that keeps its own Book a demo. From 861px the bar collapses past the hero to a pill with the logo only. */
export function Nav() {
  const signIn = useSignIn();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const links = useRef<HTMLElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const header = useRef<HTMLElement>(null);
  const navIn = useRef<HTMLDivElement>(null);
  const restEl = useRef<HTMLDivElement>(null);
  const brandEl = useRef<HTMLAnchorElement>(null);
  const pill = useRef<HTMLSpanElement>(null);      // r43: the active pill (slides and resizes under the scroll-spy)
  const hov = useRef<HTMLSpanElement>(null);       // r43: the quieter hover pill (follows the pointer, returns to the active link)
  const [mounted, setMounted] = useState(false);   // the dot and the rail exist only once GSAP can own them (no CSS hidden states)
  const [current, setCurrent] = useState<string | null>(null);   // r42-2: the section in view (an id from nav.links), or null
  useEffect(() => setMounted(true), []);
  useLayoutEffect(() => {
    if (!mounted) return;
    gsap.set(dot.current, { opacity: 0 });
    gsap.set([pill.current, hov.current], { opacity: 0 });
  }, [mounted]);
  /* r42-2: scroll-spy. One ScrollTrigger per anchored section; a section that has not hydrated yet is retried when it is ready. */
  useEffect(() => {
    if (!mounted) return;
    const sts: ScrollTrigger[] = [];
    const attach = (id: string) => {
      const el = document.getElementById(id);
      if (!el || sts.some((t) => t.vars.id === id)) return !!el;
      sts.push(ScrollTrigger.create({
        id, trigger: el, start: "top center", end: "bottom center",
        onEnter: () => setCurrent(id), onEnterBack: () => setCurrent(id),
        onLeave: () => setCurrent((c) => (c === id ? null : c)), onLeaveBack: () => setCurrent((c) => (c === id ? null : c)),
      }));
      return true;
    };
    const ids = nav.links.map((l) => l.href.slice(1));
    const missing = ids.filter((id) => !attach(id));
    const off = missing.length ? onReady((id) => { if (missing.includes(id)) attach(id); }) : undefined;
    return () => { off?.(); sts.forEach((t) => t.kill()); };
  }, [mounted]);
  /* the dot slides under the active link (power3.out, 0.45s); with no active link it fades out; reduced motion jumps */
  const placed = useRef(false);
  useEffect(() => {
    if (!mounted) return;
    const d = dot.current, nl = links.current;
    if (!d || !nl) return;
    const activeRect = () => { const a = current ? nl.querySelector<HTMLElement>(`a[href="#${current}"]`) : null; return a && a.offsetWidth ? pillRect(nl, a) : null; };
    const at = () => {
      const a = current ? nl.querySelector<HTMLElement>(`a[href="#${current}"]`) : null;
      return a && a.offsetWidth ? { x: a.offsetLeft - 22 + 10, y: a.offsetTop + a.offsetHeight / 2 - 3 } : null;
    };
    const pl = pill.current;
    const p = at(), jump = reduceMotion();
    if (!p) {
      gsap.killTweensOf(d); gsap.killTweensOf(pl);
      if (jump) gsap.set([d, pl], { opacity: 0 }); else gsap.to([d, pl], { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }
    gsap.killTweensOf(d); gsap.killTweensOf(pl);
    const pr = activeRect();
    if (!placed.current || jump) { gsap.set(d, { ...p, opacity: 1 }); if (pr) gsap.set(pl, { ...pr, opacity: 1 }); }
    else { gsap.to(d, { ...p, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: true }); if (pr) gsap.to(pl, { ...pr, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: true }); }
    placed.current = true;
    const re = () => { const q = at(); if (q) gsap.set(d, q); const r = activeRect(); if (r) gsap.set(pl, r); };
    window.addEventListener("resize", re);
    return () => window.removeEventListener("resize", re);
  }, [current, mounted]);
  /* r43-2: the hover pill. Glides to the hovered (or keyboard-focused) link, and glides back to the active one on leave. */
  useEffect(() => {
    if (!mounted) return;
    const nl = links.current, h = hov.current;
    if (!nl || !h) return;
    let shown = false;
    const activeEl = () => (current ? nl.querySelector<HTMLElement>(`a[href="#${current}"]`) : null);
    const target = (t: EventTarget | null) => {
      const el = t instanceof Element ? t : null;
      if (!el) return null;
      if (el.closest(".nav-reg-panel")) return nl.querySelector<HTMLElement>(".nav-reg-btn");
      return el.closest<HTMLElement>(".nav-links > a, .nav-reg-btn");
    };
    const to = (el: HTMLElement | null) => {
      if (el && el.offsetWidth) {
        const r = pillRect(nl, el);
        if (!shown || reduceMotion()) gsap.set(h, { ...r, opacity: 1 });
        else gsap.to(h, { ...r, opacity: 1, duration: 0.35, ease: "power3.out", overwrite: true });
        shown = true;
        return;
      }
      const a = activeEl();
      if (!shown) return;
      shown = false;
      if (reduceMotion()) { gsap.set(h, { opacity: 0 }); return; }
      if (a && a.offsetWidth) gsap.to(h, { ...pillRect(nl, a), opacity: 0, duration: 0.35, ease: "power3.out", overwrite: true });
      else gsap.to(h, { opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
    };
    const over = (e: PointerEvent) => { if (e.pointerType === "mouse") to(target(e.target)); };
    const leave = (e: PointerEvent) => { if (e.pointerType === "mouse") to(null); };
    const fin = (e: FocusEvent) => { if ((e.target as Element).matches(":focus-visible")) to(target(e.target)); };
    const fout = () => to(null);
    nl.addEventListener("pointerover", over); nl.addEventListener("pointerleave", leave);
    nl.addEventListener("focusin", fin); nl.addEventListener("focusout", fout);
    return () => {
      nl.removeEventListener("pointerover", over); nl.removeEventListener("pointerleave", leave);
      nl.removeEventListener("focusin", fin); nl.removeEventListener("focusout", fout);
      gsap.killTweensOf(h);
    };
  }, [mounted, current]);
  /* r43-1/3: the island. From 861px, scrolling down past the hero contracts the bar into a round pill that holds only the mark. Scrolling up,
     hover, or keyboard focus expands it. One timeline on the bar (width and radius, one smooth ease) with the links fading ahead of it;
     the links never change size, the bar just clips them while it is narrow, so there is no per-frame relayout of the row.
     Every change kills the last tween and starts from the current values, so it can be interrupted at any point. The bar is fixed. */
  useEffect(() => {
    if (!mounted) return;
    const nav = header.current, rest = restEl.current, brand = brandEl.current, nin = navIn.current;
    if (!nav || !rest || !brand || !nin) return;
    const mq = window.matchMedia("(min-width: 861px)");
    const s = { want: false, hover: false, focus: false, collapsed: false };
    let tl: gsap.core.Timeline | null = null, st: ScrollTrigger | null = null, leaveT = 0, last = 0, inited = false, off: (() => void)[] = [];
    const natural = () => { const w0 = nav.style.width; nav.style.width = ""; const w = nav.offsetWidth; nav.style.width = w0; return w; };
    const compactW = () => 56;   // r52 (Austin): the pill is the logo only; Book a demo lives in .nav-rest and leaves with the links
    const build = (collapsed: boolean, instant: boolean) => {
      tl?.kill(); s.collapsed = collapsed;
      const nv = collapsed ? { width: compactW(), "--nav-r": "12px" } : { width: natural(), "--nav-r": "12px" };
      const done = () => { nav.classList.remove("is-moving"); if (!s.collapsed) { gsap.set(nav, { clearProps: "width" }); nav.classList.remove("is-island"); } else rest.style.visibility = "hidden"; };
      if (collapsed) nav.classList.add("is-island");
      if (!collapsed) rest.style.visibility = "";
      if (!instant) nav.classList.add("is-moving");   // the blur is off while the bar changes size (a backdrop repaint per frame over the canvas is what makes it janky)
      if (instant) { gsap.set(nav, nv); gsap.set(rest, { opacity: collapsed ? 0 : 1 }); done(); return; }
      tl = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: done });
      if (collapsed) {
        tl.to(rest, { opacity: 0, duration: 0.22, ease: "power2.out" }, 0).to(nav, { ...nv, duration: 0.7, ease: "power3.inOut" }, 0.06);
      } else {
        tl.to(nav, { ...nv, duration: 0.7, ease: "power3.inOut" }, 0).to(rest, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.3);
      }
    };
    const refresh = (force = false, instant = false) => {
      const c = s.want && !s.hover && !s.focus;
      if (c !== s.collapsed || force) build(c, instant || reduceMotion());
    };
    const heroPast = (y: number) => y > ((document.querySelector<HTMLElement>(".bindu-home .hero")?.offsetHeight ?? window.innerHeight) * 0.8);
    const enable = () => {
      st = ScrollTrigger.create({
        start: 0, end: "max",
        onRefresh: (self) => {
          if (!inited) { inited = true; last = self.scroll(); s.want = heroPast(last); refresh(true, true); }
          else if (!heroPast(self.scroll()) && s.want) { s.want = false; refresh(); }
        },
        onUpdate: (self) => {
          const y = self.scroll();
          if (!heroPast(y)) s.want = false;
          else if (y - last > 6) s.want = true;
          else if (last - y > 6) s.want = false;
          else return;
          last = y; refresh();
        },
      });
      const enter = (e: PointerEvent) => { if (e.pointerType === "touch") return; window.clearTimeout(leaveT); s.hover = true; refresh(); };
      const out = (e: PointerEvent) => { if (e.pointerType === "touch") return; window.clearTimeout(leaveT); leaveT = window.setTimeout(() => { s.hover = false; refresh(); }, 320); };
      const fin = (e: FocusEvent) => { if ((e.target as Element).matches(":focus-visible")) { s.focus = true; refresh(); } };
      const fout = (e: FocusEvent) => { if (!nav.contains(e.relatedTarget as Node | null)) { s.focus = false; refresh(); } };
      nav.addEventListener("pointerenter", enter); nav.addEventListener("pointerleave", out);
      nav.addEventListener("focusin", fin); nav.addEventListener("focusout", fout);
      off = [() => { nav.removeEventListener("pointerenter", enter); nav.removeEventListener("pointerleave", out); nav.removeEventListener("focusin", fin); nav.removeEventListener("focusout", fout); }];
    };
    const disable = () => {
      tl?.kill(); st?.kill(); st = null; window.clearTimeout(leaveT); nav.classList.remove("is-moving"); off.forEach((f) => f()); off = [];
      s.collapsed = false; s.want = false; s.hover = false; s.focus = false; inited = false;
      nav.classList.remove("is-island"); nav.style.removeProperty("width"); nav.style.removeProperty("--nav-r");
      gsap.set(rest, { clearProps: "all" });
    };
    const sync = () => { if (mq.matches) enable(); else disable(); };
    sync();
    mq.addEventListener("change", sync);
    return () => { mq.removeEventListener("change", sync); disable(); };
  }, [mounted]);
  useEffect(() => {
    const on = () => setScrolled(scrollPos() > 24);   // r65-13: no layout read in the scroll handler
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    drawer.current?.querySelector("a")?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <header ref={header} className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div ref={navIn} className="nav-in">
        <a ref={brandEl} className="nav-brand" href="#top" aria-label="Bindu, back to top"><Logo size={24} /><span>Bindu</span></a>
        <div ref={restEl} className="nav-rest">
        <nav ref={links} className="nav-links" aria-label="Site sections and pages">
          {nav.links.map((l) => <a key={l.href} href={l.href} aria-current={current === l.href.slice(1) ? "location" : undefined}>{l.t}</a>)}
          <RegulationsMenu />
          <a href={NAV_BLOG.u}>{NAV_BLOG.t}</a>
          {mounted && <><span ref={pill} className="nav-pill" aria-hidden="true" /><span ref={hov} className="nav-hover" aria-hidden="true" /><span ref={dot} className="nav-dot" aria-hidden="true" /></>}
        </nav>
        <ThemeToggle />
        <GitHubBadge className="btn btn-ghost nav-act nav-gh" />
        <a className="btn btn-ghost nav-act" href={DOCS_HREF} target="_blank" rel="noopener noreferrer">Docs</a>
        <a className="btn btn-ghost nav-act" href={signIn.href}>{signIn.label}</a>
        {/* r52 (Austin, 25 Nov 2026): Book a demo is back on the expanded bar, at its right end. It sits in .nav-rest, so the collapsed pill
            (logo only, r43) fades it out with the links and takes it out of the tab order (visibility hidden). */}
        <a className="btn bh-btn-primary nav-book" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.demoShort}</BtnLabel></a>
        </div>
        <button ref={btn} type="button" className="btn btn-ghost nav-menu" aria-expanded={open} aria-controls="nav-drawer" onClick={() => setOpen(!open)}>
          {open ? nav.close : nav.menu}
        </button>
      </div>
      <div id="nav-drawer" ref={drawer} className="nav-drawer" hidden={!open}>
        {nav.links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.t}</a>)}
        <p className="nav-drawer-head" id="nav-drawer-reg">{nav.regulations}</p>
        <div role="group" aria-labelledby="nav-drawer-reg" className="nav-drawer-group">
          {NAV_REGULATIONS.map((l) => <a key={l.u} href={l.u} onClick={() => setOpen(false)}>{l.t}</a>)}
        </div>
        <a href={NAV_BLOG.u} onClick={() => setOpen(false)}>{NAV_BLOG.t}</a>
        <GitHubBadge className="nav-drawer-gh" />
        <a href={DOCS_HREF} target="_blank" rel="noopener noreferrer">Docs</a>
        <a href={signIn.href}>{signIn.label}</a>
        <a className="btn bh-btn-primary nav-drawer-book" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.demoShort}</BtnLabel></a>
      </div>
    </header>
  );
}
