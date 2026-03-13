import { prisma } from "@/lib/prisma";
import { categoryToSlug, CATEGORIES } from "@/lib/categories";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getRelatedArticlesForCategory } from "@/lib/learn-articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";

/* ------------------------------------------------------------------ */
/*  Rich Category Content                                              */
/* ------------------------------------------------------------------ */

interface CategoryContent {
  headline: string;
  intro: string;
  deepDive: string;
  keyProjects: string;
  whyItMatters: string;
  relatedCategories: Array<{ label: string; slug: string }>;
  comparePairs: Array<{ slugA: string; slugB: string; nameA: string; nameB: string }>;
  glossaryTerms: string[];
  faqAnswers: {
    best: string;
    howWorks: string;
    safety: string;
  };
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "decentralized-exchanges": {
    headline: "Decentralized Exchanges on Hyperliquid",
    intro:
      "DEXs on Hyperliquid range from spot AMMs built on HyperEVM to aggregators routing trades across the entire ecosystem. Unlike most L1s, Hyperliquid DEXs benefit from shared order book liquidity with HyperCore — giving them a structural edge over isolated EVM chains.",
    deepDive:
      "Decentralized exchanges on Hyperliquid operate primarily on HyperEVM, the EVM-compatible smart contract layer that runs alongside HyperCore. While HyperCore handles native perp trading via its on-chain order book, HyperEVM AMMs bring permissionless spot trading, liquidity pools, and token swaps to the ecosystem. This dual-layer architecture is unique: DEXs on HyperEVM can tap into the same state and liquidity that powers the native perp exchange.\n\nThe AMM landscape on Hyperliquid includes concentrated liquidity models (similar to Uniswap V3), traditional constant-product pools, and hybrid designs that route through both on-chain pools and the HyperCore order book. Because Hyperliquid L1 achieves sub-second block times with no gas wars, these DEXs offer a trading experience that rivals centralized exchanges while maintaining full self-custody.\n\nAs HIP-1 native tokens proliferate and more assets launch natively on Hyperliquid, on-chain DEXs become essential infrastructure — they are the primary venue for price discovery and trading of long-tail assets that do not yet have HyperCore perp markets.",
    keyProjects:
      "HyperSwap is the leading AMM on HyperEVM, offering concentrated liquidity pools with deep HYPE/USDC and LST pairs. KittenSwap provides a user-friendly swap interface with competitive routing. Gliquid operates as a full-featured AMM DEX with multiple pool types and farming incentives. Together, these protocols form the backbone of spot liquidity on Hyperliquid's EVM layer.",
    whyItMatters:
      "On-chain DEXs are the foundation of any DeFi ecosystem. Without deep spot liquidity, lending protocols cannot liquidate collateral efficiently, liquid staking tokens cannot maintain their pegs, and new token launches lack a venue for fair price discovery. Hyperliquid DEXs close this gap, enabling the composability that makes the rest of HyperEVM DeFi possible.",
    relatedCategories: [
      { label: "Lending & Borrowing", slug: "lending-and-borrowing" },
      { label: "Liquid Staking", slug: "liquid-staking" },
      { label: "Yield & Vaults", slug: "yield-and-vaults" },
    ],
    comparePairs: [
      { slugA: "hyperswap", slugB: "gliquid", nameA: "HyperSwap", nameB: "Gliquid" },
      { slugA: "hyperswap", slugB: "kittenswap", nameA: "HyperSwap", nameB: "KittenSwap" },
    ],
    glossaryTerms: ["AMM", "liquidity pool", "concentrated liquidity", "impermanent loss", "slippage"],
    faqAnswers: {
      best: "The top DEX projects on Hyperliquid include HyperSwap (the leading concentrated liquidity AMM), KittenSwap (a user-friendly swap interface), and Gliquid (a full-featured AMM with farming). HyperSwap has the deepest liquidity for major pairs like HYPE/USDC, while KittenSwap and Gliquid offer competitive routing and additional pool types. All three run on HyperEVM with sub-second finality.",
      howWorks:
        "DEXs on Hyperliquid work by deploying automated market maker (AMM) smart contracts on HyperEVM. Users provide liquidity to pools and earn trading fees, while traders swap tokens against these pools. Because HyperEVM shares state with HyperCore, DEXs can potentially route through the native order book for better pricing. Transactions settle in under a second with minimal gas costs.",
      safety:
        "DEXs on Hyperliquid benefit from the L1's native security model — no cross-chain bridge risk, sub-second finality, and deterministic execution. However, smart contract risk still applies: users should check whether a DEX has been audited, review its liquidity depth before large trades, and be aware of impermanent loss when providing liquidity. Sticking to verified projects listed on perp.wiki reduces risk.",
    },
  },

