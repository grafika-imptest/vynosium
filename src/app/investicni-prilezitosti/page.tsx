import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { Opportunities } from "@/components/sections/Opportunities";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Investiční příležitosti",
  description:
    "Aktuální investiční byty a projekty s uvedenými čísly: kupní cena, investiční náklady, očekávané nájemné, orientační výnos a investiční horizont.",
  alternates: { canonical: "/investicni-prilezitosti" },
};

export default function OpportunitiesPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Investiční příležitosti", path: "/investicni-prilezitosti" },
        ])}
      />

      <PageIntro
        index="—"
        label="PŘÍLEŽITOSTI"
        title="Projekty, u kterých znáte čísla dřív než my vaši odpověď."
        lede="Každá příležitost je popsaná stejnou sadou metrik, aby se daly porovnat mezi sebou. Uzavřené projekty necháváme viditelné — jsou důkazem, ne inventářem."
      />

      <Opportunities index="—" showTableToggle heading="Aktuální nabídka" lede="Filtrujte podle strategie, lokality a stavu projektu. Přepnutí do tabulky zobrazí všechny projekty vedle sebe." />

      <FinalCta />
    </>
  );
}
