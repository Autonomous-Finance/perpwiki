import { prisma } from "@/lib/prisma";
import { categoryToSlug } from "@/lib/categories";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { ProjectCard } from "@/components/ProjectCard";
import { LayerBadge } from "@/components/LayerBadge";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { name: true, tagline: true, slug: true, approvalStatus: true },
  });

  if (!project || project.approvalStatus !== "APPROVED") {
    return { title: "Not Found" };
  }

  return {
    title: `${project.name} on Hyperliquid — Overview, Features & Analysis`,
    description: `Everything you need to know about ${project.name} on Hyperliquid. ${project.tagline || ""}. Layer, category, features, and ecosystem context.`,
    alternates: {
      canonical: `${SITE_URL}/ecosystem/${project.slug}`,
    },
  };
}

/* Generate a contextual paragraph about why a category matters on Hyperliquid */
function getCategoryContext(category: string, projectName: string): string {
  const contexts: Record<string, string> = {
    "Liquid Staking":
      `Liquid staking is the cornerstone of Hyperliquid's DeFi ecosystem, enabling users to stake HYPE while keeping their capital productive. ${projectName} operates in this critical category, where protocols convert staked HYPE into liquid receipt tokens that can be used as collateral across lending markets, DEX liquidity pools, and yield vaults. On Hyperliquid, LSTs benefit from the L1's sub-second finality and unified state between HyperCore and HyperEVM.`,
    "Lending & Borrowing":
      `Lending and borrowing protocols are essential infrastructure on Hyperliquid, unlocking capital efficiency by allowing users to borrow against staked assets and perp positions. ${projectName} contributes to this category where protocols enable recursive yield strategies — stake HYPE, deposit LSTs as collateral, borrow stablecoins, and redeploy. The unified state between HyperCore and HyperEVM makes Hyperliquid lending uniquely capital-efficient.`,
    "Decentralized Exchanges":
      `Decentralized exchanges on Hyperliquid benefit from a structural advantage no other L1 offers: shared order book liquidity with HyperCore's native perp exchange. ${projectName} operates in this space where AMMs and swap protocols provide the spot liquidity that the rest of the ecosystem depends on — from LST trading to token launches and long-tail asset price discovery. Sub-second block times make the trading experience comparable to centralized exchanges.`,
    "Yield & Vaults":
      `Yield and vault protocols on Hyperliquid give users passive access to sophisticated DeFi strategies — from delta-neutral funding rate arbitrage to leveraged staking loops. ${projectName} is part of this growing category that keeps capital productive within the ecosystem. With HyperCore's native HLP vault and HyperEVM-based strategies, Hyperliquid offers yield options across the entire risk spectrum.`,
    "Trading Terminals & Interfaces":
      `Trading interfaces on Hyperliquid enhance the native perp trading experience by adding advanced charting, analytics, and execution tools. ${projectName} serves this category where platforms connect to HyperCore's open API to provide professional-grade trading environments. The combination of HyperCore's sub-200ms latency and these purpose-built interfaces makes Hyperliquid competitive with centralized exchanges for active traders.`,
    "Trading Bots & Automation":
      `Automated trading on Hyperliquid is uniquely powerful thanks to HyperCore's low-latency order book and open API infrastructure. ${projectName} operates in this space where bots and automation tools execute strategies ranging from copy-trading and grid trading to sophisticated algorithmic execution. Hyperliquid's deterministic ordering and minimal gas costs make it one of the best chains for automated trading.`,
    "Analytics & Data":
      `Analytics and data platforms are crucial for understanding the Hyperliquid ecosystem — from tracking whale movements and funding rate trends to monitoring protocol TVL. ${projectName} contributes to this category that helps traders make informed decisions. With HyperCore's transparent on-chain order book and HyperEVM's growing DeFi activity, there is rich data to analyze across the entire Hyperliquid stack.`,
    "Bridges & Cross-Chain":
      `Bridge and cross-chain infrastructure connects Hyperliquid to the broader crypto ecosystem, enabling asset transfers between chains. ${projectName} operates in this critical category that facilitates capital inflows from Ethereum, Arbitrum, and other networks. As Hyperliquid's DeFi ecosystem grows, efficient bridging infrastructure becomes essential for attracting liquidity and users from other chains.`,
    "Oracles":
      `Oracle infrastructure provides the price feeds and off-chain data that Hyperliquid DeFi protocols depend on for accurate valuations, liquidations, and settlements. ${projectName} is part of this foundational category — without reliable oracles, lending protocols cannot safely liquidate positions, and yield vaults cannot accurately value their holdings. On Hyperliquid, oracle integration benefits from the L1's high throughput and low latency.`,
    "Prediction Markets":
      `Prediction markets on Hyperliquid leverage HIP-3's permissionless perpetual futures infrastructure to create markets on real-world events and outcomes. ${projectName} operates in this category where traders can take positions on everything from elections to crypto market events. Hyperliquid's native order book infrastructure provides deep liquidity and instant settlement for these markets.`,
    "NFTs & Collectibles":
      `The NFT ecosystem on Hyperliquid is emerging as a cultural layer for the community, with collections and collectibles that represent identity and status within the ecosystem. ${projectName} is part of this growing category that adds a social and cultural dimension to Hyperliquid beyond pure DeFi utility.`,
    "Communities & DAOs":
      `Community and DAO projects on Hyperliquid foster coordination and governance within the ecosystem. ${projectName} is part of this social layer that helps organize the rapidly growing Hyperliquid community, facilitating everything from governance proposals to collaborative ecosystem building.`,
    "Portfolio Trackers":
      `Portfolio tracking tools on Hyperliquid help users monitor their positions across HyperCore perps, HyperEVM DeFi, and staked assets in one place. ${projectName} serves this category where platforms aggregate data from multiple sources to give users a comprehensive view of their Hyperliquid exposure, P&L, and portfolio allocation.`,
    "Wallets & Account Abstraction":
      `Wallet infrastructure on Hyperliquid makes it easier for users to interact with both HyperCore and HyperEVM through improved key management, account abstraction, and transaction signing. ${projectName} operates in this category that reduces friction for new users while adding security features for experienced DeFi participants.`,
    "SDKs & Developer Tools":
      `Developer tools and SDKs accelerate building on Hyperliquid by providing libraries, APIs, and frameworks for interacting with HyperCore and HyperEVM. ${projectName} is part of this infrastructure category that lowers the barrier to entry for developers and enables faster protocol development across the ecosystem.`,
    "Security & Audits":
      `Security infrastructure on Hyperliquid protects users and protocols through smart contract auditing, monitoring, and risk assessment. ${projectName} operates in this critical category that builds trust and safety across the HyperEVM DeFi stack — essential as TVL grows and protocols become more composable.`,
    "Data APIs":
      `Data API providers on Hyperliquid give developers and traders programmatic access to market data, on-chain activity, and protocol metrics. ${projectName} is part of this infrastructure category that powers dashboards, bots, analytics platforms, and integrations across the ecosystem.`,
    "Media & Education":
      `Media and education projects on Hyperliquid help onboard new users and keep the community informed about ecosystem developments. ${projectName} contributes to this category that translates complex DeFi mechanics into accessible content, covering everything from staking guides to protocol deep-dives.`,
    "Airdrop Trackers":
      `Airdrop tracking tools on Hyperliquid help users monitor their eligibility and activity for potential token distributions across the ecosystem. ${projectName} serves this category where platforms aggregate on-chain data to estimate airdrop positions and track qualifying activity across HyperCore and HyperEVM protocols.`,
    "RWA Perps":
      `Real-world asset perpetual futures on Hyperliquid use HIP-3 infrastructure to create on-chain markets for commodities, indices, and other traditional assets. ${projectName} operates in this category where traders can access non-crypto exposure through Hyperliquid's native order book with the same sub-second settlement and deep liquidity as crypto perps.`,
    "Event Contracts":
      `Event contracts on Hyperliquid create tradable markets around specific occurrences and outcomes, leveraging HIP-3's permissionless market creation. ${projectName} is part of this category where traders can express views on binary or range-bound events with the efficiency of Hyperliquid's native infrastructure.`,
    "Meme Perps":
      `Meme perpetual futures on Hyperliquid use HIP-3 to create leveraged markets for meme tokens and community-driven assets. ${projectName} operates in this category where traders can access high-volatility meme exposure through Hyperliquid's performant order book infrastructure.`,
  };

  return (
    contexts[category] ||
    `${projectName} is building on Hyperliquid, one of the fastest-growing DeFi ecosystems with a unique dual-layer architecture. HyperCore provides a native on-chain order book for perpetual futures, while HyperEVM enables the full range of DeFi smart contracts. This combination of high-performance trading infrastructure and EVM composability makes Hyperliquid an ideal home for protocols like ${projectName}.`
  );
}

