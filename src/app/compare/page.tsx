import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Hyperliquid Projects — LSTs, Lending, DEXs | perp.wiki",
  description:
    "Side-by-side comparisons of Hyperliquid ecosystem projects. Compare LSTs, lending protocols, DEXs, and yield strategies on HyperEVM.",
  alternates: { canonical: "https://perp.wiki/compare" },
};

interface ComparisonPair {
  slugA: string;
  slugB: string;
  nameA: string;
  nameB: string;
}

interface CompareCategory {
  title: string;
  description: string;
  pairs: ComparisonPair[];
}

const CATEGORIES: CompareCategory[] = [
  {
    title: "Liquid Staking (LSTs)",
    description: "Compare liquid staking solutions for HYPE — yields, liquidity, and integrations.",
    pairs: [
      { slugA: "kinetiq", slugB: "stakedhype", nameA: "Kinetiq", nameB: "StakedHYPE" },
      { slugA: "kinetiq", slugB: "hyperbeat", nameA: "Kinetiq", nameB: "HyperBeat" },
      { slugA: "stakedhype", slugB: "hyperbeat", nameA: "StakedHYPE", nameB: "HyperBeat" },
    ],
  },
  {
    title: "Lending Protocols",
    description: "Compare borrowing and lending platforms on Hyperliquid — rates, collateral, and risk.",
    pairs: [
      { slugA: "hyperlend", slugB: "felix-protocol", nameA: "HyperLend", nameB: "Felix Protocol" },
      { slugA: "hyperlend", slugB: "morpho", nameA: "HyperLend", nameB: "Morpho" },
    ],
  },
  {
    title: "DEXs & AMMs",
    description: "Compare decentralized exchanges and AMMs on HyperEVM — liquidity, fees, and trading features.",
    pairs: [
      { slugA: "hyperswap", slugB: "gliquid", nameA: "HyperSwap", nameB: "Gliquid" },
      { slugA: "hyperswap", slugB: "kittenswap", nameA: "HyperSwap", nameB: "KittenSwap" },
    ],
  },
];

export default function CompareHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Compare Hyperliquid Ecosystem Projects",
          url: "https://perp.wiki/compare",
          description: "Side-by-side comparisons of the top protocols across every DeFi category on HyperEVM.",
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Compare</span>
      </nav>

      {/* Header */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
        Compare Hyperliquid Ecosystem Projects
      </h1>
      <p className="text-base text-[var(--hw-text-muted)] mb-10 max-w-2xl">
        Side-by-side comparisons of the top protocols across every DeFi category on HyperEVM.
      </p>

      {/* Category sections */}
      <div className="space-y-10">
        {CATEGORIES.map((cat) => (
          <section key={cat.title}>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-1">
              {cat.title}
            </h2>
            <p className="text-sm text-[var(--hw-text-dim)] mb-4">{cat.description}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.pairs.map((pair) => (
                <Link
                  key={`${pair.slugA}-${pair.slugB}`}
                  href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                  className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
                  style={{ borderRadius: "4px" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                        {pair.nameA}
                      </span>
                      <span className="text-xs text-[var(--hw-text-dim)] shrink-0">vs</span>
                      <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                        {pair.nameB}
                      </span>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-12 border border-[var(--hw-border)] p-6 text-center"
        style={{
          borderRadius: "4px",
          background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
        }}
      >
        <p className="text-sm text-[var(--hw-text-muted)] mb-3">
          Don&apos;t see the comparison you need?
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
        >
          Browse All Projects
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
