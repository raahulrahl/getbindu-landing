/* All words on the page. Facts only from the brief and bindu-design (prices, dates, statuses).
   Anything not confirmed is marked PLACEHOLDER or "Answer from Raahul". Illustrations are labelled in the UI. */

import { CAL_URL } from "./config";

export const DEMO_URL = CAL_URL;
export const EUDR_SOURCE = "https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en";

/* round 13, item 9: "Book a 15-minute demo" is the main CTA (nav, hero, finale, sub-page links). "Estimate your cost" is
   secondary and appears only in pricing and the calculator popup. */
export const cta = {
  estimate: "Estimate your cost",
  demo: "Book a 15-minute demo",
  popupBook: "Book a demo",
  demoShort: "Book a demo",
};

export const nav = {
  theme: { toDark: "Switch to dark theme", toLight: "Switch to light theme" },
  links: [
    { t: "How it works", href: "#story" },
    { t: "Pricing", href: "#pricing" },
    { t: "FAQ", href: "#faq" },
  ],
  regulations: "Regulations",
  menu: "Menu",
  close: "Close",
};

/* the intro (components/Intro.tsx): the dot line, then one mono label, then the hand-off to the page */
export const intro = {
  dot: "Every proof is a dot.",
  tag: "Bindu, trade compliance OS",
};

export const hero = {
  title: ["Ship it.", "Trace it.", "Bindu."],   /* r65-5: Austin's words */
  sub: "Bindu works out which EU rules apply to your goods, gathers the proof from your suppliers and files it. Every line traces back to the supplier document behind it.",
  mono: "Six containers a year or six hundred.",
  artLabel: "Illustration: every proof is a dot. Together they make the filing.",
  pause: "Pause animation",
  play: "Play animation",
};

/* Round 6, item 2: "Sound familiar?" Three importer lines, each with one plain answer. Not quotes: no footnote. */
/* Round 6 (follow-up): the EUDR check tool, kept on the Pricing EUDR tab. The deadline list and the lead moved to
   "Sound familiar?" row 02 and row 03, so only the audience line, the button and the source link remain here. */
export const applies = {
  eyebrow: "For EU importers without a compliance team",
  source: "Dates: European Commission",
  check: "Check if EUDR applies to you",
};

/* the "Check if EUDR applies to you" mini-check: illustrative only */
export const check = {
  title: "Simplified EUDR check",
  label: "Illustration: a simplified check, not legal advice.",
  q1: "What do you bring into the EU?",
  goods: ["Coffee", "Cocoa", "Soy", "Palm oil", "Rubber", "Wood", "Cattle", "None of these"],
  q2: "How big is your company, by the EU's size rules (staff, turnover, balance sheet)?",
  sizes: [
    { k: "small", t: "Micro or small" },
    { k: "large", t: "Medium or large" },
    { k: "unsure", t: "Not sure" },
  ],
  resultCovered: "EUDR likely covers what you bring in.",
  resultNot: "EUDR probably doesn't cover these goods.",
  resultNotMore: "Other EU rules might. Bindu's checks for those are in build.",
  dateSmall: "Your date is most likely 30 Jun 2027, the date for most micro and small companies.",
  dateLarge: "Your date is most likely 30 Dec 2026, the date for medium and large companies.",
  dateUnsure: "The date depends on your company size: 30 Dec 2026 for medium and large companies, 30 Jun 2027 for most micro and small ones.",
  next: "A demo is the quickest way to check your real shipments.",
  close: "Close",
};

export const pains = {
  eyebrow: "Sound familiar?",
  items: [
    { q: "My suppliers won't send the data I need.", a: "Bindu asks your suppliers over WhatsApp and email for exactly what's missing." },
    { q: "I don't know which EU rules apply to my goods.", a: "Describe your goods and Bindu tells you which rules apply." },
    { q: "What if my shipment gets held at customs?", a: "Bindu files and returns the reference customs asks for, for EUDR today." },
  ],
};

/* Round 13, item 6: one shipment, five regulation stories. Every story runs along the same example route (Guayaquil to
   Antwerp) with six milestones, so the animation is the same for each. live: false means the last milestone says
   "coming" and the dots do not turn into a filing. Status chips follow the status list (EUDR and textile passports Live). */
