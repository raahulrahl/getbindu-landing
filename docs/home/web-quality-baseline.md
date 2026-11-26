# Bindu Homepage (`/`): Web Quality Baseline & Potential Fixes Audit

Baseline audit captured following the completion of Round 41 on branch `web-quality` (branched from `home-brain`).
Measured against a production build (`pnpm build` via Next.js webpack, started on `http://localhost:3031`).
Per user instruction: **No code fixes have been applied. All metrics, bottlenecks, and potential fixes are documented below.**

---

## 1. Measured Baseline Numbers

### Lighthouse Audit (Production Build, Port 3031)

| Metric / Category | Desktop (Light) | Desktop (Dark) | Mobile (Light) | Mobile (Dark) | Good Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Performance Score** | **94** / 100 | **98** / 100 | **57** / 100 | **57** / 100 | ≥ 85 |
| **Accessibility Score** | **100** / 100 | **100** / 100 | **100** / 100 | **100** / 100 | 100 |
| **Best Practices Score** | **100** / 100 | **100** / 100 | **100** / 100 | **100** / 100 | 100 |
| **SEO Score** | 69 / 100 * | 69 / 100 * | 69 / 100 * | 69 / 100 * | N/A (noindex) |
| **Agentic Browsing** | **100** / 100 | **100** / 100 | **100** / 100 | **100** / 100 | 100 |
| **FCP (First Contentful Paint)** | 0.4 s | 0.4 s | 1.7 s | 1.7 s | ≤ 1.8 s |
| **LCP (Largest Contentful Paint)**| 1.4 s | 0.4 s | **6.2 s** | **6.1 s** | ≤ 2.5 s |
| **TBT (Total Blocking Time)** | 100 ms | 100 ms | **810 ms** | **820 ms** | ≤ 200 ms |
| **CLS (Cumulative Layout Shift)**| 0.003 | 0.003 | 0.000 | 0.000 | ≤ 0.1 |
| **Speed Index** | 1.3 s | 1.2 s | 3.1 s | 3.0 s | ≤ 3.4 s |

*\* Note on SEO score: `robots.txt` disallows indexing by design (`CLAUDE.md`: "this copy must never be indexed").*

---

### Unthrottled Browser Performance Trace (CDP Trace)

| Environment / Mode | FCP | LCP | CLS | Load Long Tasks | Load Long Task Total | Scroll Long Tasks | Max Scroll Task |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Desktop Light** | 276 ms | 2,936 ms | 0.0044 | 3 tasks | 346 ms | 0 tasks | 0 ms |
| **Desktop Dark** | 252 ms | 2,964 ms | 0.0044 | 5 tasks | 633 ms | 1 task | 65 ms |
| **Mobile Light** | 232 ms | 2,868 ms | 0.0000 | 5 tasks | 609 ms | 0 tasks | 0 ms |
| **Mobile Dark** | 360 ms | 2,984 ms | 0.0000 | 3 tasks | 499 ms | 1 task | 61 ms |

---

### Resource & Payload Breakdown

- **Total Page Weight (uncompressed initial assets)**: ~1.42 MB
- **Total JavaScript transferred**: **492.2 KB** across 21 script requests (exceeds 300 KB budget).
- **Total Fonts transferred**: **67.8 KB** across 3 webfonts.
  - `Inter` Latin (`/_next/static/media/e4af272ccee01ff0-s.p.woff2`): 47.6 KB
  - `IBM Plex Mono 400` (`/_next/static/media/cdec7fa3927eb560.p.woff2`): 10.1 KB
  - `IBM Plex Mono 500` (`/_next/static/media/af5dd2b5d3f396f3.p.woff2`): 10.1 KB
- **Largest Requests**:
  1. `/home/images/port-cargo.webp` (Finale photo): **251.5 KB** (Image)
  2. `/_next/static/chunks/e31cea27.896b4f1789aba997.js` (Three.js chunk): **98.1 KB** compressed (365.9 KB raw)
  3. `/_next/static/chunks/e8b8ea12.c582a404c250bcc7.js` (Three.js chunk): **85.6 KB** compressed (350.2 KB raw)
  4. `/_next/static/chunks/app/(en)/(home)/page-22ff712e2facb684.js` (Home Page bundle): **77.1 KB** compressed
  5. `/_next/static/chunks/3154-b0ae585122a528a0.js` (GSAP / core chunks): **65.8 KB** compressed
  6. `/_next/static/chunks/f64ce94c-3368aad9f4c03903.js`: **63.0 KB** compressed
  7. `/_next/static/media/e4af272ccee01ff0-s.p.woff2` (Inter font): **47.6 KB**
  8. `/_next/static/css/f0a303c2ebb4cce4.css` (Aggregated stylesheets): **26.0 KB** compressed
  9. `/_next/static/chunks/d5df7396-81dcd2df2af3f95e.js`: **19.8 KB** compressed
  10. `/` (Document SSR HTML): **18.4 KB**

---

## 2. LCP Element Identification

