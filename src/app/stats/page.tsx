import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/hl-api";
import { JsonLd } from "@/components/JsonLd";
import { StatsCharts } from "./StatsCharts";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth | perp.wiki",
  description:
    "Hyperliquid ecosystem statistics: $1B+ weekly volume, 200+ perpetual markets, live open interest, funding rate heatmap, and DEX market share. The most comprehensive Hyperliquid analytics dashboard.",
  openGraph: {
    title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth",
    description:
      "Weekly volume trends, top markets by OI, funding heatmaps, and DEX market share for Hyperliquid — the largest on-chain perpetual exchange.",
  },
  keywords: [
    "Hyperliquid stats",
    "Hyperliquid volume",
    "Hyperliquid open interest",
    "Hyperliquid TVL",
    "DEX market share",
    "perp DEX analytics",
    "Hyperliquid ecosystem growth",
    "HLP vault TVL",
    "Hyperliquid markets",
    "on-chain perpetual exchange",
  ],
  alternates: { canonical: "https://perp.wiki/stats" },
};

const HL_API = "https://api.hyperliquid.xyz/info";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

const WEEKLY_VOL_DATA = [
  { week: "Nov 2024", vol: 45 },
  { week: "Dec 2024", vol: 82 },
  { week: "Jan 2025", vol: 156 },
  { week: "Feb 2025", vol: 203 },
  { week: "Mar 2025", vol: 178 },
  { week: "Apr 2025", vol: 245 },
  { week: "May 2025", vol: 312 },
  { week: "Jun 2025", vol: 289 },
  { week: "Jul 2025", vol: 398 },
  { week: "Aug 2025", vol: 445 },
  { week: "Sep 2025", vol: 521 },
  { week: "Oct 2025", vol: 612 },
  { week: "Nov 2025", vol: 734 },
  { week: "Dec 2025", vol: 856 },
  { week: "Jan 2026", vol: 923 },
  { week: "Feb 2026", vol: 1042 },
  { week: "Mar 2026", vol: 1180 },
];

interface AssetCtx {
  funding: string;
  openInterest: string;
  dayNtlVlm: string;
  markPx: string;
  prevDayPx: string;
}

async function fetchLiveData() {
  try {
    const res = await fetch(HL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const [metaObj, assetCtxs] = data as [
      { universe: { name: string }[] },
      AssetCtx[],
    ];

    let totalOi = 0;
    let totalVol = 0;

    const markets = metaObj.universe.map((coin, i) => {
      const ctx = assetCtxs[i];
      const oi = parseFloat(ctx.openInterest || "0");
      const vol = parseFloat(ctx.dayNtlVlm || "0");
      totalOi += oi;
      totalVol += vol;
      return {
        name: coin.name,
        oi,
        vol,
        funding: parseFloat(ctx.funding || "0"),
      };
    });

    const topByOi = [...markets]
      .sort((a, b) => b.oi - a.oi)
      .slice(0, 10)
      .map((m) => ({ name: m.name, oi: m.oi }));

    const fundingData = [...markets]
      .sort((a, b) => b.oi - a.oi)
      .slice(0, 40)
      .map((m) => ({ name: m.name, rate: m.funding }));

    const positiveFunding = markets.filter((m) => m.funding > 0).length;

    return {
      totalOi,
      totalVol,
      marketsCount: metaObj.universe.length,
      topByOi,
      fundingData,
      positiveFunding,
    };
  } catch {
    return null;
  }
}

async function fetchCommunityStats() {
  const [totalReviews, avgRatingResult, mostReviewed, totalSuggestions] =
    await Promise.all([
      prisma.review.count({ where: { isPublished: true } }),
      prisma.review.aggregate({
        where: { isPublished: true },
        _avg: { rating: true },
      }),
      prisma.review.groupBy({
        by: ["projectId"],
        where: { isPublished: true },
        _count: { id: true },
        _avg: { rating: true },
        orderBy: { _count: { id: "desc" } },
        take: 3,
      }),
      prisma.suggestion.count(),
    ]);

  // Fetch project names for most-reviewed
  const projectIds = mostReviewed.map((r) => r.projectId);
  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, name: true, slug: true },
  });
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  return {
    totalReviews,
    avgRating: avgRatingResult._avg.rating ?? 0,
    mostReviewed: mostReviewed.map((r) => ({
      project: projectMap.get(r.projectId),
      count: r._count.id,
      avgRating: r._avg.rating ?? 0,
    })),
    totalSuggestions,
  };
}