  "lending-and-borrowing": {
    headline: "Lending & Borrowing Protocols on Hyperliquid",
    intro:
      "Lending protocols on HyperEVM enable traders to borrow against their perp positions and staked assets, creating a capital-efficient loop unique to Hyperliquid's unified state design. Protocols like HyperLend and Felix are building the money market infrastructure for the HL ecosystem.",
    deepDive:
      "Lending and borrowing on Hyperliquid takes two primary forms: pool-based money markets (like HyperLend and Morpho) where users supply assets to earn interest and borrowers post collateral to take loans, and CDP (Collateralized Debt Position) protocols like Felix Protocol where users mint stablecoins against their collateral.\n\nWhat makes Hyperliquid lending special is the collateral types available. Users can deposit liquid staking tokens (kHYPE, stHYPE), LP tokens from HyperEVM DEXs, and native HYPE — creating a capital efficiency loop where staked HYPE earns staking yield while simultaneously serving as loan collateral. Felix Protocol's feUSD stablecoin is minted directly against HYPE collateral, bringing a native stablecoin to the ecosystem.\n\nAs the lending stack matures, it creates recursive yield opportunities: stake HYPE for kHYPE, deposit kHYPE as collateral on HyperLend, borrow USDC, and redeploy into other yield strategies. This composability is what transforms Hyperliquid from a perp exchange into a full DeFi ecosystem.",
    keyProjects:
      "HyperLend is the primary pool-based lending market on HyperEVM, supporting HYPE, USDC, and major LSTs as collateral. Felix Protocol is a CDP lending protocol that lets users mint feUSD stablecoins against HYPE and LST collateral. Morpho brings its battle-tested lending infrastructure from Ethereum mainnet to HyperEVM, offering isolated markets with customizable risk parameters.",
    whyItMatters:
      "Lending is the connective tissue of any DeFi ecosystem. Without money markets, liquid staking tokens have limited utility beyond holding, DEX LP positions cannot be leveraged, and stablecoins cannot be minted against native assets. Hyperliquid's lending protocols unlock capital efficiency that keeps assets productive across the ecosystem rather than sitting idle.",
    relatedCategories: [
      { label: "Liquid Staking", slug: "liquid-staking" },
      { label: "Yield & Vaults", slug: "yield-and-vaults" },
      { label: "Decentralized Exchanges", slug: "decentralized-exchanges" },
    ],
    comparePairs: [
      { slugA: "hyperlend", slugB: "felix-protocol", nameA: "HyperLend", nameB: "Felix Protocol" },
      { slugA: "hyperlend", slugB: "morpho", nameA: "HyperLend", nameB: "Morpho" },
    ],
    glossaryTerms: ["collateral", "CDP", "liquidation", "LTV", "money market"],
    faqAnswers: {
      best: "The best lending projects on Hyperliquid are HyperLend (the leading pool-based money market supporting HYPE, USDC, and LSTs), Felix Protocol (a CDP protocol for minting feUSD stablecoins), and Morpho (isolated lending markets with customizable risk). HyperLend has the highest TVL among lending protocols, while Felix offers a native stablecoin unique to the ecosystem.",
      howWorks:
        "Lending on Hyperliquid works through smart contracts on HyperEVM. In pool-based markets like HyperLend, suppliers deposit assets into lending pools and earn interest, while borrowers post collateral (HYPE, LSTs, USDC) and take loans at variable rates. CDP protocols like Felix let users lock collateral and mint stablecoins (feUSD) against it. Interest rates adjust automatically based on pool utilization.",
      safety:
        "Lending protocols on Hyperliquid carry smart contract risk (code bugs, exploits) and liquidation risk (if collateral value drops below the required ratio). To stay safe: use audited protocols, maintain a healthy collateral ratio well above the liquidation threshold, diversify across multiple protocols, and monitor your positions during volatile markets. All lending protocols listed on perp.wiki have been reviewed for legitimacy.",
    },
  },

  "liquid-staking": {
    headline: "Liquid Staking on Hyperliquid",
    intro:
      "Liquid staking protocols on Hyperliquid let users stake HYPE and receive liquid tokens that can be used as collateral across HyperEVM DeFi — combining staking yield with full capital efficiency. This unlocks the classic LSTfi loop pioneered on Ethereum but native to HL.",
    deepDive:
      "Liquid staking on Hyperliquid solves a fundamental tradeoff: when you stake HYPE natively, your tokens are locked and cannot participate in DeFi. Liquid staking protocols accept your HYPE, stake it with validators on your behalf, and give you a receipt token (kHYPE, stHYPE, or beHYPE) that represents your staked position. These LSTs accrue staking rewards automatically and can be freely traded, used as collateral, or deployed in DeFi.\n\nThe Hyperliquid LST ecosystem has grown rapidly, with over $1.7B in total value locked across liquid staking protocols. Each protocol takes a different approach: Kinetiq (kHYPE) focuses on deep DeFi integrations and validator diversification, StakedHYPE (stHYPE) — built by Thunderhead and acquired by Valantis — emphasizes decentralized validator selection, and HyperBeat (beHYPE) operates as a yield aggregation protocol that optimizes staking returns.\n\nThe real power of liquid staking emerges through composability. Users can deposit LSTs into lending protocols like HyperLend to borrow against them, provide liquidity in DEX pools (e.g., kHYPE/HYPE on HyperSwap), or use them in yield vaults — all while continuing to earn the base staking APY of approximately 2.25%.",
    keyProjects:
      "Kinetiq is the market-leading LST protocol with kHYPE, offering the deepest DeFi integrations across HyperEVM lending and DEX protocols. StakedHYPE (stHYPE), originally built by Thunderhead and acquired by Valantis, provides a decentralized approach to validator selection. HyperBeat is a yield aggregation protocol with beHYPE, optimizing staking returns through automated strategies.",
    whyItMatters:
      "Liquid staking is arguably the most important DeFi primitive on Hyperliquid. It secures the network through staking while keeping capital liquid for DeFi — without it, users face a binary choice between staking rewards and DeFi yields. With $1.7B+ in LSTs, liquid staking has become the largest DeFi category on Hyperliquid and the foundation that lending, DEX, and yield protocols build upon.",
    relatedCategories: [
      { label: "Lending & Borrowing", slug: "lending-and-borrowing" },
      { label: "Yield & Vaults", slug: "yield-and-vaults" },
      { label: "Decentralized Exchanges", slug: "decentralized-exchanges" },
    ],
    comparePairs: [
      { slugA: "kinetiq", slugB: "stakedhype", nameA: "Kinetiq", nameB: "StakedHYPE" },
      { slugA: "kinetiq", slugB: "hyperbeat", nameA: "Kinetiq", nameB: "HyperBeat" },
      { slugA: "stakedhype", slugB: "hyperbeat", nameA: "StakedHYPE", nameB: "HyperBeat" },
    ],
    glossaryTerms: ["LST", "liquid staking", "validator", "staking APY", "receipt token"],
    faqAnswers: {
      best: "The top liquid staking projects on Hyperliquid are Kinetiq (kHYPE) — the largest LST by TVL with deep DeFi integrations, StakedHYPE (stHYPE) by Valantis with decentralized validator selection, and HyperBeat (beHYPE) which focuses on yield aggregation and optimized staking returns. Together they hold over $1.7B in staked HYPE.",
      howWorks:
        "Liquid staking on Hyperliquid works by depositing HYPE into a protocol (like Kinetiq), which stakes it with validators and gives you a liquid receipt token (kHYPE). This token automatically accrues staking rewards (~2.25% APY) and can be used across HyperEVM DeFi — as collateral on HyperLend, in DEX liquidity pools, or in yield vaults. When you want to unstake, you redeem the LST for your HYPE plus accumulated rewards.",
      safety:
        "Liquid staking on Hyperliquid is generally considered lower risk than other DeFi activities because the underlying asset (HYPE) is staked with network validators. Key risks include smart contract bugs, depeg events (where the LST trades below its backing value), and slashing risk if a validator misbehaves. Stick to verified LST protocols with audited contracts and deep secondary market liquidity for the safest experience.",
    },
  },

