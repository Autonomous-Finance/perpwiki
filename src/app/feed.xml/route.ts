import { prisma } from "@/lib/prisma";
import { LEARN_ARTICLES } from "@/lib/learn-articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";
const SITE_NAME = "perp.wiki — Hyperliquid Ecosystem Directory";
const SITE_DESCRIPTION =
  "Discover, compare, and research every project building on Hyperliquid. The independent intelligence directory for HyperCore, HyperEVM, and HIP-3.";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      slug: true,
      name: true,
      tagline: true,
      createdAt: true,
    },
  });

  const projectItems = projects.map(
    (p) => `    <item>
      <title>${escapeXml(p.name)}</title>
      <link>${SITE_URL}/projects/${p.slug}</link>
      <description>${escapeXml(p.tagline || `${p.name} on the Hyperliquid ecosystem`)}</description>
      <guid isPermaLink="true">${SITE_URL}/projects/${p.slug}</guid>
      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
    </item>`,
  );

  const articleItems = LEARN_ARTICLES.slice(0, 10).map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/learn/${a.slug}</link>
      <description>${escapeXml(a.description)}</description>
      <guid isPermaLink="true">${SITE_URL}/learn/${a.slug}</guid>
      <pubDate>${new Date(a.datePublished).toUTCString()}</pubDate>
    </item>`,
  );

  const items = [...projectItems, ...articleItems].join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
