import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "best-hyperevm-projects";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Best HyperEVM Projects 2026 — Top Hyperliquid Ecosystem Apps | perp.wiki",
  description:
    "The best projects building on HyperEVM in 2026: DeFi, liquid staking, lending, DEX, and infrastructure. Independent rankings on perp.wiki.",
};

const TOC = [
  { id: "overview", title: "HyperEVM in 2026" },
  { id: "liquid-staking", title: "Liquid Staking" },
  { id: "lending", title: "Lending & Borrowing" },
  { id: "dexs", title: "Decentralized Exchanges" },
  { id: "yield", title: "Yield & Vaults" },
  { id: "trading-tools", title: "Trading & Social Tools" },
  { id: "infrastructure", title: "Infrastructure" },
  { id: "getting-started-hyperevm", title: "How to Get Started with HyperEVM DeFi" },
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
        funding rates from Hyperliquid&apos;s $3B+ daily volume. Because HyperEVM runs on the same L1
        as HyperCore, there is no cross-chain bridging required between the perp exchange and DeFi
        protocols — everything settles on the same chain with the same validators and the same
        sub-second finality.
      </P>
      <P>
        This guide covers the most important projects in each category, with enough depth to help
        you understand what each protocol actually does, how it works, and why it matters for
        the broader ecosystem. We prioritize projects with meaningful TVL, real user traction,
        and clear differentiation.
      </P>

      <H2 id="liquid-staking">Liquid Staking: Kinetiq & StakedHYPE</H2>
      <P>
        Liquid staking has become the foundation of HyperEVM DeFi.{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the largest protocol with $470M+
        HYPE staked. Users deposit HYPE and receive kHYPE, a liquid staking token that accrues validator
        rewards while remaining composable across DeFi. The mechanics are straightforward: when you
        deposit HYPE into Kinetiq, the protocol delegates your HYPE across a set of validators and
        mints kHYPE to your wallet. As staking rewards accrue, the exchange rate between kHYPE and HYPE
        increases — meaning each kHYPE becomes redeemable for progressively more HYPE over time. This
        appreciation model means you never need to manually claim rewards.
      </P>
      <P>
        Kinetiq also offers a KNTQ governance token that gives holders voting power over protocol
        parameters such as validator selection, fee structures, and treasury allocation. Beyond
        standard liquid staking, Kinetiq operates a Launch platform and EaaS (Ecosystem as a Service)
        product that facilitates HIP-3 crowdfunding — enabling new projects to bootstrap liquidity
        through Kinetiq&apos;s user base. Redemptions from kHYPE back to HYPE can be done instantly
        by swapping on DEXs, or through Kinetiq&apos;s native redemption queue which processes
        at the protocol level (subject to unbonding timing).
      </P>
      <P>
        kHYPE can be used as collateral on lending protocols, traded on DEXs, or looped for amplified
        yield. Its deep integration across the HyperEVM ecosystem makes it the de facto base collateral
        asset for many protocols — Felix Protocol, HyperLend, Morpho, and others all accept kHYPE.
      </P>
      <P>
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> (operated by Valantis Labs) is
        the second-largest LST with ~$200M TVL, offering stHYPE with deep integrations across the
        ecosystem. Between Kinetiq and StakedHYPE, liquid staking tokens have become the primary
        collateral asset in HyperEVM DeFi. The Valantis acquisition of StakedHYPE (originally built
        by Thunderhead) in August 2025 combined DEX infrastructure with liquid staking, meaning
        stHYPE benefits from deeply liquid STEX pools on Valantis for efficient swaps.
      </P>

      <H2 id="lending">Lending & Borrowing</H2>
      <P>
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> is the largest DeFi
        protocol on Hyperliquid by TVL, surpassing $1B in September 2025. It is a CDP-style lending
        protocol forked from Liquity V2, the battle-tested Ethereum lending design. Users deposit HYPE,
        stHYPE, or kHYPE as collateral and mint feUSD — a decentralized stablecoin that has become the
        primary stablecoin circulating on HyperEVM.
      </P>
      <P>
        The CDP (Collateralized Debt Position) mechanics work as follows: you deposit collateral into a
        &ldquo;trove&rdquo; (Felix&apos;s term for an individual vault), choose your collateralization
        ratio (must stay above the minimum, typically 110-150% depending on the collateral type), and
        mint feUSD against it. The protocol charges a one-time borrowing fee rather than ongoing interest,
        following the Liquity model. If your collateral value drops and your ratio falls below the
        liquidation threshold, your trove is liquidated and the collateral is sold to cover the debt.
      </P>
      <P>
        feUSD is critical for the HyperEVM ecosystem because it provides a decentralized stablecoin that
        does not depend on centralized issuers like Circle (USDC) or Tether (USDT). feUSD is over-
        collateralized by HYPE and LSTs, meaning its backing is transparent and verifiable on-chain.
        The stability pool mechanism (where feUSD holders can deposit their stablecoins to earn
        liquidation profits) provides a price floor, while arbitrage incentives maintain the peg.
        For ecosystem liquidity, feUSD enables the full DeFi loop: stake HYPE for kHYPE, deposit
        kHYPE to mint feUSD, deploy feUSD for yield — all without needing to bridge external
        stablecoins.
      </P>
      <P>
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> is the largest money market,
        supporting HYPE, stHYPE, kHYPE, and stablecoins with features like flash loans and HyperLoop
        leverage. Unlike Felix&apos;s CDP model, HyperLend operates as a pooled lending market where
        depositors earn variable interest from borrowers.{" "}
        <InlineLink href="/projects/sentiment">Sentiment</InlineLink> introduced a novel
        approach — it was the first protocol to accept perpetual futures positions as collateral,
        unlocking capital efficiency unique to Hyperliquid. Traders can borrow against their
        unrealized perp profits without closing positions.
      </P>
      <P>
        <InlineLink href="/projects/morpho">Morpho</InlineLink> is one of the most significant
        additions to HyperEVM lending. With $4B+ in total TVL across 17 networks, Morpho is a
        battle-tested protocol that deployed on HyperEVM with $500M+ TVL. Morpho operates
        permissionless isolated lending markets — anyone can create a market with custom parameters
        (collateral asset, loan asset, oracle, liquidation LTV, and interest rate model). This
        modular design means risk is isolated: a problem in one market does not affect others.
        Morpho markets on HyperEVM are curated by protocols like Felix and HyperBeat, which create
        front-end interfaces for the most popular markets. This model lets Morpho scale lending
        without a central governance process approving each new asset.
      </P>

      <H2 id="dexs">Decentralized Exchanges</H2>
      <P>
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> is the first and largest native
        DEX on HyperEVM with ~$57M TVL, offering concentrated liquidity AMM pools. Its role in the
        ecosystem is essential — HyperSwap provides the primary venue for swapping between HYPE, kHYPE,
        stHYPE, feUSD, USDC, and other HyperEVM tokens. Concentrated liquidity (similar to Uniswap V3)
        means liquidity providers can focus their capital within specific price ranges for higher
        capital efficiency and better returns.
      </P>
      <P>
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> is the second-largest at ~$32M
        TVL, using a ve(3,3) governance model where 35% of tokens were airdropped to the community. The
        ve(3,3) model (popularized by Solidly/Velodrome on other chains) aligns incentives between
        liquidity providers, token holders, and traders through vote-escrowed tokenomics.
      </P>
      <P>
        <InlineLink href="/projects/valantis">Valantis</InlineLink> stands out with its STEX pools
        optimized specifically for liquid staking tokens, offering the highest-yielding LST pools on
        HyperEVM. STEX (Sovereign Trading EXecution) pools use a specialized AMM curve designed for
        assets that have a known exchange rate relationship (like kHYPE/HYPE), resulting in minimal
        slippage and impermanent loss for LST swaps. Valantis acquired StakedHYPE in August 2025,
        combining DEX and LST infrastructure into a vertically integrated liquid staking and trading
        stack.
      </P>

      <H2 id="yield">Yield & Vaults</H2>
      <P>
        <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink> is a yield aggregation protocol
        backed by ether.fi Ventures, Electric Capital, and Coinbase Ventures ($5.2M seed). Its Meta
        Vaults deploy delta-neutral strategies across HyperEVM protocols, automatically rebalancing
        between lending, liquidity provision, and staking to optimize risk-adjusted returns. HyperBeat
        also offers beHYPE liquid staking via ether.fi integration, and acts as a front-end curator for
        Morpho lending markets — meaning users can access Morpho markets through HyperBeat&apos;s
        interface with additional strategy logic on top.
      </P>
      <P>
        <InlineLink href="/projects/looped-hype">Looped HYPE</InlineLink> enables recursive staking
        with 3x to 15x leverage for ~10% APY. The loop works by staking HYPE, using the LST as
        collateral to borrow more HYPE, staking again, and repeating. Each iteration amplifies yield
        but also amplifies liquidation risk — if HYPE price drops sharply, the leveraged position
        can be liquidated.{" "}
        <InlineLink href="/projects/mizu">Mizu</InlineLink> automates deployment across top HyperEVM
        protocols through multi-asset vaults (HyperETH, HyperBTC, HyperUSD), built on Veda&apos;s
        BoringVault infrastructure for institutional-grade vault management.
      </P>

      <H2 id="trading-tools">Trading & Social Tools</H2>
      <P>
        The Hyperliquid ecosystem extends well beyond DeFi protocols. A growing set of trading tools
        and social platforms makes the exchange more accessible and powerful for different types of
        traders.
      </P>
      <P>
        <InlineLink href="/projects/pvp-trade">pvp.trade</InlineLink> is a Telegram-based trading bot
        that has become one of the highest-volume interfaces for Hyperliquid. With 50,000+ monthly
        active users, pvp.trade lets traders execute perp and spot trades directly from Telegram with
        a simple command syntax. Its clan system enables social trading — users form groups, compare
        performance, and compete on leaderboards. Futures trades through pvp.trade cost just 0.05%
        taker fee. The Telegram-native approach removes the friction of opening a web app and makes
        Hyperliquid accessible to traders who live in chat.
      </P>
      <P>
        <InlineLink href="/projects/hypurrscan">HypurrScan</InlineLink> is the primary block explorer
        for the Hyperliquid L1. Beyond standard transaction lookup, HypurrScan provides whale tracking
        (monitoring large wallets and their positions), auction data for HIP-1 token deployments, and
        TWAP (Time-Weighted Average Price) monitoring. For traders, the whale tracking feature is
        particularly valuable — you can see when large players are opening or closing significant
        positions, which can inform your own trading decisions.
      </P>
      <P>
        <InlineLink href="/projects/coinpilot">Coinpilot</InlineLink> is an AI-powered copy trading
        app that lets users mirror the trades of top-performing Hyperliquid traders. Rather than
        building your own strategy, you select traders based on their historical performance, risk
        profile, and trading style, and Coinpilot automatically replicates their trades in your
        account. This brings a social trading layer to Hyperliquid that is common on CEXs but rare
        in DeFi.
      </P>
      <P>
        <InlineLink href="/projects/katoshi">Katoshi</InlineLink> offers trading automation with 19+
        API endpoints for building custom bots and strategies on Hyperliquid. For algorithmic traders,
        Katoshi provides a higher-level abstraction than Hyperliquid&apos;s raw API, with features
        like pre-built strategy templates, risk management rules, and backtesting capabilities.
        Combined with Hyperliquid&apos;s zero-gas order placement and 200K orders per second
        throughput, Katoshi makes Hyperliquid one of the most bot-friendly trading venues in crypto.
      </P>

      <H2 id="infrastructure">Infrastructure</H2>
      <P>
        <InlineLink href="/projects/redstone">RedStone</InlineLink> provides oracle infrastructure,
        securing ~99.5% of oracle-protected value on HyperEVM. Its HyperStone product delivers
        3-millisecond price updates for HIP-3 markets, which is critical for perpetual contracts
        that need accurate, low-latency price feeds to function properly. Without reliable oracles,
        lending protocols cannot safely calculate collateral ratios and liquidation thresholds.
        RedStone&apos;s dominance in this role makes it foundational infrastructure for the entire
        DeFi stack.
      </P>
      <P>
        Cross-chain bridges including{" "}
        <InlineLink href="/projects/debridge">deBridge</InlineLink>,{" "}
        <InlineLink href="/projects/across-protocol">Across Protocol</InlineLink>, and{" "}
        <InlineLink href="/projects/layerzero">LayerZero</InlineLink> connect HyperEVM to 120+
        chains. These bridges are how most users get capital onto Hyperliquid in the first place —
        bridging USDC from Arbitrum, Ethereum, or other chains. LayerZero provides the messaging
        layer for cross-chain communication, while deBridge and Across focus on fast, secure token
        transfers with different trust assumptions and speed trade-offs.
      </P>

      <H2 id="getting-started-hyperevm">How to Get Started with HyperEVM DeFi</H2>
      <P>
        Getting started with HyperEVM DeFi involves a few steps, but once your capital is on
        Hyperliquid, interacting with protocols is fast and inexpensive. Here is the recommended
        path for new users.
      </P>
      <P>
        <strong>Step 1: Bridge USDC to Hyperliquid.</strong> Go to app.hyperliquid.xyz and use
        the deposit feature to bridge USDC from Arbitrum. You will need USDC on Arbitrum and a
        small amount of ETH for the bridge transaction gas. The bridge typically completes in a
        few minutes.
      </P>
      <P>
        <strong>Step 2: Transfer to HyperEVM.</strong> Once your USDC is on Hyperliquid
        (HyperCore), you need to transfer it to the HyperEVM side to interact with DeFi
        protocols. Use the transfer function in the Hyperliquid app to move USDC from HyperCore
        to your HyperEVM address.
      </P>
      <P>
        <strong>Step 3: Buy HYPE for gas.</strong> HyperEVM transactions require HYPE for gas
        fees (similar to how Ethereum requires ETH). Buy a small amount of HYPE on the spot
        order book and transfer it to your HyperEVM address. Gas costs on HyperEVM are minimal,
        so a few dollars worth of HYPE is sufficient for many transactions.
      </P>
      <P>
        <strong>Step 4: Interact with protocols.</strong> With USDC and HYPE on HyperEVM, you
        can start using DeFi protocols. For newcomers, we recommend starting with liquid staking
        through <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> as your entry point.
        Deposit HYPE to receive kHYPE, which immediately starts earning staking rewards. From
        there, you can explore using kHYPE as collateral on lending protocols, providing liquidity
        on DEXs, or depositing into yield aggregator vaults. Liquid staking is the natural
        starting point because it is relatively low-risk, earns a predictable return, and
        produces a composable token (kHYPE) that opens doors to the rest of the ecosystem.
      </P>

      <H2 id="how-to-choose">How to Choose Projects</H2>
      <P>
        When evaluating HyperEVM projects, consider TVL (a proxy for trust and usage), audit status,
        team background, and token distribution. Projects with verified status on PerpWiki have been
        confirmed as legitimate by our research team. Always check if the protocol has been audited
        and understand the specific risks of each DeFi strategy before committing capital.
      </P>
      <P>
        Beyond surface-level metrics, look at how long the protocol has been live and whether it has
        weathered market stress events. A protocol with $100M TVL that maintained operations through
        a 40% HYPE drawdown is more proven than a $500M TVL protocol that launched during a bull
        run. Check whether the team is publicly known or anonymous — both are valid in crypto, but
        anonymous teams carry additional trust assumptions. Finally, understand the token economics:
        does the protocol have a governance token? What is the emission schedule? Are insiders
        heavily allocated? These factors affect long-term sustainability and alignment between the
        protocol and its users.
      </P>

      <CTA href="/projects?layer=HYPEREVM">Browse all HyperEVM projects &rarr;</CTA>
    </LearnLayout>
  );
}
