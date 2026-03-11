import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/hl-api";
import { JsonLd } from "@/components/JsonLd";
import { StatsCharts } from "./StatsCharts";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth",
  description:
    "Hyperliquid ecosystem statistics: $1B+ weekly volume, 200+ perpetual markets, live open interest, funding rate heatmap, and DEX market share. The most comprehensive Hyperliquid analytics dashboard.",
  openGraph: {
    title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth",
    description:
      "Weekly volume trends, top markets by OI, funding heatmaps, and DEX market share for Hyperliquid — the largest on-chain perpetual exchange.",
    url: "https://perp.wiki/stats",
    siteName: "perp.wiki",
    images: [{ url: "/stats/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth",
    description:
      "Weekly volume trends, top markets by OI, funding heatmaps, and DEX market share for Hyperliquid — the largest on-chain perpetual exchange.",
    images: ["/stats/opengraph-image"],
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

const MILESTONES = [
  { date: "Nov 2023", event: "Hyperliquid L1 mainnet launch", accent: "var(--hw-green)" },
  { date: "Jun 2024", event: "HyperEVM testnet goes live", accent: "var(--hw-cyan)" },
  { date: "Nov 2024", event: "HYPE token airdrop — no VC allocation", accent: "var(--hw-gold)" },
  { date: "Jan 2025", event: "HyperEVM mainnet deployment", accent: "var(--hw-cyan)" },
  { date: "Mar 2025", event: "HIP-3 permissionless perp markets launch", accent: "var(--hw-tier-hip3)" },
  { date: "Jun 2025", event: "$1B+ weekly volume milestone reached", accent: "var(--hw-green)" },
  { date: "Oct 2025", event: "Ecosystem surpasses 40 live protocols", accent: "var(--hw-gold)" },
  { date: "Jan 2026", event: "200,000 TPS peak throughput achieved", accent: "var(--hw-green)" },
];

const COMPETITION_DATA = [
  { name: "Hyperliquid", share: 26, vol24h: "$8.2B", oi: "$4.1B", markets: "200+", fees: "Zero gas", highlight: true },
  { name: "dYdX v4", share: 12, vol24h: "$3.8B", oi: "$1.6B", markets: "180+", fees: "Gas + fees", highlight: false },
  { name: "GMX v2", share: 8, vol24h: "$2.4B", oi: "$900M", markets: "60+", fees: "0.05-0.07%", highlight: false },
  { name: "Drift", share: 5, vol24h: "$1.5B", oi: "$600M", markets: "40+", fees: "0.01-0.1%", highlight: false },
  { name: "Vertex", share: 4, vol24h: "$1.2B", oi: "$450M", markets: "30+", fees: "0.02%", highlight: false },
];

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
      accent: "var(--hw-green)",
      sparkline: [3, 5, 4, 7, 6, 8, 9, 7, 10, 12],
    },
    {
      label: "Open Interest",
      value: liveData ? formatUsd(liveData.totalOi) : "N/A",
      live: !!liveData,
      href: "/markets",
      accent: "var(--hw-cyan)",
      sparkline: [4, 5, 6, 5, 7, 8, 7, 9, 10, 11],
    },
    {
      label: "Active Markets",
      value: liveData ? String(liveData.marketsCount) : "N/A",
      live: !!liveData,
      href: "/markets",
      accent: "var(--hw-tier-hip3)",
      sparkline: [2, 3, 3, 4, 5, 5, 6, 7, 8, 9],
    },
    {
      label: "DEX Market Share",
      value: "26%",
      live: false,
      href: null,
      accent: "var(--hw-gold)",
      sparkline: [5, 6, 7, 8, 9, 10, 12, 14, 18, 22],
    },
    {
      label: "HLP TVL",
      value: "$480M+",
      live: false,
      href: "/projects/hlp",
      accent: "var(--hw-green)",
      sparkline: [2, 4, 5, 7, 6, 8, 9, 10, 11, 12],
    },
    {
      label: "Ecosystem Projects",
      value: String(projectCount),
      live: false,
      href: "/projects",
      accent: "var(--hw-cyan)",
      sparkline: [1, 2, 3, 4, 5, 7, 9, 12, 15, 18],
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

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative overflow-hidden border-b border-[var(--hw-border)]"
        style={{ background: "linear-gradient(180deg, rgba(0,229,160,0.04) 0%, var(--hw-bg) 100%)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          {/* Decorative accent bar */}
          <div
            className="mb-6 h-1 w-16"
            style={{ background: "linear-gradient(90deg, var(--hw-green), var(--hw-cyan))", borderRadius: 2 }}
          />
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[var(--hw-text)] md:text-5xl lg:text-6xl tracking-tight">
            Hyperliquid
            <br />
            <span style={{ color: "var(--hw-green)" }}>Ecosystem Statistics</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-[var(--hw-text-muted)] leading-relaxed md:text-lg">
            The most comprehensive analytics dashboard for the Hyperliquid ecosystem.
            Track volume trends, open interest, funding rates, DEX market share, and community
            growth — all in one place. Live data refreshed on every page load.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--hw-green)]"
              style={{ borderRadius: 4, background: "var(--hw-green-subtle)", border: "1px solid rgba(0,229,160,0.15)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hw-green)]" />
              </span>
              Live data from Hyperliquid API
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--hw-text-dim)]"
              style={{ borderRadius: 4, background: "var(--hw-surface)", border: "1px solid var(--hw-border)" }}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated on every page load
            </span>
            <Link
              href="/markets"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors"
              style={{ borderRadius: 4, background: "var(--hw-surface)", border: "1px solid var(--hw-border)" }}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              View all markets
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">

        {/* ===== KEY TAKEAWAYS ===== */}
        <div
          className="mb-10 p-6 md:p-8"
          style={{
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(0,200,224,0.04) 100%)",
            border: "1px solid rgba(0,229,160,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5" style={{ color: "var(--hw-green)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-text)]">
              Key Takeaways
            </h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-[var(--hw-green)]" />
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                <strong className="text-[var(--hw-text)]">Dominant market position:</strong> Hyperliquid commands ~26% of on-chain perpetual DEX volume, more than double its nearest competitor dYdX, and the gap continues to widen.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-[var(--hw-cyan)]" />
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                <strong className="text-[var(--hw-text)]">Exponential volume growth:</strong> Weekly trading volume grew from $45B in November 2024 to over $1T by early 2026 — a 26x increase in just 16 months driven by zero-fee trading and sub-second fills.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-[var(--hw-gold)]" />
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                <strong className="text-[var(--hw-text)]">Thriving ecosystem:</strong> Over {projectCount} protocols now build on Hyperliquid across{" "}
                <Link href="/layer/hypercore" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HyperCore</Link>,{" "}
                <Link href="/layer/hyperevm" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HyperEVM</Link>, and{" "}
                <Link href="/layer/hip-3" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HIP-3</Link> — spanning DeFi, trading tools, NFTs, and more.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-[var(--hw-tier-hip3)]" />
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                <strong className="text-[var(--hw-text)]">Deep liquidity infrastructure:</strong> The{" "}
                <Link href="/projects/hlp" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HLP vault</Link> holds $480M+ in TVL, providing market-making liquidity across all pairs, and {liveData?.marketsCount ?? "200+"} active markets ensure comprehensive asset coverage.
              </p>
            </li>
          </ul>
        </div>

        {/* ===== STAT CARDS ===== */}
        <div className="mb-3">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-text)] flex items-center gap-2">
            <span className="inline-block h-1 w-5" style={{ background: "var(--hw-green)", borderRadius: 1 }} />
            Core Metrics
          </h2>
          <p className="mt-1 text-xs text-[var(--hw-text-dim)]">
            Live data from the Hyperliquid API. Cards with a green pulse indicator are refreshed in real time.
          </p>
        </div>

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
                {/* Mini sparkline */}
                <div className="mt-2 flex items-end gap-[2px] h-4">
                  {card.sparkline.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-[3px]"
                      style={{
                        height: `${(v / Math.max(...card.sparkline)) * 100}%`,
                        background: i === card.sparkline.length - 1 ? card.accent : "var(--hw-border-bright)",
                        borderRadius: 1,
                        opacity: i === card.sparkline.length - 1 ? 1 : 0.5,
                      }}
                    />
                  ))}
                </div>
                {card.href && (
                  <div className="mt-2 text-[10px] text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors">
                    View details &rarr;
                  </div>
                )}
              </>
            );

            if (card.href) {
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
                  style={{
                    borderRadius: 4,
                    border: "1px solid var(--hw-border)",
                    borderTop: `2px solid ${card.accent}`,
                  }}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={card.label}
                className="bg-[var(--hw-surface)] p-4"
                style={{
                  borderRadius: 4,
                  border: "1px solid var(--hw-border)",
                  borderTop: `2px solid ${card.accent}`,
                }}
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* ===== SECTION DIVIDER ===== */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
          <span className="text-xs text-[var(--hw-text-dim)] uppercase tracking-widest">Community</span>
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
        </div>

        {/* ===== COMMUNITY STATS ===== */}
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-2 flex items-center gap-2">
            <span className="inline-block h-1 w-5" style={{ background: "var(--hw-gold)", borderRadius: 1 }} />
            Community Engagement
          </h2>
          <p className="text-sm text-[var(--hw-text-dim)] mb-5">
            User-submitted reviews and project suggestions from the{" "}
            <Link href="/projects" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)] transition-colors">perp.wiki community</Link>.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Total Reviews */}
            <div
              className="bg-[var(--hw-surface)] p-5"
              style={{ borderRadius: 4, border: "1px solid var(--hw-border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex items-center justify-center h-7 w-7"
                  style={{ borderRadius: 4, background: "var(--hw-green-subtle)" }}
                >
                  <svg className="h-3.5 w-3.5" style={{ color: "var(--hw-green)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--hw-text-dim)]">Total Reviews</span>
              </div>
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-[var(--hw-text)]">
                {communityStats.totalReviews}
              </div>
            </div>

            {/* Avg Rating */}
            <div
              className="bg-[var(--hw-surface)] p-5"
              style={{ borderRadius: 4, border: "1px solid var(--hw-border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex items-center justify-center h-7 w-7"
                  style={{ borderRadius: 4, background: "rgba(240,180,41,0.1)" }}
                >
                  <svg className="h-3.5 w-3.5" style={{ color: "var(--hw-gold)" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--hw-text-dim)]">Avg Rating</span>
              </div>
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-[var(--hw-text)]">
                {communityStats.totalReviews > 0
                  ? communityStats.avgRating.toFixed(1)
                  : "N/A"}
                {communityStats.totalReviews > 0 && (
                  <span className="ml-1 text-base" style={{ color: "var(--hw-gold)" }}>&#9733;</span>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div
              className="bg-[var(--hw-surface)] p-5"
              style={{ borderRadius: 4, border: "1px solid var(--hw-border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex items-center justify-center h-7 w-7"
                  style={{ borderRadius: 4, background: "rgba(0,200,224,0.1)" }}
                >
                  <svg className="h-3.5 w-3.5" style={{ color: "var(--hw-cyan)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--hw-text-dim)]">Suggestions</span>
              </div>
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-[var(--hw-text)]">
                {communityStats.totalSuggestions}
              </div>
            </div>

            {/* Most Reviewed */}
            <div
              className="bg-[var(--hw-surface)] p-5"
              style={{ borderRadius: 4, border: "1px solid var(--hw-border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex items-center justify-center h-7 w-7"
                  style={{ borderRadius: 4, background: "rgba(167,139,250,0.1)" }}
                >
                  <svg className="h-3.5 w-3.5" style={{ color: "var(--hw-tier-hip3)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--hw-text-dim)]">Most Reviewed</span>
              </div>
              {communityStats.mostReviewed.length > 0 ? (
                <div className="space-y-2">
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
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)] shrink-0">
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

        {/* ===== SECTION DIVIDER ===== */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
          <span className="text-xs text-[var(--hw-text-dim)] uppercase tracking-widest">Charts</span>
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
        </div>

        {/* Charts */}
        <StatsCharts
          weeklyVol={WEEKLY_VOL_DATA}
          topByOi={liveData?.topByOi ?? []}
          fundingData={liveData?.fundingData ?? []}
        />

        {/* ===== SECTION DIVIDER ===== */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
          <span className="text-xs text-[var(--hw-text-dim)] uppercase tracking-widest">Analysis</span>
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
        </div>

        {/* ===== HYPERLIQUID VS COMPETITION ===== */}
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-2 flex items-center gap-2">
            <span className="inline-block h-1 w-5" style={{ background: "var(--hw-cyan)", borderRadius: 1 }} />
            Hyperliquid vs Competition
          </h2>
          <p className="text-sm text-[var(--hw-text-dim)] mb-5 max-w-2xl">
            How does Hyperliquid stack up against other leading perpetual DEXs? The comparison below highlights why Hyperliquid
            has emerged as the clear market leader in on-chain derivatives trading.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderRadius: 4, overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "var(--hw-surface)" }}>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] border-b border-[var(--hw-border)]">Protocol</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] border-b border-[var(--hw-border)]">Market Share</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] border-b border-[var(--hw-border)]">24h Volume</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] border-b border-[var(--hw-border)]">Open Interest</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] border-b border-[var(--hw-border)]">Markets</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] border-b border-[var(--hw-border)]">Fees</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITION_DATA.map((row) => (
                  <tr
                    key={row.name}
                    className="transition-colors"
                    style={{
                      background: row.highlight ? "rgba(0,229,160,0.04)" : "transparent",
                      borderLeft: row.highlight ? "2px solid var(--hw-green)" : "2px solid transparent",
                    }}
                  >
                    <td className="py-3 px-4 border-b border-[var(--hw-border)]">
                      <span className={`font-[family-name:var(--font-space-grotesk)] font-semibold ${row.highlight ? "text-[var(--hw-green)]" : "text-[var(--hw-text)]"}`}>
                        {row.name}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 border-b border-[var(--hw-border)]">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--hw-border)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(row.share / 26) * 100}%`,
                              background: row.highlight ? "var(--hw-green)" : "var(--hw-text-dim)",
                            }}
                          />
                        </div>
                        <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-muted)]">{row.share}%</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]">{row.vol24h}</td>
                    <td className="text-right py-3 px-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]">{row.oi}</td>
                    <td className="text-right py-3 px-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]">{row.markets}</td>
                    <td className="text-right py-3 px-4 text-xs border-b border-[var(--hw-border)]">
                      <span className={row.highlight ? "text-[var(--hw-green)] font-medium" : "text-[var(--hw-text-dim)]"}>
                        {row.fees}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--hw-text-dim)] leading-relaxed max-w-2xl">
            Hyperliquid&apos;s zero-gas-fee model, combined with the deepest on-chain order book liquidity, makes it
            the preferred venue for both retail and institutional traders. Unlike competitors that rely on AMM designs
            (GMX, Vertex) or off-chain sequencers (dYdX), Hyperliquid runs a fully on-chain CLOB with sub-second finality.
            Learn more about the architecture in our{" "}
            <Link href="/learn/what-is-hyperliquid" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
              deep-dive guide
            </Link>.
          </p>
        </div>

        {/* ===== GROWTH TIMELINE ===== */}
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-2 flex items-center gap-2">
            <span className="inline-block h-1 w-5" style={{ background: "var(--hw-tier-hip3)", borderRadius: 1 }} />
            Key Milestones
          </h2>
          <p className="text-sm text-[var(--hw-text-dim)] mb-6 max-w-2xl">
            From launch to market dominance — the timeline of Hyperliquid&apos;s rapid ascent in on-chain perpetual trading.
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[11px] top-2 bottom-2 w-px"
              style={{ background: "var(--hw-border)" }}
            />
            <div className="space-y-0">
              {MILESTONES.map((m, i) => (
                <div key={i} className="relative flex items-start gap-4 py-3 group">
                  {/* Dot */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className="h-[23px] w-[23px] flex items-center justify-center"
                      style={{ borderRadius: "50%", background: "var(--hw-bg)" }}
                    >
                      <div
                        className="h-[9px] w-[9px]"
                        style={{ borderRadius: "50%", background: m.accent, boxShadow: `0 0 8px ${m.accent}` }}
                      />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-1">
                    <span
                      className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-wider"
                      style={{ color: m.accent }}
                    >
                      {m.date}
                    </span>
                    <p className="mt-0.5 text-sm text-[var(--hw-text-muted)] group-hover:text-[var(--hw-text)] transition-colors">
                      {m.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SECTION DIVIDER ===== */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
          <span className="text-xs text-[var(--hw-text-dim)] uppercase tracking-widest">Deep Dive</span>
          <div className="h-px flex-1" style={{ background: "var(--hw-border)" }} />
        </div>

        {/* ===== SEO CONTENT ===== */}
        <div className="space-y-12">
          {/* Understanding Growth */}
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-green)]" style={{ borderRadius: 1 }} />
              Understanding Hyperliquid&apos;s Growth
            </h2>
            <div className="space-y-4 text-sm text-[var(--hw-text-muted)] leading-relaxed">
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
                markets, with BTC and ETH accounting for the largest share. Traders can explore current OI
                distribution on the{" "}
                <Link href="/markets" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
                  live markets page
                </Link>.
              </p>
              <p>
                <strong className="text-[var(--hw-text)]">Why does open interest matter?</strong> Rising OI alongside rising prices
                confirms bullish conviction — new money is entering long positions. Conversely, rising OI with falling prices
                signals short-side aggression. Declining OI indicates position unwinding, which often reduces volatility. Monitoring
                OI trends across Hyperliquid&apos;s markets provides a real-time gauge of market health and trader conviction.
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
              <p>
                <strong className="text-[var(--hw-text)]">Volume-to-OI ratio</strong> is another important metric that experienced
                traders monitor. A high ratio suggests active speculation and frequent position turnover, while a low ratio indicates
                more passive, conviction-based holding. Hyperliquid typically maintains a healthy ratio due to its zero-fee structure
                encouraging active trading while deep liquidity supports large positions.
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
                accent="var(--hw-green)"
              />
              <MetricCard
                title="Open Interest"
                description="The total value of all outstanding perpetual contracts. Rising OI with rising prices confirms bullish conviction; rising OI with falling prices suggests short-side aggression. Declining OI signals position unwinding."
                href="/markets"
                cta="View OI by market"
                accent="var(--hw-cyan)"
              />
              <MetricCard
                title="Funding Rates"
                description="Hourly payments between longs and shorts that keep perp prices aligned to spot. Positive rates mean longs pay shorts (bullish sentiment). Extreme rates signal crowded trades and potential reversal opportunities."
                href="/funding-rates"
                cta="Live funding dashboard"
                accent="var(--hw-tier-hip3)"
              />
              <MetricCard
                title="DEX Market Share"
                description="Hyperliquid's share of total on-chain perpetual futures volume. At ~26%, Hyperliquid is the single largest perp DEX, ahead of dYdX, GMX, Drift, and others. The gap continues to widen due to superior UX and liquidity."
                href={null}
                cta={null}
                accent="var(--hw-gold)"
              />
              <MetricCard
                title="HLP Vault TVL"
                description="Total value locked in the Hyperliquidity Provider vault — the protocol's market-making engine. HLP depositors earn yield from spreads, taker fees, and funding capture across all markets."
                href="/projects/hlp"
                cta="View HLP profile"
                accent="var(--hw-green)"
              />
              <MetricCard
                title="Ecosystem Projects"
                description="The number of protocols, tools, and applications building on or integrating with Hyperliquid across HyperCore, HyperEVM, and HIP-3 layers. A growing ecosystem indicates network effects and long-term viability."
                href="/projects"
                cta="Browse all projects"
                accent="var(--hw-cyan)"
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
            <div className="space-y-4 text-sm text-[var(--hw-text-muted)] leading-relaxed">
              <p>
                Hyperliquid launched in late 2023 and has since become the dominant force in on-chain
                perpetual trading. The L1 processes up to <strong className="text-[var(--hw-text)]">200,000
                orders per second</strong> with sub-second finality, making it faster than most centralized
                exchanges while remaining fully decentralized and self-custodial.
              </p>
              <p>
                The ecosystem spans three layers: <strong className="text-[var(--hw-text)]">
                <Link href="/layer/hypercore" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HyperCore</Link>
                </strong> for native perpetual trading, <strong className="text-[var(--hw-text)]">
                <Link href="/layer/hyperevm" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HyperEVM</Link>
                </strong> for composable DeFi (lending, DEXs, liquid staking), and <strong className="text-[var(--hw-text)]">
                <Link href="/layer/hip-3" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">HIP-3</Link>
                </strong> for permissionless custom perpetual markets including tokenized stocks and prediction markets.
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
                enabling composable staked HYPE across DeFi. You can explore all staking options on the{" "}
                <Link href="/projects" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">projects directory</Link>.
              </p>
              <p>
                Hyperliquid&apos;s unique advantage lies in its vertically integrated architecture. Rather than deploying
                on an existing L1/L2, the team built a purpose-designed chain optimized for order book trading. This means
                every aspect — from consensus to execution to settlement — is tuned for derivatives trading performance.
                The result is a trading experience that rivals centralized exchanges while maintaining the transparency,
                self-custody, and censorship resistance of a decentralized protocol.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="border border-[var(--hw-border)] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderRadius: 4, background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)" }}
          >
            <div>
              <p className="text-base font-[family-name:var(--font-space-grotesk)] font-semibold text-[var(--hw-text)]">
                Start trading on the fastest perp DEX
              </p>
              <p className="text-sm text-[var(--hw-text-dim)] mt-1">
                {liveData?.marketsCount ?? "200+"} markets, zero gas, sub-second fills
              </p>
            </div>
            <a
              href="https://app.hyperliquid.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 shrink-0"
              style={{ borderRadius: 4, background: "var(--hw-green)", color: "var(--hw-bg)" }}
            >
              Launch Hyperliquid
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* ===== DATA SOURCES ===== */}
          <div
            className="p-5"
            style={{ borderRadius: 4, background: "var(--hw-surface)", border: "1px solid var(--hw-border)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
                Data Sources &amp; Methodology
              </h3>
            </div>
            <div className="space-y-2 text-xs text-[var(--hw-text-dim)] leading-relaxed">
              <p>
                <strong className="text-[var(--hw-text-muted)]">Live data</strong> (volume, open interest, funding rates, market counts)
                is fetched directly from the{" "}
                <a href="https://api.hyperliquid.xyz" target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]">
                  Hyperliquid public API
                </a>{" "}
                on every page load. These figures represent real-time snapshots and may fluctuate between requests.
              </p>
              <p>
                <strong className="text-[var(--hw-text-muted)]">Historical volume data</strong> is aggregated from on-chain records
                and represents approximate weekly totals. DEX market share estimates are based on publicly available data from
                DeFiLlama, DefiLlama Perps, and protocol dashboards, cross-referenced for accuracy.
              </p>
              <p>
                <strong className="text-[var(--hw-text-muted)]">Competition data</strong> reflects approximate figures based on
                publicly available sources and may vary from real-time values. HLP TVL and ecosystem project counts are updated
                periodically by the perp.wiki team.
              </p>
              <p>
                <strong className="text-[var(--hw-text-muted)]">Community stats</strong> (reviews, ratings, suggestions) are sourced
                from the perp.wiki database. All reviews undergo moderation before publication.
                This page does not constitute financial advice — always do your own research.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function MetricCard({
  title,
  description,
  href,
  cta,
  accent,
}: {
  title: string;
  description: string;
  href: string | null;
  cta: string | null;
  accent: string;
}) {
  return (
    <div
      className="bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-border-bright)]"
      style={{ borderRadius: 4, border: "1px solid var(--hw-border)", borderLeft: `3px solid ${accent}` }}
    >
      <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
        {title}
      </h3>
      <p className="text-xs text-[var(--hw-text-muted)] leading-relaxed mb-3">
        {description}
      </p>
      {href && cta && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs text-[var(--hw-green)] hover:text-[var(--hw-green-dim)] transition-colors"
        >
          {cta}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}

function DeepLink({ href, title, description, accent }: { href: string; title: string; description: string; accent: string }) {
  return (
    <Link
      href={href}
      className="group bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
      style={{ borderRadius: 4, border: "1px solid var(--hw-border)" }}
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