  "yield-and-vaults": {
    headline: "Yield & Vault Protocols on Hyperliquid",
    intro:
      "Yield and vault protocols on Hyperliquid let traders earn passive returns on idle capital — from automated HLP strategies to structured yield products built natively on HyperCore and HyperEVM. With multiple projects in this category, Hyperliquid has the deepest yield infrastructure of any perp-native L1.",
    deepDive:
      "Yield protocols on Hyperliquid span a wide spectrum of strategies and risk profiles. At the simplest level, the HLP (Hyperliquid Liquidity Provider) vault on HyperCore lets users deposit USDC and earn yield from market-making, liquidation proceeds, and trading fees — typically generating 15-25% APR. More sophisticated strategies are built on HyperEVM.\n\nDelta-neutral vaults like Liminal and Resolv aim to generate yield while hedging out directional price exposure — they earn funding rates, basis spread, or liquidity provision fees without taking a bet on whether HYPE goes up or down. Looped HYPE strategies use leveraged staking loops (stake HYPE, borrow against LST, stake again) to amplify staking yields.\n\nThe yield landscape on Hyperliquid is evolving rapidly as composability deepens. New vault strategies can combine lending yields, LST staking rewards, DEX LP fees, and funding rate arbitrage into single-deposit products. This is the same yield aggregation pattern that drove billions in TVL on Ethereum, now replaying natively on Hyperliquid with the added advantage of sub-second settlement and minimal gas costs.",
    keyProjects:
      "HLP is the native Hyperliquid vault providing market-making yield on HyperCore. Resolv offers delta-neutral strategies that hedge out directional risk while earning funding and basis yield. Liminal provides structured delta-neutral vaults on HyperEVM. Looped HYPE strategies use leveraged LST loops to amplify staking returns. Together these protocols offer yield options across the entire risk spectrum.",
    whyItMatters:
      "Yield infrastructure determines how much capital stays in an ecosystem. Without compelling yield products, USDC and HYPE leave Hyperliquid for higher returns elsewhere. Vault protocols solve this by making it easy for passive users to earn competitive returns without active trading — growing TVL, deepening liquidity, and making the entire ecosystem more robust.",
    relatedCategories: [
      { label: "Liquid Staking", slug: "liquid-staking" },
      { label: "Lending & Borrowing", slug: "lending-and-borrowing" },
      { label: "Decentralized Exchanges", slug: "decentralized-exchanges" },
    ],
    comparePairs: [],
    glossaryTerms: ["vault", "delta-neutral", "yield farming", "APR", "TVL"],
    faqAnswers: {
      best: "The best yield projects on Hyperliquid include HLP (the native market-making vault with 15-25% APR), Resolv (delta-neutral yield strategies), Liminal (structured HyperEVM vaults), and various Looped HYPE strategies. HLP is the simplest entry point for passive yield, while delta-neutral vaults offer more sophisticated risk-adjusted returns.",
      howWorks:
        "Yield protocols on Hyperliquid work by deploying capital into automated strategies. HLP deposits USDC into the native market-making vault on HyperCore. Delta-neutral vaults take offsetting long/short positions to earn funding rates without directional exposure. Looped strategies use leveraged staking to amplify LST yields. Users deposit assets, and the vault smart contract handles execution, rebalancing, and compounding.",
      safety:
        "Yield vault safety varies by strategy. HLP is among the safest (native to Hyperliquid, simple market-making), but can have drawdown periods during extreme volatility. Delta-neutral strategies aim to minimize risk but can suffer from funding rate reversals or basis compression. Leveraged staking loops carry liquidation risk. Always check the vault's audit status, historical performance, and understand the underlying strategy before depositing.",
    },
  },

