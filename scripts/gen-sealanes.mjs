/* Generates features/landing/home/lib/sealanes.ts: the five example routes of the shipment map as sea lanes that never cross land.
   Usage: node scripts/gen-sealanes.mjs features/landing/home/lib/landfine.ts   (reads the Natural Earth rings written by gen-landfine.mjs)
   Method: rasterise the land at 0.1 degree, grow it by one cell (a margin off the coast), carve the straits that the margin would close (Gibraltar, Dover,
   Singapore, Bab el Mandeb), find the shortest sea path (A*) between the gates of each route, thin it by line of sight, and join the two canals (Suez, Panama)
   as fixed polylines. The first and last point of a route are the real ports; the few kilometres from the sea to a river port (Antwerp, Hamburg) are the
   only stretches allowed to touch land. Port positions are public geography, not survey data. */
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(process.argv[2], "utf8");
const RINGS = JSON.parse(src.slice(src.indexOf("= [") + 2, src.indexOf("];") + 1)).map((s) => { let x = 0, y = 0; return s.split(" ").map((p) => { const [a, b] = p.split(",").map(Number); x += a; y += b; return [x / 100, y / 100]; }); });

const RES = 0.1, W = 3600, H = 1800;
const land = new Uint8Array(W * H);
// scanline fill, even-odd over every ring
for (let row = 0; row < H; row++) {
  const lat = 90 - (row + 0.5) * RES;
  const xs = [];
  for (const r of RINGS) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [x1, y1] = r[i], [x2, y2] = r[j];
    if ((y1 > lat) !== (y2 > lat)) xs.push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1));
  }
  xs.sort((a, b) => a - b);
  for (let k = 0; k + 1 < xs.length; k += 2) {
    const c0 = Math.max(0, Math.round((xs[k] + 180) / RES)), c1 = Math.min(W - 1, Math.round((xs[k + 1] + 180) / RES));
    for (let c = c0; c < c1; c++) land[row * W + c] = 1;
  }
}
const cell = (lon, lat) => [Math.min(W - 1, Math.max(0, Math.floor((lon + 180) / RES))), Math.min(H - 1, Math.max(0, Math.floor((90 - lat) / RES)))];
let blocked = Uint8Array.from(land);
for (let pass = 0; pass < 2; pass++) {   // grow the land by two cells (0.2 degrees) so no lane hugs a coast
  const next = Uint8Array.from(blocked);
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W; x++) {
    if (blocked[y * W + x]) continue;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (blocked[(y + dy) * W + ((x + dx + W) % W)]) { next[y * W + x] = 1; dy = 2; break; }
  }
  blocked = next;
}
const carve = (x0, x1, y0, y1) => { const [a, b] = cell(x0, y1), [c, d] = cell(x1, y0); for (let y = b; y <= d; y++) for (let x = a; x <= c; x++) if (!land[y * W + x]) blocked[y * W + x] = 0; };   // sea cells only
carve(32.3, 32.7, 28.7, 30.0);     // Gulf of Suez head
carve(-79.2, -78.9, 9.3, 9.6);     // Colon approach
carve(-79.6, -79.4, 8.7, 8.95);    // Balboa approach

const nearestSea = (lon, lat) => {
  const [cx, cy] = cell(lon, lat);
  for (let r = 0; r < 60; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
    const x = (cx + dx + W) % W, y = cy + dy; if (y < 0 || y >= H) continue;
    if (!blocked[y * W + x]) return [x, y];
  }
  throw new Error(`no sea near ${lon},${lat}`);
};
const lonlat = ([x, y]) => [-180 + (x + 0.5) * RES, 90 - (y + 0.5) * RES];

class Heap { constructor() { this.a = []; } push(k, v) { const a = this.a; a.push([k, v]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } } pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; } get size() { return this.a.length; } }
function astar(s, g) {
  const key = (x, y) => y * W + x, came = new Map(), gs = new Map([[key(...s), 0]]);
  const h = (x, y) => Math.hypot(Math.min(Math.abs(x - g[0]), W - Math.abs(x - g[0])), y - g[1]);
  const open = new Heap(); open.push(h(...s), s);
  while (open.size) {
    const [, [x, y]] = open.pop(), k = key(x, y);
    if (x === g[0] && y === g[1]) break;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = (x + dx + W) % W, ny = y + dy; if (ny < 0 || ny >= H || blocked[ny * W + nx]) continue;
      const c = gs.get(k) + (dx && dy ? 1.4142 : 1), nk = key(nx, ny);
      if (c < (gs.get(nk) ?? Infinity)) { gs.set(nk, c); came.set(nk, k); open.push(c + h(nx, ny), [nx, ny]); }
    }
  }
  const path = []; let k = key(...g);
  if (!came.has(k) && !(s[0] === g[0] && s[1] === g[1])) throw new Error("no path");
  while (k !== undefined) { path.push([k % W, Math.floor(k / W)]); k = came.get(k); }
  return path.reverse();
}
const clear = (a, b) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])) * 2 + 1; for (let i = 0; i <= n; i++) { const x = Math.round(a[0] + ((b[0] - a[0]) * i) / n), y = Math.round(a[1] + ((b[1] - a[1]) * i) / n); if (blocked[y * W + (x + W) % W]) return false; } return true; };
function thin(p) {
  const out = [p[0]]; let i = 0;
  while (i < p.length - 1) { let j = p.length - 1; while (j > i + 1 && !clear(p[i], p[j])) j--; out.push(p[j]); i = j; }
  return out;
}
const leg = (a, b) => { try { return thin(astar(nearestSea(...a), nearestSea(...b))).map(lonlat); } catch (e) { console.log('FAILED leg', a, b); throw e; } };