export const journey = {
  eyebrow: "Example shipment",
  title: "Follow one shipment from origin to customs",
  illus: "Illustration",
  caption: "Example shipment, not a real customer. Map simplified, not to scale. Each story has its own illustrative route.",
  stories: [
    {
      id: "eudr", ask: { at: 1, q: "Which supplier hasn't sent the plot coordinates?", a: "Co-op B has sent every plot. Trader C is still missing some." }, tab: "EUDR", live: true,
      chips: [{ text: "EUDR Live", live: true }],
      sub: "2 containers of cocoa beans, Guayaquil (Ecuador) to Antwerp. The proof is collected along the way, not at the end.",
      milestones: [
        { label: "Origin plots mapped", detail: "Each farm plot is recorded with its geolocation." },
        { label: "Supplier proof received", detail: "The supplier sends the plot data and its proof." },
        { label: "Plots checked against forest data", detail: "Land cleared after 31 December 2020 fails the check." },
        { label: "DDS filed to TRACES", detail: "The due diligence statement goes into the EU's TRACES system." },
        { label: "Reference number sent", detail: "The TRACES reference number goes to the customs agent." },
        { label: "Customs clears it on arrival", detail: "Customs decides on arrival. Bindu does not control this step." },
      ],
    },
    {
      id: "cbam", ask: { at: 2, q: "Has the mill sent its emissions figures for this batch?", a: "Yes, by email. One figure is missing, so Bindu asks again." }, tab: "CBAM", live: false,
      chips: [{ text: "CBAM In build", live: false }],
      sub: "Example: 2 containers of steel, Mumbai (India) to Rotterdam. The emissions data comes from the mill along the way. The CBAM report is in build.",
      milestones: [
        { label: "Steel batch recorded", detail: "The batch is recorded with its supplier and its weight." },
        { label: "Mill asked for emissions data", detail: "Bindu asks the mill for the emissions figures for this batch." },
        { label: "Emissions data received", detail: "The mill sends the figures by WhatsApp or email." },
        { label: "Embedded emissions calculated", detail: "The CO₂ in each tonne of steel is worked out from that data." },
        { label: "Missing figures asked for", detail: "Bindu asks again for any figure that is still missing." },
        { label: "CBAM report: coming", detail: "The report is in build. Not live yet." },
      ],
    },
    {
      id: "dpp", ask: { at: 2, q: "Which supplier hasn't sent the fibre details?", a: "The dye house hasn't. Bindu asks it again." }, tab: "DPP", live: true,
      chips: [{ text: "Textile passports Live", live: true }, { text: "Battery passports In build", live: false }],
      sub: "Example: 2 containers of textile batches, Ningbo (China) to Hamburg. Each batch gets its product data, then a passport and a QR label. Textile passports are Live. Battery passports are in build.",
      milestones: [
        { label: "Textile batch tagged", detail: "The batch gets its own product ID before it ships." },
        { label: "Supplier asked for product data", detail: "Fibre, dye and care details are requested by WhatsApp or email." },
        { label: "Product data received", detail: "The supplier sends the details for this batch." },
        { label: "Passport created", detail: "The digital product passport is created for this batch." },
        { label: "Missing details asked for", detail: "Bindu asks again for any detail that is still missing." },
        { label: "QR label attached", detail: "A QR code on the label links to the passport. Battery passports are in build." },
      ],
    },
    {
      id: "reach", ask: { at: 2, q: "Which ingredient still has no data sheet?", a: "One ingredient has none. Bindu asks the supplier again." }, tab: "REACH", live: false,
      chips: [{ text: "REACH In build", live: false }],
      sub: "Example: 2 containers of chemical products, Houston (United States) to Antwerp. Each substance is checked against the EU list of restricted chemicals (REACH). The compliance record is in build.",
      milestones: [
        { label: "Chemical product declared", detail: "The product and its supplier are recorded at origin." },
        { label: "Substance data requested", detail: "The supplier is asked for the data sheet for each ingredient." },
        { label: "Substance data received", detail: "The data sheets arrive by WhatsApp or email." },
        { label: "Restricted-substance check", detail: "Each substance is checked against the restricted list." },
        { label: "Missing data asked for", detail: "Bindu asks again for any substance that still has no data." },
        { label: "Compliance record: coming", detail: "The record is in build. Not live yet." },
      ],
    },
    {
      id: "ppwr", ask: { at: 2, q: "Which packs are missing a material and weight?", a: "The outer carton. Bindu asks the supplier again." }, tab: "PPWR", live: false,
      chips: [{ text: "PPWR In build", live: false }],
      sub: "Example: 2 containers of packaged consumer goods, Cai Mep (Vietnam) to Valencia. Each pack is checked against the EU packaging rules (PPWR). The packaging record is in build.",
      milestones: [
        { label: "Packaged goods loaded", detail: "The shipment is recorded with its packaging lines." },
        { label: "Packaging data requested", detail: "The supplier is asked for the material and weight of each pack." },
        { label: "Packaging data received", detail: "The supplier sends the details by WhatsApp or email." },
        { label: "Requirements checked", detail: "Each pack is checked against the EU packaging rules." },
        { label: "Missing data asked for", detail: "Bindu asks again for anything that is still missing." },
        { label: "Packaging record: coming", detail: "The record is in build. Not live yet." },
      ],
    },
  ],
};

