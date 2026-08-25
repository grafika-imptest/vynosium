export function Disclaimer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-[80ch] text-[12px] leading-[1.5] text-text-muted ${className}`}>
      {children}
    </p>
  );
}

export const DISCLAIMERS = {
  general:
    "Uvedené informace jsou obecného charakteru a nepředstavují investiční doporučení. Vynosium negarantuje výnos.",
  calculator: "Orientační model. Nejde o garantovaný výsledek ani investiční doporučení.",
  modelValues: "Označené hodnoty jsou modelové/očekávané, nikoli historická data.",
  scenario: "Modelový výpočet.",
} as const;
