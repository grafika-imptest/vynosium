import { SITE } from "@/lib/data/site";

/** Canonical origin. Override per environment; no trailing slash. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vynosium.cz";

/**
 * Base path for static hosting under a sub-directory (e.g. GitHub Pages
 * project sites). Empty by default so local dev and root-domain hosting
 * need no configuration. Must stay in sync with next.config.ts.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * next/link and next/image's optimized loader prepend basePath on their
 * own; raw `src` strings and JSON-LD URLs do not — those go through here.
 */
export function withBasePath(path: string): string {
  if (!BASE_PATH) return path;
  return `${BASE_PATH}${path}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${withBasePath(path)}`;
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE_URL,
  logo: absoluteUrl("/brand/logo-horizontal-color.svg"),
  slogan: SITE.claim,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.zip,
    addressCountry: "CZ",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE.phone,
    email: SITE.email,
    contactType: "sales",
    availableLanguage: ["cs"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE_URL,
  inLanguage: "cs-CZ",
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleSchema(article: {
  title: string;
  perex: string;
  slug: string;
  publishedAt: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.perex,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: absoluteUrl(`/magazin/${article.slug}`),
  };
}

export function realEstateListingSchema(project: {
  name: string;
  slug: string;
  summary: string;
  location: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/investicni-prilezitosti/${project.slug}`),
    address: { "@type": "PostalAddress", addressLocality: project.location, addressCountry: "CZ" },
  };
}
