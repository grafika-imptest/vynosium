import { Suspense } from "react";
import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { OpportunitiesExplorer } from "@/components/sections/OpportunitiesExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Investiční příležitosti",
  description:
    "Aktuální investiční příležitosti do nemovitostí — konkrétní čísla, scénáře a očekávaný vývoj pro každou strategii.",
};

export default function OpportunitiesPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd data={breadcrumbSchema([{ name: "Domů", path: "/" }, { name: "Investiční příležitosti", path: "/investicni-prilezitosti" }])} />
      <PageIntro
        index="—"
        label="INVESTIČNÍ PŘÍLEŽITOSTI"
        title="Investiční příležitosti"
        lede="Vybrané projekty prezentujeme prostřednictvím konkrétních čísel, scénářů a očekávaného vývoje — filtrujte podle strategie, lokality nebo minimálního kapitálu."
      />
      {/* Static export has no server-side searchParams; OpportunitiesExplorer
          reads the real query string client-side via useSearchParams(). */}
      <Suspense>
        <OpportunitiesExplorer />
      </Suspense>
    </>
  );
}
