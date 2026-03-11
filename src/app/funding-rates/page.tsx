import { formatUsd } from "@/lib/hl-api";
import { JsonLd } from "@/components/JsonLd";
import { FundingDashboard } from "./FundingTable";
import type { FundingRow } from "./FundingTable";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyperliquid Funding Rates — Live Perpetual Funding Data",
  description:
    "Live Hyperliquid funding rates for 200+ perpetual futures. Interactive heatmap, filters by direction & OI, aggregate stats, and APR rankings. Find arbitrage and yield opportunities.",
  openGraph: {
    title: "Hyperliquid Funding Rates — Live Data for 200+ Perp Markets",
    description:
      "Real-time funding rate dashboard with heatmap, filters, aggregate stats, and strategy guides. Track every Hyperliquid perpetual market.",
    url: "https://perp.wiki/funding-rates",
    siteName: "perp.wiki",
    images: [{ url: "/funding-rates/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Funding Rates — Live Data for 200+ Perp Markets",
    description:
      "Real-time funding rate dashboard with heatmap, filters, aggregate stats, and strategy guides. Track every Hyperliquid perpetual market.",
    images: ["/funding-rates/opengraph-image"],
  },
  keywords: [
    "Hyperliquid funding rates",
    "perpetual funding",
    "funding rate arbitrage",
    "cash and carry trade",
    "perp DEX funding",
    "funding rate heatmap",
    "delta neutral crypto",
    "Hyperliquid APR",
    "funding rate history",
    "crypto funding rates live",
  ],
  alternates: { canonical: "https://perp.wiki/funding-rates" },
};

const HL_API = "https://api.hyperliquid.xyz/info";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";

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
      { universe: { name: string; maxLeverage: number }[] },
      { funding: string; openInterest: string; dayNtlVlm: string; premium: string; markPx: string }[],
    ];

    const rows: FundingRow[] = metaObj.universe.map((coin, i) => {
      const ctx = assetCtxs[i];
      const rateHr = parseFloat(ctx.funding || "0");
      const oi = parseFloat(ctx.openInterest || "0");
      const markPx = parseFloat(ctx.markPx || "0");
      const oiUsd = oi * markPx;
      const vol24h = parseFloat(ctx.dayNtlVlm || "0");
      const premium = parseFloat(ctx.premium || "0");
      return {
        name: coin.name,
        rateHr,
        rateDay: rateHr * 8,
        rateApr: rateHr * 8760 * 100,
        oi: oiUsd,
        oiFmt: formatUsd(oiUsd),
        vol24h,
        vol24hFmt: formatUsd(vol24h),
        premium,
        markPx,
        maxLeverage: coin.maxLeverage || 0,
      };
    });

    rows.sort((a, b) => Math.abs(b.rateHr) - Math.abs(a.rateHr));
    return rows;
  } catch {
    return [];
  }
}

const FAQ_ITEMS = [
  {
    q: "What are funding rates on Hyperliquid?",
    a: "Funding rates are periodic payments exchanged between long and short perpetual futures traders on Hyperliquid. They are calculated and applied every hour. When funding is positive, long positions pay short positions. When negative, shorts pay longs. This mechanism keeps perpetual contract prices aligned with the underlying spot price.",
  },
  {
    q: "How often are Hyperliquid funding rates paid?",
    a: "Hyperliquid funding rates are settled every hour (once per hour). This is more frequent than many competitors that settle every 8 hours. The hourly settlement means funding accrues more smoothly, reducing the impact of any single funding payment on trader PnL.",
  },
  {
    q: "How is the funding rate calculated?",
    a: "The funding rate is derived from the premium — the difference between the perpetual contract's mark price and the oracle (spot) price. When the perp trades above spot (positive premium), the funding rate increases, incentivizing shorts and discouraging additional longs. The exact formula includes a dampening factor to prevent extreme rate swings.",
  },
  {
    q: "What does a positive vs negative funding rate mean?",
    a: "A positive funding rate means long traders pay short traders, indicating bullish sentiment and excess demand for leverage on the long side. A negative funding rate means short traders pay long traders, signaling bearish positioning. Extreme rates in either direction suggest crowded trades and potential mean reversion.",
  },
  {
    q: "How can I use funding rates to make money?",
    a: "The primary strategy is cash-and-carry arbitrage: buy the spot asset and simultaneously short the perpetual to earn positive funding as yield. Other strategies include funding rate arbitrage across venues (capturing rate differentials between Hyperliquid and CEXs), and using funding as a contrarian signal — extreme rates often precede reversals. Several Hyperliquid protocols like Resolv and Liminal automate delta-neutral funding strategies.",
  },
  {
    q: "What is the APR column and how is it calculated?",
    a: "APR (Annual Percentage Rate) represents the annualized cost or income from funding. It is calculated by multiplying the hourly funding rate by 8,760 (hours in a year) and expressing it as a percentage. Note that APR assumes the current rate stays constant — actual returns vary as funding rates fluctuate throughout the year.",
  },
];

