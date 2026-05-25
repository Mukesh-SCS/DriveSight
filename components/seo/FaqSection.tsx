import type { FaqItem } from "@/lib/seo/types";

type FaqSectionProps = {
  faqs: FaqItem[];
};

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section aria-labelledby="faq-heading" className="seo-section">
      <h2 id="faq-heading">Frequently asked questions</h2>
      <dl className="seo-faq-list">
        {faqs.map((faq) => (
          <div className="seo-faq-item" key={faq.question}>
            <dt>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
