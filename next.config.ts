import type { NextConfig } from "next";
import { LEGACY_SLUG_REDIRECTS } from "./lib/seo/redirects";

const legacyRedirects = Object.entries(LEGACY_SLUG_REDIRECTS).map(
  ([slug, target]) => ({
    source: `/dmv/${slug}`,
    destination: `/dmv/${target.stateSlug}/${target.testType}`,
    permanent: true,
  }),
);

const nextConfig: NextConfig = {
  redirects: async () => legacyRedirects,
};

export default nextConfig;
