import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyperliquid Trading Tools — Calculators & Estimators",
  description:
    "Free trading calculators for Hyperliquid — estimate liquidation prices, calculate trading fees, and optimize your perpetual futures strategy.",
  alternates: { canonical: "https://perp.wiki/tools" },
  openGraph: {
    title: "Hyperliquid Trading Tools — Calculators & Estimators",
    description:
      "Free trading calculators for Hyperliquid — estimate liquidation prices, calculate trading fees, and optimize your perpetual futures strategy.",
    url: "https://perp.wiki/tools",
    siteName: "perp.wiki",
    images: [{ url: "/tools/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Trading Tools — Calculators & Estimators",
    description:
      "Free trading calculators for Hyperliquid — estimate liquidation prices, calculate trading fees, and optimize your perpetual futures strategy.",
    images: ["/tools/opengraph-image"],
  },
};

const TOOLS = [
  {
    href: "/tools/liquidation-calculator",
    title: "Liquidation Calculator",
    description:
      "Estimate your liquidation price based on entry price, leverage, and margin. Avoid unexpected liquidations on Hyperliquid perps.",
    icon: (
      <svg className="w-8 h-8 text-[var(--hw-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    href: "/tools/fee-calculator",
    title: "Fee Calculator",
    description:
      "Calculate your Hyperliquid trading fees for perps and spot. Compare maker vs taker costs and see how fees stack up against Binance.",
    icon: (
      <svg className="w-8 h-8 text-[var(--hw-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    href: "/tools/position-size-calculator",
    title: "Position Size Calculator",
    description:
      "Determine optimal position sizing based on your risk tolerance, account balance, and stop loss distance.",
    icon: (
      <svg className="w-8 h-8 text-[var(--hw-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
      </svg>
    ),
  },
  {
    href: "/tools/pnl-calculator",
    title: "PnL Calculator",
    description:
      "Estimate profit and loss for Hyperliquid perpetual trades. Calculate PnL, ROE, and fees before entering a position.",
    icon: (
      <svg className="w-8 h-8 text-[var(--hw-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    href: "/tools/funding-arbitrage-calculator",
    title: "Funding Arbitrage Calculator",
    description:
      "Calculate potential yield from funding rate arbitrage strategies. Estimate APR from delta-neutral positions on Hyperliquid.",
    icon: (
      <svg className="w-8 h-8 text-[var(--hw-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
];

const COMING_SOON = [
  { title: "Volatility Tracker", description: "Track historical and implied volatility across Hyperliquid markets to identify trading opportunities." },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Hyperliquid Trading Tools",
          url: "https://perp.wiki/tools",
          description: "Free trading calculators and estimators for Hyperliquid perpetual futures traders.",
        }}
      />
      <BreadcrumbSchema
        items={[{ name: "Tools", href: "https://perp.wiki/tools" }]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Tools</span>
      </nav>

      {/* Hero */}
      <div
        className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-8 sm:p-10 mb-10 overflow-hidden"
        style={{ borderRadius: "4px" }}
      >
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)" }}
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
            Trading Tools
          </h1>
          <p className="text-base text-[var(--hw-text-muted)] max-w-2xl">
            Free calculators and estimators to help you trade smarter on Hyperliquid. Estimate liquidation prices, calculate fees, and manage risk.
          </p>
        </div>
      </div>

      {/* Tool Cards */}
      <section className="mb-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6 transition-all hover:border-[var(--hw-green-dim)]"
              style={{ borderRadius: "4px" }}
            >
              <div className="mb-4">{tool.icon}</div>
              <div className="text-base font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors mb-2 font-[family-name:var(--font-space-grotesk)]">
                {tool.title}
              </div>
              <div className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                {tool.description}
              </div>
              <div className="mt-4 text-xs font-medium text-[var(--hw-green)] opacity-0 group-hover:opacity-100 transition-opacity">
                Open tool &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          More Tools Coming Soon
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMING_SOON.map((tool) => (
            <div
              key={tool.title}
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 opacity-60"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-sm font-medium text-[var(--hw-text)] mb-1">{tool.title}</div>
              <div className="text-xs text-[var(--hw-text-dim)]">{tool.description}</div>
              <div className="mt-3 text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)]">Coming soon</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="border border-[var(--hw-border)] p-6 text-center"
        style={{
          borderRadius: "4px",
          background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
        }}
      >
        <p className="text-sm font-medium text-[var(--hw-text)] mb-3">Explore the Hyperliquid ecosystem</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
            style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
          >
            View Markets
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
            style={{ borderRadius: "4px" }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
