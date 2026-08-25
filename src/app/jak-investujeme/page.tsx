import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { WhyVynosium } from "@/components/sections/WhyVynosium";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/lib/data/site";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jak investujeme",
  description:
    "Šest kroků od první konzultace k výnosu: cíl, příležitost, ekonomika, realizace, pronájem nebo prodej a pokračování portfolia.",
  alternates: { canonical: absoluteUrl("/jak-investujeme") },
};

export default function ProcessPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd data={faqSchema(FAQ.slice(0, 6))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Jak investujeme", path: "/jak-investujeme" },
        ])}
      />

      <PageIntro
        index="—"
        label="PROCES"
        title="Od první konzultace k výnosu."
        lede="Šest kroků, které na sebe navazují. Každý má vlastní výstup, který dostanete písemně — a žádný nezačíná dřív, než je uzavřený ten předchozí."
      />

      <ProcessSteps />
      <WhyVynosium />
      <Faq items={FAQ.slice(0, 6)} index="—" heading="Nejčastější otázky k procesu" />
      <FinalCta />
    </>
  );
}
