import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { reduceMotion } from "./motion";
import { dotWipe } from "./dotwipe";

/* A click on a link to another page of the site runs the dot wipe (round 8, item 3a), then the route changes under
   cover. The mockup did this for its hash sub-pages; here the targets are the real routes (/eudr, /blog, ...), opened
   with the Next router. Homepage anchors (#how), external links, new-tab and modified clicks keep the normal link, and
   reduced motion skips the wipe. */
let wiping = false;

export function useRouteWipe() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.closest("[data-skip-route-wipe]") || wiping || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      e.preventDefault();
      if (reduceMotion()) { router.push(href); return; }
      wiping = true;
      dotWipe(() => router.push(href)).finally(() => { wiping = false; });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);
}
