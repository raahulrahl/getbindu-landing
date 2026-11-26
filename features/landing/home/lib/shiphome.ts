import { sunflower } from "./phyllotaxis";
import { isPhone, onPhoneChange } from "./phone";
/* Round 24 item 4: where the guide ship sits in the gutter right now (viewport pixels), written by the Guide every frame it draws, and a dock value the
   journey map sets (0 to 1). Round 25 item 2: fin.t is the finale's master time in seconds (the Finale component tweens it, the Guide draws the ship from it).
   Round 29 item 3: the hand-offs between the dots and the ship are drawn on the Guide's canvas only. brk is the map's break value (0 to 1, the journey tweens it) and
   mark holds where the 34 dots of the Bindu mark are on screen (viewport pixels), so the beads leave from exactly those places. now() draws the Guide's frame at once. */
export const shipHome = { x: 70, y: 500, ship: true, k: 1, dock: 0, pres: 1, brk: 0, markOn: false, mark: new Float32Array(68), markFilled: false, kick: () => {}, now: () => {} };

/* the finale, in seconds (r29-5): the ship stays in its gutter and breaks into dots there when the scroll crosses its trigger (time-based: 1.2s per dot, quart-out, a
   stagger of 0 to 0.25s), the dots fly in curves into the dot of the i. The zoom through the wordmark that follows is scroll-driven. */
export const FIN = { fly: 1.2, stag: 0.25, formed: 1.45, rests: [0, 1.45] };
/* r32-1: the ship to dot hand-off plays inside the finale's pin, in viewport heights from the pin start: a short hold (ship docked on the right), then fin.t runs 0 to FIN.formed
   over FINP.span (scrubbed, SCRUB_SOFT 0.6), then the zoom begins at FINP.zoom. The Guide holds the ship at its dock until the zoom starts. */
export const FINP = { hold: 0.2, span: 1.2, zoom: 1.4, zoomLen: 1.3 };
/* r42: the zoom ends where the footer starts to rise (spacer minus one viewport: 295vh, 185vh on phones), so zoom + zoomLen = that point. */
/* r35: on phones the finale pins for about 285svh instead of 395 (a 10vh hold, 80vh of hand-off, the zoom from 90vh for 90vh; the CSS spacer matches). Updated when the window crosses 767px. */
const syncFinp = () => { const p = isPhone(); FINP.hold = p ? 0.1 : 0.2; FINP.span = p ? 0.8 : 1.2; FINP.zoom = p ? 0.9 : 1.4; FINP.zoomLen = p ? 0.75 : 1.3; };
syncFinp();
if (typeof window !== "undefined") onPhoneChange(syncFinp);
/* t: the master time; z: the zoom's progress 0 to 1 (r28-3) */
/* r62-1: b is the guide ship's break at the end of its lane, 0 to 1 (smoothed in the Guide from the scroll position); nothing travels from it into the finale */
export const fin = { t: 0, z: 0, b: 0 };
/* r62-1: the break starts when the ship reaches the lane end (the ship sits 0.55 viewport heights down the screen there) and takes this many viewport heights of scroll */
export const BREAK_SPAN = 0.4;

const c01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const sm01 = (x: number) => { const t = c01(x); return t * t * (3 - 2 * t); };
/* one easing family for every dot and the ship's parts: quart-out */
export const outQuart = (x: number) => { const t = 1 - c01(x); return 1 - t * t * t * t; };
/* progress 0 to 1 of dot j of n at time T (seconds): flies for FIN.fly after its own start in a stagger of FIN.stag */
export const flyU = (T: number, j: number, n: number) => outQuart((T - (FIN.stag * j) / (n - 1)) / FIN.fly);
/* r30-2: the dot of the i is a small sunflower of 34 dots (a golden-angle disc, in units of its radius: x, y, and m, how yellow it is: 1 in the middle, 0 at the rim).
   Ship dot j lands in slot NDOT - 1 - j, so the yellow container (the last dot) lands in the middle, last. */
export const NDOT = 34, SUN_R = 0.86, SUN_DOT = 0.105;
const SUN = sunflower(NDOT, SUN_R);
export const sunSlot = (j: number) => { const i = NDOT - 1 - j, x = SUN[2 * i], y = SUN[2 * i + 1]; return { x, y, m: 1 - Math.pow(Math.min(1, Math.hypot(x!, y!) / SUN_R), 1.7) }; };
/* how far ship dot j has landed in its slot at time T (0 to 1) */
export const landed = (T: number, j: number) => sm01((flyU(T, j, NDOT) - 0.7) / 0.3);
/* the map's hand-off: q 0 to 1 over the stream, dot j of 34 starts after 0.45 of the stream in proportion to its place and flies for the rest */
export const mapU = (q: number, j: number) => outQuart((q - (0.45 * j) / 33) / 0.55);
