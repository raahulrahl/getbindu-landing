/* Mirrors parallel.ai section 2 (logo wall, pad 0/0): a low-profile strip, not
   a row of boxes. Bindu has no customer logos yet, so this names the official
   systems it files into. Swap in logos here when there are logos to show. */
const SYSTEMS = [
  { name: "EU TRACES", note: "Due diligence statements filed here" },
  { name: "EUR-Lex", note: "Every rule cites its article" },
  { name: "EU Customs", note: "Reference numbers for your agent" },
  { name: "ECHA", note: "Restricted substances list" },
];

export function Trusted() {
  return (
    <section className="section py-0">
      <div className="full">
        <h2 className="sr-only">The systems Bindu works with</h2>
        <p className="eyebrow">Built on the EU&apos;s own systems</p>
      </div>
      <div className="full mt-6 flex flex-col border-y border-grey-300 md:flex-row">
        {SYSTEMS.map((s, i) => (
          <div
            key={s.name}
            className={`flex-1 py-5 md:px-6 md:first:pl-0 ${
              i > 0 ? "border-t border-grey-300 md:border-t-0 md:border-l" : ""
            }`}
          >
            <p className="font-mono text-[14px]">{s.name}</p>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-grey-600">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
