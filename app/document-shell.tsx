/**
 * The document every root layout renders: <html lang>, the fonts and the
 * global stylesheet. Nothing else.
 *
 * Split out of RootShell (bindu-eudr present/64 P3) so the public-record root,
 * app/(public-link), can share the exact same fonts and tokens without
 * importing anything that pulls in analytics: RootShell adds the consent
 * banner, the analytics scripts and the app providers (PostHog lives there) on
 * top of this; the public-record root adds only the theme.
 */

import {
  Geist,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
  Newsreader,
} from "next/font/google";
import { cn } from "@shelley/ui/lib/utils";
import "./globals.css";

// Font stack: Geist for Latin UI text + system Chinese fonts for zh content.
// (Desktop app still ships Inter via apps/desktop/src/renderer/src/globals.css —
// keep the CJK fallback tail in sync across both files; the two now differ by
// family on purpose.) next/font produces a `__Geist_xxx` family with a synthetic
// size-adjusted fallback face to prevent FOUT layout shift.
// Currently covers English + Simplified Chinese. When ja/ko i18n lands, extend
// the tail with Hiragino Kaku Gothic ProN / Yu Gothic / Apple SD Gothic Neo / Malgun Gothic.
// Per-character fallback: Latin chars render with Inter, Chinese chars with
// PingFang SC (macOS) / Microsoft YaHei (Windows) / Noto Sans CJK SC (Linux).
const geist = Geist({
  subsets: ["latin"],
  preload: false, // the homepage does not use it; other pages load it on use
  variable: "--font-sans",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "PingFang SC",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "sans-serif",
  ],
});
// Inter — the actual UI + body workhorse. The design token --font-sans in
// styles/bindu-colors-and-type.css resolves to the real family name "Inter", so
// this next/font load is what makes that token render a bundled webfont instead
// of falling back to the visitor's system sans. Italic loaded for headline em
// accents now that display headlines are Inter, not Newsreader.
const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});
// Mono font has no explicit CJK fallback: CJK chars in code blocks are inherently
// non-aligned with a mono grid (Chinese is proportional), so listing CJK fonts
// here would falsely signal alignment guarantees. Browser default fallback handles
// the rare mixed case correctly.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  preload: false, // the homepage does not use it; other pages load it on use
  variable: "--font-mono",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "monospace",
  ],
});
// Editorial serif used for onboarding headlines. Italic support for h1 em
// accents (e.g. "...on one shared board."). Only loaded on routes that
// render the font; layout-shift-prevention handled by next/font's synthetic
// fallback metrics, same as Inter.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  preload: false, // the homepage does not use it; other pages load it on use
  style: ["normal", "italic"],
  variable: "--font-serif",
  fallback: [
    "ui-serif",
    "Iowan Old Style",
    "Apple Garamond",
    "Baskerville",
    "Times New Roman",
    "serif",
  ],
});
// Display face — Newsreader. An editorial, highly legible serif (Legora-style)
// that carries the bindu wordmark, hero headlines, page titles, and seal text
// on /verify. Variable weight + optical sizing (opsz), so it holds up from
// 14px code chips to 96px heroes. Italic available for "em" accents inside
// display headlines (e.g. "Ship to Europe without the <em>compliance bill.</em>").
const newsreader = Newsreader({
  subsets: ["latin"],
  preload: false, // the homepage does not use it; other pages load it on use
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  fallback: [
    "Source Serif 4",
    "ui-serif",
    "Iowan Old Style",
    "Baskerville",
    "Georgia",
    "serif",
  ],
});

export function DocumentShell({
  lang,
  children,
}: {
  /** BCP 47 tag for this tree's root layout. */
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        geist.variable,
        inter.variable,
        jetbrainsMono.variable,
        sourceSerif.variable,
        newsreader.variable,
      )}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
