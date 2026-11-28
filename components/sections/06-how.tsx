/* Mirrors parallel.ai section 6 "Designed to compose": a chain of steps that
   hand off to each other, shown as stacked cards. pad 80/80. */
const STEPS = [
  {
    n: "01",
    t: "Describe",
    d: "Tell Bindu about the shipment in plain words. It works out which EU rules apply and what proof each one needs.",
    tag: "Describe",
  },
  {
    n: "02",
    t: "Prove",
    d: "Bindu asks your suppliers by WhatsApp or email, with no login for them, for exactly what is missing. Each document is checked against its rule.",
    tag: "Collect",
  },
  {
    n: "03",
    t: "File",
    d: "Bindu builds one compliance record and files it, then returns the reference number your customs agent asks for.",
    tag: "File",
  },
];

export function How() {
  return (
    <section className="section rule-top" id="how">
      <div className="rail">
        <h2>One sentence in. The proof comes back.</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Three steps, and the second one is the work. Bindu does the chasing so the record
          fills itself in.
        </p>
      </div>

      <div className="panel hairline">
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card flex flex-col p-5">
              <span className="chip w-fit">{s.tag}</span>
              <p className="mt-4 font-mono text-[12px] text-grey-500">{s.n}</p>
              <h3 className="mt-1 text-[20px] leading-[28px]">{s.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-grey-700">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="eyebrow mt-4">Some rules are still in build. See the coverage table below.</p>
      </div>
    </section>
  );
}
