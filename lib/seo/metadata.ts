import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";
import type { PageMetadataInput } from "@/lib/seo/types";

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const title = input.title.includes(SITE_CONFIG.name)
    ? input.title
    : `${input.title} | ${SITE_CONFIG.name}`;

  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url: canonical,
      siteName: SITE_CONFIG.name,
      title,
      description: input.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export function buildAppPageMetadata(title: string, description: string, path: string): Metadata {
  return buildPageMetadata({
    title,
    description,
    path,
    noIndex: true,
  });
}
