/* Mirrors parallel.ai section 8, whose device is a running event feed rather
   than a grid. Timestamps in mono on the left, newest first, resolving into
   one record at the end. */
const FEED = [
  { t: "now", e: "Compliance record complete, 4 of 4 checks pass", done: true },
  { t: "4s", e: "Packing list parsed, two containers matched to the invoice", done: true },
  { t: "1m", e: "Supplier answered on WhatsApp with the plot polygons", done: true },
  { t: "2m", e: "Reminder sent, plot data still missing", done: true },
  { t: "1h", e: "Material certificate received by email, filed against Article 9", done: true },
  { t: "1h", e: "Request sent to supplier, no login needed", done: true },
];

export function Suppliers() {
  return (
    <section className="section rule-top" id="suppliers">
      <div className="rail">
        <h2>Your suppliers answer where they already are</h2>
        <p className="prose-measure mt-4 text-grey-700">
          No portal, no account, no training. Bindu asks on WhatsApp or by email for the one
          thing still missing, and reads whatever comes back in whatever shape it arrives.
        </p>
      </div>

      <div className="panel hairline">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-grey-300 px-5 py-4">
            <p className="eyebrow">Activity · example shipment</p>
            <span className="status">
              <span className="status-dot" aria-hidden /> Live
            </span>
          </div>
          <ol>
            {FEED.map((f, i) => (
              <li
                key={i}
                className="flex items-baseline gap-4 border-b border-grey-300 px-5 py-3 last:border-0"
              >
                <span className="w-10 shrink-0 font-mono text-[12px] text-grey-500">{f.t}</span>
                <span className="text-[14px] leading-[1.5]">{f.e}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-grey-100 px-5 py-4">
            <span className="font-mono text-[12px] text-grey-600">
              Six messages, three formats, two channels
            </span>
            <span className="font-mono text-[13px]">One compliance record</span>
          </div>
        </div>
      </div>
    </section>
  );
}
