import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import {
  CATEGORIES,
  getAllCategoryParams,
  getAllTestTypeParams,
  getStateProfiles,
  TEST_TYPES,
} from "@/lib/seo/taxonomy";
import { categoryPath, guidesPath, testTypePath } from "@/lib/seo/urls";

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE_CONFIG.baseUrl;

  const core: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}${guidesPath()}`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/road-signs`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const testTypePages: MetadataRoute.Sitemap = getAllTestTypeParams().map(
    ({ stateSlug, testType }) => ({
      url: `${base}${testTypePath(stateSlug, testType)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: stateSlug === "california" || stateSlug === "texas" || stateSlug === "florida" ? 0.9 : 0.75,
    }),
  );

  const categoryPages: MetadataRoute.Sitemap = getAllCategoryParams().map(
    ({ stateSlug, categorySlug }) => ({
      url: `${base}${categoryPath(stateSlug, categorySlug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }),
  );

  return [...core, ...testTypePages, ...categoryPages];
}

export function getSitemapPageCount() {
  return (
    4 +
    getStateProfiles().length * TEST_TYPES.length +
    getStateProfiles().length * CATEGORIES.length
  );
}
