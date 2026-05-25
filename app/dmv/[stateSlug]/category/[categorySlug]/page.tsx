import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import { buildCategoryPageContent } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAllCategoryParams, getCategory } from "@/lib/seo/taxonomy";
import type { CategorySlug } from "@/lib/seo/types";

type CategoryPageProps = {
  params: Promise<{ stateSlug: string; categorySlug: string }>;
};

export function generateStaticParams() {
  return getAllCategoryParams();
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { stateSlug, categorySlug } = await params;
  const content = buildCategoryPageContent(stateSlug, categorySlug as CategorySlug);

  if (!content) {
    return { title: "Category Practice" };
  }

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    path: content.path,
    keywords: content.keywords,
  });
}

export default async function CategorySeoPage({ params }: CategoryPageProps) {
  const { stateSlug, categorySlug } = await params;

  if (!getCategory(categorySlug)) {
    notFound();
  }

  const content = buildCategoryPageContent(stateSlug, categorySlug as CategorySlug);

  if (!content) {
    notFound();
  }

  return (
    <main className="app-shell seo-shell">
      <SeoPageTemplate content={content} />
    </main>
  );
}
