import { prisma } from "@/lib/prisma";
import { LAYER_META } from "@/lib/categories";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from "@/components/ProjectCard";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getHypePrice, getHlMeta, getTopMarkets, formatUsd } from "@/lib/hl-api";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PerpWiki — Hyperliquid Ecosystem Directory 2026",
  description:
    "Independent directory of 48+ Hyperliquid ecosystem projects. Browse HyperCore, HyperEVM, and HIP-3 apps — trading tools, DeFi, liquid staking, analytics and more. perp.wiki",
  openGraph: {
    title: "PerpWiki — Hyperliquid Ecosystem Directory 2026",
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
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

const TRENDING_TAGS = [
  { label: "HYPE Staking", href: "/learn/hyperliquid-staking-guide" },
  { label: "HLP Vault", href: "/projects/hlp" },
  { label: "HyperEVM", href: "/learn/what-is-hyperevm" },
  { label: "Liquid Staking", href: "/projects?category=Liquid+Staking" },
  { label: "Lending", href: "/projects?category=Lending+%26+Borrowing" },
  { label: "Bridges", href: "/projects?category=Bridges+%26+Cross-Chain" },
  { label: "DEXs", href: "/projects?category=Decentralized+Exchanges" },
  { label: "HIP-3", href: "/layer/hip3" },
];

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
  // Curated featured projects by slug
  const slugs = ["hlp", "purr", "felix-protocol", "kinetiq"];
  const projects = await prisma.project.findMany({
    where: { slug: { in: slugs }, approvalStatus: "APPROVED" },
  });
  // Sort by the order in slugs
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
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { category: true },
  });
  const counts: Record<string, number> = {};
  for (const p of projects) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  return counts;
}

