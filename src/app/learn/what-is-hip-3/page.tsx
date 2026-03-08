import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hip-3";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
};

const TOC = [
  { id: "what-is-hip-3", title: "What Is HIP-3?" },
  { id: "how-it-works", title: "How It Works" },
  { id: "economics", title: "The Economics" },
  { id: "use-cases", title: "Use Cases" },
  { id: "live-projects", title: "Live HIP-3 Projects" },
  { id: "risks", title: "Risks and Limitations" },
  { id: "future", title: "The Future of HIP-3" },
];

export default function WhatIsHIP3Page() {
  return (
    <LearnLayout article={article} prev={prev} next={next} toc={TOC}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.datePublished,
          author: { "@type": "Organization", name: "HYPE.WIKI" },
          publisher: { "@type": "Organization", name: "HYPE.WIKI" },
        }}
      />

      <H2 id="what-is-hip-3">What Is HIP-3?</H2>
      <P>
        HIP-3 is a Hyperliquid Improvement Proposal that enables permissionless perpetual
        futures markets on the Hyperliquid L1. Before HIP-3, only the Hyperliquid team could
        list new perpetual contracts. HIP-3 changes this by allowing anyone to create a
        perpetual futures market for any asset — as long as they meet the economic requirements.
      </P>
      <P>
        Think of HIP-3 as the &quot;Uniswap moment&quot; for perpetual futures. Just as
        Uniswap allowed anyone to create a token trading pair, HIP-3 allows anyone to create
        a leveraged perpetual market. The difference is that these markets run on Hyperliquid&apos;s
        native order book with sub-second execution, not on a slow AMM.
      </P>
      <P>
        This is a profound primitive. Perpetual futures are the most traded instrument in
        crypto, and HIP-3 makes them permissionless. Prediction markets, stock perpetuals,
        commodity perps, meme coin perps, and entirely novel financial products can all be
        built using HIP-3 without permission from anyone.
      </P>

      <H2 id="how-it-works">How It Works</H2>
      <P>
        To launch a HIP-3 market, a deployer must purchase a &quot;ticker&quot; — a unique
        identifier for the perpetual contract. Ticker purchases require a significant HYPE
        bond (currently around 500,000 HYPE), which serves as an economic commitment to
        prevent spam and ensure market quality. This bond can be crowdfunded through platforms
        like <InlineLink href="/projects/kinetiq">Kinetiq&apos;s Launch</InlineLink> feature.
      </P>
      <P>
        Once a ticker is acquired, the deployer configures the market parameters: the
        underlying asset, the oracle source, maximum leverage, and initial margin requirements.
        The market then goes live on HyperCore&apos;s native order book with the same
        matching engine, speed, and liquidity infrastructure as any other Hyperliquid
        perpetual.
      </P>
      <P>
        The oracle system is flexible. HIP-3 markets can use Hyperliquid&apos;s native
        oracle, external price feeds, or custom oracle implementations. This flexibility is
        what enables non-crypto assets — the oracle just needs to provide a reliable price
        feed for whatever the underlying asset is.
      </P>

      <H2 id="economics">The Economics</H2>
      <P>
        HIP-3 introduces a revenue-sharing model between the protocol and market deployers.
        Trading fees generated on a HIP-3 market are split — a portion goes to the deployer
        (as an incentive for creating valuable markets) and a portion flows to the protocol
        and HYPE stakers.
      </P>
      <P>
        The ticker bond serves multiple purposes: it prevents spam listings, it ensures the
        deployer has economic skin in the game, and it creates demand for HYPE tokens. The
        bond is not burned — it is locked while the market is active, creating a form of
        productive staking. If a market becomes inactive, the deployer can reclaim the bond
        under certain conditions.
      </P>
      <P>
        This economic model aligns incentives well. Market deployers are motivated to create
        markets that attract volume (because they earn fees), while the bond requirement
        ensures only serious deployers participate. Markets that fail to attract volume simply
        fade away, while successful ones become self-sustaining.
      </P>

      <H2 id="use-cases">Use Cases</H2>
      <P>
        HIP-3 has unlocked several categories of markets that did not previously exist on-chain:
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Stock perpetuals.</strong>{" "}
        <InlineLink href="/projects/trade-xyz">Trade.xyz (HyperUnit)</InlineLink> was the first
        project to purchase a HIP-3 ticker and has launched 24/7 perpetual trading for US
        stocks including Tesla, Apple, Nvidia, and a synthetic Nasdaq index. This means anyone
        in the world can gain leveraged exposure to US equities without a brokerage account.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Prediction markets.</strong>{" "}
        <InlineLink href="/projects/hyperodd">HyperOdd</InlineLink> builds leveraged prediction
        markets on HIP-3, allowing users to trade on political, sports, and economic outcomes
        with up to 20x leverage. Unlike traditional prediction markets where positions are
        binary, HIP-3 perps allow continuous price discovery.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Pre-IPO markets.</strong>{" "}
        <InlineLink href="/projects/ventuals">Ventuals</InlineLink> creates perpetual markets
        for pre-IPO company valuations, letting users trade implied valuations of companies
        like SpaceX and OpenAI before they go public.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">RWA perpetuals.</strong> Beyond stocks, HIP-3
        enables perpetual markets for commodities, forex, interest rates, and other real-world
        assets. Any asset with a reliable price feed can be turned into a perpetual market.
      </P>

      <H2 id="live-projects">Live HIP-3 Projects</H2>
      <P>
        The HIP-3 ecosystem is still young but growing rapidly. The most notable projects include:
      </P>
      <P>
        <InlineLink href="/projects/trade-xyz">Trade.xyz (HyperUnit)</InlineLink> — the
        highest-volume HIP-3 market, processing over $500M in daily stock perp volume. They
        were the first to purchase a HIP-3 ticker (XYZ100) and have demonstrated that
        real-world asset perpetuals can achieve significant liquidity.
      </P>
      <P>
        <InlineLink href="/projects/hyperodd">HyperOdd</InlineLink> — the first leveraged
        prediction market on Hyperliquid, born from a community hackathon. Uses SEDA-powered
        Polymarket data feeds and Privy for account abstraction.
      </P>
      <P>
        <InlineLink href="/projects/ventuals">Ventuals</InlineLink> — pre-IPO perpetuals with
        a unique hybrid oracle system. Self-funded through a community NFT mint rather than VC
        funding.
      </P>

      <H2 id="risks">Risks and Limitations</H2>
      <P>
        HIP-3 markets carry risks beyond standard perp trading. Oracle quality varies between
        markets — a poorly configured oracle can lead to unfair liquidations or price
        manipulation. Unlike core Hyperliquid markets that have deep institutional liquidity,
        HIP-3 markets may have thinner order books, especially in their early days.
      </P>
      <P>
        The 500,000 HYPE bond requirement is substantial, which limits who can deploy markets.
        While crowdfunding through Kinetiq&apos;s Launch platform makes this more accessible,
        it still represents a significant barrier. This is by design — it prevents spam — but
        it also means potentially valuable niche markets may not get created.
      </P>
      <P>
        Regulatory risk is heightened for HIP-3 markets that track real-world securities.
        Stock perpetuals exist in a legal gray zone, and their long-term regulatory status is
        uncertain. Users trading these products should understand that regulations could change.
      </P>

      <H2 id="future">The Future of HIP-3</H2>
      <P>
        HIP-3 is still in its early stages, and the design space it opens is enormous. As
        oracle infrastructure matures and liquidity deepens, expect to see markets for
        increasingly exotic underlyings: weather derivatives, carbon credits, sports outcome
        perpetuals, and financial instruments that do not exist in traditional markets.
      </P>
      <P>
        The combination of permissionless market creation, sub-second execution, and leverage
        creates a powerful primitive. HIP-3 may ultimately be the feature that most clearly
        differentiates Hyperliquid from every other blockchain — not just another DEX, but a
        platform for creating any financial market, without permission.
      </P>

      <CTA href="/layer/hip3">Explore HIP-3 projects &rarr;</CTA>
    </LearnLayout>
  );
}
