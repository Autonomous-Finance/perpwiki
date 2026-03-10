import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { GlossarySearch } from "./GlossarySearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyperliquid Glossary — DeFi & Trading Terms Explained",
  description:
    "Complete glossary of Hyperliquid, DeFi, and perpetual trading terms. From funding rates to HyperEVM, every concept explained.",
  alternates: { canonical: "https://perp.wiki/glossary" },
};

const GLOSSARY_TERMS = [
  {
    term: "AMM (Automated Market Maker)",
    id: "amm",
    definition:
      "A decentralized exchange mechanism that uses mathematical formulas (typically x*y=k) to price assets in liquidity pools, removing the need for traditional order books. On HyperEVM, AMMs like HyperSwap and KittenSwap enable token swaps.",
    links: [
      { label: "HyperSwap", href: "/projects/hyperswap" },
      { label: "KittenSwap", href: "/projects/kittenswap" },
    ],
  },
  {
    term: "APR (Annual Percentage Rate)",
    id: "apr",
    definition:
      "The annualized rate of return on an investment or deposit, excluding the effect of compounding. Often used to express staking or lending yields in DeFi.",
    links: [{ label: "Earn Yield on Hyperliquid", href: "/learn/how-to-earn-yield-on-hyperliquid" }],
  },
  {
    term: "APY (Annual Percentage Yield)",
    id: "apy",
    definition:
      "The annualized rate of return including the effect of compounding interest. APY is always equal to or higher than APR for the same underlying rate.",
    links: [{ label: "Staking Guide", href: "/learn/hyperliquid-staking-guide" }],
  },
  {
    term: "Arbitrage",
    id: "arbitrage",
    definition:
      "The practice of exploiting price differences for the same asset across different markets or exchanges. Arbitrageurs help keep prices consistent between Hyperliquid and other venues.",
  },
  {
    term: "Bridge",
    id: "bridge",
    definition:
      "A protocol that transfers assets between different blockchains. To use Hyperliquid, users bridge USDC from Arbitrum. Unit Protocol enables bridging BTC, ETH, and SOL to HyperEVM.",
    links: [
      { label: "Bridge Guide", href: "/learn/hyperunit-bridge-guide" },
    ],
  },
  {
    term: "CDP (Collateralized Debt Position)",
    id: "cdp",
    definition:
      "A smart contract mechanism where users lock collateral to mint a stablecoin or borrow assets. Felix Protocol on HyperEVM uses CDPs to let users mint feUSD against their collateral.",
    links: [{ label: "Felix Protocol", href: "/projects/felix-protocol" }],
  },
  {
    term: "Collateral",
    id: "collateral",
    definition:
      "Assets deposited as security to back a loan or leveraged position. On Hyperliquid, USDC serves as the primary collateral for perpetual futures positions.",
  },
  {
    term: "Cross-Margin",
    id: "cross-margin",
    definition:
      "A margin mode where all available balance in a trading account is shared across open positions. If one position is losing, it can draw from the full account balance before liquidation.",
    links: [{ label: "How to Use Hyperliquid", href: "/learn/how-to-use-hyperliquid" }],
  },
  {
    term: "dApp (Decentralized Application)",
    id: "dapp",
    definition:
      "An application built on a blockchain that operates without centralized control. HyperEVM hosts a growing ecosystem of DeFi dApps including DEXs, lending protocols, and yield vaults.",
    links: [{ label: "Best HyperEVM Projects", href: "/learn/best-hyperevm-projects" }],
  },
  {
    term: "Delta-Neutral",
    id: "delta-neutral",
    definition:
      "A portfolio strategy where the overall exposure to price movements is zero. Achieved by combining long and short positions. Common in funding rate arbitrage on Hyperliquid.",
    links: [{ label: "Funding Rates Guide", href: "/learn/hyperliquid-funding-rates-guide" }],
  },
  {
    term: "DEX (Decentralized Exchange)",
    id: "dex",
    definition:
      "An exchange that operates on-chain without a central intermediary, allowing peer-to-peer trading. Hyperliquid itself is the world's largest perpetual DEX by volume.",
    links: [{ label: "Perp DEX Comparison", href: "/learn/perp-dex-comparison" }],
  },
  {
    term: "EVM (Ethereum Virtual Machine)",
    id: "evm",
    definition:
      "The computation engine that executes smart contracts on Ethereum and EVM-compatible chains. HyperEVM is Hyperliquid's EVM-compatible layer, enabling Solidity smart contracts.",
    links: [{ label: "What Is HyperEVM?", href: "/learn/what-is-hyperevm" }],
  },
  {
    term: "Funding Rate",
    id: "funding-rate",
    definition:
      "A periodic payment exchanged between long and short traders in perpetual futures markets. Positive rates mean longs pay shorts; negative rates mean shorts pay longs. Keeps perp prices aligned with spot. Hyperliquid settles funding every 8 hours.",
    links: [
      { label: "Funding Rates Explained", href: "/learn/hyperliquid-funding-rates-guide" },
      { label: "Live Funding Rates", href: "/funding-rates" },
    ],
  },
  {
    term: "Gas",
    id: "gas",
    definition:
      "The fee paid to execute transactions on a blockchain. HyperCore trades are gas-free, while HyperEVM transactions require small amounts of HYPE for gas.",
    links: [{ label: "Hyperliquid Fees", href: "/learn/hyperliquid-fees" }],
  },
  {
    term: "HIP-1",
    id: "hip-1",
    definition:
      "Hyperliquid Improvement Proposal 1 — the native token standard on Hyperliquid. HIP-1 tokens are created and traded directly on HyperCore with built-in spot order book functionality. PURR was the first HIP-1 token.",
    links: [{ label: "What Is HIP-1?", href: "/learn/what-is-hip-1" }],
  },
  {
    term: "HIP-3",
    id: "hip-3",
    definition:
      "Hyperliquid Improvement Proposal 3 — enables permissionless perpetual futures market creation on Hyperliquid. Anyone can list a new perp market, from crypto to stocks to prediction markets.",
    links: [{ label: "What Is HIP-3?", href: "/learn/what-is-hip-3" }],
  },
  {
    term: "HLP (Hyperliquid Liquidity Provider)",
    id: "hlp",
    definition:
      "Hyperliquid's native market-making vault. Users deposit USDC to provide liquidity across all perpetual markets. The vault earns from market-making spreads, liquidations, and trading fees. Historically yields 15-25% APR.",
    links: [
      { label: "HLP Vault Guide", href: "/learn/hlp-vault-guide" },
      { label: "HLP Project", href: "/projects/hlp" },
    ],
  },
  {
    term: "HyperCore",
    id: "hypercore",
    definition:
      "The native execution layer of Hyperliquid L1, purpose-built for high-performance order book trading. Processes trades in under 200ms with zero gas fees. Hosts spot and perpetual markets.",
    links: [{ label: "HyperCore vs HyperEVM", href: "/learn/hypercore-vs-hyperevm" }],
  },
  {
    term: "HyperEVM",
    id: "hyperevm",
    definition:
      "Hyperliquid's EVM-compatible smart contract layer running alongside HyperCore. Enables Solidity-based DeFi apps (lending, AMMs, yield vaults) with native access to HyperCore liquidity and order books.",
    links: [
      { label: "What Is HyperEVM?", href: "/learn/what-is-hyperevm" },
      { label: "Best HyperEVM DeFi", href: "/learn/best-hyperevm-defi-projects" },
    ],
  },
  {
    term: "HYPE",
    id: "hype",
    definition:
      "The native token of Hyperliquid L1. Used for gas on HyperEVM, staking to validators, and governance. HYPE has a deflationary burn mechanism funded by trading fees.",
    links: [{ label: "HYPE Token Guide", href: "/learn/hype-token-guide" }],
  },
  {
    term: "Impermanent Loss",
    id: "impermanent-loss",
    definition:
      "The temporary loss of value experienced by liquidity providers when the price ratio of pooled tokens diverges from the ratio at deposit time. The loss becomes permanent only if the LP withdraws at a different price ratio.",
  },
  {
    term: "Isolated Margin",
    id: "isolated-margin",
    definition:
      "A margin mode where each position has its own dedicated collateral. If the position is liquidated, only the margin assigned to that specific position is lost, protecting the rest of the account.",
    links: [{ label: "How to Use Hyperliquid", href: "/learn/how-to-use-hyperliquid" }],
  },
  {
    term: "kHYPE (Kinetiq HYPE)",
    id: "khype",
    definition:
      "The liquid staking token issued by Kinetiq. Users stake HYPE and receive kHYPE, which accrues staking rewards over time while remaining usable in DeFi protocols across HyperEVM.",
    links: [{ label: "Kinetiq", href: "/projects/kinetiq" }],
  },
  {
    term: "Leverage",
    id: "leverage",
    definition:
      "The use of borrowed capital to increase the size of a trading position beyond what the trader's own funds would allow. Hyperliquid supports up to 50x leverage on major pairs like BTC and ETH.",
    links: [{ label: "How to Use Hyperliquid", href: "/learn/how-to-use-hyperliquid" }],
  },
  {
    term: "Liquidation",
    id: "liquidation",
    definition:
      "The forced closure of a leveraged position when the trader's margin falls below the maintenance requirement. On Hyperliquid, liquidations are handled by the HLP vault and backstop liquidators.",
  },
  {
    term: "Liquidity Pool",
    id: "liquidity-pool",
    definition:
      "A smart contract holding paired tokens that enables decentralized trading. Liquidity providers deposit tokens and earn fees from swaps. Used by AMM-based DEXs on HyperEVM.",
  },
  {
    term: "Liquid Staking",
    id: "liquid-staking",
    definition:
      "A mechanism that lets users stake tokens and receive a liquid derivative (LST) in return. The LST can be used in DeFi while the underlying tokens earn staking rewards. Kinetiq (kHYPE) and StakedHYPE (stHYPE) offer liquid staking for HYPE.",
    links: [
      { label: "Kinetiq", href: "/projects/kinetiq" },
      { label: "StakedHYPE", href: "/projects/stakedhype" },
    ],
  },
  {
    term: "LST (Liquid Staking Token)",
    id: "lst",
    definition:
      "A token received in exchange for staking an asset through a liquid staking protocol. LSTs represent the staked position plus accrued rewards. Examples on Hyperliquid include kHYPE and stHYPE.",
    links: [
      { label: "Kinetiq (kHYPE)", href: "/projects/kinetiq" },
      { label: "StakedHYPE (stHYPE)", href: "/projects/stakedhype" },
    ],
  },
  {
    term: "Maker / Taker",
    id: "maker-taker",
    definition:
      "Makers add liquidity by placing limit orders that rest on the order book. Takers remove liquidity by placing orders that execute immediately against existing orders. On Hyperliquid, makers receive rebates while takers pay fees.",
    links: [{ label: "Hyperliquid Fees", href: "/learn/hyperliquid-fees" }],
  },
  {
    term: "Mark Price",
    id: "mark-price",
    definition:
      "A reference price used to calculate unrealized P&L and trigger liquidations in perpetual futures. Derived from a combination of the order book mid-price and oracle price to prevent manipulation.",
  },
  {
    term: "Max Leverage",
    id: "max-leverage",
    definition:
      "The highest leverage multiplier available for a given trading pair. On Hyperliquid, max leverage varies by asset: 50x for BTC/ETH, 20x for mid-caps, and lower for small-cap perps.",
  },
  {
    term: "Open Interest",
    id: "open-interest",
    definition:
      "The total value of outstanding perpetual futures contracts that have not been settled. Rising open interest alongside price increases signals new money entering the market.",
    links: [
      { label: "Open Interest Explained", href: "/learn/hyperliquid-open-interest-explained" },
      { label: "Live Stats", href: "/stats" },
    ],
  },
  {
    term: "Oracle",
    id: "oracle",
    definition:
      "A system that feeds external data (typically asset prices) to on-chain smart contracts. Hyperliquid uses its own validator-based oracle system for mark price calculations.",
  },
  {
    term: "Order Book",
    id: "order-book",
    definition:
      "A list of buy and sell orders organized by price level. Unlike AMM-based DEXs, Hyperliquid uses a central limit order book (CLOB) on HyperCore, similar to centralized exchanges but fully on-chain.",
  },
  {
    term: "Perpetual Futures (Perps)",
    id: "perpetual-futures",
    definition:
      "Derivative contracts that track the price of an underlying asset without an expiration date. Traders can go long or short with leverage. Funding rates keep the perp price anchored to spot. Hyperliquid is the largest on-chain perp exchange.",
    links: [
      { label: "Perp DEX Comparison", href: "/learn/perp-dex-comparison" },
      { label: "Live Markets", href: "/markets" },
    ],
  },
  {
    term: "Premium",
    id: "premium",
    definition:
      "The difference between the perpetual futures price and the spot price of the underlying asset. A positive premium means perps trade above spot; a negative premium means they trade below. The funding rate mechanism works to reduce the premium over time.",
  },
  {
    term: "Protocol",
    id: "protocol",
    definition:
      "A set of rules encoded in smart contracts that define how a decentralized application operates. In DeFi, protocols govern lending, trading, staking, and other financial activities without intermediaries.",
  },
  {
    term: "Slippage",
    id: "slippage",
    definition:
      "The difference between the expected price of a trade and the actual execution price. Slippage increases with larger order sizes and lower liquidity. Hyperliquid's deep order book minimizes slippage for most pairs.",
  },
  {
    term: "Smart Contract",
    id: "smart-contract",
    definition:
      "Self-executing code deployed on a blockchain that automatically enforces the terms of an agreement. On HyperEVM, smart contracts are written in Solidity and power DeFi protocols like lending, AMMs, and vaults.",
  },
  {
    term: "Spot Trading",
    id: "spot-trading",
    definition:
      "Buying and selling assets for immediate delivery at the current market price, without leverage or derivatives. Hyperliquid supports spot trading for HIP-1 native tokens on HyperCore.",
  },
  {
    term: "stHYPE (StakedHYPE)",
    id: "sthype",
    definition:
      "The liquid staking token issued by StakedHYPE (built by Thunderhead, acquired by Valantis). Users stake HYPE and receive stHYPE, which appreciates in value as staking rewards accrue.",
    links: [{ label: "StakedHYPE", href: "/projects/stakedhype" }],
  },
  {
    term: "Staking",
    id: "staking",
    definition:
      "Locking tokens to support network security and consensus in exchange for rewards. HYPE can be staked directly to Hyperliquid validators or through liquid staking protocols for additional DeFi composability.",
    links: [{ label: "Staking Guide", href: "/learn/hyperliquid-staking-guide" }],
  },
  {
    term: "TVL (Total Value Locked)",
    id: "tvl",
    definition:
      "The total value of assets deposited in a DeFi protocol or ecosystem. TVL is a key metric for measuring the size and adoption of DeFi platforms. Hyperliquid's TVL exceeds $6 billion.",
    links: [{ label: "Live Stats", href: "/stats" }],
  },
  {
    term: "Validator",
    id: "validator",
    definition:
      "A node operator that participates in blockchain consensus by validating transactions and producing blocks. Hyperliquid uses a proof-of-stake consensus mechanism where validators stake HYPE.",
    links: [{ label: "HYPE Token Guide", href: "/learn/hype-token-guide" }],
  },
  {
    term: "Vault",
    id: "vault",
    definition:
      "A smart contract that accepts user deposits and deploys them according to a defined strategy. On Hyperliquid, the HLP vault is the primary example — depositors earn yield from market-making activity.",
    links: [{ label: "HLP Vault Guide", href: "/learn/hlp-vault-guide" }],
  },
  {
    term: "Volume",
    id: "volume",
    definition:
      "The total value of assets traded over a given time period. Hyperliquid consistently processes billions of dollars in daily trading volume, making it the dominant on-chain perpetual futures venue.",
    links: [{ label: "Live Markets", href: "/markets" }],
  },
  {
    term: "Yield",
    id: "yield",
    definition:
      "The return earned on a deposited or staked asset, expressed as a percentage. Sources of yield on Hyperliquid include HLP vault deposits, HYPE staking, lending, and funding rate arbitrage.",
    links: [{ label: "5 Ways to Earn Yield", href: "/learn/how-to-earn-yield-on-hyperliquid" }],
  },
  {
    term: "Yield Farming",
    id: "yield-farming",
    definition:
      "The practice of moving assets between DeFi protocols to maximize returns. On HyperEVM, yield farmers might combine liquid staking (kHYPE/stHYPE) with lending or LP positions to stack multiple sources of yield.",
    links: [
      { label: "HyperEVM DeFi Projects", href: "/learn/best-hyperevm-defi-projects" },
    ],
  },
];

