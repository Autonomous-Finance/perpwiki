import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "best-hyperevm-defi-projects";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Best HyperEVM DeFi Projects 2026: Lending, Staking & Yield",
  description:
    "Top HyperEVM DeFi projects in 2026: Felix Protocol (feUSD stablecoin), HyperLend (lending), Kinetiq (liquid staking kHYPE), HyperBeat (yield aggregation), and Liminal (delta-neutral).",
  openGraph: {
    title: "Best HyperEVM DeFi Projects 2026",
    description:
      "The top DeFi protocols on HyperEVM: lending, staking, yield aggregation, and delta-neutral strategies.",
    type: "article",
  },
};

const TOC = [
  { id: "hyperevm-defi-overview", title: "HyperEVM DeFi Overview" },
  { id: "felix-protocol", title: "Felix Protocol — CDP Stablecoin" },
  { id: "hyperlend", title: "HyperLend — Lending Markets" },
  { id: "kinetiq", title: "Kinetiq — Liquid Staking (kHYPE)" },
  { id: "hyperbeat", title: "HyperBeat — Yield Aggregation" },
  { id: "liminal", title: "Liminal — Delta-Neutral Vaults" },
  { id: "comparison", title: "Project Comparison" },
  { id: "how-to-choose", title: "How to Choose" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is the best DeFi project on HyperEVM?",
    answer:
      "It depends on your goals. Felix Protocol is best for minting stablecoins against HYPE collateral. HyperLend offers flexible lending and borrowing. Kinetiq provides liquid staking with kHYPE. HyperBeat auto-compounds yield across protocols. Each serves a different use case.",
  },
  {
    question: "Is HyperEVM DeFi safe?",
    answer:
      "HyperEVM DeFi protocols carry standard smart contract risk. Major projects like Felix, Kinetiq, and HyperLend have undergone security audits, but no audit eliminates all risk. Users should diversify across protocols and only deposit what they can afford to lose.",
  },
  {
    question: "Can I use liquid staking tokens as collateral on HyperEVM?",
    answer:
      "Yes. kHYPE (from Kinetiq) and stHYPE (from StakedHYPE) are accepted as collateral on Felix Protocol and HyperLend, allowing you to earn staking rewards while borrowing or minting stablecoins against your position.",
  },
  {
    question: "What is feUSD on HyperEVM?",
    answer:
      "feUSD is a decentralized stablecoin minted through Felix Protocol. Users deposit HYPE or liquid staking tokens as collateral in a CDP (Collateralized Debt Position) and mint feUSD against it. feUSD is soft-pegged to $1 and can be used across HyperEVM DeFi.",
  },
  {
    question: "How do I get started with HyperEVM DeFi?",
    answer:
      "Bridge USDC or HYPE to HyperEVM using the Hyperliquid bridge. Then connect your wallet to any HyperEVM DeFi app. Start with liquid staking on Kinetiq (stake HYPE, receive kHYPE), then explore lending on HyperLend or minting feUSD on Felix Protocol.",
  },
];

