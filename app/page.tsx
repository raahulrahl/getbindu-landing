import { AnnounceBar, Header, Footer, MachineBand } from "@/components/chrome";
import { Hero } from "@/components/sections/01-hero";
import { Trusted } from "@/components/sections/02-trusted";
import { Deadline } from "@/components/sections/03-deadline";
import { Commodities } from "@/components/sections/04-commodities";
import { Comparison } from "@/components/sections/05-comparison";
import { How } from "@/components/sections/06-how";
import { Provenance } from "@/components/sections/07-provenance";
import { Suppliers } from "@/components/sections/08-suppliers";
import { Coverage } from "@/components/sections/09-coverage";
import { Architecture } from "@/components/sections/10-architecture";
import { Journey } from "@/components/sections/11-journey";
import { Pains } from "@/components/sections/12-pains";
import { Enterprise } from "@/components/sections/13-enterprise";
import { Pricing } from "@/components/sections/14-pricing";
import { Start } from "@/components/sections/15-start";
import { Strips } from "@/components/sections/16-17-strips";
import { Faq } from "@/components/sections/18-faq";
import { Closing } from "@/components/sections/19-closing";

export default function Page() {
  return (
    <>
      <AnnounceBar />
      <Header />
      <main className="page">
        <Hero />
        <Trusted />
        <Deadline />
        <Commodities />
        <Comparison />
        <How />
        <Provenance />
        <Suppliers />
        <Coverage />
        <Architecture />
        <Journey />
        <Pains />
        <Enterprise />
        <Pricing />
        <Start />
        <Strips />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <MachineBand />
    </>
  );
}
