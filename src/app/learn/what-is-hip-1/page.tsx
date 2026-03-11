import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hip-1";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "What Is HIP-1? Hyperliquid Native Token Standard Explained",
  description:
    "HIP-1 is Hyperliquid's native token standard for issuing spot tokens on HyperCore. Learn how PURR was launched, how HIP-1 works, and its relationship to HyperCore.",
  openGraph: {
    title: "What Is HIP-1? Hyperliquid Token Standard",
    description:
      "How HIP-1 governs native token creation, spot trading, and token launches on Hyperliquid's HyperCore L1.",
    type: "article",
  },
};

const TOC = [
  { id: "what-is-hip-1", title: "What Is HIP-1?" },
  { id: "why-hip-1-exists", title: "Why HIP-1 Exists" },
  { id: "how-hip-1-works", title: "How HIP-1 Works" },
  { id: "purr-launch", title: "How PURR Was Launched" },
  { id: "hip-1-vs-erc20", title: "HIP-1 vs ERC-20" },
  { id: "spot-trading", title: "Spot Trading on HyperCore" },
  { id: "hip-2-liquidity", title: "HIP-2: Bootstrapping Liquidity" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is HIP-1 on Hyperliquid?",
    answer:
      "HIP-1 is Hyperliquid's native token standard for creating and managing fungible tokens on HyperCore. It defines how tokens are minted, transferred, and traded on Hyperliquid's native spot order book — similar to how ERC-20 defines token standards on Ethereum.",
  },
  {
    question: "How is HIP-1 different from ERC-20?",
    answer:
      "HIP-1 tokens live on HyperCore (Hyperliquid's native trading layer), not on the EVM. They are first-class assets on the native spot order book with sub-second finality and no gas fees for trading. ERC-20 tokens on HyperEVM are separate and must be bridged or wrapped to interact with HyperCore spot markets.",
  },
  {
    question: "What was PURR and how was it launched with HIP-1?",
    answer:
      "PURR was the first community token launched via HIP-1 on Hyperliquid. It was airdropped to HYPE holders and began trading immediately on the native spot order book. PURR demonstrated HIP-1's ability to launch and list tokens with instant liquidity via HIP-2.",
  },
  {
    question: "Can anyone create a HIP-1 token?",
    answer:
      "Creating a HIP-1 token requires a deployment on HyperCore through the spot listing process. The process involves registering a token ticker through a Dutch auction for the ticker name, deploying the token with defined parameters, and bootstrapping liquidity via HIP-2. It is permissionless but has costs associated with ticker registration.",
  },
];

