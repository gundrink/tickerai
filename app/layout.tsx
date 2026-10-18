import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Outfit } from "next/font/google";
import { AppKitProvider } from "@/lib/appkit";
import "./globals.css";

const ui = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TickerAI",
  description: "Every observed candidate wearing a ticker, ranked by liquidity and trader evidence. Heuristic, not proof.",
  icons: { icon: "/mark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ui.variable} ${display.variable} ${mono.variable}`}>
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}