export default function GlossaryPage() {
  const jsonLdTerms = GLOSSARY_TERMS.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `https://perp.wiki/glossary#${t.id}`,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Hyperliquid Glossary — DeFi & Trading Terms",
          description:
            "Complete glossary of Hyperliquid, DeFi, and perpetual trading terms.",
          url: "https://perp.wiki/glossary",
          hasDefinedTerm: jsonLdTerms,
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Glossary</span>
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
            Glossary
          </h1>
          <p className="text-base text-[var(--hw-text-muted)] max-w-2xl mb-6">
            Every Hyperliquid, DeFi, and perpetual trading term explained. From funding rates to
            HyperEVM, find clear definitions for the concepts you need to know.
          </p>
          <div className="flex flex-wrap gap-3">
            {[`${GLOSSARY_TERMS.length} Terms`, "Hyperliquid-Specific", "DeFi Fundamentals"].map(
              (pill) => (
                <span
                  key={pill}
                  className="px-3 py-1.5 text-xs font-medium text-[var(--hw-green)]"
                  style={{
                    borderRadius: "2px",
                    background: "var(--hw-green-subtle)",
                    border: "1px solid rgba(0,229,160,0.2)",
                  }}
                >
                  {pill}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Search + alphabet bar + terms (client component) */}
      <GlossarySearch terms={GLOSSARY_TERMS} />

      {/* Footer note */}
      <p className="text-xs text-[var(--hw-text-dim)] text-center mt-12">
        Missing a term?{" "}
        <Link href="/submit" className="text-[var(--hw-green)] hover:underline">
          Suggest one
        </Link>
        .
      </p>
    </div>
  );
}
