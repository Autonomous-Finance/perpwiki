import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Hyperliquid FAQ — Common Questions Answered",
  description:
    "Answers to the most common questions about Hyperliquid, HyperEVM, HYPE staking, funding rates, and the DeFi ecosystem.",
  alternates: { canonical: "https://perp.wiki/faq" },
  openGraph: {
    title: "Hyperliquid FAQ — Common Questions Answered",
    description:
      "Answers to the most common questions about Hyperliquid, HyperEVM, HYPE staking, funding rates, and the DeFi ecosystem.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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

// Section metadata for icons and colors
const SECTION_META: Record<string, { icon: React.ReactNode; color: string }> = {
  "getting-started": {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.84 2.58m0 0a14.926 14.926 0 01-5.96-2.58m5.96 2.58v4.8m-5.96-7.38a6 6 0 015.84-7.38" />
      </svg>
    ),
    color: "var(--hw-green)",
  },
  "staking-yield": {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    color: "var(--hw-gold)",
  },
  trading: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
    color: "var(--hw-cyan)",
  },
  ecosystem: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    color: "var(--hw-tier-hip3)",
  },
  "security-risks": {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: "var(--hw-red)",
  },
};

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

const RELATED_RESOURCES = [
  {
    title: "Learn Hub",
    description: "In-depth guides on trading, staking, and DeFi strategies",
    href: "/learn",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    color: "var(--hw-green)",
  },
  {
    title: "Glossary",
    description: "Definitions for key Hyperliquid and DeFi terms",
    href: "/glossary",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    color: "var(--hw-cyan)",
  },
  {
    title: "Ecosystem Stats",
    description: "Live TVL, volume, and protocol metrics across Hyperliquid",
    href: "/stats",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: "var(--hw-gold)",
  },
  {
    title: "All Projects",
    description: "Browse 170+ protocols building on Hyperliquid",
    href: "/projects",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    color: "var(--hw-tier-hip3)",
  },
];

