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
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustNumbers />
      <PathSelector />
      <Undecided />
      <WhyRealEstate />
      <AboutIntro />
      <ProcessSteps />
      <Calculator />
      <Opportunities />
      <WhyVynosium />
      <References />
      <FAQ />
      <FinalCTA />
    </>
  );
}