export default async function StatsPage() {
  const [liveData, projectCount, communityStats] = await Promise.all([
    fetchLiveData(),
    prisma.project.count({ where: { approvalStatus: "APPROVED" } }),
    fetchCommunityStats(),
  ]);

  const statCards = [
    {
      label: "24h Volume",
      value: liveData ? formatUsd(liveData.totalVol) : "N/A",
      live: !!liveData,
      href: "/markets",
    },
    {
      label: "Open Interest",
      value: liveData ? formatUsd(liveData.totalOi) : "N/A",
      live: !!liveData,
      href: "/markets",
    },
    {
      label: "Active Markets",
      value: liveData ? String(liveData.marketsCount) : "N/A",
      live: !!liveData,
      href: "/markets",
    },
    { label: "DEX Market Share", value: "26%", live: false, href: null },
    { label: "HLP TVL", value: "$480M+", live: false, href: "/projects/hlp" },
    {
      label: "Ecosystem Projects",
      value: String(projectCount),
      live: false,
      href: "/projects",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Hyperliquid Ecosystem Statistics",
          description:
            "Volume growth, open interest, funding rates, and DEX market share data for the Hyperliquid ecosystem.",
          url: `${SITE_URL}/stats`,
          creator: { "@type": "Organization", name: "perp.wiki" },
          variableMeasured: [
            { "@type": "PropertyValue", name: "24h Trading Volume", unitText: "USD" },
            { "@type": "PropertyValue", name: "Open Interest", unitText: "USD" },
            { "@type": "PropertyValue", name: "Active Markets", unitText: "count" },
          ],
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
            Hyperliquid Ecosystem Statistics
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--hw-text-muted)]">
            Track Hyperliquid&apos;s growth from volume trends and open interest to funding rates and
            DEX market share. Live data combined with historical metrics.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[var(--hw-green)]" style={{ borderRadius: 2, background: "var(--hw-green-subtle)" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--hw-green)] animate-pulse" />
              Live data
            </span>
            <span className="px-2.5 py-1 text-xs text-[var(--hw-text-dim)]" style={{ borderRadius: 2, background: "var(--hw-surface)" }}>
              Updated on every page load
            </span>
          </div>
        </div>

        {/* Stat Cards — clickable deeplinks */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map((card) => {
            const inner = (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[var(--hw-text-dim)]">{card.label}</span>
                  {card.live && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--hw-green)]" />
                    </span>
                  )}
                </div>
                <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-text)]">
                  {card.value}
                </div>
                {card.href && (
                  <div className="mt-1 text-[10px] text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors">
                    View details →
                  </div>
                )}
              </>
            );

            if (card.href) {
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
                  style={{ borderRadius: 4 }}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={card.label}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
                style={{ borderRadius: 4 }}
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* ===== COMMUNITY STATS ===== */}
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
            <span className="inline-block h-1 w-5" style={{ background: "var(--hw-gold)", borderRadius: 1 }} />
            Community
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: 4 }}
            >
              <div className="text-xs text-[var(--hw-text-dim)]">Total Reviews</div>
              <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-text)]">
                {communityStats.totalReviews}
              </div>
            </div>
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: 4 }}
            >
              <div className="text-xs text-[var(--hw-text-dim)]">Avg Rating</div>
              <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-text)]">
                {communityStats.totalReviews > 0
                  ? communityStats.avgRating.toFixed(1)
                  : "N/A"}
                {communityStats.totalReviews > 0 && (
                  <span className="ml-1 text-sm" style={{ color: "var(--hw-gold)" }}>★</span>
                )}
              </div>
            </div>
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: 4 }}
            >
              <div className="text-xs text-[var(--hw-text-dim)]">Suggestions</div>
              <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-text)]">
                {communityStats.totalSuggestions}
              </div>
            </div>
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: 4 }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-2">Most Reviewed</div>
              {communityStats.mostReviewed.length > 0 ? (
                <div className="space-y-1.5">
                  {communityStats.mostReviewed.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      {item.project ? (
                        <Link
                          href={`/projects/${item.project.slug}`}
                          className="text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors truncate mr-2"
                        >
                          {item.project.name}
                        </Link>
                      ) : (
                        <span className="text-xs text-[var(--hw-text-dim)]">Unknown</span>
                      )}
                      <span className="text-xs text-[var(--hw-text-dim)] shrink-0">
                        {item.count} review{item.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--hw-text-dim)]">No reviews yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Charts */}
        <StatsCharts
          weeklyVol={WEEKLY_VOL_DATA}
          topByOi={liveData?.topByOi ?? []}
          fundingData={liveData?.fundingData ?? []}
        />

        {/* ===== SEO CONTENT ===== */}
        <div className="mt-12 space-y-10">
          {/* Why These Numbers Matter */}
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-green)]" style={{ borderRadius: 1 }} />
              Understanding Hyperliquid&apos;s Growth
            </h2>
            <div className="space-y-3 text-sm text-[var(--hw-text-muted)] leading-relaxed">
              <p>
                Hyperliquid has rapidly grown from a niche perpetual DEX to the <strong className="text-[var(--hw-text)]">largest
                on-chain perpetual futures exchange</strong> by volume. The weekly volume chart above shows
                the trajectory — from $45B in November 2024 to over $1T weekly by early 2026. This growth
                was driven by sub-second finality, zero gas fees for trading, and the deepest on-chain
                liquidity available.
              </p>
              <p>
                <strong className="text-[var(--hw-text)]">Open interest</strong> (OI) measures the total
                value of outstanding perpetual contracts. High OI indicates strong market participation and
                deep liquidity. Hyperliquid consistently maintains billions in OI across {liveData?.marketsCount ?? "200+"}
                markets, with BTC and ETH accounting for the largest share.
              </p>
              <p>
                The <strong className="text-[var(--hw-text)]">funding rate heatmap</strong> provides a
                snapshot of market sentiment across all traded pairs. Predominantly green (positive) funding
                suggests bullish positioning, while red (negative) suggests bearish sentiment. These rates
                reset hourly on Hyperliquid, creating opportunities for{" "}
                <Link href="/funding-rates" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
                  funding rate arbitrage strategies
                </Link>.
              </p>
            </div>
          </div>

          {/* Key Metrics Explained */}
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-cyan)]" style={{ borderRadius: 1 }} />
              Key Metrics Explained
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Trading Volume"
                description="The total notional value of all trades executed over a given period. Higher volume indicates more active trading and better price discovery. Hyperliquid processes billions in daily volume with near-zero slippage on major pairs."
                href="/markets"
                cta="View live markets"
              />
              <MetricCard
                title="Open Interest"
                description="The total value of all outstanding perpetual contracts. Rising OI with rising prices confirms bullish conviction; rising OI with falling prices suggests short-side aggression. Declining OI signals position unwinding."
                href="/markets"
                cta="View OI by market"
              />
              <MetricCard
                title="Funding Rates"
                description="Hourly payments between longs and shorts that keep perp prices aligned to spot. Positive rates mean longs pay shorts (bullish sentiment). Extreme rates signal crowded trades and potential reversal opportunities."
                href="/funding-rates"
                cta="Live funding dashboard"
              />
              <MetricCard
                title="DEX Market Share"
                description="Hyperliquid's share of total on-chain perpetual futures volume. At ~26%, Hyperliquid is the single largest perp DEX, ahead of dYdX, GMX, Drift, and others. The gap continues to widen due to superior UX and liquidity."
                href={null}
                cta={null}
              />
              <MetricCard
                title="HLP Vault TVL"
                description="Total value locked in the Hyperliquidity Provider vault — the protocol's market-making engine. HLP depositors earn yield from spreads, taker fees, and funding capture across all markets."
                href="/projects/hlp"
                cta="View HLP profile"
              />
              <MetricCard
                title="Ecosystem Projects"
                description="The number of protocols, tools, and applications building on or integrating with Hyperliquid across HyperCore, HyperEVM, and HIP-3 layers. A growing ecosystem indicates network effects and long-term viability."
                href="/projects"
                cta="Browse all projects"
              />
            </div>
          </div>

          {/* Explore Deeper CTA Grid */}
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-gold)]" style={{ borderRadius: 1 }} />
              Explore the Ecosystem
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DeepLink
                href="/markets"
                title="Markets"
                description="Live prices, volume, and OI for every Hyperliquid perpetual market"
                accent="var(--hw-green)"
              />
              <DeepLink
                href="/funding-rates"
                title="Funding Rates"
                description="Interactive heatmap, filters, and APR rankings for arbitrage opportunities"
                accent="var(--hw-cyan)"
              />
              <DeepLink
                href="/projects"
                title="Projects"
                description="Browse 40+ protocols across trading, DeFi, bridges, NFTs, and more"
                accent="var(--hw-gold)"
              />
              <DeepLink
                href="/learn/what-is-hyperliquid"
                title="Learn"
                description="Deep-dive guides on Hyperliquid architecture, HIP-1, HIP-3, and HyperEVM"
                accent="var(--hw-tier-hip3)"
              />
            </div>
          </div>

          {/* Hyperliquid by the Numbers */}
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5" style={{ background: "var(--hw-tier-hip3)", borderRadius: 1 }} />
              Hyperliquid by the Numbers
            </h2>
            <div className="space-y-3 text-sm text-[var(--hw-text-muted)] leading-relaxed">
              <p>
                Hyperliquid launched in late 2023 and has since become the dominant force in on-chain
                perpetual trading. The L1 processes up to <strong className="text-[var(--hw-text)]">200,000
                orders per second</strong> with sub-second finality, making it faster than most centralized
                exchanges while remaining fully decentralized and self-custodial.
              </p>
              <p>
                The ecosystem spans three layers: <strong className="text-[var(--hw-text)]">HyperCore</strong> for
                native perpetual trading, <strong className="text-[var(--hw-text)]">HyperEVM</strong> for
                composable DeFi (lending, DEXs, liquid staking), and <strong className="text-[var(--hw-text)]">HIP-3</strong> for
                permissionless custom perpetual markets including tokenized stocks and prediction markets.
                Together, these layers have attracted over $2B in TVL across {projectCount}+ ecosystem
                projects.
              </p>
              <p>
                The HYPE token, launched via a community airdrop with no VC allocation, serves as the
                native gas and staking token. Validators secure the network through proof-of-stake
                consensus, with liquid staking protocols like{" "}
                <Link href="/projects/kinetiq" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">Kinetiq</Link>{" "}
                and{" "}
                <Link href="/projects/stakedhype" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">StakedHYPE</Link>{" "}
                enabling composable staked HYPE across DeFi.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="border border-[var(--hw-border)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderRadius: 4, background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)" }}
          >
            <div>
              <p className="text-sm font-medium text-[var(--hw-text)]">
                Start trading on the fastest perp DEX
              </p>
              <p className="text-xs text-[var(--hw-text-dim)] mt-0.5">
                {liveData?.marketsCount ?? "200+"}  markets, zero gas, sub-second fills
              </p>
            </div>
            <a
              href="https://app.hyperliquid.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 shrink-0"
              style={{ borderRadius: 4, background: "var(--hw-green)", color: "var(--hw-bg)" }}
            >
              Launch Hyperliquid
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function MetricCard({ title, description, href, cta }: { title: string; description: string; href: string | null; cta: string | null }) {
  return (
    <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
      <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
        {title}
      </h3>
      <p className="text-xs text-[var(--hw-text-muted)] leading-relaxed mb-3">
        {description}
      </p>
      {href && cta && (
        <Link
          href={href}
          className="text-xs text-[var(--hw-green)] hover:text-[var(--hw-green-dim)] transition-colors"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

function DeepLink({ href, title, description, accent }: { href: string; title: string; description: string; accent: string }) {
  return (
    <Link
      href={href}
      className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
      style={{ borderRadius: 4 }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-block h-1 w-3" style={{ background: accent, borderRadius: 1 }} />
        <span className="text-sm font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
          {title}
        </span>
        <svg className="h-3.5 w-3.5 ml-auto text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      <p className="text-[11px] text-[var(--hw-text-dim)] leading-snug">{description}</p>
    </Link>
  );
}
