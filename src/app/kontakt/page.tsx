import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionIndex } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/data/site";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Domluvte si nezávaznou konzultaci. Řekněte nám, kolik chcete investovat a co od investice čekáte — připravíme modelový propočet.",
  alternates: { canonical: absoluteUrl("/kontakt") },
};

export default function ContactPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Kontakt", path: "/kontakt" },
        ])}
      />

      <PageIntro
        label="KONTAKT"
        title="Pojďme probrat vaše investiční cíle."
        lede="Konzultace je nezávazná. Výstupem je modelový propočet pro váš kapitál a horizont, ne prezentace."
      />

      <section className="relative z-[2] bg-white pb-[var(--space-11)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-16 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-5">
            <SectionIndex label="PŘÍMÉ KONTAKTY" tone="light" />
            <dl className="mt-6 border-t border-light-gray">
              <div className="border-b border-light-gray py-5">
                <dt className="text-label text-text-muted">Telefon</dt>
                <dd className="text-subheading mt-2">
                  <a href={SITE.phoneHref} className="focus-ring text-navy no-underline">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div className="border-b border-light-gray py-5">
                <dt className="text-label text-text-muted">E-mail</dt>
                <dd className="text-subheading mt-2">
                  <a href={`mailto:${SITE.email}`} className="focus-ring text-navy no-underline">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div className="border-b border-light-gray py-5">
                <dt className="text-label text-text-muted">Adresa</dt>
                <dd className="text-body mt-2 text-text-secondary">
                  {SITE.address.street}, {SITE.address.zip} {SITE.address.city}
                </dd>
              </div>
              <div className="border-b border-light-gray py-5">
                <dt className="text-label text-text-muted">Kdy se ozveme</dt>
                <dd className="text-body mt-2 text-text-secondary">
                  Do jednoho pracovního dne, telefonicky nebo e-mailem — podle toho, co uvedete.
                </dd>
              </div>
            </dl>

            {/* Map placeholder — hairlines and one emerald pin, never default
                Google colours (§15/4 art direction). */}
            <div
              className="mt-8 aspect-[4/3] w-full rounded-[var(--radius-card)] border border-light-gray"
              style={{ background: "repeating-linear-gradient(38.5deg, #f5f7fa 0 22px, #ffffff 22px 44px)" }}
              role="img"
              aria-label={`Mapa — ${SITE.address.street}, ${SITE.address.city}. V produkci nahrazena mapou ve stylu Vynosium.`}
            >
              <div className="flex h-full items-center justify-center">
                <span className="inline-block h-3 w-3 rounded-full border-2 border-emerald" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
