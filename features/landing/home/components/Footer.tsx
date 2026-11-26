import { footer, footerRoles } from "../content";
import { Logo } from "./bits";
import { FOOTER_PAGES, GUIDE_AND_LEGAL } from "../links";

/* round 3: the sub-pages get their own two columns after the existing ones */
const cols = [...footer.cols, { h: "Platform", l: FOOTER_PAGES }, { h: "Guides and legal", l: GUIDE_AND_LEGAL }];

export function Footer() {
  return (
    <footer className="foot band-dark" role="contentinfo">
      <div className="container foot-in">
        <div className="foot-brand">
          <span className="foot-mark"><Logo size={40} /><span>Bindu</span></span>
          <p className="t-body-sm t-muted">{footer.line}</p>
        </div>
        {cols.map((c) => (
          <div key={c.h} className="foot-col">
            <p className="bh-eyebrow">{c.h}</p>
            <ul>{c.l.map((l) => <li key={l.t}><a href={l.u} {...(l.u.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{l.t}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="container foot-roles-wrap">
        <p className="foot-roles t-body-sm t-muted">{footerRoles.lead}{" "}{footerRoles.items.map((r, i) => <span key={r.t}>{i > 0 && <span aria-hidden="true"> · </span>}<a href={r.href}>{r.t}</a></span>)}</p>
      </div>
      <div className="container"><hr className="rule" /><p className="t-caption t-muted foot-legal">{footer.legal}</p></div>
    </footer>
  );
}
