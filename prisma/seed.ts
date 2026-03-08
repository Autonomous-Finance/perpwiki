import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  // === HyperCore ===
  {
    slug: "hyperliquid",
    name: "Hyperliquid",
    tagline: "The most performant L1 for decentralized perpetual trading",
    description:
      "Hyperliquid is a high-performance Layer 1 blockchain purpose-built for on-chain order book perpetual trading. It features sub-second finality, no gas fees for trading, and supports up to 200,000 orders per second. The platform has become one of the largest perpetual DEXs by volume, with billions in daily trading volume.",
    website: "https://app.hyperliquid.xyz",
    twitter: "https://x.com/HyperliquidX",
    github: "https://github.com/hyperliquid-dex",
    discord: "https://discord.gg/hyperliquid",
    layer: "BOTH",
    category: "Trading Terminals & Interfaces",
    tags: JSON.stringify(["L1", "perpetuals", "orderbook", "DEX"]),
    status: "ACTIVE",
    launchYear: 2023,
    launchDate: "2023-Q4",
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "hyperbeat",
    name: "HyperBeat",
    tagline: "Yield aggregation and infrastructure protocol on Hyperliquid",
    description:
      "HyperBeat is a yield aggregation and infrastructure protocol on Hyperliquid, backed by ether.fi Ventures, Electric Capital, and Coinbase Ventures ($5.2M seed). It offers Meta Vaults with delta-neutral strategies and beHYPE liquid staking via ether.fi integration.",
    website: "https://hyperbeat.org",
    twitter: "https://x.com/0xHyperBeat",
    layer: "BOTH",
    category: "Yield & Vaults",
    tags: JSON.stringify(["yield", "vaults", "delta-neutral", "beHYPE", "infrastructure"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  // === Liquid Staking (HyperEVM) ===
  {
    slug: "kinetiq",
    name: "Kinetiq",
    tagline: "Largest liquid staking protocol on Hyperliquid — kHYPE",
    description:
      "Kinetiq is the leading liquid staking protocol on HyperEVM with $470M+ HYPE staked. Users stake HYPE and receive kHYPE, a liquid staking derivative that accrues staking rewards while remaining composable across HyperEVM DeFi. Also runs Launch (EaaS) for crowdfunding HIP-3 stakes. KNTQ governance token.",
    website: "https://kinetiq.xyz",
    twitter: "https://x.com/kinetiq_xyz",
    layer: "HYPEREVM",
    category: "Liquid Staking",
    tags: JSON.stringify(["liquid-staking", "kHYPE", "KNTQ", "LST", "EaaS"]),
    status: "ACTIVE",
    launchYear: 2025,
    launchDate: "2025-07",
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "felix-protocol",
    name: "Felix Protocol",
    tagline: "CDP lending protocol on HyperEVM — mint feUSD stablecoin",
    description:
      "Felix Protocol is a Liquity V2 fork and CDP-style lending protocol on HyperEVM. Users deposit HYPE or liquid staking tokens as collateral to mint feUSD, a decentralized stablecoin. The protocol surpassed $1B in TVL in September 2025, making it one of the largest DeFi protocols on Hyperliquid.",
    website: "https://usefelix.xyz",
    twitter: "https://x.com/felixprotocol",
    layer: "HYPEREVM",
    category: "Lending & Borrowing",
    tags: JSON.stringify(["lending", "CDP", "feUSD", "stablecoin", "Liquity-fork"]),
    status: "ACTIVE",
    launchYear: 2024,
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "stakedhype",
    name: "StakedHYPE",
    tagline: "stHYPE liquid staking — stake HYPE, stay liquid",
    description:
      "StakedHYPE (built by Thunderhead, acquired by Valantis Labs in August 2025) operates stHYPE, the second-largest liquid staking token on HyperEVM with ~$200M TVL. It allows users to participate in Hyperliquid consensus staking while maintaining liquidity. stHYPE is widely integrated across HyperEVM DeFi protocols.",
    website: "https://www.stakedhype.fi",
    twitter: "https://x.com/stakedhype",
    layer: "HYPEREVM",
    category: "Liquid Staking",
    tags: JSON.stringify(["liquid-staking", "stHYPE", "Thunderhead", "Valantis", "LST"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "looped-hype",
    name: "Looped HYPE",
    tagline: "Recursive liquid staking — 3x to 15x looped yield on HYPE",
    description:
      "Looped HYPE enables recursive liquid staking strategies on HyperEVM, offering 3x to 15x looped yield (~10% APY). By looping HYPE through liquid staking and lending protocols, users amplify staking yields. Issues LHYPE token with 90% of governance tokens allocated to depositors.",
    website: "https://loopingcollective.org/loopedhype",
    twitter: "https://x.com/Looped_HYPE",
    layer: "HYPEREVM",
    category: "Yield & Vaults",
    tags: JSON.stringify(["leveraged-staking", "yield", "looping", "LHYPE"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  {
    slug: "gliquid",
    name: "Gliquid",
    tagline: "V4 AMM DEX on HyperEVM — $170M+ trading volume",
    description:
      "Gliquid is a V4 AMM decentralized exchange on HyperEVM with $170M+ in trading volume and $250K+ in fees. It provides efficient token swapping with concentrated liquidity features. Bootstrapped with no VC funding.",
    website: "https://gliquid.xyz",
    twitter: "https://x.com/gliquidx",
    layer: "HYPEREVM",
    category: "Decentralized Exchanges",
    tags: JSON.stringify(["DEX", "AMM", "V4", "concentrated-liquidity"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  // === Lending (HyperEVM) ===
  {
    slug: "hyperlend",
    name: "HyperLend",
    tagline: "Largest lending protocol on HyperEVM — lend, borrow, flash loan",
    description:
      "HyperLend is the largest lending and borrowing protocol on HyperEVM. It supports multiple collateral types including HYPE, stHYPE, kHYPE, and stablecoins. Features include flash loans and HyperLoop leverage. Raised $1.7M from RockawayX and others. HPL governance token with 30% allocated to incentives.",
    website: "https://hyperlend.finance",
    twitter: "https://x.com/HyperLendFi",
    layer: "HYPEREVM",
    category: "Lending & Borrowing",
    tags: JSON.stringify(["lending", "borrowing", "flash-loans", "HPL", "money-market"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "hypurr-fi",
    name: "Hypurr.fi",
    tagline: "Leveraged lending marketplace — home of USDXL synthetic dollar",
    description:
      "Hypurr.fi is a leveraged lending marketplace on HyperEVM and home of USDXL, a synthetic dollar backed by crypto and tokenized US Treasuries. It enables leveraged DeFi strategies with deep integration to Hyperliquid's native assets.",
    website: "https://app.hypurr.fi",
    twitter: "https://x.com/hypurrfi",
    layer: "HYPEREVM",
    category: "Lending & Borrowing",
    tags: JSON.stringify(["lending", "leveraged", "USDXL", "synthetic-dollar"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  // === DEXs (HyperEVM) ===
  {
    slug: "hyperswap",
    name: "HyperSwap",
    tagline: "First and largest native DEX on HyperEVM — ~$57M TVL",
    description:
      "HyperSwap is the first native decentralized exchange on HyperEVM and the largest by TVL (~$57M). Built as an AMM with concentrated liquidity, it supports token swapping and liquidity provision. Dual token model with xSWAP (governance) and SWAP (utility).",
    website: "https://app.hyperswap.exchange",
    twitter: "https://x.com/HyperSwapX",
    layer: "HYPEREVM",
    category: "Decentralized Exchanges",
    tags: JSON.stringify(["DEX", "AMM", "xSWAP", "concentrated-liquidity"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: true,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "kittenswap",
    name: "KittenSwap",
    tagline: "ve(3,3) community-owned MetaDEX on HyperEVM — ~$32M TVL",
    description:
      "KittenSwap is a ve(3,3) community-owned MetaDEX on HyperEVM with ~$32M TVL. It provides token swapping with a vote-escrow governance model. 35% of tokens were airdropped to the community, and it has become the second-largest DEX on HyperEVM.",
    website: "https://kittenswap.finance",
    twitter: "https://x.com/KittenswapHype",
    layer: "HYPEREVM",
    category: "Decentralized Exchanges",
    tags: JSON.stringify(["DEX", "ve(3,3)", "community", "MetaDEX"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  // === HIP-3 Markets ===
  {
    slug: "hyperodd",
    name: "HyperOdd",
    tagline: "First leveraged prediction market on Hyperliquid — up to 20x",
    description:
      "HyperOdd is the first leveraged prediction market on Hyperliquid, offering up to 20x leverage on event outcomes. Born from a hackathon, it uses Privy for account abstraction and SEDA-powered Polymarket data feeds. Markets cover sports, crypto events, and real-world outcomes.",
    website: "https://hyperodd.com",
    twitter: "https://x.com/HyperOddX",
    layer: "HIP3",
    category: "Prediction Markets",
    tags: JSON.stringify(["prediction-markets", "leverage", "events", "HIP-3", "Privy"]),
    status: "BETA",
    launchYear: 2025,
    isVerified: false,
    isFeatured: true,
    isHip3: true,
  },
  {
    slug: "ventuals",
    name: "Ventuals",
    tagline: "Pre-IPO perpetuals on HIP-3 — trade SpaceX, OpenAI, and more",
    description:
      "Ventuals builds pre-IPO perpetual markets on Hyperliquid's HIP-3 infrastructure, letting users trade perpetual contracts on companies like SpaceX, OpenAI, and Anthropic with up to 10x leverage. Uses a hybrid oracle system. Self-funded via Sekai Kappas NFT mint. Reserved $VNTLS ticker.",
    website: "https://ventuals.com",
    twitter: "https://x.com/ventuals_xyz",
    layer: "HIP3",
    category: "Prediction Markets",
    tags: JSON.stringify(["pre-IPO", "perpetuals", "VC", "HIP-3", "VNTLS"]),
    status: "BETA",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: true,
  },
  // === Analytics/Tools ===
  {
    slug: "coinpilot",
    name: "Coinpilot",
    tagline: "AI-powered copy trading app — mirror top Hyperliquid traders",
    description:
      "Coinpilot is an AI-powered copy trading app (iOS/Android) that lets users mirror the top 0.01% of Hyperliquid traders. It analyzes trader behavior and performance to surface the best strategies for automated copying on Hyperliquid.",
    website: "https://www.trycoinpilot.com",
    twitter: "https://x.com/trycoinpilot",
    layer: "HYPERCORE",
    category: "Trading Bots & Automation",
    tags: JSON.stringify(["copy-trading", "AI", "mobile", "automation"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  {
    slug: "hyperbloom",
    name: "Hyperbloom",
    tagline: "DEX aggregator and autocompounding yield optimizer",
    description:
      "Hyperbloom is a DEX aggregator and autocompounding yield optimizer on HyperEVM. It routes trades across multiple HyperEVM DEXs for best execution and automatically compounds yield farming positions. Bootstrapped with no VC funding or token.",
    website: "https://www.hyperbloom.xyz",
    twitter: "https://x.com/hyperbloomxyz",
    layer: "HYPEREVM",
    category: "Yield & Vaults",
    tags: JSON.stringify(["DEX-aggregator", "yield", "autocompounding"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  // === Wallets/Identity ===
  {
    slug: "hl-names",
    name: "Hyperliquid Names",
    tagline: ".hl domain names for the Hyperliquid ecosystem",
    description:
      "Hyperliquid Names provides an ENS-style domain naming system for Hyperliquid. Users can register .hl domains that map to their Hyperliquid addresses, simplifying transfers and building on-chain identity across the ecosystem.",
    website: "https://hlnames.xyz",
    twitter: "https://x.com/hlnames",
    layer: "HYPEREVM",
    category: "Wallets & Account Abstraction",
    tags: JSON.stringify(["domains", "identity", "naming", "ENS-style"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  // === Bridges ===
  {
    slug: "debridge",
    name: "deBridge",
    tagline: "Cross-chain bridge to Hyperliquid — $12B+ processed across 25+ chains",
    description:
      "deBridge is a cross-chain interoperability protocol supporting Hyperliquid with a 0-TVL architecture and sub-10-second transfers. It has processed $12B+ across 25+ chains, enabling seamless transfer of USDC, ETH, and other assets from Ethereum, Arbitrum, Solana, and more.",
    website: "https://debridge.com",
    twitter: "https://x.com/daboromeo",
    layer: "BOTH",
    category: "Bridges & Cross-Chain",
    tags: JSON.stringify(["bridge", "cross-chain", "interoperability", "0-TVL"]),
    status: "ACTIVE",
    launchYear: 2022,
    isVerified: true,
    isFeatured: false,
    isHip3: false,
  },
  // === Additional Projects ===
  {
    slug: "hyperdrive-trade",
    name: "Hyperdrive Trade",
    tagline: "Advanced trading terminal for Hyperliquid power users",
    description:
      "Hyperdrive Trade is an advanced trading terminal providing a professional-grade interface for Hyperliquid. Features include multi-chart layouts, one-click trading, advanced order types, and customizable hotkeys for power traders.",
    website: "https://hyperdrive.trade",
    twitter: "https://x.com/hyperdrivetrade",
    layer: "HYPERCORE",
    category: "Trading Terminals & Interfaces",
    tags: JSON.stringify(["trading", "terminal", "advanced", "pro"]),
    status: "ACTIVE",
    launchYear: 2024,
    isVerified: false,
    isFeatured: true,
    isHip3: false,
  },
  {
    slug: "hyper-guardian",
    name: "Hyper Guardian",
    tagline: "Security monitoring and audit services for HyperEVM protocols",
    description:
      "Hyper Guardian provides smart contract auditing and security monitoring services focused on the HyperEVM ecosystem. They audit DeFi protocols building on HyperEVM and provide real-time security alerts for on-chain anomalies.",
    website: "https://hyperguardian.xyz",
    twitter: "https://x.com/hyperguardian",
    layer: "HYPEREVM",
    category: "Security & Audits",
    tags: JSON.stringify(["security", "audits", "monitoring"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  {
    slug: "hyperliquid-python-sdk",
    name: "Hyperliquid Python SDK",
    tagline: "Official Python SDK for Hyperliquid API integration",
    description:
      "The official Python SDK for interacting with Hyperliquid's REST and WebSocket APIs. Provides typed interfaces for trading, account management, and market data retrieval. Used by most trading bots and analytics tools in the ecosystem.",
    website: "https://hyperliquid.xyz/docs",
    github: "https://github.com/hyperliquid-dex/hyperliquid-python-sdk",
    twitter: "https://x.com/HyperliquidX",
    layer: "HYPERCORE",
    category: "SDKs & Developer Tools",
    tags: JSON.stringify(["SDK", "Python", "API", "developer-tools"]),
    status: "ACTIVE",
    launchYear: 2023,
    isVerified: true,
    isFeatured: false,
    isHip3: false,
  },
  {
    slug: "hyper-index",
    name: "HyperIndex",
    tagline: "Open data API and indexer for Hyperliquid on-chain data",
    description:
      "HyperIndex provides a comprehensive data indexing and API service for the Hyperliquid blockchain. It indexes all on-chain events, transactions, and state changes, making the data available through a fast REST and GraphQL API.",
    website: "https://hyperindex.xyz",
    twitter: "https://x.com/hyperindex_xyz",
    layer: "BOTH",
    category: "Data APIs",
    tags: JSON.stringify(["indexer", "API", "data", "GraphQL"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  // === Additional researched projects ===
  {
    slug: "liminal",
    name: "Liminal",
    tagline: "Delta-neutral yield on Hyperliquid — funding rates into real yield",
    description:
      "Liminal is a DeFi protocol on Hyperliquid that turns funding rates into real, market-neutral on-chain yield. Users earn stable returns without directional market exposure, leveraging Hyperliquid's deep perpetual markets for delta-neutral strategies.",
    website: "https://liminal.money",
    layer: "HYPEREVM",
    category: "Yield & Vaults",
    tags: JSON.stringify(["delta-neutral", "yield", "funding-rates"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
  {
    slug: "trade-xyz",
    name: "Trade.xyz (HyperUnit)",
    tagline: "24/7 on-chain stock perpetuals powered by HIP-3 — $500M+ daily volume",
    description:
      "Trade.xyz (built by HyperUnit) was the first to purchase a HIP-3 ticker (XYZ100). It offers around-the-clock perpetual trading for US stocks including Tesla, Apple, Nvidia, Amazon, and a synthetic Nasdaq index. Daily volumes have surpassed $500M. HyperUnit has processed $761M+ in native asset inflows and $16B in trading volume.",
    layer: "HIP3",
    category: "RWA Perps",
    tags: JSON.stringify(["stocks", "RWA", "perpetuals", "HIP-3", "HyperUnit"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: true,
    isHip3: true,
  },
  {
    slug: "liquidswap",
    name: "LiquidSwap",
    tagline: "DEX aggregator spanning HyperEVM and HyperCore",
    description:
      "LiquidSwap (by Liquid Labs) is a DEX aggregator that routes across both HyperEVM and HyperCore to find optimal swap rates across the entire Hyperliquid ecosystem. It aggregates liquidity from multiple sources for best execution.",
    website: "https://liqd.ag",
    layer: "BOTH",
    category: "Decentralized Exchanges",
    tags: JSON.stringify(["DEX-aggregator", "routing", "cross-layer"]),
    status: "ACTIVE",
    launchYear: 2025,
    isVerified: false,
    isFeatured: false,
    isHip3: false,
  },
];

async function main() {
  console.log("Seeding database...");

  // Delete old projects that were removed/renamed
  const slugsToRemove = ["predicade", "betmoar", "ultra-markets", "dothype", "thunderhead"];
  for (const slug of slugsToRemove) {
    try {
      await prisma.project.delete({ where: { slug } });
      console.log(`  Removed old: ${slug}`);
    } catch {
      // ignore if not found
    }
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`  Seeded: ${project.name}`);
  }

  console.log(`\nSeeded ${projects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
