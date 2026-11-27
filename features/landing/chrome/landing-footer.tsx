"use client";

import Link from "next/link";
import Image from "next/image";
import { TradeOcean } from "../sections/trade-ocean";
import { githubBadgeLabel, githubRepoLabel, useGithubStars } from "../shared";
import { DemoCtaLink } from "../demo-cta-link";
import { DEMO_CTA_LABEL } from "@/lib/demo-url";

// Kit IA — bindu-design-system/project/kits/marketing.html.
// Four-column grid: pitch + Platform + Resources + Company.
type Col = {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
};

const COLS: Col[] = [
  {
    heading: "Platform",
    links: [
      { label: "EUDR", href: "/eudr" },
      { label: "CBAM", href: "/cbam" },
      { label: "CBAM software", href: "/cbam/software" },
      { label: "REACH", href: "/reach" },
      { label: "PPWR", href: "/ppwr" },
      { label: "Battery Passport", href: "/dpp/battery" },
      { label: "Textile Passport", href: "/dpp/textiles" },
      { label: "Other product groups", href: "/dpp/others" },
    ],
  },
  {
    heading: "Resources",
    links: [
      {
        label: "Roadmap",
        href: "https://docs.getbindu.com/roadmap/introduction/overview",
        external: true,
      },
      {
        // "Self-host docs" read as though the compliance platform could be
        // self-hosted. It cannot: these are the install docs for the open
        // source agent layer, which is what the link has always pointed at.
        label: "Agent install docs",
        href: "https://docs.getbindu.com/bindu/how-to/install",
        external: true,
      },
    ],
  },
  {
    heading: "Company",
    links: [
      {
        // "Open source" alone read as though the compliance platform were
        // open source; it is not (see 987684f). This link, and the star badge
        // in the meta row below, point at the agent layer, which is the part
        // that is (Apache-2.0). Name it.
        label: "Agent layer, open source",
        href: "https://github.com/GetBindu/Bindu",
        external: true,
      },
      // Was "Contact", pointing at the booking calendar. A visitor reads
      // "Contact" as an address or a form, and a fourth label on a destination
      // the page already offers three times teaches nothing. The address was
      // published in llms.txt and nowhere a human could read it.
      { label: "raahul@getbindu.com", href: "mailto:raahul@getbindu.com" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function LandingFooter() {
  const stars = useGithubStars();

  return (
    <footer className="lp-foot">
      <TradeOcean />
      <div className="lp-container">
        {/* Ditto's black closer: one big statement, one supporting line, and
            now one action. The page's last word before the link grid. */}
        <div className="lp-foot-closer">
          <h2>File EUDR, CBAM and product passports from one place.</h2>
          {/* The supporting line must not re-list the H2 (it did, twice
              over). One promise, one time-to-value line instead. */}
          <p>
            Set it up once and every shipment leaves with its paperwork done.
            The first dossier is on screen in your first session.
          </p>
          <div className="lp-foot-ctas">
            <DemoCtaLink className="lp-foot-demo" source="footer-closer">
              {DEMO_CTA_LABEL}
            </DemoCtaLink>
            {/* TODO(request-access): a second button sat here labelled "Get
                started" and pointing at /login. There is no self-signup
                (features/auth/entry-flow.tsx), so /login renders a sign-in
                form that closes "Access is provisioned by your workspace
                admin" and every click on it bounced. When the request-access
                form ships, restore a secondary button here pointing at it and
                labelled for what it does, e.g. "Request a workspace". Class
                .lp-foot-start is still in landing.css for it. */}
          </div>
        </div>

        <div className="lp-foot-cols">
          <div className="lp-foot-pitch">
            <Link className="lp-nav-brand" href="/">
              {/* Sizing + colour come from .lp-nav-brand / .lp-foot-pitch
                  .lp-nav-brand in landing.css; the mark is image-only. */}
              <span className="mark">
                <Image src="/bindu-logo.png" alt="Bindu" width={30} height={30} />
              </span>
            </Link>
            <p>
              Upload your shipment documents; Bindu files EUDR, CBAM, and
              product passports from one place. The agent layer underneath is
              open source on GitHub.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.heading}>
              <h2>{col.heading}</h2>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lp-foot-meta">
          <div>
            © 2026 GetBindu · The73 B.V. · KvK 92797911 · Amsterdam, NL · Hosted
            in the EU.
          </div>
          <div className="right">
            <a
              aria-label={githubBadgeLabel(stars)}
              href="https://github.com/GetBindu/Bindu"
              rel="noopener noreferrer"
              target="_blank"
              title={githubRepoLabel}
            >
              {stars ? `GitHub ★ ${stars}` : "GitHub"}
            </a>
            <a
              href="https://x.com/raahulrahl"
              rel="noopener noreferrer"
              target="_blank"
            >
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
