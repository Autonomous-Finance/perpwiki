import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import FeeCalc from "./FeeCalc";

export const metadata: Metadata = {
  title: "Hyperliquid Fee Calculator — Trading Cost Estimator | perp.wiki",
  description:
    "Calculate your Hyperliquid trading fees for perpetual and spot trades. Compare maker vs taker costs and estimate total expenses.",
  alternates: { canonical: "https://perp.wiki/tools/fee-calculator" },
};

export default function FeeCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Hyperliquid Fee Calculator",
          url: "https://perp.wiki/tools/fee-calculator",
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
              name: "What are the trading fees on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Hyperliquid charges 0.025% for perpetual maker orders (limit orders that add liquidity) and 0.050% for taker orders (market orders that remove liquidity). Spot trading fees are 0.020% for makers and 0.050% for takers. These are among the lowest fees in DeFi perpetuals trading.",
              },
            },
            {
              "@type": "Question",
              name: "How do Hyperliquid fees compare to Binance?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Binance VIP0 perpetual fees are 0.020% maker and 0.040% taker. Hyperliquid's maker fee is slightly higher (0.025% vs 0.020%) but offers decentralized, non-custodial trading. For taker orders, Hyperliquid is 0.050% vs Binance's 0.040%. However, Hyperliquid has no deposit or withdrawal fees and no KYC requirements.",
              },
            },
            {
              "@type": "Question",
              name: "Are there ways to reduce fees on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. The primary way to reduce fees is to use limit orders (maker orders) instead of market orders. Maker orders on Hyperliquid cost 0.025% vs 0.050% for takers — a 50% reduction. Additionally, Hyperliquid may introduce volume-based fee tiers and referral fee discounts in the future.",
              },
            },
          ],
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Tools", href: "https://perp.wiki/tools" },
          { name: "Fee Calculator", href: "https://perp.wiki/tools/fee-calculator" },
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
        <span className="text-[var(--hw-text-muted)]">Fee Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-[var(--hw-text)] mb-2">
          Fee Calculator
        </h1>
        <p className="text-sm text-[var(--hw-text-muted)] max-w-2xl">
          Calculate your Hyperliquid trading fees for perpetual and spot trades. Compare maker vs taker costs and estimate your total trading expenses.
        </p>
      </div>

      {/* Calculator */}
      <FeeCalc />

      {/* SEO Content */}
      <div className="mt-12 space-y-10">
        {/* Understanding Fees */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Understanding Hyperliquid Fees
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              Hyperliquid uses a maker-taker fee model. <strong className="text-[var(--hw-text)]">Maker orders</strong> (limit orders that add liquidity to the order book) pay lower fees because they improve market depth. <strong className="text-[var(--hw-text)]">Taker orders</strong> (market orders that remove liquidity) pay higher fees.
            </p>
            <p>
              For perpetual futures, makers pay <strong className="text-[var(--hw-text)]">0.025%</strong> and takers pay <strong className="text-[var(--hw-text)]">0.050%</strong>. Spot trading is even cheaper for makers at <strong className="text-[var(--hw-text)]">0.020%</strong>, while takers pay the same <strong className="text-[var(--hw-text)]">0.050%</strong>.
            </p>
            <p>
              Unlike centralized exchanges, Hyperliquid has no deposit fees, no withdrawal fees, and no account maintenance costs. You only pay when you trade. All fees are denominated in USDC and deducted from your margin or balance at trade execution.
            </p>
          </div>
        </section>

        {/* Fee Comparison Table */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            How Hyperliquid Fees Compare
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--hw-border)]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] uppercase tracking-wider">Exchange</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] uppercase tracking-wider">Maker</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] uppercase tracking-wider">Taker</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[var(--hw-text-dim)] uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="font-[family-name:var(--font-jetbrains-mono)]">
                {[
                  { name: "Hyperliquid", maker: "0.025%", taker: "0.050%", type: "DEX (on-chain)" },
                  { name: "Binance Futures", maker: "0.020%", taker: "0.040%", type: "CEX (VIP0)" },
                  { name: "dYdX v4", maker: "0.020%", taker: "0.050%", type: "DEX (app-chain)" },
                  { name: "GMX v2", maker: "0.050%", taker: "0.070%", type: "DEX (Arbitrum)" },
                  { name: "Bybit", maker: "0.020%", taker: "0.055%", type: "CEX (VIP0)" },
                ].map((row, i) => (
                  <tr
                    key={row.name}
                    className={`border-b border-[var(--hw-border)] ${i === 0 ? "bg-[var(--hw-green-subtle)]" : ""}`}
                  >
                    <td className="py-3 px-4 text-[var(--hw-text)] font-sans">
                      {i === 0 && <span className="text-[var(--hw-green)] mr-1">●</span>}
                      {row.name}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--hw-text-muted)]">{row.maker}</td>
                    <td className="py-3 px-4 text-right text-[var(--hw-text-muted)]">{row.taker}</td>
                    <td className="py-3 px-4 text-right text-[var(--hw-text-dim)] text-xs font-sans">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--hw-text-dim)]">
            Fee rates are for the base tier (no VIP/volume discounts). Rates are subject to change. Last updated March 2026.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Fee FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What are the trading fees on Hyperliquid?",
                a: "Hyperliquid charges 0.025% for perpetual maker orders and 0.050% for taker orders. Spot trading fees are 0.020% for makers and 0.050% for takers. These are among the lowest fees in DeFi perpetuals trading.",
              },
              {
                q: "How do Hyperliquid fees compare to Binance?",
                a: "Binance VIP0 perpetual fees are 0.020% maker and 0.040% taker. Hyperliquid's maker fee is slightly higher (0.025% vs 0.020%) but offers decentralized, non-custodial trading with no KYC requirements, no deposit fees, and no withdrawal fees.",
              },
              {
                q: "Are there ways to reduce fees on Hyperliquid?",
                a: "The primary way is to use limit orders (maker orders) instead of market orders. Maker orders cost 0.025% vs 0.050% for takers — a 50% reduction. Hyperliquid may introduce volume-based fee tiers in the future.",
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
              { href: "/markets", label: "Live Markets" },
              { href: "/learn/hyperliquid-fees-explained", label: "Fees Explained" },
              { href: "/glossary", label: "Glossary" },
              { href: "/tools/liquidation-calculator", label: "Liquidation Calculator" },
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