/* Round 6, item 1: minimal pricing. Only EUDR has a published price; the other tabs show "Pricing on request".
   `tag` is the tab's title and `desc` the one-line description (the copy the module strip used). Prices exactly as published. */
export const pricing = {
  eyebrow: "Pricing",
  title: "What each filing costs.",
  lead: "Per filing. Not per seat.",
  tabs: [
    {
      id: "eudr", label: "EUDR", tag: "Deforestation-free goods", status: "live",
      price: {
        amount: "€249", unit: "per EUDR dossier",
        rows: [
          { k: "File the statement to TRACES", v: "€199" },
          { k: "Keep records for 5 years", v: "€50" },
          { k: "Keep records for 10 years (option)", v: "€100" },
          { k: "Workspace", v: "€20 / month" },
        ],
        line: "No seats. No annual licence. EU-hosted. Prices excl. VAT.",
      },
    },
    { id: "hs", label: "HS Code", tag: "Product classification", desc: "The customs code for each product, so the right rules and duties are checked.", status: "build" },
    { id: "cbam", label: "CBAM", tag: "Carbon at the border", desc: "The carbon cost of steel, aluminium, cement, fertilisers, hydrogen and electricity made outside the EU.", status: "build" },
    {
      /* per-row status: textiles are live, battery and other product groups are in build. No price for any row. */
      id: "dpp", label: "DPP", k: "Textile passports", tag: "Product passports",
      lines: [
        { t: "Textile passports", s: "live" },
        { t: "Battery passports", s: "build" },
        { t: "Other product groups", s: "build" },
      ],
    },
    { id: "ppwr", label: "PPWR", tag: "Packaging", desc: "What your packaging is made of and whether it can be recycled.", status: "build" },
    { id: "reach", label: "REACH", tag: "Chemicals", desc: "Which chemicals are in your products, checked against the EU's restricted list.", status: "build" },
  ],
  /* round 13, item 7: the right side of the section. Copy from getbindu.com (before.html), not invented. */
  side: {
    covers: {
      eyebrow: "What each EUDR filing covers",
      items: [
        { p: "€199", t: "files the statement to TRACES and returns the reference customs asks for." },
        { p: "€50", t: "keeps the dossier for the five years the law requires." },
        { p: "€100", t: "keeps it the full ten years." },
        { p: "€20 a month", t: "keeps your workspace live to file." },
      ],
    },
    billing: {
      eyebrow: "How billing works",
      lines: ["You pay per filing, not per seat or per year.", "No seats, no annual licence."],
    },
    notes: ["One platform for EUDR, CBAM, battery and textile passports.", "EU-hosted and GDPR compliant. Prices exclude VAT."],
  },
  calc: {
    title: "Your year with Bindu",
    label: "An estimate from the published prices, not a quote.",
    filings: "Filings a year",
    keep: "How long to keep records",
    keep5: "Five years (€50)",
    keep10: "Ten years (€100)",
    total: "Estimated yearly cost",
    lineFilings: "filings",
    lineWorkspace: "Workspace, 12 months",
    vat: "Excl. VAT",
    close: "Close",
  },
};

