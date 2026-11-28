/* Mirrors parallel.ai section 10 "Retrieval, built from the ground up":
   three named layers of the system. pad 120/80. */
const LAYERS = [
  {
    t: "Rules engine",
    d: "Each regulation is encoded as the facts it demands, with the article that demands them. A shipment description resolves to a list of required proofs.",
    items: ["Goods to rule mapping", "Required evidence per article", "Deadline and scope logic"],
  },
  {
    t: "Supplier collection",
    d: "Requests go out on the channel the supplier already uses, and replies are parsed whatever format they arrive in.",
    items: ["WhatsApp and email", "No supplier login", "Automatic follow-up on gaps"],
  },
  {
    t: "Filing",
    d: "One record per shipment, validated against its rule, then submitted to the EU system that receives it.",
    items: ["Validation before submission", "TRACES submission", "Reference returned to customs"],
  },
];

export function Architecture() {
  return (
    <section className="section rule-top" style={{ paddingTop: "var(--space-120)" }}>
      <div className="rail">
        <h2>Built as three layers, not one black box</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Each layer is inspectable on its own. You can see which rule fired, what was asked
          for, and what was sent.
        </p>
      </div>

      <div className="panel hairline">
        <div className="grid gap-4 xl:grid-cols-3">
          {LAYERS.map((l, n) => (
            <div key={l.t} className="card p-5">
              <p className="font-mono text-[12px] text-grey-500">{String(n + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-[20px] leading-[28px]">{l.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-grey-700">{l.d}</p>
              <ul className="mt-4 border-t border-grey-300 pt-3">
                {l.items.map((i) => (
                  <li key={i} className="py-1 font-mono text-[12px] text-grey-600">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
