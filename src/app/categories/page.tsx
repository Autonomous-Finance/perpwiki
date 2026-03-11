import { prisma } from "@/lib/prisma";
import { CATEGORIES, categoryToSlug } from "@/lib/categories";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";

export const metadata: Metadata = {
  title: "Hyperliquid Ecosystem Categories — All DeFi Sectors",
  description:
    "Browse all Hyperliquid ecosystem categories — liquid staking, lending, DEXs, yield vaults, trading tools, and more. Discover every DeFi sector on HyperEVM and HyperCore.",
  alternates: { canonical: `${SITE_URL}/categories` },
  openGraph: {
    title: "Hyperliquid Ecosystem Categories — All DeFi Sectors",
    description:
      "Browse all Hyperliquid ecosystem categories — liquid staking, lending, DEXs, yield vaults, trading tools, and more. Discover every DeFi sector on HyperEVM and HyperCore.",
    url: "https://perp.wiki/categories",
    siteName: "perp.wiki",
    images: [{ url: "/categories/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Ecosystem Categories — All DeFi Sectors",
    description:
      "Browse all Hyperliquid ecosystem categories — liquid staking, lending, DEXs, yield vaults, trading tools, and more. Discover every DeFi sector on HyperEVM and HyperCore.",
    images: ["/categories/opengraph-image"],
  },
};

/* Short descriptions for each category */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Trading Terminals & Interfaces":
    "Advanced charting, execution, and portfolio management tools for Hyperliquid perp trading.",
  "Trading Bots & Automation":
    "Copy-trading, grid bots, and algorithmic execution suites targeting HyperCore's low-latency order book.",
  "Analytics & Data":
    "Dashboards, whale tracking, and ecosystem analytics for Hyperliquid markets and DeFi protocols.",
  "Portfolio Trackers":
    "Track positions, P&L, and portfolio allocation across HyperCore perps and HyperEVM DeFi.",
  "Liquid Staking":
    "Stake HYPE and receive liquid tokens (kHYPE, stHYPE, beHYPE) for use across HyperEVM DeFi.",
  "Lending & Borrowing":
    "Borrow against staked assets and perp positions — pool-based money markets and CDP protocols.",
  "Decentralized Exchanges":
    "Spot AMMs and swap protocols on HyperEVM with shared order book liquidity from HyperCore.",
  "Yield & Vaults":
    "Passive yield strategies — from delta-neutral vaults and HLP to leveraged staking loops.",
  "Bridges & Cross-Chain":
    "Bridge assets between Hyperliquid, Ethereum, Arbitrum, and other networks.",
  "Wallets & Account Abstraction":
    "Wallet infrastructure, key management, and account abstraction for HyperCore and HyperEVM.",
  "Prediction Markets":
    "Trade on real-world event outcomes using HIP-3 permissionless perpetual futures.",
  "RWA Perps":
    "Perpetual futures for commodities, indices, and traditional assets via HIP-3.",
  "Event Contracts":
    "Tradable markets around specific events and outcomes on Hyperliquid.",
  "Meme Perps":
    "Leveraged perpetual markets for meme tokens and community-driven assets.",
  "Oracles":
    "Price feeds and off-chain data infrastructure for HyperEVM DeFi protocols.",
  "SDKs & Developer Tools":
    "Libraries, APIs, and frameworks for building on HyperCore and HyperEVM.",
  "Security & Audits":
    "Smart contract auditing, monitoring, and risk assessment for HyperEVM protocols.",
  "Data APIs":
    "Programmatic access to Hyperliquid market data, on-chain activity, and protocol metrics.",
  "NFTs & Collectibles":
    "Digital collectibles, community PFPs, and NFT infrastructure on Hyperliquid.",
  "Communities & DAOs":
    "Community coordination, governance, and DAO infrastructure for the Hyperliquid ecosystem.",
  "Media & Education":
    "Content, guides, and educational resources for Hyperliquid users and builders.",
  "Airdrop Trackers":
    "Track eligibility and activity for potential token distributions across the ecosystem.",
};

export default async function CategoriesHubPage() {
  // Count projects per category
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { category: true },
  });

  const countMap = new Map<string, number>();
  for (const p of projects) {
    countMap.set(p.category, (countMap.get(p.category) || 0) + 1);
  }

  // Build category list — show all defined categories, even if 0 projects
  const categories = CATEGORIES.map((cat) => ({
    name: cat,
    slug: categoryToSlug(cat),
    count: countMap.get(cat) || 0,
    description: CATEGORY_DESCRIPTIONS[cat] || "",
  }));

  // Sort: categories with projects first, then alphabetically
  categories.sort((a, b) => {
    if (a.count > 0 && b.count === 0) return -1;
    if (a.count === 0 && b.count > 0) return 1;
    return a.name.localeCompare(b.name);
  });

  const totalProjects = projects.length;
  const activeCategories = categories.filter((c) => c.count > 0).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Hyperliquid Ecosystem Categories",
          url: `${SITE_URL}/categories`,
          description: `Browse all ${activeCategories} active categories in the Hyperliquid ecosystem covering ${totalProjects} projects.`,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Categories", href: `${SITE_URL}/categories` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Categories</span>
      </nav>

      {/* Header */}
      <div
        className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-8 sm:p-10 mb-10 overflow-hidden"
        style={{ borderRadius: "4px" }}
      >
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)" }}
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
            Hyperliquid Ecosystem Categories
          </h1>
          <p className="text-base text-[var(--hw-text-muted)] max-w-2xl mb-2">
            Browse every DeFi sector on Hyperliquid — from liquid staking and lending to trading tools and developer infrastructure.
          </p>
          <p className="text-sm text-[var(--hw-text-dim)]">
            {totalProjects} projects across {activeCategories} active categories
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]"
            style={{ borderRadius: "4px" }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                {cat.name}
              </h2>
              <span
                className="shrink-0 bg-[var(--hw-green-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--hw-text-muted)]"
                style={{ borderRadius: "2px" }}
              >
                {cat.count}
              </span>
            </div>
            {cat.description && (
              <p className="text-sm text-[var(--hw-text-dim)] line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-1 text-xs text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors">
              <span>View projects</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
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
          Looking for a specific project?
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