export const roles = {
  eyebrow: "Built for your role",
  title: "Who Bindu is for.",
  learn: "Learn more",
  items: [
    { t: "Importers", d: "You bring goods in. Bindu works out the proof each shipment needs and files the statement for you.", href: "/eudr" },
    { t: "Exporters and co-ops", d: "You sell into the EU. Map each plot once and answer your buyers' requests without a new login.", href: "/eudr" },
    { t: "Customs brokers", d: "You file for clients. Keep each client's proof on one record per shipment.", href: "/eudr" },
    { t: "Traders", d: "You buy and sell on. Keep the reference numbers and records your buyers ask for.", href: "/eudr" },
  ],
};

export const faq = {
  eyebrow: "FAQ",
  title: "Questions owners ask.",
  raahul: "Answer from Raahul",
  items: [
    { q: "Am I an operator?", a: "", pending: true },
    { q: "Do I need to file if I buy from an EU importer?", a: "", pending: true },
    { q: "Is the simplified declaration enough?", a: "", pending: true },
    { q: "What if a supplier won't share data?", a: "Bindu asks them on WhatsApp or by email, with no login, and shows you what is still missing. A statement can only be filed once the proof is complete.", pending: true },
    { q: "Do my suppliers need an account?", a: "No. Bindu asks them on WhatsApp or by email, with no login for them. Before anything leaves, they see exactly what you will learn, and they can say no. Each line of your record then points back to the document they sent.", pending: false },
    { q: "Is my data shared with other companies?", a: "No. Every workspace is single-tenant and your data stays inside it. Nothing crosses to another company until the exchange layer ships, and that layer is still in build.", pending: false },
    { q: "Who's liable?", a: "", pending: true },
  ],
};

export const footer = {
  line: "Describe your shipment once. Bindu finds the rules that apply and files the statement.",
  cols: [
    { h: "Product", l: [{ t: "How it works", u: "#story" }, { t: "Pricing", u: "#pricing" }] },
    { h: "Company", l: [{ t: "GitHub", u: "https://github.com/GetBindu/Bindu" }, { t: "raahul@getbindu.com", u: "mailto:raahul@getbindu.com" }] },
  ],
  legal: "© 2026 GetBindu · The73 B.V. · KvK 92797911 · Amsterdam, NL · Hosted in the EU · Prices exclude VAT", // avoid-ai-design-ignore: SD4d (field separators in the mock document, r41-3)
};

/* Round 17 (one story). Statement, before and after, the hero selector. Facts only from the brief; statuses as in the brief. */
export const statement = {
  before: "Describe your shipment.",   /* r65-14: Austin's words */
  after: "handles the rules, codes, evidence and filing.",
};

export const finaleWordmark = { label: "Bindu", letters: ["b", "ı", "ndu"] };

export const footerRoles = {
  lead: "For",
  items: [
    { t: "importers", href: "/eudr" },
    { t: "exporters and co-ops", href: "/eudr" },
    { t: "customs brokers", href: "/eudr" },
    { t: "traders", href: "/eudr" },
  ],
};

/* Round 44 (r44-1), rebuilt in round 46 (r46-1) in the shape of the old "Ask your supply chain" theatre: a pinned, scrubbed window, four beats on the left, a live stage on the right.
   Not EUDR-specific: generic rule names with their statuses exactly as in the brief (deforestation = EUDR, Live; packaging = PPWR, In build). Everything on the stage (the sentence, the code,
   the suppliers, the files, the reference number) is made up and labelled Illustration. */
