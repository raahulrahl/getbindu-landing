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
import "./styles/guide.css";
import "./styles/story.css";
import "./styles/r44.css";
import "./styles/r47.css";
import "./styles/r59.css";
import "./styles/r65.css";
import { getRoot } from "./lib/root";
import { useRouteWipe } from "./lib/route";
import { INTEGRATIONS_ANCHOR } from "./links";
import { addPending, markReady, gate, guardAnchors, afterSettle } from "./lib/ready";
import { Nav } from "./components/Nav";
import type { BlogRowPost } from "./content";
import { Blog } from "./components/Blog";
import { EstimateProvider } from "./components/Estimate";
import { Faq } from "./components/Closing";
import { Hero } from "./components/Hero";
import { Pricing } from "./components/Pricing";
import { Rules } from "./components/Rules";
import { Statement } from "./components/Story";
import { Footer } from "./components/Footer";
import { ViewSwitch } from "./components/ViewSwitch";
import { Trust } from "./components/Trust";
import { WorkflowChannels } from "./components/Connectors";
import "./styles/subpages.css";
// last, so the shared states win over the section sheets (equal specificity)
import "./styles/states.css";
// round 35: phones only (767px and under), after everything else
import "./styles/mobile.css";
import "./styles/editorial.css";
import "./styles/lower-page.css";
import "./styles/benchmarks.css";
import "./styles/connectors.css";

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
const Benchmarks = late("benchmarks", typeof window === "undefined" ? (require("./components/Benchmarks") as Record<string, React.ComponentType>).Benchmarks : null, () => import("./components/Benchmarks"), "Benchmarks");
const Voices = late("voices", typeof window === "undefined" ? (require("./components/Voices") as Record<string, React.ComponentType>).Voices : null, () => import("./components/Voices"), "Voices");
const Integrations = late(INTEGRATIONS_ANCHOR, typeof window === "undefined" ? (require("./components/Integrations") as Record<string, React.ComponentType>).Integrations : null, () => import("./components/Integrations"), "Integrations");

export function HomePage({ posts }: { posts: BlogRowPost[] }) {
  useRouteWipe();
  // a client-side return to / skips the head script: restore the saved theme before paint
  useLayoutEffect(() => {
    try { getRoot().dataset.theme = localStorage.getItem("bindu-theme") === "dark" ? "dark" : "light"; } catch { /* private mode: light */ }
  }, []);
  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollPaddingTop = "72px";   // keep anchor targets below the fixed nav
    const stopAnchors = guardAnchors();
    // an anchor in the address (/#trust) scrolls to its section once the page has mounted; otherwise start at the top
    const id = location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    const toTarget = () => window.scrollTo({ top: target!.getBoundingClientRect().top + window.scrollY - 64, behavior: "auto" });
    if (target) { toTarget(); afterSettle(toTarget); }
    else window.scrollTo(0, 0);
    return () => {
      stopAnchors(); html.style.scrollPaddingTop = "";
    };
  }, []);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ViewSwitch mode="human" />
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Flow />
        <ShipmentJourney />
        <Examples />
        <Benchmarks />
        <Voices />
        <Rules />
        <Trust />
        <EstimateProvider>
          <Pricing />
        </EstimateProvider>
        {posts.length > 0 && <Blog posts={posts} />}
        <WorkflowChannels />
        <Integrations />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
