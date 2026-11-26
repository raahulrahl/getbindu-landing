"use client";

/* The homepage, composed in the mockup's section order (v3 App.tsx, minus its hash-route sub-pages and the "Mockup"
   badge). One client boundary: the sections server-render for the text, and everything animated starts in effects. */
import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/components.css";
import "./styles/site.css";
import "./styles/r2-cobalt.css";
import "./styles/r2-hero-cta.css";
import "./styles/r10-hero.css";
import "./styles/r13-hero.css";
import "./styles/r13-cta.css";
import "./styles/r13-pricing.css";
import "./styles/guide.css";
import "./styles/story.css";
import "./styles/r44.css";
import "./styles/r47.css";
import "./styles/r59.css";
import "./styles/r65.css";
import { startSmoothScroll } from "./lib/motion";
import { getRoot } from "./lib/root";
import { startScenes } from "./lib/scenes";
import { startHeadings } from "./lib/headings";
import { useRouteWipe } from "./lib/route";
import { addPending, markReady, gate, guardAnchors, afterSettle } from "./lib/ready";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Statement } from "./components/Story";
import { Intro } from "./components/Intro";
import { Guide } from "./components/Guide";
import { Rail } from "./components/Rail";
import { EstimateProvider } from "./components/Estimate";
import type { BlogRowPost } from "./content";
import "./styles/subpages.css";
// last, so the shared states win over the section sheets (equal specificity)
import "./styles/states.css";
// round 35: phones only (767px and under), after everything else
import "./styles/mobile.css";

/* Below-the-fold sections hydrate late. Their HTML is in the page from the start (same height, same text), so nothing shifts and the text stays
   crawlable; only their JS and hydration wait, until the section is within 1.5 viewports or the page is idle (lib/ready.ts). */
/* On the server the section renders for real, inside the same Suspense boundary, so its HTML is inline (not streamed in later); the client side
   swaps in a lazy import that waits for the gate. `sync` is a build-time constant: the require is dropped from the client bundle. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyC = React.ComponentType<any>;
const late = (id: string, sync: AnyC | null | undefined, load: () => Promise<Record<string, unknown>>, name: string) => {
  const C: AnyC = sync ?? lazy(() => gate(id).then(load).then((m) => ({ default: m[name] as AnyC })));
  const Late = (props: Record<string, unknown>) => {
    addPending(id);
    return <Suspense fallback={null}><C {...props} /><Ready id={id} /></Suspense>;
  };
  return Late;
};
function Ready({ id }: { id: string }) {
  useEffect(() => { markReady(id); }, [id]);
  return null;
}
const Flow = late("story", typeof window === "undefined" ? (require("./components/Flow") as Record<string, React.ComponentType>).Flow : null, () => import("./components/Flow"), "Flow");
const ShipmentJourney = late("shipment", typeof window === "undefined" ? (require("./components/ShipmentJourney") as Record<string, React.ComponentType>).ShipmentJourney : null, () => import("./components/ShipmentJourney"), "ShipmentJourney");
const Examples = late("examples", typeof window === "undefined" ? (require("./components/Examples") as Record<string, React.ComponentType>).Examples : null, () => import("./components/Examples"), "Examples");
const Voices = late("voices", typeof window === "undefined" ? (require("./components/Voices") as Record<string, React.ComponentType>).Voices : null, () => import("./components/Voices"), "Voices");
const Rules = late("rules", typeof window === "undefined" ? (require("./components/Rules") as Record<string, React.ComponentType>).Rules : null, () => import("./components/Rules"), "Rules");
const Pricing = late("pricing", typeof window === "undefined" ? (require("./components/Pricing") as Record<string, React.ComponentType>).Pricing : null, () => import("./components/Pricing"), "Pricing");
const Blog = late("blog", typeof window === "undefined" ? (require("./components/Blog") as Record<string, React.ComponentType>).Blog : null, () => import("./components/Blog"), "Blog");
const Faq = late("faq", typeof window === "undefined" ? (require("./components/Closing") as Record<string, React.ComponentType>).Faq : null, () => import("./components/Closing"), "Faq");
const Finale = late("demo", typeof window === "undefined" ? (require("./components/Closing") as Record<string, React.ComponentType>).Finale : null, () => import("./components/Closing"), "Finale");

export function HomePage({ posts = [] }: { posts?: BlogRowPost[] }) {
  useRouteWipe();
  // a client-side return to / skips the head script: restore the saved theme before paint
  useLayoutEffect(() => {
    try { getRoot().dataset.theme = localStorage.getItem("bindu-theme") === "dark" ? "dark" : "light"; } catch { /* private mode: light */ }
  }, []);
  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollPaddingTop = "72px";   // native anchor jumps (reduced motion) clear the fixed nav
    const stopScroll = startSmoothScroll();
    const stop = startScenes();
    const stopHeads = startHeadings();
    const stopAnchors = guardAnchors();
    // an anchor in the address (/#pricing) scrolls to its section once the page has mounted; otherwise start at the top
    const id = location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    const toTarget = () => window.scrollTo({ top: target!.getBoundingClientRect().top + window.scrollY - 64, behavior: "auto" });
    if (target) { toTarget(); afterSettle(toTarget); }   // sections above hydrate after this and add their pin spacers: land again once they have
    else window.scrollTo(0, 0);
    return () => {
      stop(); stopHeads(); stopAnchors(); stopScroll(); html.style.scrollPaddingTop = "";
    };
  }, []);
  return (
    <EstimateProvider>
      <Intro />
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <Guide />
      <Rail />
      <main id="main">
        {/* round 44: one story. Hero, statement, what Bindu does (four steps), the shipment map (r65-4: Full Circle removed) (the supply-chain question is folded into it), the departures board, what buyers say, the rules, pricing, FAQ, wordmark finale. */}
        <Hero />
        <Statement />
        <Flow />
        <ShipmentJourney />
        <Examples />
        <Voices />
        <Rules />
        <Pricing />
        {posts.length > 0 && <Blog posts={posts} />}
        <Faq />
        <Finale />
      </main>
    </EstimateProvider>
  );
}
