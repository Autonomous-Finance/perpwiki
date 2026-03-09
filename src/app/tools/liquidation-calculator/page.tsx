import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import LiquidationCalc from "./LiquidationCalc";

export const metadata: Metadata = {
  title: "Hyperliquid Liquidation Calculator — Estimate Your Liquidation Price | perp.wiki",
  description:
    "Calculate your Hyperliquid liquidation price based on position size, leverage, and margin. Free tool for perpetual futures traders.",
  alternates: { canonical: "https://perp.wiki/tools/liquidation-calculator" },
};

export default function LiquidationCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Hyperliquid Liquidation Calculator",
          url: "https://perp.wiki/tools/liquidation-calculator",
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
              name: "What is a liquidation price on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Your liquidation price is the price at which your margin balance falls below the maintenance margin requirement. When the mark price reaches this level, Hyperliquid's backstop liquidator closes your position to prevent further losses. The liquidation price depends on your entry price, leverage, position direction, and the maintenance margin rate.",
              },
            },
            {
              "@type": "Question",
              name: "How does Hyperliquid's liquidation engine work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Hyperliquid uses a backstop liquidator system. When a position falls below maintenance margin, the liquidation engine takes over the position. The HLP (Hyperliquidity Provider) vault absorbs the risk by taking the other side of liquidated positions. This system ensures efficient liquidations without the cascading failures seen on other platforms.",
              },
            },
            {
              "@type": "Question",
              name: "What is the maintenance margin rate on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The default maintenance margin rate on Hyperliquid is 0.5% for most perpetual markets. This means you need to maintain at least 0.5% of your position's notional value as margin. Higher-risk or lower-liquidity assets may have higher maintenance margin requirements.",
              },
            },
            {
              "@type": "Question",
              name: "Can I avoid liquidation on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. You can reduce liquidation risk by using lower leverage, setting stop-loss orders, using cross-margin mode (which shares margin across positions), monitoring funding rates, and keeping extra margin in your account. The liquidation calculator above helps you plan positions with appropriate risk levels.",
              },
            },
          ],
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Tools", href: "https://perp.wiki/tools" },
          { name: "Liquidation Calculator", href: "https://perp.wiki/tools/liquidation-calculator" },
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
        <span className="text-[var(--hw-text-muted)]">Liquidation Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-[var(--hw-text)] mb-2">
          Liquidation Calculator
        </h1>
        <p className="text-sm text-[var(--hw-text-muted)] max-w-2xl">
          Estimate your Hyperliquid liquidation price based on entry price, leverage, and margin. Understand your risk before entering a trade.
        </p>
      </div>

      {/* Calculator */}
      <LiquidationCalc />

      {/* SEO Content */}
      <div className="mt-12 space-y-10">
        {/* How Liquidation Works */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            How Liquidation Works on Hyperliquid
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              Liquidation occurs when your position&apos;s unrealized loss erodes your margin below the maintenance margin threshold. On Hyperliquid, the default maintenance margin rate is 0.5% of the position&apos;s notional value.
            </p>
            <p>
              When your position hits the liquidation price, Hyperliquid&apos;s <strong className="text-[var(--hw-text)]">backstop liquidator</strong> takes over. Unlike centralized exchanges that use cascading liquidation engines, Hyperliquid routes liquidated positions to the <strong className="text-[var(--hw-text)]">HLP vault</strong> (Hyperliquidity Provider). HLP acts as the counterparty for all liquidations, absorbing the position and the associated risk.
            </p>
            <p>
              This design means liquidations are processed efficiently without order book impact or liquidation cascades. Traders whose positions are liquidated lose their remaining margin (minus the maintenance margin portion retained by the protocol).
            </p>
            <p>
              For long positions, the liquidation price sits below your entry price. For short positions, it sits above. The higher your leverage, the closer the liquidation price is to your entry — and the smaller the adverse move required to wipe out your position.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Tips to Avoid Liquidation
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Use lower leverage",
                desc: "Lower leverage increases the distance between your entry and liquidation price. A 5x position can absorb a ~20% adverse move vs. ~2% at 50x.",
              },
              {
                title: "Set stop-loss orders",
                desc: "Always place a stop-loss order above your liquidation price. This ensures your position is closed at a controlled loss rather than being liquidated.",
              },
              {
                title: "Use cross-margin mode",
                desc: "Cross-margin shares your full account balance across all positions. This provides a larger buffer against liquidation compared to isolated margin.",
              },
              {
                title: "Monitor funding rates",
                desc: "Negative funding rates on longs (or positive on shorts) gradually drain your margin. Check funding rates regularly, especially for longer-duration holds.",
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
                style={{ borderRadius: "4px" }}
              >
                <div className="text-sm font-medium text-[var(--hw-text)] mb-1">{tip.title}</div>
                <div className="text-xs text-[var(--hw-text-dim)] leading-relaxed">{tip.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Hyperliquid Liquidation FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What is a liquidation price on Hyperliquid?",
                a: "Your liquidation price is the price at which your margin balance falls below the maintenance margin requirement. When the mark price reaches this level, Hyperliquid's backstop liquidator closes your position to prevent further losses. The liquidation price depends on your entry price, leverage, position direction, and the maintenance margin rate.",
              },
              {
                q: "How does Hyperliquid's liquidation engine work?",
                a: "Hyperliquid uses a backstop liquidator system. When a position falls below maintenance margin, the liquidation engine takes over the position. The HLP vault absorbs the risk by taking the other side of liquidated positions. This system ensures efficient liquidations without cascading failures.",
              },
              {
                q: "What is the maintenance margin rate on Hyperliquid?",
                a: "The default maintenance margin rate on Hyperliquid is 0.5% for most perpetual markets. This means you need to maintain at least 0.5% of your position's notional value as margin. Higher-risk or lower-liquidity assets may have higher requirements.",
              },
              {
                q: "Can I avoid liquidation on Hyperliquid?",
                a: "Yes. Use lower leverage, set stop-loss orders, use cross-margin mode, monitor funding rates, and keep extra margin in your account. Use this calculator to plan positions with appropriate risk levels before entering a trade.",
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
              { href: "/glossary", label: "Glossary" },
              { href: "/learn/what-is-hyperliquid", label: "What is Hyperliquid?" },
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
