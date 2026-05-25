import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import { buildTestTypePageContent } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAllTestTypeParams, getTestType } from "@/lib/seo/taxonomy";
import type { TestTypeSlug } from "@/lib/seo/types";

type TestTypePageProps = {
  params: Promise<{ stateSlug: string; testType: string }>;
};

export function generateStaticParams() {
  return getAllTestTypeParams();
}

export async function generateMetadata({ params }: TestTypePageProps) {
  const { stateSlug, testType } = await params;
  const content = buildTestTypePageContent(stateSlug, testType as TestTypeSlug);

  if (!content) {
    return { title: "Practice Test" };
  }

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    path: content.path,
    keywords: content.keywords,
  });
}

export default async function TestTypeSeoPage({ params }: TestTypePageProps) {
  const { stateSlug, testType } = await params;

  if (!getTestType(testType)) {
    notFound();
  }

  const content = buildTestTypePageContent(stateSlug, testType as TestTypeSlug);

  if (!content) {
    notFound();
  }

  return (
    <main className="app-shell seo-shell">
      <SeoPageTemplate content={content} />
    </main>
  );
}