  "trading-bots-automation": {
    headline: "Trading Bots & Automation on Hyperliquid",
    intro:
      "Hyperliquid's low-latency HyperCore L1 and open API make it one of the best chains for automated trading strategies. Bot platforms and automation tools here range from copy-trading and grid bots to full algorithmic execution suites targeting Hyperliquid's order book.",
    deepDive:
      "Trading automation on Hyperliquid benefits from a unique structural advantage: the HyperCore order book processes trades with sub-200ms latency, approaching the speed of centralized exchanges while maintaining full on-chain settlement. This makes Hyperliquid one of the few DEXs where algorithmic strategies — from simple grid bots to complex market-making algorithms — can execute competitively.\n\nThe ecosystem offers several tiers of automation. Copy-trading platforms like PVP Trade let users mirror the trades of top-performing wallets in real time. Grid and DCA bots automate dollar-cost averaging and range-bound trading strategies. Professional-grade tools like Insilico Terminal and Hummingbot provide full algorithmic trading frameworks with backtesting, custom indicators, and multi-strategy execution.\n\nBecause all trades settle on-chain, Hyperliquid trading bots benefit from transparency that is impossible on centralized exchanges. Users can verify execution quality, track slippage, and audit bot performance using on-chain data — a major advantage for trust in automated strategies.",
    keyProjects:
      "Insilico Terminal provides a professional algorithmic trading suite with backtesting and multi-strategy execution for Hyperliquid. Hummingbot is an open-source market-making and arbitrage framework with native Hyperliquid integration. PVP Trade enables copy-trading, allowing users to automatically mirror trades from successful Hyperliquid wallets.",
    whyItMatters:
      "Trading automation drives volume, liquidity, and tighter spreads — all of which benefit every user on Hyperliquid. Bots provide consistent market-making that deepens order books, arbitrage that keeps prices aligned across venues, and copy-trading that lets retail traders access institutional-grade strategies. As Hyperliquid's ecosystem grows, automation infrastructure becomes increasingly critical for market efficiency.",
    relatedCategories: [
      { label: "Trading Terminals & Interfaces", slug: "trading-terminals-interfaces" },
      { label: "Analytics & Data", slug: "analytics-data" },
      { label: "Yield & Vaults", slug: "yield-and-vaults" },
    ],
    comparePairs: [],
    glossaryTerms: ["grid bot", "copy trading", "market making", "algorithmic trading", "slippage"],
    faqAnswers: {
      best: "The best trading bot projects on Hyperliquid include Insilico Terminal (professional algo trading suite), Hummingbot (open-source market-making framework), and PVP Trade (copy-trading platform). Insilico is best for advanced traders who want backtesting and custom strategies, Hummingbot for developers building their own bots, and PVP Trade for users who want to mirror successful wallets.",
      howWorks:
        "Trading bots on Hyperliquid connect to the HyperCore API to place, modify, and cancel orders programmatically. They analyze market data (prices, order book depth, funding rates) and execute strategies automatically — grid trading, arbitrage, market-making, or copying other wallets. All orders settle on-chain with sub-second finality, and bot performance is fully verifiable through on-chain transaction history.",
      safety:
        "Trading bots carry inherent risks: strategy failure during volatile markets, API key exposure, and potential smart contract risks for on-chain bots. To stay safe, use trusted platforms with track records, never share API keys with withdrawal permissions, start with small position sizes, and monitor bot performance regularly. Verified projects on perp.wiki have been reviewed for basic security practices.",
    },
  },

  "trading-terminals-interfaces": {
    headline: "Trading Terminals & Interfaces for Hyperliquid",
    intro:
      "Advanced trading terminals built for Hyperliquid give power users charting, multi-account management, and custom order types beyond the native UI. These third-party interfaces often unlock features for serious traders that aren't available on app.hyperliquid.xyz.",
    deepDive:
      "While Hyperliquid's native trading interface at app.hyperliquid.xyz is functional and fast, the ecosystem has spawned several third-party terminals that cater to power users and professional traders. These interfaces connect to the same HyperCore order book but add advanced features: multi-chart layouts, custom indicators, hotkey trading, sub-account management, and risk dashboards.\n\nThe trading terminal category also includes mobile-first interfaces, portfolio management tools, and social trading platforms that overlay community features onto Hyperliquid's trading infrastructure. Some terminals specialize in specific use cases — for example, providing better interfaces for HIP-3 prediction markets or aggregating positions across multiple vaults.\n\nAs the Hyperliquid ecosystem grows beyond spot and perp trading into structured products, lending, and options, the demand for sophisticated interfaces that can manage complexity across these verticals will only increase.",
    keyProjects:
      "Third-party trading terminals provide advanced charting, multi-account management, and professional-grade execution tools that extend the native Hyperliquid trading experience. Many offer unique features like hotkey trading, custom indicators, and aggregated risk views across positions.",
    whyItMatters:
      "Trading interfaces determine the user experience for every trader on Hyperliquid. Better tools attract more sophisticated traders, who bring volume and liquidity. Specialized terminals can surface opportunities (like funding rate dislocations or cross-venue arbitrage) that the native UI does not highlight, making the overall market more efficient.",
    relatedCategories: [
      { label: "Trading Bots & Automation", slug: "trading-bots-automation" },
      { label: "Analytics & Data", slug: "analytics-data" },
    ],
    comparePairs: [],
    glossaryTerms: ["order book", "limit order", "market order", "stop loss", "take profit"],
    faqAnswers: {
      best: "The best trading terminal projects on Hyperliquid offer advanced charting, multi-account management, hotkey trading, and custom order types. They connect to the same HyperCore order book as the native UI but add professional-grade features for serious traders. Check our verified project listings to find the terminals best suited to your trading style.",
      howWorks:
        "Trading terminals on Hyperliquid connect to HyperCore via API to display real-time market data and execute trades. They render advanced charts (often powered by TradingView), manage multiple sub-accounts, and support order types like trailing stops and OCO (one-cancels-other) that the native UI may not offer. All trades still settle on Hyperliquid L1 with full on-chain transparency.",
      safety:
        "Third-party trading terminals require API key access to your Hyperliquid account. To stay safe: only use terminals from verified projects, never grant withdrawal permissions to API keys used with third-party tools, use separate sub-accounts for different terminals, and enable any available 2FA. The terminal itself never holds your funds — all assets remain on Hyperliquid.",
    },
  },

