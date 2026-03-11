import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-liquidity-providers";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Become a Hyperliquid Liquidity Provider (HLP Guide)",
  description:
    "Complete guide to becoming a Hyperliquid liquidity provider through the HLP vault. Learn how to deposit USDC, earn 15-25% APR from market-making, and manage risks.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "How to Become a Hyperliquid Liquidity Provider (HLP Guide)",
    description:
      "Earn yield on Hyperliquid by providing liquidity through the HLP vault. Deposit USDC, earn from market-making, and understand the risks.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "How to Become a Hyperliquid Liquidity Provider (HLP Guide)",
    description:
      "Earn yield on Hyperliquid by providing liquidity through the HLP vault. Deposit USDC, earn from market-making, and understand the risks.",
  },
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is-hlp", title: "What Is HLP?" },
  { id: "how-hlp-works", title: "How HLP Works" },
  { id: "depositing", title: "How to Deposit into HLP" },
  { id: "hlp-returns", title: "HLP Returns & Historical Performance" },
  { id: "risks", title: "Risks of Providing Liquidity" },
  { id: "hlp-vs-staking", title: "HLP vs HYPE Staking" },
  { id: "advanced-strategies", title: "Advanced Strategies" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What APY does HLP pay?",
    answer:
      "HLP returns are variable and depend on market conditions. Historical annualized returns have ranged from 15-25% APR, driven by market-making spreads, taker fee share, liquidation profits, and funding rate capture. During high-volatility periods, returns can exceed 30% annualized, while quiet markets may produce 10-15%. There is no fixed or guaranteed APY.",
  },
  {
    question: "Is HLP safe?",
    answer:
      "HLP is non-custodial and operates entirely on-chain through Hyperliquid's L1 blockchain. Your deposit is secured by the protocol's smart contract infrastructure, and there is no lock-up period. However, HLP carries market risk — the vault can experience temporary drawdowns of 4-5% during extreme volatility when market-making positions move against it. Smart contract risk also exists, though the vault has operated without incident since 2023.",
  },
  {
    question: "What's the minimum deposit for HLP?",
    answer:
      "There is no minimum deposit for the HLP vault. You can deposit any amount of USDC, no matter how small. Your returns are proportional to your share of the total pool. There is also no lock-up period — you can withdraw your USDC at any time by redeeming your vault shares, with withdrawals typically settling within seconds.",
  },
  {
    question: "How does HLP compare to GMX's GLP?",
    answer:
      "HLP and GLP (now GM pools on GMX v2) serve similar purposes — both let users earn yield by providing liquidity to a perpetual exchange — but they work differently. HLP uses an active market-making strategy on a central limit order book, while GMX uses oracle-based pricing with a liquidity pool model. HLP typically offers higher returns (15-25% vs 10-20% for GMX) but with different risk characteristics. HLP risk comes from market-making exposure, while GLP/GM risk comes from acting as counterparty to all traders. HLP has no lock-up period; GMX has a 15-minute cooldown. Both are USDC-denominated.",
  },
];

