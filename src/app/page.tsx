import { prisma } from "@/lib/prisma";
import { LAYER_META } from "@/lib/categories";
import { HomeSearch } from "@/components/HomeSearch";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectLogo } from "@/components/ProjectLogo";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getHypePrice, getHlMeta, getTopMarkets, formatUsd } from "@/lib/hl-api";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "perp.wiki — Hyperliquid Ecosystem Directory 2026",
  description:
    "Independent directory of 48+ Hyperliquid ecosystem projects. Browse HyperCore, HyperEVM, and HIP-3 apps — trading tools, DeFi, liquid staking, analytics and more. perp.wiki",
  openGraph: {
    title: "perp.wiki — Hyperliquid Ecosystem Directory 2026",
    description:
      "Independent directory of 48+ Hyperliquid ecosystem projects. Browse HyperCore, HyperEVM, and HIP-3 apps — trading tools, DeFi, liquid staking, analytics and more. perp.wiki",
  },
  keywords: [
    "Hyperliquid",
    "Hyperliquid ecosystem",
    "HyperEVM projects",
    "HYPE token",
    "perp DEX",
    "perpetual DEX directory",
  ],
  alternates: { canonical: "https://perp.wiki" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

// Category icons for Browse by Category
const CATEGORY_ICONS: Record<string, string> = {
  "Trading Terminals & Interfaces": "📊",
  "Trading Bots & Automation": "🤖",
  "Analytics & Data": "📈",
  "Portfolio Trackers": "💼",
  "Liquid Staking": "💧",
  "Lending & Borrowing": "🏦",
  "Decentralized Exchanges": "🔄",
  "Yield & Vaults": "🌾",
  "Bridges & Cross-Chain": "🌉",
  "Wallets & Account Abstraction": "👛",
  "Prediction Markets": "🔮",
  "RWA Perps": "🏢",
  "Event Contracts": "📅",
  "Meme Perps": "🎭",
  "Oracles": "🔗",
  "SDKs & Developer Tools": "🛠️",
  "Security & Audits": "🛡️",
  "Data APIs": "⚡",
  "NFTs & Collectibles": "🎨",
  "Communities & DAOs": "👥",
  "Media & Education": "📚",
  "Airdrop Trackers": "🎯",
};

// Category accent colors
const CATEGORY_COLORS: Record<string, string> = {
  "Trading Terminals & Interfaces": "var(--hw-green)",
  "Trading Bots & Automation": "var(--hw-green)",
  "Analytics & Data": "var(--hw-cyan)",
  "Portfolio Trackers": "var(--hw-cyan)",
  "Liquid Staking": "#00C8E0",
  "Lending & Borrowing": "#A78BFA",
  "Decentralized Exchanges": "var(--hw-green)",
  "Yield & Vaults": "var(--hw-gold)",
  "Bridges & Cross-Chain": "#A78BFA",
  "Wallets & Account Abstraction": "var(--hw-cyan)",
  "Prediction Markets": "#A78BFA",
  "RWA Perps": "var(--hw-gold)",
  "Event Contracts": "var(--hw-gold)",
  "Meme Perps": "var(--hw-red)",
  "Oracles": "var(--hw-green)",
  "SDKs & Developer Tools": "var(--hw-cyan)",
  "Security & Audits": "var(--hw-green)",
  "Data APIs": "var(--hw-cyan)",
  "NFTs & Collectibles": "#A78BFA",
  "Communities & DAOs": "var(--hw-gold)",
  "Media & Education": "var(--hw-green)",
  "Airdrop Trackers": "var(--hw-gold)",
};

async function getStats() {
  const total = await prisma.project.count({ where: { approvalStatus: "APPROVED" } });
  const hypercore = await prisma.project.count({
    where: { approvalStatus: "APPROVED", layer: { in: ["HYPERCORE", "BOTH"] } },
  });
  const hyperevm = await prisma.project.count({
    where: { approvalStatus: "APPROVED", layer: { in: ["HYPEREVM", "BOTH"] } },
  });
  const hip3 = await prisma.project.count({
    where: { approvalStatus: "APPROVED", layer: "HIP3" },
  });
  return { total, hypercore, hyperevm, hip3 };
}

async function getLayerProjects(layer: string, limit = 3) {
  const where =
    layer === "BOTH"
      ? { approvalStatus: "APPROVED" as const }
      : {
          approvalStatus: "APPROVED" as const,
          OR: [{ layer }, { layer: "BOTH" }],
        };
  return prisma.project.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
    take: limit,
  });
}

