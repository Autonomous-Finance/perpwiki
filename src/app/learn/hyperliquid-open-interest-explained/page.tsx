import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import { LiveTopOI, LiveFundingRatesTable, LiveEcosystemStats } from "@/components/learn/LiveData";
import { NumberCalloutRow } from "@/components/learn/UiBlocks";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SLUG = "hyperliquid-open-interest-explained";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid Open Interest: Market Signals Guide",
  description:
    "Learn what open interest means on Hyperliquid, how to read it, its relationship to volume, and what rising or falling OI signals about market direction.",
  openGraph: {
    title: "Open Interest on Hyperliquid Explained",
    description:
      "What open interest tells you about Hyperliquid markets: how to read OI, volume relationships, and trading signals.",
    type: "article",
  },
};

const TOC = [
  { id: "what-is-open-interest", title: "What Is Open Interest?" },
  { id: "how-oi-changes", title: "How Open Interest Changes" },
  { id: "oi-vs-volume", title: "OI vs Volume" },
  { id: "reading-oi-signals", title: "Reading OI Signals" },
  { id: "oi-on-hyperliquid", title: "OI on Hyperliquid" },
  { id: "oi-and-funding", title: "OI and Funding Rates" },
  { id: "practical-use", title: "Practical Use Cases" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is open interest on Hyperliquid?",
    answer:
      "Open interest (OI) is the total number of outstanding perpetual futures contracts that have not been settled or closed. On Hyperliquid, OI is measured in USD and represents the total notional value of all open long positions (which equals the total notional value of all open short positions).",
  },
  {
    question: "What does rising open interest mean?",
    answer:
      "Rising open interest means new positions are being opened — new money is entering the market. If price is rising with increasing OI, it suggests the uptrend is supported by new buying. If price is falling with increasing OI, it suggests new short positions are being added and the downtrend has conviction.",
  },
  {
    question: "What does falling open interest mean?",
    answer:
      "Falling open interest means existing positions are being closed — traders are taking profits or cutting losses. This typically indicates a loss of conviction in the current trend. Price moves on declining OI are generally considered less sustainable than moves on increasing OI.",
  },
  {
    question: "Where can I check Hyperliquid open interest?",
    answer:
      "Open interest data is visible on the Hyperliquid trading interface for each market. Aggregated OI data across all markets is available on perp.wiki's markets page, which also shows historical OI trends and cross-market comparisons.",
  },
  {
    question: "Is high open interest bullish or bearish?",
    answer:
      "High open interest alone is neither bullish nor bearish — it simply means there is significant positioning in the market. The signal comes from the direction of OI change combined with price movement. Rising price + rising OI = bullish. Falling price + rising OI = bearish. High but declining OI suggests the current trend is losing participation.",
  },
];

