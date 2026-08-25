import { Suspense } from "react";
import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Pojďme probrat vaše investiční cíle — nezávazná konzultace s Vynósium.",
};

export default function ContactPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <PageIntro
        index="—"
        label="KONTAKT"
        title="Pojďme probrat vaše investiční cíle."
        lede="Vyplňte krátký formulář a ozveme se vám do dvou pracovních dnů. Konzultace je nezávazná."
      />
      <section className="bg-white pb-[var(--space-11)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div>
              <p className="text-label text-text-muted">Telefon</p>
              <a href="tel:+420000000000" className="focus-ring text-lede text-navy">
                +420 000 000 000
              </a>
            </div>
            <div>
              <p className="text-label text-text-muted">E-mail</p>
              <a href="mailto:info@vynosium.cz" className="focus-ring text-lede text-navy">
                info@vynosium.cz
              </a>
            </div>
            <div>
              <p className="text-label text-text-muted">Adresa</p>
              <p className="text-lede text-navy">Praha, Česká republika</p>
            </div>
            <div
              className="flex aspect-[4/3] w-full items-center justify-center rounded-[10px] border border-light-gray"
              style={{ background: "var(--color-navy)" }}
            >
              <span className="text-label text-slate">MAPA</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
