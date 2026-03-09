import { prisma } from "@/lib/prisma";
import { categoryToSlug } from "@/lib/categories";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true, updatedAt: true, category: true },
  });

  const projectEntries = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8 as const,
  }));

  // Ecosystem landing pages — one per approved project
  const ecosystemEntries = projects.map((p) => ({
    url: `${SITE_URL}/ecosystem/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.7 as const,
  }));

  // Unique categories
  const categories = [...new Set(projects.map((p) => p.category))];
  const categoryEntries = categories.map((cat) => ({
    url: `${SITE_URL}/category/${categoryToSlug(cat)}`,
    lastModified: new Date(),
    priority: 0.7 as const,
  }));

  // Learn articles
  const learnEntries = LEARN_ARTICLES.map((article) => ({
    url: `${SITE_URL}/learn/${article.slug}`,
    lastModified: new Date(article.datePublished),
    priority: 0.8 as const,
  }));

  // Compare pairs — all same-category project pairs
  const byCategory = new Map<string, string[]>();
  for (const p of projects) {
    const existing = byCategory.get(p.category) || [];
    existing.push(p.slug);
    byCategory.set(p.category, existing);
  }

  const comparePairs: MetadataRoute.Sitemap = [];
  for (const [, slugs] of byCategory) {
    if (slugs.length < 2) continue;
    slugs.sort();
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        comparePairs.push({
          url: `${SITE_URL}/compare/${slugs[i]}-vs-${slugs[j]}`,
          lastModified: new Date(),
          priority: 0.6,
        });
      }
    }
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/layer/hypercore`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/layer/hyperevm`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/layer/hip3`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/markets`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/funding-rates`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/stats`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/trending`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/glossary`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "weekly",
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tools/liquidation-calculator`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/fee-calculator`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/position-size-calculator`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/pnl-calculator`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/funding-arbitrage-calculator`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/sitemap-html`,
      lastModified: new Date(),
      priority: 0.3,
    },
    ...learnEntries,
    ...categoryEntries,
    ...projectEntries,
    ...ecosystemEntries,
    ...comparePairs,
  ];
}
