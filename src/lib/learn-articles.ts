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
    readingTime: "8 min",
    datePublished: "2026-01-15",
  },
  {
    slug: "hypercore-vs-hyperevm",
    title: "HyperCore vs HyperEVM: What's the Difference?",
    description:
      "Understand the two layers of Hyperliquid — HyperCore for native trading and HyperEVM for smart contract DeFi.",
    category: "Architecture",
    readingTime: "6 min",
    datePublished: "2026-01-20",
  },
  {
    slug: "what-is-hip-3",
    title: "What Is HIP-3? Permissionless Perp Markets Explained",
    description:
      "How HIP-3 lets anyone create perpetual futures markets on Hyperliquid — from stocks to prediction markets.",
    category: "Protocol",
    readingTime: "7 min",
    datePublished: "2026-02-01",
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