export default async function FundingRatesPage() {
  const rows = await fetchFundingRates();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Hyperliquid Perpetual Funding Rates",
          description: "Live funding rate data for all Hyperliquid perpetual futures markets, updated every hour.",
          url: `${SITE_URL}/funding-rates`,
          creator: { "@type": "Organization", name: "perp.wiki" },
          variableMeasured: [
            { "@type": "PropertyValue", name: "Funding Rate", unitText: "percent per hour" },
            { "@type": "PropertyValue", name: "Open Interest", unitText: "USD" },
            { "@type": "PropertyValue", name: "APR", unitText: "percent per year" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
            Hyperliquid Funding Rates
          </h1>
          <p className="mt-2 text-base text-[var(--hw-text-muted)] max-w-3xl">
            Live funding data for {rows.length}+ perpetual markets. Filter by direction, open interest, and sort by any metric to find arbitrage opportunities.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[var(--hw-green)]" style={{ borderRadius: 2, background: "var(--hw-green-subtle)" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--hw-green)] animate-pulse" />
              Live — updated every hour
            </span>
            <span className="px-2.5 py-1 text-xs text-[var(--hw-text-dim)]" style={{ borderRadius: 2, background: "var(--hw-surface)" }}>
              {rows.length} markets tracked
            </span>
          </div>
        </div>

        {/* Interactive Dashboard (client component) */}
        <FundingDashboard rows={rows} />

        {/* ===== SEO CONTENT SECTIONS ===== */}
        <div className="mt-12 space-y-10">
          {/* Understanding Funding Rates */}
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-green)]" style={{ borderRadius: 1 }} />
              Understanding Perpetual Funding Rates
            </h2>
            <div className="space-y-3 text-sm text-[var(--hw-text-muted)] leading-relaxed">
              <p>
                Funding rates are the mechanism that keeps perpetual futures prices anchored to the
                underlying spot price. Unlike traditional futures that expire on a set date, perpetual
                contracts have no expiry — so funding acts as the tether between perp and spot markets.
              </p>
              <p>
                On Hyperliquid, funding is calculated and settled <strong className="text-[var(--hw-text)]">every hour</strong>,
                making it one of the most frequently-settling venues in DeFi. The rate shown in the table
                above represents the cost (or income) per hour as a percentage of your position&apos;s notional
                value. The APR column annualizes this rate by multiplying by 8,760 hours.
              </p>
              <p>
                The <strong className="text-[var(--hw-text)]">premium</strong> column shows the percentage
                difference between the perpetual mark price and the oracle (spot) price. A positive premium
                means the perp trades above spot — typically leading to positive funding. The premium is
                the primary input to the funding rate formula.
              </p>
            </div>
          </div>

          {/* Strategy Cards */}
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-cyan)]" style={{ borderRadius: 1 }} />
              Funding Rate Strategies
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
                  Cash-and-Carry Arbitrage
                </h3>
                <p className="text-xs text-[var(--hw-text-muted)] leading-relaxed mb-3">
                  Buy spot + short perp to earn positive funding as yield with zero directional
                  exposure. Works best with high-OI majors like BTC and ETH during bull markets where
                  funding tends to stay consistently positive.
                </p>
                <div className="text-[10px] text-[var(--hw-text-dim)]">
                  Risk: Spot-perp basis risk, liquidation on short leg
                </div>
              </div>
              <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
                  Cross-Venue Arbitrage
                </h3>
                <p className="text-xs text-[var(--hw-text-muted)] leading-relaxed mb-3">
                  Go long on a venue with low/negative funding while shorting the same asset on
                  Hyperliquid where funding is higher — capturing the spread. Hyperliquid&apos;s hourly
                  settlement and low fees make it ideal for the short leg.
                </p>
                <div className="text-[10px] text-[var(--hw-text-dim)]">
                  Risk: Margin requirements across venues, settlement timing mismatch
                </div>
              </div>
              <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
                  Contrarian Signal
                </h3>
                <p className="text-xs text-[var(--hw-text-muted)] leading-relaxed mb-3">
                  Extreme funding rates signal crowded positioning. Very high positive rates often
                  precede long squeezes; very negative rates precede short squeezes. Use the APR
                  column to spot extremes above +100% or below -100%.
                </p>
                <div className="text-[10px] text-[var(--hw-text-dim)]">
                  Risk: Rates can stay extreme longer than expected
                </div>
              </div>
            </div>
          </div>

          {/* Ecosystem Integration */}
          <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6" style={{ borderRadius: 4 }}>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
              Protocols That Automate Funding Strategies
            </h2>
            <p className="text-sm text-[var(--hw-text-muted)] mb-4">
              Several Hyperliquid ecosystem protocols let you earn funding yield without manual management:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "HLP Vault", slug: "hlp", desc: "Protocol-owned liquidity vault earning from market-making spreads and funding" },
                { name: "Resolv", slug: "resolv", desc: "Delta-neutral stablecoin (USR) backed by ETH with HL funding rates" },
                { name: "Liminal", slug: "liminal", desc: "Turns funding rates into market-neutral on-chain yield" },
                { name: "HyperBeat", slug: "hyperbeat", desc: "Meta Vaults with delta-neutral strategies across HL markets" },
              ].map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group border border-[var(--hw-border)] bg-[var(--hw-bg)] p-3 transition-all hover:border-[var(--hw-border-bright)]"
                  style={{ borderRadius: 4 }}
                >
                  <div className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[var(--hw-text-dim)] mt-1 leading-snug">{p.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-5 flex items-center gap-2">
              <span className="inline-block h-1 w-5 bg-[var(--hw-gold)]" style={{ borderRadius: 1 }} />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-3xl">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
                    {item.q}
                  </h3>
                  <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hyperliquid vs Competitors */}
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-5" style={{ background: "var(--hw-tier-hip3)", borderRadius: 1 }} />
              Hyperliquid Funding vs Other Venues
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--hw-border)]">
                    <th className="text-left px-3 py-2 text-xs text-[var(--hw-text-dim)]">Feature</th>
                    <th className="text-left px-3 py-2 text-xs text-[var(--hw-green)]">Hyperliquid</th>
                    <th className="text-left px-3 py-2 text-xs text-[var(--hw-text-dim)]">dYdX</th>
                    <th className="text-left px-3 py-2 text-xs text-[var(--hw-text-dim)]">Binance</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--hw-text-muted)]">
                  <tr className="border-b border-[var(--hw-border)]">
                    <td className="px-3 py-2 text-[var(--hw-text-dim)]">Settlement</td>
                    <td className="px-3 py-2 font-medium text-[var(--hw-green)]">Every hour</td>
                    <td className="px-3 py-2">Every hour</td>
                    <td className="px-3 py-2">Every 8 hours</td>
                  </tr>
                  <tr className="border-b border-[var(--hw-border)]">
                    <td className="px-3 py-2 text-[var(--hw-text-dim)]">Markets</td>
                    <td className="px-3 py-2 font-medium text-[var(--hw-green)]">{rows.length}+</td>
                    <td className="px-3 py-2">~180</td>
                    <td className="px-3 py-2">~400</td>
                  </tr>
                  <tr className="border-b border-[var(--hw-border)]">
                    <td className="px-3 py-2 text-[var(--hw-text-dim)]">Custody</td>
                    <td className="px-3 py-2 font-medium text-[var(--hw-green)]">Self-custody</td>
                    <td className="px-3 py-2">Self-custody</td>
                    <td className="px-3 py-2">Custodial</td>
                  </tr>
                  <tr className="border-b border-[var(--hw-border)]">
                    <td className="px-3 py-2 text-[var(--hw-text-dim)]">Trading Fees</td>
                    <td className="px-3 py-2 font-medium text-[var(--hw-green)]">0.01% / 0.035%</td>
                    <td className="px-3 py-2">0.02% / 0.05%</td>
                    <td className="px-3 py-2">0.02% / 0.05%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-[var(--hw-text-dim)]">Composability</td>
                    <td className="px-3 py-2 font-medium text-[var(--hw-green)]">HyperEVM DeFi</td>
                    <td className="px-3 py-2">Limited</td>
                    <td className="px-3 py-2">None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="border border-[var(--hw-border)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderRadius: 4, background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)" }}
          >
            <div>
              <p className="text-sm font-medium text-[var(--hw-text)]">
                Start trading perpetuals on Hyperliquid
              </p>
              <p className="text-xs text-[var(--hw-text-dim)] mt-0.5">
                Self-custody, lowest fees, hourly funding settlement
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
