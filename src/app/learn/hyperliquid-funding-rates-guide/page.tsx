import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-funding-rates-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid Funding Rates Explained: How to Read, Profit & Hedge",
  description:
    "Complete guide to Hyperliquid funding rates: how 8-hour intervals work, positive vs negative rates, cash-and-carry strategies, and delta-neutral farming.",
  openGraph: {
    title: "Hyperliquid Funding Rates Explained",
    description:
      "How funding rates work on Hyperliquid, how to read them, and strategies for profiting from rate differentials.",
  },
};

const TOC = [
  { id: "what-are-funding-rates", title: "What Are Funding Rates?" },
  { id: "how-funding-works-on-hl", title: "How Funding Works on Hyperliquid" },
  { id: "positive-vs-negative", title: "Positive vs Negative Rates" },
  { id: "reading-funding-data", title: "Reading the Funding Data" },
  { id: "cash-and-carry", title: "Cash-and-Carry Strategy" },
  { id: "delta-neutral-farming", title: "Delta-Neutral Farming" },
  { id: "risks-and-pitfalls", title: "Risks and Pitfalls" },
  { id: "advanced-tips", title: "Advanced Tips" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "How often are funding rates paid on Hyperliquid?",
    answer:
      "Funding rates on Hyperliquid are calculated and settled every 8 hours — at 00:00, 08:00, and 16:00 UTC. Payments are automatically applied to open positions at each settlement interval.",
  },
  {
    question: "Can you make money from Hyperliquid funding rates?",
    answer:
      "Yes. Traders can profit from funding rates through cash-and-carry strategies (holding spot and shorting perps to collect positive funding) or by timing entries when funding is extreme and likely to revert. However, funding rate farming carries risks including rate reversal and basis risk.",
  },
  {
    question: "What happens if I close my position before funding is paid?",
    answer:
      "Funding is only paid at the 8-hour settlement intervals. If you close your position before the next settlement, you will not receive or pay funding for that period. There is no pro-rata calculation for partial intervals.",
  },
  {
    question: "Why are Hyperliquid funding rates different from Binance?",
    answer:
      "Hyperliquid and Binance calculate funding rates using different formulas and market conditions. Hyperliquid's rates are based on the premium between the perpetual price and the spot index price on its own order book. Differences in liquidity depth, trader positioning, and market maker behavior can cause rates to diverge between venues.",
  },
  {
    question: "What is a good funding rate to farm on Hyperliquid?",
    answer:
      "Rates above 0.01% per 8 hours (approximately 13.7% annualized) are generally considered attractive for cash-and-carry strategies. However, higher rates also indicate more crowded positioning, which increases the risk of sudden rate reversals. Most experienced traders look for rates between 0.01% and 0.05% that have been sustained for multiple intervals.",
  },
];

