import { SITE_CONFIG } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";
import type { BreadcrumbItem, FaqItem, SeoPageContent } from "@/lib/seo/types";

export function buildBreadcrumbSchema(items: BreadcrumbItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : pageUrl,
    })),
  };
}

export function buildWebPageSchema(content: SeoPageContent) {
  const pageUrl = absoluteUrl(content.path);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: content.h1,
    description: content.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.baseUrl}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
    about: {
      "@type": "Thing",
      name: `${content.stateName} driver knowledge test preparation`,
    },
    inLanguage: "en-US",
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildLearningResourceSchema(content: SeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: content.h1,
    description: content.description,
    educationalLevel: "Beginner",
    learningResourceType: "Practice test",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    },
  };
}

export function buildPageGraph(content: SeoPageContent) {
  const pageUrl = absoluteUrl(content.path);

  return [
    buildWebPageSchema(content),
    buildBreadcrumbSchema(content.breadcrumbs, pageUrl),
    buildFaqSchema(content.faqs),
    buildLearningResourceSchema(content),
  ];
}
