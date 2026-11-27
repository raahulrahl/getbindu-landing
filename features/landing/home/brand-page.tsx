"use client";

/* The homepage, rebuilt on one authored brand (docs/home/BRAND.md) instead of the three
   borrowed systems the old page had accreted. Two stylesheets, not 29: brand.css is the
   system, brand-page.css is this page's layout.
   The old composition is still in home-page.tsx and nothing here touches it. */
import { useEffect, useRef, useState } from "react";
import "./styles/reset.css";
import "./styles/brand.css";
import "./styles/brand-page.css";
import { DEMO_URL, EUDR_SOURCE, publishedFaqItems } from "./content";

/* the mark: "bindu" with a dotless i, so the dot is a separate point sitting above the stem.
   content.ts has split the wordmark this way since round 65; nothing was ever built on it. */
function Wordmark() {
  return (
    <span className="bd-wordmark" aria-label="Bindu">
      b<i aria-hidden="true">ı</i>ndu
    </span>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    try {
      setTheme(localStorage.getItem("bindu-theme") === "dark" ? "dark" : "light");
    } catch { /* private mode: light */ }
  }, []);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.querySelector<HTMLElement>(".bindu-home");
    if (root) root.dataset.theme = next;
    try { localStorage.setItem("bindu-theme", next); } catch { /* private mode: not saved */ }
  };
  return (
    <button type="button" className="bd-btn bp-toggle" onClick={flip} aria-pressed={theme === "dark"}>
      {theme === "dark" ? "Paper" : "Dark"}
    </button>
  );
}

const NAV = [
  { t: "How it works", href: "#how" },
  { t: "Price", href: "#price" },
  { t: "What is live", href: "#status" },
  { t: "Questions", href: "#faq" },
];

function Nav() {
  return (
    <header className="bp-nav">
      <div className="bd-frame bp-nav-in">
        <a href="#top" className="bp-nav-mark"><Wordmark /></a>
        <nav aria-label="Homepage">
          <ul className="bp-nav-links">
            {NAV.map(({ t, href }) => (
              <li key={href}><a href={href}>{t}</a></li>
            ))}
          </ul>
        </nav>
        <div className="bp-nav-end">
          <ThemeToggle />
          <a className="bd-btn bd-btn-signal" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
            Book a demo
          </a>
        </div>
      </div>
    </header>
  );
}

/* The hero visual is the shape of a filing, not a picture of one. Every value is invented,
   so the panel carries a visible Illustration label (PRODUCT.md). */
const FILING_ROWS = [
  { k: "Shipment", v: "Cocoa beans, 18 t" },
  { k: "Commodity", v: "Cocoa" },
  { k: "Origin", v: "Côte d'Ivoire" },
  { k: "Plots", v: "24 of 24 received" },
  { k: "Deforestation cut-off", v: "31 Dec 2020" },
];

