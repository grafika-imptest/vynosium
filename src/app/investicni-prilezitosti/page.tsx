import { Suspense } from "react";
import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { OpportunitiesExplorer } from "@/components/sections/OpportunitiesExplorer";

export const metadata: Metadata = {
  title: "Investiční příležitosti",
  description:
    "Aktuální investiční příležitosti do nemovitostí — konkrétní čísla, scénáře a očekávaný vývoj pro každou strategii.",
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ strategie?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <SetHeaderVariant variant="light" />
      <PageIntro
        index="—"
        label="INVESTIČNÍ PŘÍLEŽITOSTI"
        title="Investiční příležitosti"
        lede="Vybrané projekty prezentujeme prostřednictvím konkrétních čísel, scénářů a očekávaného vývoje — filtrujte podle strategie, lokality nebo minimálního kapitálu."
      />
      <Suspense>
        <OpportunitiesExplorer initialStrategy={params.strategie} />
      </Suspense>
    </>
  );
}
