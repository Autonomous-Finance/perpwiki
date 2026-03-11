import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import FundingArbCalc from "./FundingArbCalc";

export const metadata: Metadata = {
  title: "Funding Rate Arbitrage Calculator — Delta-Neutral Yield",
  description:
    "Calculate potential yield from Hyperliquid funding rate arbitrage strategies. Estimate APR from delta-neutral positions.",
  alternates: { canonical: "https://perp.wiki/tools/funding-arbitrage-calculator" },
  openGraph: {
    title: "Funding Rate Arbitrage Calculator — Delta-Neutral Yield",
    description:
      "Calculate potential yield from Hyperliquid funding rate arbitrage strategies. Estimate APR from delta-neutral positions.",
    url: "https://perp.wiki/tools/funding-arbitrage-calculator",
    siteName: "perp.wiki",
    images: [{ url: "/tools/funding-arbitrage-calculator/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Funding Rate Arbitrage Calculator — Delta-Neutral Yield",
    description:
      "Calculate potential yield from Hyperliquid funding rate arbitrage strategies. Estimate APR from delta-neutral positions.",
    images: ["/tools/funding-arbitrage-calculator/opengraph-image"],
  },
};

export default function FundingArbCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Funding Rate Arbitrage Calculator",
          url: "https://perp.wiki/tools/funding-arbitrage-calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is funding rate arbitrage?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Funding rate arbitrage is a delta-neutral strategy where you simultaneously hold a long spot position and a short perpetual futures position (or vice versa). The spot position hedges against price movement, while you collect funding payments from the perpetual contract. When funding rates are positive (longs pay shorts), you short the perp and buy spot to earn the funding rate as yield.",
              },
            },
            {
              "@type": "Question",
              name: "What are the risks of funding rate arbitrage?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Key risks include: funding rate reversal (rates can flip negative), liquidation risk if the perp position moves against you before the spot hedge balances out, execution risk from slippage when entering both positions, and opportunity cost of capital. The strategy also requires careful monitoring and may not remain profitable if funding rates decrease significantly.",
              },
            },
            {
              "@type": "Question",
              name: "How often are funding rates paid on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Hyperliquid calculates and pays funding rates every hour. The funding rate represents the hourly cost that long position holders pay to short position holders (when positive) or vice versa (when negative). Rates are based on the difference between the perpetual price and the spot/index price.",
              },
            },
          ],
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Tools", href: "https://perp.wiki/tools" },
          { name: "Funding Arbitrage Calculator", href: "https://perp.wiki/tools/funding-arbitrage-calculator" },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <Link href="/tools" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Tools
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Funding Arbitrage Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-[var(--hw-text)] mb-2">
          Funding Rate Arbitrage Calculator
        </h1>
        <p className="text-sm text-[var(--hw-text-muted)] max-w-2xl">
          Calculate potential yield from Hyperliquid funding rate arbitrage. Estimate APR from delta-neutral positions that earn funding payments.
        </p>
      </div>

      {/* Calculator */}
      <FundingArbCalc />

      {/* SEO Content */}
      <div className="mt-12 space-y-10">
        {/* How Funding Rate Arbitrage Works */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            How Funding Rate Arbitrage Works
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              Funding rate arbitrage exploits the periodic payments between long and short perpetual futures holders. When the perpetual price trades above the spot price, the funding rate is positive — meaning <strong className="text-[var(--hw-text)]">longs pay shorts</strong>. By shorting the perp and simultaneously buying spot, you create a market-neutral position that earns the funding rate as yield.
            </p>
            <p>
              On Hyperliquid, funding rates are calculated and paid <strong className="text-[var(--hw-text)]">every hour</strong>. A funding rate of 0.003%/hr translates to roughly 0.072%/day or 26.3% APR. During periods of high market bullishness, funding rates can spike significantly higher, creating attractive arbitrage opportunities.
            </p>
            <p>
              The main cost is the trading fee to enter and exit both the spot and perp positions. At 0.05% taker per side on both legs, the round-trip cost is approximately 0.2% of position size. This fee must be recovered through funding payments before the strategy becomes profitable.
            </p>
          </div>
        </section>

        {/* Delta-Neutral Strategy */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Delta-Neutral Strategy Explained
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              A <strong className="text-[var(--hw-text)]">delta-neutral</strong> position has zero net exposure to price movement. If the asset goes up $100, your long spot gains $100 and your short perp loses $100 — the net effect is zero. Your profit comes solely from the funding rate payments.
            </p>
            <p>
              To execute this on Hyperliquid: (1) Buy the asset on spot (e.g., buy ETH on HyperEVM or a spot market), (2) Open a short perpetual position of the same size on Hyperliquid perps, (3) Collect hourly funding payments as long as the rate remains positive, (4) Close both positions when funding rates become unfavorable.
            </p>
            <p>
              The key risk is <strong className="text-[var(--hw-text)]">funding rate reversal</strong>. If the rate flips negative, you start paying instead of earning. Monitor rates closely and set alerts for significant changes. The <Link href="/funding-rates" className="text-[var(--hw-green)] hover:underline">live funding rates page</Link> shows current rates across all Hyperliquid markets.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Funding Arbitrage FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What is funding rate arbitrage?",
                a: "Funding rate arbitrage is a delta-neutral strategy where you hold a long spot and short perp position (or vice versa) to earn funding payments. When longs pay shorts, you short the perp and buy spot to collect funding as yield with minimal price exposure.",
              },
              {
                q: "What are the risks of funding rate arbitrage?",
                a: "Risks include funding rate reversal (rates can flip), liquidation risk on the perp leg, execution slippage when opening both positions, and opportunity cost. The strategy requires monitoring and may become unprofitable if funding rates decrease.",
              },
              {
                q: "How often are funding rates paid on Hyperliquid?",
                a: "Hyperliquid pays funding rates every hour. The rate represents the hourly cost that longs pay shorts (when positive) or shorts pay longs (when negative). Rates are based on the difference between perpetual and spot/index prices.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group border border-[var(--hw-border)] bg-[var(--hw-surface)]"
                style={{ borderRadius: "4px" }}
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-[var(--hw-text)] hover:text-[var(--hw-green)] transition-colors list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-[var(--hw-text-dim)] text-xs ml-2 shrink-0 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-[var(--hw-text-muted)] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Related Resources
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/funding-rates", label: "Live Funding Rates" },
              { href: "/learn/hyperevm-yield-farming-guide", label: "Yield Farming Guide" },
              { href: "/tools/pnl-calculator", label: "PnL Calculator" },
              { href: "/tools/fee-calculator", label: "Fee Calculator" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-[var(--hw-text-muted)] border border-[var(--hw-border)] hover:border-[var(--hw-green-dim)] hover:text-[var(--hw-green)] transition-colors"
                style={{ borderRadius: "2px" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
