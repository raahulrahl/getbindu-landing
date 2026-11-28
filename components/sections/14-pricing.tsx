import { PRICES, eur, CAL_URL, cta } from "@/lib/content";

/* Mirrors parallel.ai section 14 "Pay for answers, not tokens": the pricing
   section. Every figure is interpolated from PRICES, never retyped. */
const TIERS = [
  {
    code: "EUDR",
    live: true,
    head: `${eur(PRICES.eudrFiling)} per filing`,
    sub: "Plus the retention term you choose at filing.",
    rows: [
      ["Due diligence statement", eur(PRICES.eudrFiling)],
      ["5-year retention", eur(PRICES.eudrRetain5)],
      ["10-year retention", eur(PRICES.eudrRetain10)],
    ],
  },
  {
    code: "DPP",
    live: true,
    head: `${eur(PRICES.dppUnit)} per unit`,
    sub: "Two payers: the brand holds the passport, the printer pays per label.",
    rows: [
      ["Brand workspace", `${eur(PRICES.dppQuarter)} / quarter`],
      ["Printed label", `${eur(PRICES.dppUnit)} / unit`],
    ],
  },
  {
    code: "CBAM",
    live: false,
    head: `${eur(PRICES.cbamQuarter)} per quarter`,
    sub: "In build. Priced here so you can plan for it.",
    rows: [
      ["Quarterly run", eur(PRICES.cbamQuarter)],
      ["Per declaration", eur(PRICES.cbamFiling)],
    ],
  },
];

export function Pricing() {
  return (
    <section className="section rule-top" id="pricing">
      <div className="rail">
        <h2>Pay per filing, not per seat</h2>
        <p className="prose-measure mt-4 text-grey-700">
          A filing costs what it costs whether you send six containers a year or six hundred.
          The workspace is {eur(PRICES.workspaceMonth)} a month on top, for every regulation.
        </p>
        <a href={CAL_URL} className="btn btn-primary mt-6">{cta.demo} <span aria-hidden>↗</span></a>
      </div>

      <div className="panel hairline">
        <div className="grid gap-4 xl:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.code} className="card flex flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[14px]">{t.code}</span>
                <span className="status">
                  <span className={`status-dot ${t.live ? "" : "status-dot-idle"}`} aria-hidden />
                  {t.live ? "Live" : "In build"}
                </span>
              </div>
              <p className="mt-4 text-[26px] leading-[32px] font-medium">{t.head}</p>
              <p className="mt-2 text-[14px] leading-[1.5] text-grey-700">{t.sub}</p>
              <table className="table mt-4">
                <tbody>
                  {t.rows.map(([k, v]) => (
                    <tr key={k}>
                      <td className="!px-0">{k}</td>
                      <td className="num !px-0 text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <p className="eyebrow mt-4">
          Prices exclude VAT. Workspace {eur(PRICES.workspaceMonth)} per month applies to every filer.
        </p>
      </div>
    </section>
  );
}
