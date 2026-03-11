import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import PositionSizeCalc from "./PositionSizeCalc";

export const metadata: Metadata = {
  title: "Hyperliquid Position Size Calculator — Risk-Based Sizing",
  description:
    "Calculate optimal position size for Hyperliquid trades based on account balance, risk tolerance, and leverage.",
  alternates: { canonical: "https://perp.wiki/tools/position-size-calculator" },
  openGraph: {
    title: "Hyperliquid Position Size Calculator — Risk-Based Sizing",
    description:
      "Calculate optimal position size for Hyperliquid trades based on account balance, risk tolerance, and leverage.",
    url: "https://perp.wiki/tools/position-size-calculator",
    siteName: "perp.wiki",
    images: [{ url: "/tools/position-size-calculator/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Position Size Calculator — Risk-Based Sizing",
    description:
      "Calculate optimal position size for Hyperliquid trades based on account balance, risk tolerance, and leverage.",
    images: ["/tools/position-size-calculator/opengraph-image"],
  },
};

export default function PositionSizeCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Hyperliquid Position Size Calculator",
          url: "https://perp.wiki/tools/position-size-calculator",
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
              name: "What is position sizing in trading?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Position sizing determines how much capital to allocate to a single trade. Proper position sizing ensures that no single trade can cause catastrophic losses to your account. It is based on your account balance, the percentage you are willing to risk, and the distance to your stop loss.",
              },
            },
            {
              "@type": "Question",
              name: "What is the 1% rule in trading?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The 1% rule states that you should never risk more than 1% of your total account balance on a single trade. For a $10,000 account, this means your maximum loss per trade should be $100. This rule helps traders survive losing streaks and protects capital for long-term profitability.",
              },
            },
            {
              "@type": "Question",
              name: "How does leverage affect position sizing on Hyperliquid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Leverage amplifies your exposure but does not change your risk amount. If you risk 1% of a $10,000 account ($100), that remains your max loss regardless of leverage. However, leverage reduces the margin required to open the position, allowing you to control a larger position with less capital locked up.",
              },
            },
          ],
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Tools", href: "https://perp.wiki/tools" },
          { name: "Position Size Calculator", href: "https://perp.wiki/tools/position-size-calculator" },
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
        <span className="text-[var(--hw-text-muted)]">Position Size Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-[var(--hw-text)] mb-2">
          Position Size Calculator
        </h1>
        <p className="text-sm text-[var(--hw-text-muted)] max-w-2xl">
          Calculate optimal position size for Hyperliquid trades based on your account balance, risk tolerance, and leverage. Never risk more than you can afford to lose.
        </p>
      </div>

      {/* Calculator */}
      <PositionSizeCalc />

      {/* SEO Content */}
      <div className="mt-12 space-y-10">
        {/* How Position Sizing Works */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            How Position Sizing Works
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              Position sizing is the process of determining how many units (or how much capital) to allocate to a single trade. It is arguably the most important aspect of risk management — more important than your entry signal, your indicator setup, or your market thesis.
            </p>
            <p>
              The core idea is simple: <strong className="text-[var(--hw-text)]">your position size should be determined by your risk tolerance, not your conviction level</strong>. Even the best trade setups can fail, and proper position sizing ensures that a single loss does not significantly damage your account.
            </p>
            <p>
              The calculation works backwards from your maximum acceptable loss. You decide how much you are willing to lose (the risk amount), determine where your stop loss will be (the stop distance), and then calculate the position size that limits your loss to exactly that amount.
            </p>
          </div>
        </section>

        {/* The 1% Rule */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            The 1% Rule
          </h2>
          <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
            <p>
              The 1% rule is a widely-used risk management guideline: <strong className="text-[var(--hw-text)]">never risk more than 1% of your total account balance on a single trade</strong>. For a $10,000 account, your maximum loss per trade should be $100.
            </p>
            <p>
              Why 1%? Because it protects you from ruin. Even with 10 consecutive losing trades (which happens more often than you think), you would only lose about 10% of your account. This leaves you with enough capital to recover. At 5% risk per trade, 10 losses would cost you nearly half your account.
            </p>
            <p>
              Professional traders often risk even less — 0.25% to 0.5% per trade. Aggressive day traders might push to 2%. Going above 3% per trade is generally considered reckless for any systematic approach.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Position Sizing FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What is position sizing in trading?",
                a: "Position sizing determines how much capital to allocate to a single trade. It is based on your account balance, the percentage you are willing to risk, and the distance to your stop loss. Proper sizing ensures no single trade can cause catastrophic losses.",
              },
              {
                q: "What is the 1% rule in trading?",
                a: "The 1% rule states that you should never risk more than 1% of your total account balance on a single trade. For a $10,000 account, your max loss per trade is $100. This protects against ruin during inevitable losing streaks.",
              },
              {
                q: "How does leverage affect position sizing on Hyperliquid?",
                a: "Leverage amplifies your exposure but does not change your risk amount. Your max loss stays the same regardless of leverage. However, leverage reduces the margin required, allowing you to control a larger position with less capital locked up. Always size based on risk, not leverage.",
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
              { href: "/tools/liquidation-calculator", label: "Liquidation Calculator" },
              { href: "/tools/pnl-calculator", label: "PnL Calculator" },
              { href: "/tools/fee-calculator", label: "Fee Calculator" },
              { href: "/learn/what-is-hyperliquid", label: "What is Hyperliquid?" },
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
