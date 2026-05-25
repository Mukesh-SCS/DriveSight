import { SITE_CONFIG } from "@/lib/seo/config";
import type { CategorySlug, TestTypeSlug } from "@/lib/seo/types";

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.baseUrl}${normalized}`;
}

export function testTypePath(stateSlug: string, testType: TestTypeSlug) {
  return `/dmv/${stateSlug}/${testType}`;
}

export function categoryPath(stateSlug: string, categorySlug: CategorySlug) {
  return `/dmv/${stateSlug}/category/${categorySlug}`;
}

export function guidesPath() {
  return "/guides";
}

export function stateHubPath(stateSlug: string) {
  return `/dmv/${stateSlug}`;
}
