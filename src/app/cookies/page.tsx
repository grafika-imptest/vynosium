import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Cookies" };

/**
 * PLACEHOLDER TEXT — generic cookie-policy structure. design.md §6 calls
 * for Consent Mode v2 blocking marketing tags until consent; that
 * integration is not wired up in this build yet.
 */
export default function CookiesPage() {
  return (
    <LegalPage
      title="Zásady používání cookies"
      updated="[doplnit datum]"
      sections={[
        {
          heading: "Co jsou cookies",
          body: [
            "Cookies jsou malé textové soubory, které web ukládá ve vašem prohlížeči za účelem zapamatování preferencí a měření návštěvnosti.",
          ],
        },
        {
          heading: "Jaké cookies používáme",
          body: [
            "Nezbytné cookies pro fungování webu, a se souhlasem analytické a marketingové cookies (GTM, GA4, Meta Pixel, Google Ads). Marketingové tagy se aktivují až po udělení souhlasu.",
          ],
        },
        {
          heading: "Správa souhlasu",
          body: ["Souhlas můžete kdykoliv změnit nebo odvolat [doplnit odkaz na cookie lištu/nastavení]."],
        },
      ]}
    />
  );
}
