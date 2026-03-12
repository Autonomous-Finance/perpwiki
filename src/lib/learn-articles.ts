export interface LearnArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  datePublished: string;
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: "what-is-hyperliquid",
    title: "What Is Hyperliquid? The Complete Guide",
    description:
      "Everything you need to know about Hyperliquid — the high-performance L1 blockchain built for on-chain perpetual trading.",
    category: "Fundamentals",
    readingTime: "12 min",
    datePublished: "2026-01-15",
  },
  {
    slug: "how-to-use-hyperliquid",
    title: "How to Use Hyperliquid — Complete Beginner's Tutorial",
    description:
      "Step-by-step guide: create a wallet, bridge USDC, place your first perpetual trade, manage positions, and withdraw funds from Hyperliquid.",
    category: "Guides",
    readingTime: "12 min",
    datePublished: "2026-01-18",
  },
  {
    slug: "hyperliquid-fees",
    title: "Hyperliquid Fees Explained — Trading, Gas & Maker Rebates",
    description:
      "Complete breakdown of Hyperliquid fees: taker fees, maker rebates, HyperEVM gas, withdrawal fees, and how to reduce costs with volume tiers.",
    category: "Guides",
    readingTime: "9 min",
    datePublished: "2026-01-19",
  },
  {
    slug: "hypercore-vs-hyperevm",
    title: "HyperCore vs HyperEVM: What's the Difference?",
    description:
      "Understand the two layers of Hyperliquid — HyperCore for native trading and HyperEVM for smart contract DeFi.",
    category: "Architecture",
    readingTime: "11 min",
    datePublished: "2026-01-20",
  },
  {
    slug: "what-is-hip-3",
    title: "What Is HIP-3? Permissionless Perp Markets Explained",
    description:
      "How HIP-3 lets anyone create perpetual futures markets on Hyperliquid — from stocks to prediction markets.",
    category: "Protocol",
    readingTime: "11 min",
    datePublished: "2026-02-01",
  },
  {
    slug: "hyperliquid-staking-guide",
    title: "Hyperliquid Staking Guide: HLP Vault, HYPE Staking & APY",
    description:
      "Everything you need to know about earning yield on Hyperliquid — HLP vault strategies, HYPE staking, liquid staking tokens, and current APY rates.",
    category: "Guides",
    readingTime: "11 min",
    datePublished: "2026-03-01",
  },
  {
    slug: "best-hyperevm-projects",
    title: "Best HyperEVM Projects in 2026",
    description:
      "A curated guide to the top projects building on HyperEVM — from liquid staking and lending to DEXs and yield aggregators.",
    category: "Ecosystem",
    readingTime: "12 min",
    datePublished: "2026-03-03",
  },
  {
    slug: "hyperliquid-vs-cex",
    title: "Hyperliquid vs Binance & Bybit: How Does It Compare?",
    description:
      "An honest comparison of Hyperliquid against top centralized exchanges on fees, speed, custody, and features.",
    category: "Comparisons",
    readingTime: "11 min",
    datePublished: "2026-03-04",
  },
  {
    slug: "what-is-hyperevm",
    title: "What Is HyperEVM? A Beginner's Guide",
    description:
      "HyperEVM is the EVM-compatible smart contract layer on Hyperliquid L1. Learn how it works and why it matters.",
    category: "Fundamentals",
    readingTime: "11 min",
    datePublished: "2026-03-05",
  },
  {
    slug: "hype-token-guide",
    title: "HYPE Token Guide: Tokenomics, Staking & Governance",
    description:
      "A complete guide to the HYPE token — how it works, staking rewards, governance power, and the burn mechanism.",
    category: "Tokens",
    readingTime: "11 min",
    datePublished: "2026-03-06",
  },
  {
    slug: "hlp-vault-guide",
    title: "HLP Vault Guide: Hyperliquid Liquidity Provider Explained",
    description:
      "How the HLP vault works: deposit USDC, earn yield from market-making, liquidations, and trading fees. HLP APY, risks, TVL, and how it compares to HYPE staking.",
    category: "Guides",
    readingTime: "12 min",
    datePublished: "2026-03-07",
  },
  {
    slug: "perp-dex-comparison",
    title: "Best Perp DEX in 2026 — Hyperliquid vs dYdX vs GMX vs Drift",
    description:
      "Detailed comparison of the top perpetual DEXs: Hyperliquid, dYdX, GMX, Drift, and Lighter. Volume, fees, leverage, and which suits different trader types.",
    category: "Comparisons",
    readingTime: "14 min",
    datePublished: "2026-03-08",
  },
  {
    slug: "hyperliquid-funding-rates-guide",
    title: "Hyperliquid Funding Rates Explained: How to Read, Profit & Hedge",
    description:
      "Complete guide to Hyperliquid funding rates: 8-hour intervals, positive vs negative rates, cash-and-carry strategies, and delta-neutral farming.",
    category: "Guides",
    readingTime: "10 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "best-hyperevm-defi-projects",
    title: "Best HyperEVM DeFi Projects 2026: Lending, Staking & Yield",
    description:
      "Top HyperEVM DeFi projects: Felix Protocol (feUSD), HyperLend (lending), Kinetiq (liquid staking kHYPE), HyperBeat (yield aggregation), and Liminal (delta-neutral).",
    category: "Ecosystem",
    readingTime: "9 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "hyperliquid-vs-binance-perps",
    title: "Hyperliquid vs Binance Perps: On-Chain vs CEX Comparison 2026",
    description:
      "Detailed comparison of Hyperliquid vs Binance perpetual futures: fees, custody, transparency, speed, depth, and self-custody vs KYC.",
    category: "Comparisons",
    readingTime: "9 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "what-is-hip-1",
    title: "What Is HIP-1? Hyperliquid Native Token Standard Explained",
    description:
      "How HIP-1 governs native token creation on Hyperliquid — the PURR launch, spot trading on HyperCore, and the relationship to HIP-2 liquidity bootstrapping.",
    category: "Protocol",
    readingTime: "7 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "how-to-earn-yield-on-hyperliquid",
    title: "5 Ways to Earn Yield on Hyperliquid (2026 Guide)",
    description:
      "Complete guide to earning yield on Hyperliquid: HLP vault (15-25% APR), HYPE staking, lending on HyperLend, builder vaults, and funding rate arbitrage.",
    category: "Guides",
    readingTime: "9 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "hyperunit-bridge-guide",
    title: "How to Bridge to Hyperliquid with Unit Protocol",
    description:
      "Step-by-step guide to bridging BTC, ETH, and SOL to Hyperliquid using Unit Protocol. MPC security, fees, supported assets, and troubleshooting.",
    category: "Guides",
    readingTime: "6 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "hyperliquid-open-interest-explained",
    title: "Open Interest on Hyperliquid: What It Tells You About Markets",
    description:
      "What open interest means on Hyperliquid, how to read it, its relationship to volume, and what rising or falling OI signals about market direction.",
    category: "Fundamentals",
    readingTime: "7 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "best-hyperliquid-trading-bots",
    title: "Best Hyperliquid Trading Bots & Automation Tools 2026",
    description:
      "Top Hyperliquid trading bots: Hummingbot, Insilico Terminal, pvp.trade (copy trading), Katoshi (AI), and Growi. Features, pricing, and how to choose.",
    category: "Ecosystem",
    readingTime: "8 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "how-to-stake-hype",
    title: "How to Stake HYPE: Native & Liquid Staking Guide",
    description:
      "Complete guide to staking HYPE — native staking for ~2.25% APY, liquid staking with kHYPE, stHYPE, and beHYPE, and strategies for maximizing yield.",
    category: "Guides",
    readingTime: "10 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "hyperliquid-fees-explained",
    title: "Hyperliquid Fees Explained: Complete Fee Structure Guide",
    description:
      "Full breakdown of Hyperliquid fees: perp maker/taker rates, spot fees, HyperEVM gas, deposit/withdrawal costs, and how to reduce trading costs.",
    category: "Guides",
    readingTime: "8 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "hyperevm-yield-farming-guide",
    title: "HyperEVM Yield Farming: Complete Strategy Guide",
    description:
      "In-depth HyperEVM yield farming strategies: HLP vault, liquid staking, lending, LP strategies, delta-neutral farming, and leveraged looping with risk analysis.",
    category: "Guides",
    readingTime: "14 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "how-to-bridge-to-hyperliquid",
    title: "How to Bridge to Hyperliquid: Complete Deposit Guide",
    description:
      "Step-by-step guide to bridging funds to Hyperliquid: official Arbitrum bridge, third-party bridges (Across, deBridge, LayerZero), withdrawals, and safety tips.",
    category: "Guides",
    readingTime: "7 min",
    datePublished: "2026-03-09",
  },
  {
    slug: "hyperliquid-vs-dydx",
    title: "Hyperliquid vs dYdX: Which Perp DEX Should You Use in 2026?",
    description:
      "Detailed comparison of Hyperliquid vs dYdX: architecture, fees, leverage, liquidity, volume, ecosystem, and which perp DEX is best for your trading style.",
    category: "Comparisons",
    readingTime: "12 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "hyperliquid-vs-gmx",
    title: "Hyperliquid vs GMX: Perp DEX Comparison 2026",
    description:
      "Hyperliquid vs GMX comparison: orderbook vs oracle-based pricing, fees, liquidity models (HLP vs GLP/GM), volume, and which DEX suits different trading styles.",
    category: "Comparisons",
    readingTime: "11 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "best-hyperliquid-analytics-tools",
    title: "Best Hyperliquid Analytics Tools in 2026",
    description:
      "Top Hyperliquid analytics tools: HyperScanner, Copin.io, Velo Data, Parsec Finance, and HyperDash. Features, pricing, and how to track whales and markets.",
    category: "Ecosystem",
    readingTime: "10 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "hyperliquid-liquidity-providers",
    title: "How to Become a Hyperliquid Liquidity Provider (HLP Guide)",
    description:
      "Complete guide to HLP: deposit USDC, earn 15-25% APR from market-making, understand risks, and compare HLP with HYPE staking and DeFi yields.",
    category: "Guides",
    readingTime: "11 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "what-is-hype-token",
    title: "What is HYPE Token? Complete Guide to Hyperliquid's Native Token",
    description:
      "Everything about HYPE token: tokenomics, staking rewards, governance, the $1.6B airdrop, buy-and-burn mechanism, and where to buy HYPE.",
    category: "Tokens",
    readingTime: "12 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "hyperliquid-points-airdrop-2",
    title: "Hyperliquid Points & Airdrop Season 2: What We Know",
    description:
      "Guide to Hyperliquid points and airdrop season 2: how points work, earning strategies, timeline, and what to expect after the record-breaking season 1.",
    category: "Guides",
    readingTime: "10 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "perpetual-futures-vs-options",
    title: "Perpetual Futures vs Options: Key Differences Explained",
    description:
      "Perpetual futures vs options comparison: expiration, funding vs premium, leverage, risk profiles, and when to use each instrument in DeFi trading.",
    category: "Fundamentals",
    readingTime: "10 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "hyperliquid-api-guide",
    title: "Hyperliquid API Guide for Developers and Algo Traders",
    description:
      "Complete Hyperliquid API guide: Info and Exchange endpoints, WebSocket feeds, authentication, rate limits, SDKs, and building your first trading bot.",
    category: "Guides",
    readingTime: "12 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "best-perp-dex-2026",
    title: "Best Perpetual Futures DEXes in 2026: Full Comparison",
    description:
      "Comprehensive comparison of top perp DEXes: Hyperliquid, dYdX, GMX, Drift, Vertex, and Lighter. Volume, fees, leverage, chains, and which to choose.",
    category: "Comparisons",
    readingTime: "14 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "hyperliquid-trading-strategies",
    title: "Proven Hyperliquid Trading Strategies for 2026",
    description:
      "Top Hyperliquid trading strategies: scalping, momentum trading, funding rate farming, basis trading, grid trading, and risk management best practices.",
    category: "Guides",
    readingTime: "13 min",
    datePublished: "2026-03-11",
  },
  {
    slug: "perpetual-futures-vs-prediction-markets",
    title: "Perpetual Futures vs Prediction Markets — Which Suits You?",
    description:
      "Perpetual futures vs prediction markets: mechanics, leverage, liquidation risk, liquidity, and which instrument fits your trading style.",
    category: "Guides",
    readingTime: "11 min",
    datePublished: "2026-03-12",
  },
];