export default function BestHyperEvmDefiProjectsPage() {
  return (
    <LearnLayout article={article} prev={prev} next={next} toc={TOC}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.datePublished,
          author: { "@type": "Organization", name: "perp.wiki", url: "https://perp.wiki" },
          publisher: { "@type": "Organization", name: "perp.wiki", url: "https://perp.wiki", logo: { "@type": "ImageObject", url: "https://perp.wiki/icon.svg" } },
          dateModified: article.datePublished,
          mainEntityOfPage: `https://perp.wiki/learn/${SLUG}`,
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

      <H2 id="hyperevm-defi-overview">HyperEVM DeFi Overview</H2>
      <P>
        <InlineLink href="/learn/what-is-hyperevm">HyperEVM</InlineLink> is the EVM-compatible
        smart contract layer running on Hyperliquid&apos;s L1 blockchain. Since its launch in
        early 2025, it has attracted a growing ecosystem of DeFi protocols that leverage
        Hyperliquid&apos;s speed, liquidity, and the HYPE token as a foundational asset. Total
        value locked across HyperEVM protocols has grown to over $2 billion, making it one of
        the fastest-growing DeFi ecosystems in crypto.
      </P>
      <P>
        What makes HyperEVM DeFi unique is its tight integration with HyperCore — the native
        trading layer. Protocols on HyperEVM can tap into Hyperliquid&apos;s deep order book
        liquidity, funding rate data, and native spot markets. This creates composability that
        is not possible on standalone EVM chains, where DeFi protocols operate in isolation from
        the exchange layer.
      </P>
      <P>
        This guide covers the five most significant DeFi projects on HyperEVM as of 2026, each
        serving a distinct purpose in the ecosystem: stablecoin minting, lending, liquid staking,
        yield aggregation, and delta-neutral strategies.
      </P>

      <H2 id="felix-protocol">Felix Protocol — CDP Stablecoin</H2>
      <P>
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> is the leading
        stablecoin protocol on HyperEVM. It operates a Collateralized Debt Position (CDP) model
        similar to MakerDAO, allowing users to deposit HYPE, kHYPE, or stHYPE as collateral and
        mint feUSD — a decentralized stablecoin soft-pegged to the US dollar.
      </P>
      <P>
        The CDP model works as follows: you deposit collateral (say, $10,000 worth of HYPE) into
        a Felix vault and can mint feUSD against it up to a certain loan-to-value ratio. If the
        value of your collateral drops below the liquidation threshold, your position is
        liquidated to protect the protocol&apos;s solvency. This is the same mechanism that has
        powered MakerDAO&apos;s DAI for years, adapted for the Hyperliquid ecosystem.
      </P>
      <P>
        What makes Felix particularly powerful is its acceptance of liquid staking tokens as
        collateral. If you deposit kHYPE (from{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink>), you continue earning staking
        rewards on your collateral even while borrowing feUSD against it. This effectively lets
        you leverage your staking position: earn 5-10% staking APY on your HYPE while
        simultaneously deploying feUSD into other yield opportunities.
      </P>
      <P>
        Felix has accumulated significant TVL and feUSD has maintained a tight peg to $1 through
        multiple market cycles. The protocol has undergone multiple security audits and is
        considered one of the most battle-tested contracts on HyperEVM.
      </P>

      <H2 id="hyperlend">HyperLend — Lending Markets</H2>
      <P>
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> is the primary lending and
        borrowing protocol on HyperEVM. Built on a fork of Aave&apos;s battle-tested lending pool
        architecture, HyperLend allows users to supply assets to earn interest or borrow against
        their deposits.
      </P>
      <P>
        The protocol supports a range of assets including HYPE, USDC, kHYPE, stHYPE, feUSD, and
        several other HyperEVM-native tokens. Interest rates are determined algorithmically based
        on supply and demand — when utilization is high (many borrowers relative to suppliers),
        rates rise to attract more deposits. When utilization is low, rates compress.
      </P>
      <P>
        HyperLend fills a critical gap in the HyperEVM ecosystem. Before its launch, there was no
        native way to borrow against HYPE holdings without selling. Now, traders can deposit HYPE
        as collateral, borrow USDC, and use that USDC for trading or other DeFi activities — all
        without giving up exposure to HYPE&apos;s price appreciation.
      </P>
      <P>
        Supply APYs on HyperLend vary by asset. USDC lending has historically offered 3-8% APY,
        while lending HYPE or liquid staking tokens can offer higher rates during periods of
        elevated borrow demand. Borrowing rates are typically 2-5 percentage points higher than
        supply rates, with the spread funding the protocol&apos;s reserves.
      </P>

      <H2 id="kinetiq">Kinetiq — Liquid Staking (kHYPE)</H2>
      <P>
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the leading liquid staking
        protocol on Hyperliquid. It solves a fundamental problem with native HYPE staking: when
        you stake HYPE directly to a validator, your tokens are locked and cannot be used in
        DeFi. Kinetiq lets you stake HYPE and receive kHYPE — a liquid representation of your
        staked position — that can be freely traded, used as collateral, or deployed across
        HyperEVM DeFi.
      </P>
      <P>
        kHYPE accrues staking rewards automatically. Over time, each kHYPE becomes redeemable for
        an increasing amount of HYPE as staking rewards accumulate. You do not need to claim
        rewards separately — they are embedded in the kHYPE exchange rate. If you deposit 100
        HYPE today and receive 100 kHYPE, six months later those 100 kHYPE might be redeemable
        for 104 HYPE (reflecting approximately 8% annualized rewards).
      </P>
      <P>
        The composability of kHYPE is what makes it so valuable. Use it as collateral on{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> to mint feUSD.
        Deposit it into <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> to earn
        lending interest on top of staking rewards. Provide kHYPE/HYPE liquidity on{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> to earn DEX fees. Each
        layer of composability adds additional yield on top of the base staking return.
      </P>
      <P>
        Kinetiq distributes staked HYPE across multiple validators, reducing concentration risk
        compared to staking with a single validator. The protocol has undergone security audits
        and holds the largest share of liquid-staked HYPE on the network.
      </P>

      <H2 id="hyperbeat">HyperBeat — Yield Aggregation</H2>
      <P>
        <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink> is a yield aggregation
        protocol that automatically allocates capital across HyperEVM DeFi opportunities to
        maximize returns. Instead of manually moving funds between lending protocols, liquidity
        pools, and staking positions, HyperBeat&apos;s vaults handle the optimization
        automatically.
      </P>
      <P>
        The protocol operates through a series of strategy vaults, each targeting a different
        risk-return profile. Conservative vaults focus on lending and staking — depositing into
        HyperLend and Kinetiq for relatively stable returns. Aggressive vaults employ more
        complex strategies including leveraged yield farming, liquidity provision on volatile
        pairs, and funding rate arbitrage.
      </P>
      <P>
        HyperBeat&apos;s auto-compounding feature is particularly valuable. DeFi yields that
        are not compounded lose significant value over time. If a lending protocol pays 10% APY
        but you only collect and reinvest monthly, your effective return is lower than if rewards
        are compounded continuously. HyperBeat handles this automatically, reinvesting earned
        yield back into the strategy at optimal intervals.
      </P>
      <P>
        The protocol charges a performance fee on generated yield (typically 10-15% of profits)
        but no management fee on deposited capital. This aligns the protocol&apos;s incentives
        with depositors — HyperBeat only earns when you earn.
      </P>

      <H2 id="liminal">Liminal — Delta-Neutral Vaults</H2>
      <P>
        <InlineLink href="/projects/liminal">Liminal</InlineLink> takes a different approach to
        DeFi yield by operating delta-neutral vaults that generate returns without directional
        market exposure. The protocol achieves this by combining spot positions on HyperEVM with
        hedging positions on Hyperliquid&apos;s perpetual markets — effectively automating the
        cash-and-carry strategies that manual traders execute themselves.
      </P>
      <P>
        Users deposit USDC into Liminal vaults, and the protocol automatically constructs hedged
        positions across the highest-yielding funding rate opportunities on Hyperliquid. When
        funding rates on BTC are elevated, Liminal buys spot BTC and shorts BTC perps, capturing
        the funding rate while maintaining zero net exposure to BTC price movements.
      </P>
      <P>
        The appeal of Liminal is simplicity for end users. Running a cash-and-carry strategy
        manually requires monitoring funding rates, managing margin, adjusting positions, and
        handling the spot and perp legs separately. Liminal abstracts all of this into a single
        deposit-and-earn vault. Returns are denominated in USDC, making them easy to understand
        and compare against other yield options.
      </P>
      <P>
        Liminal&apos;s vaults have generated returns in the 10-25% APY range historically,
        depending on funding rate conditions. Performance is highest during periods of elevated
        positive funding (typically bull markets) and lower during quiet, range-bound conditions
        when funding rates compress toward zero.
      </P>

      <H2 id="comparison">Project Comparison</H2>
      <ComparisonTable
        headers={["Project", "Category", "Deposit Asset", "Typical APY", "Key Risk"]}
        rows={[
          ["Felix Protocol", "CDP Stablecoin", "HYPE / kHYPE / stHYPE", "N/A (stablecoin minting)", "Liquidation risk"],
          ["HyperLend", "Lending", "USDC / HYPE / kHYPE", "3-12% (supply)", "Smart contract risk"],
          ["Kinetiq", "Liquid Staking", "HYPE", "5-10%", "Validator + contract risk"],
          ["HyperBeat", "Yield Aggregation", "Various", "8-20%", "Strategy risk"],
          ["Liminal", "Delta-Neutral", "USDC", "10-25%", "Funding rate reversal"],
        ]}
      />

      <H2 id="how-to-choose">How to Choose</H2>
      <P>
        The right HyperEVM DeFi project depends on what you are trying to achieve. If you hold
        HYPE and want to earn staking rewards while keeping your tokens liquid, start with{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink>. If you need a stablecoin
        against your HYPE position (perhaps to fund trading on HyperCore), use{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink>. If you hold
        USDC and want passive yield without managing positions,{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> lending or a{" "}
        <InlineLink href="/projects/liminal">Liminal</InlineLink> vault may be appropriate.
      </P>
      <P>
        Many experienced users stack multiple protocols. A common approach: stake HYPE via
        Kinetiq, deposit kHYPE into Felix to mint feUSD, then lend the feUSD on HyperLend. This
        creates three layers of yield (staking + CDP stability pool + lending) on a single
        underlying HYPE position. This composability is the defining feature of HyperEVM DeFi
        and what sets it apart from isolated DeFi ecosystems.
      </P>
      <P>
        For a broader overview of all projects building on the Hyperliquid ecosystem, see our{" "}
        <InlineLink href="/learn/best-hyperevm-projects">Best HyperEVM Projects</InlineLink>{" "}
        guide, which covers DEXs, tooling, and infrastructure beyond just DeFi.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/projects">Explore all HyperEVM projects &rarr;</CTA>
    </LearnLayout>
  );
}
