import { prisma } from "@/lib/prisma";
import { categoryToSlug, CATEGORIES } from "@/lib/categories";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";

const CATEGORY_INTROS: Record<string, { headline: string; intro: string }> = {
  "yield-vaults": {
    headline: "Yield & Vault Protocols on Hyperliquid",
    intro: "Yield and vault protocols on Hyperliquid let traders earn passive returns on idle capital — from automated HLP strategies to structured yield products built natively on HyperCore and HyperEVM. With 8 projects in this category, Hyperliquid has the deepest yield infrastructure of any perp-native L1.",
  },
  "decentralized-exchanges": {
    headline: "Decentralized Exchanges on Hyperliquid",
    intro: "DEXs on Hyperliquid range from spot AMMs built on HyperEVM to aggregators routing trades across the entire ecosystem. Unlike most L1s, Hyperliquid DEXs benefit from shared order book liquidity with HyperCore — giving them a structural edge over isolated EVM chains.",
  },
  "lending-borrowing": {
    headline: "Lending & Borrowing Protocols on Hyperliquid",
    intro: "Lending protocols on HyperEVM enable traders to borrow against their perp positions and staked assets, creating a capital-efficient loop unique to Hyperliquid's unified state design. Protocols like HyperLend and Felix are building the money market infrastructure for the HL ecosystem.",
  },
  "trading-bots-automation": {
    headline: "Trading Bots & Automation on Hyperliquid",
    intro: "Hyperliquid's low-latency HyperCore L1 and open API make it one of the best chains for automated trading strategies. Bot platforms and automation tools here range from copy-trading and grid bots to full algorithmic execution suites targeting Hyperliquid's order book.",
  },
  "trading-terminals-interfaces": {
    headline: "Trading Terminals & Interfaces for Hyperliquid",
    intro: "Advanced trading terminals built for Hyperliquid give power users charting, multi-account management, and custom order types beyond the native UI. These third-party interfaces often unlock features for serious traders that aren't available on app.hyperliquid.xyz.",
  },
  "bridges-cross-chain": {
    headline: "Bridges & Cross-Chain Infrastructure for Hyperliquid",
    intro: "Bridging to Hyperliquid is a critical step for any new user — and these protocols make it seamless to move assets from Ethereum, Arbitrum, and other chains directly into HyperEVM or native USDC on HyperCore. Fast, cheap bridging is essential infrastructure for ecosystem growth.",
  },
  "analytics-data": {
    headline: "Analytics & Data Tools for Hyperliquid",
    intro: "On-chain analytics tools for Hyperliquid give traders and researchers visibility into order flow, vault performance, funding rates, and ecosystem-wide activity. As HyperEVM matures, data tooling is becoming essential for anyone making informed decisions in the ecosystem.",
  },
  "liquid-staking": {
    headline: "Liquid Staking on Hyperliquid",
    intro: "Liquid staking protocols on Hyperliquid let users stake HYPE and receive liquid tokens that can be used as collateral across HyperEVM DeFi — combining staking yield with full capital efficiency. This unlocks the classic LSTfi loop pioneered on Ethereum but native to HL.",
  },
};

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

      {CATEGORY_INTROS[slug] && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{CATEGORY_INTROS[slug].headline}</h2>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{CATEGORY_INTROS[slug].intro}</p>
        </div>
      )}

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
