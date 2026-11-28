import { CAL_URL, cta } from "@/lib/content";

/* Mirrors parallel.ai section 19 "Where agents find answers": the closing CTA,
   a large quiet band with the two actions repeated. pad 80/0. */
export function Closing() {
  return (
    <section className="section rule-top pb-0">
      <div className="full flex flex-col items-start gap-6 py-10 xl:py-20">
        <p className="eyebrow">Every proof is a dot</p>
        <h2 className="max-w-[20ch]">Describe a shipment. Bindu handles the rules.</h2>
        <div className="flex flex-wrap gap-3">
          <a href={CAL_URL} className="btn btn-primary">{cta.demo} <span aria-hidden>↗</span></a>
          <a href="/contact" className="btn btn-secondary">{cta.contact}</a>
        </div>
      </div>
    </section>
  );
}