export function getArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = LEARN_ARTICLES.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? LEARN_ARTICLES[idx - 1] : null,
    next: idx < LEARN_ARTICLES.length - 1 ? LEARN_ARTICLES[idx + 1] : null,
  };
}

/**
 * Given a project category string, return up to 3 related learn articles.
 */
export function getRelatedArticlesForCategory(category: string): LearnArticle[] {
  const matched: LearnArticle[] = [];

  const cat = category.toLowerCase();

  if (cat.includes("trading") || cat.includes("perp")) {
    const slugs = ["perp-dex-comparison", "hyperliquid-funding-rates-guide", "how-to-use-hyperliquid"];
    for (const s of slugs) {
      const a = getArticle(s);
      if (a && matched.length < 3) matched.push(a);
    }
  }

  if (cat.includes("lending") || cat.includes("yield") || cat.includes("staking") || cat.includes("vault")) {
    const slugs = ["hyperliquid-staking-guide", "how-to-earn-yield-on-hyperliquid", "best-hyperevm-defi-projects"];
    for (const s of slugs) {
      const a = getArticle(s);
      if (a && !matched.find((m) => m.slug === a.slug) && matched.length < 3) matched.push(a);
    }
  }

  if (cat.includes("bridge")) {
    const a = getArticle("hyperunit-bridge-guide");
    if (a && !matched.find((m) => m.slug === a.slug) && matched.length < 3) matched.push(a);
  }

  if (cat.includes("dex")) {
    const slugs = ["perp-dex-comparison", "best-hyperevm-projects"];
    for (const s of slugs) {
      const a = getArticle(s);
      if (a && !matched.find((m) => m.slug === a.slug) && matched.length < 3) matched.push(a);
    }
  }

  // Always fill remaining slots with "What is Hyperliquid" as fallback
  if (matched.length < 3) {
    const fallback = getArticle("what-is-hyperliquid");
    if (fallback && !matched.find((m) => m.slug === fallback.slug)) {
      matched.push(fallback);
    }
  }

  return matched.slice(0, 3);
}
