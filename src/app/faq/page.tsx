import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Hyperliquid FAQ — Common Questions Answered | perp.wiki",
  description:
    "Answers to the most common questions about Hyperliquid, HyperEVM, HYPE staking, funding rates, and the DeFi ecosystem.",
  alternates: { canonical: "https://perp.wiki/faq" },
};

type FaqItem = {
  question: string;
  answer: string;
  answerJsx: React.ReactNode;
};

type FaqSection = {
  id: string;
  title: string;
  items: FaqItem[];
};

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        question: "What is Hyperliquid?",
        answer:
          "Hyperliquid is the world's largest on-chain perpetual futures exchange, processing over $6B in daily volume. It runs on its own L1 blockchain with sub-second finality and offers 170+ trading pairs with up to 50x leverage. Unlike CEXs, all trades settle on-chain with full transparency.",
        answerJsx: (
          <p>
            Hyperliquid is the world&apos;s largest on-chain perpetual futures
            exchange, processing over $6B in daily volume. It runs on its own L1
            blockchain with sub-second finality and offers 170+ trading pairs
            with up to 50x leverage. Unlike CEXs, all trades settle on-chain
            with full transparency. See{" "}
            <Link href="/markets" className="text-[var(--hw-green)] hover:underline">
              live market data
            </Link>{" "}
            and{" "}
            <Link href="/stats" className="text-[var(--hw-green)] hover:underline">
              ecosystem stats
            </Link>
            .
          </p>
        ),
      },
      {
        question: "How do I start trading on Hyperliquid?",
        answer:
          "Deposit USDC via the Arbitrum bridge at app.hyperliquid.xyz. Minimum deposit is 5 USDC. You can also use third-party bridges like Across Protocol or deBridge for faster transfers from other chains. New users can start with the email wallet feature for simplified onboarding.",
        answerJsx: (
          <p>
            Deposit USDC via the Arbitrum bridge at app.hyperliquid.xyz. Minimum
            deposit is 5 USDC. You can also use third-party bridges like Across
            Protocol or deBridge for faster transfers from other chains. New
            users can start with the email wallet feature for simplified
            onboarding. Check our{" "}
            <Link href="/learn" className="text-[var(--hw-green)] hover:underline">
              learn hub
            </Link>{" "}
            for detailed guides.
          </p>
        ),
      },
      {
        question: "What is HyperEVM?",
        answer:
          "HyperEVM is Hyperliquid's EVM-compatible execution layer that runs alongside HyperCore (the order book engine). It enables DeFi protocols like lending (HyperLend, Felix), DEXs (HyperSwap, KittenSwap), and liquid staking (Kinetiq, StakedHYPE) to build on top of Hyperliquid's liquidity.",
        answerJsx: (
          <p>
            HyperEVM is Hyperliquid&apos;s EVM-compatible execution layer that
            runs alongside HyperCore (the order book engine). It enables DeFi
            protocols like lending (
            <Link href="/projects/hyperlend" className="text-[var(--hw-green)] hover:underline">
              HyperLend
            </Link>
            ,{" "}
            <Link href="/projects/felix-protocol" className="text-[var(--hw-green)] hover:underline">
              Felix
            </Link>
            ), DEXs (
            <Link href="/projects/hyperswap" className="text-[var(--hw-green)] hover:underline">
              HyperSwap
            </Link>
            ,{" "}
            <Link href="/projects/kittenswap" className="text-[var(--hw-green)] hover:underline">
              KittenSwap
            </Link>
            ), and liquid staking (
            <Link href="/projects/kinetiq" className="text-[var(--hw-green)] hover:underline">
              Kinetiq
            </Link>
            ,{" "}
            <Link href="/projects/stakedhype" className="text-[var(--hw-green)] hover:underline">
              StakedHYPE
            </Link>
            ) to build on top of Hyperliquid&apos;s liquidity.
          </p>
        ),
      },
      {
        question: "What are the fees on Hyperliquid?",
        answer:
          "Perpetual trading fees are 0.025% for makers and 0.050% for takers. Spot trading fees vary. There are no gas fees for perp trading on HyperCore — gas is only needed for HyperEVM transactions. Withdrawals cost 1 USDC.",
        answerJsx: (
          <p>
            Perpetual trading fees are 0.025% for makers and 0.050% for takers.
            Spot trading fees vary. There are no gas fees for perp trading on
            HyperCore — gas is only needed for HyperEVM transactions.
            Withdrawals cost 1 USDC. View current fees and rates on our{" "}
            <Link href="/funding-rates" className="text-[var(--hw-green)] hover:underline">
              funding rates
            </Link>{" "}
            page.
          </p>
        ),
      },
    ],
  },
  {
    id: "staking-yield",
    title: "Staking & Yield",
    items: [
      {
        question: "How do I stake HYPE?",
        answer:
          "You can stake HYPE natively through the Hyperliquid app (select a validator, ~2.25% APY, 7-day unstaking period) or use liquid staking protocols like Kinetiq (kHYPE), StakedHYPE (stHYPE), or HyperBeat (beHYPE) to earn staking yield while keeping your tokens liquid for DeFi.",
        answerJsx: (
          <p>
            You can stake HYPE natively through the Hyperliquid app (select a
            validator, ~2.25% APY, 7-day unstaking period) or use liquid staking
            protocols like{" "}
            <Link href="/projects/kinetiq" className="text-[var(--hw-green)] hover:underline">
              Kinetiq (kHYPE)
            </Link>
            ,{" "}
            <Link href="/projects/stakedhype" className="text-[var(--hw-green)] hover:underline">
              StakedHYPE (stHYPE)
            </Link>
            , or{" "}
            <Link href="/projects/hyperbeat" className="text-[var(--hw-green)] hover:underline">
              HyperBeat (beHYPE)
            </Link>{" "}
            to earn staking yield while keeping your tokens liquid for DeFi.
          </p>
        ),
      },
      {
        question: "What is the HLP vault?",
        answer:
          "HLP (Hyperliquid Liquidity Provider) is the protocol's market-making vault. Users deposit USDC and earn yield from market-making profits across all trading pairs. Historical APY has ranged from 10-17% with occasional spikes during high-volatility events. It requires no active management.",
        answerJsx: (
          <p>
            <Link href="/projects/hlp" className="text-[var(--hw-green)] hover:underline">
              HLP
            </Link>{" "}
            (Hyperliquid Liquidity Provider) is the protocol&apos;s
            market-making vault. Users deposit USDC and earn yield from
            market-making profits across all trading pairs. Historical APY has
            ranged from 10-17% with occasional spikes during high-volatility
            events. It requires no active management.
          </p>
        ),
      },
      {
        question: "What are the best yield opportunities on Hyperliquid?",
        answer:
          "Key yield sources include: HLP vault (10-17% APY), liquid staking via Kinetiq/StakedHYPE (~2-4% + DeFi composability), lending on HyperLend or Morpho, Felix Protocol feUSD minting, and delta-neutral funding rate strategies via protocols like Liminal.",
        answerJsx: (
          <p>
            Key yield sources include:{" "}
            <Link href="/projects/hlp" className="text-[var(--hw-green)] hover:underline">
              HLP vault
            </Link>{" "}
            (10-17% APY), liquid staking via{" "}
            <Link href="/projects/kinetiq" className="text-[var(--hw-green)] hover:underline">
              Kinetiq
            </Link>
            /
            <Link href="/projects/stakedhype" className="text-[var(--hw-green)] hover:underline">
              StakedHYPE
            </Link>{" "}
            (~2-4% + DeFi composability), lending on{" "}
            <Link href="/projects/hyperlend" className="text-[var(--hw-green)] hover:underline">
              HyperLend
            </Link>{" "}
            or Morpho,{" "}
            <Link href="/projects/felix-protocol" className="text-[var(--hw-green)] hover:underline">
              Felix Protocol
            </Link>{" "}
            feUSD minting, and delta-neutral{" "}
            <Link href="/funding-rates" className="text-[var(--hw-green)] hover:underline">
              funding rate
            </Link>{" "}
            strategies.
          </p>
        ),
      },
      {
        question: "What is liquid staking on Hyperliquid?",
        answer:
          "Liquid staking lets you stake HYPE while receiving a liquid token (kHYPE, stHYPE, beHYPE) that represents your staked position. You can use these tokens in DeFi (lending, LPing) while still earning staking rewards. Kinetiq (kHYPE) is the largest with ~$1.7B TVL.",
        answerJsx: (
          <p>
            Liquid staking lets you stake HYPE while receiving a liquid token
            (kHYPE, stHYPE, beHYPE) that represents your staked position. You
            can use these tokens in DeFi (lending, LPing) while still earning
            staking rewards.{" "}
            <Link href="/projects/kinetiq" className="text-[var(--hw-green)] hover:underline">
              Kinetiq (kHYPE)
            </Link>{" "}
            is the largest with ~$1.7B TVL.
          </p>
        ),
      },
    ],
  },
  {
    id: "trading",
    title: "Trading",
    items: [
      {
        question: "What are funding rates?",
        answer:
          "Funding rates are periodic payments between long and short traders that keep perpetual futures prices aligned with spot prices. On Hyperliquid, funding is settled hourly. When the rate is positive, longs pay shorts; when negative, shorts pay longs. The rate is capped at 4% per hour.",
        answerJsx: (
          <p>
            Funding rates are periodic payments between long and short traders
            that keep perpetual futures prices aligned with spot prices. On
            Hyperliquid, funding is settled hourly. When the rate is positive,
            longs pay shorts; when negative, shorts pay longs. The rate is
            capped at 4% per hour. Track rates in real time on our{" "}
            <Link href="/funding-rates" className="text-[var(--hw-green)] hover:underline">
              funding rates dashboard
            </Link>
            .
          </p>
        ),
      },
      {
        question: "What is the maximum leverage on Hyperliquid?",
        answer:
          "Maximum leverage varies by asset — major pairs like BTC and ETH support up to 50x leverage. Smaller-cap assets may have lower limits (20x or less). Leverage is adjusted based on position size and asset liquidity.",
        answerJsx: (
          <p>
            Maximum leverage varies by asset — major pairs like BTC and ETH
            support up to 50x leverage. Smaller-cap assets may have lower limits
            (20x or less). Leverage is adjusted based on position size and asset
            liquidity. Browse all pairs on the{" "}
            <Link href="/markets" className="text-[var(--hw-green)] hover:underline">
              markets page
            </Link>
            .
          </p>
        ),
      },
      {
        question: "How does cross-margin work on Hyperliquid?",
        answer:
          "Cross-margin uses your entire account balance as collateral across all positions. This reduces liquidation risk but means a large loss on one position can affect others. Isolated margin, by contrast, limits risk to the margin allocated to each individual position.",
        answerJsx: (
          <p>
            Cross-margin uses your entire account balance as collateral across
            all positions. This reduces liquidation risk but means a large loss
            on one position can affect others. Isolated margin, by contrast,
            limits risk to the margin allocated to each individual position.
            Learn more in our{" "}
            <Link href="/learn" className="text-[var(--hw-green)] hover:underline">
              guides
            </Link>
            .
          </p>
        ),
      },
      {
        question: "What is a liquidation on Hyperliquid?",
        answer:
          "Liquidation occurs when your position's margin falls below the maintenance margin requirement. The protocol's backstop liquidator takes over the position. Using lower leverage and cross-margin reduces liquidation risk. The HLP vault absorbs some liquidation risk as a backstop.",
        answerJsx: (
          <p>
            Liquidation occurs when your position&apos;s margin falls below the
            maintenance margin requirement. The protocol&apos;s backstop
            liquidator takes over the position. Using lower leverage and
            cross-margin reduces liquidation risk. The{" "}
            <Link href="/projects/hlp" className="text-[var(--hw-green)] hover:underline">
              HLP vault
            </Link>{" "}
            absorbs some liquidation risk as a backstop.
          </p>
        ),
      },
    ],
  },
  {
    id: "ecosystem",
    title: "Ecosystem",
    items: [
      {
        question: "What is HyperCore vs HyperEVM?",
        answer:
          "HyperCore is Hyperliquid's native execution layer optimized for the order book and perp trading — it's fast and gas-free. HyperEVM is the Ethereum-compatible layer that runs smart contracts for DeFi protocols. Both layers share the same state, so HyperEVM apps can interact with HyperCore liquidity.",
        answerJsx: (
          <p>
            HyperCore is Hyperliquid&apos;s native execution layer optimized for
            the order book and perp trading — it&apos;s fast and gas-free.
            HyperEVM is the Ethereum-compatible layer that runs smart contracts
            for DeFi protocols. Both layers share the same state, so HyperEVM
            apps can interact with HyperCore liquidity. Explore projects by
            layer:{" "}
            <Link href="/layer/hypercore" className="text-[var(--hw-green)] hover:underline">
              HyperCore
            </Link>
            ,{" "}
            <Link href="/layer/hyperevm" className="text-[var(--hw-green)] hover:underline">
              HyperEVM
            </Link>
            .
          </p>
        ),
      },
      {
        question: "How many projects are in the Hyperliquid ecosystem?",
        answer:
          "The ecosystem includes 170+ projects spanning DEXs, lending protocols, liquid staking, yield vaults, bridges, analytics tools, trading bots, and NFT platforms. perp.wiki tracks and profiles the major protocols with detailed dossiers and live market data.",
        answerJsx: (
          <p>
            The ecosystem includes 170+ projects spanning DEXs, lending
            protocols, liquid staking, yield vaults, bridges, analytics tools,
            trading bots, and NFT platforms.{" "}
            <Link href="/projects" className="text-[var(--hw-green)] hover:underline">
              perp.wiki tracks and profiles
            </Link>{" "}
            the major protocols with detailed dossiers and live market data.
          </p>
        ),
      },
      {
        question: "What is HIP-1?",
        answer:
          "HIP-1 (Hyperliquid Improvement Proposal 1) is the token standard on Hyperliquid, similar to ERC-20 on Ethereum. HIP-1 tokens are native to HyperCore and can be traded on Hyperliquid's spot order book with the same speed and efficiency as the perp exchange.",
        answerJsx: (
          <p>
            HIP-1 (Hyperliquid Improvement Proposal 1) is the token standard on
            Hyperliquid, similar to ERC-20 on Ethereum. HIP-1 tokens are native
            to HyperCore and can be traded on Hyperliquid&apos;s spot order book
            with the same speed and efficiency as the perp exchange. See{" "}
            <Link href="/layer/hip3" className="text-[var(--hw-green)] hover:underline">
              HIP-3 projects
            </Link>{" "}
            for tokens using automated liquidity.
          </p>
        ),
      },
      {
        question: "What is HIP-3?",
        answer:
          "HIP-3 enables automated liquidity for HIP-1 tokens through a protocol-level market-making mechanism. Instead of requiring external market makers, HIP-3 provides constant liquidity with deterministic pricing, making it easier for new tokens to have deep order books from launch.",
        answerJsx: (
          <p>
            HIP-3 enables automated liquidity for HIP-1 tokens through a
            protocol-level market-making mechanism. Instead of requiring external
            market makers, HIP-3 provides constant liquidity with deterministic
            pricing, making it easier for new tokens to have deep order books
            from launch. Browse{" "}
            <Link href="/layer/hip3" className="text-[var(--hw-green)] hover:underline">
              HIP-3 tokens
            </Link>
            .
          </p>
        ),
      },
    ],
  },
  {
    id: "security-risks",
    title: "Security & Risks",
    items: [
      {
        question: "Is Hyperliquid decentralized?",
        answer:
          "Hyperliquid operates a proof-of-stake consensus with validators, but the Hyper Foundation currently controls ~81% of staked HYPE. Node software is closed-source. The protocol is progressively decentralizing, but it's important to understand the current centralization tradeoffs.",
        answerJsx: (
          <p>
            Hyperliquid operates a proof-of-stake consensus with validators, but
            the Hyper Foundation currently controls ~81% of staked HYPE. Node
            software is closed-source. The protocol is progressively
            decentralizing, but it&apos;s important to understand the current
            centralization tradeoffs.
          </p>
        ),
      },
      {
        question: "What happened with the JellyJelly incident?",
        answer:
          "In March 2025, a trader attempted to exploit Hyperliquid's liquidation mechanism using the JELLYJELLY token, potentially exposing the HLP vault to $12M+ in losses. The Hyperliquid team intervened by delisting the token and settling positions. This raised concerns about centralized intervention but also demonstrated the team's ability to protect user funds.",
        answerJsx: (
          <p>
            In March 2025, a trader attempted to exploit Hyperliquid&apos;s
            liquidation mechanism using the JELLYJELLY token, potentially
            exposing the{" "}
            <Link href="/projects/hlp" className="text-[var(--hw-green)] hover:underline">
              HLP vault
            </Link>{" "}
            to $12M+ in losses. The Hyperliquid team intervened by delisting the
            token and settling positions. This raised concerns about centralized
            intervention but also demonstrated the team&apos;s ability to
            protect user funds.
          </p>
        ),
      },
      {
        question: "Are Hyperliquid ecosystem protocols audited?",
        answer:
          "Audit status varies by protocol. Major protocols like Kinetiq, HyperLend, and Felix Protocol have undergone third-party audits. However, many newer HyperEVM protocols are unaudited. perp.wiki's project dossiers include audit status where available. Always verify audit reports independently before depositing funds.",
        answerJsx: (
          <p>
            Audit status varies by protocol. Major protocols like{" "}
            <Link href="/projects/kinetiq" className="text-[var(--hw-green)] hover:underline">
              Kinetiq
            </Link>
            ,{" "}
            <Link href="/projects/hyperlend" className="text-[var(--hw-green)] hover:underline">
              HyperLend
            </Link>
            , and{" "}
            <Link href="/projects/felix-protocol" className="text-[var(--hw-green)] hover:underline">
              Felix Protocol
            </Link>{" "}
            have undergone third-party audits. However, many newer HyperEVM
            protocols are unaudited. perp.wiki&apos;s{" "}
            <Link href="/projects" className="text-[var(--hw-green)] hover:underline">
              project dossiers
            </Link>{" "}
            include audit status where available. Always verify audit reports
            independently before depositing funds.
          </p>
        ),
      },
      {
        question: "How do I bridge assets to Hyperliquid safely?",
        answer:
          "The official method is depositing USDC via the Arbitrum bridge at app.hyperliquid.xyz. Third-party bridges (Across Protocol, deBridge, LayerZero) offer faster or multi-chain options. Always verify bridge URLs, start with small test transactions, and use established bridges with audit histories.",
        answerJsx: (
          <p>
            The official method is depositing USDC via the Arbitrum bridge at
            app.hyperliquid.xyz. Third-party bridges (Across Protocol, deBridge,
            LayerZero) offer faster or multi-chain options. Always verify bridge
            URLs, start with small test transactions, and use established bridges
            with audit histories.
          </p>
        ),
      },
    ],
  },
];

