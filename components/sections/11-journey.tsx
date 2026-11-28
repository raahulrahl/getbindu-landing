/* Mirrors parallel.ai section 11: the page's biggest proof visual, at a 160
   chapter break. A horizontal timeline rail, not a grid of boxes, because the
   claim is that proof is collected along the way. */
const MILESTONES = [
  { t: "Origin plots mapped", d: "Each farm plot recorded with its geolocation." },
  { t: "Supplier proof received", d: "The supplier sends the plot data and its proof." },
  { t: "Checked against forest data", d: "Land cleared after 31 December 2020 fails." },
  { t: "DDS filed to TRACES", d: "The statement goes into the EU's own system." },
  { t: "Reference sent", d: "The TRACES reference goes to the customs agent." },
  { t: "Customs clears on arrival", d: "Customs decides. Bindu does not control this step." },
];

export function Journey() {
  return (
    <section className="section section-major rule-top">
      <div className="full">
        <p className="eyebrow">Example shipment</p>
        <h2 className="mt-2">Follow one shipment from origin to customs</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Two containers of cocoa beans, Guayaquil to Antwerp. The proof is collected along
          the way, not scrambled together at the end.
        </p>
      </div>

      <div className="full mt-8">
        <div className="demo-panel">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] text-grey-600">Guayaquil</span>
            <span className="font-mono text-[12px] text-grey-600">Antwerp</span>
          </div>

          <ol className="mt-4 grid gap-y-8 md:grid-cols-3 xl:grid-cols-6">
            {MILESTONES.map((m, n) => {
              const last = n === MILESTONES.length - 1;
              return (
                <li key={m.t} className="relative pr-4">
                  {/* the rail */}
                  <div className="flex items-center" aria-hidden>
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        last ? "bg-grey-400" : "bg-brand"
                      }`}
                    />
                    <span className="h-px flex-1 bg-grey-400" />
                  </div>
                  <p className="mt-3 font-mono text-[12px] text-grey-500">
                    {String(n + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-[15px] leading-[20px] font-medium">{m.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-grey-700">{m.d}</p>
                </li>
              );
            })}
          </ol>

          <p className="eyebrow mt-8">Illustration. Example shipment, not a real customer.</p>
        </div>
      </div>
    </section>
  );
}