// Known stats for spotlight cards
const SPOTLIGHT_STATS: Record<string, string> = {
  hlp: "15-25% APR",
  purr: "First HIP-1 Token",
  "felix-protocol": "$1B+ TVL",
  kinetiq: "$470M+ Staked",
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
          name: "PerpWiki",
          url: SITE_URL,
          description: "The independent intelligence directory for the Hyperliquid ecosystem.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/projects?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

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
      <section className="relative overflow-hidden border-b border-[var(--hw-border)]">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(0,229,160,0.04) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-8 text-center md:py-12">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[var(--hw-text)] md:text-6xl">
            The Hyperliquid Ecosystem Intelligence Directory
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--hw-text-muted)]">
            Track every project, market, and metric in the Hyperliquid ecosystem.
          </p>

          {/* "Why Hyperliquid" stat block */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
            <HeroStat value="$7.24T" label="Perp market size" />
            <HeroStat value="10.2%" label="DEX market share" color="var(--hw-green)" />
            <HeroStat value={meta?.marketsCount ? String(meta.marketsCount) : "229"} label="Live perp markets" />
            <HeroStat value={`${stats.total}+`} label="Ecosystem projects" color="var(--hw-green)" />
          </div>

          {/* Search */}
          <div className="mt-10">
            <SearchBar />
          </div>

          {/* Quick nav pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Markets", href: "/markets" },
              { label: "Funding Rates", href: "/funding-rates" },
              { label: "Stats", href: "/stats" },
              { label: "HyperCore", href: "/layer/hypercore" },
              { label: "HyperEVM", href: "/layer/hyperevm" },
              { label: "HIP-3", href: "/layer/hip3" },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="px-3 py-1.5 text-xs font-medium border border-[var(--hw-green-subtle)] text-[var(--hw-green)] transition-all hover:bg-[var(--hw-green-subtle)] hover:border-[var(--hw-green)]"
                style={{ borderRadius: "2px" }}
              >
                {pill.label}
              </Link>
            ))}
          </div>

          {/* Trending tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {TRENDING_TAGS.map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="px-2.5 py-1 text-xs border border-[var(--hw-border)] text-[var(--hw-text-dim)] transition-all hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text-muted)]"
                style={{ borderRadius: "2px" }}
              >
                {tag.label}
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/submit"
              className="inline-block border border-[var(--hw-border)] px-4 py-2 text-sm text-[var(--hw-text-dim)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
              style={{ borderRadius: "2px" }}
            >
              Submit a Project
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Spotlight */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            Featured Projects
          </h2>
          <span className="text-xs text-[var(--hw-text-dim)]">Curated by community interest</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spotlight.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`}>
              <div
                className="group flex flex-col gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center gap-3">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-[var(--hw-bg)]"
                      style={{ background: "var(--hw-green)" }}
                    >
                      {p.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
                      {p.name}
                    </h3>
                    {SPOTLIGHT_STATS[p.slug] && (
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-green)]">
                        {SPOTLIGHT_STATS[p.slug]}
                      </span>
                    )}
                  </div>
                </div>
                {p.tagline && (
                  <p className="line-clamp-2 text-xs text-[var(--hw-text-muted)]">{p.tagline}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Markets Mini-Table */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            Live Markets
          </h2>
          <Link href="/markets" className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
            View all markets &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--hw-border)] text-left text-xs text-[var(--hw-text-dim)]">
                <th className="pb-2 pr-4">Market</th>
                <th className="pb-2 pr-4 text-right">Price</th>
                <th className="pb-2 pr-4 text-right">24h Change</th>
                <th className="pb-2 pr-4 text-right hidden sm:table-cell">Funding/hr</th>
                <th className="pb-2 text-right hidden md:table-cell">Open Interest</th>
              </tr>
            </thead>
            <tbody>
              {topMarkets.map((m) => {
                const price = parseFloat(m.markPx);
                const prev = parseFloat(m.prevDayPx);
                const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
                const funding = parseFloat(m.funding) * 100;
                return (
                  <tr key={m.name} className="border-b border-[var(--hw-border)] hover:bg-[var(--hw-surface)]">
                    <td className="py-2.5 pr-4 font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">{m.name}</td>
                    <td className="py-2.5 pr-4 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">${price < 1 ? price.toPrecision(4) : price.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                    <td className={`py-2.5 pr-4 text-right font-[family-name:var(--font-jetbrains-mono)] ${change >= 0 ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</td>
                    <td className={`py-2.5 pr-4 text-right font-[family-name:var(--font-jetbrains-mono)] hidden sm:table-cell ${funding >= 0 ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>{funding >= 0 ? "+" : ""}{funding.toFixed(4)}%</td>
                    <td className="py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)] hidden md:table-cell">{formatUsd(m.openInterest)}</td>
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
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-border-bright)]"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: lm.color }} />
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)]">
                      {section.label}
                    </h3>
                  </div>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm" style={{ color: lm.color }}>
                    {section.count}
                  </span>
                </div>
                <p className="text-xs text-[var(--hw-text-dim)] mb-4">{lm.description}</p>
                <div className="flex flex-col gap-2 mb-4">
                  {section.projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="flex items-center justify-between py-1 text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)] transition-colors"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-[var(--hw-text-dim)]">{p.category}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={section.href}
                  className="text-sm font-medium transition-colors hover:text-[var(--hw-text)]"
                  style={{ color: lm.color }}
                >
                  Explore &rarr;
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

      {/* Recently Added */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Recently Added
        </h2>
        <div className="space-y-2">
          {recentProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 transition-all hover:border-[var(--hw-border-bright)]"
              style={{ borderRadius: "2px" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--hw-text)]">{p.name}</span>
                {p.tagline && (
                  <span className="hidden text-sm text-[var(--hw-text-dim)] sm:inline">{p.tagline}</span>
                )}
              </div>
              <span className="text-xs text-[var(--hw-text-dim)]">{p.category}</span>
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
              <div className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]" style={{ borderRadius: "4px" }}>
                <span className="text-xs text-[var(--hw-green)]">{article.category}</span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mt-1 mb-2">{article.title}</h3>
                <p className="text-xs text-[var(--hw-text-dim)] line-clamp-2">{article.description}</p>
                <span className="text-xs text-[var(--hw-text-dim)] mt-2 block">{article.readingTime} read</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Browse */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Browse by Category
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
              <Link
                key={category}
                href={`/projects?category=${encodeURIComponent(category)}`}
                className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text)]"
                style={{ borderRadius: "2px" }}
              >
                <span>{category}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)]">
                  {count}
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-[var(--hw-border)] bg-[var(--hw-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm text-[var(--hw-text-dim)]">
            Built on the chain processing <span className="text-[var(--hw-text-muted)]">$40B+ weekly volume</span>
            {" · "}
            <span className="text-[var(--hw-text-muted)]">{stats.total}+ projects</span> and growing
            {meta?.marketsCount && (
              <>
                {" · "}
                <span className="text-[var(--hw-text-muted)]">{meta.marketsCount} perpetual markets</span>
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
}

function HeroStat({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div className="text-center">
      <div
        className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold md:text-3xl"
        style={{ color: color || "var(--hw-text)" }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-[var(--hw-text-dim)]">{label}</div>
    </div>
  );
}
