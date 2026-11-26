/* Where the homepage links to. Every route here already exists in this repo; nothing points at a mockup page. */

/* r38-1: the regulation pages sit under one "Regulations" dropdown; Blog stays a plain link after it */
export const NAV_REGULATIONS = [
  { t: "EUDR", u: "/eudr" },
  { t: "CBAM", u: "/cbam" },
  { t: "REACH", u: "/reach" },
  { t: "PPWR", u: "/ppwr" },
  { t: "Passports", u: "/dpp/textiles" },
];
export const NAV_BLOG = { t: "Blog", u: "/blog" };
export const FOOTER_PAGES = [
  { t: "EUDR", u: "/eudr" },
  { t: "CBAM", u: "/cbam" },
  { t: "CBAM software", u: "/cbam/software" },
  { t: "REACH", u: "/reach" },
  { t: "PPWR", u: "/ppwr" },
  { t: "Battery passport", u: "/dpp/battery" },
  { t: "Textile passport", u: "/dpp/textiles" },
  { t: "Other product groups", u: "/dpp/others" },
];
export const GUIDE_AND_LEGAL = [
  { t: "Blog", u: "/blog" },
  { t: "Terms", u: "/terms" },
  { t: "Privacy", u: "/privacy" },
];
