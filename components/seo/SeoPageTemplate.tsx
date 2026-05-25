import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { buildPageGraph } from "@/lib/seo/schema";
import type { SeoPageContent } from "@/lib/seo/types";

type SeoPageTemplateProps = {
  content: SeoPageContent;
};

export function SeoPageTemplate({ content }: SeoPageTemplateProps) {
  return (
    <article className="seo-page">
      <JsonLd data={buildPageGraph(content)} />
      <Breadcrumbs items={content.breadcrumbs} />

      <header className="seo-page-header">
        <p className="eyebrow">{content.stateName} learner permit prep</p>
        <h1>{content.h1}</h1>
        <p className="seo-page-intro">{content.intro}</p>
      </header>

      <section aria-labelledby="passing-score" className="seo-section seo-callout">
        <h2 id="passing-score">Passing score & exam basics</h2>
        <p>{content.passingScore}</p>
      </section>

      <section aria-labelledby="permit-tips" className="seo-section">
        <h2 id="permit-tips">Learner permit study tips</h2>
        <ul className="seo-bullet-list">
          {content.permitTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practice-section" className="seo-section">
        <h2 id="practice-section">{content.practiceSection.title}</h2>
        <p>{content.practiceSection.body}</p>
      </section>

      <section aria-labelledby="road-signs-section" className="seo-section">
        <h2 id="road-signs-section">{content.roadSignsSection.title}</h2>
        <p>{content.roadSignsSection.body}</p>
      </section>

      {content.categorySection ? (
        <section aria-labelledby="category-section" className="seo-section">
          <h2 id="category-section">{content.categorySection.title}</h2>
          <p>{content.categorySection.body}</p>
        </section>
      ) : null}

      <FaqSection faqs={content.faqs} />
      <RelatedLinks links={content.relatedLinks} />

      <section aria-labelledby="cta-section" className="seo-cta-block">
        <h2 id="cta-section">Start practicing</h2>
        <p>Sign in to save progress, track weak categories, and use adaptive difficulty.</p>
        <div className="seo-cta-actions">
          <Link className="primary-button" href={content.cta.href}>
            {content.cta.label}
          </Link>
          {content.cta.secondary ? (
            <Link className="secondary-button" href={content.cta.secondary.href}>
              {content.cta.secondary.label}
            </Link>
          ) : null}
          <Link className="text-button" href="/login">
            Sign in free
          </Link>
        </div>
      </section>
    </article>
  );
}
