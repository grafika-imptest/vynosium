import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Undecided } from "@/components/sections/Undecided";
import { WhyRealEstate } from "@/components/sections/WhyRealEstate";
import { WhyVynosium } from "@/components/sections/WhyVynosium";
import { Comparison } from "@/components/sections/Comparison";
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
        label="PROCES"
        title="Od první konzultace k výnosu."
        lede="Šest kroků, které na sebe navazují. Každý má vlastní výstup, který dostanete písemně — a žádný nezačíná dřív, než je uzavřený ten předchozí."
      />

      {/*
        This page took over what the homepage was carrying: the full six-step
        process was already here, and the argument for real estate as an asset
        class plus the route for readers who have not picked a strategy came
        down from the homepage in the September review. They belong to someone
        who is already reading about the mechanics, not to a first visit.
      */}
      <AboutIntro />
      <ProcessSteps />
      <WhyRealEstate />
      <Comparison />
      <WhyVynosium />
      <Undecided />
      <Faq items={FAQ.slice(0, 6)} heading="Nejčastější otázky k procesu" />
      <FinalCta />
    </>
  );
}
