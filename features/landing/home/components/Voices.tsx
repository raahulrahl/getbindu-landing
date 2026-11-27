import { ArrowRight, ArrowUpRight, Coffee, Container, PackageSearch, Shirt, Sprout } from "lucide-react";
import { TESTIMONIALS_PLACEHOLDER as quotes, voices as c } from "../content";
import { ScrollRowButtons, useScrollRow } from "./ScrollRow";

const companyMarks = {
  coffee: Coffee,
  growers: Sprout,
  customs: Container,
  trading: PackageSearch,
  apparel: Shirt,
};

export function Voices() {
  const control = useScrollRow();

  return (
    <section className="band-dark sec vx" id="voices" aria-labelledby="voices-h">
      <div className="container vx-head">
        <h2 id="voices-h" className="t-display-lg" data-own>{c.title}</h2>
        <div className="vx-actions">
          <a className="btn btn-secondary vx-cta" href="#story">
            {c.cta}<ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <p id="voices-note" className="vx-note">{c.placeholder}</p>
        </div>
        <ScrollRowButtons control={control} previous={c.prev} next={c.next} />
      </div>
      <div className="vx-carousel">
        <ul ref={control.row} className="scroll-row vx-row" role="list" aria-label={c.label} aria-describedby="voices-note" tabIndex={0} data-lenis-prevent-horizontal>
          {quotes.map((quote) => {
            const Mark = companyMarks[quote.mark];

            return (
              <li key={quote.name} className="vx-card">
                <figure>
                  <blockquote>“{quote.q}”</blockquote>
                  <figcaption>
                    <strong>{quote.name}</strong>
                    <span>{quote.role} · {quote.country}</span>
                  </figcaption>
                </figure>
                <div className="vx-card-footer">
                  <span className="vx-company"><Mark size={20} strokeWidth={1.7} aria-hidden="true" />{quote.company}</span>
                  {quote.guide && (
                    <a className="vx-guide" href={quote.guide.href}>
                      {quote.guide.label}<ArrowRight size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
