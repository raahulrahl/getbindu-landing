import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], weight: ["400", "500"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Bindu: Trade Compliance Software for EU Import & Export",
  description:
    "Describe a shipment once. Bindu works out which EU rules apply, gathers the proof from your suppliers and files it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
