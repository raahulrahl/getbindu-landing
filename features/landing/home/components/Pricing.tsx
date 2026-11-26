import { Odometer } from "./Odometer";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cta, pricing } from "../content";
import { useEstimate } from "./Estimate";
import { BtnLabel, Status } from "./bits";
import { EudrCheck } from "./EudrCheck";
import "../styles/r6-pricing.css";

/* Round 6, item 1: minimal pricing. One tab per regulation (role=tablist, arrow keys, Home and End). Only EUDR has a
   published price; the other tabs show "Pricing on request" and their In build chip. The breakdown is a dl so screen
   readers get label and price pairs. Estimate opens the popup.
   Round 15 item 8 (revised): centred head, the tabs as a pill toggle with a sliding indicator, then one card split into two
   equal halves on one top line: the receipt (price, ledger) and what is included (checklist, Estimate pill, trust notes).
   Round 17: the border beam is gone; a hairline card, numbers in mono, and the guide passes beside the price. */
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const TRUST = ["Per filing", "No seats", "Excl. VAT", "EU-hosted"];

export function Pricing() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sec = useRef<HTMLElement>(null);
  const estimate = useEstimate();
  const tab = pricing.tabs[active];
  const covers = pricing.side.covers.items;
  // the one included-list per tab: the EUDR filing's own lines (from the site), the DPP groups, or the one-line description
  const included: { t: string; s?: string }[] = tab!.price
    ? [covers[0], covers[1], covers[3]].map((c) => ({ t: cap(c!.t) }))
    : tab!.lines ? tab!.lines.map((l) => ({ t: l.t, s: l.s })) : tab!.desc ? [{ t: tab!.desc }] : [];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = pricing.tabs.length - 1;
    const next = e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section ref={sec} className="band-dark sec r6-pricing" id="pricing" aria-labelledby="pricing-h" data-guide-anchor="pricing" data-guide-side="r">
      <div className="container">
        <div className="r6-head">
          <h2 id="pricing-h" className="t-display-lg">{pricing.title}</h2>
          <p className="t-body-lg t-soft">{pricing.lead}</p>
        </div>

        <div className="seg-track r6-tabs">
          <div className="seg-in" role="tablist" aria-label="Pricing by regulation" onKeyDown={onKeyDown}
            style={{ "--n": pricing.tabs.length, "--i": active } as CSSProperties}>
            <span className="seg-ind" aria-hidden="true" />
            {pricing.tabs.map((t, i) => {
              return (
                <button
                  key={t.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`pricing-tab-${t.id}`}
                  aria-selected={i === active}
                  aria-controls="pricing-panel"
                  tabIndex={i === active ? 0 : -1}
                  className={`seg-opt${i === active ? " is-on" : ""}`}
                  onClick={() => setActive(i)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="r6-cardwrap">
          <div role="tabpanel" id="pricing-panel" aria-labelledby={`pricing-tab-${tab!.id}`} tabIndex={0} className="r6-card" key={tab!.id}>
            <div className="r6-panel r6-left">
              <div className="r6-tag">
                <p className="bh-eyebrow">{tab!.tag ?? tab!.label}</p>
                {tab!.status === "build" && <Status s={tab!.status} />}
              </div>
              {tab!.price ? (
                <>
                  <p className="r6-price"><Odometer key={tab!.id} value={tab!.price.amount} /></p>
                  <p className="r6-unit t-body-sm t-soft">{tab!.price.unit}</p>
                  <p className="r6-line t-body-sm t-muted">{tab!.price.line}</p>
                  <dl className="r6-rows">
                    {tab!.price.rows.map((r) => (
                      <div key={r.k} className="r6-row">
                        <dt>{r.k}</dt>
                        <dd>{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <p key={tab!.id} className="r6-request r6-fade">Pricing on request</p>
              )}
            </div>
            <div className="r6-right">
              <p className="bh-eyebrow r6-inc-h">What is included</p>
              <ul className="r6-inc">
                {included.map((l) => (
                  <li key={l.t}>
                    <span>{l.t}</span>
                    {l.s === "live" ? <span className="r6-live">Live</span> : l.s ? <Status s="build" /> : null}
                  </li>
                ))}
              </ul>
              <div className="r6-cta">
                <button type="button" className="btn btn-secondary" aria-haspopup="dialog" onClick={(e) => estimate.show(e.currentTarget)}><BtnLabel arrow={false}>{cta.estimate}</BtnLabel></button>
                {tab!.id === "eudr" && <EudrCheck />}
              </div>
              <ul className="r6-trust" aria-label="Pricing notes">
                {TRUST.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