export default function HyperliquidLiquidityProvidersPage() {
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

      <H2 id="introduction">Introduction</H2>
      <P>
        Hyperliquid processes billions of dollars in daily perpetual futures volume, and all of that
        trading activity needs liquidity. The protocol&apos;s answer is the{" "}
        <InlineLink href="/projects/hlp">HLP (Hyperliquidity Provider)</InlineLink> vault — a
        community-funded pool that acts as the primary market maker across every perpetual market on
        the platform. For users looking to earn passive yield on their USDC without actively trading,
        HLP represents one of the most compelling opportunities in DeFi.
      </P>
      <P>
        This guide covers everything you need to know about becoming a Hyperliquid liquidity provider:
        what HLP actually does behind the scenes, how to deposit your capital, what kind of returns
        you can realistically expect, and the risks you should understand before committing funds.
        Whether you are a DeFi veteran or exploring Hyperliquid for the first time, this article will
        give you a thorough understanding of how HLP works and whether it fits your investment strategy.
      </P>

      <H2 id="what-is-hlp">What Is HLP?</H2>
      <P>
        HLP stands for Hyperliquidity Provider. It is Hyperliquid&apos;s protocol-operated, community-funded
        liquidity vault — the single largest source of liquidity on the Hyperliquid order book. When you
        deposit USDC into HLP, your capital joins a collective pool that performs two critical functions
        for the exchange: market-making across all perpetual markets and serving as the liquidation
        backstop for leveraged positions.
      </P>
      <P>
        Unlike user-created vaults on Hyperliquid (which are managed by individual traders and charge
        management fees), HLP is operated directly by the protocol. There are no management fees, no
        performance fees, and no intermediary taking a cut. 100% of the vault&apos;s profits flow to
        depositors in proportion to their share of the pool. This fee-free structure makes HLP one of
        the most transparent yield products available in decentralized finance.
      </P>
      <P>
        As of early 2026, the HLP vault holds over $370 million in total value locked (TVL) and has
        generated more than $43 million in cumulative profits since launch. It operates continuously
        across all 229+ perpetual markets listed on Hyperliquid, processing the liquidity demands of
        over $3.4 billion in daily trading volume.
      </P>

      <H2 id="how-hlp-works">How HLP Works</H2>
      <P>
        Understanding how HLP generates returns requires understanding the mechanics of market-making.
        The vault earns yield through four distinct revenue streams, all driven by Hyperliquid&apos;s
        trading activity.
      </P>
      <P>
        <strong>Market-making spreads.</strong> HLP continuously places limit orders on both sides of
        the order book — bids below the current price and asks above it — across every perpetual market.
        When a taker order fills against one of these limit orders, HLP captures the difference between
        the bid and ask price (the spread). Higher trading volume means more orders get filled, which
        means more spread revenue for the vault. This is the most consistent and predictable source of
        HLP income.
      </P>
      <P>
        <strong>Taker fee share.</strong> HLP receives a portion of the taker fees paid on every trade
        executed on Hyperliquid. With billions in daily volume, even a small percentage of taker fees
        translates into substantial revenue. This revenue stream is directly proportional to exchange
        volume — as Hyperliquid grows, this income grows with it.
      </P>
      <P>
        <strong>Liquidation revenue.</strong> When leveraged traders get liquidated, HLP takes over their
        positions at favorable prices. During volatile market conditions, liquidation cascades can produce
        outsized profits for the vault. This is the most variable revenue stream — it spikes during market
        turmoil and is minimal during calm periods. Historically, some of HLP&apos;s best-performing days
        have been during major liquidation events.
      </P>
      <P>
        <strong>Funding rate capture.</strong> Perpetual futures use funding rates to keep contract prices
        aligned with spot markets. When HLP holds positions that earn positive funding (which occurs
        naturally as part of its market-making activity), it captures that yield as additional revenue.
        This is a secondary income source that supplements the other three streams. For a deeper
        understanding of funding mechanics, see our{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rates guide</InlineLink>.
      </P>

      <H2 id="depositing">How to Deposit into HLP</H2>
      <P>
        Depositing into HLP is a straightforward process that takes less than five minutes. Here is the
        step-by-step walkthrough.
      </P>
      <P>
        <strong>Step 1: Get USDC on Hyperliquid.</strong> If your funds are on another chain, you need to
        bridge USDC to Hyperliquid first. The native bridge from Arbitrum is the simplest option — go to
        app.hyperliquid.xyz, connect your wallet, and bridge your USDC. It costs approximately $1 in gas
        and takes 1-2 minutes. You can also use{" "}
        <InlineLink href="/learn/how-to-bridge-to-hyperliquid">third-party bridges</InlineLink> from
        other chains.
      </P>
      <P>
        <strong>Step 2: Navigate to Vaults.</strong> Once your USDC is on Hyperliquid, click the
        &quot;Vaults&quot; tab in the main navigation bar. This displays all available vaults, including
        the protocol-operated HLP vault and any user-created vaults.
      </P>
      <P>
        <strong>Step 3: Select HLP and deposit.</strong> HLP is the featured vault at the top of the page,
        prominently displaying its TVL, all-time PnL, and current estimated APY. Click on it, enter the
        amount of USDC you want to deposit, and confirm the transaction in your wallet. There is no
        minimum deposit requirement.
      </P>
      <P>
        <strong>Step 4: Receive vault shares.</strong> Upon deposit, you receive vault shares proportional
        to the pool size at the time of your deposit. These shares represent your ownership stake. As the
        vault generates profits or incurs losses, the value of your shares adjusts automatically. There
        is nothing to claim separately — returns are reflected directly in your share value.
      </P>
      <P>
        <strong>Withdrawing.</strong> You can withdraw at any time with no lock-up period or exit fee.
        Navigate to Portfolio, then Vaults, and select &quot;Withdraw.&quot; Withdrawals settle on-chain
        within seconds. Your USDC is returned based on the current value of your vault shares, which
        includes any accumulated profits or losses since your deposit.
      </P>

      <H2 id="hlp-returns">HLP Returns &amp; Historical Performance</H2>
      <P>
        HLP returns are variable — there is no fixed or guaranteed APY. Historical annualized returns
        have ranged from approximately 15-25% APR under normal market conditions. During periods of
        extreme volatility and high trading volume, returns have exceeded 30% annualized. During
        extended quiet periods with compressed spreads and low volume, returns have dipped to 10-15%.
      </P>
      <P>
        The vault performs best during volatile markets. Sharp price movements in either direction
        generate liquidation cascades, wider bid-ask spreads, and higher trading volume — all of which
        benefit HLP&apos;s market-making strategy. Conversely, sideways markets with low volatility
        produce the weakest returns, as spreads compress and liquidation volume declines.
      </P>
      <P>
        All returns are denominated in USDC. This is an important distinction — HLP depositors have no
        exposure to HYPE token price fluctuations. Whether HYPE goes up 50% or down 50%, your HLP
        returns are determined purely by the vault&apos;s market-making performance. This makes HLP
        particularly attractive for users who want DeFi yield without taking on directional crypto risk.
      </P>
      <P>
        The maximum historical drawdown for HLP has been approximately 4-5% of TVL. These drawdowns
        have typically been recovered within days to weeks as normal trading resumes. The March 2025
        JELLY incident — where a whale attempted to manipulate a low-liquidity token — was the most
        significant stress test, but governance intervention prevented permanent losses. For details
        on that event, see our <InlineLink href="/learn/hlp-vault-guide">HLP Vault Guide</InlineLink>.
      </P>

      <H2 id="risks">Risks of Providing Liquidity</H2>
      <P>
        <strong>Market-making risk.</strong> HLP&apos;s positions can move against the vault during sudden,
        one-directional price movements. If BTC drops 15% in an hour, HLP&apos;s buy-side limit orders
        get filled while sell-side orders do not, leaving the vault with a growing long position in a
        falling market. These drawdowns are temporary and have always recovered historically, but they
        are an inherent part of market-making.
      </P>
      <P>
        <strong>Concentration risk.</strong> A single large trader taking an outsized position against HLP
        could cause a meaningful drawdown. The JELLY incident in March 2025 demonstrated this risk when a
        whale coordinated a manipulation attack through a low-liquidity token. Hyperliquid has since
        tightened position limits and risk parameters to mitigate this vector.
      </P>
      <P>
        <strong>Smart contract risk.</strong> HLP operates on-chain through Hyperliquid&apos;s native vault
        infrastructure. While this is more transparent than off-chain alternatives, any undiscovered bugs
        in the vault logic could theoretically affect depositor funds. The system has been operational
        since 2023 without a smart contract incident.
      </P>
      <P>
        <strong>Impermanent-like exposure.</strong> While HLP is not a traditional AMM liquidity pool, it
        shares some characteristics with impermanent loss. The vault&apos;s market-making activity means
        it is systematically buying when prices fall and selling when prices rise. In strongly trending
        markets, this can produce returns that lag what you would have earned by simply holding a
        directional position. The tradeoff is that HLP earns in all market conditions, whereas directional
        bets only pay off when you are right about direction.
      </P>

      <H2 id="hlp-vs-staking">HLP vs HYPE Staking</H2>
      <P>
        HLP and HYPE staking are the two primary passive yield options on Hyperliquid, but they serve
        very different purposes and have distinct risk profiles.
      </P>
      <P>
        <strong>HLP</strong> accepts USDC deposits, earns variable returns from market-making activity
        (historically 15-25% APR), has no lock-up period, and carries market risk from adverse price
        movements. Returns are USDC-denominated with zero HYPE price exposure.
      </P>
      <P>
        <strong>HYPE staking</strong> requires holding and staking HYPE tokens, earns a more predictable
        ~2.25% APY from validator consensus rewards, has an unbonding period when unstaking, and carries
        minimal slashing risk. Returns are effectively HYPE-denominated, meaning you benefit from HYPE
        price appreciation but are exposed to HYPE price declines.
      </P>
      <P>
        For users who hold USDC and want yield without token price exposure, HLP is the clear choice.
        For users who are already long HYPE and believe in its long-term value, native staking or liquid
        staking through <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> (kHYPE) or{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> (stHYPE) makes more sense. Many
        sophisticated users allocate to both strategies to diversify their yield sources. For a full
        breakdown of all yield options, see{" "}
        <InlineLink href="/learn/how-to-earn-yield-on-hyperliquid">How to Earn Yield on Hyperliquid</InlineLink>.
      </P>

      <H2 id="advanced-strategies">Advanced Strategies</H2>
      <P>
        <strong>HLP + funding rate arbitrage.</strong> Some advanced users combine an HLP deposit with
        delta-neutral funding rate strategies. By depositing the majority of their USDC into HLP for
        baseline yield and using a smaller allocation for funding rate farming on markets with elevated
        positive funding, they can stack multiple yield sources simultaneously. This requires active
        management of the funding rate positions but leaves the HLP portion fully passive.
      </P>
      <P>
        <strong>HLP as a volatility bet.</strong> Since HLP performs best during volatile markets,
        depositing into HLP before anticipated high-volatility events (major economic announcements,
        token unlocks, regulatory decisions) can produce outsized short-term returns. Some users treat
        HLP as a tactical allocation rather than a permanent holding — depositing during volatile
        periods and withdrawing during calm ones. The no-lock-up design makes this strategy frictionless.
      </P>
      <P>
        <strong>Portfolio diversification.</strong> HLP&apos;s USDC-denominated, market-neutral return
        profile makes it an excellent diversifier alongside directional crypto positions. If you hold a
        portfolio of HYPE, BTC, and ETH, allocating a portion to HLP provides yield that is uncorrelated
        with token price performance. During market drawdowns when your directional holdings lose value,
        HLP often performs well (due to increased volatility and liquidations), partially offsetting
        portfolio losses.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P>
            <strong>{f.question}</strong>
          </P>
          <P>{f.answer}</P>
        </div>
      ))}
    </LearnLayout>
  );
}
