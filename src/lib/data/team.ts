/**
 * Team (§19, §20). PLACEHOLDER DATA — mirrors the CMS `TeamMember` model.
 *
 * The portraits are real photographs now, but they are stock, and the names
 * and positions are still stand-ins. The disclaimer under the grid has to go
 * on saying so: a real face beside an invented name reads as a claim about
 * a real person.
 */

export interface TeamMember {
  name: string;
  position: string;
  specialization: string;
  text: string;
  linkedin: string;
  /** Vertical offset in px — the portrait column is deliberately staggered. */
  offset: number;
  /** File in /photo/tym, produced by scripts/prepare-portraits.ps1. */
  photo: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Jméno Příjmení",
    position: "Zakladatel",
    specialization: "Investiční strategie, akvizice",
    text: "Devět let na trhu s investičními byty. Rozhoduje podle propočtu, ne podle prohlídky.",
    linkedin: "https://www.linkedin.com/",
    offset: 0,
    photo: "zakladatel.jpg",
  },
  {
    name: "Jméno Příjmení",
    position: "Vedoucí realizací",
    specialization: "Rekonstrukce, rozpočty, harmonogramy",
    text: "Vede projekty od rozpočtu po předání. Sleduje čerpání rozpočtu týdně, ne až na konci.",
    linkedin: "https://www.linkedin.com/",
    offset: 48,
    photo: "realizace.jpg",
  },
  {
    name: "Jméno Příjmení",
    position: "Financování",
    specialization: "Struktura úvěrů, bonita, refinancování",
    text: "Připravuje financování v předstihu, aby další akvizice nenarazila na limit bonity.",
    linkedin: "https://www.linkedin.com/",
    offset: 16,
    photo: "financovani.jpg",
  },
  {
    name: "Jméno Příjmení",
    position: "Správa nemovitostí",
    specialization: "Pronájem, nájemníci, provoz",
    text: "Odpovídá za obsazenost a za to, že investor neřeší provoz.",
    linkedin: "https://www.linkedin.com/",
    offset: 64,
    photo: "sprava.jpg",
  },
];

/** Deal history table (§/o-nas). Volumes are model aggregates. */
export const DEAL_HISTORY = [
  { period: "2019–2020", projects: "8 projektů", volume: "140 mil. Kč" },
  { period: "2021", projects: "11 projektů", volume: "210 mil. Kč" },
  { period: "2022", projects: "14 projektů", volume: "260 mil. Kč" },
  { period: "2023", projects: "13 projektů", volume: "240 mil. Kč" },
  { period: "2024–2025", projects: "18 projektů", volume: "350 mil. Kč" },
];
