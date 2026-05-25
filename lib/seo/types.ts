import type { Metadata } from "next";

export type TestTypeSlug =
  | "dmv-practice-test"
  | "road-signs-test"
  | "hard-questions"
  | "motorcycle-permit-test"
  | "cdl-permit-test"
  | "spanish-permit-test";

export type CategorySlug =
  | "road-signs"
  | "right-of-way"
  | "traffic-signals"
  | "parking"
  | "speed-limits"
  | "school-zones"
  | "emergency-vehicles"
  | "alcohol-dui"
  | "defensive-driving"
  | "lane-changes";

export type SeoPageKind = "test-type" | "category" | "guide";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  description?: string;
};

export type SeoPageContent = {
  kind: SeoPageKind;
  stateCode: string;
  stateName: string;
  stateSlug: string;
  testType?: TestTypeSlug;
  categorySlug?: CategorySlug;
  path: string;
  h1: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  permitTips: string[];
  passingScore: string;
  practiceSection: { title: string; body: string };
  roadSignsSection: { title: string; body: string };
  categorySection?: { title: string; body: string };
  faqs: FaqItem[];
  relatedLinks: RelatedLink[];
  cta: { label: string; href: string; secondary?: RelatedLink };
  breadcrumbs: BreadcrumbItem[];
};

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export type GeneratedMetadata = Metadata;
