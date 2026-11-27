import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "../lib/motion";
import { onReady } from "../lib/ready";
import { scrollPos } from "../lib/pos";
import { DEMO_URL, cta, nav } from "../content";
import { BtnLabel, Logo } from "./bits";
import { getTheme, setTheme, useTheme } from "../lib/theme";
import { DOCS_HREF, INTEGRATIONS_ANCHOR, LOGIN_HREF, NAV_BLOG, NAV_REGULATIONS } from "../links";
import { useAuthStore } from "@shelley/core/auth";
import { GitHubMark, githubBadgeLabel, githubRepoLabel, githubUrl, useGithubStars } from "../../shared";

function useLogin() {
  const user = useAuthStore((s) => s.user);
  return user ? { href: "/", label: "Dashboard" } : { href: LOGIN_HREF, label: "Log in" };
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

export function Nav() {
  const login = useLogin();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => {
    const triggers = new Map<string, ScrollTrigger>();
    const attach = (id: string) => {
      const el = document.getElementById(id);
      if (!el || triggers.has(id)) return !!el;
      const activate = () => setCurrent(id);
      const deactivate = () => setCurrent((current) => current === id ? null : current);
      triggers.set(id, ScrollTrigger.create({
        id, trigger: el, start: "top center", end: "bottom center",
        onEnter: activate, onEnterBack: activate, onLeave: deactivate, onLeaveBack: deactivate,
      }));
      return true;
    };
    const missing = nav.links.map((link) => link.href.slice(1)).filter((id) => !attach(id));
    const off = onReady((id) => { if (missing.includes(id)) attach(id); });
    return () => { off(); triggers.forEach((trigger) => trigger.kill()); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollPos() > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    drawer.current?.querySelector("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menu.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 960px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-in">
        <a className="nav-brand" href="#top" aria-label="Bindu, back to top">
          <Logo size={24} />
          <span>Bindu</span>
        </a>
        <nav className="nav-links" aria-label="Site sections and pages">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href} aria-current={current === link.href.slice(1) ? "location" : undefined}>{link.t}</a>
          ))}
          <RegulationsMenu />
          <a href={`#${INTEGRATIONS_ANCHOR}`}>Integrations</a>
          <a href={NAV_BLOG.u}>{NAV_BLOG.t}</a>
          <a href={DOCS_HREF} target="_blank" rel="noopener noreferrer">Docs</a>
        </nav>
        <div className="nav-actions">
          <GitHubBadge className="btn nav-gh" />
          <ThemeToggle />
          <a className="btn btn-secondary nav-login" href={login.href}>{login.label}</a>
          <a className="btn bh-btn-primary nav-book" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.demoShort}</BtnLabel></a>
          <button ref={menu} type="button" className="btn btn-ghost nav-menu" aria-expanded={open} aria-controls="nav-drawer" onClick={() => setOpen(!open)}>
            {open ? nav.close : nav.menu}
          </button>
        </div>
      </div>
      <nav id="nav-drawer" ref={drawer} className="nav-drawer" aria-label="Mobile navigation" hidden={!open}>
        {nav.links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.t}</a>)}
        <p className="nav-drawer-head" id="nav-drawer-reg">{nav.regulations}</p>
        <div role="group" aria-labelledby="nav-drawer-reg" className="nav-drawer-group">
          {NAV_REGULATIONS.map((link) => <a key={link.u} href={link.u}>{link.t}</a>)}
        </div>
        <a href={`#${INTEGRATIONS_ANCHOR}`} onClick={() => setOpen(false)}>Integrations</a>
        <a href={NAV_BLOG.u}>{NAV_BLOG.t}</a>
        <a href={DOCS_HREF} target="_blank" rel="noopener noreferrer">Docs</a>
        <GitHubBadge className="nav-drawer-gh" />
        <a className="btn bh-btn-primary nav-drawer-book" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.demoShort}</BtnLabel></a>
      </nav>
    </header>
  );
}