export const story = {
  title: "One shipment, four steps.",
  lead: "Write one plain sentence. Bindu finds the rules, asks for proof and files.",
  label: "What Bindu does with a shipment, in four steps",
  stageLabel: "An example shipment going from one sentence to a filed record",
  illus: "Illustration",
  caption: "Made-up shipment, suppliers, files, code and reference number.",
  stops: [
    { id: "describe", t: "Describe the shipment", short: "Describe", cap: "You write one plain sentence about the shipment.", say: "40 bags of coffee from Huila to Rotterdam" },
    { id: "rules", t: "Rules and customs code", short: "Rules", cap: "Bindu finds the rules that apply and the customs code.", rules: [{ t: "Deforestation", live: true }, { t: "Packaging", live: false }], code: "HS 0901.11" },
    { id: "proof", t: "Proof from suppliers", short: "Proof", cap: "Bindu asks suppliers by email or WhatsApp. No login.", files: ["email: plot-file.pdf", "WhatsApp: certificate.pdf"] },
    { id: "file", t: "Filing and reference", short: "Filing", cap: "Bindu prepares the filing; the reference number comes back.", ref: "REF 25NL7K3X9M" }, // avoid-ai-design-ignore: SD4d (field separators in the mock document, r41-3)
  ],
  stage: {
    // the sentence in parts; `k` marks the words that lift out into the rules and the code
    say: [{ t: "40 bags", k: "pack" }, { t: " of " }, { t: "coffee", k: "coffee" }, { t: " from Huila to Rotterdam" }],
    record: "Filing record",
    slots: { ship: "Shipment", rules: "Rules", code: "Customs code", proof: "Proof", ref: "Reference" },
    shipment: "40 bags of coffee, Huila to Rotterdam",
    rules: [{ t: "Deforestation", live: true, from: "coffee" }, { t: "Packaging", live: false, from: "pack" }],
    live: "Live",
    build: "In build",
    code: "HS 0901.11",
    filed: "Filed for deforestation",
    ref: "25NL7K3X9M",
    threads: [
      { ch: "Email", who: "Finca La Esperanza", ask: "Plot file, please", file: "plot-file.pdf" },
      { ch: "WhatsApp", who: "Cooperativa Huila", ask: "Lot certificate, please", file: "certificate.pdf" },
    ],
  },
};

/* Round 44 (r44-5): PLACEHOLDER quotes. They are made up, so the section carries a visible "Placeholder" chip. Replace them with quotes Raahul has approved and remove the chip
   (go-live item in docs/home/usage-audit.md). No logos, avatars, star ratings or numbers. */
export const TESTIMONIALS_PLACEHOLDER = [
  { q: "I describe the shipment once, and Bindu tells me which proof each supplier still owes.", name: "Maria V.", role: "Importer", company: "Example Coffee Imports", country: "Netherlands" },
  { q: "My buyers ask for the same plot data every season. Now I answer once and it goes where it is needed.", name: "Joseph K.", role: "Co-op manager", company: "Example Growers Co-op", country: "Uganda" },
  { q: "Each client's proof sits on one record per shipment, so I know what is missing before I file.", name: "Anke D.", role: "Customs broker", company: "Example Customs Services", country: "Belgium" },
  { q: "When a buyer asks for a reference number, I can find it and the document behind it.", name: "Samir R.", role: "Trader", company: "Example Trading", country: "Switzerland" },
  { q: "Our suppliers answer on WhatsApp. Nobody has to learn a new login.", name: "Lena H.", role: "Sourcing lead", company: "Example Apparel Brand", country: "Germany" },
];
export const voices = {
  title: "What buyers say.",
  label: "Quotes from buyers",
  placeholder: "Placeholder",
  note: "Placeholder quotes and names, to be replaced with approved ones.",
  prev: "Previous quote",
  next: "Next quote",
  hint: "Drag, use the arrow keys or scroll",
};

/* Round 44 (r44-6): the rules Bindu covers, one tile each. Statuses exactly as in the brief (docs/home/project-context.md section 2): EUDR Live, textile passports Live, battery
   passports In build, CBAM, REACH and PPWR In build. The only date is EUDR's (30 Dec 2026 medium and large, 30 Jun 2027 most micro and small), cited to the Commission page. Each tile also
   cites the regulation on EUR-Lex. No prices (pricing is the next section). The page links come from NAV_REGULATIONS (links.ts) by name. */
