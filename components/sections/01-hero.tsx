import { CAL_URL, cta } from "@/lib/content";

/* Mirrors parallel.ai section 1: left-aligned H1 + sub + two CTAs,
   then a full-width demo panel. pad 41/80. */
export function Hero() {
  return (
    <section className="section pt-10">
      <div className="col-span-full xl:col-span-8">
        <p className="eyebrow mb-4">Bindu · Trade compliance OS</p>
        <h1>
          Describe a shipment.
          <br />
          Bindu handles the rules.
        </h1>
        <p className="prose-measure mt-4 text-grey-700">
          Bindu works out which EU rules apply to your goods, gathers the proof from your
          suppliers and files it, whether you import six containers a year or six hundred.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={CAL_URL} className="btn btn-primary">{cta.demo} <span aria-hidden>↗</span></a>
          <a href="#pricing" className="btn btn-tertiary">{cta.estimate}</a>
        </div>
      </div>

      <div className="full mt-8 xl:mt-10">
        <div className="demo-panel">
          <div className="mx-auto w-full max-w-[720px]">
            <div className="card p-5">
              <p className="eyebrow mb-3">Describe</p>
              <p className="text-[16px]">
                Two containers of cocoa beans from Ecuador to Antwerp, arriving in June.
              </p>
            </div>

            <div className="my-3 flex justify-center text-grey-500" aria-hidden>↓</div>

            <div className="card p-5">
              <p className="eyebrow mb-3">Rules that apply</p>
              <div className="flex flex-wrap gap-2">
                <span className="chip chip-active">EUDR</span>
                <span className="chip">Supplier declaration</span>
                <span className="chip">Plot geolocation</span>
                <span className="chip">Customs reference</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-grey-300 pt-3">
                <span className="status">
                  <span className="status-dot" aria-hidden /> 4 of 4 checks pass
                </span>
                <span className="font-mono text-[13px] text-grey-700">
                  DDS filed to TRACES
                </span>
              </div>
            </div>
          </div>
          <p className="eyebrow mt-6 text-center">
            Illustration. Example shipment, not a real customer.
          </p>
        </div>
      </div>
    </section>
  );
}
