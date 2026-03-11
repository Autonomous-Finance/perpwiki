import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "best-hyperliquid-analytics-tools";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Best Hyperliquid Analytics Tools in 2026",
  description:
    "Top Hyperliquid analytics tools: HyperScanner, Copin.io, Velo Data, Parsec Finance, and HyperDash. Features, pricing, and how to track whales and markets.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "Best Hyperliquid Analytics Tools 2026",
    description:
      "Top tools for whale tracking, portfolio analytics, and market data on Hyperliquid.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Best Hyperliquid Analytics Tools 2026",
    description:
      "Top tools for whale tracking, portfolio analytics, and market data on Hyperliquid.",
  },
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "why-analytics-matter", title: "Why Analytics Matter" },
  { id: "hyperscanner", title: "HyperScanner" },
  { id: "copin-io", title: "Copin.io" },
  { id: "velo-data", title: "Velo Data" },
  { id: "parsec-finance", title: "Parsec Finance" },
  { id: "hyperdash", title: "HyperDash" },
  { id: "comparison", title: "Tool Comparison" },
  { id: "which-to-choose", title: "Which to Choose" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is the best Hyperliquid analytics tool?",
    answer:
      "It depends on your needs. HyperScanner is the best for whale tracking and real-time trade alerts. Copin.io excels at copy trading analytics and discovering profitable traders. Velo Data is the top choice for institutional-grade market data. Parsec Finance offers the best portfolio analytics and PnL tracking. For a free, general-purpose dashboard, HyperDash covers the basics well.",
  },
  {
    question: "Are Hyperliquid analytics tools free?",
    answer:
      "Several are free to use. HyperDash is completely free. HyperScanner offers a free tier with basic features. Copin.io has a free plan with limited trader tracking. Velo Data and Parsec Finance are primarily paid products aimed at professional traders and institutions, though both offer limited free access to basic data.",
  },
  {
    question: "Can I track whale trades on Hyperliquid?",
    answer:
      "Yes. Because all Hyperliquid trading activity is on-chain, every trade from every wallet is publicly visible. Tools like HyperScanner specialize in identifying large wallets and sending real-time alerts when whales open, close, or modify positions. You can also build custom tracking using the Hyperliquid API directly.",
  },
  {
    question: "What data is available from the Hyperliquid API?",
    answer:
      "The Hyperliquid API provides comprehensive market data: real-time order book snapshots, trade history, funding rates, open interest, mark prices, and index prices. It also exposes user-level data: positions, orders, trade history, funding payments, and vault performance. Both REST and WebSocket endpoints are available for programmatic access.",
  },
];

