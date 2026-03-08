import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "best-hyperevm-projects";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Best HyperEVM Projects in 2026 | PerpWiki",
  description: article.description,
};

const TOC = [
  { id: "overview", title: "HyperEVM in 2026" },
  { id: "liquid-staking", title: "Liquid Staking" },
  { id: "lending", title: "Lending & Borrowing" },
  { id: "dexs", title: "Decentralized Exchanges" },
  { id: "yield", title: "Yield & Vaults" },
  { id: "infrastructure", title: "Infrastructure" },
  { id: "how-to-choose", title: "How to Choose" },
];

const FAQ = [
  {
    question: "What are the best HyperEVM projects?",
    answer:
      "The top HyperEVM projects by TVL and usage include Kinetiq (liquid staking, $470M+ staked), Felix Protocol ($1B+ TVL lending), HyperLend (largest money market), HyperSwap (leading DEX), and HyperBeat (yield aggregation). These protocols form the core DeFi stack on Hyperliquid's EVM layer.",
  },
  {
    question: "What is HyperEVM?",
    answer:
      "HyperEVM is the EVM-compatible smart contract layer running on Hyperliquid L1. It allows developers to deploy Solidity contracts that can interact with HyperCore's native order book and liquidity, enabling DeFi protocols like lending, DEXs, and liquid staking.",
  },
];

export default function BestHyperEvmProjectsPage() {
  return (
    <LearnLayout article={article} prev={prev} next={next} toc={TOC}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.datePublished,
          author: { "@type": "Organization", name: "PerpWiki" },
          publisher: { "@type": "Organization", name: "PerpWiki" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />

      <H2 id="overview">HyperEVM: The Smart Contract Layer on Hyperliquid</H2>
      <P>
        HyperEVM is Hyperliquid&apos;s EVM-compatible execution environment, running alongside HyperCore
        on the same L1. It launched in early 2025 and has rapidly attracted a growing ecosystem of DeFi
        protocols — from liquid staking and lending to AMM DEXs and yield optimizers. With over 136
        projects now building on Hyperliquid, the HyperEVM DeFi stack is one of the fastest-growing
        in crypto.
      </P>
      <P>
        What makes HyperEVM projects unique is their ability to compose with HyperCore&apos;s native
        order book and deep perpetual liquidity. This means lending protocols can accept perp positions
        as collateral, DEXs can route through the native order book, and yield strategies can capture
        funding rates from Hyperliquid&apos;s $3B+ daily volume.
      </P>

      <H2 id="liquid-staking">Liquid Staking: Kinetiq & StakedHYPE</H2>
      <P>
        Liquid staking has become the foundation of HyperEVM DeFi.{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the largest protocol with $470M+
        HYPE staked. Users deposit HYPE and receive kHYPE, a liquid staking token that accrues validator
        rewards while remaining composable across DeFi. kHYPE can be used as collateral on lending
        protocols, traded on DEXs, or looped for amplified yield.
      </P>
      <P>
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> (operated by Valantis Labs) is
        the second-largest LST with ~$200M TVL, offering stHYPE with deep integrations across the
        ecosystem. Between Kinetiq and StakedHYPE, liquid staking tokens have become the primary
        collateral asset in HyperEVM DeFi.
      </P>

      <H2 id="lending">Lending & Borrowing</H2>
      <P>
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> is the largest DeFi
        protocol on Hyperliquid by TVL, surpassing $1B in September 2025. It&apos;s a CDP-style lending
        protocol (forked from Liquity V2) where users deposit HYPE or LSTs as collateral to mint feUSD,
        a decentralized stablecoin. feUSD has become the primary stablecoin on HyperEVM.
      </P>
      <P>
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> is the largest money market,
        supporting HYPE, stHYPE, kHYPE, and stablecoins with features like flash loans and HyperLoop
        leverage. <InlineLink href="/projects/sentiment">Sentiment</InlineLink> introduced a novel
        approach — it was the first protocol to accept perpetual futures positions as collateral,
        unlocking capital efficiency unique to Hyperliquid.
      </P>
      <P>
        <InlineLink href="/projects/morpho">Morpho</InlineLink>, with $4B+ TVL across 17 networks,
        deployed on HyperEVM with $500M+ TVL, offering permissionless isolated lending markets.
      </P>

      <H2 id="dexs">Decentralized Exchanges</H2>
      <P>
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> is the first and largest native
        DEX on HyperEVM with ~$57M TVL, offering concentrated liquidity AMM pools.{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> is the second-largest at ~$32M
        TVL, using a ve(3,3) governance model where 35% of tokens were airdropped to the community.
      </P>
      <P>
        <InlineLink href="/projects/valantis">Valantis</InlineLink> stands out with its STEX pools
        optimized specifically for liquid staking tokens, offering the highest-yielding LST pools on
        HyperEVM. Valantis acquired StakedHYPE in August 2025, combining DEX and LST infrastructure.
      </P>

      <H2 id="yield">Yield & Vaults</H2>
      <P>
        <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink> is a yield aggregation protocol
        backed by ether.fi Ventures, Electric Capital, and Coinbase Ventures ($5.2M seed). Its Meta
        Vaults deploy delta-neutral strategies, and it offers beHYPE liquid staking via ether.fi
        integration.
      </P>
      <P>
        <InlineLink href="/projects/looped-hype">Looped HYPE</InlineLink> enables recursive staking
        with 3x to 15x leverage for ~10% APY.{" "}
        <InlineLink href="/projects/mizu">Mizu</InlineLink> automates deployment across top HyperEVM
        protocols through multi-asset vaults (HyperETH, HyperBTC, HyperUSD).
      </P>

      <H2 id="infrastructure">Infrastructure</H2>
      <P>
        <InlineLink href="/projects/redstone">RedStone</InlineLink> provides oracle infrastructure,
        securing ~99.5% of oracle-protected value on HyperEVM. Its HyperStone product delivers
        3-millisecond price updates for HIP-3 markets. Cross-chain bridges including{" "}
        <InlineLink href="/projects/debridge">deBridge</InlineLink>,{" "}
        <InlineLink href="/projects/across-protocol">Across Protocol</InlineLink>, and{" "}
        <InlineLink href="/projects/layerzero">LayerZero</InlineLink> connect HyperEVM to 120+ chains.
      </P>

      <H2 id="how-to-choose">How to Choose Projects</H2>
      <P>
        When evaluating HyperEVM projects, consider TVL (a proxy for trust and usage), audit status,
        team background, and token distribution. Projects with verified status on PerpWiki have been
        confirmed as legitimate by our research team. Always check if the protocol has been audited
        and understand the specific risks of each DeFi strategy before committing capital.
      </P>

      <CTA href="/projects?layer=HYPEREVM">Browse all HyperEVM projects &rarr;</CTA>
    </LearnLayout>
  );
}
