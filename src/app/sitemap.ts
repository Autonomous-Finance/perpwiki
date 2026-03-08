import { prisma } from "@/lib/prisma";
import { categoryToSlug } from "@/lib/categories";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

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
      url: `${SITE_URL}/submit`,
      lastModified: new Date(),
      priority: 0.5,
    },
    ...learnEntries,
    ...categoryEntries,
    ...projectEntries,
  ];
}