// Flatten all Q&As for JSON-LD
const allFaqs = FAQ_SECTIONS.flatMap((s) => s.items);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd} />
      <BreadcrumbSchema
        items={[{ name: "FAQ", href: "https://perp.wiki/faq" }]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link
          href="/"
          className="hover:text-[var(--hw-text-muted)] transition-colors"
        >
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">FAQ</span>
      </nav>

      {/* Hero */}
      <div
        className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-8 sm:p-10 mb-10 overflow-hidden"
        style={{ borderRadius: "4px" }}
      >
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)",
          }}
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[var(--hw-text-muted)] max-w-2xl">
            Answers to the most common questions about Hyperliquid, HyperEVM,
            HYPE staking, funding rates, and the DeFi ecosystem.
          </p>
        </div>
      </div>

      {/* Section quick links */}
      <nav className="mb-8 flex flex-wrap gap-2">
        {FAQ_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="px-3 py-1.5 text-xs font-medium text-[var(--hw-text-muted)] border border-[var(--hw-border)] hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-green)] transition-all"
            style={{ borderRadius: "2px", background: "var(--hw-surface)" }}
          >
            {section.title}
          </a>
        ))}
      </nav>

      {/* FAQ Sections */}
      {FAQ_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <FaqAccordion key={item.question} question={item.question}>
                {item.answerJsx}
              </FaqAccordion>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <div
        className="border border-[var(--hw-border)] p-6 text-center mb-10"
        style={{
          borderRadius: "4px",
          background:
            "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
        }}
      >
        <p className="text-sm font-medium text-[var(--hw-text)] mb-3">
          Dive deeper into the Hyperliquid ecosystem
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
            style={{
              borderRadius: "4px",
              background: "var(--hw-green)",
              color: "var(--hw-bg)",
            }}
          >
            Learn Hub
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
            style={{ borderRadius: "4px" }}
          >
            Browse Projects
          </Link>
          <Link
            href="/glossary"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
            style={{ borderRadius: "4px" }}
          >
            Glossary
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-[var(--hw-text-dim)] text-center">
        perp.wiki is independently operated. Not affiliated with Hyperliquid
        Labs.
      </p>
    </div>
  );
}
