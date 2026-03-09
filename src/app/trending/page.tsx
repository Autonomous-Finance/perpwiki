import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/hl-api";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending on Hyperliquid — Top Markets & New Projects | perp.wiki",
  description:
    "See what is trending on Hyperliquid: top markets by volume and open interest, recently added ecosystem projects, and editorial highlights.",
  openGraph: {
    title: "Trending on Hyperliquid — Top Markets & New Projects",
    description:
      "Top markets by volume, highest open interest, new projects, and ecosystem pulse for Hyperliquid.",
  },
  keywords: [
    "Hyperliquid trending",
    "top perp markets",
    "Hyperliquid new projects",
    "Hyperliquid ecosystem",
  ],
  alternates: { canonical: "https://perp.wiki/trending" },
};

const HL_API = "https://api.hyperliquid.xyz/info";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

const ECOSYSTEM_PULSE = [
  "Hyperliquid processes $40B+ weekly volume",
  "HyperEVM surpasses 100 deployed contracts",
  "Felix Protocol TVL crosses $1B",
];

interface MarketEntry {
  name: string;
  vol24h: number;
  oi: number;
  change24h: number;
}

async function fetchMarketData(): Promise<{
  topByVolume: MarketEntry[];
  topByOi: MarketEntry[];
} | null> {
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
      {
        openInterest: string;
        dayNtlVlm: string;
        markPx: string;
        prevDayPx: string;
      }[],
    ];

    const markets: MarketEntry[] = metaObj.universe.map((coin, i) => {
      const ctx = assetCtxs[i];
      const markPx = parseFloat(ctx.markPx || "0");
      const prevPx = parseFloat(ctx.prevDayPx || "0");
      return {
        name: coin.name,
        vol24h: parseFloat(ctx.dayNtlVlm || "0"),
        oi: parseFloat(ctx.openInterest || "0"),
        change24h: prevPx > 0 ? ((markPx - prevPx) / prevPx) * 100 : 0,
      };
    });

    const topByVolume = [...markets].sort((a, b) => b.vol24h - a.vol24h).slice(0, 10);
    const topByOi = [...markets].sort((a, b) => b.oi - a.oi).slice(0, 10);

    return { topByVolume, topByOi };
  } catch {
    return null;
  }
}

async function getRecentProjects() {
  return prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      slug: true,
      name: true,
      tagline: true,
      category: true,
      layer: true,
      logoUrl: true,
    },
  });
}

export default async function TrendingPage() {
  const [marketData, recentProjects] = await Promise.all([
    fetchMarketData(),
    getRecentProjects(),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Trending on Hyperliquid",
          description:
            "Top markets by volume and open interest, recently added projects, and ecosystem highlights.",
          url: `${SITE_URL}/trending`,
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
          Trending
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--hw-text-muted)]">
          What is moving on Hyperliquid right now — top markets, new projects, and ecosystem
          highlights.
        </p>

        {/* Market Rankings */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Top by Volume */}
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: 4 }}
          >
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
              Top 10 by 24h Volume
            </h2>
            {marketData ? (
              <div className="space-y-1">
                {marketData.topByVolume.map((m, i) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between py-2 border-b border-[var(--hw-border)] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)] w-5">
                        {i + 1}
                      </span>
                      <span className="font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">
                        {m.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="font-[family-name:var(--font-jetbrains-mono)] text-xs"
                        style={{ color: m.change24h >= 0 ? "#00E5A0" : "#FF4D6A" }}
                      >
                        {m.change24h >= 0 ? "+" : ""}
                        {m.change24h.toFixed(2)}%
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-[var(--hw-text-muted)]">
                        {formatUsd(m.vol24h)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--hw-text-dim)]">Unable to load market data.</p>
            )}
          </div>

          {/* Top by OI */}
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: 4 }}
          >
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
              Top 10 by Open Interest
            </h2>
            {marketData ? (
              <div className="space-y-1">
                {marketData.topByOi.map((m, i) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between py-2 border-b border-[var(--hw-border)] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)] w-5">
                        {i + 1}
                      </span>
                      <span className="font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">
                        {m.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="font-[family-name:var(--font-jetbrains-mono)] text-xs"
                        style={{ color: m.change24h >= 0 ? "#00E5A0" : "#FF4D6A" }}
                      >
                        {m.change24h >= 0 ? "+" : ""}
                        {m.change24h.toFixed(2)}%
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-[var(--hw-text-muted)]">
                        {formatUsd(m.oi)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--hw-text-dim)]">Unable to load market data.</p>
            )}
          </div>
        </div>

        {/* Recently Added Projects */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
              Recently Added Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentProjects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`}>
                <div
                  className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]"
                  style={{ borderRadius: 4 }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    {p.logoUrl ? (
                      <img
                        src={p.logoUrl}
                        alt={p.name + " logo"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-[var(--hw-bg)]"
                        style={{ background: "var(--hw-text-dim)" }}
                      >
                        {p.name.charAt(0)}
                      </span>
                    )}
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
                      {p.name}
                    </h3>
                  </div>
                  {p.tagline && (
                    <p className="line-clamp-2 text-xs text-[var(--hw-text-muted)] mb-2">
                      {p.tagline}
                    </p>
                  )}
                  <span
                    className="bg-[var(--hw-green-subtle)] px-1.5 py-0.5 text-xs text-[var(--hw-text-muted)]"
                    style={{ borderRadius: 2 }}
                  >
                    {p.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ecosystem Pulse */}
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Ecosystem Pulse
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {ECOSYSTEM_PULSE.map((highlight) => (
              <div
                key={highlight}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
                style={{ borderRadius: 4 }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: "var(--hw-green)" }}
                  />
                  <p className="text-sm text-[var(--hw-text)]">{highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
