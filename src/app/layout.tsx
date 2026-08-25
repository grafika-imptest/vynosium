import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { GLStageProvider } from "@/components/gl/GLStage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/sections/Preloader";
import { HeaderVariantProvider } from "@/components/layout/HeaderVariantContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, organizationSchema, websiteSchema } from "@/lib/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

const DEFAULT_TITLE = "Vynósium | Chytrá cesta k výnosům z nemovitostí";
const DEFAULT_DESCRIPTION =
  "Vynósium pomáhá investorům zhodnotit byt, vybudovat pasivní příjem, zhodnotit kapitál nebo budovat dlouhodobé portfolio nemovitostí — na základě čísel, ne slibů.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Vynósium",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "Vynósium",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="cs"
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <GLStageProvider>
          <SmoothScroll>
            <HeaderVariantProvider>
              <Preloader />
              <Header />
              <main className="relative z-10">{children}</main>
              <div className="relative z-10">
                <Footer />
              </div>
            </HeaderVariantProvider>
          </SmoothScroll>
        </GLStageProvider>
      </body>
    </html>
  );
}
