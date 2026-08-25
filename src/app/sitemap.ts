import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/data/articles";
import { CASE_STUDIES } from "@/lib/data/caseStudies";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { PROJECTS } from "@/lib/data/projects";
import { absoluteUrl } from "@/lib/seo";

/** Static export writes this to /sitemap.xml at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: "/", priority: 1 },
    { path: "/investicni-prilezitosti", priority: 0.9 },
    { path: "/jak-investujeme", priority: 0.8 },
    { path: "/kalkulacka", priority: 0.8 },
    { path: "/o-nas", priority: 0.6 },
    { path: "/reference", priority: 0.7 },
    { path: "/magazin", priority: 0.7 },
    { path: "/kontakt", priority: 0.8 },
  ];

  return [
    ...staticPaths.map((entry) => ({
      url: absoluteUrl(entry.path),
      changeFrequency: "weekly" as const,
      priority: entry.priority,
    })),
    ...INVESTMENT_PATHS.map((path) => ({
      url: absoluteUrl(`/${path.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...PROJECTS.map((project) => ({
      url: absoluteUrl(`/investicni-prilezitosti/${project.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...CASE_STUDIES.map((study) => ({
      url: absoluteUrl(`/reference/${study.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...ARTICLES.map((article) => ({
      url: absoluteUrl(`/magazin/${article.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}

// Required by output: "export" — the route is generated once at build time.
export const dynamic = "force-static";
