import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_CONFIG.baseUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/dmv/", "/guides", "/road-signs", "/terms", "/privacy", "/cookies"],
        disallow: [
          "/states/",
          "/login",
          "/auth/",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
