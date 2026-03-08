import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hyperevm";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "What Is HyperEVM? Hyperliquid's Ethereum Layer Explained 2026 | perp.wiki",
  description:
    "HyperEVM is Hyperliquid's EVM-compatible smart contract layer. Learn how it connects to HyperCore, which projects are building on it, and how to use HyperEVM apps.",
};

const TOC = [
  { id: "what-is-it", title: "What Is HyperEVM?" },
  { id: "how-it-works", title: "How It Works" },
  { id: "hypercore-connection", title: "Connection to HyperCore" },
  { id: "what-you-can-build", title: "What You Can Build" },
  { id: "key-projects", title: "Key Projects" },
  { id: "getting-started", title: "Getting Started" },
];

const FAQ = [
  {
    question: "What is HyperEVM?",
    answer:
      "HyperEVM is the EVM-compatible smart contract layer on Hyperliquid L1. It runs alongside HyperCore (the native trading layer) on the same blockchain, allowing developers to deploy Solidity smart contracts that can interact with Hyperliquid's order book and deep liquidity.",
  },
  {
    question: "Is HyperEVM the same as Ethereum?",
    answer:
      "HyperEVM is compatible with Ethereum's Virtual Machine (EVM), meaning developers can deploy the same Solidity smart contracts they would on Ethereum. However, it runs on Hyperliquid's own L1 blockchain with sub-second finality and has native access to HyperCore's order book liquidity.",
  },
  {
    question: "How do I use HyperEVM?",
    answer:
      "You can use HyperEVM by connecting your wallet (like MetaMask) to the HyperEVM network and bridging HYPE for gas fees. From there, you can interact with any HyperEVM DeFi protocol — including lending, staking, and trading apps.",
  },
];

export default function WhatIsHyperEvmPage() {
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

      <H2 id="what-is-it">What Is HyperEVM?</H2>
      <P>
        HyperEVM is the EVM-compatible smart contract layer on Hyperliquid L1. If HyperCore is the
        engine that powers Hyperliquid&apos;s native perpetual trading (229 markets, $3.4B+ daily
        volume), then HyperEVM is the platform where developers build everything else — lending
        protocols, liquid staking, DEXs, NFT marketplaces, and yield strategies.
      </P>
      <P>
        &quot;EVM-compatible&quot; means developers can write smart contracts in Solidity (the same
        language used on Ethereum) and deploy them on HyperEVM with minimal changes. This makes it
        easy to port existing Ethereum DeFi protocols to Hyperliquid — and many have. Over 136 projects
        now build on the Hyperliquid ecosystem, with the majority targeting HyperEVM.
      </P>

      <H2 id="how-it-works">How It Works</H2>
      <P>
        HyperEVM runs as a separate execution environment on the same Hyperliquid L1 blockchain. Both
        HyperCore (the native trading engine) and HyperEVM share the same consensus layer (HyperBFT),
        the same validator set (25 active validators), and the same state. This means they operate at
        L1 speed — sub-second block finality — rather than as a slower sidechain or L2.
      </P>
      <P>
        HYPE is the native gas token for HyperEVM transactions. Gas costs are minimal compared to
        Ethereum mainnet, making it practical for DeFi interactions that would be prohibitively
        expensive on Ethereum. The chain ID for HyperEVM is 999, and it can be added to MetaMask or
        any EVM-compatible wallet.
      </P>
      <P>
        For a deeper comparison of HyperCore and HyperEVM, read our{" "}
        <InlineLink href="/learn/hypercore-vs-hyperevm">HyperCore vs HyperEVM guide</InlineLink>.
      </P>

      <H2 id="hypercore-connection">The Connection to HyperCore</H2>
      <P>
        What makes HyperEVM special is its native connection to HyperCore. Smart contracts on HyperEVM
        can read HyperCore state — including order book data, position information, and market prices.
        This enables composable DeFi that would be impossible on a standalone chain.
      </P>
      <P>
        For example, <InlineLink href="/projects/sentiment">Sentiment</InlineLink> accepts perpetual
        futures positions from HyperCore as collateral for loans on HyperEVM — the first protocol
        anywhere to do this. Liquid staking tokens like kHYPE and stHYPE earn validator rewards from
        HyperCore consensus while being fully composable in HyperEVM DeFi.
      </P>
      <P>
        Assets can move between HyperCore and HyperEVM through native transfers. USDC deposited for
        trading on HyperCore can be transferred to HyperEVM for use in DeFi, and vice versa, without
        using an external bridge.
      </P>

      <H2 id="what-you-can-build">What You Can Build</H2>
      <P>
        HyperEVM supports anything you can build on Ethereum. The current ecosystem includes lending
        protocols (<InlineLink href="/projects/felix-protocol">Felix</InlineLink>,{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink>), liquid staking (
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink>,{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink>), AMM DEXs (
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink>,{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink>), NFT marketplaces (
        <InlineLink href="/projects/drip-trade">Drip Trade</InlineLink>), and yield aggregators (
        <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink>,{" "}
        <InlineLink href="/projects/mizu">Mizu</InlineLink>).
      </P>
      <P>
        The unique opportunity is building at the intersection of HyperCore and HyperEVM — protocols
        that leverage Hyperliquid&apos;s native order book liquidity, funding rates, and trading
        infrastructure in novel ways. This is where the most innovative HyperEVM projects differentiate
        themselves.
      </P>

      <H2 id="key-projects">Key Projects on HyperEVM</H2>
      <P>
        The largest HyperEVM projects by TVL include{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> ($1B+ TVL, CDP lending
        and feUSD stablecoin), <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> ($470M+ HYPE
        staked), <InlineLink href="/projects/morpho">Morpho</InlineLink> ($500M+ TVL, permissionless
        lending), and <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> (~$57M TVL, leading
        AMM). For a detailed breakdown, see our{" "}
        <InlineLink href="/learn/best-hyperevm-projects">Best HyperEVM Projects</InlineLink> guide.
      </P>

      <H2 id="getting-started">Getting Started</H2>
      <P>
        To use HyperEVM, add the network to your wallet (chain ID 999), bridge HYPE for gas, and
        start interacting with protocols. Most HyperEVM apps provide a seamless onboarding experience
        with wallet connection prompts. If you&apos;re a developer, the standard Ethereum tooling
        (Hardhat, Foundry, ethers.js) works out of the box — just point to HyperEVM&apos;s RPC
        endpoint.
      </P>

      <CTA href="/projects?layer=HYPEREVM">Explore HyperEVM projects &rarr;</CTA>
    </LearnLayout>
  );
}