async function getFeaturedSpotlight() {
  const slugs = ["hlp", "purr", "felix-protocol", "kinetiq"];
  const projects = await prisma.project.findMany({
    where: { slug: { in: slugs }, approvalStatus: "APPROVED" },
  });
  return slugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) as typeof projects;
}

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
    take: 9,
  });
}

async function getRecentProjects() {
  return prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

async function getCategoryCounts() {
  const groups = await prisma.project.groupBy({
    by: ["category"],
    where: { approvalStatus: "APPROVED" },
    _count: true,
  });
  const counts: Record<string, number> = {};
  for (const g of groups) {
    counts[g.category] = g._count;
  }
  return counts;
}

async function getAllProjectsForSearch() {
  return prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true, name: true, tagline: true, category: true, layer: true, logoUrl: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });
}

const SPOTLIGHT_STATS: Record<string, string> = {
  hlp: "15-25% APR",
  purr: "First HIP-1 Token",
  "felix-protocol": "$1B+ TVL",
  kinetiq: "$470M+ Staked",
};

const SPOTLIGHT_COLORS: Record<string, string> = {
  hlp: "var(--hw-green)",
  purr: "var(--hw-gold)",
  "felix-protocol": "var(--hw-cyan)",
  kinetiq: "#A78BFA",
};