export default function WhatIsHip1Page() {
  return (
    <LearnLayout article={article} prev={prev} next={next} toc={TOC}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.datePublished,
          author: { "@type": "Organization", name: "perp.wiki" },
          publisher: { "@type": "Organization", name: "perp.wiki" },
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

      <H2 id="what-is-hip-1">What Is HIP-1?</H2>
      <P>
        HIP-1 (Hyperliquid Improvement Proposal 1) is the native token standard on Hyperliquid.
        It defines how fungible tokens are created, managed, and traded on HyperCore —
        Hyperliquid&apos;s high-performance L1 blockchain. If ERC-20 is the token standard for
        Ethereum, HIP-1 is the equivalent for{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>.
      </P>
      <P>
        HIP-1 tokens are first-class assets on HyperCore. They trade directly on
        Hyperliquid&apos;s native spot order book — the same infrastructure that powers its
        perpetual futures markets. This means HIP-1 tokens inherit all of HyperCore&apos;s
        performance characteristics: sub-second finality, no gas fees for trading, and the
        ability to interact with the full depth of Hyperliquid&apos;s liquidity.
      </P>
      <P>
        The standard was introduced alongside Hyperliquid&apos;s spot trading launch and has
        since become the foundation for the ecosystem&apos;s growing roster of native tokens.
        PURR, the first community token, HYPE itself, and dozens of other tokens are all HIP-1
        assets.
      </P>

      <H2 id="why-hip-1-exists">Why HIP-1 Exists</H2>
      <P>
        Before HIP-1, Hyperliquid only supported perpetual futures trading with USDC as the
        settlement currency. There was no mechanism for issuing native tokens or trading spot
        pairs on the chain. HIP-1 was created to fill this gap — enabling a native spot market
        that could complement the perpetual order book.
      </P>
      <P>
        The design choice to create a dedicated token standard (rather than simply supporting
        ERC-20 tokens on{" "}
        <InlineLink href="/learn/what-is-hyperevm">HyperEVM</InlineLink>) was deliberate.
        HyperCore processes orders through a deterministic state machine optimized for trading.
        By making tokens native to this layer, they can be traded with the same speed and cost
        efficiency as perpetual contracts — something that would not be possible if tokens only
        existed on the EVM side.
      </P>
      <P>
        HIP-1 also enables tight integration between spot and perpetual markets. Because both
        HIP-1 spot tokens and perpetual contracts live on HyperCore, the protocol can use spot
        order book data to calculate perpetual index prices, enable spot-perp basis trading, and
        allow seamless cross-margining between spot and perp positions.
      </P>

      <H2 id="how-hip-1-works">How HIP-1 Works</H2>
      <P>
        A HIP-1 token is defined by a set of parameters at deployment: the token name, ticker
        symbol, total supply, decimals, and initial distribution. Once deployed, the token exists
        natively on HyperCore and can be transferred between addresses, traded on the spot order
        book, and held in Hyperliquid wallets.
      </P>
      <P>
        Token tickers on Hyperliquid are unique and are obtained through a Dutch auction process.
        To list a new token, you first bid on a ticker name (for example, &quot;PURR&quot;) in a
        descending-price auction. This mechanism prevents ticker squatting and ensures that
        serious projects can obtain the names they want, while the cost deters spam listings.
        The auction proceeds are burned or directed to the protocol.
      </P>
      <P>
        Once a ticker is secured, the deployer registers the token with its supply parameters and
        triggers the initial listing on the spot order book. The token is immediately tradeable —
        there is no waiting period or approval process beyond the ticker auction.
      </P>
      <P>
        HIP-1 tokens can be transferred between HyperCore addresses with no gas cost. Trading
        on the spot order book follows the same maker-taker fee model as perpetual trading:
        takers pay a small fee, makers receive a rebate. This fee structure incentivizes deep
        liquidity on spot pairs, mirroring the dynamics that have made Hyperliquid&apos;s
        perpetual order book so liquid.
      </P>

      <H2 id="purr-launch">How PURR Was Launched</H2>
      <P>
        PURR was the first community token launched via HIP-1 and serves as the canonical example
        of how the standard works in practice. Launched in April 2024, PURR was a cat-themed
        community token distributed entirely via airdrop to existing Hyperliquid users.
      </P>
      <P>
        The launch process was straightforward. The PURR team secured the &quot;PURR&quot; ticker
        through the Dutch auction, deployed the token with a fixed supply, and airdropped it to
        HYPE holders. Within minutes of the airdrop, PURR was trading on the native spot order
        book with real liquidity — no external DEX listing, no centralized exchange listing, and
        no liquidity bootstrapping event on a third-party platform.
      </P>
      <P>
        PURR&apos;s launch demonstrated several key features of HIP-1. The token was immediately
        tradeable on a professional-grade order book with sub-second execution. Liquidity formed
        quickly thanks to HIP-2 (the automated liquidity bootstrapping mechanism). And because
        PURR was a HyperCore-native asset, it could later be used as the underlying for a PURR
        perpetual futures contract — creating a complete spot + derivatives market for a token
        that had been launched entirely within Hyperliquid&apos;s native infrastructure.
      </P>
      <P>
        PURR reached a peak market capitalization of several hundred million dollars, making it
        one of the most successful community token launches in DeFi history. Its success
        validated HIP-1 as a viable token standard and attracted dozens of subsequent projects
        to launch tokens on Hyperliquid.
      </P>

      <H2 id="hip-1-vs-erc20">HIP-1 vs ERC-20</H2>
      <P>
        HIP-1 and ERC-20 serve the same fundamental purpose — defining how fungible tokens work
        — but they operate in very different environments and have different tradeoffs.
      </P>
      <P>
        <strong>Performance.</strong> HIP-1 tokens on HyperCore trade with sub-second finality
        and zero gas fees. ERC-20 tokens on Ethereum (or even on HyperEVM) require gas payments
        for every transfer and trade. For high-frequency trading use cases, HIP-1&apos;s
        performance is significantly better.
      </P>
      <P>
        <strong>Composability.</strong> ERC-20 tokens on Ethereum benefit from the world&apos;s
        largest smart contract ecosystem — thousands of DeFi protocols, bridges, aggregators, and
        tools. HIP-1 tokens are currently limited to Hyperliquid&apos;s native ecosystem.
        However, HIP-1 tokens can be bridged to HyperEVM as wrapped assets, gaining access to
        the growing HyperEVM DeFi ecosystem.
      </P>
      <P>
        <strong>Listing and liquidity.</strong> HIP-1 tokens are listed directly on
        Hyperliquid&apos;s native order book — a professional-grade CLOB with deep liquidity.
        ERC-20 tokens typically start on AMM DEXs (Uniswap, SushiSwap) with fragmented liquidity
        and high slippage. The order book model provides better price discovery and tighter
        spreads from day one.
      </P>
      <P>
        <strong>Developer tooling.</strong> ERC-20 benefits from years of mature tooling:
        Solidity libraries, Hardhat/Foundry, block explorers, and wallet integrations. HIP-1
        tooling is newer and more limited, though it is improving rapidly as the ecosystem grows.
      </P>

      <H2 id="spot-trading">Spot Trading on HyperCore</H2>
      <P>
        HIP-1 enables native spot trading on Hyperliquid&apos;s order book. This is a central
        limit order book (CLOB) — the same type of order book used by every major stock exchange
        and centralized crypto exchange. It supports limit orders, market orders, and the full
        range of order types available on the perpetual side.
      </P>
      <P>
        Spot pairs on HyperCore are quoted against USDC. When you buy PURR/USDC, for example,
        you are placing an order on the native spot order book, which is matched by HyperCore&apos;s
        deterministic matching engine. The trade settles on-chain in under a second — the PURR
        tokens appear in your Hyperliquid wallet immediately.
      </P>
      <P>
        The spot order book integrates with the perpetual market in important ways. The spot price
        feeds into the perpetual&apos;s index price calculation, creating a natural arbitrage
        relationship that keeps spot and perp prices aligned. Traders can execute basis trades
        — simultaneously buying spot and selling perps — within a single platform, something
        that previously required maintaining accounts on multiple exchanges.
      </P>

      <H2 id="hip-2-liquidity">HIP-2: Bootstrapping Liquidity</H2>
      <P>
        HIP-2 is the companion proposal to HIP-1, designed to solve the cold-start liquidity
        problem for newly launched tokens. When a new HIP-1 token is deployed, its order book
        starts empty — there are no bids, no asks, and no price discovery. HIP-2 provides an
        automated mechanism to bootstrap initial liquidity.
      </P>
      <P>
        The mechanism works by creating an automated market-making strategy that places resting
        orders on both sides of the order book within a defined price range. The token deployer
        seeds the strategy with an initial inventory of tokens and USDC. As trades occur, the
        strategy automatically replenishes its orders, maintaining continuous liquidity around
        the market price.
      </P>
      <P>
        HIP-2 is not an AMM in the traditional sense — it does not use a bonding curve or
        constant-product formula. Instead, it places discrete limit orders on the order book,
        mimicking the behavior of a human market maker. This approach provides better execution
        for traders (tighter spreads, less slippage) while still being fully automated.
      </P>
      <P>
        Once organic liquidity develops — real market makers begin quoting the token, trading
        volume picks up, and the community starts providing liquidity — the HIP-2 strategy can
        be reduced or removed. It serves as a bridge between launch and maturity, ensuring that
        new tokens are tradeable from their first moment of existence. Together with HIP-1, it
        creates a complete pipeline for token creation, listing, and initial liquidity that is
        unique to the Hyperliquid ecosystem.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/learn/what-is-hip-3">Learn about HIP-3: permissionless perp markets &rarr;</CTA>
    </LearnLayout>
  );
}
