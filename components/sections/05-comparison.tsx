/* Mirrors parallel.ai section 5, which sets a real generated answer beside a
   worse one. Ours sets the folder you have now beside the record Bindu
   returns, so the comparison is an artefact rather than two bullet lists. */
const FOLDER = [
  "Invoice_final_v3.pdf",
  "WhatsApp Image 2026-03-11 at 09.14.jpeg",
  "RE RE Fwd supplier declaration.eml",
  "product_data (2).xlsx",
  "scan0043.pdf",
  "plots_map_FINAL_updated.xlsx",
];

const RECORD = [
  ["Commodity", "Cocoa beans, 2 containers"],
  ["Producer", "Hacienda Victoria, Los Ríos"],
  ["Plot geolocation", "4 polygons, WGS 84"],
  ["Cleared after 2020-12-31", "No"],
  ["Supplier declaration", "Signed, 2026-03-11"],
  ["Filed", "TRACES, reference issued"],
];

export function Comparison() {
  return (
    <section className="section rule-top">
      <div className="rail">
        <h2>Compliance work, without the spreadsheet</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Most importers run EU compliance out of a folder of email attachments. Bindu
          replaces the folder with one record that knows what it still needs.
        </p>
        <a href="#how" className="btn btn-tertiary mt-6">See how it works</a>
      </div>

      <div className="panel hairline">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="inset flex flex-col p-5">
            <p className="eyebrow mb-4">The folder you have now</p>
            <ul className="flex-1">
              {FOLDER.map((f) => (
                <li
                  key={f}
                  className="truncate border-b border-grey-300 py-2.5 font-mono text-[12px] text-grey-600 last:border-0"
                >
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[12px] text-grey-500">
              6 files. Nothing says which rule they satisfy.
            </p>
          </div>

          <div className="card flex flex-col p-5">
            <p className="eyebrow mb-4">The record Bindu returns</p>
            <dl className="flex-1">
              {RECORD.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-grey-300 py-2.5 last:border-0">
                  <dt className="font-mono text-[12px] text-grey-600">{k}</dt>
                  <dd className="text-right text-[13px]">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 font-mono text-[12px] text-brand">
              Every line traceable to its article.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
