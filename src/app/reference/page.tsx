import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { ReferenceExplorer } from "@/components/sections/ReferenceExplorer";

export const metadata: Metadata = {
  title: "Reference",
  description: "Případové studie realizovaných investic — konkrétní čísla, ne jen pochvala služby.",
};

export default function ReferencesPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <PageIntro
        index="—"
        label="REFERENCE"
        title="Důkaz, že systém funguje v praxi."
        lede="Filtrujte podle typu projektu — rekonstrukce, pronájem nebo budování portfolia."
      />
      <ReferenceExplorer />
    </>
  );
}
