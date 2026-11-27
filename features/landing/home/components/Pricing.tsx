import { useRef, useState, type KeyboardEvent } from "react";
import { cta, pricing } from "../content";
import { EudrEstimator, useEstimate } from "./Estimate";
import { BtnLabel, Status } from "./bits";
import { EudrCheck } from "./EudrCheck";
import "../styles/r6-pricing.css";

export function Pricing() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const estimate = useEstimate();
  const tab = pricing.tabs[active] ?? pricing.tabs[0]!;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const count = pricing.tabs.length;
    const next = event.key === "ArrowRight" ? (active + 1) % count
      : event.key === "ArrowLeft" ? (active + count - 1) % count
      : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="band-dark sec r6-pricing" id="pricing" aria-labelledby="pricing-h">
      <div className="container pricing-layout">
        <div className="pricing-copy">
          <p className="pricing-eyebrow">{pricing.eyebrow}</p>
          <h2 id="pricing-h" className="t-display-lg">{pricing.title}</h2>
          <p className="pricing-lead">{pricing.lead}</p>
          <button type="button" className="btn btn-secondary" aria-haspopup="dialog" onClick={event => estimate.show(event.currentTarget)}>
            <BtnLabel arrow={false}>{tab.price ? cta.estimate : "Estimate EUDR costs"}</BtnLabel>
          </button>
          {tab.id === "eudr" && <EudrCheck />}
        </div>
        <div className="pricing-stage">
          <div className="pricing-console">
            <div className="pricing-tabs" role="tablist" aria-label="Pricing by regulation" onKeyDown={onKeyDown}>
              {pricing.tabs.map((item, index) => (
                <button
                  key={item.id}
                  ref={el => { tabRefs.current[index] = el; }}
                  type="button"
                  role="tab"
                  id={`pricing-tab-${item.id}`}
                  aria-controls="pricing-panel"
                  aria-selected={index === active}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div role="tabpanel" id="pricing-panel" aria-labelledby={`pricing-tab-${tab.id}`} tabIndex={0} className="pricing-panel">
              <div className="pricing-tag">
                <h3>{tab.price ? "EUDR cost estimator" : tab.tag}</h3>
                {tab.status === "build" && <Status s="build" />}
              </div>
              {tab.price ? (
                <>
                  <EudrEstimator compact />
                  <details className="pricing-breakdown">
                    <summary>From {tab.price.amount} {tab.price.unit} <span>Price breakdown</span></summary>
                    <dl>
                      {tab.price.rows.map(row => (
                        <div key={row.k}><dt>{row.k}</dt><dd>{row.v}</dd></div>
                      ))}
                    </dl>
                  </details>
                </>
              ) : (
                <>
                  <p className="pricing-request">Pricing on request</p>
                  {tab.desc && <p className="pricing-description">{tab.desc}</p>}
                  {tab.lines && (
                    <ul className="pricing-status-list">
                      {tab.lines.map(item => (
                        <li key={item.t}><span>{item.t}</span>{item.s === "live" ? <span>Live</span> : <Status s="build" />}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
