/* Mirrors parallel.ai section 12, the testimonial carousel: the one place the
   page speaks in the reader's voice, at display size. We have no customers to
   quote, so these are the objections importers actually raise. They are set as
   large statements with a plain answer, not as boxed cards.
   Replace with real quotes once there are customers who will be named. */
const PAINS = [
  {
    q: "My suppliers will not send the data I need.",
    a: "Bindu asks them on WhatsApp and by email for exactly what is missing, then asks again when it does not arrive.",
  },
  {
    q: "I do not know which EU rules apply to my goods.",
    a: "Describe the goods and Bindu tells you which rules apply, and which article asks for what.",
  },
  {
    q: "What if my shipment is held at customs?",
    a: "Bindu files and returns the reference customs asks for. For EUDR that is live today.",
  },
];

export function Pains() {
  return (
    <section className="section rule-top">
      <div className="full">
        <p className="eyebrow">Sound familiar?</p>
      </div>

      <div className="full mt-2 border-t border-grey-300">
        {PAINS.map((p, i) => (
          <div
            key={p.q}
            className="grid gap-4 border-b border-grey-300 py-8 md:grid-cols-8 xl:grid-cols-12"
          >
            <span className="font-mono text-[12px] text-grey-500 md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[22px] leading-[30px] md:col-span-4 xl:col-span-6 xl:text-[26px] xl:leading-[32px]">
              {p.q}
            </h3>
            <p className="text-[14px] leading-[1.6] text-grey-700 md:col-span-3 xl:col-span-5">
              {p.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