export const rules = {
  title: "The rules Bindu covers.",
  lead: "Six EU rules, and where each one stands.",   /* r65-6, option a */
  label: "Regulations",
  covers: "Covers",
  source: "Source",
  note: "Illustration. The clips are from each rule's page on getbindu.com.",
  /* r65-6: six cards in the parallel.ai shape (Austin). Facts, statuses, regulation numbers and sources as before; the passport card is split
     into textiles (Live) and batteries (In build). `page` is the getbindu.com path the clip comes from; `chip` is the one floating line of the
     record, an illustration with no invented numbers. The battery passport source is the Battery Regulation (EU) 2023/1542 (verify). */
  items: [
    { id: "eudr", reg: "EU 2023/1115", t: "EUDR", full: "Deforestation rule", href: "/eudr", read: "Read about EUDR", icon: "tree", d: "Proof that goods did not come from land deforested after 31 December 2020, and were produced legally.", covers: "Coffee, cocoa, rubber", live: true,
      date: "Applies from 30 Dec 2026 for medium and large companies, and from 30 Jun 2027 for most micro and small ones.", src: { t: "European Commission", u: EUDR_SOURCE },
      page: "getbindu.com/eudr", video: "/videos/eudr-forest-hero.webm", poster: "/images/eudr-forest-hero.webp", chip: "Reference returned" },
    { id: "textiles", reg: "EU 2024/1781", t: "Textile passport", full: "Digital product passport", href: "/dpp/textiles", read: "Read about textile passports", icon: "shirt", d: "A record you reach by QR code, with a garment's materials, origin and care details.", covers: "Clothing and textiles", live: true,
      src: { t: "EUR-Lex", u: "https://eur-lex.europa.eu/eli/reg/2024/1781/oj" },
      page: "getbindu.com/dpp/textiles", video: "/videos/dpp-textiles-hero.webm", poster: "/images/dpp-textiles-hero.jpg", chip: "Passport readable by QR" },
    { id: "battery", reg: "EU 2023/1542", t: "Battery passport", full: "Digital product passport", href: "/dpp/battery", read: "Read about battery passports", icon: "battery", d: "A digital record for each industrial and EV battery: what it is made of, where, and its carbon footprint.", covers: "Industrial and EV batteries", live: false,
      src: { t: "EUR-Lex", u: "https://eur-lex.europa.eu/eli/reg/2023/1542/oj" },
      page: "getbindu.com/dpp/battery", video: "/videos/dpp-battery-hero.webm", poster: "/images/dpp-battery-hero.jpg", chip: "Battery record, coming" },
    { id: "cbam", reg: "EU 2023/956", t: "CBAM", full: "Carbon border adjustment", href: "/cbam", read: "Read about CBAM", icon: "factory", d: "A carbon charge on certain goods brought into the EU, based on the emissions made producing them.", covers: "Steel, aluminium, cement, fertilisers", live: false,
      src: { t: "EUR-Lex", u: "https://eur-lex.europa.eu/eli/reg/2023/956/oj" },
      page: "getbindu.com/cbam", video: "/videos/cbam-steel-hero.webm", poster: "/images/cbam-steel-hero.jpg", chip: "Emissions per shipment" },
    { id: "reach", reg: "EC 1907/2006", t: "REACH", full: "Chemicals rule", href: "/reach", read: "Read about REACH", icon: "flask", d: "The EU list of restricted chemical substances. Each substance in a product is checked against it.", covers: "Chemicals and products that contain them", live: false,
      src: { t: "EUR-Lex", u: "https://eur-lex.europa.eu/eli/reg/2006/1907/oj" },
      page: "getbindu.com/reach", video: "/videos/reach-tide-hero.webm", poster: "/images/reach-tide-hero.webp", chip: "Substances checked" },
    { id: "ppwr", reg: "EU 2025/40", t: "PPWR", full: "Packaging rule", href: "/ppwr", read: "Read about PPWR", icon: "package", d: "The EU packaging rules, checked pack by pack for material and weight.", covers: "Packaged goods", live: false,
      src: { t: "EUR-Lex", u: "https://eur-lex.europa.eu/eli/reg/2025/40/oj" },
      page: "getbindu.com/ppwr", video: "/videos/ppwr-recycling-hero.webm", poster: "/images/ppwr-recycling-hero.webp", chip: "Pack by pack" },
  ] as { id: string; reg: string; t: string; full: string; href: string; read: string; icon: string; d: string; covers: string; live: boolean; date?: string; src: { t: string; u: string }; page: string; video: string; poster: string; chip: string }[],
  live: "Live",
  build: "In build",
};

/* Round 65 (r65-7): the blog row after pricing. Titles, dates and thumbnails come from each post's frontmatter (app/(en)/(home)/page.tsx). */
export const blogRow = {
  title: "From the blog.",   /* r65-7, option a */
  all: "All posts",
  read: "Read",
  label: "Blog posts",
  prev: "Previous posts",
  next: "Next posts",
  slugs: ["eudr-traces", "cbam-report", "digital-product-passport-textiles", "battery-passport", "reach-compliance", "eudr-timeline"],
};
export type BlogRowPost = { slug: string; title: string; date: string; iso: string; image: string; alt: string; category: string };
