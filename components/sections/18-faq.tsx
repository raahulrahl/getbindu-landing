import { EUDR_DATES, PRICES, eur } from "@/lib/content";

/* Mirrors parallel.ai section 18: the FAQ accordion, pad 120/120.
   Native <details> so it works without JavaScript. */
const FAQ: [string, string][] = [
  [
    "What does Bindu do?",
    "Bindu is trade compliance software for EU import and export. You describe a shipment in plain words, Bindu works out which EU rules apply, collects the proof each rule needs from your suppliers, and files the result.",
  ],
  [
    "Which regulations are live today?",
    "EUDR and textile product passports are live. CBAM, REACH, PPWR and battery passports are in build. The coverage table above says which is which, and we update it rather than hiding it.",
  ],
  [
    "When does EUDR apply to me?",
    `${EUDR_DATES.largeMedium} for medium and large companies, and ${EUDR_DATES.microSmall} for most micro and small ones. The dates are set by the European Commission and linked from this page.`,
  ],
  [
    "Do my suppliers need an account?",
    "No. Bindu asks them on WhatsApp or by email and reads whatever they send back, including photos, PDFs and spreadsheets.",
  ],
  [
    "What does it cost?",
    `EUDR filings are ${eur(PRICES.eudrFiling)} each plus the retention term you choose. Product passports are ${eur(PRICES.dppUnit)} per unit. A workspace is ${eur(PRICES.workspaceMonth)} per month on top, whatever you file.`,
  ],
  [
    "Is this legal advice?",
    "No. Bindu applies published rules to the data you and your suppliers give it, and shows the article behind every check so you can verify it. It does not replace your own legal or customs advice.",
  ],
];

export function Faq() {
  return (
    <section
      className="section rule-top"
      style={{ paddingTop: "var(--space-120)", paddingBottom: "var(--space-120)" }}
    >
      <div className="rail">
        <h2>FAQs</h2>
      </div>
      <div className="panel hairline">
        <div className="border-t border-grey-300">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-b border-grey-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[16px] [&::-webkit-details-marker]:hidden">
                {q}
                <span className="shrink-0 font-mono text-[13px] text-grey-600 group-open:hidden" aria-hidden>+</span>
                <span className="hidden shrink-0 font-mono text-[13px] text-grey-600 group-open:inline" aria-hidden>−</span>
              </summary>
              <p className="prose-measure pb-5 text-[14px] leading-[1.6] text-grey-700">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
