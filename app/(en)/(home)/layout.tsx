/**
 * Layout for the homepage only. The homepage has its own nav and footer, so it
 * is served outside app/(en)/(landing) and never gets LandingChrome. The
 * wrapper's class scopes every homepage style; the head script sets the theme
 * on the wrapper before first paint.
 */

import { Geist, JetBrains_Mono } from "next/font/google";
import { LandingJsonLd } from "../../landing-chrome";

const display = Geist({
  subsets: ["latin"],
  variable: "--home-font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--home-font-mono",
  preload: false,
});

// Use the saved theme before the page paints.
const PRE_PAINT = `(function(){var r=document.currentScript.parentElement;try{r.dataset.theme=localStorage.getItem("bindu-theme")==="dark"?"dark":"light"}catch(e){}})()`;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingJsonLd />
      <div
        className={`bindu-home ${display.variable} ${mono.variable}`}
        data-theme="light"
        data-rm=""
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        {children}
      </div>
    </>
  );
}
