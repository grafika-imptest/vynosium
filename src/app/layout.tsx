import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { GLStageProvider } from "@/components/gl/GLStage";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { HeaderVariantProvider } from "@/components/layout/HeaderVariantContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCta } from "@/components/layout/MobileCta";
import { Preloader } from "@/components/sections/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/data/site";
import { SITE_URL, absoluteUrl, organizationSchema, websiteSchema } from "@/lib/seo";

/**
 * Two families, no third. latin-ext is mandatory — Czech diacritics
 * (ě š č ř ž ý á í é ú ů ó) must not fall back to a system face.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Najdeme příležitost, spočítáme ji a celé investování zařídíme — rekonstrukce a prodej, pasivní příjem z pronájmu, zhodnocení kapitálu i budování portfolia. Od 300 000 Kč.",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Vyberte si investiční cestu, spočítejte si modelový výnos a prohlédněte si aktuální příležitosti.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: absoluteUrl("/") },
};

export const viewport: Viewport = {
  themeColor: "#102a43",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${jakarta.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />

        <a
          href="#obsah"
          className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-[var(--radius-pill)] focus:bg-emerald-cta focus:px-5 focus:py-3 focus:text-white"
        >
          Přejít na obsah
        </a>

        <GLStageProvider>
          <SmoothScroll>
            <HeaderVariantProvider>
              <CustomCursor />
              <Preloader />
              <Header />
              {/*
                No z-index here on purpose: the GL canvas sits at z-1 so it
                can paint over the navy background of shader sections, while
                each section's own content is lifted to z-2. Outside the
                registered scissor rectangles the canvas is transparent, so
                light sections are unaffected.
              */}
              <main id="obsah">{children}</main>
              <Footer />
              <MobileCta />
            </HeaderVariantProvider>
          </SmoothScroll>
        </GLStageProvider>
      </body>
    </html>
  );
}
