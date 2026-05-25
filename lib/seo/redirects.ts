import type { TestTypeSlug } from "@/lib/seo/types";

/** Legacy slug redirects from early SEO pages */
export const LEGACY_SLUG_REDIRECTS: Record<
  string,
  { stateSlug: string; testType: TestTypeSlug }
> = {
  "california-dmv-practice-test": { stateSlug: "california", testType: "dmv-practice-test" },
  "texas-permit-test": { stateSlug: "texas", testType: "dmv-practice-test" },
  "florida-road-signs": { stateSlug: "florida", testType: "road-signs-test" },
  "new-york-dmv-practice-test": { stateSlug: "new-york", testType: "dmv-practice-test" },
  "pennsylvania-permit-practice": { stateSlug: "pennsylvania", testType: "dmv-practice-test" },
  "illinois-dmv-practice-test": { stateSlug: "illinois", testType: "dmv-practice-test" },
};