// narrow straits (a few km wide, finer than the 0.1 degree grid) are fixed lanes checked against the land by hand
const GIBRALTAR = [[-4.6, 36.3], [-5.35, 35.98], [-5.9, 35.95], [-6.6, 36.2]];
const DOVER = [[0.8, 50.4], [1.35, 50.95], [1.65, 51.05], [2.0, 51.3], [3.0, 51.75]];
const BAB = [[44.6, 12.4], [43.4, 12.55], [43.0, 13.0], [42.5, 14.2]];
const MALACCA = [[104.35, 1.4], [104.0, 1.22], [103.75, 1.13], [103.45, 1.15], [103.15, 1.3], [102.8, 1.6], [102.3, 2.0], [101.7, 2.45], [101.1, 2.85], [100.6, 3.5], [99.9, 4.7], [98.8, 5.7], [97.8, 5.9]];
const SCHELDT = [[3.2, 51.42], [3.55, 51.4], [3.9, 51.37], [4.25, 51.3], [4.35, 51.25]];
const SUEZ = [[34.6, 27.2], [33.9, 27.8], [33.4, 28.3], [32.95, 29.0], [32.65, 29.6], [32.55, 29.95], [32.52, 30.5], [32.36, 31.25]];   // the Gulf of Suez (finer than the grid), then the canal
const FRISIAN = [[3.5, 52.6], [4.4, 53.0], [5.8, 53.8], [7.0, 54.1], [7.9, 54.0]];
const PANAMA = [[-79.57, 8.93], [-79.68, 9.08], [-79.83, 9.24], [-79.92, 9.37]];
// each route: ports and gates in order; a canal is spliced in as a fixed polyline
const SPEC = {
  eudr: [[-80.0, -2.2], [-79.5, 8.8], { canal: PANAMA }, [0.0, 50.0], { canal: DOVER }, { canal: SCHELDT }],
  cbam: [[72.8, 18.95], [45.5, 12.2], { canal: BAB }, [35.2, 26.4], { canal: SUEZ }, [-4.2, 36.4], { canal: GIBRALTAR }, [0.0, 50.0], { canal: DOVER }, [3.55, 52.0], { to: [4.05, 51.95] }],
  dpp: [[121.9, 29.9], [105.0, 1.9], { canal: MALACCA }, [45.5, 12.2], { canal: BAB }, [35.2, 26.4], { canal: SUEZ }, [-4.2, 36.4], { canal: GIBRALTAR }, [0.0, 50.0], { canal: DOVER }, { canal: FRISIAN }, { to: [9.95, 53.52] }],
  reach: [[-94.9, 29.4], [-80.0, 24.6], [0.0, 50.0], { canal: DOVER }, { canal: SCHELDT }],
  ppwr: [[107.0, 10.5], [105.0, 1.9], { canal: MALACCA }, [45.5, 12.2], { canal: BAB }, [35.2, 26.4], { canal: SUEZ }, [-0.2, 39.45], { to: [-0.31, 39.45] }],
};
const out = {};
for (const [id, items] of Object.entries(SPEC)) {
  const pts = []; let prev = null;
  for (const it of items) {
    if (it.to) { pts.push(it.to); continue; }
    if (it.canal) { pts.push(...it.canal); prev = it.canal[it.canal.length - 1]; continue; }
    if (prev) { const seg = leg(prev, it); pts.push(...seg.slice(1)); } else pts.push(it);
    prev = it;
    // the real port position closes the route
    if (pts.length) pts[pts.length - 1] = it.canal ? pts[pts.length - 1] : it;
  }
  // thin to 0.01 degree and drop repeats
  const clean = pts.map(([a, b]) => [Math.round(a * 100) / 100, Math.round(b * 100) / 100]).filter((p, i, r) => i === 0 || p[0] !== r[i - 1][0] || p[1] !== r[i - 1][1]);
  out[id] = clean;
  console.log(id, clean.length, "points");
}
writeFileSync("features/landing/home/lib/sealanes.ts", `/* The five example sea lanes of the shipment map, generated by scripts/gen-sealanes.mjs from Natural Earth 1:50m land (public domain): shortest sea paths between the
   ports and gates (Panama, Suez, Gibraltar, the Channel, Singapore, Bab el Mandeb), kept off the land by a margin, joined through the two canals. [lon, lat]. Illustration. */
export const SEA_LANES: Record<string, [number, number][]> = ${JSON.stringify(out)};
`);
