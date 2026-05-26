import type { Metadata } from "next";
import Link from "next/link";
import { CookiesContent } from "@/components/legal/CookiesContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy | DriveSight",
  description:
    "Learn how DriveSight uses cookies, local storage, and Supabase session technologies for authentication and practice features.",
  path: "/cookies",
  keywords: [
    "DriveSight cookies",
    "DMV practice test cookies",
    "Supabase auth cookies",
  ],
});

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Cookie Policy | ${SITE_CONFIG.name}`,
  description: "Cookie and storage practices for DriveSight.",
  url: absoluteUrl("/cookies"),
  isPartOf: {
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
  },
};

export default function CookiesPage() {
  return (
    <main className="app-shell legal-shell">
      <JsonLd data={webPageSchema} />
      <nav aria-label="Breadcrumb" className="legal-breadcrumbs">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-current="page">Cookie Policy</li>
        </ol>
      </nav>
      <article className="legal-page">
        <CookiesContent />
      </article>
    </main>
  );
}
