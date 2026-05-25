import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildGuidesHubContent } from "@/lib/seo/content";
import { SITE_CONFIG } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";
import {
  CATEGORIES,
  getStateProfiles,
  TEST_TYPES,
} from "@/lib/seo/taxonomy";
import { categoryPath, testTypePath } from "@/lib/seo/urls";

export const metadata = buildPageMetadata({
  title: "DMV Practice Test Guides by State",
  description: buildGuidesHubContent().description,
  path: buildGuidesHubContent().path,
  keywords: [
    "DMV practice test",
    "permit test by state",
    "road signs test",
    "CDL permit practice",
    "motorcycle permit test",
  ],
});

const hub = buildGuidesHubContent();
const topStates = ["california", "texas", "florida", "new-york", "pennsylvania", "illinois"];

export default function GuidesHubPage() {
  const states = getStateProfiles();
  const featured = states.filter((state) => topStates.includes(state.slug));
  const others = states.filter((state) => !topStates.includes(state.slug));

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.h1,
    description: hub.description,
    url: absoluteUrl(hub.path),
    isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.baseUrl },
  };

  return (
    <main className="app-shell seo-shell">
      <JsonLd data={webPageSchema} />
      <article className="seo-page">
        <header className="seo-page-header">
          <p className="eyebrow">Programmatic study hubs</p>
          <h1>{hub.h1}</h1>
          <p className="seo-page-intro">{hub.intro}</p>
        </header>

        <section className="seo-section">
          <h2>Test types</h2>
          <ul className="seo-link-grid">
            {TEST_TYPES.map((type) => (
              <li key={type.slug}>
                <strong>{type.label}</strong>
                <span>{type.searchIntent}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="seo-section">
          <h2>Top states</h2>
          <ul className="seo-state-grid">
            {featured.map((state) => (
              <li key={state.slug}>
                <Link href={testTypePath(state.slug, "dmv-practice-test")}>
                  {state.name} DMV practice test
                </Link>
                <small>{state.questionCount.toLocaleString()} questions</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="seo-section">
          <h2>All 50 states</h2>
          <ul className="seo-state-grid seo-state-grid-compact">
            {others.map((state) => (
              <li key={state.slug}>
                <Link href={testTypePath(state.slug, "dmv-practice-test")}>{state.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="seo-section">
          <h2>Category topics</h2>
          <p>Each state hub includes focused quizzes for:</p>
          <ul className="seo-link-grid">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <strong>{category.label}</strong>
                <span>{category.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