export default function FaqPage() {
  const totalQuestions = allFaqs.length;

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
        className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-8 sm:p-12 mb-12 overflow-hidden"
        style={{ borderRadius: "4px" }}
      >
        {/* Decorative gradients */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-15"
          style={{
            background:
              "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] pointer-events-none opacity-10"
          style={{
            background:
              "radial-gradient(circle at bottom left, var(--hw-cyan), transparent 70%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          {/* Large icon */}
          <div
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center border border-[var(--hw-green-dim)]"
            style={{
              borderRadius: "4px",
              background: "var(--hw-green-subtle)",
            }}
          >
            <svg className="w-8 h-8 text-[var(--hw-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>

          <div className="flex-1">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-[var(--hw-text-muted)] max-w-2xl mb-4 leading-relaxed">
              Everything you need to know about Hyperliquid, from getting started
              with your first trade to understanding HyperEVM, staking HYPE,
              navigating funding rates, and exploring the DeFi ecosystem. This
              page covers the most commonly asked questions across{" "}
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-green)]">
                {FAQ_SECTIONS.length}
              </span>{" "}
              topics with{" "}
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-green)]">
                {totalQuestions}
              </span>{" "}
              detailed answers.
            </p>
            <p className="text-sm text-[var(--hw-text-dim)] leading-relaxed max-w-2xl">
              Can&apos;t find what you&apos;re looking for? Check the{" "}
              <Link href="/glossary" className="text-[var(--hw-green)] hover:underline">
                glossary
              </Link>{" "}
              for term definitions or browse our{" "}
              <Link href="/learn" className="text-[var(--hw-green)] hover:underline">
                learn hub
              </Link>{" "}
              for in-depth guides.
            </p>
          </div>
        </div>
      </div>

      {/* Section navigation */}
      <nav className="mb-12 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {FAQ_SECTIONS.map((section) => {
          const meta = SECTION_META[section.id];
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex flex-col items-center gap-2 px-3 py-4 text-center border border-[var(--hw-border)] hover:border-[var(--hw-border-bright)] transition-all"
              style={{ borderRadius: "4px", background: "var(--hw-surface)" }}
            >
              <span
                className="flex items-center justify-center w-9 h-9 transition-colors"
                style={{
                  borderRadius: "4px",
                  color: meta?.color ?? "var(--hw-text-muted)",
                  background: `color-mix(in srgb, ${meta?.color ?? "var(--hw-text-muted)"} 10%, transparent)`,
                }}
              >
                {meta?.icon}
              </span>
              <span className="text-xs font-medium text-[var(--hw-text-muted)] group-hover:text-[var(--hw-text)] transition-colors">
                {section.title}
              </span>
              <span
                className="text-[10px] font-[family-name:var(--font-jetbrains-mono)]"
                style={{ color: meta?.color ?? "var(--hw-text-dim)" }}
              >
                {section.items.length} questions
              </span>
            </a>
          );
        })}
      </nav>

      {/* FAQ Sections */}
      {FAQ_SECTIONS.map((section) => {
        const meta = SECTION_META[section.id];
        return (
          <section key={section.id} id={section.id} className="mb-14">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex items-center justify-center w-8 h-8 flex-shrink-0"
                style={{
                  borderRadius: "4px",
                  color: meta?.color ?? "var(--hw-text-muted)",
                  background: `color-mix(in srgb, ${meta?.color ?? "var(--hw-text-muted)"} 12%, transparent)`,
                }}
              >
                {meta?.icon}
              </div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
                {section.title}
              </h2>
              <div
                className="flex-1 h-px ml-2"
                style={{
                  background: `linear-gradient(to right, ${meta?.color ?? "var(--hw-border)"}, transparent)`,
                  opacity: 0.3,
                }}
              />
              <span
                className="text-xs font-[family-name:var(--font-jetbrains-mono)] flex-shrink-0 px-2 py-0.5"
                style={{
                  borderRadius: "2px",
                  color: meta?.color ?? "var(--hw-text-dim)",
                  background: `color-mix(in srgb, ${meta?.color ?? "var(--hw-text-dim)"} 8%, transparent)`,
                }}
              >
                {section.items.length}
              </span>
            </div>

            {/* Section accent border */}
            <div
              className="space-y-2 pl-4"
              style={{
                borderLeft: `2px solid color-mix(in srgb, ${meta?.color ?? "var(--hw-border)"} 30%, transparent)`,
              }}
            >
              {section.items.map((item) => (
                <FaqAccordion key={item.question} question={item.question}>
                  {item.answerJsx}
                </FaqAccordion>
              ))}
            </div>
          </section>
        );
      })}

      {/* Still have questions? */}
      <div
        className="border border-[var(--hw-border)] p-8 sm:p-10 mb-12 text-center overflow-hidden relative"
        style={{
          borderRadius: "4px",
          background:
            "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.04) 100%)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--hw-green-glow), transparent 70%)",
          }}
        />
        <div className="relative">
          <div
            className="mx-auto w-12 h-12 flex items-center justify-center mb-4 border border-[var(--hw-green-dim)]"
            style={{
              borderRadius: "4px",
              background: "var(--hw-green-subtle)",
            }}
          >
            <svg className="w-6 h-6 text-[var(--hw-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </div>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-[var(--hw-text-muted)] mb-6 max-w-md mx-auto">
            Join the Hyperliquid community to get help from experienced users
            and stay up to date with the latest developments.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://discord.gg/hyperliquid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
              style={{
                borderRadius: "4px",
                background: "var(--hw-green)",
                color: "var(--hw-bg)",
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
              </svg>
              Discord
            </a>
            <a
              href="https://x.com/HyperliquidX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text)]"
              style={{ borderRadius: "4px", background: "var(--hw-surface)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow on X
            </a>
            <a
              href="https://t.me/hyperliquid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text)]"
              style={{ borderRadius: "4px", background: "var(--hw-surface)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="mb-12">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-5">
          Related Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RELATED_RESOURCES.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group flex items-start gap-4 p-5 border border-[var(--hw-border)] hover:border-[var(--hw-border-bright)] transition-all"
              style={{ borderRadius: "4px", background: "var(--hw-surface)" }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors"
                style={{
                  borderRadius: "4px",
                  color: resource.color,
                  background: `color-mix(in srgb, ${resource.color} 10%, transparent)`,
                }}
              >
                {resource.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                    {resource.title}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
                <p className="text-xs text-[var(--hw-text-dim)] mt-1 leading-relaxed">
                  {resource.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-[var(--hw-text-dim)] text-center pb-4">
        perp.wiki is independently operated. Not affiliated with Hyperliquid
        Labs.
      </p>
    </div>
  );
}