export default function HyperliquidFundingRatesGuidePage() {
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

      <H2 id="what-are-funding-rates">What Are Funding Rates?</H2>
      <P>
        Funding rates are periodic payments exchanged between traders holding long and short
        perpetual futures positions. They exist for a simple reason: perpetual contracts have no
        expiry date, so there is no natural mechanism to keep the perpetual price anchored to the
        underlying spot price. Funding rates solve this problem by creating a financial incentive
        for traders to push the perpetual price back toward spot.
      </P>
      <P>
        When the perpetual price trades above the spot index price (a positive premium), long
        holders pay short holders. This payment discourages additional longs and incentivizes
        shorts, which pushes the perp price down toward spot. When the perpetual trades below
        spot (a negative premium), the reverse happens: shorts pay longs, incentivizing buyers
        and pushing the price back up.
      </P>
      <P>
        Funding rates are the backbone of every perpetual futures market — on{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>, on centralized
        exchanges, and across every perp DEX. Understanding them is essential for any serious
        derivatives trader because they directly affect your profitability on every open position.
      </P>

      <H2 id="how-funding-works-on-hl">How Funding Works on Hyperliquid</H2>
      <P>
        Hyperliquid settles funding rates every 8 hours at three fixed intervals: 00:00 UTC,
        08:00 UTC, and 16:00 UTC. At each settlement, the protocol calculates the premium
        between the perpetual mark price and the spot index price, applies a dampening formula,
        and distributes payments between longs and shorts.
      </P>
      <P>
        The funding rate calculation follows an approach similar to centralized exchanges. The
        rate is derived from the time-weighted average premium (TWAP) of the perpetual price
        relative to the spot index over the preceding 8-hour window. A clamp function limits how
        extreme the rate can be in a single interval, preventing erratic swings caused by
        momentary price dislocations.
      </P>
      <P>
        Payments are settled automatically. If you hold a long position and the funding rate is
        positive, the funding payment is deducted from your margin balance at settlement. If you
        are short, you receive the payment. The amount you pay or receive is calculated as:
        position size multiplied by the funding rate. For a $100,000 long position with a +0.01%
        funding rate, you would pay $10 at that settlement interval.
      </P>
      <P>
        Importantly, funding is exchanged directly between traders — the protocol does not take a
        cut. Hyperliquid acts purely as the settlement infrastructure. This peer-to-peer structure
        means funding is a zero-sum transfer: every dollar paid by longs is received by shorts,
        and vice versa.
      </P>

      <H2 id="positive-vs-negative">Positive vs Negative Rates</H2>
      <P>
        <strong>Positive funding</strong> occurs when the perpetual price trades above the spot
        index. This is the most common state during bullish market conditions, when more traders
        want to go long than short. Positive funding means longs pay shorts. In a sustained bull
        market, positive funding can persist for days or weeks, steadily eroding the margin of
        leveraged long positions while rewarding shorts.
      </P>
      <P>
        <strong>Negative funding</strong> occurs when the perpetual price trades below spot.
        This typically happens during bearish conditions or when there is heavy hedging demand.
        When funding is negative, shorts pay longs. Negative funding environments are less common
        but can be intense — during sharp sell-offs, funding rates can turn deeply negative as
        traders rush to open short positions, creating a premium for being long.
      </P>
      <P>
        The magnitude of the rate matters as much as the direction. A funding rate of +0.001% is
        negligible — it costs a $100,000 position just $1 per 8-hour interval. But a rate of
        +0.05% costs $50 per interval, or $150 per day. At that level, funding becomes a
        meaningful drag on leveraged positions and a meaningful source of income for the other
        side.
      </P>
      <P>
        Experienced Hyperliquid traders monitor funding rates across all markets using the{" "}
        <InlineLink href="/funding-rates">perp.wiki funding rates dashboard</InlineLink>, which
        aggregates current and historical rates across every listed perpetual.
      </P>

      <H2 id="reading-funding-data">Reading the Funding Data</H2>
      <P>
        The Hyperliquid interface displays the current funding rate on each market&apos;s trading
        page, along with a countdown timer to the next settlement. The rate shown is the
        estimated rate for the current 8-hour interval based on the premium so far — it is not
        finalized until settlement.
      </P>
      <P>
        When evaluating funding data, pay attention to three key metrics. First, the current
        rate: this tells you the instantaneous cost of holding your position through the next
        settlement. Second, the historical average: sustained high rates are more meaningful than
        one-off spikes. Third, the annualized rate: multiplying the 8-hour rate by 1,095 (365
        days times 3 intervals per day) gives you the annualized cost or yield, which is useful
        for comparing against other yield opportunities.
      </P>
      <P>
        For example, a funding rate of 0.01% per 8 hours annualizes to approximately 10.95%.
        A rate of 0.03% per 8 hours annualizes to roughly 32.85%. These are significant numbers
        — they mean that a leveraged long position is paying the equivalent of 11-33% per year
        just in funding, before any profit or loss from the trade itself.
      </P>

      <H2 id="cash-and-carry">Cash-and-Carry Strategy</H2>
      <P>
        The cash-and-carry trade is the most popular way to profit from funding rates. The
        concept is straightforward: buy the spot asset and simultaneously short the same asset on
        the perpetual market. Your net exposure to price movement is zero (delta-neutral), and
        you collect the funding rate payments from your short position when funding is positive.
      </P>
      <P>
        On Hyperliquid, a typical cash-and-carry setup looks like this: buy $10,000 of ETH on
        the spot market (either on Hyperliquid&apos;s native spot order book or on an external
        exchange), then open a $10,000 short ETH-PERP position on Hyperliquid. If the ETH
        funding rate is +0.02% per 8 hours, you collect roughly $2 every 8 hours, or $6 per day,
        or approximately $2,190 per year — a 21.9% annualized return on your notional exposure.
      </P>
      <P>
        The key advantage of this strategy is that you are indifferent to whether ETH goes up or
        down. Your spot position gains offset your perpetual losses (and vice versa). You are
        purely harvesting the funding rate spread. This makes it a popular strategy for traders
        who want yield without directional exposure.
      </P>
      <P>
        However, the strategy has important nuances. You need to manage your margin on the short
        side — if ETH pumps significantly, your short position requires more margin even though
        your spot position has gained equally. You also need to account for the basis risk: the
        perpetual price and spot price can diverge temporarily, creating unrealized PnL swings
        even on a delta-neutral book.
      </P>

      <H2 id="delta-neutral-farming">Delta-Neutral Farming</H2>
      <P>
        Delta-neutral funding rate farming extends the cash-and-carry concept across multiple
        markets simultaneously. Instead of farming funding on a single pair, sophisticated
        traders run positions across 5-10 markets, concentrating on the pairs with the highest
        sustained funding rates.
      </P>
      <P>
        The diversification reduces the risk of any single rate reversal destroying your
        profitability. If BTC funding turns negative but ETH, SOL, and DOGE funding remain
        strongly positive, the portfolio as a whole continues to generate yield. Many funding
        rate farmers rotate their positions weekly, closing trades on pairs where rates have
        compressed and opening new positions where rates are elevated.
      </P>
      <P>
        Some traders combine Hyperliquid funding rate farming with positions on other venues.
        For example, you might go long BTC on Binance (where funding is +0.005%) and short BTC
        on Hyperliquid (where funding is +0.025%), capturing the differential. This cross-venue
        arbitrage requires accounts on both platforms and introduces additional complexity around
        margin management and transfer timing.
      </P>
      <P>
        Automated tools and bots have become popular for managing delta-neutral farming
        strategies. Several Hyperliquid ecosystem projects offer funding rate farming bots that
        automatically identify the highest-yielding markets, open hedged positions, and rebalance
        as rates change. Check our{" "}
        <InlineLink href="/learn/best-hyperliquid-trading-bots">trading bots guide</InlineLink>{" "}
        for options.
      </P>

      <H2 id="risks-and-pitfalls">Risks and Pitfalls</H2>
      <P>
        <strong>Rate reversal.</strong> Funding rates can change direction rapidly. A market that
        has been paying +0.03% for a week can flip to -0.02% in a single interval if sentiment
        shifts. When this happens, your short position stops earning and starts paying. If you
        are slow to unwind, you can give back days of accumulated funding in a few intervals.
      </P>
      <P>
        <strong>Margin management.</strong> Even on a delta-neutral trade, your perpetual
        position requires margin. If the underlying price moves sharply against your perp side
        (for example, a 20% rally when you are short), your margin can be depleted and your
        position liquidated — even though your spot side has gained equally. Always use
        conservative leverage (ideally 2-3x or less) and maintain excess margin to absorb
        volatility.
      </P>
      <P>
        <strong>Execution slippage.</strong> Entering and exiting cash-and-carry trades requires
        executing both the spot and perp legs simultaneously. If you get filled on one side but
        not the other, you have unhedged directional exposure. Use limit orders and be prepared
        for partial fills.
      </P>
      <P>
        <strong>Opportunity cost.</strong> Capital locked in funding rate trades could be deployed
        elsewhere — in the{" "}
        <InlineLink href="/learn/hlp-vault-guide">HLP vault</InlineLink>, in lending protocols,
        or in directional trades. Funding rate farming typically yields 10-30% annualized, which
        is competitive but not exceptional compared to other DeFi yield sources on Hyperliquid.
      </P>

      <H2 id="advanced-tips">Advanced Tips</H2>
      <P>
        <strong>Monitor open interest alongside funding.</strong> High funding rates combined
        with rising{" "}
        <InlineLink href="/learn/hyperliquid-open-interest-explained">open interest</InlineLink>{" "}
        suggest the rate is sustainable because new positions are being added. High funding with
        declining open interest suggests the rate is about to collapse as positions unwind.
      </P>
      <P>
        <strong>Use the predicted rate, not just the current rate.</strong> Hyperliquid displays
        a predicted funding rate based on the current premium. This predicted rate can differ
        significantly from the final settled rate if the premium changes in the hours before
        settlement. Pay attention to the trend in the predicted rate over the interval.
      </P>
      <P>
        <strong>Watch for liquidation cascades.</strong> Large liquidation events can temporarily
        spike funding rates in one direction as the market absorbs liquidated positions. These
        spikes often revert quickly and can create short-lived opportunities — or traps if you
        enter too aggressively.
      </P>
      <P>
        <strong>Compare across venues.</strong> Hyperliquid&apos;s funding rates frequently
        diverge from rates on Binance, Bybit, and other exchanges. Tracking these differentials
        is one of the most consistent edges available to active traders. The{" "}
        <InlineLink href="/markets">perp.wiki markets page</InlineLink> provides cross-venue
        rate comparisons to help identify opportunities.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/funding-rates">View live funding rates &rarr;</CTA>
    </LearnLayout>
  );
}
