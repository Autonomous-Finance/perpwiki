import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hypercore-vs-hyperevm";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "HyperCore vs HyperEVM — What's the Difference?",
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
  { id: "real-examples", title: "Real Examples: What Lives on Each Layer" },
  { id: "bridging-between", title: "Bridging Between Layers" },
  { id: "developer-perspective", title: "Developer Perspective" },
  { id: "shared-state", title: "The Shared State Advantage" },
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
          author: { "@type": "Organization", name: "perp.wiki" },
          publisher: { "@type": "Organization", name: "perp.wiki" },
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

      <H2 id="real-examples">Real Examples: What Lives on Each Layer</H2>
      <P>
        The best way to understand the HyperCore vs HyperEVM distinction is to look at what
        is actually running on each layer today. The division is clean: HyperCore handles
        everything related to the order book and native protocol features, while HyperEVM
        hosts the broader DeFi ecosystem that has grown around the trading platform.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">On HyperCore</strong>, the centerpiece is the
        perpetual futures order book itself — all 229 listed perp markets execute natively on
        HyperCore with sub-second matching and zero gas fees. The spot order book also runs on
        HyperCore, providing native trading pairs for HIP-1 tokens. The HLP vault, which acts
        as the protocol&apos;s market maker across all perpetual markets, is a HyperCore-native
        construct — deposits, withdrawals, and the vault&apos;s trading activity all happen at
        the protocol level, not through smart contracts.
      </P>
      <P>
        Native HYPE staking is also a HyperCore feature. When you delegate HYPE to a validator,
        that transaction is processed by HyperCore&apos;s staking module, not by an EVM contract.
        The HIP token standards — HIP-1 for native token issuance, HIP-2 for spot liquidity
        bootstrapping, and{" "}
        <InlineLink href="/learn/what-is-hip-3">HIP-3</InlineLink> for permissionless perpetual
        markets — are all native HyperCore features. This is a crucial design choice: by making
        these standards protocol-level rather than smart-contract-level, they inherit the full
        speed and reliability of the core trading engine.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">On HyperEVM</strong>, the ecosystem has
        exploded since the EVM layer launched in early 2025.{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> has grown to over
        $1B in TVL as a CDP (Collateralized Debt Position) platform, allowing users to mint the
        feUSD stablecoin against HYPE and liquid staking tokens.{" "}
        <InlineLink href="/projects/morpho">Morpho</InlineLink>, the established lending protocol
        that expanded to HyperEVM, holds over $500M in lending markets — a vote of confidence from
        one of DeFi&apos;s most respected protocols.
      </P>
      <P>
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> leads the liquid staking sector
        with over $470M in staked HYPE, issuing kHYPE tokens that have become the most widely
        accepted liquid staking derivative on the chain.{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink>, the primary AMM DEX on
        HyperEVM, processes approximately $57M in daily spot trading volume for HyperEVM-native
        tokens that are not listed on HyperCore&apos;s spot order book.{" "}
        <InlineLink href="https://layerzero.network">LayerZero</InlineLink>&apos;s bridge
        integration enables cross-chain asset transfers to and from HyperEVM, connecting the
        ecosystem to the broader multi-chain world.{" "}
        <InlineLink href="/projects/drip-trade">Drip Trade</InlineLink> has established the NFT
        market on HyperEVM, demonstrating that the EVM layer supports more than just financial
        applications.
      </P>

      <H2 id="bridging-between">Bridging Between Layers</H2>
      <P>
        One of the most common questions from new Hyperliquid users is how to move assets between
        HyperCore and HyperEVM. The answer is surprisingly simple: it is a native transfer, not
        an external bridge. Because both layers run on the same L1 with shared state and shared
        validators, moving assets between them is fundamentally different from bridging between
        two separate blockchains.
      </P>
      <P>
        USDC and HYPE are the two primary assets that can be transferred between HyperCore and
        HyperEVM. When you transfer USDC from your HyperCore trading account to your HyperEVM
        wallet, the operation is processed by the L1 itself — there is no third-party bridge
        contract, no lock-and-mint mechanism, and no multi-sig holding your funds in escrow. The
        same USDC that was in your HyperCore margin account is now available in your HyperEVM
        wallet, and the transfer completes in the same sub-second timeframe as any other
        Hyperliquid transaction.
      </P>
      <P>
        This near-instant native bridging has significant practical implications. On other
        ecosystems, moving assets between an L1 and an L2, or between two L2s, can take minutes
        to hours and involves trust assumptions in bridge contracts. On Hyperliquid, a trader can
        close a perpetual position on HyperCore, transfer their USDC to HyperEVM, deposit it
        into a lending protocol like HyperLend, and start earning yield — all within a few
        seconds. This speed of capital reallocation is a genuine competitive advantage that
        makes the entire ecosystem more capital-efficient.
      </P>
      <P>
        For developers, the bridging mechanism is equally straightforward. HyperEVM applications
        can read HyperCore state via precompiles — special contracts baked into the EVM layer
        that expose data from the native trading environment. This means a HyperEVM smart
        contract can query the current price of any Hyperliquid perpetual market, check funding
        rates, or read position data without relying on an external oracle service. The data
        comes directly from the source, with no delay and no additional trust assumptions
        beyond the chain itself.
      </P>

      <H2 id="developer-perspective">Developer Perspective</H2>
      <P>
        Choosing between HyperCore and HyperEVM is the first architectural decision any
        Hyperliquid developer needs to make. The choice is not always binary — some of the most
        successful projects on Hyperliquid span both layers — but understanding when to use
        each one will save significant development time and produce a better end product.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Build on HyperCore when</strong> your
        application needs direct access to exchange primitives. If you are building a trading
        bot, a market-making system, an arbitrage engine, or a portfolio management tool, the
        HyperCore API is the right foundation. The API provides WebSocket streams for real-time
        order book data, REST endpoints for order placement and position management, and
        programmatic access to all HIP-3 market operations. There is zero gas cost for order
        placement and cancellation, which is essential for high-frequency strategies that may
        place and cancel thousands of orders per minute.
      </P>
      <P>
        HyperCore is also the right choice for trading terminals and analytics platforms. These
        applications read data from the chain (positions, funding rates, historical trades) and
        present it through a UI, but they do not need to deploy on-chain logic. The HyperCore
        API is well-documented, performant, and familiar to anyone who has worked with
        centralized exchange APIs.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Build on HyperEVM when</strong> your
        application requires custom on-chain logic, composability with other smart contracts,
        or any functionality that the HyperCore API does not natively support. This includes
        DeFi protocols (lending, borrowing, yield aggregation), token launches with custom
        mechanics, governance systems, NFT marketplaces, DAOs, and any application that needs
        to custody funds in a smart contract.
      </P>
      <P>
        The HyperEVM development experience is nearly identical to building on Ethereum or any
        other EVM chain. Standard tooling works out of the box: Hardhat and Foundry for smart
        contract development and testing, ethers.js and viem for frontend integration, and
        familiar Solidity patterns for contract design. Developers do not need to learn a new
        language or a new framework. If you have built on Ethereum, Arbitrum, or Base, you can
        build on HyperEVM with minimal friction.
      </P>
      <P>
        The gas costs on HyperEVM are low — fractions of a cent for simple transactions — and
        HYPE is used as the gas token. Block times match HyperCore&apos;s sub-second finality,
        meaning contract interactions confirm quickly. For developers coming from Ethereum
        mainnet, the speed improvement is dramatic. For those coming from L2s like Arbitrum or
        Base, the experience is comparable but with the added benefit of native access to
        HyperCore&apos;s order book data.
      </P>

      <H2 id="shared-state">The Shared State Advantage</H2>
      <P>
        The ability for HyperEVM to read HyperCore state is arguably the single most
        underappreciated technical feature of the Hyperliquid architecture. On every other
        blockchain, DeFi protocols that need price data must rely on external oracle networks —
        Chainlink, Pyth, Redstone, or similar services. These oracles introduce latency (prices
        are typically updated every few seconds or on a heartbeat), cost (someone has to pay for
        oracle updates), and trust assumptions (the oracle operator could theoretically provide
        incorrect data).
      </P>
      <P>
        On Hyperliquid, HyperEVM contracts can read the real-time mid-price of any perpetual
        market listed on HyperCore through a precompile call. This is not an oracle in the
        traditional sense — it is a direct state read from the same L1. The price is the actual
        current price on the order book, updated with every trade, with zero latency and zero
        additional cost. For any asset that Hyperliquid lists as a perpetual market, this
        provides the highest-quality price feed available anywhere in DeFi.
      </P>
      <P>
        Beyond prices, HyperEVM contracts can access funding rate data from HyperCore perp
        markets. Funding rates reflect the cost of holding a leveraged position and are
        recalculated hourly based on the spread between the perpetual price and the spot index.
        This data is valuable for yield protocols, delta-neutral strategies, and any
        application that needs to understand the cost of leverage on a given asset.
      </P>
      <P>
        Position data is another powerful input. HyperEVM contracts can, through precompiles,
        query information about positions held on HyperCore. This capability has already enabled
        novel DeFi applications — most notably, Sentiment, a lending protocol that accepts
        HyperCore perpetual positions as collateral. A trader can have an open perp position on
        HyperCore and borrow against it on HyperEVM, without closing the position. This is
        only possible because HyperEVM can verify the existence and value of the position by
        reading HyperCore state directly.
      </P>
      <P>
        The shared state model also has implications for risk management. Lending protocols on
        HyperEVM can monitor the health of collateral positions in real-time by reading
        HyperCore state. If a borrower&apos;s perp position moves against them, the lending
        protocol can see it immediately and trigger liquidation if necessary — without waiting
        for an oracle update. This tighter feedback loop means more efficient liquidations,
        lower bad debt risk, and ultimately safer lending markets.
      </P>
      <P>
        For the broader ecosystem, the shared state advantage creates a network effect. Every
        new perpetual market listed on HyperCore automatically becomes a price feed available
        to every HyperEVM protocol. Every new DeFi protocol on HyperEVM can leverage the
        liquidity and price discovery of HyperCore without building its own oracle
        infrastructure. The two layers are not just coexisting — they are mutually reinforcing,
        and that composability between native and EVM execution is something no other blockchain
        currently offers.
      </P>

      <div className="flex flex-wrap gap-4">
        <CTA href="/layer/hypercore">Explore HyperCore projects &rarr;</CTA>
        <CTA href="/layer/hyperevm">Explore HyperEVM projects &rarr;</CTA>
      </div>
    </LearnLayout>
  );
}