export default function BestHyperliquidAnalyticsToolsPage() {
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
        One of Hyperliquid{"'"}s most powerful properties is full on-chain transparency. Every
        trade, every position, every liquidation that happens on the platform is recorded on
        the Hyperliquid L1 and accessible through public APIs. This creates an extraordinary
        opportunity for analytics: you can see exactly what every wallet is doing, in real
        time, with no information asymmetry.
      </P>
      <P>
        A growing ecosystem of analytics tools has emerged to help traders make sense of this
        data. From whale tracking dashboards that alert you when large wallets open positions,
        to portfolio analytics that break down your PnL by market and time period, to
        institutional-grade data feeds for quantitative strategies — the Hyperliquid analytics
        stack has matured considerably in 2026.
      </P>
      <P>
        This guide covers the five most useful Hyperliquid analytics tools, what each does
        best, their pricing models, and which one to choose based on your trading style. Whether
        you are a retail trader looking to follow smart money or a professional running
        systematic strategies, there is a tool here that will improve your edge.
      </P>

      <H2 id="why-analytics-matter">Why Analytics Matter on Hyperliquid</H2>
      <P>
        On centralized exchanges, trade data is opaque. You see aggregate volume and price
        charts, but you cannot identify who is trading, how large their positions are, or
        what their PnL looks like. On{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>, all of this
        data is public. This transparency is a structural advantage for informed traders.
      </P>
      <P>
        <strong>Whale tracking</strong> is perhaps the most popular use case. When a wallet
        known to be a consistently profitable trader opens a $5 million long on ETH, that
        signal has value. Analytics tools make it easy to identify these wallets, track their
        historical performance, and receive alerts when they act.
      </P>
      <P>
        <strong>Funding rate analysis</strong> helps traders spot opportunities. When{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rates</InlineLink>{" "}
        diverge significantly from other venues, arbitrage opportunities emerge. Analytics
        tools that aggregate and visualize funding rates across markets and time periods
        make these opportunities visible at a glance.
      </P>
      <P>
        <strong>Open interest heatmaps</strong> reveal market positioning. Seeing where open
        interest is concentrated — which price levels have heavy long or short exposure —
        helps predict where liquidation cascades might occur and where the market might
        find support or resistance. This data is uniquely available on transparent platforms
        like Hyperliquid.
      </P>
      <P>
        <strong>Portfolio analytics</strong> help traders understand their own performance.
        Breaking down PnL by market, time period, trade size, and strategy type reveals
        patterns that are invisible in raw trade history. The best traders use these tools
        to identify what is working and cut what is not.
      </P>

      <H2 id="hyperscanner">HyperScanner</H2>
      <P>
        HyperScanner is the leading whale tracking and trade alert platform for Hyperliquid.
        It continuously monitors on-chain activity and identifies large wallets, tracking
        their positions, PnL, and trading patterns. The platform maintains a leaderboard of
        top-performing wallets, ranked by total PnL, win rate, and risk-adjusted returns.
      </P>
      <P>
        <strong>Key features:</strong> real-time trade alerts for tracked wallets, whale
        position tracking with entry/exit prices, liquidation monitoring, historical
        performance analytics for any wallet address, and customizable alert filters (by
        trade size, asset, or wallet). The alert system supports Telegram and Discord
        notifications for immediate action.
      </P>
      <P>
        <strong>Best for:</strong> traders who want to follow smart money. If your strategy
        involves identifying profitable wallets and monitoring their activity for trade ideas,
        HyperScanner is the most specialized tool for this purpose. The leaderboard is also
        useful for evaluating vault managers and copy trading candidates.
      </P>
      <P>
        <strong>Pricing:</strong> free tier with basic whale tracking and limited alerts.
        Premium plans start at $29/month for unlimited alerts, advanced filters, and
        historical analytics. Professional plans with API access and custom integrations
        are available for institutional users.
      </P>

      <H2 id="copin-io">Copin.io</H2>
      <P>
        Copin.io bridges analytics and execution by combining trader discovery with copy
        trading capabilities. The platform indexes every trader on Hyperliquid (and several
        other perp DEXs), providing detailed performance statistics: PnL over various
        timeframes, Sharpe ratio, maximum drawdown, average trade duration, preferred markets,
        and win rate.
      </P>
      <P>
        <strong>Key features:</strong> multi-platform trader discovery (Hyperliquid, dYdX,
        GMX, and others), detailed trader profiles with risk metrics, copy trading automation
        that mirrors discovered traders{"'"} positions, backtesting of copy strategies against
        historical data, and portfolio simulation tools.
      </P>
      <P>
        <strong>Best for:</strong> traders who want to find and copy successful strategies.
        Copin.io{"'"}s strength is not just showing you who is profitable but helping you
        evaluate whether a trader{"'"}s edge is sustainable. The risk metrics (Sharpe ratio,
        max drawdown, consistency scores) go beyond raw PnL to help separate skill from luck.
      </P>
      <P>
        <strong>Pricing:</strong> free plan with basic trader discovery and limited tracking.
        Premium plans from $19/month unlock advanced metrics, historical data, and copy
        trading features. The platform takes no additional fee on copy trades beyond the
        subscription.
      </P>

      <H2 id="velo-data">Velo Data</H2>
      <P>
        Velo Data provides institutional-grade market data and analytics for Hyperliquid. The
        platform focuses on deep market microstructure analysis: order book dynamics, trade
        flow decomposition, liquidity depth over time, and sophisticated open interest analytics
        with breakdowns by wallet cohort.
      </P>
      <P>
        <strong>Key features:</strong> real-time and historical order book heatmaps, trade
        flow analysis decomposing volume into passive and aggressive flow, open interest
        breakdowns by position size cohort (retail vs whale), funding rate analytics with
        cross-venue comparisons, and liquidation analysis with cascade prediction models.
      </P>
      <P>
        <strong>Best for:</strong> professional and institutional traders who need deep market
        data. If you are running quantitative strategies, managing risk across large positions,
        or need to understand market microstructure beyond surface-level metrics, Velo Data
        provides the depth of analysis that simpler tools do not offer.
      </P>
      <P>
        <strong>Pricing:</strong> limited free tier with basic market overview. Professional
        plans start at $99/month for full data access and historical analytics. Enterprise
        plans with raw data feeds, API access, and custom analytics are priced individually.
      </P>

      <H2 id="parsec-finance">Parsec Finance</H2>
      <P>
        Parsec Finance is a portfolio analytics platform that helps traders track, analyze,
        and optimize their Hyperliquid trading performance. The platform connects to your
        wallet and provides comprehensive PnL breakdowns, trade journaling, and performance
        attribution analysis.
      </P>
      <P>
        <strong>Key features:</strong> real-time PnL tracking across all Hyperliquid positions,
        historical trade analysis with per-trade PnL attribution, performance breakdowns by
        market, time period, and trade size, funding rate income/expense tracking, and
        automated trade journal generation with chart annotations.
      </P>
      <P>
        <strong>Best for:</strong> active traders who want to understand and improve their
        own performance. Parsec Finance acts as a trading journal and performance coach,
        surfacing patterns in your trading that you might not notice otherwise. If you find
        yourself wondering "where did my PnL come from this month?" or "which markets am I
        best at trading?", Parsec gives you the answers.
      </P>
      <P>
        <strong>Pricing:</strong> free tier with basic PnL tracking. Premium plans from
        $39/month for full historical analytics, advanced attribution, and trade journal
        features. The platform also offers team plans for trading desks.
      </P>

      <H2 id="hyperdash">HyperDash</H2>
      <P>
        HyperDash is a free, community-built analytics dashboard that covers the essentials.
        It provides a clean overview of Hyperliquid{"'"}s market activity: volume charts,
        open interest breakdowns, funding rate tables, top traded markets, and basic
        leaderboard data. While it lacks the depth of specialized tools, it is the best
        starting point for traders who want analytics without a subscription.
      </P>
      <P>
        <strong>Key features:</strong> daily and weekly volume charts across all markets,
        open interest overview with long/short ratios, funding rate table with historical
        charts, top market movers and most-traded assets, and basic wallet lookup to check
        any address{"'"}s current positions.
      </P>
      <P>
        <strong>Best for:</strong> casual traders and newcomers who want a quick overview
        of Hyperliquid{"'"}s market state without paying for premium tools. HyperDash is
        also useful as a complement to specialized tools — it provides the "big picture"
        view that helps contextualize more granular data from platforms like HyperScanner
        or Velo Data.
      </P>
      <P>
        <strong>Pricing:</strong> completely free with no premium tiers. Supported by
        community contributions and minimal advertising.
      </P>

      <H2 id="comparison">Tool Comparison</H2>
      <ComparisonTable
        headers={["Tool", "Best For", "Free Tier", "Premium From"]}
        rows={[
          ["HyperScanner", "Whale tracking & alerts", "Yes (limited)", "$29/mo"],
          ["Copin.io", "Copy trade discovery", "Yes (limited)", "$19/mo"],
          ["Velo Data", "Institutional market data", "Yes (basic)", "$99/mo"],
          ["Parsec Finance", "Portfolio analytics & PnL", "Yes (basic)", "$39/mo"],
          ["HyperDash", "General market overview", "Yes (full)", "Free"],
        ]}
      />
      <P>
        Each tool occupies a distinct niche. There is surprisingly little overlap between
        them, which means many serious traders use two or three in combination. A common
        setup: HyperDash for the daily market overview, HyperScanner for whale alerts, and
        Parsec Finance for personal performance tracking.
      </P>

      <H2 id="which-to-choose">Which Tool Should You Choose?</H2>
      <P>
        <strong>If you are a retail trader</strong> looking for an edge, start with HyperDash
        (free) for market overview and HyperScanner{"'"}s free tier for whale tracking. These
        two tools cover the most actionable data without any cost. Upgrade to HyperScanner
        premium once you find whale alerts consistently useful for your trading.
      </P>
      <P>
        <strong>If you are a copy trader</strong> or looking to build a portfolio of
        strategies, Copin.io is the clear choice. Its trader discovery and risk metrics
        help you find sustainable edges rather than lucky streaks, and the copy trading
        automation saves time on execution.
      </P>
      <P>
        <strong>If you are a professional or institutional trader</strong>, Velo Data
        provides the market microstructure data you need for quantitative strategies and
        risk management. Pair it with Parsec Finance for portfolio-level analytics and
        performance attribution.
      </P>
      <P>
        <strong>If you want to build custom analytics</strong>, start with the{" "}
        <InlineLink href="/projects">Hyperliquid API directly</InlineLink>. The public
        REST and WebSocket APIs provide raw access to all the data these tools use. Many
        traders build custom dashboards tailored to their specific strategies using Python,
        TypeScript, or Rust clients.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/projects">Explore the full Hyperliquid ecosystem &rarr;</CTA>
    </LearnLayout>
  );
}
