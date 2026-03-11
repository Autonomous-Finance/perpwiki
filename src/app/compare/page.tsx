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
  openGraph: {
    title: "Compare Hyperliquid Projects — LSTs, Lending, DEXs",
    description:
      "Side-by-side comparisons of Hyperliquid ecosystem projects. Compare LSTs, lending protocols, DEXs, and yield strategies on HyperEVM.",
    url: "https://perp.wiki/compare",
    siteName: "perp.wiki",
    images: [{ url: "/compare/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Compare Hyperliquid Projects — LSTs, Lending, DEXs",
    description:
      "Side-by-side comparisons of Hyperliquid ecosystem projects. Compare LSTs, lending protocols, DEXs, and yield strategies on HyperEVM.",
    images: ["/compare/opengraph-image"],
  },
};

interface GroupedCategory {
  category: string;
  slug: string;
  projects: { slug: string; name: string }[];
  pairs: { slugA: string; slugB: string; nameA: string; nameB: string }[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "Liquid Staking": "\u2744",
  "Lending & Borrowing": "\uD83C\uDFE6",
  "Decentralized Exchanges": "\u21C4",
  "Yield & Vaults": "\uD83C\uDF31",
  "Trading Terminals & Interfaces": "\uD83D\uDDA5",
  "Trading Bots & Automation": "\u2699",
  "Analytics & Data": "\uD83D\uDCCA",
  "Portfolio Trackers": "\uD83D\uDCCB",
  "Bridges & Cross-Chain": "\uD83C\uDF09",
  "Wallets & Account Abstraction": "\uD83D\uDD10",
  "Prediction Markets": "\uD83C\uDFB2",
  "RWA Perps": "\uD83C\uDFDB",
  "Event Contracts": "\uD83C\uDFAF",
  "Meme Perps": "\uD83D\uDC38",
  "Oracles": "\uD83D\uDD2E",
  "SDKs & Developer Tools": "\uD83D\uDEE0",
  "Security & Audits": "\uD83D\uDEE1",
  "Data APIs": "\uD83D\uDD0C",
  "NFTs & Collectibles": "\uD83D\uDDBC",
  "Communities & DAOs": "\uD83D\uDC65",
  "Media & Education": "\uD83D\uDCDA",
  "Airdrop Trackers": "\uD83C\uDF81",
};

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

  // Popular comparisons: first pair from the top 4 categories
  const popularPairs = groups
    .slice(0, 4)
    .map((g) => ({ ...g.pairs[0], category: g.category }))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
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

      {/* Hero */}
      <div className="relative mb-10">
        <div
          className="absolute -top-4 -left-4 h-24 w-24 opacity-20 blur-2xl pointer-events-none"
          style={{ background: "var(--hw-green)" }}
        />
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center text-lg"
            style={{ borderRadius: "4px", background: "var(--hw-green-subtle)" }}
          >
            <svg className="h-5 w-5 text-[var(--hw-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)]">
            Compare Projects
          </h1>
        </div>
        <p className="text-base text-[var(--hw-text-muted)] mb-3 max-w-2xl">
          Side-by-side comparisons of the top protocols across every DeFi category on Hyperliquid.
          Pick any two projects in the same category to see how they stack up on features, layer,
          status, and ecosystem fit.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-green)]">
            {totalPairs}
          </span>
          <span className="text-[var(--hw-text-dim)]">comparisons</span>
          <span className="text-[var(--hw-border)]">|</span>
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-green)]">
            {groups.length}
          </span>
          <span className="text-[var(--hw-text-dim)]">categories</span>
          <span className="text-[var(--hw-border)]">|</span>
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-green)]">
            {projects.length}
          </span>
          <span className="text-[var(--hw-text-dim)]">projects</span>
        </div>
        <p className="mt-3 text-sm text-[var(--hw-text-dim)]">
          Jump to a category below, or search for a specific project comparison.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {groups.map((group) => (
          <a
            key={`chip-${group.slug}`}
            href={`#${group.slug}`}
            className="px-3 py-1.5 text-xs font-medium border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-green)] hover:text-[var(--hw-green)] transition-all"
            style={{ borderRadius: "4px" }}
          >
            {group.category}
          </a>
        ))}
      </div>

      {/* Popular Comparisons */}
      {popularPairs.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--hw-gold)]">&#9733;</span>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)]">
              Popular Comparisons
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {popularPairs.map((pair) => (
              <Link
                key={`popular-${pair.slugA}-${pair.slugB}`}
                href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                className="group relative overflow-hidden border border-[var(--hw-border-bright)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-green)]"
                style={{ borderRadius: "4px" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(0,229,160,0.03) 0%, transparent 60%)" }}
                />
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold text-[var(--hw-bg)]"
                      style={{ borderRadius: "4px", background: "var(--hw-green)" }}
                    >
                      {pair.nameA.charAt(0)}
                    </span>
                    <span className="text-sm font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                      {pair.nameA}
                    </span>
                  </div>
                  <span
                    className="shrink-0 px-2 py-0.5 text-[10px] font-bold text-[var(--hw-text-dim)] uppercase tracking-wider"
                    style={{ borderRadius: "2px", background: "var(--hw-surface-raised)" }}
                  >
                    vs
                  </span>
                  <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                    <span className="text-sm font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate text-right">
                      {pair.nameB}
                    </span>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold text-[var(--hw-bg)]"
                      style={{ borderRadius: "4px", background: "var(--hw-cyan)" }}
                    >
                      {pair.nameB.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--hw-text-dim)]">{pair.category}</span>
                  <svg
                    className="h-4 w-4 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Quick Nav */}
      <div className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text-dim)] uppercase tracking-wider mb-3">
          Jump to Category
        </h2>
        <div className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <a
              key={`nav-${group.slug}`}
              href={`#${group.slug}`}
              className="inline-flex items-center gap-1.5 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-1.5 text-xs text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
              style={{ borderRadius: "4px" }}
            >
              <span>{CATEGORY_ICONS[group.category] || "\u25CB"}</span>
              {group.category}
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-dim)]">
                {group.pairs.length}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Category sections */}
      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.slug} id={group.slug}>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl" role="img" aria-hidden="true">
                {CATEGORY_ICONS[group.category] || "\u25CB"}
              </span>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
                {group.category}
              </h2>
              <span
                className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--hw-text-dim)] px-2 py-0.5"
                style={{ borderRadius: "2px", background: "var(--hw-surface-raised)" }}
              >
                {group.projects.length} projects &middot; {group.pairs.length} pairs
              </span>
            </div>
            <p className="text-sm text-[var(--hw-text-dim)] mb-5 ml-9">
              Compare {group.category.toLowerCase()} protocols on Hyperliquid &mdash; features, layer, and ecosystem role.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.pairs.map((pair) => (
                <Link
                  key={`${pair.slugA}-${pair.slugB}`}
                  href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                  className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)] hover:bg-[var(--hw-surface-raised)]"
                  style={{ borderRadius: "4px" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-1.5">
                      <span
                        className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-[var(--hw-bg)] ring-2 ring-[var(--hw-surface)]"
                        style={{ borderRadius: "4px", background: "var(--hw-green)" }}
                      >
                        {pair.nameA.charAt(0)}
                      </span>
                      <span
                        className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-[var(--hw-bg)] ring-2 ring-[var(--hw-surface)]"
                        style={{ borderRadius: "4px", background: "var(--hw-cyan)" }}
                      >
                        {pair.nameB.charAt(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                        {pair.nameA}
                      </span>
                      <span
                        className="shrink-0 text-[9px] font-bold text-[var(--hw-text-dim)] uppercase"
                      >
                        vs
                      </span>
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

      {/* SEO Content Section */}
      <section className="mt-16 border-t border-[var(--hw-border)] pt-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          Why Compare Hyperliquid Projects?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 text-sm text-[var(--hw-text-muted)] leading-relaxed">
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[var(--hw-text)] font-medium mb-2">
              Make Informed Decisions
            </h3>
            <p>
              The Hyperliquid ecosystem is growing fast with dozens of protocols launching across DeFi
              categories. Comparing projects side by side helps you understand the trade-offs between
              competing protocols &mdash; whether you&apos;re choosing a liquid staking provider, a
              lending market, or a DEX for your trades.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[var(--hw-text)] font-medium mb-2">
              Understand Layer Differences
            </h3>
            <p>
              Hyperliquid has a unique multi-layer architecture: HyperCore for the native orderbook,
              HyperEVM for smart contracts, and HIP-3 for permissionless perp markets. Understanding
              which layer a project operates on is key to evaluating its capabilities and limitations.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[var(--hw-text)] font-medium mb-2">
              Discover Alternatives
            </h3>
            <p>
              Each comparison highlights the strengths and trade-offs of two competing protocols.
              You might discover that a lesser-known project actually fits your use case better than
              the popular choice. Our comparisons surface details that aren&apos;t obvious at first glance.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[var(--hw-text)] font-medium mb-2">
              Track Ecosystem Growth
            </h3>
            <p>
              As new projects launch on Hyperliquid, we add them to our comparison database. Bookmark
              this page to stay current on how the competitive landscape is evolving across liquid staking,
              lending, DEXs, yield strategies, and more.
            </p>
          </div>
        </div>
      </section>

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
