import { REGULATIONS } from "@/lib/content";

/* Mirrors parallel.ai section 9 "Everything your agent needs to work with the
   web": the product grid. pad 80/0. Ours is honest about what is not live. */
export function Coverage() {
  return (
    <section className="section rule-top pb-0">
      <div className="full">
        <p className="eyebrow">Coverage</p>
        <h2 className="mt-2">Every rule an EU importer meets</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Two are live today. The rest are in build, and we say so on the page rather than in
          a footnote.
        </p>
      </div>

      <div className="full mt-8 grid gap-px overflow-hidden rounded-ui border border-grey-300 bg-grey-300 md:grid-cols-2 xl:grid-cols-3">
        {REGULATIONS.map((r) => (
          <div key={r.code} className="flex flex-col bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[14px]">{r.code}</span>
              <span className="status">
                <span className={`status-dot ${r.status === "live" ? "" : "status-dot-idle"}`} aria-hidden />
                {r.status === "live" ? "Live" : "In build"}
              </span>
            </div>
            <h3 className="mt-3 text-[18px] leading-[24px]">{r.name}</h3>
            <p className="mt-2 flex-1 text-[14px] leading-[1.5] text-grey-700">{r.blurb}</p>
            <a
              href={r.source}
              target="_blank"
              rel="noreferrer"
              className="chrome mt-4 text-cobalt-ink underline"
            >
              Primary source ↗
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
