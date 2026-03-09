import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/hl-api";
import { JsonLd } from "@/components/JsonLd";
import { StatsCharts } from "./StatsCharts";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth | perp.wiki",
  description:
    "Hyperliquid ecosystem statistics: weekly volume growth, open interest by market, funding rate heatmap, and DEX market share. Live data from the Hyperliquid L1.",
  openGraph: {
    title: "Hyperliquid Stats — Volume, Open Interest & Ecosystem Growth",
    description:
      "Weekly volume trends, top markets by OI, funding heatmaps, and DEX market share for Hyperliquid.",
  },
  keywords: [
    "Hyperliquid stats",
    "Hyperliquid volume",
    "Hyperliquid open interest",
    "DEX market share",
    "perp DEX analytics",
  ],
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

    // Top 10 by OI
    const topByOi = [...markets]
      .sort((a, b) => b.oi - a.oi)
      .slice(0, 10)
      .map((m) => ({ name: m.name, oi: m.oi }));

    // All coins for funding heatmap (top 40 by OI)
    const fundingData = [...markets]
      .sort((a, b) => b.oi - a.oi)
      .slice(0, 40)
      .map((m) => ({ name: m.name, rate: m.funding }));

    return {
      totalOi,
      totalVol,
      marketsCount: metaObj.universe.length,
      topByOi,
      fundingData,
    };
  } catch {
    return null;
  }
}

export default async function StatsPage() {
  const [liveData, projectCount] = await Promise.all([
    fetchLiveData(),
    prisma.project.count({ where: { approvalStatus: "APPROVED" } }),
  ]);

  const statCards = [
    {
      label: "24h Volume",
      value: liveData ? formatUsd(liveData.totalVol) : "N/A",
      live: !!liveData,
    },
    {
      label: "Open Interest",
      value: liveData ? formatUsd(liveData.totalOi) : "N/A",
      live: !!liveData,
    },
    {
      label: "Active Markets",
      value: liveData ? String(liveData.marketsCount) : "N/A",
      live: !!liveData,
    },
    { label: "DEX Market Share", value: "26%", live: false },
    { label: "HLP TVL", value: "$480M+", live: false },
    { label: "Ecosystem Projects", value: String(projectCount), live: false },
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
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
          Ecosystem Statistics
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--hw-text-muted)]">
          Track Hyperliquid&apos;s growth from volume trends and open interest to funding rates and
          DEX market share. Live data combined with historical metrics.
        </p>

        {/* Stat Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: 4 }}
            >
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
            </div>
          ))}
        </div>

        {/* Charts */}
        <StatsCharts
          weeklyVol={WEEKLY_VOL_DATA}
          topByOi={liveData?.topByOi ?? []}
          fundingData={liveData?.fundingData ?? []}
        />
      </section>
    </>
  );
}
