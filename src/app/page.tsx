import { Hero } from "@/components/sections/Hero";
import { TrustNumbers } from "@/components/sections/TrustNumbers";
import { PathSelector } from "@/components/sections/PathSelector";
import { Undecided } from "@/components/sections/Undecided";
import { WhyRealEstate } from "@/components/sections/WhyRealEstate";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Calculator } from "@/components/sections/Calculator";
import { Opportunities } from "@/components/sections/Opportunities";
import { WhyVynosium } from "@/components/sections/WhyVynosium";
import { References } from "@/components/sections/References";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/lib/data/site";
import { faqSchema } from "@/lib/seo";

/**
 * The narrative homepage (§2).
 *
 * Order matters: thesis → proof → self-selection → simulation → inventory
 * → evidence → decision. By the time the visitor reaches the projects
 * they are not browsing, they have a mandate.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <Hero />
      <TrustNumbers />
      <PathSelector />
      <Undecided />
      <WhyRealEstate />
      <AboutIntro />
      <ProcessSteps />
      <Calculator index="08" />
      <Opportunities index="09" compact />
      <WhyVynosium />
      <References />
      <Faq index="12" items={FAQ} />
      <FinalCta />
    </>
  );
}
