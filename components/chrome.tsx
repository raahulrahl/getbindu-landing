import { CAL_URL, cta } from "@/lib/content";

/* ── Wordmark ──────────────────────────────────────────────────
   bindu means dot. The dot is the accent, so the mark needs no logo file. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[16px] font-medium tracking-[-0.01em] ${className}`}>
      bindu<span className="text-brand">.</span>
    </span>
  );
}

/* ── Announcement bar (DESIGN.md §4.5) ─────────────────────────
   34px on desktop, auto-height below 768px so two-line text is not clipped. */
export function AnnounceBar() {
  return (
    <div className="relative bg-grey-100 border-b border-grey-300">
      <div className="page flex min-h-[34px] flex-wrap items-center justify-center gap-2 py-2 pr-9 text-center md:py-0">
        <span className="font-mono text-[13px] leading-[1.4] tracking-[0.16px] text-grey-700">
          EUDR applies to medium and large companies from 30 December 2026.
        </span>
        <a href="/eudr" className="font-mono text-[13px] tracking-[0.16px] text-cobalt-ink underline">
          See what it means for you.
        </a>
      </div>
    </div>
  );
}

/* ── Header (DESIGN.md §4.5) ───────────────────────────────────
   Sticky, 74px, white, no bottom border. Nav is mono; dropdown items are sans. */
const NAV = [
  { label: "Regulations", href: "#regulations" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="page flex h-[74px] items-center gap-8">
        <a href="/" aria-label="Bindu home">
          <Wordmark />
        </a>
        <nav className="ml-auto hidden items-center gap-6 xl:flex">
          {NAV.map((i) => (
            <a key={i.href} href={i.href} className="chrome text-grey-600 transition-colors hover:text-black">
              {i.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <a href="/login" className="btn btn-tertiary">Log in</a>
          <a href={CAL_URL} className="btn btn-primary">
            {cta.demo} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ── Footer (DESIGN.md §4.6) ───────────────────────────────────
   Headers mono uppercase, links sans. Five columns on the 12-col grid. */
const FOOTER = [
  {
    title: "Regulations",
    span: "md:col-span-2 xl:col-span-2",
    links: [
      ["EUDR", "/eudr"], ["CBAM", "/cbam"], ["Product passports", "/dpp"],
      ["PPWR", "/ppwr"], ["REACH", "/reach"],
    ],
  },
  {
    title: "Product",
    span: "md:col-span-2 xl:col-span-2",
    links: [
      ["How it works", "#how"], ["Pricing", "#pricing"],
      ["Supplier requests", "#suppliers"], ["Filing and TRACES", "#filing"],
    ],
  },
  {
    title: "Resources",
    span: "md:col-span-2 xl:col-span-2",
    links: [["Docs", "/docs"], ["Blog", "/blog"], ["llms.txt", "/llms.txt"], ["Status", "/status"]],
  },
  {
    title: "Company",
    span: "md:col-span-2 xl:col-span-3",
    links: [["About", "/about"], ["Careers", "/careers"], ["Contact", "/contact"]],
  },
];

export function Footer() {
  return (
    <>
      <footer className="page section rule-top">
        <div className="col-span-full md:col-span-8 xl:col-span-3">
          <h5 className="eyebrow mb-4">Get updates</h5>
          <form className="flex items-center gap-2 border-b border-grey-400 pb-1">
            <input
              type="email"
              placeholder="you@company.com"
              aria-label="Email address"
              className="field h-8 flex-1 border-0 bg-transparent px-0"
            />
            <button type="submit" aria-label="Subscribe" className="text-grey-600">→</button>
          </form>
          <p className="mt-4 max-w-[28rem] text-[13px] text-grey-600">
            Regulation changes, filing deadlines, and what we shipped. No more than monthly.
          </p>
        </div>

        {FOOTER.map((col) => (
          <div key={col.title} className={`col-span-2 ${col.span}`}>
            <h5 className="eyebrow mb-4">{col.title}</h5>
            {col.links.map(([label, href]) => (
              <a key={href} href={href} className="mb-3 block text-[13px] text-black transition-colors hover:text-grey-600">
                {label}
              </a>
            ))}
            {col.title === "Company" && (
              <>
                <h5 className="eyebrow mt-6 mb-4">Legal</h5>
                <a href="/privacy" className="mb-3 block text-[13px] text-black hover:text-grey-600">Privacy</a>
                <a href="/terms" className="mb-3 block text-[13px] text-black hover:text-grey-600">Terms</a>
              </>
            )}
          </div>
        ))}
      </footer>

      <div className="page flex flex-wrap items-center justify-between gap-4 border-t border-grey-300 py-4">
        <span className="status">
          <span className="status-dot" aria-hidden />
          All systems operational
        </span>
        <span className="chrome text-grey-600">
          Bindu · {new Date().getFullYear()} · Cookie preferences
        </span>
      </div>
    </>
  );
}

/* ── Dark band with the HUMAN / MACHINE toggle (DESIGN.md §4.7, §4.9) ──
   On dark, the accent steps up to cobalt-300. cobalt-100 is 2.4:1 here. */
export function MachineBand() {
  return (
    <div
      className="flex items-center justify-center bg-grey-1000"
      style={{ height: "var(--footer-visual-height)" }}
    >
      <div className="chrome flex items-center gap-4 text-white">
        <span className="inline-flex items-center gap-2">
          <span className="text-cobalt-300" aria-hidden>◉</span> Human
        </span>
        <a href="/llms.txt" className="inline-flex items-center gap-2 text-grey-500 transition-colors hover:text-white">
          <span aria-hidden>○</span> Machine
        </a>
      </div>
    </div>
  );
}
