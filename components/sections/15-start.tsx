import { CAL_URL, cta } from "@/lib/content";

/* Mirrors parallel.ai section 15 "Start building for free": the low-commitment
   entry point, sitting right after pricing. */
export function Start() {
  return (
    <section className="section rule-top">
      <div className="rail">
        <h2>Start with one shipment</h2>
        <p className="prose-measure mt-4 text-grey-700">
          Bring a shipment you already sent. Bindu works out which rules it touched and what
          proof it would have needed, so you can see the whole thing before you commit.
        </p>
      </div>
      <div className="panel hairline">
        <div className="demo-panel flex flex-col items-start gap-5">
          <p className="eyebrow">What the first call covers</p>
          <ul className="w-full">
            {[
              "Which EU rules your goods actually touch",
              "Which of them are live in Bindu today",
              "What your suppliers would be asked for",
              "What a filing would cost you per shipment",
            ].map((t) => (
              <li key={t} className="flex gap-3 border-b border-grey-300 py-3 text-[14px] last:border-0">
                <span className="text-brand" aria-hidden>·</span>{t}
              </li>
            ))}
          </ul>
          <a href={CAL_URL} className="btn btn-primary">{cta.demo} <span aria-hidden>↗</span></a>
        </div>
      </div>
    </section>
  );
}
