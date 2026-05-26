import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyContent } from "@/components/legal/PrivacyContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | DriveSight",
  description:
    "Read how DriveSight collects, uses, and protects your data when you use DMV practice tests, Supabase authentication, and study tools.",
  path: "/privacy",
  keywords: [
    "DriveSight privacy policy",
    "DMV practice test privacy",
    "learner permit app data",
  ],
});

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Privacy Policy | ${SITE_CONFIG.name}`,
  description: "Privacy practices for DriveSight educational DMV practice platform.",
  url: absoluteUrl("/privacy"),
  isPartOf: {
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
  },
};

export default function PrivacyPage() {
  return (
    <main className="app-shell legal-shell">
      <JsonLd data={webPageSchema} />
      <nav aria-label="Breadcrumb" className="legal-breadcrumbs">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-current="page">Privacy Policy</li>
        </ol>
      </nav>
      <article className="legal-page">
        <PrivacyContent />
      </article>
    </main>
  );
}
