/**
 * Every word on the page, and every figure.
 *
 * Rules carried over from the previous Bindu site:
 *  - No invented numbers. Prices live in PRICES and are interpolated, never
 *    retyped in prose.
 *  - Every regulation fact cites a public primary source.
 *  - Nothing claims to be live that is not. See REGULATIONS.status.
 *  - No em dashes, no AI-smell vocabulary.
 */

export const CAL_URL = "https://cal.com/getbindu/15min";

export const cta = {
  demo: "Book a 15-minute demo",
  estimate: "Estimate your cost",
  docs: "Read the docs",
  contact: "Contact sales",
};

/** Raw figures in euros. The only place a price is authored. */
export const PRICES = {
  eudrFiling: 199,
  eudrRetain5: 50,
  eudrRetain10: 100,
  cbamQuarter: 999,
  cbamFiling: 199,
  dppQuarter: 999,
  dppUnit: 0.59,
  ppwrShipment: 299,
  workspaceMonth: 20,
} as const;

export function eur(amount: number, locale = "en-GB"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export type RegStatus = "live" | "build";

export const REGULATIONS: {
  code: string;
  name: string;
  status: RegStatus;
  blurb: string;
  source: string;
}[] = [
  {
    code: "EUDR",
    name: "Deforestation Regulation",
    status: "live",
    blurb: "Plot geolocation, supplier proof, and the due diligence statement filed to TRACES.",
    source: "https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en",
  },
  {
    code: "DPP",
    name: "Textile product passports",
    status: "live",
    blurb: "Product data per batch, a passport, and a QR label that links to it.",
    source: "https://commission.europa.eu/energy-climate-change-environment/standards-tools-and-labels/products-labelling-rules-and-requirements/ecodesign-sustainable-products-regulation_en",
  },
  {
    code: "CBAM",
    name: "Carbon Border Adjustment",
    status: "build",
    blurb: "Embedded emissions collected from the mill, then the quarterly declaration.",
    source: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en",
  },
  {
    code: "REACH",
    name: "Chemical restrictions",
    status: "build",
    blurb: "Each substance checked against the EU restricted substances list.",
    source: "https://echa.europa.eu/regulations/reach/understanding-reach",
  },
  {
    code: "PPWR",
    name: "Packaging Regulation",
    status: "build",
    blurb: "Material and weight per pack, checked against the EU packaging rules.",
    source: "https://environment.ec.europa.eu/topics/waste-and-recycling/packaging-waste_en",
  },
  {
    code: "BATT",
    name: "Battery passports",
    status: "build",
    blurb: "Cell chemistry, carbon footprint and recycled content per battery.",
    source: "https://environment.ec.europa.eu/topics/waste-and-recycling/batteries-and-accumulators_en",
  },
];

/** EUDR application dates, per the European Commission. */
export const EUDR_DATES = {
  largeMedium: "30 December 2026",
  microSmall: "30 June 2027",
  cutoff: "31 December 2020",
};
