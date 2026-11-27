import { footer } from "../content";
import { FOOTER_PAGES, INTEGRATIONS_ANCHOR, LEGAL_LINKS, NAV_BLOG } from "../links";
import { Logo } from "./bits";

type FooterLink = { t: string; u: string };

/* The directory row follows fabric.vc: one lead column of large links, then quieter lists.
   The last column holds two groups split by a gap, as the reference separates its legal
   links from its social ones. */
const columns: { label: string; lead?: boolean; groups: FooterLink[][] }[] = [
  { label: "Explore", lead: true, groups: [[...footer.explore, { t: "Integrations", u: `#${INTEGRATIONS_ANCHOR}` }, NAV_BLOG]] },
  { label: "Regulations", groups: [FOOTER_PAGES] },
  { label: "Company", groups: [footer.company, LEGAL_LINKS, footer.social] },
];

const outbound = (u: string) => (u.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {});

export function Footer() {
  return (
    <footer className="foot" role="contentinfo">
      <div className="container foot-layout">
        <div className="foot-in">
          <div className="foot-brand">
            <a className="foot-mark" href="#top" aria-label="Bindu, back to top">
              <Logo size={42} />
              <span>Bindu</span>
            </a>
          </div>
          {columns.map(({ label, lead, groups }) => (
            <nav key={label} className={lead ? "foot-col foot-col-lead" : "foot-col"} aria-label={label}>
              <p className="foot-heading">{label}</p>
              {groups.map((links, group) => (
                <ul key={group}>
                  {links.map((link) => (
                    <li key={link.t}>
                      <a href={link.u} {...outbound(link.u)}>
                        {link.t}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </nav>
          ))}
        </div>
        {/* The reference's second row: the registered office, the fine print that says who operates
            the site, then, where it carries its EU-funding note, where the data lives. The cell
            between them is a spacer, so the row keeps its four columns and their rules. */}
        <div className="foot-mid">
          <address className="foot-office">
            <span>{footer.office.entity}</span>
            {footer.office.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className="foot-fine">
            {footer.operator} <a href="/privacy">Privacy Policy</a>
          </p>
          <div className="foot-spacer" aria-hidden="true" />
          <p className="foot-residency">{footer.residency}</p>
        </div>
        <div className="foot-end">
          <p className="foot-made">{footer.made}</p>
          <p className="foot-motto">
            {footer.motto.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <div className="foot-spacer" aria-hidden="true" />
          <p className="foot-copyright">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
