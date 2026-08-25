/**
 * PLACEHOLDER DATA — replace with real, verifiable figures before launch.
 * Per design.md §2/02 these numbers exist to defeat visitor skepticism;
 * shipping placeholders here would do the opposite. Each entry keeps its
 * mandatory base/period next to the figure (design.md §1 rule: "every
 * number carries a base").
 */
export const TRUST_NUMBERS = [
  {
    id: "volume",
    value: 1_200_000_000,
    display: "1,2",
    unit: "mld. Kč",
    label: "Hodnota realizovaných obchodů",
    base: "kumulativně od 2019",
  },
  {
    id: "projects",
    value: 64,
    display: "64+",
    unit: "",
    label: "Realizovaných projektů",
    base: "k 2026",
  },
  {
    id: "years",
    value: 7,
    display: "7",
    unit: "let",
    label: "Zkušeností na trhu",
    base: "od založení",
  },
  {
    id: "occupancy",
    value: 97,
    display: "97",
    unit: "%",
    label: "Obsazenost spravovaných nemovitostí",
    base: "průměr za posledních 12 měsíců",
  },
] as const;
