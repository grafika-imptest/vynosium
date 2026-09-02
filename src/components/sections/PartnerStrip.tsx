import Image from "next/image";
import { PARTNERS } from "@/lib/data/partners";
import { withBasePath } from "@/lib/seo";

/**
 * The institutions behind the deal, directly under the credibility numbers.
 *
 * Placed after the numbers rather than between them and the hero: the numbers
 * were the client's second priority precisely because they have to be the
 * first thing under the fold, and a logo band above them would push them
 * down. The order also argues better - the numbers make the claim, the
 * institutions are what the claim rests on.
 *
 * It carries the one sentence the logos need to mean anything. A bare row of
 * marks reads as decoration; the same row under "we do not do this alone"
 * answers the obvious objection to the client's kept promise ("Jeden partner
 * pro celou investici" - one partner for the whole investment): that one
 * partner cannot possibly do all of it. So the strip is the proof for a claim
 * the client wants to keep, not a badge wall.
 *
 * Four logos do not need a marquee on a desktop - they fit, and putting them
 * in permanent motion reads as hiding how few there are. So the track only
 * animates below 1024px, where four tiles genuinely overflow, and stops for
 * anyone who asked for less motion (see globals.css). If the client sends
 * twelve real logos, dropping the media query turns it into a marquee
 * everywhere.
 */
export function PartnerStrip() {
  return (
    <section className="relative z-[2] bg-mist py-[var(--space-8)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <p className="text-label text-text-muted">PARTNEŘI</p>
        <p className="text-body mt-4 max-w-[64ch] text-text-secondary">
          Jeden partner pro celou investici neznamená, že ji děláme sami. Financování, správa
          fondů, audit i ocenění stojí na institucích, které za svou část ručí — a vy je máte
          pod jednou smlouvou.
        </p>
      </div>

      {/*
        The viewport is full-bleed so the moving track runs off both edges
        instead of stopping at the gutter, with the mask fading the ends.
        On a desktop the same element just centres a static row.
      */}
      <div className="partner-viewport mt-8">
        <div className="partner-track">
          <ul className="partner-group">
            {PARTNERS.map((partner) => (
              <PartnerTile key={partner.name} name={partner.name} />
            ))}
          </ul>
          {/* The second copy exists only so the loop has somewhere to go. */}
          <ul className="partner-group partner-dupe" aria-hidden="true">
            {PARTNERS.map((partner) => (
              <PartnerTile key={`dupe-${partner.name}`} name={partner.name} decorative />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PartnerTile({ name, decorative = false }: { name: string; decorative?: boolean }) {
  const partner = PARTNERS.find((p) => p.name === name)!;

  return (
    <li className="partner-tile">
      <Image
        src={withBasePath(partner.src)}
        alt={decorative ? "" : partner.name}
        width={partner.width}
        height={partner.height}
        /* Height is optical (see partners.ts); width follows the file. */
        style={{ height: partner.renderHeight, width: "auto" }}
        className="partner-logo"
      />
    </li>
  );
}
