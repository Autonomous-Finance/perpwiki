import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "perpetual-futures-vs-prediction-markets";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Perpetual Futures vs Prediction Markets — Which Suits You?",
  description:
    "Perpetual futures vs prediction markets: mechanics, leverage, liquidation risk, liquidity, and which instrument fits your trading style.",
  openGraph: {
    title: "Perpetual Futures vs Prediction Markets — Which Suits You?",
    description:
      "Perpetual futures vs prediction markets: mechanics, leverage, liquidation risk, liquidity, and which instrument fits your trading style.",
    type: "article",
  },
};

const TOC = [
  { id: "overview", title: "Two Ways to Speculate" },
  { id: "how-perps-work", title: "How Perpetual Futures Work" },
  { id: "how-prediction-markets-work", title: "How Prediction Markets Work" },
  { id: "key-differences", title: "Key Differences" },
  { id: "leverage-and-risk", title: "Leverage & Liquidation Risk" },
  { id: "liquidity", title: "Liquidity & Markets" },
  { id: "hyperliquid-vs-polymarket", title: "Hyperliquid vs Polymarket" },
  { id: "which-suits-you", title: "Which Suits You?" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is the difference between perpetual futures and prediction markets?",
    answer: "Perpetual futures are synthetic leverage instruments that track asset prices — they never expire and use a funding rate mechanism to stay anchored to spot. Prediction markets are binary or scalar contracts that resolve based on real-world events. Perps are for directional price speculation; prediction markets are for event-driven bets.",
  },
  {
    question: "Do prediction markets have liquidation risk?",
    answer: "No. In a prediction market, your maximum loss is the amount you paid for your position (shares priced 0–$1). There is no leverage and no liquidation. In perpetual futures, underfunded positions are liquidated by the exchange's liquidation engine.",
  },
  {
    question: "What is the largest perpetual futures DEX?",
    answer: "Hyperliquid is the largest on-chain perpetual DEX by volume, processing over $30 billion in daily trades across 500+ trading pairs. It runs on its own L1 blockchain with a native order book (HyperCore) and EVM-compatible smart contract layer (HyperEVM).",
  },
  {
    question: "What is the largest prediction market?",
    answer: "Polymarket is the largest prediction market by volume, processing over $1 billion monthly across 500+ active markets covering politics, crypto, sports, and science. For a full directory of prediction market platforms and tools, see pm.wiki.",
  },
  {
    question: "Can I use both perpetual futures and prediction markets?",
    answer: "Yes, and many sophisticated traders do. Perps are used for directional crypto price exposure with leverage; prediction markets are used for event-driven hedges (e.g., hedging a portfolio against adverse regulatory outcomes). The two instruments are largely non-correlated.",
  },
];

