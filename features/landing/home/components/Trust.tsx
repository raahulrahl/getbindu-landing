import { Archive, Cloud, FileCheck, FileText, Layers2, Link2, Mail, MessageCircle, ShieldCheck } from "lucide-react";

const safeguards = [
  {
    label: "EU hosting",
    href: "/privacy",
    mark: <><Cloud size={42} strokeWidth={1.65} /><span className="trust-mark-type">EU</span></>,
  },
  {
    label: "Workspace isolation",
    href: "/privacy",
    mark: <Layers2 size={53} strokeWidth={1.55} />,
  },
  {
    label: "Encryption in transit",
    href: "/privacy",
    mark: <ShieldCheck size={52} strokeWidth={1.6} />,
  },
  {
    label: "Source-linked evidence",
    href: "#story",
    mark: <span className="trust-evidence-mark"><FileText size={49} strokeWidth={1.5} /><Link2 size={26} strokeWidth={1.9} /></span>,
  },
  {
    label: "5-year EUDR retention",
    href: "/eudr",
    mark: <><Archive size={39} strokeWidth={1.65} /><span className="trust-mark-type">5Y</span></>,
  },
];

export function Trust() {
  return (
    <section className="band-dark sec" id="trust" aria-labelledby="trust-h">
      <div className="container trust-layout">
        <div className="trust-intro">
          <p className="trust-eyebrow">Trust</p>
          <h2 id="trust-h" className="t-display-lg">Protected workspaces, traceable filings</h2>
          <p className="trust-lead">
            Each filing links back to its supplier evidence. Our <a href="/privacy">privacy policy</a>{" "}
            explains how we protect the records in your workspace.
          </p>
        </div>
      </div>
      <div className="container trust-layout trust-marks-row">
        <ul className="trust-list" role="list">
          {safeguards.map(({ mark, label, href }) => (
            <li key={label}>
              <a href={href}>
                <span className="trust-mark" aria-hidden="true">{mark}</span>
                <span className="trust-mark-label">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Connections() {
  return (
    <section className="band-dark sec" id="connections" aria-labelledby="connections-h">
      <div className="container connections-layout">
        <h2 id="connections-h" className="t-display-lg">Where Bindu connects</h2>
        <dl className="connection-rows">
          <div>
            <dt>EUDR filing</dt>
            <dd><a href="/eudr"><FileCheck size={22} aria-hidden="true" /> EU TRACES</a></dd>
          </div>
          <div>
            <dt>Supplier outreach</dt>
            <dd>
              <span><MessageCircle size={22} aria-hidden="true" /> WhatsApp</span>
              <span><Mail size={22} aria-hidden="true" /> Email</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
