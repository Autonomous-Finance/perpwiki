import { MarketsTable, type MarketRow } from "@/components/MarketsTable";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyperliquid Live Markets — Funding Rates, Open Interest & Volume",
  description:
    "Live Hyperliquid perpetual futures data: mark prices, 24h change, funding rates, open interest, and trading volume for all markets.",
  openGraph: {
    title: "Hyperliquid Live Markets — Funding Rates, Open Interest & Volume",
    description:
      "Live Hyperliquid perpetual futures data: mark prices, 24h change, funding rates, open interest, and trading volume.",
    url: "https://perp.wiki/markets",
    siteName: "perp.wiki",
    images: [{ url: "/markets/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Live Markets — Funding Rates, Open Interest & Volume",
    description:
      "Live Hyperliquid perpetual futures data: mark prices, 24h change, funding rates, open interest, and trading volume.",
    images: ["/markets/opengraph-image"],
  },
  keywords: [
    "Hyperliquid markets",
    "Hyperliquid funding rates",
    "Hyperliquid open interest",
    "perpetual futures data",
    "perp DEX volume",
  ],
  alternates: { canonical: "https://perp.wiki/markets" },
};

const HL_API = "https://api.hyperliquid.xyz/info";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

async function fetchMarkets(): Promise<MarketRow[]> {
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
      {
        funding: string;
        openInterest: string;
        dayNtlVlm: string;
        markPx: string;
        prevDayPx: string;
      }[],
    ];

    return metaObj.universe.map((coin, i) => {
      const ctx = assetCtxs[i];
      const markPx = parseFloat(ctx.markPx || "0");
      const prevPx = parseFloat(ctx.prevDayPx || "0");
      const change24h = prevPx > 0 ? ((markPx - prevPx) / prevPx) * 100 : 0;
      const fundingRate = parseFloat(ctx.funding || "0");
      const fundingApr = fundingRate * 8760 * 100;
      const oi = parseFloat(ctx.openInterest || "0");
      const vol24h = parseFloat(ctx.dayNtlVlm || "0");

      return {
        name: coin.name,
        markPx,
        change24h,
        fundingRate,
        fundingApr,
        oi,
        vol24h,
      };
    });
  } catch {
    return [];
  }
}

export default async function MarketsPage() {
  const markets = await fetchMarkets();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Hyperliquid Perpetual Markets Data",
          description:
            "Live trading data for all Hyperliquid perpetual futures markets including prices, funding rates, open interest, and volume.",
          url: `${SITE_URL}/markets`,
          creator: {
            "@type": "Organization",
            name: "perp.wiki",
          },
          temporalCoverage: "2024/..",
          license: "https://creativecommons.org/licenses/by/4.0/",
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
          Live Markets
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--hw-text-muted)]">
          Real-time data for every perpetual futures market on Hyperliquid. Track mark prices,
          24-hour price changes, hourly funding rates, open interest, and trading volume across{" "}
          {markets.length}+ markets. Data refreshes every 30 seconds from the Hyperliquid L1.
        </p>

        <div className="mt-8 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: 4 }}>
          <MarketsTable markets={markets} />
        </div>
      </section>
    </>
  );
}
