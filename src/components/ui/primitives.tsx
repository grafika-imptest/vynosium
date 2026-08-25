import Link from "next/link";
import type { ReactNode } from "react";
import type { InvestmentPath } from "@/lib/tokens";

/* ============================================================================
   Shared primitives (§4.5). Every one of these is shadowless by
   construction: structure comes from 1px hairlines and the two radii.
   ========================================================================== */

type PillVariant = "emerald" | "ghost-dark" | "ghost-light";

const PILL_BASE =
  "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 text-[15px] font-medium no-underline transition-all duration-[var(--dur-micro)]";

const PILL_VARIANTS: Record<PillVariant, string> = {
  emerald: "bg-emerald text-white hover:bg-emerald-hover hover:-translate-y-px active:bg-emerald-active",
  "ghost-dark": "border border-snow/50 text-snow hover:border-snow",
  "ghost-light": "border border-steel text-navy hover:border-navy",
};

export function Pill({
  href,
  variant = "emerald",
  children,
  className = "",
  external = false,
}: {
  href: string;
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = `${PILL_BASE} ${PILL_VARIANTS[variant]} ${className}`;
  if (external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function ButtonPill({
  onClick,
  variant = "emerald",
  children,
  className = "",
  ...rest
}: {
  onClick?: () => void;
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${PILL_BASE} ${PILL_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Section index — `03 — ROZCESTNÍK`. Present on every major section: it
 * makes the site read as a document and reinforces the data thesis.
 */
export function SectionIndex({
  index,
  label,
  tone,
  className = "",
}: {
  index: string;
  label: string;
  tone: "dark" | "light";
  className?: string;
}) {
  return (
    <p className={`text-label ${tone === "dark" ? "text-slate" : "text-text-muted"} ${className}`}>
      {index} — {label}
    </p>
  );
}

/**
 * Mandatory legal line (§4.5). Always in the layout — never a tooltip,
 * never below the fold, always next to the numbers it qualifies.
 */
export function Disclaimer({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`text-disclaimer ${tone === "dark" ? "text-slate" : "text-text-muted"} ${className}`}>
      {children}
    </p>
  );
}

/** Model-value marker. Used everywhere a number is projected, not measured. */
export function ModelMark() {
  return (
    <sup className="ml-px align-super text-[0.62em] text-emerald" title="modelová hodnota">
      ᴹ
    </sup>
  );
}

/**
 * Metric block (§4.5): label → value → basis. A naked number is never
 * allowed; the basis is what separates data from marketing.
 */
export function Metric({
  label,
  value,
  basis,
  tone = "dark",
  size = "md",
  accent,
}: {
  label: string;
  value: ReactNode;
  basis?: string;
  tone?: "dark" | "light";
  size?: "md" | "xl";
  accent?: string;
}) {
  return (
    <div>
      <p className={`text-label ${tone === "dark" ? "text-slate" : "text-text-muted"}`}>{label}</p>
      <p
        className={`${size === "xl" ? "text-metric-xl" : "text-metric"} mt-3 ${
          tone === "dark" ? "text-snow" : "text-navy"
        }`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {basis && (
        <p className={`text-label mt-3 ${tone === "dark" ? "text-steel" : "text-text-muted"}`}>{basis}</p>
      )}
    </div>
  );
}

/** Strategy badge: 1px token line + 6px dot + 11px uppercase label. */
export function PathBadge({ path, label }: { path: InvestmentPath; label: string }) {
  return (
    <span
      className="text-label inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5"
      style={{ borderColor: `var(--color-path-${path})`, color: `var(--color-path-${path})` }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: `var(--color-path-${path})` }}
      />
      {label}
    </span>
  );
}

/**
 * Status pill. Colour never carries meaning on its own — every state
 * ships with its text label.
 */
export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "open" | "last" | "closed" | "prepared";
}) {
  const color = {
    open: "var(--color-emerald)",
    last: "var(--color-fn-warning)",
    closed: "var(--color-steel)",
    prepared: "var(--color-slate)",
  }[tone];

  return (
    <span
      className="text-label inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5"
      style={{ borderColor: color, color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

/**
 * Abstract path glyph derived from the monogram (§3/03). No houses, keys,
 * roofs or skylines exist anywhere in this system.
 */
export function PathGlyph({ path, className = "" }: { path: InvestmentPath; className?: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    stroke: "currentColor",
    className,
    "aria-hidden": true,
  };

  switch (path) {
    // Rising line with a break — value lifted by an intervention.
    case "flip":
      return (
        <svg {...common}>
          <path d="M2 18 L9 13 L13 15 L22 5" />
          <path d="M22 10 V5 h-5" />
        </svg>
      );
    // Repeating bars — recurring income.
    case "income":
      return (
        <svg {...common}>
          <path d="M3 7h18M3 12h18M3 17h11" />
        </svg>
      );
    // Outlined mass — capital turned into an asset.
    case "capital":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M4 20h16" />
        </svg>
      );
    // Three growing modules — a portfolio built in steps.
    case "wealth":
    default:
      return (
        <svg {...common}>
          <path d="M3 20V15h4v5" />
          <path d="M10 20V10h4v10" />
          <path d="M17 20V5h4v15" />
        </svg>
      );
  }
}

/** Hairline. The primary structural device of the whole site. */
export function Hairline({ tone = "light", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${tone === "dark" ? "bg-steel/50" : "bg-light-gray"} ${className}`}
    />
  );
}
