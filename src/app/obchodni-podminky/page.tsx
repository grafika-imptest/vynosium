import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Obchodní podmínky" };

/**
 * PLACEHOLDER TEXT — generic terms structure, not a reviewed legal
 * document. Must be replaced by counsel-approved content before launch.
 */
export default function TermsPage() {
  return (
    <LegalPage
      title="Obchodní podmínky"
      updated="[doplnit datum]"
      sections={[
        {
          heading: "Úvodní ustanovení",
          body: [
            "Tyto obchodní podmínky upravují vztah mezi Vynósium [doplnit obchodní název a IČO] a zájemcem o investiční konzultaci nebo služby prezentované na tomto webu.",
          ],
        },
        {
          heading: "Charakter poskytovaných informací",
          body: [
            "Informace na webu, včetně výstupů kalkulačky, mají modelový a orientační charakter a nepředstavují investiční doporučení ani závaznou nabídku ve smyslu příslušných právních předpisů. Vynósium negarantuje uvedené výnosy.",
          ],
        },
        {
          heading: "Uzavření smluvního vztahu",
          body: [
            "Konkrétní podmínky spolupráce na jednotlivém projektu jsou vždy předmětem samostatné smlouvy uzavřené mezi Vynósium a investorem. [Doplnit podrobnosti procesu uzavření smlouvy.]",
          ],
        },
      ]}
    />
  );
}
