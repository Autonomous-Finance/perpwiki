import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hypercore-vs-hyperevm";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "HyperCore vs HyperEVM — What's the Difference? | perp.wiki",
  description:
    "HyperCore is Hyperliquid's native trading layer; HyperEVM is the EVM-compatible smart contract layer. Full comparison of features, speed, and use cases.",
};

const TOC = [
  { id: "overview", title: "Overview" },
  { id: "what-is-hypercore", title: "What Is HyperCore?" },
  { id: "what-is-hyperevm", title: "What Is HyperEVM?" },
  { id: "how-they-interact", title: "How They Interact" },
  { id: "comparison", title: "Side-by-Side Comparison" },
  { id: "which-projects", title: "Which Projects Live Where?" },
  { id: "for-builders", title: "For Builders: Which to Choose?" },
];

export default function HyperCoreVsHyperEVMPage() {
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

      <H2 id="overview">Overview</H2>
      <P>
        Hyperliquid is not a single monolithic blockchain — it is a dual-layer architecture.
        HyperCore handles the native perpetual order book and spot trading, while HyperEVM
        provides a general-purpose smart contract environment. Both layers run on the same L1
        with shared consensus, but they serve fundamentally different purposes and have
        different programming models.
      </P>
      <P>
        Understanding the distinction between these two layers is essential for anyone
        building on, trading on, or investing in the Hyperliquid ecosystem. This guide breaks
        down what each layer does, how they connect, and which one matters for different use
        cases.
      </P>

      <H2 id="what-is-hypercore">What Is HyperCore?</H2>
      <P>
        HyperCore is the native execution environment of Hyperliquid. It is purpose-built for
        financial operations: perpetual futures trading, spot order books, vaults, staking, and
        the HIP token standards. HyperCore is not a general-purpose smart contract platform —
        it is a deterministic state machine optimized for one thing: processing orders and
        managing positions as fast as possible.
      </P>
      <P>
        When you trade on the Hyperliquid app, you are interacting with HyperCore. Your
        orders are submitted via an API (not a smart contract call), processed by the chain
        validators, and matched against the order book. The entire flow happens in under a
        second with no gas fees.
      </P>
      <P>
        HyperCore also manages HIP-1 (native token standard), HIP-2 (spot liquidity
        bootstrapping), and HIP-3 (permissionless perpetual markets). These are native
        protocol-level features, not smart contracts. They are hardcoded into the chain logic
        and executed with the same speed as the core trading engine.
      </P>

      <H2 id="what-is-hyperevm">What Is HyperEVM?</H2>
      <P>
        HyperEVM is a fully EVM-compatible execution environment running on the same
        Hyperliquid L1. Think of it as an Ethereum-compatible smart contract layer that
        shares security and finality with HyperCore, but supports arbitrary Solidity code.
      </P>
      <P>
        Developers can deploy any EVM smart contract to HyperEVM — lending protocols, DEX
        AMMs, NFT contracts, governance systems, yield vaults, and more. It uses HYPE as the
        native gas token and benefits from Hyperliquid&apos;s fast block times, though
        transactions on HyperEVM do require gas (unlike HyperCore trading).
      </P>
      <P>
        HyperEVM is where the broader DeFi ecosystem lives. Protocols like{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> (lending),{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> (CDP stablecoin),{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> (spot DEX), and{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> (liquid staking) are all
        deployed on HyperEVM. The composability of EVM contracts means these protocols can
        build on each other — a user can stake HYPE, borrow against their LST, and deploy
        the proceeds into a yield vault, all in a single transaction chain.
      </P>

      <H2 id="how-they-interact">How They Interact</H2>
      <P>
        HyperCore and HyperEVM share the same consensus layer and the same validators. They
        run on a single L1, not as separate chains with a bridge between them. This means
        assets can move between the two environments with native speed and without the trust
        assumptions of cross-chain bridges.
      </P>
      <P>
        In practice, HyperEVM contracts can read HyperCore state (e.g., oracle prices from
        the perp order book) through precompiles. This gives HyperEVM DeFi protocols access
        to deeply liquid price feeds without relying on external oracles. It also means that
        HyperCore trading fees and funding rates can be used as inputs for HyperEVM-based
        yield strategies.
      </P>
      <P>
        The shared security model is a significant advantage. Unlike L2 rollups that inherit
        security from Ethereum with a delay, HyperEVM transactions are finalized with the
        same speed and guarantees as HyperCore transactions. There is one chain, one validator
        set, one finality.
      </P>

      <H2 id="comparison">Side-by-Side Comparison</H2>
      <ComparisonTable
        headers={["", "HyperCore", "HyperEVM"]}
        rows={[
          ["Purpose", "Order book trading, native perps", "General-purpose smart contracts"],
          ["Programming model", "API-based (REST/WS)", "Solidity / EVM bytecode"],
          ["Gas fees", "None (for trading)", "HYPE gas (low cost)"],
          ["Latency", "Sub-second finality", "Sub-second finality"],
          ["Use cases", "Perps, spot, vaults, HIP-3", "Lending, DEXs, LSTs, yield, NFTs"],
          ["Composability", "Protocol-level only", "Full EVM composability"],
          ["Key protocols", "Hyperliquid DEX", "HyperLend, Felix, HyperSwap, Kinetiq"],
          ["Token standards", "HIP-1, HIP-2, HIP-3", "ERC-20, ERC-721, etc."],
        ]}
      />

      <H2 id="which-projects">Which Projects Live Where?</H2>
      <P>
        The simplest way to think about it: if a project is a trading interface, analytics
        dashboard, or trading bot that interacts with the Hyperliquid order book, it
        typically operates on HyperCore. If it involves smart contracts, DeFi primitives, or
        token issuance, it lives on HyperEVM. Some projects span both layers — for example,
        yield protocols that route strategies through both HyperCore vaults and HyperEVM
        lending markets.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">HyperCore projects</strong> include the{" "}
        <InlineLink href="/projects/hyperliquid">Hyperliquid DEX</InlineLink> itself, trading
        terminals like <InlineLink href="/projects/hyperdrive-trade">Hyperdrive Trade</InlineLink>,
        and copy trading platforms like <InlineLink href="/projects/coinpilot">Coinpilot</InlineLink>.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">HyperEVM projects</strong> include the full
        DeFi stack: lending (<InlineLink href="/projects/hyperlend">HyperLend</InlineLink>,{" "}
        <InlineLink href="/projects/felix-protocol">Felix</InlineLink>), liquid staking
        (<InlineLink href="/projects/kinetiq">Kinetiq</InlineLink>,{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink>), DEXs
        (<InlineLink href="/projects/hyperswap">HyperSwap</InlineLink>,{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink>), and more.
      </P>

      <H2 id="for-builders">For Builders: Which to Choose?</H2>
      <P>
        If you are building a trading tool, analytics product, or bot that needs to interact
        with the Hyperliquid order book, you should use the HyperCore API. It is the fastest
        path to market, requires no smart contract deployment, and benefits from zero gas
        costs. The trade-off is that you are limited to what the API and HIP standards expose.
      </P>
      <P>
        If you are building a DeFi protocol, a novel financial product, or anything that
        requires custom on-chain logic, HyperEVM is the right choice. You get full EVM
        compatibility, existing Solidity tooling (Hardhat, Foundry, etc.), and the ability to
        compose with other HyperEVM protocols. Gas costs are minimal, and the finality is the
        same as HyperCore.
      </P>
      <P>
        The most powerful applications will eventually span both layers — using HyperCore for
        trading execution and HyperEVM for DeFi composability. This is the direction the
        ecosystem is heading.
      </P>

      <div className="flex flex-wrap gap-4">
        <CTA href="/layer/hypercore">Explore HyperCore projects &rarr;</CTA>
        <CTA href="/layer/hyperevm">Explore HyperEVM projects &rarr;</CTA>
      </div>
    </LearnLayout>
  );
}
