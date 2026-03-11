import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hip-3";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "What Is HIP-3? Hyperliquid External Assets Explained",
  description:
    "HIP-3 brings external blockchain assets to Hyperliquid. Learn how HIP-3 works, which tokens are listed, and how it differs from HIP-1 and HyperEVM projects.",
  openGraph: {
    title: "What Is HIP-3? Hyperliquid External Assets Explained",
    description:
      "HIP-3 brings external blockchain assets to Hyperliquid. Learn how HIP-3 works, which tokens are listed, and how it differs from HIP-1 and HyperEVM projects.",
    type: "article",
  },
};

const TOC = [
  { id: "what-is-hip-3", title: "What Is HIP-3?" },
  { id: "how-it-works", title: "How It Works" },
  { id: "economics", title: "The Economics" },
  { id: "use-cases", title: "Use Cases" },
  { id: "live-projects", title: "Live HIP-3 Projects" },
  { id: "risks", title: "Risks and Limitations" },
  { id: "future", title: "The Future of HIP-3" },
  { id: "current-markets", title: "Current HIP-3 Markets" },
  { id: "hip3-vs-traditional", title: "HIP-3 vs Traditional Perps" },
  { id: "economics-of-listing", title: "The Economics of Listing" },
  { id: "hip3-risks", title: "Risks Specific to HIP-3" },
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
          author: { "@type": "Organization", name: "perp.wiki" },
          publisher: { "@type": "Organization", name: "perp.wiki" },
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

      <H2 id="current-markets">Current HIP-3 Markets</H2>
      <P>
        The HIP-3 market landscape has expanded rapidly since the standard launched, and the
        diversity of what is being traded on permissionless Hyperliquid perps is already
        remarkable. These markets cover assets that would have been unthinkable on-chain just
        a year ago — US equities, political outcomes, pre-IPO valuations, and volatility
        indices — all trading 24/7 on a decentralized order book with leverage.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">
          <InlineLink href="/projects/trade-xyz">Trade.xyz</InlineLink> Stock Perpetuals.
        </strong>{" "}
        Trade.xyz (formerly HyperUnit) is the clear volume leader among HIP-3 deployers,
        consistently processing over $500M in daily volume across its stock perpetual markets.
        Their listed markets include TSLA (Tesla), AAPL (Apple), NVDA (Nvidia), AMZN (Amazon),
        and a synthetic Nasdaq composite index that tracks the overall US tech sector. These
        markets trade around the clock — unlike traditional stock exchanges that close at 4 PM
        Eastern — meaning a trader in Singapore can take a leveraged position on Tesla at 3 AM
        New York time. The price feeds are derived from a combination of real-time equity data
        providers and after-hours pricing models, ensuring that the perpetual price tracks the
        underlying equity as closely as possible even when the NYSE is closed.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">
          <InlineLink href="/projects/hyperodd">HyperOdd</InlineLink> Prediction Markets.
        </strong>{" "}
        HyperOdd has carved out a unique niche by bringing leveraged prediction markets to
        Hyperliquid. Unlike Polymarket, where positions are binary (yes/no shares at a fixed
        price), HyperOdd uses HIP-3 perpetual contracts to enable continuous price discovery
        on outcomes. Their markets span sports events (Super Bowl outcomes, NBA playoffs,
        Premier League matches), crypto-native events (ETF approvals, protocol launches, chain
        milestones), and political events (election outcomes, policy decisions). The ability to
        apply up to 20x leverage to prediction market positions is novel — it means a trader
        who is highly convicted on an outcome can express that conviction with concentrated
        capital rather than tying up large amounts in a binary market.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">
          <InlineLink href="/projects/ventuals">Ventuals</InlineLink> Pre-IPO Perpetuals.
        </strong>{" "}
        Ventuals creates markets for companies that have not yet gone public, allowing traders
        to speculate on implied valuations of private companies. Current markets include SpaceX,
        OpenAI, Anthropic, and other high-profile private tech companies. The oracle challenge
        here is significant — there is no public market price for a pre-IPO company — so
        Ventuals uses a hybrid oracle system that combines secondary market transaction data,
        analyst estimates, and proprietary valuation models to produce a reference price. These
        markets are inherently less liquid than stock perps due to the subjective nature of the
        underlying, but they fill a real gap: before Ventuals, there was no easy way for retail
        investors to get exposure to pre-IPO company valuations.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Volmex Volatility Indices.</strong>{" "}
        Volmex has deployed HIP-3 markets for crypto volatility indices — BVIV (Bitcoin Implied
        Volatility Index) and EVIV (Ethereum Implied Volatility Index). These function as the
        crypto equivalent of the VIX, the traditional finance fear gauge that measures expected
        volatility in the S&P 500. The Volmex indices are calculated from options market data
        across multiple exchanges, providing a single number that represents the market&apos;s
        expectation of future price swings. Traders use these markets to hedge portfolio
        volatility, speculate on regime changes in market conditions, or express views on whether
        crypto markets will be calm or turbulent over a given period. Volatility perpetuals are
        a sophisticated instrument that previously existed only on centralized derivatives
        platforms — their presence on HIP-3 demonstrates the standard&apos;s flexibility.
      </P>

      <H2 id="hip3-vs-traditional">HIP-3 vs Traditional Perps</H2>
      <P>
        While HIP-3 markets share the same order book infrastructure as Hyperliquid&apos;s core
        perpetual markets, there are important structural differences that traders should
        understand before participating. These differences affect liquidity, risk parameters,
        and the overall trading experience.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Collateral requirements</strong> work
        differently for HIP-3 markets. For core Hyperliquid perps (BTC, ETH, SOL, etc.), the
        protocol itself backstops the market infrastructure. For HIP-3 markets, the deployer
        provides the initial economic commitment in the form of a HYPE bond. This bond serves
        as a form of skin-in-the-game that aligns the deployer&apos;s incentives with the
        market&apos;s success, but it also means that the deployer — not the protocol — bears
        the primary economic risk of the market&apos;s viability.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">HLP participation</strong> is not guaranteed
        on HIP-3 markets. The HLP vault, which acts as the primary market maker on core
        Hyperliquid perps, may or may not provide liquidity on HIP-3 markets depending on the
        market&apos;s configuration and the HLP strategy&apos;s risk parameters. Some
        high-volume HIP-3 markets (like Trade.xyz&apos;s stock perps) do receive HLP
        liquidity, but many newer or lower-volume HIP-3 markets rely entirely on independent
        market makers for order book depth. This means spreads can be wider and slippage can
        be higher, particularly for large orders or during volatile periods.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Oracle sources</strong> vary significantly
        between HIP-3 markets and core perps. Core Hyperliquid perps use a standardized oracle
        system that aggregates prices from multiple centralized exchanges (Binance, OKX, Bybit,
        etc.) to produce a robust spot index price. HIP-3 markets, by contrast, can use custom
        oracle implementations tailored to their specific underlying asset. A stock perp might
        use equity market data feeds, a prediction market might use event outcome data from
        Polymarket, and a volatility index might use options pricing models. This flexibility
        enables the breadth of HIP-3 markets, but it also means oracle quality is not uniform
        — some oracles are more robust than others, and traders should evaluate the oracle
        source before taking large positions.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Leverage limits</strong> are generally lower
        on HIP-3 markets compared to core perps. While core BTC and ETH perps offer up to 50x
        leverage, HIP-3 markets typically launch with lower default limits — often 5x to 20x
        depending on the deployer&apos;s configuration and the underlying asset&apos;s
        volatility. This is a sensible risk management measure: a stock perp or prediction
        market may have different volatility characteristics than a major crypto asset, and
        higher leverage could lead to excessive liquidations and bad debt.
      </P>

      <H2 id="economics-of-listing">The Economics of Listing</H2>
      <P>
        Deploying a HIP-3 market is a significant economic undertaking, and understanding the
        full cost structure is essential for anyone considering it. The bond requirement alone
        makes HIP-3 deployment inaccessible to casual participants — which is exactly the
        intended design.
      </P>
      <P>
        The primary cost is the HYPE bond, currently set at approximately 500,000 HYPE. At
        prevailing prices of roughly $30 per HYPE, this represents a commitment of over $15
        million in value. This is not a fee that gets consumed — the bond is locked, not
        burned. The HYPE remains the property of the deployer (or the crowdfunding
        participants), and it can be reclaimed if the market is decommissioned. However,
        while the market is active, the bond is illiquid — it cannot be traded, staked, or
        used as collateral elsewhere.
      </P>
      <P>
        For popular tickers — ones that multiple parties want to deploy — Hyperliquid uses a
        Dutch auction mechanism. The ticker price starts high and decreases over time until a
        buyer accepts. This prevents front-running and ensures that tickers go to deployers
        who value them most (and presumably have the best plans for generating volume). The
        Dutch auction has produced some notable outcomes: highly sought-after tickers for
        major assets have sold at significant premiums above the base bond requirement, while
        niche tickers have gone for closer to the floor.
      </P>
      <P>
        The revenue side of the equation comes from the fee split. Trading fees generated on
        a HIP-3 market are divided between the deployer and the protocol. The deployer&apos;s
        share provides ongoing revenue that can recoup the bond opportunity cost over time. A
        high-volume market like Trade.xyz&apos;s stock perps, generating $500M+ in daily
        volume, earns substantial deployer fees — enough to justify the bond many times over.
        A low-volume niche market, by contrast, may never generate enough fees to offset the
        capital locked in the bond.
      </P>
      <P>
        <InlineLink href="/projects/kinetiq">Kinetiq&apos;s Launch</InlineLink> platform has
        emerged as the primary solution for the accessibility problem. Kinetiq offers
        &quot;Exchange as a Service&quot; (EaaS) — a crowdfunding mechanism where multiple
        participants pool HYPE to collectively fund a ticker bond. In exchange, contributors
        receive a proportional share of the deployer fees generated by the market. This model
        has democratized HIP-3 deployment, allowing markets to launch that no single entity
        would have funded alone. It has also created a new asset class of sorts: shares in
        HIP-3 market fee streams, which function somewhat like equity in a mini-exchange.
      </P>
      <P>
        The bond lock mechanism also creates interesting game theory. Because the bond is
        locked rather than burned, deployers have a long-term stake in their market&apos;s
        success. Abandoning a market means leaving a large amount of HYPE locked indefinitely
        (or at least until the reclaim conditions are met), creating a strong incentive to
        maintain oracle quality, promote the market, and attract traders. This is a more
        sustainable incentive structure than burning fees, which would provide no ongoing
        motivation for the deployer after launch.
      </P>

      <H2 id="hip3-risks">Risks Specific to HIP-3</H2>
      <P>
        While the earlier risks section covered the general limitations of HIP-3, traders
        should be aware of several additional risk factors that are specific to the
        permissionless nature of these markets. These risks do not apply (or apply to a much
        lesser degree) to Hyperliquid&apos;s core perpetual markets.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Lower liquidity</strong> is the most
        immediate practical risk. Core Hyperliquid perps for major assets like BTC and ETH
        have deep order books with millions of dollars within a few basis points of the mid
        price. HIP-3 markets, particularly newer ones, may have order books that are orders
        of magnitude thinner. This means larger trades can experience significant slippage,
        and market orders during volatile periods can fill at prices far from the displayed
        price. Traders should always check order book depth before sizing a position on a
        HIP-3 market, and consider using limit orders rather than market orders to control
        execution price.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Oracle quality varies</strong> significantly
        across HIP-3 markets, and this variation introduces risks that do not exist on core
        perps. A stock perp oracle might rely on a single equity data provider — if that
        provider experiences downtime or delivers incorrect data, the perpetual price can
        diverge from the true underlying price, leading to unfair liquidations or arbitrage
        opportunities that come at the expense of regular traders. Prediction market oracles
        face an even harder challenge: determining the outcome of an event requires a
        resolution mechanism, and disputes about resolution can create chaos in the market.
        Custom oracles built by deployers may not have the same redundancy and error-handling
        as Hyperliquid&apos;s native oracle system.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Regulatory risk</strong> is heightened for
        certain categories of HIP-3 markets. Stock perpetuals, in particular, exist in a
        regulatory gray area. Offering leveraged synthetic exposure to US equities without a
        securities license is, at minimum, a novel legal question. Different jurisdictions will
        likely reach different conclusions, and enforcement actions against similar products
        (both in crypto and traditional finance) are not without precedent. Sports prediction
        markets face their own regulatory challenges, as online sports betting is heavily
        regulated or outright banned in many jurisdictions. Political prediction markets have
        their own legal complexities, as recent CFTC guidance in the United States has shown.
        Traders should understand the legal status of these products in their jurisdiction.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Deployer abandonment risk</strong> is a
        concern unique to permissionless markets. If a deployer loses interest in maintaining
        their market — stops updating the oracle, stops promoting the market, or simply
        disappears — the market can degrade. An unmaintained oracle might stop updating,
        causing the perpetual price to stale and creating liquidation risk for traders with
        open positions. While the locked bond provides some incentive against abandonment,
        if the bond value drops below the cost of maintenance (or if the deployer simply
        does not care about recovering it), abandonment is possible. Traders should assess
        deployer credibility and track record before committing significant capital to a
        HIP-3 market, just as they would evaluate the team behind any other crypto project.
      </P>
      <P>
        <strong className="text-[var(--hw-text)]">Counterparty concentration</strong> is
        another factor. In a thin HIP-3 market, it is possible for a small number of traders
        to represent the majority of open interest. This creates manipulation risk — a large
        trader could potentially move the price of a low-liquidity HIP-3 perp by placing
        outsized orders, triggering stop losses or liquidations of other participants. The
        JELLY incident on core Hyperliquid (which led to market delisting) demonstrated that
        this type of manipulation is a real concern even on more liquid markets, and the risk
        is amplified on thinner HIP-3 books.
      </P>

      <CTA href="/layer/hip3">Explore HIP-3 projects &rarr;</CTA>
    </LearnLayout>
  );
}
