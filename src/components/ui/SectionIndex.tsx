/** "03 — ROZCESTNÍK" mono label carried by every major section (design.md §4.5). */
export function SectionIndex({
  index,
  label,
  tone = "dark",
  className = "",
}: {
  index: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={`text-label ${tone === "dark" ? "text-slate" : "text-text-muted"} ${className}`}
    >
      {index} — {label}
    </p>
  );
}
