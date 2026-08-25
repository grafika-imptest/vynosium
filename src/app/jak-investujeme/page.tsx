import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Jak investujeme",
  description: "Od první konzultace k výnosu — šest kroků, kterými provázíme každou investici do nemovitosti.",
};

export default function HowWeInvestPage() {
  return (
    <>
      <SetHeaderVariant variant="dark" />
      <div className="pt-16">
        <ProcessSteps />
      </div>
      <FinalCTA />
    </>
  );
}
