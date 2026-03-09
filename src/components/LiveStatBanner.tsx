import { getHypePrice, getHlMeta, getTopMarkets, formatUsd } from "@/lib/hl-api";
import { prisma } from "@/lib/prisma";

interface MetricCardProps {
  value: string;
  label: string;
  live: boolean;
}

function MetricCard({ value, label, live }: MetricCardProps) {
  return (
    <div
      className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 relative"
      style={{ borderLeft: "3px solid var(--hw-green)", borderRadius: "4px" }}
    >
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-xl font-bold text-[var(--hw-text)] mb-1">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)]">
        {label}
      </div>
      {live && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hw-green)]" />
          </span>
        </div>
      )}
    </div>
  );
}

function LiveIndicator({ live }: { live: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-[var(--hw-text-dim)]">
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            live ? "animate-ping bg-[var(--hw-green)] opacity-75" : "bg-[var(--hw-text-dim)]"
          }`}
        />
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            live ? "bg-[var(--hw-green)]" : "bg-[var(--hw-text-dim)]"
          }`}
        />
      </span>
      {live ? "Updated just now" : "Static fallback"}
    </div>
  );
}

async function StakingBanner() {
  let hypePrice = "$—";
  let live = false;

  try {
    const { price, live: isLive } = await getHypePrice();
    live = isLive;
    if (price) {
      const num = parseFloat(price);
      hypePrice = `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
    }
  } catch {
    hypePrice = "$—";
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--hw-text-dim)]">
          Live Staking Metrics
        </span>
        <LiveIndicator live={live} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard value={hypePrice} label="HYPE Price" live={live} />
        <MetricCard value="~2.25%" label="Est. Staking APY" live={false} />
        <MetricCard value="2B+" label="Total HYPE Staked" live={false} />
      </div>
    </div>
  );
}

async function MarketsBanner() {
  let marketsCount = "170+";
  let vol24h = "$—";
  let topPair = "—";
  let live = false;

  try {
    const [metaResult, topMarkets] = await Promise.all([
      getHlMeta(),
      getTopMarkets(1),
    ]);
    live = metaResult.live;

    if (metaResult.meta) {
      marketsCount = metaResult.meta.marketsCount.toString();
      if (metaResult.meta.totalVol24h) {
        vol24h = formatUsd(metaResult.meta.totalVol24h);
      }
    }

    if (topMarkets.length > 0) {
      const top = topMarkets[0];
      topPair = `${top.name} (${formatUsd(top.dayNtlVlm)})`;
    }
  } catch {
    // keep fallback values
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--hw-text-dim)]">
          Live Market Overview
        </span>
        <LiveIndicator live={live} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard value={marketsCount} label="Trading Pairs" live={live} />
        <MetricCard value={vol24h} label="24h Volume" live={live} />
        <MetricCard value={topPair} label="Top Pair by OI" live={live} />
      </div>
    </div>
  );
}

async function FundingBanner() {
  let avgFunding = "—";
  let highestPos = "—";
  let mostNeg = "—";
  let live = false;

  try {
    const markets = await getTopMarkets(200);
    if (markets.length > 0) {
      live = true;
      const rates = markets.map((m) => parseFloat(m.funding) * 100);
      const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
      avgFunding = `${avg >= 0 ? "+" : ""}${avg.toFixed(4)}%`;

      const sorted = [...markets].sort(
        (a, b) => parseFloat(b.funding) - parseFloat(a.funding)
      );
      const top = sorted[0];
      const bottom = sorted[sorted.length - 1];

      const topRate = parseFloat(top.funding) * 100;
      highestPos = `${top.name} ${topRate >= 0 ? "+" : ""}${topRate.toFixed(4)}%`;

      const botRate = parseFloat(bottom.funding) * 100;
      mostNeg = `${bottom.name} ${botRate >= 0 ? "+" : ""}${botRate.toFixed(4)}%`;
    }
  } catch {
    // keep fallback values
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--hw-text-dim)]">
          Live Funding Rates
        </span>
        <LiveIndicator live={live} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard value={avgFunding} label="Avg Funding Rate" live={live} />
        <MetricCard value={highestPos} label="Highest Positive" live={live} />
        <MetricCard value={mostNeg} label="Most Negative" live={live} />
      </div>
    </div>
  );
}

async function EcosystemBanner() {
  let totalProjects = "—";
  let activeProjects = "—";
  let featuredCount = "—";

  try {
    const [total, active, featured] = await Promise.all([
      prisma.project.count({ where: { approvalStatus: "APPROVED" } }),
      prisma.project.count({
        where: { approvalStatus: "APPROVED", status: "LIVE" },
      }),
      prisma.project.count({
        where: { approvalStatus: "APPROVED", isFeatured: true },
      }),
    ]);
    totalProjects = total.toString();
    activeProjects = active.toString();
    featuredCount = featured.toString();
  } catch {
    // keep fallback values
  }

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--hw-text-dim)]">
          Ecosystem Stats
        </span>
        <LiveIndicator live={true} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard value={totalProjects} label="Total Projects" live={true} />
        <MetricCard value={activeProjects} label="Live Projects" live={true} />
        <MetricCard value={featuredCount} label="Featured" live={true} />
      </div>
    </div>
  );
}

export async function LiveStatBanner({
  variant,
}: {
  variant: "staking" | "markets" | "funding" | "ecosystem";
}) {
  switch (variant) {
    case "staking":
      return <StakingBanner />;
    case "markets":
      return <MarketsBanner />;
    case "funding":
      return <FundingBanner />;
    case "ecosystem":
      return <EcosystemBanner />;
  }
}
