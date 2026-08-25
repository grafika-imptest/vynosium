import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { GLStageProvider } from "@/components/gl/GLStage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/sections/Preloader";
import { HeaderVariantProvider } from "@/components/layout/HeaderVariantContext";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vynosium.cz"),
  title: {
    default: "Vynósium | Investujte do nemovitostí způsobem, který odpovídá vašim cílům",
    template: "%s | Vynósium",
  },
  description:
    "Vynósium pomáhá investorům zhodnotit byt, vybudovat pasivní příjem, zhodnotit kapitál nebo budovat dlouhodobé portfolio nemovitostí — na základě čísel, ne slibů.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="cs"
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
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
