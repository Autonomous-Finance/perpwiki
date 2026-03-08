import { prisma } from "@/lib/prisma";
import { categoryToSlug, CATEGORIES } from "@/lib/categories";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToCategory(slug: string): string | undefined {
  // Check known categories
  const found = CATEGORIES.find((c) => categoryToSlug(c) === slug);
  if (found) return found;
  return undefined;
}

export async function generateStaticParams() {
  const cats = await prisma.project.groupBy({
    by: ["category"],
    where: { approvalStatus: "APPROVED" },
  });
  return cats.map((c) => ({ slug: categoryToSlug(c.category) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not Found" };
  return {
    title: `Best Hyperliquid ${category} Projects 2026 | perp.wiki`,
    description: `Top ${category} projects in the Hyperliquid ecosystem. Independent directory with features and ecosystem context. perp.wiki`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Try known categories first, then do a DB lookup
  let category = slugToCategory(slug);
  if (!category) {
    // Try finding a matching category in the DB by slug
    const allCats = await prisma.project.groupBy({
      by: ["category"],
      where: { approvalStatus: "APPROVED" },
    });
    const match = allCats.find((c) => categoryToSlug(c.category) === slug);
    if (match) {
      category = match.category;
    }
  }

  if (!category) notFound();

  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED", category },
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
  });

  if (projects.length === 0) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} Projects on Hyperliquid`,
          description: `Browse all ${category} projects in the Hyperliquid ecosystem.`,
          url: `${SITE_URL}/category/${slug}`,
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

      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <Link href="/category" className="hover:text-[var(--hw-text-muted)]">Categories</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{category}</span>
      </div>

      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] mb-2">
        {category}
      </h1>
      <p className="text-[var(--hw-text-muted)] mb-8">
        {projects.length} project{projects.length !== 1 ? "s" : ""} in the Hyperliquid ecosystem
      </p>

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
