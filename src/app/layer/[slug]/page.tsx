import { prisma } from "@/lib/prisma";
import { LAYER_META } from "@/lib/categories";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

const LAYER_SLUGS: Record<string, string> = {
  hypercore: "HYPERCORE",
  hyperevm: "HYPEREVM",
  hip3: "HIP3",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const layer = LAYER_SLUGS[slug];
  if (!layer) return { title: "Not Found" };
  const meta = LAYER_META[layer];
  const layerTitles: Record<string, string> = {
    HYPERCORE: "Best HyperCore Projects 2026 — Hyperliquid Native",
    HYPEREVM: "Best HyperEVM Projects 2026: EVM on Hyperliquid",
    HIP3: "HIP-3 Projects 2026 — Hyperliquid External Assets",
  };
  const title = layerTitles[layer] || `${meta.label} Projects`;
  const description = `Browse all ${meta.label} projects in the Hyperliquid ecosystem. Independent directory on perp.wiki.`;
  return {
    title,
    description,
    alternates: { canonical: `https://perp.wiki/layer/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://perp.wiki/layer/${slug}`,
      siteName: "perp.wiki",
      images: [{ url: `/layer/${slug}/opengraph-image`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      site: "@perpwiki",
      title,
      description,
      images: [`/layer/${slug}/opengraph-image`],
    },
  };
}

export default async function LayerPage({ params }: Props) {
  const { slug } = await params;
  const layer = LAYER_SLUGS[slug];
  if (!layer) notFound();

  const meta = LAYER_META[layer];

  const projects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      OR: [{ layer }, { layer: "BOTH" }],
    },
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${meta.label} Projects`,
          description: `All ${meta.label} projects in the Hyperliquid ecosystem. ${meta.description}.`,
          url: `${SITE_URL}/layer/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${SITE_URL}/projects/${p.slug}`,
            })),
          },
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: meta.label, href: `https://perp.wiki/layer/${slug}` },
        ]}
      />
      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{meta.label}</span>
      </div>

      <h1
        className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2"
        style={{ color: meta.color }}
      >
        {meta.label}
      </h1>
      <p className="text-[var(--hw-text-muted)] mb-8">{meta.description}</p>

      <div className="mb-4 text-sm text-[var(--hw-text-dim)]">
        {projects.length} project{projects.length !== 1 ? "s" : ""}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            name={project.name}
            tagline={project.tagline}
            layer={project.layer}
            category={project.category}
            status={project.status}
            isVerified={project.isVerified}
          />
        ))}
      </div>
    </div>
  );
}
