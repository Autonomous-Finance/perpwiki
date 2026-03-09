import { formatUsd } from "@/lib/hl-api";
import { JsonLd } from "@/components/JsonLd";
import { FundingTable } from "./FundingTable";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyperliquid Funding Rates — Live Perpetual Funding Data 2026 | perp.wiki",
  description:
    "Live Hyperliquid funding rates for all perpetual futures. Hourly, daily, and annualized rates sorted by magnitude. Find arbitrage and yield opportunities.",
  openGraph: {
    title: "Hyperliquid Funding Rates — Live Perpetual Funding Data 2026",
    description:
      "Live funding rates for all Hyperliquid perpetual markets. Identify high-yield funding opportunities.",
  },
  keywords: [
    "Hyperliquid funding rates",
    "perpetual funding",
    "funding rate arbitrage",
    "cash and carry trade",
    "perp DEX funding",
  ],
};

const HL_API = "https://api.hyperliquid.xyz/info";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

export interface FundingRow {
  name: string;
  rateHr: number;
  rateDay: number;
  rateApr: number;
  oi: number;
  oiFmt: string;
}

async function fetchFundingRates(): Promise<FundingRow[]> {
  try {
    const res = await fetch(HL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const [metaObj, assetCtxs] = data as [
      { universe: { name: string }[] },
      { funding: string; openInterest: string }[],
    ];

    const rows: FundingRow[] = metaObj.universe.map((coin, i) => {
      const ctx = assetCtxs[i];
      const rateHr = parseFloat(ctx.funding || "0");
      const oi = parseFloat(ctx.openInterest || "0");
      return {
        name: coin.name,
        rateHr,
        rateDay: rateHr * 24,
        rateApr: rateHr * 8760 * 100,
        oi,
        oiFmt: formatUsd(oi),
      };
    });

    // Sort by absolute funding rate descending
    rows.sort((a, b) => Math.abs(b.rateHr) - Math.abs(a.rateHr));
    return rows;
  } catch {
    return [];
  }
}

export default async function FundingRatesPage() {
  const rows = await fetchFundingRates();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Hyperliquid Perpetual Funding Rates",
          description:
            "Live funding rate data for all Hyperliquid perpetual futures markets.",
          url: `${SITE_URL}/funding-rates`,
          creator: { "@type": "Organization", name: "perp.wiki" },
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
          Funding Rates
        </h1>

        {/* SEO intro */}
        <div className="mt-4 max-w-3xl space-y-3 text-sm text-[var(--hw-text-muted)] leading-relaxed">
          <p>
            Funding rates are periodic payments exchanged between long and short traders on
            perpetual futures. They keep perp prices anchored to the underlying spot price.
            When funding is positive, longs pay shorts — indicating bullish sentiment and
            demand for leverage. When negative, shorts pay longs, signaling bearish positioning.
          </p>
          <p>
            On Hyperliquid, funding rates are calculated and applied hourly. The rate shown
            reflects the cost (or income) per hour as a percentage of position notional value.
            Annualized rates (APR) multiply the hourly rate by 8,760 hours, giving traders a
            sense of the yearly cost of holding a position if rates stayed constant.
          </p>
          <p>
            High funding rates create opportunities for arbitrage strategies. Traders can go
            long spot and short perp (cash-and-carry) to collect positive funding, or construct
            delta-neutral positions using multiple venues. Below you will find live funding data
            for every Hyperliquid perpetual market, sorted by absolute rate magnitude.
          </p>
        </div>

        {/* Live Table */}
        <div
          className="mt-8 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
          style={{ borderRadius: 4 }}
        >
          <FundingTable rows={rows} />
        </div>

        {/* Strategies Section */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: 4 }}
          >
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
              Cash-and-Carry Arbitrage
            </h2>
            <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
              When funding rates are elevated and positive, traders can buy the underlying spot
              asset and simultaneously open an equal-size short perpetual position on Hyperliquid.
              This delta-neutral trade earns the funding rate as yield while maintaining zero
              directional exposure. The strategy works best with high-OI majors like BTC and ETH
              where funding tends to be consistently positive during bull markets, and where spot
              liquidity is deep enough to minimize slippage.
            </p>
          </div>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: 4 }}
          >
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
              Delta-Neutral Strategies
            </h2>
            <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
              Beyond simple cash-and-carry, traders exploit funding rate differentials across
              venues. For example, going long on a CEX perp with low funding while shorting the
              same asset on Hyperliquid where funding is higher — capturing the spread. On
              Hyperliquid, the combination of low fees, hourly settlement, and deep liquidity
              makes it an ideal venue for these strategies. Monitor the APR column below to
              identify the most profitable opportunities in real time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
