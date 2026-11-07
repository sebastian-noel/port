import type { MetadataRoute } from "next";
import { site } from "./_lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must reach the page to read its noindex directive.
    rules: [{ userAgent: "*", allow: "/" }, { userAgent: "GPTBot", disallow: "/" }],
    ...(site.indexable ? { sitemap: `${site.origin}/sitemap.xml` } : {}),
  };
}