export default async function HomePage() {
  const [
    stats,
    spotlight,
    featured,
    recentProjects,
    coreProjects,
    evmProjects,
    hip3Projects,
    categoryCounts,
    hypeData,
    hlMeta,
    topMarkets,
    allProjects,
  ] = await Promise.all([
    getStats(),
    getFeaturedSpotlight(),
    getFeaturedProjects(),
    getRecentProjects(),
    getLayerProjects("HYPERCORE"),
    getLayerProjects("HYPEREVM"),
    getLayerProjects("HIP3"),
    getCategoryCounts(),
    getHypePrice(),
    getHlMeta(),
    getTopMarkets(),
    getAllProjectsForSearch(),
  ]);

  const layerSections = [
    { key: "HYPERCORE", label: "HyperCore", projects: coreProjects, count: stats.hypercore, href: "/layer/hypercore" },
    { key: "HYPEREVM", label: "HyperEVM", projects: evmProjects, count: stats.hyperevm, href: "/layer/hyperevm" },
    { key: "HIP3", label: "HIP-3", projects: hip3Projects, count: stats.hip3, href: "/layer/hip3" },
  ];

  const meta = hlMeta.meta;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "perp.wiki",
          url: SITE_URL,
          description: "The independent intelligence directory for the Hyperliquid ecosystem.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/projects?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* Command Search (always mounted, triggered by Cmd+K) */}
      <HomeSearch projects={allProjects} />

      {/* Live Stats Ticker */}
      <div className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 overflow-x-auto px-4 py-2 text-xs md:gap-8">
          {hypeData.price && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[var(--hw-text-dim)]">HYPE</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-green)] font-medium">
                ${parseFloat(hypeData.price).toFixed(2)}
              </span>
              {hypeData.live && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--hw-green)]" />
                </span>
              )}
            </div>
          )}
          {meta?.marketsCount && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[var(--hw-text-dim)]">Markets</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{meta.marketsCount}</span>
            </div>
          )}
          {meta?.totalVol24h && (
            <div className="hidden items-center gap-1.5 shrink-0 sm:flex">
              <span className="text-[var(--hw-text-dim)]">24h Vol</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{formatUsd(meta.totalVol24h)}</span>
            </div>
          )}
          {meta?.totalOi && (
            <div className="hidden items-center gap-1.5 shrink-0 sm:flex">
              <span className="text-[var(--hw-text-dim)]">Open Interest</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{formatUsd(meta.totalOi)}</span>
            </div>
          )}
          {meta?.validatorCount && (
            <div className="hidden items-center gap-1.5 shrink-0 md:flex">
              <span className="text-[var(--hw-text-dim)]">Validators</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{meta.validatorCount}</span>
            </div>
          )}
          <div className="hidden items-center gap-1.5 shrink-0 md:flex">
            <span className="text-[var(--hw-text-dim)]">Projects</span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{stats.total}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-[var(--hw-border)]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)] md:text-3xl">
                Hyperliquid Ecosystem
              </h1>
              <p className="mt-1 text-sm text-[var(--hw-text-muted)]">
                {stats.total} projects · {meta?.marketsCount ?? 229} markets · Live data
              </p>
            </div>
            <div className="w-full md:w-80">
              <SearchTriggerBar />
            </div>
          </div>

          {/* Data cards row */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MiniStatCard
              label="HYPE Price"
              value={hypeData.price ? `$${parseFloat(hypeData.price).toFixed(2)}` : "—"}
              accent
              live
            />
            <MiniStatCard
              label="24h Volume"
              value={meta?.totalVol24h ? formatUsd(meta.totalVol24h) : "—"}
              live
            />
            <MiniStatCard
              label="Open Interest"
              value={meta?.totalOi ? formatUsd(meta.totalOi) : "—"}
              live
            />
            <MiniStatCard
              label="Markets"
              value={meta?.marketsCount ? String(meta.marketsCount) : "229"}
            />
            <MiniStatCard
              label="Validators"
              value={meta?.validatorCount ? String(meta.validatorCount) : "—"}
            />
            <MiniStatCard
              label="DEX Share"
              value="10.2%"
              accent
            />
          </div>

          {/* Hero CTAs */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
              style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
            >
              Explore Ecosystem
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-green)] hover:text-[var(--hw-green)] transition-all"
              style={{ borderRadius: "4px" }}
            >
              Live Markets
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Quick nav */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[
              { label: "Markets", href: "/markets" },
              { label: "Funding Rates", href: "/funding-rates" },
              { label: "Stats", href: "/stats" },
              { label: "Trending", href: "/trending" },
              { label: "HyperCore", href: "/layer/hypercore" },
              { label: "HyperEVM", href: "/layer/hyperevm" },
              { label: "HIP-3", href: "/layer/hip3" },
              { label: "Submit", href: "/submit" },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="px-2.5 py-1 text-xs border border-[var(--hw-border)] text-[var(--hw-text-dim)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)] rounded-sm"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spotlight — equal-height cards with color accents */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            Featured Projects
          </h2>
          <span className="text-xs text-[var(--hw-text-dim)]">Curated by community interest</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spotlight.map((p) => {
            const accentColor = SPOTLIGHT_COLORS[p.slug] || "var(--hw-green)";
            return (
              <Link key={p.slug} href={`/projects/${p.slug}`}>
                <div
                  className="card-hover group relative flex h-full min-h-[140px] flex-col justify-between rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 hover:border-[var(--hw-border-bright)] hover:shadow-[0_0_12px_rgba(0,229,160,0.06)] overflow-hidden"
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: accentColor }}
                  />
                  <div className="flex items-center gap-3">
                    <ProjectLogo name={p.name} logoUrl={p.logoUrl} size="sm" />
                    <div className="min-w-0">
                      <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                        {p.name}
                      </h3>
                      {SPOTLIGHT_STATS[p.slug] && (
                        <span
                          className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium"
                          style={{ color: accentColor }}
                        >
                          {SPOTLIGHT_STATS[p.slug]}
                        </span>
                      )}
                    </div>
                  </div>
                  {p.tagline && (
                    <p className="line-clamp-2 text-xs text-[var(--hw-text-muted)] mt-3">{p.tagline}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-[var(--hw-text-dim)]">{p.category}</span>
                    <svg className="h-3.5 w-3.5 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live Markets — enhanced with CTAs and visual indicators */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
              Live Markets
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-[var(--hw-green)]" style={{ borderRadius: 2, background: "var(--hw-green-subtle)" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--hw-green)] animate-pulse" />
              LIVE
            </span>
          </div>
          <Link href="/markets" className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
            View all markets &rarr;
          </Link>
        </div>

        {/* Market cards grid for top 4 */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {topMarkets.slice(0, 4).map((m) => {
            const price = parseFloat(m.markPx);
            const prev = parseFloat(m.prevDayPx);
            const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
            const isUp = change >= 0;
            return (
              <a
                key={m.name}
                href={`https://app.hyperliquid.xyz/trade/${m.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 hover:border-[var(--hw-border-bright)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">{m.name}</span>
                  <svg className="h-3.5 w-3.5 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-text)]">
                  ${price < 1 ? price.toPrecision(4) : price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </div>
                {/* Mini sparkline visual */}
                <div className="flex items-center gap-2 mt-2">
                  <MiniSparkline up={isUp} />
                  <span className={`font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium ${isUp ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>
                    {isUp ? "+" : ""}{change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--hw-text-dim)]">
                  <span>OI: {formatUsd(m.openInterest)}</span>
                  <span className="group-hover:text-[var(--hw-green)] transition-colors">Trade &rarr;</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Full table for remaining markets */}
        <div className="overflow-x-auto rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--hw-border)] text-left text-xs text-[var(--hw-text-dim)]">
                <th className="px-4 py-3 pr-4">#</th>
                <th className="px-4 py-3 pr-4">Market</th>
                <th className="px-4 py-3 pr-4 text-right">Price</th>
                <th className="px-4 py-3 pr-4 text-right">24h</th>
                <th className="px-4 py-3 pr-4 text-right hidden sm:table-cell">Funding/hr</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Open Interest</th>
                <th className="px-4 py-3 text-right">Trade</th>
              </tr>
            </thead>
            <tbody>
              {topMarkets.map((m, i) => {
                const price = parseFloat(m.markPx);
                const prev = parseFloat(m.prevDayPx);
                const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
                const funding = parseFloat(m.funding) * 100;
                return (
                  <tr key={m.name} className="border-b border-[var(--hw-border)] last:border-0 hover:bg-[var(--hw-surface-raised)] transition-colors">
                    <td className="px-4 py-3 pr-4 text-xs text-[var(--hw-text-dim)]">{i + 1}</td>
                    <td className="px-4 py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">{m.name}</span>
                        <MiniSparkline up={change >= 0} />
                      </div>
                    </td>
                    <td className="px-4 py-3 pr-4 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                      ${price < 1 ? price.toPrecision(4) : price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 pr-4 text-right font-[family-name:var(--font-jetbrains-mono)] ${change >= 0 ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>
                      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 pr-4 text-right font-[family-name:var(--font-jetbrains-mono)] hidden sm:table-cell ${funding >= 0 ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>
                      {funding >= 0 ? "+" : ""}{funding.toFixed(4)}%
                    </td>
                    <td className="px-4 py-3 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)] hidden md:table-cell">
                      {formatUsd(m.openInterest)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`https://app.hyperliquid.xyz/trade/${m.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium text-[var(--hw-green)] border border-[var(--hw-green)]/20 hover:bg-[var(--hw-green-subtle)] transition-colors"
                        style={{ borderRadius: "2px" }}
                      >
                        Trade
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Layer Navigator */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Explore by Layer
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {layerSections.map((section) => {
            const lm = LAYER_META[section.key];
            return (
              <div
                key={section.key}
                className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-border-bright)] overflow-hidden"
                style={{ borderRadius: "4px" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: lm.color }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: lm.color }} />
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)]">
                      {section.label}
                    </h3>
                  </div>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold" style={{ color: lm.color }}>
                    {section.count}
                  </span>
                </div>
                <p className="text-xs text-[var(--hw-text-dim)] mb-4">{lm.description}</p>
                <div className="flex flex-col gap-2 mb-4">
                  {section.projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="flex items-center justify-between py-1.5 text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ProjectLogo name={p.name} logoUrl={p.logoUrl} size="sm" />
                        <span>{p.name}</span>
                      </div>
                      <span className="text-xs text-[var(--hw-text-dim)]">{p.category}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={section.href}
                  className="text-sm font-medium transition-colors hover:text-[var(--hw-text)]"
                  style={{ color: lm.color }}
                >
                  Explore {section.label} &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* All Featured Projects */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            All Projects ({stats.total})
          </h2>
          <Link href="/projects" className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              name={project.name}
              tagline={project.tagline}
              layer={project.layer}
              category={project.category}
              status={project.status}
              isVerified={project.isVerified}
              logoUrl={project.logoUrl}
            />
          ))}
        </div>
      </section>

      {/* Recently Added — with logos and better styling */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
              Recently Added
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-medium text-[var(--hw-gold)] border border-[var(--hw-gold)]/20" style={{ borderRadius: 2, background: "rgba(240,180,41,0.08)" }}>
              NEW
            </span>
          </div>
          <Link href="/projects?sort=newest" className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
            View newest &rarr;
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {recentProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group flex flex-col gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
              style={{ borderRadius: "4px" }}
            >
              <div className="flex items-center gap-2.5">
                <ProjectLogo name={p.name} logoUrl={p.logoUrl} size="sm" />
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">{p.name}</span>
                  <span className="block text-[10px] text-[var(--hw-text-dim)]">{p.category}</span>
                </div>
              </div>
              {p.tagline && (
                <p className="text-xs text-[var(--hw-text-dim)] line-clamp-2">{p.tagline}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Learn Hub */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            Learn About Hyperliquid
          </h2>
          <Link href="/learn" className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
            All articles &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEARN_ARTICLES.slice(0, 3).map((article) => (
            <Link key={article.slug} href={`/learn/${article.slug}`}>
              <div className="card-hover group rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]">
                <span className="text-xs text-[var(--hw-green)] font-medium">{article.category}</span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mt-1.5 mb-2 group-hover:text-[var(--hw-green)] transition-colors">{article.title}</h3>
                <p className="text-xs text-[var(--hw-text-dim)] line-clamp-2 mb-3">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--hw-text-dim)]">{article.readingTime} read</span>
                  <span className="text-xs text-[var(--hw-green)] opacity-0 group-hover:opacity-100 transition-opacity">Read more →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Category — with icons and better grid */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            Browse by Category
          </h2>
          <span className="text-xs text-[var(--hw-text-dim)]">{Object.keys(categoryCounts).length} categories</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => {
              const icon = CATEGORY_ICONS[category] || "📦";
              const color = CATEGORY_COLORS[category] || "var(--hw-green)";
              return (
                <Link
                  key={category}
                  href={`/projects?category=${encodeURIComponent(category)}`}
                  className="group flex items-center gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 transition-all hover:border-[var(--hw-border-bright)]"
                  style={{ borderRadius: "4px" }}
                >
                  <span
                    className="cat-icon shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}
                  >
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm text-[var(--hw-text-muted)] group-hover:text-[var(--hw-text)] transition-colors truncate">
                      {category}
                    </span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)]">
                      {count} project{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <svg className="h-3.5 w-3.5 shrink-0 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Social Proof + CTA */}
      <section className="border-t border-[var(--hw-border)] bg-[var(--hw-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <p className="text-sm text-[var(--hw-text-dim)] mb-6">
            Built on the chain processing <span className="text-[var(--hw-text-muted)] font-medium">$40B+ weekly volume</span>
            {" · "}
            <span className="text-[var(--hw-text-muted)] font-medium">{stats.total}+ projects</span> and growing
            {meta?.marketsCount && (
              <>
                {" · "}
                <span className="text-[var(--hw-text-muted)] font-medium">{meta.marketsCount} perpetual markets</span>
              </>
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm transition-all hover:opacity-90"
              style={{ background: "var(--hw-green)", color: "var(--hw-bg)" }}
            >
              Explore All Projects
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-green)] hover:text-[var(--hw-green)] transition-colors"
            >
              Submit Your Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---- Helper Components ---- */

function SearchTriggerBar() {
  return (
    <div
      className="w-full glass border border-[var(--hw-border)] hover:border-[var(--hw-border-bright)] transition-colors cursor-pointer rounded-sm text-left"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[var(--hw-text-dim)]">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="flex-1 text-sm text-[var(--hw-text-dim)]">Search projects, markets, guides...</span>
        <kbd className="hidden text-[10px] text-[var(--hw-text-dim)] border border-[var(--hw-border)] px-1.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] sm:inline-block rounded-sm">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

function MiniStatCard({ label, value, accent, live }: { label: string; value: string; accent?: boolean; live?: boolean }) {
  return (
    <div className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)]">{label}</span>
        {live && (
          <span className="relative flex h-1 w-1" aria-label="Live data">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
            <span className="relative inline-flex h-1 w-1 rounded-full bg-[var(--hw-green)]" />
          </span>
        )}
      </div>
      <div
        className="font-[family-name:var(--font-jetbrains-mono)] text-base font-bold mt-0.5"
        style={{ color: accent ? "var(--hw-green)" : "var(--hw-text)" }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniSparkline({ up }: { up: boolean }) {
  return (
    <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="shrink-0">
      {up ? (
        <polyline
          points="0,12 8,10 16,11 24,7 32,5 40,2"
          stroke="var(--hw-green)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <polyline
          points="0,4 8,6 16,5 24,9 32,11 40,14"
          stroke="var(--hw-red)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
