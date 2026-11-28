/* Mirrors parallel.ai sections 16 and 17: two short "available everywhere you
   build" strips, 103px and 118px, pad 80/0. */
const FILES_TO = ["EU TRACES", "EU Customs (reference)", "National authorities"];
const WORKS_WITH = ["WhatsApp", "Email", "CSV and Excel", "Customs agents", "ERP export", "REST API"];

function Strip({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="full flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-8">
      <p className="eyebrow shrink-0 md:w-40">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="chip chip-active">{i}</span>
        ))}
      </div>
    </div>
  );
}

export function Strips() {
  return (
    <section className="section rule-top pb-0">
      <Strip label="Files into" items={FILES_TO} />
      <div className="full h-px bg-grey-300" aria-hidden />
      <Strip label="Works with" items={WORKS_WITH} />
    </section>
  );
}
