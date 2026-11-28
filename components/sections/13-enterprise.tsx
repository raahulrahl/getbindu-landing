/* Mirrors parallel.ai section 13 "Built for enterprise, secure by design".
   pad 160/80, the third and last chapter break. Set as a spec sheet of
   hairline rows rather than cards: the claims are facts, not features. */
const POINTS: [string, string][] = [
  ["Data ownership", "Supplier documents and plot coordinates are yours. We do not sell them, pool them, or train on them."],
  ["Hosting", "Processed and stored in the EU."],
  ["Audit trail", "Every change to a record is logged with who changed it and when."],
  ["Traceability", "Each rule in the engine links to the article it came from."],
  ["Export", "Take the whole record out as PDF or structured data at any time."],
];

export function Enterprise() {
  return (
    <section className="section section-major rule-top">
      <div className="rail">
        <p className="eyebrow">Trust</p>
        <h2 className="mt-2">Built for the people who get audited</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Compliance software that cannot show its working is just another spreadsheet.
          Everything Bindu files traces back to the document and the article behind it.
        </p>
      </div>

      <div className="panel hairline">
        <dl className="border-t border-grey-300">
          {POINTS.map(([k, v]) => (
            <div key={k} className="grid gap-2 border-b border-grey-300 py-5 md:grid-cols-3 md:gap-6">
              <dt className="chrome text-grey-600">{k}</dt>
              <dd className="text-[14px] leading-[1.6] md:col-span-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
