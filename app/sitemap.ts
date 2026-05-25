import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/seo/sitemap-entries";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}
