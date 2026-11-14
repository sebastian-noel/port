import type { MetadataRoute } from "next";
import { entries } from "./_content/entries";
import { site } from "./_lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
  return [
    "",
    "/projects",
    "/experiences",
    "/about",
    "/resume",
    ...entries
      .filter((entry) => entry.published && entry.collection === "projects")
      .map((entry) => `/${entry.collection}/${entry.slug}`),
  ].map((path) => ({ url: `${site.origin}${path}` }));
}
