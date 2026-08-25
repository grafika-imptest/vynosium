import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Jaké cookies web používá a jak spravovat souhlas.",
  alternates: { canonical: absoluteUrl("/cookies") },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPage
      label="COOKIES"
      title="Cookies a měření"
      intro="Web používá cookies nezbytné pro provoz a — po udělení souhlasu — také analytické a marketingové."
      sections={[
        {
          heading: "Nezbytné cookies",
          paragraphs: ["Zajišťují základní funkčnost webu. Nelze je vypnout a nevyžadují souhlas."],
        },
        {
          heading: "Analytické cookies",
          paragraphs: [
            "Měří návštěvnost a chování na webu. Spouštějí se až po souhlasu (Consent Mode v2).",
          ],
        },
        {
          heading: "Marketingové cookies",
          paragraphs: [
            "Slouží k měření výkonu reklamních kampaní a k remarketingu. Bez souhlasu se nespouštějí.",
          ],
        },
        {
          heading: "Změna souhlasu",
          paragraphs: [
            "Souhlas lze kdykoli změnit nebo odvolat v nastavení cookies v patičce webu.",
            "Správa souhlasu se implementuje přes GTM — do jeho nasazení jsou marketingové tagy vypnuté.",
          ],
        },
      ]}
    />
  );
}
