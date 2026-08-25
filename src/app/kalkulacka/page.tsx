import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { Calculator } from "@/components/sections/Calculator";

export const metadata: Metadata = {
  title: "Investiční kalkulačka",
  description:
    "Spočítejte si orientační výnos investice do nemovitosti — vlastní kapitál, financování, horizont a typ investice.",
};

/** Standalone remarketing URL for the calculator — design.md §2. */
export default function CalculatorPage() {
  return (
    <>
      <SetHeaderVariant variant="dark" />
      <div className="pt-16">
        <Calculator />
      </div>
    </>
  );
}