- **Element**: `<p class="t-body-lg t-soft hero-sub">`
- **Selector**: `main#main > section#top > div.container > p.t-body-lg`
- **Text content**: `"Bindu works out which EU rules apply to your goods, gathers the proof from your suppliers and files it. Every line traces back to the supplier document behind it."`
- **Size / Dimensions**: 544px × 86px (area 72,044 px²)
- **LCP Subpart Breakdown**:
  - **TTFB (Time to First Byte)**: 28.5 ms (Excellent)
  - **Resource Load Delay**: 0 ms (Text node, no external resource required)
  - **Resource Load Duration**: 0 ms
  - **Element Render Delay**: **2,936 – 2,979 ms**
- **Root Cause of Render Delay**:
  In `features/landing/home/components/Intro.tsx:8-33`, the `<Intro />` component sets `data-intro="on"` and orchestrates a 7.5-second motion sequence. During this intro phase, the hero sub-headline and CTA buttons have their opacity suppressed and entry delayed by CSS keyframe delays (`Hero.tsx:82` inline `style={{ animationDelay: '${120 + 90 * n}ms' }}`). The element only achieves its final paint once the intro choreography reveals it or the intro is finished.

---

## 3. Top 10 Costs by Impact (with file:line)

### 1. Intro Motion Sequence & Hero Sub-Headline Render Delay
- **Impact**: Delays LCP to ~2.95s on desktop and 6.1s–6.2s on mobile lab.
- **File:Line**:
  - `features/landing/home/components/Hero.tsx:82-88`
  - `features/landing/home/components/Intro.tsx:29-34`
  - `app/(en)/(home)/layout.tsx:21`
- **Why it costs**: `hero-sub` is masked and delayed by the initial `data-intro="on"` attribute and inline word stagger delays.
- **Potential Fix**:
  - Allow `hero-sub` or `hero-h` to paint with initial static opacity or minimal transition rather than holding off paint for >2.8s.
  - On mobile, detect touch/smaller viewport and reduce or bypass the intro hold so the hero text paints immediately.

---

### 2. Finale Section Photo Eager Fetch (`port-cargo.webp`)
- **Impact**: **251.5 KB** transferred during initial load for an image at the very bottom of the page.
- **File:Line**: `features/landing/home/components/Closing.tsx:182`
- **Why it costs**:
  `<section ref={pin} className={...} style={{ "--photo": "url(/home/images/port-cargo.webp)" } as CSSProperties}>`
  Setting `url(...)` as an inline CSS property on a section forces the browser to download the 251.5 KB image during the initial parse, competing with above-the-fold assets.
- **Potential Fix**:
  - Use an `IntersectionObserver` in `Closing.tsx` to set `--photo` only when the finale section enters within 400px of the viewport.
  - Provide a responsive AVIF/WebP image or lower-resolution fallback (e.g., compressed to ~60-80 KB).

---

### 3. Monolithic Client-Side Tree in `HomePage`
- **Impact**: **492.2 KB** JS bundle parsed and executed during hydration; **810–820 ms TBT** on mobile.
- **File:Line**: `features/landing/home/home-page.tsx:26-38`
- **Why it costs**:
  `HomePage` statically imports all 13 sections (`Hero`, `ShipmentJourney`, `Theatre`, `Ask`, `Pricing`, `Faq`, `Finale`, `Examples`, `Statement`, `BeforeAfter`, `Intro`, `Guide`, `Rail`). Even though sections 4 through 13 are well below the fold, their entire component definitions, SVG paths, and logic are bundled into the primary client chunk.
- **Potential Fix**:
  - Split below-the-fold interactive sections with `dynamic(() => import(...), { ssr: true })` or mount them conditionally when nearing viewport.

---

### 4. Dual Three.js Bundles (`365.9 KB` + `350.2 KB` uncompressed)
- **Impact**: Two hefty Three.js chunks are generated in `.next/static/chunks/` (`e31cea27...` and `e8b8ea12...`).
- **File:Line**:
  - `features/landing/home/hero/scene.ts:7`
  - `features/landing/home/lib/particles.ts:268`
- **Why it costs**:
  `scene.ts` imports full Three.js primitives (`WebGLRenderer`, `BufferGeometry`, `RawShaderMaterial`, `OrthographicCamera`, etc.). Additionally, `particles.ts` has a duplicate dynamic import of Three.js even though `particles.ts` is not imported anywhere on the homepage.
- **Potential Fix**:
  - Delete or clean up unused `features/landing/home/lib/particles.ts`.
  - Consider lightweight WebGL libraries (OGL was used in the original mockup and is ~30 KB vs ~360 KB Three.js).

---

### 5. GSAP Plugins Initial Load & Lenis Wheel Contention
- **Impact**: ~120 KB JS overhead and main-thread evaluation cost on initial mount.
- **File:Line**:
  - `features/landing/home/lib/motion.ts:1-7, 23-33`
  - `features/landing/home/home-page.tsx:54-57`
