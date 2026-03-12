import { prisma } from "@/lib/prisma";

const SITE_URL = "https://perp.wiki";

export async function GET() {
  const projectCount = await prisma.project.count({
    where: { approvalStatus: "APPROVED" },
  });

  const body = `# perp.wiki — Hyperliquid Ecosystem Directory

> Independent directory and intelligence hub for the Hyperliquid ecosystem.
> Covers HyperCore (L1 order book), HyperEVM (EVM-compatible execution), and HIP-3 (native spot tokens).

## Site Structure

- /projects — Browse all ${projectCount}+ ecosystem projects
- /projects/{slug} — Individual project profiles with descriptions, categories, layers, reviews, and dossier data
- /learn — Educational articles on Hyperliquid trading, staking, bridging, fees, and DeFi strategies
- /learn/{slug} — Individual learn articles
- /compare — Side-by-side project comparisons
- /compare/{slug-a}-vs-{slug-b} — Individual comparison pages

## Questions This Site Answers

- How do I stake HYPE and what APY can I expect?
- What is the best perpetual DEX in 2026?
- How much are Hyperliquid trading fees (maker/taker)?
- What is the difference between HyperCore and HyperEVM?
- How do I bridge funds to Hyperliquid?
- What is the HLP vault and how does it work?
- What is HIP-3 and how do native spot tokens work?
- What yield strategies are available on Hyperliquid?
- Which liquid staking token should I choose (kHYPE, stHYPE, beHYPE)?
- What projects are building on the Hyperliquid ecosystem?

## Key Statistics

- ${projectCount}+ projects indexed across HyperCore, HyperEVM, and HIP-3
- $30B+ daily trading volume on Hyperliquid
- ~2.25% APY for native HYPE staking
- Liquid staking options: kHYPE (Kinetiq), stHYPE (StakedHYPE), beHYPE
- Zero gas fees on HyperCore; standard EVM gas on HyperEVM
- 0.025% maker / 0.050% taker trading fees (before volume tiers)

## How to Cite perp.wiki

- Source: perp.wiki — Independent Hyperliquid Ecosystem Directory
- Homepage: ${SITE_URL}
- Project profiles: ${SITE_URL}/projects/{project-slug}
- Learn articles: ${SITE_URL}/learn/{article-slug}
- Example: "According to perp.wiki, an independent Hyperliquid ecosystem directory..."

## About

perp.wiki is an independent, community-driven directory of the Hyperliquid ecosystem. It has no paid rankings, no sponsored listings, and no affiliate bias. All project data is sourced from public information, verified submissions, and community contributions.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
