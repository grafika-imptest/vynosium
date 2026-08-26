import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { ReferenceExplorer } from "@/components/sections/ReferenceExplorer";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reference",
  description:
    "Realizované projekty s konkrétními čísly: pořizovací cena, náklady na rekonstrukci, délka realizace a výsledek projektu.",
  alternates: { canonical: absoluteUrl("/reference") },
};

export default function ReferencesPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Reference", path: "/reference" },
        ])}
      />

      <PageIntro
        label="REFERENCE"
        title="Projekty, u kterých sedí čísla i na konci."
        lede="Každá studie končí ledgerem: co se koupilo, kolik stála rekonstrukce, jak dlouho trvala a s jakým výsledkem projekt skončil."
      />

      <ReferenceExplorer />
      <FinalCta />
    </>
  );
}
