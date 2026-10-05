import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site, testPages, testSlugs, type TestSlug } from "@/content/site";
import { TestPageView } from "@/components/test-page/TestPageView";

export const dynamicParams = false;

export function generateStaticParams() {
  return testSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = testPages[slug as TestSlug];
  if (!page) return {};
  return { title: page.title, description: site.metaDescription };
}

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(testSlugs as string[]).includes(slug)) notFound();
  return <TestPageView slug={slug as TestSlug} />;
}
