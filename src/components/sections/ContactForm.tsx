"use client";

import { useEffect, useRef, useState } from "react";
import { Disclaimer } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { formatCzk } from "@/lib/format";
import { submitLead, type LeadResult } from "@/lib/leads";

const RANGES = [
  "do 1 000 000 Kč",
  "1 – 3 mil. Kč",
  "3 – 6 mil. Kč",
  "6 – 12 mil. Kč",
  "nad 12 mil. Kč",
];

/**
 * Lead form (§24, §39).
 *
 * Submits through submitLead (see lib/leads), which distinguishes "sent"
 * from "no endpoint configured" — the confirmation only promises a callback
 * when the lead actually left the browser.
 *
 * Confirmation happens in place: no thank-you redirect, because the
 * conversion event has to fire on the same page.
 */
export function ContactForm({ defaultPriority }: { defaultPriority?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState<LeadResult>("not-configured");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Calculator hand-off: the CTA carries the visitor's own numbers, so the
  // conversation starts from their scenario. Read from location rather than
  // useSearchParams to keep this page statically exportable.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const typ = params.get("typ");
    const kapital = params.get("kapital");
    const ltv = params.get("ltv");
    const horizont = params.get("horizont");

    if (typ) {
      const radio = form.querySelector<HTMLInputElement>(`input[name="priorita"][value="${typ}"]`);
      if (radio) radio.checked = true;
    }
    if (kapital) {
      const note = form.querySelector<HTMLTextAreaElement>('textarea[name="poznamka"]');
      if (note && !note.value) {
        note.value = `Z kalkulačky: vlastní kapitál ${formatCzk(Number(kapital))}, financování ${
          ltv ?? "0"
        } %, horizont ${horizont ?? "5"} let.`;
      }
    }
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill everything, humans never see this field.
    if (String(data.get("web") ?? "")) return;

    const next: Record<string, string> = {};
    const name = String(data.get("jmeno") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("telefon") ?? "").trim();

    if (name.length < 2) next.jmeno = "Vyplňte prosím jméno.";
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) next.email = "Zadejte e-mail ve tvaru jmeno@domena.cz.";
    if (phone.replace(/\D/g, "").length < 9) next.telefon = "Zadejte telefon včetně předvolby.";
    if (!data.get("priorita")) next.priorita = "Vyberte prosím jednu možnost.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    setSending(true);
    const outcome = await submitLead(
      Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]))
    );
    setSending(false);

    if (outcome === "error") {
      setErrors({ form: "Odeslání se nepodařilo. Zavolejte nám prosím, nebo to zkuste znovu." });
      return;
    }
    setResult(outcome);
    setSent(true);
  };

  if (sent) {
    /*
     * The promise in the heading is conditional on the lead having actually
     * left the browser. The disclaimer underneath was already honest, but
     * "ozveme se do jednoho pracovního dne" over a form with no endpoint is
     * the part a demo audience reads and believes.
     */
    const delivered = result === "sent";
    return (
      <div
        role="status"
        className={`rounded-[var(--radius-card)] border bg-white p-8 ${
          delivered ? "border-emerald" : "border-fn-warning"
        }`}
      >
        <h2 className="text-heading text-navy">
          {delivered
            ? "Děkujeme, ozveme se do jednoho pracovního dne."
            : "Formulář zatím není napojený na CRM."}
        </h2>
        <p className="text-body mt-4 max-w-[56ch] text-text-secondary">
          {delivered
            ? "Připravíme modelový propočet pro parametry, které jste uvedl. Pokud chcete cokoli doplnit, odpovězte prosím na potvrzovací e-mail."
            : "Vyplněné údaje prošly kontrolou, ale nikam se neodeslaly — web je zatím prototyp. Ozvěte se prosím telefonicky nebo e-mailem."}
        </p>
        {!delivered && (
          <Disclaimer className="mt-6">
            Pro spuštění stačí nastavit NEXT_PUBLIC_LEAD_ENDPOINT na adresu, která přijme JSON
            s poli formuláře.
          </Disclaimer>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Jméno a příjmení" name="jmeno" autoComplete="name" error={errors.jmeno} />
      <Field label="Telefon" name="telefon" type="tel" autoComplete="tel" error={errors.telefon} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" error={errors.email} />

      <fieldset>
        <legend className="text-label text-text-muted">Moje investiční priorita</legend>
        <div className="mt-4 flex flex-col gap-3">
          {[
            ...INVESTMENT_PATHS.map((p) => ({ value: p.id, label: p.label })),
            { value: "nejsem-si-jisty", label: "Nejsem si jistý" },
          ].map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="priorita"
                value={option.value}
                defaultChecked={defaultPriority === option.value}
                className="focus-ring h-4 w-4 accent-[var(--color-emerald)]"
              />
              <span className="text-body text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.priorita && (
          <p className="text-disclaimer mt-2 text-fn-risk-on-light">{errors.priorita}</p>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-label text-text-muted">
          Kolik chcete přibližně investovat? (volitelné)
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {RANGES.map((range) => (
            <label key={range} className="cursor-pointer">
              <input type="radio" name="rozsah" value={range} className="peer sr-only" />
              <span className="text-label inline-flex rounded-[var(--radius-pill)] border border-light-gray px-4 py-2.5 text-text-muted transition-colors peer-checked:border-emerald peer-checked:text-emerald-on-light peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald/40">
                {range}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="poznamka" className="text-label text-text-muted">
          Poznámka
        </label>
        <textarea
          id="poznamka"
          name="poznamka"
          rows={4}
          className="focus-ring mt-3 w-full rounded-[var(--radius-card)] border border-light-gray px-6 py-4 text-[15px] text-text-primary outline-none"
        />
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      {errors.form && <p className="text-disclaimer text-fn-risk-on-light">{errors.form}</p>}

      <button
        type="submit"
        disabled={sending}
        className="focus-ring inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] bg-emerald-cta px-7 text-[15px] font-medium text-white transition-colors duration-[var(--dur-micro)] hover:bg-emerald-cta-hover disabled:opacity-60"
      >
        {sending ? "Odesílám…" : "Chci nezávaznou konzultaci"}
      </button>

      <Disclaimer>
        Odesláním souhlasíte se zpracováním osobních údajů za účelem kontaktování. Konzultace je
        nezávazná a bezplatná.
      </Disclaimer>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-label text-text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="focus-ring mt-3 h-13 w-full rounded-[var(--radius-pill)] border px-6 text-[15px] text-text-primary outline-none"
        style={{ borderColor: error ? "var(--color-fn-risk)" : "var(--color-light-gray)", height: 52 }}
      />
      {/* Errors always carry text — colour never carries meaning alone. */}
      {error && (
        <p id={`${name}-error`} className="text-disclaimer mt-2 text-fn-risk-on-light">
          {error}
        </p>
      )}
    </div>
  );
}
