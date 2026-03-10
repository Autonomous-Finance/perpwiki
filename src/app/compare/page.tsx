import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { prisma } from "@/lib/prisma";
import { categoryToSlug } from "@/lib/categories";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare Hyperliquid Projects — LSTs, Lending, DEXs",
  description:
    "Side-by-side comparisons of Hyperliquid ecosystem projects. Compare LSTs, lending protocols, DEXs, and yield strategies on HyperEVM.",
  alternates: { canonical: "https://perp.wiki/compare" },
};

interface GroupedCategory {
  category: string;
  slug: string;
  projects: { slug: string; name: string }[];
  pairs: { slugA: string; slugB: string; nameA: string; nameB: string }[];
}

export default async function CompareHubPage() {
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true, name: true, category: true },
    orderBy: { name: "asc" },
  });

  // Group by category
  const byCategory = new Map<string, { slug: string; name: string }[]>();
  for (const p of projects) {
    const existing = byCategory.get(p.category) || [];
    existing.push({ slug: p.slug, name: p.name });
    byCategory.set(p.category, existing);
  }

  // Build category groups with all unique pairs (only categories with 2+ projects)
  const groups: GroupedCategory[] = [];
  for (const [category, members] of byCategory) {
    if (members.length < 2) continue;
    const pairs: GroupedCategory["pairs"] = [];
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        pairs.push({
          slugA: members[i].slug,
          slugB: members[j].slug,
          nameA: members[i].name,
          nameB: members[j].name,
        });
      }
    }
    groups.push({
      category,
      slug: categoryToSlug(category),
      projects: members,
      pairs,
    });
  }

  // Sort categories by number of pairs descending
  groups.sort((a, b) => b.pairs.length - a.pairs.length);

  const totalPairs = groups.reduce((sum, g) => sum + g.pairs.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Compare Hyperliquid Ecosystem Projects",
          url: "https://perp.wiki/compare",
          description: `Side-by-side comparisons of the top protocols across every DeFi category on HyperEVM. ${totalPairs} comparison pairs available.`,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Compare", href: "https://perp.wiki/compare" },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Compare</span>
      </nav>

      {/* Header */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
        Compare Hyperliquid Ecosystem Projects
      </h1>
      <p className="text-base text-[var(--hw-text-muted)] mb-2 max-w-2xl">
        Side-by-side comparisons of the top protocols across every DeFi category on HyperEVM.
      </p>
      <p className="text-sm text-[var(--hw-text-dim)] mb-10">
        {totalPairs} comparisons across {groups.length} categories
      </p>

      {/* Category sections */}
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.slug}>
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)]">
                {group.category}
              </h2>
              <span className="text-xs text-[var(--hw-text-dim)]">
                {group.projects.length} projects &middot; {group.pairs.length} comparisons
              </span>
            </div>
            <p className="text-sm text-[var(--hw-text-dim)] mb-4">
              Compare {group.category.toLowerCase()} protocols on Hyperliquid — features, layer, and ecosystem role.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.pairs.map((pair) => (
                <Link
                  key={`${pair.slugA}-${pair.slugB}`}
                  href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                  className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
                  style={{ borderRadius: "4px" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                        {pair.nameA}
                      </span>
                      <span className="text-xs text-[var(--hw-text-dim)] shrink-0">vs</span>
                      <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                        {pair.nameB}
                      </span>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-12 border border-[var(--hw-border)] p-6 text-center"
        style={{
          borderRadius: "4px",
          background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
        }}
      >
        <p className="text-sm text-[var(--hw-text-muted)] mb-3">
          Don&apos;t see the comparison you need?
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
        >
          Browse All Projects
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