  "bridges-cross-chain": {
    headline: "Bridges & Cross-Chain Infrastructure for Hyperliquid",
    intro:
      "Bridging to Hyperliquid is a critical step for any new user — and these protocols make it seamless to move assets from Ethereum, Arbitrum, and other chains directly into HyperEVM or native USDC on HyperCore. Fast, cheap bridging is essential infrastructure for ecosystem growth.",
    deepDive:
      "Cross-chain bridges are the entry points to Hyperliquid for users coming from other networks. The official Hyperliquid bridge supports USDC deposits from Arbitrum, but the ecosystem of third-party bridges dramatically expands connectivity — supporting direct bridging from Ethereum, Solana, Base, Optimism, and dozens of other chains.\n\nBridge protocols serving Hyperliquid use different security models. Across Protocol uses an optimistic verification model with UMA's dispute resolution system. deBridge employs a decentralized network of validators. LayerZero provides an omnichain messaging layer that enables token transfers with configurable security. Each model offers different tradeoffs between speed, cost, and trust assumptions.\n\nFor users bridging significant value, understanding these differences matters. The fastest bridges (often under 30 seconds) may carry different trust assumptions than slower ones. The cheapest routes may vary by time of day and source chain gas prices. Having multiple bridge options gives users flexibility to optimize for their specific needs.",
    keyProjects:
      "Across Protocol is a leading cross-chain bridge using optimistic verification for fast, low-cost transfers to Hyperliquid. deBridge provides decentralized bridging with a validator network securing cross-chain transfers. LayerZero offers omnichain messaging infrastructure that powers token bridging to HyperEVM from virtually any supported chain.",
    whyItMatters:
      "Bridges are the front door to Hyperliquid. Every new user and every dollar of TVL that enters the ecosystem comes through a bridge. Fast, cheap, and secure bridging directly impacts user acquisition, total ecosystem liquidity, and the speed at which Hyperliquid can grow. Multiple bridge options also provide redundancy — if one bridge has issues, users have alternatives.",
    relatedCategories: [
      { label: "Wallets & Account Abstraction", slug: "wallets-account-abstraction" },
      { label: "Decentralized Exchanges", slug: "decentralized-exchanges" },
      { label: "Lending & Borrowing", slug: "lending-and-borrowing" },
    ],
    comparePairs: [],
    glossaryTerms: ["bridge", "cross-chain", "USDC", "omnichain", "finality"],
    faqAnswers: {
      best: "The best bridge projects for Hyperliquid include Across Protocol (fast optimistic bridging), deBridge (decentralized validator network), and LayerZero (omnichain messaging). Across is often fastest for Ethereum and Arbitrum transfers. deBridge supports the widest range of source chains. The official Hyperliquid bridge via Arbitrum is also reliable for USDC deposits.",
      howWorks:
        "Bridges to Hyperliquid work by locking assets on the source chain and minting or releasing equivalent assets on HyperEVM (or HyperCore for USDC). Different bridges use different security models: Across uses optimistic verification with dispute resolution, deBridge uses decentralized validators, and LayerZero uses configurable oracle and relayer networks. Most transfers complete in under 2 minutes.",
      safety:
        "Bridge safety on Hyperliquid varies by protocol. All bridges carry inherent cross-chain risk — smart contract bugs, validator compromise, or relay failures. To minimize risk: use well-established bridges with strong audit histories, start with small test transactions, verify the destination address carefully, and never bridge more than you can afford to have delayed. The official Arbitrum bridge is the most battle-tested option.",
    },
  },

  "analytics-data": {
    headline: "Analytics & Data Tools for Hyperliquid",
    intro:
      "On-chain analytics tools for Hyperliquid give traders and researchers visibility into order flow, vault performance, funding rates, and ecosystem-wide activity. As HyperEVM matures, data tooling is becoming essential for anyone making informed decisions in the ecosystem.",
    deepDive:
      "Analytics platforms for Hyperliquid serve multiple audiences — from retail traders checking funding rates to institutional researchers analyzing market microstructure. The data landscape includes block explorers, trading analytics dashboards, portfolio trackers, and specialized tools for vault performance monitoring.\n\nHypurrScan serves as the primary block explorer for HyperEVM, providing transaction lookup, contract verification, and token tracking. ASXN offers a comprehensive analytics dashboard with Hyperliquid-specific metrics including open interest breakdowns, volume analysis, and trader leaderboards. HyperScanner provides real-time monitoring of ecosystem activity including new token launches, whale movements, and unusual trading patterns.\n\nThe analytics category is particularly important during this stage of Hyperliquid's growth. With new protocols launching weekly on HyperEVM and HIP-3 bringing novel market types, data tools help the community evaluate projects, identify opportunities, and spot risks before they materialize.",
    keyProjects:
      "HypurrScan is the primary HyperEVM block explorer for transaction lookup and contract verification. ASXN provides deep trading analytics with Hyperliquid-specific metrics like open interest breakdowns and funding rate analysis. HyperScanner offers real-time ecosystem monitoring including whale tracking and new token alerts.",
    whyItMatters:
      "Data is the foundation of informed decision-making in DeFi. Without analytics tools, traders cannot evaluate funding rate opportunities, researchers cannot assess protocol health, and the community cannot identify suspicious activity. Strong analytics infrastructure builds trust in the ecosystem and helps capital allocate efficiently to the best projects.",
    relatedCategories: [
      { label: "Trading Terminals & Interfaces", slug: "trading-terminals-interfaces" },
      { label: "Trading Bots & Automation", slug: "trading-bots-automation" },
    ],
    comparePairs: [],
    glossaryTerms: ["open interest", "funding rate", "TVL", "volume", "block explorer"],
    faqAnswers: {
      best: "The best analytics projects on Hyperliquid include HypurrScan (HyperEVM block explorer), ASXN (comprehensive trading analytics dashboard), and HyperScanner (real-time ecosystem monitoring). HypurrScan is essential for verifying transactions and contracts. ASXN excels at trading metrics and leaderboards. HyperScanner is best for real-time alerts and whale tracking.",
      howWorks:
        "Analytics tools on Hyperliquid work by indexing on-chain data from both HyperCore and HyperEVM. They process raw blockchain data — transactions, events, state changes — into human-readable dashboards and metrics. Block explorers index every transaction for lookup. Trading analytics platforms aggregate order flow, compute funding rates, and rank traders. Some tools also integrate off-chain data sources for token prices and social sentiment.",
      safety:
        "Analytics tools are read-only and do not require wallet connections or API keys with trading permissions, making them inherently safe to use. However, be cautious of analytics platforms that ask for wallet permissions beyond basic read access. Never enter private keys or seed phrases into any analytics tool. The data these tools provide is only as accurate as the underlying indexing — always cross-reference important data points across multiple sources.",
    },
  },

