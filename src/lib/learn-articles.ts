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
