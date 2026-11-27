import type { Metadata } from "next";
/* The rebuilt homepage, on the authored brand (docs/home/BRAND.md). The old composition is
   still at features/landing/home/home-page.tsx: swap this one import back to revert. */
import { BrandHomePage } from "@/features/landing/home/brand-page";
import { RedirectIfAuthenticated } from "@/features/landing/chrome/redirect-if-authenticated";
import { publishedFaqItems } from "@/features/landing/home/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: publishedFaqItems.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export const metadata: Metadata = {
  title: {
    absolute: "Bindu: Trade Compliance Software for EU Import & Export",
  },
  description:
    "Bindu is trade-compliance software for EU import & export. Describe a shipment once; Bindu screens EUDR, CBAM, DPP and tariff rules and files the artifact.",
  // NOTE: a page-level `openGraph` REPLACES the root layout's whole
  // openGraph object (Next merges shallowly per key), so images/siteName/
  // type must be restated here or the homepage ships without og:image.
  openGraph: {
    type: "website",
    siteName: "Bindu",
    locale: "en_US",
    title: "Bindu: Trade Compliance Software for EU Import & Export",
    description:
      "Describe a shipment once. Bindu screens the rules (EUDR, CBAM, DPP, tariffs) and files the artifact.",
    url: "/",
    images: [
      { url: "/bindu-card.jpg", width: 1200, height: 630, alt: "Bindu" },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <>
      <RedirectIfAuthenticated />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <BrandHomePage />
    </>
  );
}
