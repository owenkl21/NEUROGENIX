import type { Metadata, Viewport } from "next";
import { DM_Mono, Instrument_Sans } from "next/font/google";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { DialogProvider } from "@/components/dialogs/DialogProvider";
import { PreviewBar } from "@/components/layout/PreviewBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.metaTitle,
  description: site.metaDescription,
  robots: { index: false, follow: false },
  openGraph: {
    title: site.metaTitle,
    description: site.tagline.join(" "),
    type: "website",
    locale: "en_ZA",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1a21" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${instrument.variable} ${dmMono.variable}`}>
      <body className="grain min-h-dvh">
        <a href="#main" className="skip-link rounded-full bg-navy px-5 py-3 text-sm font-medium text-on-navy">
          Skip to content
        </a>
        <SmoothScroll>
          <DialogProvider>
            <PreviewBar />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </DialogProvider>
        </SmoothScroll>
        <div id="print-guide" aria-hidden="true" />
      </body>
    </html>
  );
}
