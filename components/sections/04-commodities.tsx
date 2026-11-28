"use client";

import { useState } from "react";

/* Mirrors parallel.ai section 4: "Put the web to work across every industry".
   Tabbed examples, pad 160/80 (a major chapter break). */
const COMMODITIES = [
  {
    tab: "Cocoa",
    reg: "EUDR",
    live: true,
    prompt: "Two containers of cocoa beans from Guayaquil to Antwerp, arriving in June.",
    steps: ["Origin plots mapped", "Supplier proof received", "Plots checked against forest data", "DDS filed to TRACES"],
  },
  {
    tab: "Textiles",
    reg: "Product passports",
    live: true,
    prompt: "Twelve batches of woven cotton from Ningbo to Hamburg, for autumn.",
    steps: ["Batch tagged", "Fibre and dye data requested", "Passport created", "QR label attached"],
  },
  {
    tab: "Steel",
    reg: "CBAM",
    live: false,
    prompt: "Two containers of hot-rolled steel coil from Mumbai to Rotterdam.",
    steps: ["Batch recorded", "Mill asked for emissions data", "Embedded emissions calculated", "Quarterly declaration"],
  },
  {
    tab: "Chemicals",
    reg: "REACH",
    live: false,
    prompt: "One container of industrial solvents from Houston to Antwerp.",
    steps: ["Product declared", "Safety data sheets requested", "Restricted substance check", "Compliance record"],
  },
  {
    tab: "Packaging",
    reg: "PPWR",
    live: false,
    prompt: "Packaged consumer goods from Cai Mep to Valencia, mixed pallets.",
    steps: ["Packaging lines recorded", "Material and weight requested", "Requirements checked", "Packaging record"],
  },
];

export function Commodities() {
  const [i, setI] = useState(0);
  const c = COMMODITIES[i];

  return (
    <section className="section section-major rule-top" id="regulations">
      <div className="rail">
        <h2>One description. Every rule that touches it.</h2>
        <p className="prose-measure mt-4 text-grey-700">
          The same sentence works whatever you move. Bindu reads the goods, the origin and
          the destination, then applies the rules that actually apply.
        </p>
      </div>

      <div className="panel hairline">
        <div role="tablist" aria-label="Commodity" className="flex flex-wrap gap-2">
          {COMMODITIES.map((x, n) => (
            <button
              key={x.tab}
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`chip ${n === i ? "chip-active" : ""}`}
            >
              {x.tab}
            </button>
          ))}
        </div>

        <div className="demo-panel mt-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="status">
                <span className={`status-dot ${c.live ? "" : "status-dot-idle"}`} aria-hidden />
                {c.reg} {c.live ? "live" : "in build"}
              </span>
            </div>
            <p className="text-[16px]">{c.prompt}</p>
            <ol className="mt-5 border-t border-grey-300 pt-4">
              {c.steps.map((s, n) => (
                <li key={s} className="flex items-baseline gap-3 py-1.5">
                  <span className="font-mono text-[12px] text-grey-500">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
