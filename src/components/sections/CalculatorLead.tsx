"use client";

import { useRef, useState } from "react";
import { Disclaimer } from "@/components/ui/primitives";
import { submitLead, type LeadResult } from "@/lib/leads";
import { withBasePath } from "@/lib/seo";

/**
 * The calculator's own lead form (client review, item 7).
 *
 * The calculator used to end in a link to /kontakt carrying the numbers as
 * query parameters. That works, but it spends the one moment when the visitor
 * is looking at their own result on a page transition — so the three fields
 * come to the result instead.
 *
 * The scenario travels with the lead: whoever picks this up sees the capital,
 * the financing, the horizon and the goal the visitor set, not just a name.
 *
 * Prototype note: with no NEXT_PUBLIC_LEAD_ENDPOINT set, submitLead reports
 * "not-configured" and this says so rather than thanking anyone. The wiring
 * is the only thing missing — the payload is already the shape a CRM wants.
 */
export function CalculatorLead({
  scenario,
}: {
  /** Live calculator state, flattened for the payload. */
  scenario: () => Record<string, string>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<LeadResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    if (phone.replace(/\D/g, "").length < 9) next.telefon = "Zadejte telefon včetně předvolby.";
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) next.email = "Zadejte e-mail ve tvaru jmeno@domena.cz.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setSending(true);
    const outcome = await submitLead({
      jmeno: name,
      telefon: phone,
      email,
      zdroj: "kalkulacka",
      ...scenario(),
    });
    setSending(false);

    if (outcome === "error") {
      setErrors({ form: "Odeslání se nepodařilo. Zavolejte nám prosím, nebo to zkuste znovu." });
      return;
    }
    setResult(outcome);
  };

  if (result) {
    const delivered = result === "sent";
    return (
      <div
        role="status"
        className={`mt-8 rounded-[var(--radius-card)] border p-6 ${
          delivered ? "border-emerald" : "border-fn-warning"
        }`}
      >
        <p className="text-subheading text-snow">
          {delivered
            ? "Děkujeme — plán připravíme na vaše čísla."
            : "Formulář zatím není napojený na CRM."}
        </p>
        <p className="text-body-sm mt-3 max-w-[46ch] text-slate-on-dark">
          {delivered
            ? "Ozveme se do jednoho pracovního dne. Propočet dostanete písemně, včetně nákladů a scénářů."
            : "Údaje prošly kontrolou, ale nikam se neodeslaly — web je zatím prototyp."}
        </p>
      </div>
    );
  }

  return (
    /*
     * The action is the fallback, not decoration. If this form is submitted
     * before React has hydrated — a failed chunk, JS off, a slow phone — a
     * form with no action reloads the same page with the fields dangling in
     * the URL and nothing else happens. Pointed at /kontakt it instead lands
     * the visitor on the long form with their data prefilled, which is what
     * the calculator's old link did anyway.
     */
    <form
      ref={formRef}
      onSubmit={onSubmit}
      action={withBasePath("/kontakt/")}
      method="get"
      noValidate
      className="mt-8"
    >
      <p className="text-label text-silver">Chci kompletní investiční plán</p>

      {/* Three fields, one row on a desktop: the shortest possible ask at the
          moment the visitor is looking at their own number. */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <LeadField name="jmeno" label="Jméno" autoComplete="name" error={errors.jmeno} />
        <LeadField name="telefon" label="Telefon" type="tel" autoComplete="tel" error={errors.telefon} />
        <LeadField name="email" label="E-mail" type="email" autoComplete="email" error={errors.email} />
      </div>

      <input type="text" name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button
        type="submit"
        disabled={sending}
        className="focus-ring mt-4 inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] bg-emerald-cta px-7 text-[15px] font-medium text-white transition-colors duration-[var(--dur-micro)] hover:bg-emerald-cta-hover disabled:opacity-70"
      >
        {sending ? "Odesílám…" : "Chci kompletní investiční plán"}
      </button>

      {errors.form && <p className="text-disclaimer mt-3 text-fn-warning">{errors.form}</p>}

      <Disclaimer tone="dark" className="mt-4">
        Odesláním souhlasíte se zpracováním údajů pro přípravu propočtu. Nejde o závaznou poptávku
        ani o investiční doporučení.
      </Disclaimer>
    </form>
  );
}

function LeadField({
  name,
  label,
  type = "text",
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={`calc-${name}`} className="sr-only">
        {label}
      </label>
      <input
        id={`calc-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={label}
        aria-invalid={error ? true : undefined}
        className="focus-ring h-12 w-full rounded-[var(--radius-pill)] border bg-transparent px-5 text-[15px] text-snow outline-none placeholder:text-slate-on-dark"
        style={{ borderColor: error ? "var(--color-fn-warning)" : "rgba(72,101,129,0.6)" }}
      />
      {error && <p className="text-disclaimer mt-2 text-fn-warning">{error}</p>}
    </div>
  );
}