- **Why it costs**:
  `motion.ts` immediately registers `ScrollTrigger` and `SplitText`, creates a `Lenis` smooth-scroll instance, and attaches it to `gsap.ticker.add(tick)`. On initial load, this executes before the user even begins scrolling.
- **Potential Fix**:
  - Delay `startSmoothScroll()` until first user scroll/pointer event or via `requestIdleCallback`.
  - Defer `SplitText` registration until heading sections intersect.

---

### 6. Dynamic Theatre Plugins Chunking
- **Impact**: 5 specialized GSAP plugins (`DrawSVGPlugin`, `MotionPathPlugin`, `TextPlugin`, `ScrambleTextPlugin`, `MorphSVGPlugin`) loaded dynamically.
- **File:Line**:
  - `features/landing/home/lib/theatre-fx.ts:8-15`
  - `features/landing/home/components/Theatre.tsx:49`
- **Current Observation**:
  `Theatre.tsx` correctly loads `theatre-fx.ts` via `IntersectionObserver` when entering view.
- **Potential Fix**:
  - Ensure Webpack properly isolates this chunk without pulling common GSAP helpers into the main entry bundle.

---

### 7. Google Fonts Preloading & Font Display Strategy
- **Impact**: 67.8 KB across 3 webfonts downloaded during load.
- **File:Line**:
  - `app/document-shell.tsx:18-60`
  - `app/(en)/(home)/layout.tsx:11-18`
- **Why it costs**:
  `app/document-shell.tsx` instantiates 5 Google fonts (`Geist`, `Inter`, `JetBrains_Mono`, `Source_Serif_4`, `Newsreader`). While the homepage layout only applies `Inter` and `IBM_Plex_Mono`, root layout font declarations can inject extraneous preloads into `<head>`.
- **Potential Fix**:
  - Ensure only `Inter` (weights 400) and `IBM_Plex_Mono` (weights 400, 500) emit `<link rel="preload">` on `/`.
  - Define explicit font fallbacks with `size-adjust` to preserve visual stability.

---

### 8. PNG Logo in SVG `<image>` Element
- **Impact**: Extra unoptimized image request.
- **File:Line**: `features/landing/home/components/Ask.tsx:212`
- **Why it costs**:
  `<image href="/home/bindu-logo-64.png" x="400" y="170" width="40" height="40" />` requests the 3.8 KB PNG instead of the 3.2 KB WebP (`/home/bindu-logo-64.webp`) or an inline SVG mark.
- **Potential Fix**:
  - Change `href="/home/bindu-logo-64.png"` to `href="/home/bindu-logo-64.webp"`.

---

### 9. 17 Global and Component Stylesheets
- **Impact**: 26 KB compressed CSS across 17 distinct files; parse overhead during initial render.
- **File:Line**: `features/landing/home/home-page.tsx:6-43`
- **Why it costs**:
  Stylesheets from successive historical rounds (`r2-cobalt.css`, `r2-hero-cta.css`, `r10-hero.css`, `r13-hero.css`, `r13-cta.css`, `r13-pricing.css`, etc.) are imported simultaneously. Several selectors are superseded or redundant.
- **Potential Fix**:
  - Consolidate legacy round CSS into modular component sheets (`Hero.module.css`, `Pricing.module.css`, etc.) and purge unused legacy selectors.

---

### 10. Long Tasks During Scroll & Backdrop-Filter Frame Cost
- **Impact**: Main-thread long tasks of 61ms–65ms measured during full page wheel scrolling in Dark Theme.
- **File:Line**:
  - `features/landing/home/styles/story.css:40-42`
  - `features/landing/home/components/MapLayer.tsx:48-100`
  - `features/landing/home/lib/theatre-fx.ts:37`
- **Why it costs**:
  During scrolling, Lenis triggers GSAP `ScrollTrigger.update`, which calculates transforms, feathered `backdrop-filter: blur(8px)` layer recalculations (added in r41-1), and Full Circle theatre scrub interpolations.
- **Potential Fix**:
  - Ensure feathered blur masks do not invalidate composite layers continuously during scroll.
  - As evaluated in Round 41, fall back to cached blurred bitmap (`.scene-soft`) if frame time exceeds limits.

---

## 4. Summary & Verification Checklist

- [x] Branch `web-quality` checked out from clean `home-brain`.
- [x] Production build generated cleanly (`pnpm exec next build --webpack`).
- [x] Production server run on port 3031 (`pnpm exec next start --port 3031`).
- [x] Lighthouse audit collected across 4 profiles (Desktop Light: 94, Desktop Dark: 98, Mobile Light: 57, Mobile Dark: 57).
- [x] Performance traces collected for initial load and full-page wheel scrolling across all 4 profiles.
- [x] LCP element identified and render delay profiled.
- [x] Top 10 costs analyzed and documented with exact file:line references.
- [x] **No codebase modifications made** (per instruction: "dont fix anything for now just log it somewhere the potential fixes etc").