export default async function HyperliquidOpenInterestExplainedPage() {
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

      <H2 id="what-is-open-interest">What Is Open Interest?</H2>
      <P>
        Open interest (OI) is the total value of all outstanding perpetual futures contracts
        that have not yet been closed or liquidated. It represents the total amount of money
        actively committed to open positions in a market at any given moment. Unlike trading
        volume, which measures the total value of contracts traded over a period, open interest
        is a snapshot of current positioning.
      </P>

      {/* Live OI table — this is THE article for OI */}
      <LiveTopOI topN={10} />

      <P>
        In perpetual futures, every open position has two sides: a long and a short. When a new
        buyer opens a long position and a new seller opens a short position, one new contract is
        created and open interest increases. When an existing long closes their position by
        selling to an existing short who is also closing, open interest decreases. The key
        insight is that open interest tracks the creation and destruction of contracts, not just
        trading activity.
      </P>
      <P>
        On <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>, open interest
        is measured in USD notional value. If BTC-PERP has $500 million in open interest, it
        means there are $500 million worth of open long positions and $500 million worth of open
        short positions across all traders on the platform. This is a critical metric for
        understanding market health, trader conviction, and potential for volatility.
      </P>

      <H2 id="how-oi-changes">How Open Interest Changes</H2>
      <P>
        Open interest increases when a new long and a new short enter the market simultaneously.
        Buyer A wants to go long BTC and Seller B wants to go short BTC — they are matched, a
        new contract is created, and OI increases by the notional value of that contract.
      </P>
      <P>
        Open interest decreases when an existing long and an existing short both close their
        positions. Buyer A sells their long to Seller B who buys back their short — the contract
        is destroyed and OI decreases.
      </P>
      <P>
        Open interest stays the same when an existing position is transferred between traders.
        If Buyer A sells their long position and Buyer C takes the other side as a new long,
        the contract still exists — it just changed hands. Similarly, if a new buyer opens a
        long by trading against an existing short who is closing, one contract is destroyed and
        one is created, netting to zero change in OI.
      </P>
      <P>
        Liquidations reduce open interest because the liquidated position is forcibly closed.
        When a leveraged trader is liquidated, their position is unwound against the market or
        absorbed by the <InlineLink href="/learn/hlp-vault-guide">HLP vault</InlineLink>,
        reducing the total number of outstanding contracts.
      </P>

      <H2 id="oi-vs-volume">OI vs Volume</H2>
      <P>
        Open interest and trading volume are related but measure fundamentally different things.
        Volume tells you how much activity is happening — how many contracts are being traded.
        Open interest tells you how much positioning exists — how many contracts are currently
        open.
      </P>
      <P>
        A market can have high volume but low open interest if most of the trading is day traders
        opening and closing positions within the same session. Conversely, a market can have low
        volume but high open interest if traders have established large positions and are holding
        them without actively trading.
      </P>
      <P>
        The most actionable signal comes from comparing the two. High volume with increasing OI
        suggests strong conviction — new money is flowing into the market and staying. High
        volume with decreasing OI suggests position unwinding — existing traders are exiting
        in size. Low volume with stable OI indicates a quiet market where positions are being
        held but not added to.
      </P>

      <H2 id="reading-oi-signals">Reading OI Signals</H2>
      <P>
        <strong>Rising price + rising OI = bullish.</strong> This is the strongest bullish
        signal. Price is going up and new long positions are being opened to drive it higher.
        The uptrend is being fueled by fresh capital entering the market, not just by short
        covering. These moves tend to be more sustainable and can persist for extended periods.
      </P>
      <P>
        <strong>Rising price + falling OI = weak rally.</strong> Price is going up but existing
        positions are being closed. This typically means short sellers are getting squeezed and
        covering their positions (buying back), which pushes price higher temporarily. Once the
        shorts have finished covering, the buying pressure evaporates and the rally often
        reverses. Treat rallies on declining OI with skepticism.
      </P>
      <P>
        <strong>Falling price + rising OI = bearish.</strong> Price is dropping and new short
        positions are being added. This indicates that traders are actively betting on further
        downside and committing capital to those bets. This is the strongest bearish signal and
        suggests the sell-off has conviction behind it.
      </P>
      <P>
        <strong>Falling price + falling OI = capitulation.</strong> Price is dropping and
        existing longs are closing their positions (selling). This is the classic capitulation
        pattern — bulls are giving up and exiting. While painful, capitulation events often mark
        the bottom of sell-offs because the selling pressure from forced exits eventually
        exhausts itself.
      </P>

      <H2 id="oi-on-hyperliquid">OI on Hyperliquid</H2>

      <LiveEcosystemStats />

      <P>
        Hyperliquid displays open interest data on each market&apos;s trading page. The OI
        figure is shown in USD and updates in real time as positions are opened and closed.
        Because all trading on Hyperliquid is on-chain, OI data is fully transparent and
        verifiable — unlike centralized exchanges where OI figures are self-reported and
        unauditable.
      </P>
      <P>
        As of early 2026, Hyperliquid&apos;s total open interest across all markets regularly
        exceeds $5 billion. BTC-PERP and ETH-PERP account for the largest share, with each
        typically carrying $1-2 billion in OI. Altcoin markets vary widely — high-interest
        tokens like SOL, DOGE, and PEPE can carry hundreds of millions in OI during volatile
        periods, while less popular pairs may have $5-20 million.
      </P>
      <P>
        The <InlineLink href="/markets">perp.wiki markets page</InlineLink> aggregates OI data
        across all Hyperliquid markets, allowing you to see which pairs have the most
        positioning and how OI has changed over time. This is useful for identifying where the
        market&apos;s attention is focused and spotting divergences between OI trends and price
        action.
      </P>

      <H2 id="oi-and-funding">OI and Funding Rates</H2>

      <LiveFundingRatesTable topN={5} />

      <P>
        Open interest and{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rates</InlineLink>{" "}
        are closely related. High open interest combined with elevated positive funding rates
        indicates a crowded long trade — many traders are long and paying to hold those
        positions. This combination often precedes a &quot;long squeeze&quot; where a price dip
        triggers cascading liquidations.
      </P>
      <P>
        Conversely, high open interest with deeply negative funding rates suggests a crowded
        short trade. Shorts are paying to maintain their positions, and a price spike can
        trigger a &quot;short squeeze&quot; as liquidations force buying.
      </P>
      <P>
        Monitoring both metrics together gives you a more complete picture of market dynamics
        than either metric alone. A sudden spike in OI without a corresponding move in price
        suggests large positions being built in anticipation of a catalyst. A sudden drop in OI
        after an extended trend suggests the trend is exhausting as participants exit.
      </P>

      <H2 id="practical-use">Practical Use Cases</H2>
      <P>
        <strong>Identifying crowded trades.</strong> When OI on a specific market reaches
        historically high levels relative to its trading volume, the market is &quot;crowded.&quot;
        Crowded trades are vulnerable to sharp reversals because a small price move can trigger
        disproportionate liquidations, creating a cascade effect. Monitoring OI extremes helps
        you avoid entering crowded trades and can signal opportunities to trade against them.
      </P>
      <P>
        <strong>Confirming breakouts.</strong> When price breaks out of a trading range, check
        whether OI is increasing. A breakout on rising OI is more likely to sustain because new
        positions are being built in the direction of the breakout. A breakout on flat or
        declining OI is more likely to be a false breakout that reverses.
      </P>
      <P>
        <strong>Timing entries for funding rate farming.</strong> If you are running{" "}
        <InlineLink href="/learn/how-to-earn-yield-on-hyperliquid">funding rate strategies</InlineLink>,
        OI data helps you assess the sustainability of elevated rates. High funding rates
        supported by rising OI are more likely to persist because new positions are reinforcing
        the imbalance. High funding rates with declining OI suggest the rate is about to
        normalize as positions unwind.
      </P>
      <P>
        <strong>Gauging liquidation risk.</strong> Large concentrations of OI at specific price
        levels create liquidation clusters. When price approaches these levels, the potential for
        cascading liquidations increases. Hyperliquid&apos;s transparent on-chain data makes it
        possible to estimate where liquidation clusters are forming, though this requires more
        advanced analysis of position sizes and leverage levels.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/markets">View Hyperliquid market data &rarr;</CTA>
    </LearnLayout>
  );
}
