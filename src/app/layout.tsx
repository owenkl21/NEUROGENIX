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
  // Edge to edge on phones with a notch or Dynamic Island; the header, preview
  // bar, footer and dialogs pad themselves with the safe-area insets.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#121011" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${instrument.variable} ${dmMono.variable}`}>
      <body className="min-h-dvh">
        {/* A real element rather than body::after: Safari 26 hit-tests the top
            edge to colour its status bar, and a pseudo-element counts as the
            body itself, hiding the header from it. */}
        <div className="grain" aria-hidden="true" />
        {/* Without JS nothing would ever reveal, so show it as it would settle. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}.mask-line{transform:none!important}"}</style>
        </noscript>
        <a href="#main" className="skip-link rounded-full bg-deep px-5 py-3 text-sm font-medium text-on-deep">
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
