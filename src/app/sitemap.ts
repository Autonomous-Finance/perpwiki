import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true, updatedAt: true },
  });

  const projectEntries = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
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
    ...projectEntries,
  ];
}
