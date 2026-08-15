import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import type { MDXComponents } from "mdx/types";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const data = page.data as unknown as {
    title?: string;
    description?: string;
    body: React.ComponentType<{ components?: MDXComponents }>;
    toc?: Array<{ depth: number; url: string; title: string }>;
  };

  const Body = data.body;
  const toc = Array.isArray(data.toc) ? data.toc : undefined;

  return (
    <DocsPage toc={toc}>
      <Body components={getMDXComponents()} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) return {};
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
