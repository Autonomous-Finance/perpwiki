"use client";

import { VolumeChart } from "@/components/charts/VolumeChart";
import { TopMarketsBarChart } from "@/components/charts/TopMarketsBarChart";
import { FundingHeatmap } from "@/components/charts/FundingHeatmap";
import { MarketShareDonut } from "@/components/charts/MarketShareDonut";

interface StatsChartsProps {
  weeklyVol: Array<{ week: string; vol: number }>;
  topByOi: Array<{ name: string; oi: number }>;
  fundingData: Array<{ name: string; rate: number }>;
}

export function StatsCharts({ weeklyVol, topByOi, fundingData }: StatsChartsProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Volume + OI row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
          style={{ borderRadius: 4 }}
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
            Weekly Volume Growth
          </h2>
          <VolumeChart data={weeklyVol} />
        </div>

        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
          style={{ borderRadius: 4 }}
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
            Top Markets by Open Interest
          </h2>
          {topByOi.length > 0 ? (
            <TopMarketsBarChart data={topByOi} />
          ) : (
            <p className="text-sm text-[var(--hw-text-dim)]">Loading live data...</p>
          )}
        </div>
      </div>

      {/* Funding Heatmap */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
        style={{ borderRadius: 4 }}
      >
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
          Funding Rate Heatmap
        </h2>
        <p className="text-xs text-[var(--hw-text-dim)] mb-4">
          Green = positive (longs pay shorts) | Red = negative (shorts pay longs). Intensity
          reflects magnitude.
        </p>
        {fundingData.length > 0 ? (
          <FundingHeatmap data={fundingData} />
        ) : (
          <p className="text-sm text-[var(--hw-text-dim)]">Loading live data...</p>
        )}
      </div>

      {/* Market Share */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
        style={{ borderRadius: 4 }}
      >
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
          Perp DEX Market Share
        </h2>
        <p className="text-xs text-[var(--hw-text-dim)] mb-4">
          Hyperliquid&apos;s share of on-chain perpetual futures volume across major DEXs.
        </p>
        <MarketShareDonut />
      </div>
    </div>
  );
}