export default function PerpetualFuturesVsPredictionMarketsPage() {
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

      <H2 id="overview">Two Ways to Speculate</H2>
      <P>
        Perpetual futures and prediction markets both let you speculate on future outcomes, but
        they work in fundamentally different ways. Perpetual futures track asset prices — you go
        long or short on BTC, ETH, or any other asset and profit (or lose) as the price moves.
        Prediction markets track events — you buy shares in whether something will happen, and
        those shares resolve to $1 or $0 when the outcome is known.
      </P>
      <P>
        One never expires. The other always resolves. One offers leverage up to 50x with
        liquidation risk. The other caps your loss at whatever you paid for your shares. These
        differences shape everything: the risk profile, the capital efficiency, the types of
        traders each instrument attracts, and the strategies you can deploy.
      </P>
      <P>
        This guide breaks down both instruments, compares them head-to-head, and helps you
        decide which — or whether both — fits your trading style.
      </P>

      <H2 id="how-perps-work">How Perpetual Futures Work</H2>
      <P>
        Perpetual futures (perps) are synthetic derivatives that track the price of an underlying
        asset without ever expiring. Unlike traditional futures contracts that settle on a fixed
        date, perps stay open indefinitely. The mechanism that keeps them anchored to the spot
        price is the funding rate — a periodic payment exchanged between longs and shorts.
      </P>
      <P>
        When the majority of open interest is long (more traders betting the price will rise),
        longs pay shorts a funding fee. When the market is short-heavy, shorts pay longs. This
        creates a continuous economic incentive for the perp price to converge with spot. Funding
        rates on most exchanges settle every 8 hours, and the rate itself fluctuates based on the
        imbalance between longs and shorts.
      </P>
      <P>
        Traders post margin (collateral) to open positions. If the market moves against you and
        your margin falls below the maintenance threshold, the exchange&apos;s liquidation engine
        closes your position automatically. This is the core risk of perps: leveraged positions
        can be wiped out by adverse price movements, even if your longer-term thesis is correct.
        Path-dependent risk matters — a temporary spike or crash can liquidate you before the
        market reverses.
      </P>
      <P>
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink> is the largest
        on-chain perpetual DEX, processing over $30 billion in daily trading volume across 500+
        trading pairs. It runs on its own L1 blockchain with a native order book (HyperCore) that
        matches orders with sub-second finality and zero gas fees for order placement.
      </P>

      <H2 id="how-prediction-markets-work">How Prediction Markets Work</H2>
      <P>
        Prediction markets are event-driven contracts. You buy shares that represent a specific
        outcome — &ldquo;Will BTC be above $100K on December 31?&rdquo; or &ldquo;Will the Fed
        cut rates in June?&rdquo; Shares are priced between $0 and $1, reflecting the market&apos;s
        implied probability of that outcome occurring. If the event happens, your shares resolve
        to $1. If it doesn&apos;t, they resolve to $0.
      </P>
      <P>
        There is no leverage in prediction markets. If you buy 100 shares at $0.60, your maximum
        loss is $60 (the amount you paid) and your maximum gain is $40 (the $100 resolution value
        minus your cost). This bounded downside makes prediction markets fundamentally different
        from perps — you cannot be liquidated, margin-called, or lose more than your initial
        investment.
      </P>
      <P>
        Prediction markets don&apos;t expire in the same way traditional futures do, but they do
        resolve. When the event concludes (an election is decided, a data point is released, a
        deadline passes), the market settles and shares pay out based on the actual outcome. This
        resolution mechanism is handled by oracles or designated reporters that verify the
        real-world result.
      </P>
      <P>
        Polymarket is the largest prediction market platform by volume, processing over $1 billion
        monthly across 500+ active markets covering politics, crypto, sports, and science.{" "}
        <a href="https://pm.wiki" target="_blank" rel="noopener noreferrer">
          pm.wiki tracks 350+ prediction market platforms
        </a>{" "}
        across the broader ecosystem, including Polymarket, Kalshi, and dozens of specialized
        platforms.
      </P>

      <H2 id="key-differences">Key Differences</H2>
      <P>
        The following table summarizes the core structural differences between perpetual futures
        and prediction markets.
      </P>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-2 pr-4 font-semibold text-zinc-300"></th>
              <th className="text-left py-2 pr-4 font-semibold text-zinc-300">Perpetual Futures</th>
              <th className="text-left py-2 pr-4 font-semibold text-zinc-300">Prediction Markets</th>
            </tr>
          </thead>
          <tbody className="text-zinc-400">
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-4 font-medium text-zinc-300">What you&apos;re betting on</td>
              <td className="py-2 pr-4">Asset price direction</td>
              <td className="py-2 pr-4">Whether a specific event occurs</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-4 font-medium text-zinc-300">Leverage</td>
              <td className="py-2 pr-4">Up to 50x (Hyperliquid)</td>
              <td className="py-2 pr-4">None (max 1x)</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-4 font-medium text-zinc-300">Liquidation risk</td>
              <td className="py-2 pr-4">Yes — margin call possible</td>
              <td className="py-2 pr-4">No</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-4 font-medium text-zinc-300">Expiry</td>
              <td className="py-2 pr-4">Never (funding rate keeps it live)</td>
              <td className="py-2 pr-4">Yes — resolves on event outcome</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-4 font-medium text-zinc-300">Leading on-chain platform</td>
              <td className="py-2 pr-4">Hyperliquid ($30B+ daily)</td>
              <td className="py-2 pr-4">Polymarket ($1B+ monthly)</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-4 font-medium text-zinc-300">Settlement currency</td>
              <td className="py-2 pr-4">USDC / native token</td>
              <td className="py-2 pr-4">USDC (Polymarket), USD (Kalshi)</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-zinc-300">Best for</td>
              <td className="py-2 pr-4">Leveraged price speculation</td>
              <td className="py-2 pr-4">Event-driven bets, political hedging</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H2 id="leverage-and-risk">Leverage &amp; Liquidation Risk</H2>
      <P>
        The most consequential difference between perps and prediction markets is leverage —
        and the liquidation risk that comes with it. On Hyperliquid, traders can open positions
        with up to 50x leverage, meaning $1,000 in margin controls $50,000 in notional exposure.
        This amplifies gains but equally amplifies losses.
      </P>
      <P>
        Perp exchanges offer two margin modes. In <strong>cross margin</strong>, your entire
        account balance serves as collateral for all positions — a loss in one position is
        offset by gains in another, but a severe drawdown can wipe your entire account. In{" "}
        <strong>isolated margin</strong>, each position has its own dedicated margin, limiting
        the blast radius of a liquidation to that single position. Most professional traders
        use isolated margin for speculative positions and cross margin for hedged portfolios.
      </P>
      <P>
        Beyond margin, perp traders face funding costs. If you hold a long position during a
        period of positive funding, you pay a recurring fee to shorts every 8 hours. Over days
        or weeks, funding can meaningfully erode returns — especially in trending markets where
        funding rates spike. Liquidation cascades are another risk: when a large position is
        liquidated, the resulting market sell pressure can trigger further liquidations,
        creating a cascading effect that moves prices sharply.
      </P>
      <P>
        Prediction markets have none of these dynamics. Your downside is bounded at what you
        paid for your shares. There is no margin, no funding cost, no liquidation engine. This
        makes prediction markets particularly attractive to event-driven traders who have a view
        on a specific outcome but don&apos;t want to manage the complexity of margin and
        liquidation risk. The Kelly Criterion — the optimal bet sizing formula — also differs
        between the two: in prediction markets you size based on edge multiplied by odds; in perps
        you must additionally account for path-dependent liquidation risk, which often means
        sizing significantly smaller than Kelly would suggest.
      </P>

      <H2 id="liquidity">Liquidity &amp; Markets</H2>
      <P>
        Perpetual futures markets are deep and liquid for major crypto assets. Hyperliquid alone
        processes $30B+ in daily volume, with tight spreads on BTC, ETH, SOL, and other large-cap
        tokens. The order book model means you can enter and exit large positions with minimal
        slippage. However, liquidity drops off sharply for long-tail assets — smaller altcoin
        perps may have wider spreads and lower depth.
      </P>
      <P>
        Prediction market liquidity is structured differently. Because each market is a unique
        event contract, liquidity is fragmented across hundreds of individual markets. A
        presidential election market on Polymarket might have tens of millions in open interest,
        while a niche science outcome might have only a few thousand dollars. Market makers in
        prediction markets also face unique challenges — they must price event probabilities
        rather than asset values, requiring domain expertise in addition to market-making
        infrastructure.
      </P>
      <P>
        The range of available markets also differs. Perps cover any asset with a price feed —
        crypto tokens, forex pairs, commodities, and increasingly equities and indices via
        HIP-3 on Hyperliquid. Prediction markets cover anything with a verifiable outcome —
        elections, economic data releases, sports, scientific milestones, regulatory decisions,
        and more. The two instruments are complementary rather than competitive: perps serve
        price-driven traders, prediction markets serve event-driven traders.
      </P>

      <H2 id="hyperliquid-vs-polymarket">Hyperliquid vs Polymarket</H2>
      <P>
        Hyperliquid and Polymarket are the dominant on-chain platforms in their respective
        categories, and comparing them illustrates the fundamental differences between perps
        and prediction markets at scale.
      </P>
      <P>
        <strong>Hyperliquid</strong> processes $30B+ in daily trading volume across 500+
        perpetual trading pairs. It runs on its own L1 blockchain with a native order book
        (HyperCore) and an EVM-compatible smart contract layer (HyperEVM). The ecosystem
        includes 136+ projects building DeFi infrastructure — lending protocols, liquid staking,
        DEXs, and yield aggregators — all composable with the core perp exchange.
      </P>
      <P>
        <strong>Polymarket</strong> processes $1B+ in monthly volume across 500+ active event
        markets. It runs on Polygon, settling in USDC. Polymarket has a global version and a
        US-regulated version (following its CFTC settlement), covering politics, crypto, sports,
        science, and culture. Its simple UX — buy YES or NO shares — has made it the gateway
        for mainstream users entering prediction markets.
      </P>
      <P>
        For the full directory of projects building on Hyperliquid, see{" "}
        <InlineLink href="/projects">perp.wiki/projects</InlineLink>. For the full directory of
        prediction market platforms, analytics tools, and infrastructure, see{" "}
        <a href="https://pm.wiki" target="_blank" rel="noopener noreferrer">
          pm.wiki
        </a>.
      </P>

      <H2 id="which-suits-you">Which Suits You?</H2>
      <P>
        <strong>Choose perpetual futures if:</strong> you want leveraged directional exposure to
        crypto asset prices, you are comfortable with margin management and liquidation risk,
        you trade frequently and want deep liquidity with tight spreads, and you have a
        price-based thesis rather than an event-based one.
      </P>
      <P>
        <strong>Choose prediction markets if:</strong> you have a strong view on whether a
        specific event will occur, you don&apos;t want liquidation risk or margin management,
        you want bounded downside where your maximum loss is known upfront, and you are hedging
        real-world outcomes (e.g., regulatory risk, election results, or macro events).
      </P>
      <P>
        <strong>Choose both if:</strong> you want uncorrelated speculative positions. Use perps
        for BTC price direction and prediction markets for macro event hedging. The two
        instruments are largely non-correlated, meaning a diversified approach across both can
        improve your overall risk-adjusted returns. Many sophisticated traders maintain a perp
        portfolio for directional crypto exposure alongside prediction market positions that
        hedge tail risks — for example, going long BTC perps while holding prediction market
        shares that pay out if adverse regulation passes.
      </P>

      <CTA href="/learn/what-is-hyperliquid">Learn more about Hyperliquid &rarr;</CTA>
    </LearnLayout>
  );
}
