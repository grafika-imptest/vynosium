import Image from "next/image";
import Link from "next/link";
import { Disclaimer, SectionIndex } from "@/components/ui/primitives";
import { TEAM } from "@/lib/data/team";
import { SITE } from "@/lib/data/site";
import { withBasePath } from "@/lib/seo";

/**
 * The people, on the homepage.
 *
 * The client called this the site's biggest trust gap and they are right: at
 * two to ten million per investment the unanswered question is "whose word am
 * I taking?", and until now the answer lived three clicks away.
 *
 * The portraits are stock and the names are stand-ins — the client accepted
 * that for the prototype. The disclaimer is therefore not decoration: a real
 * face beside an invented name is a claim about a specific person, and the
 * one thing that keeps this honest is saying so in the layout, not in a
 * commit message. It goes when the real team does.
 */
export function TeamStrip() {
  return (
    <section className="relative z-[2] bg-mist py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="08" label="LIDÉ" tone="light" />
        <h2 className="text-display mt-6 max-w-[22ch] text-navy">
          Za Vynosiem stojí lidé, kteří sami investují do nemovitostí.
        </h2>
        <p className="text-lede mt-6 max-w-[62ch] text-text-secondary">
          Nejsme fond ani zprostředkovatel. Za každým propočtem je konkrétní člověk, který ho
          podepsal — a který u projektu zůstává od akvizice po výplatu.
        </p>

        <ul className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TEAM.map((member) => (
            <li key={`${member.name}-${member.position}`}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] border border-light-gray">
                <Image
                  src={withBasePath(`/photo/tym/${member.photo}`)}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 22vw, 44vw"
                  className="object-cover"
                />
              </div>
              <p className="text-subheading mt-4 text-navy">{member.name}</p>
              <p className="text-label text-label-wrap mt-2 text-text-muted">{member.position}</p>
              <p className="text-body-sm mt-3 max-w-[30ch] text-text-secondary">{member.text}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring text-body-sm mt-3 inline-block text-navy underline decoration-light-gray underline-offset-4 hover:decoration-emerald"
              >
                LinkedIn
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-4 border-t border-light-gray pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-body max-w-[52ch] text-text-secondary">{SITE.group}</p>
          <Link
            href="/o-nas"
            className="focus-ring text-label group inline-flex items-center gap-2 whitespace-nowrap text-navy no-underline"
          >
            Kdo jsme a co máme za sebou
            <span
              aria-hidden="true"
              className="transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1.5"
            >
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M0 5h16M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </Link>
        </div>

        <Disclaimer className="mt-6">
          Jména a pozice jsou zástupné, portréty ilustrační — nahrazují se skutečnými údaji
          a fotografiemi týmu před spuštěním webu.
        </Disclaimer>
      </div>
    </section>
  );
}
