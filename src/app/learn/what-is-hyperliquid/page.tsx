import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hyperliquid";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
};

const TOC = [
  { id: "what-is-hyperliquid", title: "What Is Hyperliquid?" },
  { id: "hypercore-l1", title: "The HyperCore L1" },
  { id: "how-trading-works", title: "How Trading Works" },
  { id: "hype-token", title: "The HYPE Token" },
  { id: "why-traders-use-it", title: "Why Traders Use It" },
  { id: "ecosystem", title: "The Ecosystem" },
  { id: "key-risks", title: "Key Risks" },
];

export default function WhatIsHyperliquidPage() {
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

      <H2 id="what-is-hyperliquid">What Is Hyperliquid?</H2>
      <P>
        Hyperliquid is a high-performance Layer 1 blockchain built from the ground up for
        on-chain perpetual futures trading. Unlike most decentralized exchanges that run on
        top of general-purpose blockchains like Ethereum or Solana, Hyperliquid operates its
        own dedicated chain optimized specifically for order book trading.
      </P>
      <P>
        The result is a trading experience that rivals centralized exchanges: sub-second
        transaction finality, no gas fees for placing orders, and the ability to process up to
        200,000 orders per second. Launched in late 2023, Hyperliquid quickly grew to become
        one of the highest-volume perpetual DEXs in crypto, regularly processing billions of
        dollars in daily trading volume.
      </P>
      <P>
        What makes Hyperliquid unique is its fully on-chain order book. While most DEXs use
        automated market makers (AMMs) that pool liquidity, Hyperliquid uses a central limit
        order book (CLOB) — the same model used by Binance, the NYSE, and every traditional
        exchange. This means traders can place limit orders, stop losses, and take profits
        with the same precision they expect from centralized platforms.
      </P>

      <H2 id="hypercore-l1">The HyperCore L1</H2>
      <P>
        At the heart of Hyperliquid is HyperCore — a custom Layer 1 blockchain running the
        HyperBFT consensus mechanism. HyperBFT is a modified version of HotStuff, the same
        family of consensus algorithms used by Meta&apos;s abandoned Diem project, but
        optimized for trading workloads.
      </P>
      <P>
        HyperCore achieves its speed by separating the consensus layer from the execution
        layer. All trading orders flow through a deterministic state machine that processes
        them sequentially, ensuring consistent ordering without the non-determinism that
        plagues general-purpose blockchains. The chain finalizes blocks in under one second,
        meaning trades confirm almost instantly.
      </P>
      <P>
        The chain also supports HyperEVM — a fully compatible Ethereum Virtual Machine that
        runs as a separate execution environment on the same L1. This lets developers deploy
        Solidity smart contracts (DeFi protocols, lending platforms, NFT marketplaces) while
        leveraging HyperCore&apos;s speed and liquidity. Read more in our{" "}
        <InlineLink href="/learn/hypercore-vs-hyperevm">HyperCore vs HyperEVM guide</InlineLink>.
      </P>

      <H2 id="how-trading-works">How Trading Works</H2>
      <P>
        Trading on Hyperliquid works through a fully on-chain order book. When you place a
        trade, your order is submitted to the blockchain, matched against the book, and
        settled — all on-chain, all in under a second. There are no off-chain order relays,
        no centralized sequencers making matching decisions, and no trust assumptions beyond
        the chain&apos;s own consensus.
      </P>
      <P>
        The platform supports over 100 perpetual futures markets including BTC, ETH, SOL, and
        dozens of altcoins. Leverage ranges from 1x to 50x depending on the asset. Funding
        rates are calculated every hour based on the spread between the perpetual price and
        the spot index price, similar to how centralized exchanges handle perps.
      </P>
      <P>
        For spot trading, Hyperliquid operates a native spot order book with direct token
        listings. HIP-1 governs native token standards, while HIP-2 provides a mechanism for
        bootstrapping liquidity on new spot listings.
      </P>

      <H2 id="hype-token">The HYPE Token</H2>
      <P>
        HYPE is the native token of the Hyperliquid ecosystem. It serves multiple purposes:
        staking for network security, governance over protocol parameters, and as the base gas
        token for HyperEVM transactions. The token launched via one of the largest airdrops in
        crypto history, distributing a significant portion of supply to early traders and
        community members.
      </P>
      <P>
        HYPE can be staked directly to Hyperliquid validators to earn staking rewards. A
        growing ecosystem of liquid staking protocols — including{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq (kHYPE)</InlineLink>,{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE (stHYPE)</InlineLink>, and others
        — allow users to stake while maintaining liquidity. These liquid staking tokens have
        become foundational DeFi primitives on HyperEVM.
      </P>

      <H2 id="why-traders-use-it">Why Traders Use It</H2>
      <P>
        Hyperliquid&apos;s appeal comes down to a few key advantages over both centralized and
        decentralized alternatives. First, the performance: order placement and execution is
        fast enough that active traders can run strategies that would be impossible on slower
        chains. Second, the cost: trading fees are competitive with centralized exchanges, and
        there are no gas costs for order placement.
      </P>
      <P>
        Third, and perhaps most importantly: self-custody. Funds stay in your own wallet at
        all times. There is no deposit to a centralized entity, no KYC requirement, and no
        withdrawal delay. The rise of exchange bankruptcies and frozen withdrawals in recent
        years has driven significant volume toward non-custodial alternatives, and
        Hyperliquid&apos;s professional-grade execution makes it the most credible option.
      </P>
      <P>
        The platform also supports vault strategies, where users can deposit into
        community-managed trading vaults that execute strategies on their behalf — a feature
        that has attracted both retail and institutional participants.
      </P>

      <H2 id="ecosystem">The Ecosystem</H2>
      <P>
        Beyond the core trading platform, a rich ecosystem has developed around Hyperliquid.
        On HyperEVM, lending protocols like{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> and{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> allow users to
        borrow against their HYPE and liquid staking tokens. DEXs like{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> and{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> provide spot trading
        for HyperEVM-native tokens.
      </P>
      <P>
        HIP-3, the permissionless perpetual market standard, has enabled prediction markets,
        stock perpetuals, and other novel financial products. Read our{" "}
        <InlineLink href="/learn/what-is-hip-3">What Is HIP-3?</InlineLink> guide for a deep dive.
      </P>

      <H2 id="key-risks">Key Risks</H2>
      <P>
        Hyperliquid is not without risks. The chain is still relatively young and operates
        with a smaller validator set than more established networks. While trading is
        non-custodial, the bridge from Ethereum (used to deposit USDC) has its own trust
        assumptions. Smart contract risk on HyperEVM is real, particularly for newer DeFi
        protocols that may not have undergone thorough audits.
      </P>
      <P>
        Perpetual futures trading itself carries significant financial risk. Leverage amplifies
        both gains and losses, and liquidation can happen quickly in volatile markets. Users
        should understand these risks thoroughly before trading.
      </P>
      <P>
        Finally, regulatory uncertainty remains a factor. Like all decentralized trading
        platforms, Hyperliquid operates in a gray area in many jurisdictions. The regulatory
        landscape is evolving, and users should stay informed about the rules in their region.
      </P>

      <CTA href="/">Browse the full ecosystem &rarr;</CTA>
    </LearnLayout>
  );
}
