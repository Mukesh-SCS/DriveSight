import Link from "next/link";
import type { RelatedLink } from "@/lib/seo/types";

type RelatedLinksProps = {
  links: RelatedLink[];
  title?: string;
};

export function RelatedLinks({
  links,
  title = "Related practice pages",
}: RelatedLinksProps) {
  return (
    <section aria-labelledby="related-heading" className="seo-section">
      <h2 id="related-heading">{title}</h2>
      <ul className="seo-related-list">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <strong>{link.label}</strong>
              {link.description ? <span>{link.description}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
