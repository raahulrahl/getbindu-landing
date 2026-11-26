import { getRoot } from "./root";
/* Light or dark theme (round 13). The attribute on <html> is the source of truth: index.html sets it before first paint.
   Light is the default; the system colour scheme is ignored. The choice is kept in localStorage (try/catch: private mode
   keeps it for this page only). Only colour values change between the themes; see the [data-theme="light"] block in
   styles/tokens.css. Canvas and WebGL code re-reads its colours through subscribeTheme. */
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
const KEY = "bindu-theme";

export function getTheme(): Theme {
  return getRoot().dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(t: Theme) {
  const root = getRoot();
  // r60-5: no colour transition runs during the swap (they would all fire at once and smear): switch them off, flush styles, restore after the next frame
  root.classList.add("theme-swap");
  root.dataset.theme = t;
  root.style.colorScheme = t;
  // the browser chrome colour is the page colour of the theme just set
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(root).getPropertyValue("--canvas").trim());
  void getComputedStyle(root).color;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-swap")));
  try { localStorage.setItem(KEY, t); } catch { /* private mode: the choice lasts for this page only */ }
}

/* fires when data-theme changes (the toggle, or another call); canvas code re-reads its colours here */
export function subscribeTheme(cb: () => void): () => void {
  const mo = new MutationObserver(cb);
  mo.observe(getRoot(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, getTheme, () => "light");
}
