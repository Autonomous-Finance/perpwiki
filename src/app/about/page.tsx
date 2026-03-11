import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About perp.wiki — The Hyperliquid Ecosystem Directory",
  description:
    "perp.wiki is the definitive directory of Hyperliquid ecosystem projects — DEXs, LSTs, lending protocols, yield vaults, and DeFi infrastructure on HyperEVM and HyperCore.",
  alternates: { canonical: "https://perp.wiki/about" },
  openGraph: {
    title: "About perp.wiki — The Hyperliquid Ecosystem Directory",
    description:
      "The definitive directory of Hyperliquid ecosystem projects — DEXs, LSTs, lending protocols, yield vaults, and DeFi infrastructure on HyperEVM and HyperCore.",
    url: "https://perp.wiki/about",
    siteName: "perp.wiki",
    images: [{ url: "/about/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "About perp.wiki — The Hyperliquid Ecosystem Directory",
    description:
      "The definitive directory of Hyperliquid ecosystem projects — DEXs, LSTs, lending protocols, yield vaults, and DeFi infrastructure on HyperEVM and HyperCore.",
    images: ["/about/opengraph-image"],
  },
};

const NAV_LINKS = [
  { href: "/markets", label: "Markets", desc: "Live perpetuals market data across all Hyperliquid pairs" },
  { href: "/funding-rates", label: "Funding Rates", desc: "Real-time funding rates and APR across all markets" },
  { href: "/stats", label: "Stats", desc: "Ecosystem statistics — TVL, volume, and open interest" },
  { href: "/trending", label: "Trending", desc: "Trending HyperEVM projects by community interest" },
  { href: "/learn", label: "Learn", desc: "Guides and tutorials for the Hyperliquid ecosystem" },
];

const ECO_SECTIONS = [
  {
    title: "Liquid Staking (LSTs)",
    desc: "Stake HYPE and earn yield while staying liquid.",
    projects: ["Kinetiq", "StakedHYPE", "HyperBeat"],
  },
  {
    title: "Lending",
    desc: "Borrow and lend against Hyperliquid assets.",
    projects: ["HyperLend", "Felix Protocol", "Morpho"],
  },
  {
    title: "DEXs",
    desc: "Swap tokens on HyperEVM AMMs.",
    projects: ["HyperSwap", "KittenSwap", "Gliquid"],
  },
  {
    title: "Yield",
    desc: "Delta-neutral strategies and vault yield.",
    projects: ["HLP", "Resolv", "HyperBeat"],
  },
];

export default async function AboutPage() {
  const projectCount = await prisma.project.count({
    where: { approvalStatus: "APPROVED" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About perp.wiki",
          url: "https://perp.wiki/about",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "About", href: "https://perp.wiki/about" },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">About</span>
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
            The Hyperliquid Ecosystem Directory
          </h1>
          <p className="text-base text-[var(--hw-text-muted)] max-w-2xl mb-6">
            Every DEX, lending protocol, LST, yield vault, and DeFi app building on HyperEVM and HyperCore — tracked and researched.
          </p>
          <div className="flex flex-wrap gap-3">
            {[`${projectCount}+ Projects`, "Live Market Data", "Updated Daily"].map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 text-xs font-medium text-[var(--hw-green)]"
                style={{ borderRadius: "2px", background: "var(--hw-green-subtle)", border: "1px solid rgba(0,229,160,0.2)" }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What is perp.wiki */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          What is perp.wiki?
        </h2>
        <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
          <p>
            perp.wiki is the go-to resource for navigating the Hyperliquid DeFi ecosystem. Hyperliquid runs the
            world&apos;s highest-volume on-chain perpetuals exchange ($6B+ TVL, 80%+ of on-chain perp volume) and its
            HyperEVM layer is rapidly becoming a major DeFi destination.
          </p>
          <p>
            perp.wiki tracks every protocol, vault, LST, and tool built on top — with live market data, funding rates,
            and deep project dossiers.
          </p>
        </div>
      </section>

      {/* What we cover */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          What We Cover
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors mb-1">
                {link.label}
              </div>
              <div className="text-xs text-[var(--hw-text-dim)]">{link.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Key Ecosystem Sections */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          Key Ecosystem Sectors
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ECO_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-sm font-medium text-[var(--hw-text)] mb-1">{section.title}</div>
              <div className="text-xs text-[var(--hw-text-dim)] mb-2">{section.desc}</div>
              <div className="flex flex-wrap gap-1.5">
                {section.projects.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 text-[10px] text-[var(--hw-text-muted)]"
                    style={{ borderRadius: "2px", background: "var(--hw-bg)", border: "1px solid var(--hw-border)" }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="border border-[var(--hw-border)] p-6 text-center mb-10"
        style={{
          borderRadius: "4px",
          background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
        }}
      >
        <p className="text-sm font-medium text-[var(--hw-text)] mb-3">Start exploring the ecosystem</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
            style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
          >
            Browse Projects
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
            style={{ borderRadius: "4px" }}
          >
            Compare Projects
          </Link>
        </div>
      </div>

      {/* Network */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          Part of the Network
        </h2>
        <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] space-y-3">
          <p>
            perp.wiki is part of a broader network of independent directories covering the decentralized finance landscape.
            Our sister sites include{" "}
            <a href="https://pm.wiki" target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline">
              pm.wiki
            </a>{" "}
            (the prediction market directory),{" "}
            <a href="https://canton.wiki" target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline">
              canton.wiki
            </a>{" "}
            (Canton Network intelligence), and{" "}
            <a href="https://polyguana.com" target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline">
              polyguana.com
            </a>{" "}
            (market analytics).
          </p>
        </div>
      </section>

      {/* Footer note */}
      <p className="text-xs text-[var(--hw-text-dim)] text-center">
        perp.wiki is independently operated. Not affiliated with Hyperliquid Labs.
      </p>
    </div>
  );
}
