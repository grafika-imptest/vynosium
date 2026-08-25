"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { getProjectBySlug } from "@/lib/data/projects";
import { formatCzk } from "@/lib/format";

const CAPITAL_RANGES = [
  "do 1 mil. Kč",
  "1–3 mil. Kč",
  "3–6 mil. Kč",
  "6–10 mil. Kč",
  "nad 10 mil. Kč",
];

type FormState = "idle" | "submitting" | "success" | "error";

/**
 * NOTE: submit is a client-side stub — there is no CRM webhook / server
 * action wired up yet (design.md §6 calls for one + honeypot + rate limit
 * + Turnstile). This validates and shows the confirmation UX the spec
 * asks for, but does not actually deliver the lead anywhere yet.
 */
export function ContactForm() {
  const searchParams = useSearchParams();
  const pathSlug = searchParams.get("cesta");
  const projectSlug = searchParams.get("projekt");
  const project = projectSlug ? getProjectBySlug(projectSlug) : undefined;
  const prefilledPath = INVESTMENT_PATHS.find((p) => p.slug === pathSlug);
  const calcCapital = searchParams.get("kapital");
  const calcLtv = searchParams.get("ltv");
  const calcHorizon = searchParams.get("horizont");

  const [priority, setPriority] = useState(prefilledPath?.id ?? "unsure");
  const [capitalRange, setCapitalRange] = useState("");
  const [note, setNote] = useState(
    project
      ? `Mám zájem o projekt: ${project.name}.`
      : calcCapital
        ? `Propočet z kalkulačky: kapitál ${formatCzk(Number(calcCapital))}, LTV ${calcLtv} %, horizont ${calcHorizon} let.`
        : ""
  );
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Vyplňte prosím jméno.";
    if (!phone && !email) nextErrors.contact = "Vyplňte telefon nebo e-mail.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Zkontrolujte formát e-mailu.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setState("submitting");
    setTimeout(() => setState("success"), 500);
  };

  if (state === "success") {
    return (
      <div className="rounded-[10px] border border-light-gray bg-mist p-8">
        <p className="text-subheading text-navy">Děkujeme, ozveme se vám.</p>
        <p className="text-body-sm mt-2 max-w-[48ch] text-text-secondary">
          Vaši poptávku jsme přijali a do dvou pracovních dnů se vám ozveme s dalšími kroky.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Jméno a příjmení" name="name" required error={errors.name} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Telefon" name="phone" type="tel" />
        <Field label="E-mail" name="email" type="email" error={errors.email} />
      </div>
      {errors.contact && <p className="text-disclaimer text-fn-risk">{errors.contact}</p>}

      <fieldset>
        <legend className="text-label mb-3 text-text-muted">Moje investiční priorita</legend>
        <div className="flex flex-col gap-2">
          {INVESTMENT_PATHS.map((p) => (
            <label key={p.id} className="flex items-center gap-3 text-sm text-navy">
              <input
                type="radio"
                name="priority"
                value={p.id}
                checked={priority === p.id}
                onChange={() => setPriority(p.id)}
                className="focus-ring h-4 w-4 accent-emerald"
              />
              {p.label}
            </label>
          ))}
          <label className="flex items-center gap-3 text-sm text-navy">
            <input
              type="radio"
              name="priority"
              value="unsure"
              checked={priority === "unsure"}
              onChange={() => setPriority("unsure")}
              className="focus-ring h-4 w-4 accent-emerald"
            />
            Nejsem si jistý/á
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label mb-3 text-text-muted">Kolik chcete přibližně investovat? (volitelné)</legend>
        <div className="flex flex-wrap gap-2">
          {CAPITAL_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setCapitalRange(capitalRange === range ? "" : range)}
              className="focus-ring rounded-[9999px] border px-4 py-2 text-xs text-text-secondary transition-colors"
              style={{
                borderColor: capitalRange === range ? "var(--color-emerald)" : "var(--color-light-gray)",
                color: capitalRange === range ? "var(--color-emerald)" : "var(--color-text-secondary)",
              }}
              aria-pressed={capitalRange === range}
            >
              {range}
            </button>
          ))}
        </div>
        <input type="hidden" name="capitalRange" value={capitalRange} />
      </fieldset>

      <div>
        <label className="text-label mb-2 block text-text-muted" htmlFor="note">
          Poznámka
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="focus-ring w-full rounded-[10px] border border-light-gray px-4 py-3 text-sm text-navy"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="focus-ring inline-flex min-h-12 items-center justify-center rounded-[9999px] bg-emerald px-7 text-[15px] font-medium text-white transition-colors hover:bg-emerald-hover disabled:opacity-60"
      >
        {state === "submitting" ? "Odesílám…" : "Chci nezávaznou konzultaci"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="text-label mb-2 block text-text-muted" htmlFor={name}>
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="focus-ring h-13 w-full rounded-[9999px] border px-6 text-sm text-navy"
        style={{ borderColor: error ? "var(--color-fn-risk)" : "var(--color-light-gray)", height: 52 }}
      />
      {error && <p className="text-disclaimer mt-1 text-fn-risk">{error}</p>}
    </div>
  );
}
