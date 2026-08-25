import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Legal pages carry no search value and dilute the index.
      disallow: ["/gdpr/", "/cookies/", "/obchodni-podminky/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

// Required by output: "export" — the route is generated once at build time.
export const dynamic = "force-static";
