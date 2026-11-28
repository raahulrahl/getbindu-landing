import { EUDR_DATES, REGULATIONS } from "@/lib/content";

const eudrSource = REGULATIONS[0].source;

/* Mirrors parallel.ai section 3: a short cited-proof strip (pad 48/0).
   Theirs cites a third-party benchmark. Ours cites the Commission, which is
   the only external authority that matters for this product. */
export function Deadline() {
  return (
    <section className="section pt-6 pb-0">
      <div className="full flex flex-col gap-4 border-y border-grey-300 py-5 md:flex-row md:items-center md:gap-8">
        <p className="eyebrow shrink-0">Dates set by</p>
        <p className="flex-1 text-[16px]">
          EUDR applies from <strong className="font-medium">{EUDR_DATES.largeMedium}</strong> for
          medium and large companies, and{" "}
          <strong className="font-medium">{EUDR_DATES.microSmall}</strong> for most micro and
          small ones.
        </p>
        <a
          href={eudrSource}
          target="_blank"
          rel="noreferrer"
          className="chrome shrink-0 text-cobalt-ink underline"
        >
          European Commission ↗
        </a>
      </div>
    </section>
  );
}
