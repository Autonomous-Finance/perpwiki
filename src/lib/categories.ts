export const LAYERS = ["HYPERCORE", "HYPEREVM", "HIP3", "BOTH"] as const;
export type Layer = (typeof LAYERS)[number];

export const LAYER_META: Record<string, { label: string; color: string; description: string }> = {
  HYPERCORE: {
    label: "HyperCore",
    color: "#00E5A0",
    description: "Native on-chain perpetual orderbook",
  },
  HYPEREVM: {
    label: "HyperEVM",
    color: "#00C8E0",
    description: "EVM smart contracts on Hyperliquid L1",
  },
  HIP3: {
    label: "HIP-3",
    color: "#A78BFA",
    description: "Permissionless custom perpetual markets",
  },
  BOTH: {
    label: "Multi-Layer",
    color: "#F0B429",
    description: "Spans multiple Hyperliquid layers",
  },
};

export const CATEGORIES = [
  // HyperCore
  "Trading Terminals & Interfaces",
  "Trading Bots & Automation",
  "Analytics & Data",
  "Portfolio Trackers",
  // HyperEVM
  "Liquid Staking",
  "Lending & Borrowing",
  "Decentralized Exchanges",
  "Yield & Vaults",
  "Bridges & Cross-Chain",
  "Wallets & Account Abstraction",
  // HIP-3
  "Prediction Markets",
  "RWA Perps",
  "Event Contracts",
  "Meme Perps",
  // Infrastructure
  "Oracles",
  "SDKs & Developer Tools",
  "Security & Audits",
  "Data APIs",
  // NFTs & Culture
  "NFTs & Collectibles",
  // Community
  "Communities & DAOs",
  "Media & Education",
  "Airdrop Trackers",
] as const;

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToCategory(slug: string): string | undefined {
  return CATEGORIES.find((c) => categoryToSlug(c) === slug);
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Trading Terminals & Interfaces": "Professional trading interfaces and frontends for Hyperliquid's HyperCore orderbook. These platforms provide advanced charting, order management, and portfolio tracking for perp and spot traders.",
  "Trading Bots & Automation": "Automated trading solutions for Hyperliquid — from copy trading to algorithmic strategies and grid bots. Execute trades 24/7 without manual intervention.",
  "Analytics & Data": "Data analytics platforms providing market intelligence, whale tracking, and on-chain metrics for the Hyperliquid ecosystem.",
  "Portfolio Trackers": "Portfolio management tools to track your positions, PnL, and asset allocation across Hyperliquid and HyperEVM protocols.",
  "Liquid Staking": "Stake HYPE and receive liquid staking tokens (LSTs) that can be used across DeFi while earning staking rewards. Key to HyperEVM's composability.",
  "Lending & Borrowing": "Lending markets on HyperEVM where users can supply assets to earn interest or borrow against their collateral, including liquid staking tokens.",
  "Decentralized Exchanges": "AMM-based decentralized exchanges on HyperEVM for swapping tokens. Complement HyperCore's orderbook with automated liquidity pools.",
  "Yield & Vaults": "Yield aggregation and vault strategies on Hyperliquid — from delta-neutral funding rate farming to automated DeFi yield optimization.",
  "Bridges & Cross-Chain": "Bridge protocols enabling asset transfers between Hyperliquid and other blockchains. Essential infrastructure for onboarding liquidity.",
  "Wallets & Account Abstraction": "Wallet solutions and account abstraction tools for interacting with HyperEVM smart contracts and managing on-chain assets.",
  "Prediction Markets": "Prediction market protocols on Hyperliquid using HIP-3 permissionless perp markets for event-based trading.",
  "RWA Perps": "Real-world asset perpetual futures — trade stocks, commodities, and other traditional assets as perps on Hyperliquid via HIP-3.",
  "Event Contracts": "Event-based contracts and binary outcomes trading on Hyperliquid's HIP-3 infrastructure.",
  "Meme Perps": "Meme token perpetual futures and community-driven markets on Hyperliquid's HIP-3 layer.",
  "Oracles": "Price oracle networks providing reliable data feeds to HyperEVM smart contracts for DeFi protocols.",
  "SDKs & Developer Tools": "Developer toolkits, SDKs, and APIs for building on Hyperliquid's HyperCore and HyperEVM layers.",
  "Security & Audits": "Security firms and audit protocols ensuring the safety of HyperEVM smart contracts and DeFi protocols.",
  "Data APIs": "API providers offering programmatic access to Hyperliquid market data, on-chain analytics, and trading infrastructure.",
  "NFTs & Collectibles": "NFT platforms and digital collectibles on HyperEVM — from PFP collections to on-chain art.",
  "Communities & DAOs": "Community-driven organizations and DAOs building governance and social infrastructure for the Hyperliquid ecosystem.",
  "Media & Education": "Educational content creators, media outlets, and information platforms covering the Hyperliquid ecosystem.",
  "Airdrop Trackers": "Tools and platforms for tracking potential airdrops, token distributions, and reward programs in the Hyperliquid ecosystem.",
};
