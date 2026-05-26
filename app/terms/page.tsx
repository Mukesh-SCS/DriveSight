import type { Metadata } from "next";
import Link from "next/link";
import { TermsContent } from "@/components/legal/TermsContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions | DriveSight",
  description:
    "Read the Terms and Conditions for using DriveSight DMV practice tests and educational driving tools. Not affiliated with any state DMV.",
  path: "/terms",
  keywords: [
    "DriveSight terms",
    "DMV practice test terms",
    "learner permit study disclaimer",
    "educational driving test platform",
  ],
});

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Terms and Conditions | ${SITE_CONFIG.name}`,
  description:
    "Terms governing use of DriveSight, an educational DMV and learner permit practice platform.",
  url: absoluteUrl("/terms"),
  isPartOf: {
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
  },
};

export default function TermsPage() {
  return (
    <main className="app-shell legal-shell">
      <JsonLd data={webPageSchema} />
      <nav aria-label="Breadcrumb" className="legal-breadcrumbs">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-current="page">Terms and Conditions</li>
        </ol>
      </nav>
      <article className="legal-page">
        <TermsContent />
      </article>
    </main>
  );
}