function Hero() {
  return (
    <section className="bp-hero" id="top">
      <div className="bd-frame bp-hero-in">
        <div className="bp-hero-copy bd-rise">
          <p className="bd-label">
            <span className="bd-chip bd-chip-live"><span className="bd-dot" />Live</span>
            <span className="bp-label-sep">EU Deforestation Regulation</span>
          </p>
          <h1 className="bd-display">File the EU statement, without a compliance team.</h1>
          <p className="bd-lead">
            Describe your shipment once. Bindu prepares the due diligence statement, files it in
            TRACES and returns the reference number your customs declaration needs.
          </p>
          <div className="bp-actions">
            <a className="bd-btn bd-btn-signal" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              Book a 30-minute demo
            </a>
            <a className="bd-btn" href="#price">See what it costs</a>
          </div>
        </div>

        <figure className="bp-panel bd-rise">
          <div className="bp-panel-head">
            <p className="bd-label">Due diligence statement</p>
            <span className="bd-chip bd-chip-build">Illustration</span>
          </div>
          <dl className="bp-rows">
            {FILING_ROWS.map(({ k, v }) => (
              <div className="bp-row" key={k}>
                <dt className="bd-small">{k}</dt>
                <dd className="bd-mono bd-small">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="bp-panel-foot">
            <p className="bd-label">TRACES reference</p>
            <p className="bd-mono bp-ref">25NLDDS0184627</p>
          </div>
          <figcaption className="bd-small bp-caption">
            Illustration: every plot is a point. Together they make one filing.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

const COMMODITIES = ["Cattle", "Cocoa", "Coffee", "Oil palm", "Rubber", "Soy", "Wood"];

const DATES = [
  { d: "30 December 2026", w: "Medium and large companies" },
  { d: "30 June 2027", w: "Most micro and small companies" },
];

function Rules() {
  return (
    <section className="bd-section" id="rules">
      <div className="bd-frame bp-two">
        <div className="bd-rise">
          <p className="bd-label">What the regulation asks</p>
          <h2 className="bd-h2">Two dates, depending on your size.</h2>
          <p className="bd-body">
            The EU Deforestation Regulation applies from a different date depending on how large
            your company is. Goods must not come from land deforested after 31 December 2020.
          </p>
          <p className="bd-small bp-source">
            Dates: <a href={EUDR_SOURCE} target="_blank" rel="noopener noreferrer">European Commission</a>,
            checked 12 November 2026.
          </p>
        </div>
        <div className="bd-rise">
          <ul className="bp-dates">
            {DATES.map(({ d, w }) => (
              <li key={d}>
                <p className="bd-mono bp-date">{d}</p>
                <p className="bd-small">{w}</p>
              </li>
            ))}
          </ul>
          <p className="bd-label bp-commodities-label">Commodities in scope</p>
          <ul className="bp-commodities">
            {COMMODITIES.map((c) => (
              <li key={c} className="bd-mono">{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    t: "Describe the shipment.",
    b: "One plain sentence: what you bring in, where it comes from, how much. No forms to learn.",
  },
  {
    n: "02",
    t: "Bindu asks your suppliers.",
    b: "On WhatsApp or by email, with no login for them. They see exactly what you will learn before anything leaves, and they can say no.",
  },
  {
    n: "03",
    t: "Bindu files it in TRACES.",
    b: "The due diligence statement goes to the EU's own system. You get the reference number for the customs declaration, and the records are kept.",
  },
];

function How() {
  return (
    <section className="bd-section" id="how">
      <div className="bd-frame">
        <div className="bp-head bd-rise">
          <p className="bd-label">How it works</p>
          <h2 className="bd-h2">Three steps, and you are filed.</h2>
        </div>
        <ol className="bp-steps">
          {STEPS.map(({ n, t, b }) => (
            <li key={n} className="bp-step bd-rise">
              <p className="bd-mono bp-step-n">{n}</p>
              <h3 className="bd-h3">{t}</h3>
              <p className="bd-body bd-small">{b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const PRICE_LINES = [
  { k: "To file the statement", v: "€199" },
  { k: "To keep the records five years", v: "€50" },
];

function Price() {
  return (
    <section className="bd-section" id="price">
      <div className="bd-frame bp-two">
        <div className="bd-rise">
          <p className="bd-label">Price</p>
          <h2 className="bd-h2">€249 a filing. No seats, no annual contract.</h2>
          <p className="bd-body">
            One price per filing, made of two parts. Nothing is per user, and nothing is billed
            for a year up front.
          </p>
          <div className="bp-actions">
            <a className="bd-btn bd-btn-signal" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              Book a 30-minute demo
            </a>
          </div>
        </div>
        <div className="bp-price-card bd-rise">
          <p className="bd-mono bp-price-big">€249</p>
          <p className="bd-label">Per EUDR filing</p>
          <dl className="bp-rows bp-rows-plain">
            {PRICE_LINES.map(({ k, v }) => (
              <div className="bp-row" key={k}>
                <dt className="bd-small">{k}</dt>
                <dd className="bd-mono bd-small">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="bp-price-extras">
            <li className="bd-small">Keep the records ten years instead of five: <span className="bd-mono">€100</span></li>
            <li className="bd-small">Workspace: <span className="bd-mono">€20</span> a month</li>
          </ul>
          <p className="bd-small bp-source">Prices exclude VAT.</p>
        </div>
      </div>
    </section>
  );
}

const LIVE = [
  { t: "EUDR filing", b: "The due diligence statement in TRACES, reference number out." },
  { t: "Identity signing", b: "W3C DID." },
];

const BUILD = [
  "CBAM", "Product passports", "PPWR packaging", "REACH",
  "HS classification", "Supplier exchange", "Agents",
];

function Status() {
  return (
    <section className="bd-section" id="status">
      <div className="bd-frame">
        <div className="bp-head bd-rise">
          <p className="bd-label">What is live</p>
          <h2 className="bd-h2">Two things work today. The rest is in build.</h2>
          <p className="bd-body">
            We would rather tell you this on the homepage than in a sales call. Anything in build
            is marked in build, here and in the product.
          </p>
        </div>
        <div className="bp-status bd-rise">
          <div className="bp-status-col">
            <p className="bd-label">Live</p>
            <ul className="bp-status-list">
              {LIVE.map(({ t, b }) => (
                <li key={t}>
                  <span className="bd-chip bd-chip-live"><span className="bd-dot" />Live</span>
                  <h3 className="bd-h3">{t}</h3>
                  <p className="bd-small">{b}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bp-status-col">
            <p className="bd-label">In build</p>
            <ul className="bp-build-list">
              {BUILD.map((t) => (
                <li key={t}><span className="bd-chip bd-chip-build">{t}</span></li>
              ))}
            </ul>
            <p className="bd-small bp-source">Built on Eclipse Tractus-X.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="bd-section" id="faq">
      <div className="bd-frame bp-two">
        <div className="bd-rise">
          <p className="bd-label">Questions</p>
          <h2 className="bd-h2">What importers ask first.</h2>
        </div>
        <dl className="bp-faq bd-rise">
          {publishedFaqItems.map(({ q, a }) => (
            <div className="bp-faq-row" key={q}>
              <dt className="bd-h3">{q}</dt>
              <dd className="bd-small">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const FOOT_EXPLORE = [
  { t: "How it works", href: "#how" },
  { t: "Price", href: "#price" },
  { t: "What is live", href: "#status" },
  { t: "Questions", href: "#faq" },
];

const FOOT_RULES = [
  { t: "EUDR", href: "/eudr" },
  { t: "CBAM", href: "/cbam" },
  { t: "REACH", href: "/reach" },
  { t: "PPWR", href: "/ppwr" },
];

function Footer() {
  return (
    <footer className="bp-foot">
      <div className="bd-frame bp-foot-in">
        <div className="bp-foot-col">
          <Wordmark />
          <p className="bd-small">
            Describe your shipment once. Bindu finds the rules that apply and files the statement.
          </p>
        </div>
        <div className="bp-foot-col">
          <p className="bd-label">Explore</p>
          <ul>{FOOT_EXPLORE.map(({ t, href }) => <li key={t}><a href={href}>{t}</a></li>)}</ul>
        </div>
        <div className="bp-foot-col">
          <p className="bd-label">Regulations</p>
          <ul>{FOOT_RULES.map(({ t, href }) => <li key={t}><a href={href}>{t}</a></li>)}</ul>
        </div>
        <div className="bp-foot-col">
          <p className="bd-label">Company</p>
          <ul>
            <li><a href="mailto:raahul@getbindu.com">raahul@getbindu.com</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="bd-frame bp-foot-bar">
        <p className="bd-small">For importers, exporters and co-ops, customs brokers and traders.</p>
        <p className="bd-small bd-mono">
          © 2026 GetBindu · The73 B.V. · KvK 92797911 · Amsterdam, NL
        </p>
      </div>
    </footer>
  );
}

export function BrandHomePage() {
  const root = useRef<HTMLDivElement>(null);
  /* the only two moves in the system (docs/home/BRAND.md): a 16px rise with opacity on entry,
     and hairlines drawing. GSAP sets the start state, so there is no CSS hidden state to leak. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let kill = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".bd-rise").forEach((t) => {
          gsap.from(t, {
            y: 16,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: t, start: "top 88%", once: true },
          });
        });
      }, el);
      kill = () => ctx.revert();
    })();
    return () => { cancelled = true; kill(); };
  }, []);
  return (
    <div ref={root}>
      <a className="bp-skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Rules />
        <How />
        <Price />
        <Status />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
