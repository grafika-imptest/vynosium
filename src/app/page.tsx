import { Hero } from "@/components/sections/Hero";
import { TrustNumbers } from "@/components/sections/TrustNumbers";
import { PathSelector } from "@/components/sections/PathSelector";
import { CaseProof } from "@/components/sections/CaseProof";
import { Opportunities } from "@/components/sections/Opportunities";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Calculator } from "@/components/sections/Calculator";
import { References } from "@/components/sections/References";
import { TeamStrip } from "@/components/sections/TeamStrip";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/lib/data/site";
import { faqSchema } from "@/lib/seo";

/**
 * The homepage (§2), cut to nine sections after the client review.
 *
 * It used to run thirteen: thesis, credibility, the four paths, the
 * undecided, why real estate, who we are, the six-step process, calculator,
 * opportunities, why us, references, the full FAQ, closing CTA. Every part
 * was defensible and the whole read as an investment memorandum — the
 * client's word, and the right one.
 *
 * What is left answers a first-time reader's questions in the order they
 * actually ask them: what do you do (hero) → can you prove it (numbers,
 * then ONE finished project) → what would I get (paths, live opportunities)
 * → how does it work (three steps) → what would it do with my money
 * (calculator) → who says so (references, people) → what now (CTA).
 *
 * Five sections moved rather than died: the argument for real estate as an
 * asset class, why this firm, and the undecided path now sit on
 * /jak-investujeme with the full six-step process; the firm's story is on
 * /o-nas; the full FAQ is on the pages where the questions come up. The
 * homepage links to all of them.
 */
export default function HomePage() {
  return (
    <>
      {/*
        The FAQ block itself is gone from this page, but the schema stays:
        the questions are answered across the site and this is the page
        search engines rank. Nothing here claims an answer the site does not
        actually give.
      */}
      <JsonLd data={faqSchema(FAQ)} />
      <Hero />
      <TrustNumbers />
      <PathSelector />
      <CaseProof />
      <Opportunities index="05" compact />
      <HowItWorks />
      <Calculator index="07" />
      <References index="08" />
      <TeamStrip />
      <FinalCta />
    </>
  );
}
