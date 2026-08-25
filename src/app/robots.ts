import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required for `output: "export"` — these routes have no per-request
// input, so they're safe to emit as static files at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