  "oracles": {
    headline: "Oracle Infrastructure on Hyperliquid",
    intro:
      "Oracles provide the critical price feeds and off-chain data that smart contracts on HyperEVM need to function. Without reliable oracle infrastructure, lending liquidations, derivative pricing, and automated strategies cannot operate safely.",
    deepDive:
      "Oracle infrastructure on Hyperliquid is still in its early stages but critically important. HyperEVM smart contracts need accurate, timely price data for collateral valuation in lending protocols, trigger conditions in automated vaults, and settlement of prediction markets on HIP-3.\n\nRedStone is the primary oracle provider serving HyperEVM, delivering price feeds through a unique modular design that allows protocols to choose between push and pull data delivery models. This flexibility is important on Hyperliquid where gas costs are low and sub-second block times enable more frequent price updates than on Ethereum mainnet.\n\nAs the HyperEVM DeFi stack deepens — with lending protocols accepting LSTs as collateral and complex vault strategies depending on real-time pricing — oracle reliability becomes a systemic concern. A single oracle failure can cascade through multiple protocols, triggering incorrect liquidations or enabling exploits. The development of robust, redundant oracle infrastructure is essential for the ecosystem's maturity.",
    keyProjects:
      "RedStone is the leading oracle provider on HyperEVM, delivering modular price feeds with both push and pull data delivery models. Its architecture is well-suited to Hyperliquid's sub-second block times, enabling high-frequency price updates for DeFi protocols.",
    whyItMatters:
      "Oracles are the backbone of DeFi composability. Every lending liquidation, every vault rebalance, and every derivative settlement depends on accurate price data. On Hyperliquid, where the DeFi stack is growing rapidly across lending, liquid staking, and structured products, reliable oracle infrastructure is a prerequisite for the ecosystem's security and growth.",
    relatedCategories: [
      { label: "Lending & Borrowing", slug: "lending-and-borrowing" },
      { label: "Yield & Vaults", slug: "yield-and-vaults" },
      { label: "Liquid Staking", slug: "liquid-staking" },
    ],
    comparePairs: [],
    glossaryTerms: ["oracle", "price feed", "push oracle", "pull oracle", "data availability"],
    faqAnswers: {
      best: "RedStone is the primary oracle provider on Hyperliquid's HyperEVM, delivering modular price feeds for DeFi protocols. It is used by lending protocols like HyperLend for collateral valuation and by vault strategies for position management. As the ecosystem grows, additional oracle solutions may emerge to provide redundancy.",
      howWorks:
        "Oracles on Hyperliquid work by fetching price data from external sources (exchanges, aggregators) and delivering it to smart contracts on HyperEVM. RedStone uses a modular approach: protocols can receive data through push model (regular on-chain updates) or pull model (data fetched on-demand when a transaction needs it). This flexibility keeps costs low while ensuring fresh data when it matters.",
      safety:
        "Oracle safety is critical because DeFi protocols depend on accurate price data. Risks include stale prices during high volatility, data source manipulation, and single points of failure. RedStone mitigates these through multiple data sources, cryptographic data signatures, and dispute mechanisms. Users of DeFi protocols should verify that the protocols they use employ reliable oracle infrastructure.",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Category-to-learn-article mapping (extends the existing helper)    */
/* ------------------------------------------------------------------ */

const CATEGORY_LEARN_MAP: Record<string, string[]> = {
  "decentralized-exchanges": ["perp-dex-comparison", "best-hyperevm-projects", "best-hyperevm-defi-projects"],
  "lending-and-borrowing": ["best-hyperevm-defi-projects", "how-to-earn-yield-on-hyperliquid", "hyperevm-yield-farming-guide"],
  "liquid-staking": ["how-to-stake-hype", "hyperliquid-staking-guide", "best-hyperevm-defi-projects"],
  "yield-and-vaults": ["how-to-earn-yield-on-hyperliquid", "hlp-vault-guide", "hyperevm-yield-farming-guide"],
  "trading-bots-automation": ["best-hyperliquid-trading-bots", "how-to-use-hyperliquid", "hyperliquid-funding-rates-guide"],
  "trading-terminals-interfaces": ["how-to-use-hyperliquid", "hyperliquid-fees", "perp-dex-comparison"],
  "bridges-cross-chain": ["how-to-bridge-to-hyperliquid", "hyperunit-bridge-guide", "what-is-hyperevm"],
  "analytics-data": ["hyperliquid-open-interest-explained", "hyperliquid-funding-rates-guide", "what-is-hyperliquid"],
  "oracles": ["what-is-hyperevm", "hypercore-vs-hyperevm", "best-hyperevm-defi-projects"],
  "wallets-account-abstraction": ["how-to-use-hyperliquid", "what-is-hyperevm", "what-is-hyperliquid"],
  "prediction-markets": ["what-is-hip-3", "what-is-hip-1", "what-is-hyperliquid"],
  "rwa-perps": ["what-is-hip-3", "hyperliquid-open-interest-explained", "perp-dex-comparison"],
  "sdks-developer-tools": ["what-is-hyperevm", "hypercore-vs-hyperevm", "what-is-hyperliquid"],
  "security-audits": ["what-is-hyperevm", "best-hyperevm-defi-projects", "what-is-hyperliquid"],
  "data-apis": ["hyperliquid-open-interest-explained", "what-is-hyperevm", "what-is-hyperliquid"],
  "nfts-collectibles": ["what-is-hyperevm", "what-is-hip-1", "what-is-hyperliquid"],
  "communities-daos": ["what-is-hyperliquid", "hype-token-guide", "what-is-hyperevm"],
  "media-education": ["what-is-hyperliquid", "how-to-use-hyperliquid", "what-is-hyperevm"],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToCategory(slug: string): string | undefined {
  const found = CATEGORIES.find((c) => categoryToSlug(c) === slug);
  if (found) return found;
  return undefined;
}

function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] ?? null;
}

/** Generate a fallback CategoryContent for categories without custom content */
function generateFallbackContent(category: string, slug: string): CategoryContent {
  return {
    headline: `${category} on Hyperliquid`,
    intro: `Explore ${category.toLowerCase()} projects building on the Hyperliquid ecosystem. This category includes protocols and tools that contribute to the growing HyperEVM and HyperCore landscape.`,
    deepDive: `The ${category.toLowerCase()} category on Hyperliquid encompasses projects that serve an important role in the ecosystem's development. As Hyperliquid grows beyond its origin as a perp DEX into a full-stack L1 blockchain, specialized projects in every category become essential infrastructure.\n\nWhether building on HyperCore's native trading layer or deploying smart contracts on HyperEVM, these projects benefit from Hyperliquid's sub-second block times, minimal gas costs, and unified state architecture. The ecosystem's composability means that ${category.toLowerCase()} projects can integrate with lending, staking, and trading infrastructure to create powerful user experiences.`,
    keyProjects: `Browse the projects below to discover the leading ${category.toLowerCase()} solutions in the Hyperliquid ecosystem. Each project has been reviewed and listed on perp.wiki with detailed information about features, team, and ecosystem integrations.`,
    whyItMatters: `As Hyperliquid evolves into a complete DeFi ecosystem, ${category.toLowerCase()} projects provide essential functionality that attracts users and capital. A healthy ecosystem requires depth across every category — not just trading and yield, but also tooling, infrastructure, and community resources.`,
    relatedCategories: [],
    comparePairs: [],
    glossaryTerms: [],
    faqAnswers: {
      best: `The best ${category.toLowerCase()} projects on Hyperliquid are listed and verified on perp.wiki. Browse this category to compare projects by features, verification status, and ecosystem integrations. Verified projects have been independently reviewed for legitimacy.`,
      howWorks: `${category} on Hyperliquid leverages the unique dual-layer architecture of HyperCore and HyperEVM. Projects may operate on HyperCore (the native trading layer), HyperEVM (the EVM-compatible smart contract layer), or both. This architecture provides sub-second finality, minimal gas costs, and composability with the broader Hyperliquid DeFi ecosystem.`,
      safety: `When evaluating ${category.toLowerCase()} projects on Hyperliquid, check for audit reports, verified status on perp.wiki, team transparency, and community feedback. Start with small amounts when trying new protocols, and never share private keys or seed phrases. Verified projects on perp.wiki have been reviewed for basic legitimacy, but users should always do their own research.`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const cats = await prisma.project.groupBy({
    by: ["category"],
    where: { approvalStatus: "APPROVED" },
  });
  return cats.map((c) => ({ slug: categoryToSlug(c.category) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not Found" };
  const content = getCategoryContent(slug);
  const description = content
    ? content.intro
    : `Top ${category} projects in the Hyperliquid ecosystem. Independent directory with features and ecosystem context. perp.wiki`;
  return {
    title: `Best ${category} on Hyperliquid 2026`,
    description,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Try known categories first, then do a DB lookup
  let category = slugToCategory(slug);
  if (!category) {
    const allCats = await prisma.project.groupBy({
      by: ["category"],
      where: { approvalStatus: "APPROVED" },
    });
    const match = allCats.find((c) => categoryToSlug(c.category) === slug);
    if (match) {
      category = match.category;
    }
  }

  if (!category) notFound();

  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED", category },
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
  });

  if (projects.length === 0) notFound();

  // Compute aggregate stats
  const totalProjects = projects.length;
  const verifiedCount = projects.filter((p) => p.isVerified).length;
  const featuredProject = projects.find((p) => p.isFeatured) ?? null;

  // Get category content (rich or fallback)
  const content = getCategoryContent(slug) ?? generateFallbackContent(category, slug);

  // Get related learn articles
  const learnSlugs = CATEGORY_LEARN_MAP[slug] ?? [];
  const { getArticle } = await import("@/lib/learn-articles");
  const relatedArticles = learnSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => a != null)
    .slice(0, 3);

  // If no mapped articles, fall back to the category-based helper
  if (relatedArticles.length === 0) {
    const fallbackArticles = getRelatedArticlesForCategory(category);
    relatedArticles.push(...fallbackArticles);
  }

  // FAQ items
  const faqItems = [
    {
      question: `What are the best ${category} projects on Hyperliquid?`,
      answer: content.faqAnswers.best,
    },
    {
      question: `How does ${category} work on Hyperliquid?`,
      answer: content.faqAnswers.howWorks,
    },
    {
      question: `Is ${category} safe on Hyperliquid?`,
      answer: content.faqAnswers.safety,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* CollectionPage JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} Projects on Hyperliquid`,
          description: content.intro,
          url: `${SITE_URL}/category/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${SITE_URL}/projects/${p.slug}`,
            })),
          },
        }}
      />

      {/* FAQPage JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Categories", href: `${SITE_URL}/category` },
          { name: category, href: `${SITE_URL}/category/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <Link href="/category" className="hover:text-[var(--hw-text-muted)]">Categories</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{category}</span>
      </div>

      {/* ── Hero / Header ── */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
        {content.headline}
      </h1>
      <p className="text-base text-[var(--hw-text-muted)] mb-6 max-w-3xl leading-relaxed">
        {content.intro}
      </p>

      {/* ── Aggregate Stats ── */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
          <p className="text-2xl font-bold text-[var(--hw-green)] font-[family-name:var(--font-space-grotesk)]">
            {totalProjects}
          </p>
          <p className="text-xs text-[var(--hw-text-dim)] mt-1">
            Project{totalProjects !== 1 ? "s" : ""} Listed
          </p>
        </div>
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
          <p className="text-2xl font-bold text-[var(--hw-text)] font-[family-name:var(--font-space-grotesk)]">
            {verifiedCount}
          </p>
          <p className="text-xs text-[var(--hw-text-dim)] mt-1">
            Verified
          </p>
        </div>
        {featuredProject && (
          <div className="col-span-2 sm:col-span-1 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
            <p className="text-xs text-[var(--hw-text-dim)] mb-1">Featured Project</p>
            <Link
              href={`/projects/${featuredProject.slug}`}
              className="text-base font-semibold text-[var(--hw-green)] hover:underline font-[family-name:var(--font-space-grotesk)]"
            >
              {featuredProject.name}
            </Link>
          </div>
        )}
      </div>

      {/* ── Project Grid ── */}
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
        All {category} Projects
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            name={project.name}
            tagline={project.tagline}
            layer={project.layer}
            category={project.category}
            status={project.status}
            isVerified={project.isVerified}
          />
        ))}
      </div>

      {/* ── Deep Dive Section ── */}
      <div className="mb-12 max-w-3xl">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          Understanding {category} on Hyperliquid
        </h2>
        {content.deepDive.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}

        <h3 className="text-base font-semibold text-[var(--hw-text)] mt-6 mb-2">Key Projects</h3>
        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-4">
          {content.keyProjects}
        </p>

        <h3 className="text-base font-semibold text-[var(--hw-text)] mt-6 mb-2">
          Why {category} Matters on Hyperliquid
        </h3>
        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
          {content.whyItMatters}
        </p>
      </div>

      {/* ── Compare Section ── */}
      {content.comparePairs.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Compare {category} Projects
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.comparePairs.map((pair) => (
              <Link
                key={`${pair.slugA}-${pair.slugB}`}
                href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 hover:border-[var(--hw-green)] transition-colors"
                style={{ borderRadius: "4px" }}
              >
                <span className="text-sm font-medium text-[var(--hw-text)]">
                  {pair.nameA} vs {pair.nameB}
                </span>
                <span className="text-xs text-[var(--hw-text-dim)]">&rarr;</span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--hw-text-dim)]">
            <Link href="/compare" className="text-[var(--hw-green)] hover:underline">
              View all comparisons &rarr;
            </Link>
          </p>
        </div>
      )}

      {/* ── Related Categories ── */}
      {content.relatedCategories.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Related Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {content.relatedCategories.map((rc) => (
              <Link
                key={rc.slug}
                href={`/category/${rc.slug}`}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2 text-sm text-[var(--hw-text-muted)] hover:border-[var(--hw-green)] hover:text-[var(--hw-text)] transition-colors"
                style={{ borderRadius: "4px" }}
              >
                {rc.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Learn More ── */}
      {relatedArticles.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Learn More
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 hover:border-[var(--hw-green)] transition-colors"
                style={{ borderRadius: "4px" }}
              >
                <h3 className="text-sm font-semibold text-[var(--hw-text)] mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--hw-text-dim)] line-clamp-2 mb-2">
                  {article.description}
                </p>
                <span className="text-xs text-[var(--hw-green)]">
                  {article.readingTime} read &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Glossary Terms ── */}
      {content.glossaryTerms.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Key Terms
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.glossaryTerms.map((term) => (
              <Link
                key={term}
                href={`/glossary#${term.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-[var(--hw-green-subtle)] px-3 py-1.5 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-text)] transition-colors"
                style={{ borderRadius: "2px" }}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ Section ── */}
      <div className="mb-12 max-w-3xl">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((faq, i) => (
            <div key={i} className="border-b border-[var(--hw-border)] pb-6 last:border-b-0">
              <h3 className="text-base font-semibold text-[var(--hw-text)] mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Compare CTA ── */}
      <div
        className="mt-8 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6 text-center"
        style={{ borderRadius: "4px" }}
      >
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] mb-2">
          Compare {category} Projects
        </h3>
        <p className="text-sm text-[var(--hw-text-muted)] mb-4">
          See how {category} projects on Hyperliquid stack up against each other side-by-side.
        </p>
        <Link
          href={`/compare#${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[var(--hw-bg)] transition-all hover:opacity-90"
          style={{ borderRadius: "4px", background: "var(--hw-green)" }}
        >
          Compare {category} projects side-by-side
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* ── Footer Links ── */}
      <div className="border-t border-[var(--hw-border)] pt-6 flex flex-wrap gap-4 text-sm text-[var(--hw-text-dim)]">
        <Link href="/projects" className="hover:text-[var(--hw-text-muted)] transition-colors">
          All Projects
        </Link>
        <Link href="/compare" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Compare Projects
        </Link>
        <Link href="/glossary" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Glossary
        </Link>
        <Link href="/learn" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Learn Hub
        </Link>
        <Link href="/category" className="hover:text-[var(--hw-text-muted)] transition-colors">
          All Categories
        </Link>
      </div>
    </div>
  );
}
