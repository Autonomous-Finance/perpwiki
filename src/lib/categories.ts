export const LAYERS = ["HYPERCORE", "HYPEREVM", "HIP3", "BOTH"] as const;
export type Layer = (typeof LAYERS)[number];

export const LAYER_META: Record<string, { label: string; color: string; description: string }> = {
  HYPERCORE: {
    label: "HyperCore",
    color: "#4B8EF4",
    description: "Native on-chain perpetual orderbook",
  },
  HYPEREVM: {
    label: "HyperEVM",
    color: "#818CF8",
    description: "EVM smart contracts on Hyperliquid L1",
  },
  HIP3: {
    label: "HIP-3",
    color: "#C084FC",
    description: "Permissionless custom perpetual markets",
  },
  BOTH: {
    label: "Multi-Layer",
    color: "#60A5FA",
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
