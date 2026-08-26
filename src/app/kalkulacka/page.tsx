import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { Calculator } from "@/components/sections/Calculator";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/lib/data/site";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Investiční kalkulačka",
  description:
    "Spočítejte si modelovou velikost investice, orientační cashflow, zhodnocení a hodnotu majetku podle vlastního kapitálu, financování a horizontu.",
  alternates: { canonical: absoluteUrl("/kalkulacka") },
};

/**
 * Standalone calculator URL (§3/08) — exists so remarketing and PPC can
 * point straight at the interaction that converts best.
 */
export default function CalculatorPage() {
  return (
    <>
      <SetHeaderVariant variant="dark" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Kalkulačka", path: "/kalkulacka" },
        ])}
      />

      <PageIntro
        label="KALKULAČKA"
        tone="dark"
        title="Spočítejte si, co vaše peníze v nemovitostech zvládnou."
        lede="Zadejte vlastní kapitál, míru financování a horizont. Model ukáže velikost investice, měsíční cashflow, zhodnocení i pásmo scénářů — včetně toho spodního."
      />
      <Calculator />
      <Faq
        items={FAQ.slice(6, 12)}
        heading="Jak kalkulačka počítá"
        tone="light"
      />
      <FinalCta />
    </>
  );
}
