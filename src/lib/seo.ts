/**
 * Single source of truth for the site's public origin. Defaults to the
 * eventual custom-domain placeholder from design.md; override with
 * NEXT_PUBLIC_SITE_URL once the GitHub Pages URL (or a custom domain) is
 * final, so metadata/sitemap/JSON-LD all point at the real address.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vynosium.cz").replace(/\/$/, "");

export const ORGANIZATION_NAME = "Vynósium";

/** Renders a <script type="application/ld+json"> block for any schema.org object. */
export function jsonLdScript(data: object) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-horizontal-color.svg`,
    slogan: "Chytrá cesta k výnosům",
    memberOf: {
      "@type": "Organization",
      name: "Real Luxembourg",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    inLanguage: "cs-CZ",
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function articleSchema(article: {
  title: string;
  perex: string;
  publishedAt: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.perex,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: ORGANIZATION_NAME },
    publisher: { "@type": "Organization", name: ORGANIZATION_NAME },
    mainEntityOfPage: `${SITE_URL}/magazin/${article.slug}`,
  };
}

export function realEstateListingSchema(project: {
  name: string;
  slug: string;
  location: string;
  purchasePrice: string;
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    url: `${SITE_URL}/investicni-prilezitosti/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location,
      addressCountry: "CZ",
    },
    // Modelová/orientační hodnota — nese stejnou právní výhradu jako
    // zobrazená cena na stránce (design.md §1: "žádné číslo bez základny").
    offers: {
      "@type": "Offer",
      priceCurrency: "CZK",
      availability: project.status === "open" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
    },
  };
}
