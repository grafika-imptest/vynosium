import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { MagazineList } from "@/components/sections/MagazineList";

export const metadata: Metadata = {
  title: "Magazín",
  description: "Jak investovat, financování, pronájem, rekonstrukce, lokality, daně a investiční strategie.",
};

export default function MagazinePage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <PageIntro index="—" label="MAGAZÍN" title="Magazín Vynósium" lede="Články o investování do nemovitostí — bez marketingu, s čísly." />
      <MagazineList />
    </>
  );
}