export default async function EcosystemProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { dossier: true },
  });

  if (!project || project.approvalStatus !== "APPROVED") notFound();

  // Get related projects in same category
  const relatedProjects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      category: project.category,
      slug: { not: project.slug },
    },
    select: {
      slug: true,
      name: true,
      tagline: true,
      layer: true,
      category: true,
      status: true,
      isVerified: true,
      logoUrl: true,
    },
    take: 4,
    orderBy: { isFeatured: "desc" },
  });

  // Extract first 2-3 sentences from description for "What is" section
  const description = project.description || "";
  const sentences = description.match(/[^.!?]+[.!?]+/g) || [];
  const whatIs = sentences.slice(0, 3).join(" ").trim();

  // Build comparison pairs with same-category projects
  const comparePairs = relatedProjects.map((rp) => ({
    slug: `${project.slug}-vs-${rp.slug}`,
    name: rp.name,
  }));

  // Parse dossier if available
  let dossierData: Record<string, unknown> | null = null;
  if (project.dossier?.dossierJson) {
    try {
      dossierData = JSON.parse(project.dossier.dossierJson);
    } catch {
      // ignore parse errors
    }
  }

  const categorySlug = categoryToSlug(project.category);

  // Quick facts
  const quickFacts = [
    { label: "Category", value: project.category, href: `/category/${categorySlug}` },
    { label: "Layer", value: project.layer },
    { label: "Status", value: project.status },
    { label: "Website", value: project.website, isLink: true },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* JSON-LD: SoftwareApplication */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.name,
          url: project.website || `${SITE_URL}/ecosystem/${project.slug}`,
          description: project.tagline || whatIs || project.description || "",
          applicationCategory: project.category,
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          ...(project.twitter
            ? {
                sameAs: [
                  `https://twitter.com/${project.twitter.replace("@", "")}`,
                  ...(project.github ? [project.github] : []),
                ],
              }
            : {}),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Ecosystem", href: `${SITE_URL}/ecosystem` },
          { name: project.name, href: `${SITE_URL}/ecosystem/${project.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Ecosystem</span>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{project.name}</span>
      </nav>

      {/* Hero */}
      <div
        className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-8 sm:p-10 mb-8 overflow-hidden"
        style={{ borderRadius: "4px" }}
      >
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt={`${project.name} logo`}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[var(--hw-bg)]"
                style={{ background: "var(--hw-text-dim)" }}
              >
                {project.name.charAt(0)}
              </span>
            )}
            <div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)]">
                {project.name}
              </h1>
              <p className="text-base text-[var(--hw-text-muted)] mt-1">on Hyperliquid</p>
            </div>
          </div>
          {project.tagline && (
            <p className="text-lg text-[var(--hw-text-muted)] max-w-2xl">{project.tagline}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <LayerBadge layer={project.layer} />
            <Link
              href={`/category/${categorySlug}`}
              className="bg-[var(--hw-green-subtle)] px-2 py-0.5 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors"
              style={{ borderRadius: "2px" }}
            >
              {project.category}
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Facts Grid */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          Quick Facts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <p className="text-xs text-[var(--hw-text-dim)] mb-1">{fact.label}</p>
              {fact.href ? (
                <Link
                  href={fact.href}
                  className="text-sm font-medium text-[var(--hw-green)] hover:underline"
                >
                  {fact.value || "—"}
                </Link>
              ) : fact.isLink && fact.value ? (
                <a
                  href={fact.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--hw-green)] hover:underline truncate block"
                >
                  {fact.value.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              ) : (
                <p className="text-sm font-medium text-[var(--hw-text)]">
                  {fact.value || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* What is {name}? */}
      {whatIs && (
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-3">
            What is {project.name}?
          </h2>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
            style={{ borderRadius: "4px" }}
          >
            <p className="text-sm leading-relaxed text-[var(--hw-text-muted)]">{whatIs}</p>
          </div>
        </section>
      )}

      {/* Why {name} on Hyperliquid? */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-3">
          Why {project.name} on Hyperliquid?
        </h2>
        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
          style={{ borderRadius: "4px" }}
        >
          <p className="text-sm leading-relaxed text-[var(--hw-text-muted)]">
            {getCategoryContext(project.category, project.name)}
          </p>
        </div>
      </section>

      {/* Comparison links */}
      {comparePairs.length > 0 && (
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Compare {project.name} with
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {comparePairs.map((cp) => (
              <Link
                key={cp.slug}
                href={`/compare/${cp.slug}`}
                className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                      {project.name}
                    </span>
                    <span className="text-xs text-[var(--hw-text-dim)] shrink-0">vs</span>
                    <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                      {cp.name}
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
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
              Related {project.category} Projects
            </h2>
            <Link
              href={`/category/${categorySlug}`}
              className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)] transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedProjects.map((rp) => (
              <ProjectCard key={rp.slug} {...rp} />
            ))}
          </div>
        </section>
      )}

      {/* CTA to full profile */}
      <div
        className="border border-[var(--hw-border)] p-6 text-center"
        style={{
          borderRadius: "4px",
          background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
        }}
      >
        <p className="text-sm text-[var(--hw-text-muted)] mb-3">
          Want the full breakdown of {project.name}?
        </p>
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
        >
          View full profile
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
