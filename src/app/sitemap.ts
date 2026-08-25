import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PROJECTS } from "@/lib/data/projects";
import { CASE_STUDIES } from "@/lib/data/caseStudies";
import { ARTICLES } from "@/lib/data/articles";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/investicni-prilezitosti", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/jak-investujeme", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/o-nas", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/reference", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/magazin", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/kontakt", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/kalkulacka", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/zhodnotit-byt", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/pasivni-prijem", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/zhodnoceni-kapitalu", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/budovani-majetku", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/gdpr", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/obchodni-podminky", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const projectEntries = PROJECTS.map((p) => ({
    url: `${SITE_URL}/investicni-prilezitosti/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const caseStudyEntries = CASE_STUDIES.map((c) => ({
    url: `${SITE_URL}/reference/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const articleEntries = ARTICLES.map((a) => ({
    url: `${SITE_URL}/magazin/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...projectEntries, ...caseStudyEntries, ...articleEntries];
}
