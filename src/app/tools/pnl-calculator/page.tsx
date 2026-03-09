import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import PnlCalc from "./PnlCalc";

export const metadata: Metadata = {
  title: "Hyperliquid PnL Calculator — Profit & Loss Estimator | perp.wiki",
  description:
    "Calculate profit and loss for Hyperliquid perpetual trades. Estimate PnL, ROE, and fees before entering a position.",
  alternates: { canonical: "https://perp.wiki/tools/pnl-calculator" },
};

export default function PnlCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Hyperliquid PnL Calculator",
          url: "https://perp.wiki/tools/pnl-calculator",
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
              name: "How is PnL calculated on Hyperliquid perpetual trades?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For long positions, PnL = Position Size x (Exit Price - Entry Price) / Entry Price. For short positions, PnL = Position Size x (Entry Price - Exit Price) / Entry Price. Net PnL subtracts trading fees (0.05% taker fee for open and close). The result is your realized profit or loss in USDC.",
              },
            },
            {
              "@type": "Question",
              name: "What is the difference between ROE and ROI?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ROE (Return on Equity) measures profit relative to your margin (the capital you actually put up). ROI (Return on Investment) measures profit relative to the total position size. With leverage, ROE is amplified — a 10x leveraged position with a 1% price move yields 10% ROE but only 1% ROI. ROE is the more common metric for leveraged perp trading.",
              },
            },
            {
              "@type": "Question",
              name: "What fees does Hyperliquid charge on perp trades?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Hyperliquid charges 0.025% for maker orders (limit orders) and 0.050% for taker orders (market orders) on perpetual trades. Fees are charged on both opening and closing a position. For a $1,000 taker trade, you would pay $0.50 to open and $0.50 to close, totaling $1.00 in fees.",
              },
            },
          ],
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Tools", href: "https://perp.wiki/tools" },
          { name: "PnL Calculator", href: "https://perp.wiki/tools/pnl-calculator" },
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
        <span className="text-[var(--hw-text-muted)]">PnL Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-[var(--hw-text)] mb-2">
          PnL Calculator
        </h1>
        <p className="text-sm text-[var(--hw-text-muted)] max-w-2xl">
          Calculate profit and loss for Hyperliquid perpetual trades. Estimate PnL, ROE, and fees before entering a position.
        </p>
      </div>

      {/* Calculator */}
      <PnlCalc />

      {/* SEO Content */}
      <div className="mt-12 space-y-10">
        {/* Understanding PnL */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Understanding PnL on Perps
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              PnL (Profit and Loss) on perpetual futures is calculated based on the price difference between your entry and exit, multiplied by your position size. On Hyperliquid, all PnL is settled in <strong className="text-[var(--hw-text)]">USDC</strong>.
            </p>
            <p>
              For <strong className="text-[var(--hw-text)]">long positions</strong>, you profit when the price goes up. Your PnL equals the position size multiplied by the percentage price change. For <strong className="text-[var(--hw-text)]">short positions</strong>, you profit when the price goes down — the formula is reversed.
            </p>
            <p>
              Trading fees reduce your net PnL. Hyperliquid charges <strong className="text-[var(--hw-text)]">0.05% per side</strong> for taker (market) orders, meaning you pay fees on both opening and closing. For a $10,000 position, total fees are $10 (0.1% round-trip). Maker orders are cheaper at 0.025% per side.
            </p>
          </div>
        </section>

        {/* ROE vs ROI */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            ROE vs ROI
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              <strong className="text-[var(--hw-text)]">ROE (Return on Equity)</strong> measures your profit relative to the margin you posted — the actual capital locked in the trade. <strong className="text-[var(--hw-text)]">ROI (Return on Investment)</strong> measures profit relative to the total position size.
            </p>
            <p>
              With leverage, these two metrics diverge significantly. A $1,000 position at 10x leverage requires only $100 in margin. If you make $50 profit, your ROI is 5% (50/1000) but your ROE is 50% (50/100). ROE reflects the actual return on the capital you put at risk.
            </p>
            <p>
              Most perpetual trading interfaces, including Hyperliquid, display ROE because it reflects the true efficiency of your capital. However, high ROE can be misleading — a 500% ROE at 50x leverage only requires a 10% price move, which also means a 10% adverse move liquidates you.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            PnL Calculator FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "How is PnL calculated on Hyperliquid perpetual trades?",
                a: "For long positions: PnL = Position Size x (Exit Price - Entry Price) / Entry Price. For short positions: PnL = Position Size x (Entry Price - Exit Price) / Entry Price. Net PnL subtracts trading fees (0.05% taker on open + close).",
              },
              {
                q: "What is the difference between ROE and ROI?",
                a: "ROE (Return on Equity) measures profit relative to your margin. ROI measures profit relative to total position size. With 10x leverage and a 1% price move, ROE is 10% but ROI is only 1%. ROE reflects the actual return on the capital you put at risk.",
              },
              {
                q: "What fees does Hyperliquid charge on perp trades?",
                a: "Hyperliquid charges 0.025% for maker orders and 0.050% for taker orders on perps. Fees apply to both opening and closing. A $1,000 taker round-trip costs $1.00 in total fees (0.05% x 2 sides).",
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
              { href: "/tools/position-size-calculator", label: "Position Size Calculator" },
              { href: "/tools/fee-calculator", label: "Fee Calculator" },
              { href: "/tools/liquidation-calculator", label: "Liquidation Calculator" },
              { href: "/markets", label: "Live Markets" },
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
