import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA, TLDRBox, FeatureCard } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import { LiveEcosystemStats } from "@/components/learn/LiveData";
import { StrategyCard } from "@/components/learn/UiBlocks";
import { ProjectLogoGrid } from "@/components/learn/ProjectGrid";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SLUG = "best-hyperliquid-trading-bots";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Best Hyperliquid Trading Bots & Automation Tools 2026",
  description:
    "Top Hyperliquid trading bots and automation tools: Hummingbot, Insilico Terminal, pvp.trade, Katoshi AI, and Growi. Features, pricing, and how to choose.",
  openGraph: {
    title: "Best Hyperliquid Trading Bots 2026",
    description:
      "The top trading bots and automation tools for Hyperliquid: market making, copy trading, AI-driven strategies, and more.",
    type: "article",
  },
};

const TOC = [
  { id: "why-bots", title: "Why Use Trading Bots?" },
  { id: "hummingbot", title: "Hummingbot" },
  { id: "insilico", title: "Insilico Terminal" },
  { id: "pvp-trade", title: "pvp.trade (Copy Trading)" },
  { id: "katoshi", title: "Katoshi (AI Trading)" },
  { id: "growi", title: "Growi" },
  { id: "comparison", title: "Bot Comparison" },
  { id: "choosing-a-bot", title: "How to Choose" },
  { id: "risks", title: "Risks of Bot Trading" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is the best trading bot for Hyperliquid?",
    answer:
      "It depends on your strategy. Hummingbot is best for custom market-making strategies (open-source, free). Insilico Terminal suits professional traders who want a full execution suite. pvp.trade is ideal for copy trading top Hyperliquid traders. Katoshi offers AI-driven automated strategies. Growi provides portfolio automation and rebalancing.",
  },
  {
    question: "Are Hyperliquid trading bots free?",
    answer:
      "Hummingbot is fully open-source and free to use. Other bots have varying pricing models: pvp.trade charges performance fees on copy trades, Insilico Terminal has subscription plans, and Katoshi charges based on assets under management. Always check current pricing before committing.",
  },
  {
    question: "Is it safe to use trading bots on Hyperliquid?",
    answer:
      "Trading bots interact with Hyperliquid through API keys. Reputable bots use trade-only API permissions (no withdrawal access), meaning the bot can place and cancel orders but cannot withdraw your funds. Never give a bot withdrawal permissions. Open-source bots (like Hummingbot) that run on your own infrastructure offer the highest security.",
  },
  {
    question: "Can I copy trade top traders on Hyperliquid?",
    answer:
      "Yes. pvp.trade enables copy trading by mirroring the positions of top Hyperliquid traders. Because all Hyperliquid trading is on-chain, the performance history of any address is fully transparent and verifiable. pvp.trade lets you browse trader profiles, see their historical returns, and automatically copy their trades with adjustable position sizing.",
  },
  {
    question: "Do trading bots guarantee profits?",
    answer:
      "No. Trading bots automate strategies but do not guarantee profits. All trading strategies can lose money, and bots can amplify losses as easily as gains — especially in volatile markets. Past performance of any bot or strategy does not guarantee future results. Start with small amounts and monitor performance closely.",
  },
];

export default async function BestHyperliquidTradingBotsPage() {
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

      <TLDRBox
        points={[
          "Hummingbot (free, open-source) is best for custom market-making strategies; pvp.trade is best for copy trading verified on-chain traders.",
          "Hyperliquid's zero-gas order placement makes bot trading significantly cheaper than on most other chains.",
          "Always use trade-only API keys (no withdrawal access) and start with small position sizes when running any bot.",
        ]}
      />

      <LiveEcosystemStats />

      <H2 id="why-bots">Why Use Trading Bots on Hyperliquid?</H2>
      <P>
        Trading bots automate the execution of trading strategies, removing the need for manual
        order placement and position monitoring. On{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>, bots are
        particularly useful because the platform&apos;s API is well-documented, trading is
        24/7, and the on-chain order book provides the same infrastructure that bots on
        centralized exchanges rely on — limit orders, stop losses, and real-time market data.
      </P>
      <P>
        Common use cases for Hyperliquid trading bots include market making (providing liquidity
        across multiple markets), grid trading (buying and selling at preset price intervals),
        funding rate farming (automating delta-neutral strategies to capture{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rate</InlineLink>{" "}
        payments), copy trading (automatically mirroring the positions of successful traders),
        and portfolio rebalancing.
      </P>
      <P>
        Hyperliquid&apos;s zero-gas order placement makes bot trading significantly cheaper than
        on most other chains. A bot that places hundreds of limit orders per day on Ethereum
        would incur substantial gas costs; on Hyperliquid, those same orders cost nothing.
        Combined with maker rebates (approximately -0.01%), active market-making bots can
        actually earn fees from the exchange rather than paying them.
      </P>

      <H2 id="hummingbot">Hummingbot</H2>
      <P>
        <InlineLink href="/projects/hummingbot">Hummingbot</InlineLink> is an open-source
        trading bot framework that supports Hyperliquid as a connector. It is the most widely
        used bot framework in crypto, with a large community of developers and pre-built
        strategy templates. Hummingbot runs on your own machine (or cloud server), meaning
        your API keys never leave your infrastructure.
      </P>
      <P>
        On Hyperliquid, Hummingbot is primarily used for market-making strategies. The pure
        market-making strategy places buy and sell orders at configurable spreads around the
        mid price, earning the spread on each fill. The cross-exchange market-making strategy
        mirrors liquidity from one venue (like Binance) onto Hyperliquid, profiting from
        price discrepancies. The TWAP strategy breaks large orders into smaller chunks executed
        over time.
      </P>
      <P>
        <strong>Pros:</strong> Fully open-source and free, runs on your own hardware, highly
        customizable, large community and documentation, supports dozens of exchanges beyond
        Hyperliquid for cross-venue strategies.
      </P>
      <P>
        <strong>Cons:</strong> Requires technical setup (Python, command line, server
        management), no graphical interface for live monitoring, strategy development requires
        coding ability, you are responsible for your own infrastructure uptime.
      </P>

      <FeatureCard
        name="Hummingbot"
        slug="hummingbot"
        description="Open-source market-making bot framework with native Hyperliquid support. Free, self-hosted, and highly customizable."
        category="Trading Bots"
      />

      <H2 id="insilico">Insilico Terminal</H2>
      <P>
        <InlineLink href="/projects/insilico-terminal">Insilico Terminal</InlineLink> is a
        professional trading terminal designed specifically for the Hyperliquid ecosystem. It
        combines advanced charting, execution tools, and automated strategy capabilities in a
        browser-based interface — essentially an all-in-one trading workstation.
      </P>
      <P>
        Insilico&apos;s automation features go beyond simple bot trading. The platform supports
        conditional orders (if BTC breaks $100k, open a 5x long on ETH), multi-leg strategies
        (simultaneously enter spot and perp positions), and portfolio-level automation
        (rebalance positions when allocations drift beyond thresholds). These tools are
        particularly useful for traders managing positions across multiple Hyperliquid markets.
      </P>
      <P>
        The terminal also provides enhanced analytics not available on the native Hyperliquid
        interface: depth-of-market visualization, historical funding rate charts, open interest
        heatmaps, and liquidation level estimates. For active traders who spend hours per day
        on Hyperliquid, Insilico offers a significantly more capable interface than the
        default platform.
      </P>
      <P>
        <strong>Pros:</strong> Professional-grade interface, no coding required, comprehensive
        analytics, supports complex multi-step strategies, browser-based (no installation).
      </P>
      <P>
        <strong>Cons:</strong> Subscription pricing (monthly fee for premium features), less
        customizable than open-source alternatives, dependent on Insilico&apos;s uptime and
        servers.
      </P>

      <H2 id="pvp-trade">pvp.trade (Copy Trading)</H2>
      <P>
        <InlineLink href="/projects/pvp-trade">pvp.trade</InlineLink> is a copy trading
        platform built on top of Hyperliquid. It leverages Hyperliquid&apos;s on-chain
        transparency to let users browse, evaluate, and automatically copy the trades of
        successful Hyperliquid traders.
      </P>
      <P>
        Because all Hyperliquid trading activity is recorded on-chain, pvp.trade can display
        verified performance metrics for any wallet address: total PnL, win rate, average
        trade duration, maximum drawdown, risk-adjusted returns, and more. This is a significant
        advantage over copy trading on centralized exchanges, where performance data is
        self-reported and potentially manipulated.
      </P>
      <P>
        The copy mechanism works by monitoring the selected trader&apos;s on-chain positions in
        real time. When the trader opens a new position, pvp.trade automatically opens a
        proportional position in your account. When they close, you close. Position sizing is
        adjustable — you can copy at 10%, 50%, or 100% of the trader&apos;s size relative to
        your account balance.
      </P>
      <P>
        <strong>Pros:</strong> No trading skill required, leverages on-chain data for verified
        performance, adjustable position sizing, easy to start (just connect wallet and select
        a trader to copy).
      </P>
      <P>
        <strong>Cons:</strong> Performance fees on profitable copies, execution lag between
        the leader&apos;s trade and your copy, past performance does not guarantee future results,
        dependent on the leader continuing to trade actively and profitably.
      </P>

      <H2 id="katoshi">Katoshi (AI Trading)</H2>
      <P>
        <InlineLink href="/projects/katoshi">Katoshi</InlineLink> is an AI-powered trading
        platform that deploys machine learning models to generate and execute trading strategies
        on Hyperliquid. Unlike rule-based bots that follow predetermined logic, Katoshi&apos;s
        models analyze market data patterns — price action, order flow, funding rates, open
        interest, and cross-market correlations — to generate probabilistic trading signals.
      </P>
      <P>
        The platform offers several strategy tiers ranging from conservative (lower leverage,
        tighter stop losses, fewer trades per day) to aggressive (higher leverage, wider stops,
        more frequent trading). Users select their preferred risk level and deposit capital,
        and Katoshi&apos;s AI handles the rest — analyzing markets, generating signals, placing
        orders, and managing positions.
      </P>
      <P>
        AI-driven trading is inherently opaque — users trust the model without fully
        understanding its decision-making process. Katoshi mitigates this concern by publishing
        performance data and providing transparency into aggregate position sizes and strategy
        allocation, but the underlying model logic is proprietary.
      </P>
      <P>
        <strong>Pros:</strong> Fully automated, adapts to changing market conditions, no
        technical knowledge required, potentially captures patterns human traders miss.
      </P>
      <P>
        <strong>Cons:</strong> Black box (you cannot fully inspect the strategy), AI models
        can underperform during unprecedented market conditions, fees based on AUM, historical
        AI performance does not guarantee future results.
      </P>

      <H2 id="growi">Growi</H2>
      <P>
        Growi focuses on portfolio management
        and automation for Hyperliquid users managing multiple positions. Rather than executing
        individual trading strategies, Growi helps users automate portfolio-level operations:
        rebalancing across positions, implementing DCA (dollar-cost averaging) schedules,
        managing risk limits, and executing conditional workflows.
      </P>
      <P>
        A typical Growi workflow might be: &quot;If my BTC-PERP position exceeds 30% of my
        portfolio, sell enough to rebalance to 25%. If total unrealized loss exceeds 5%, reduce
        all positions by 50%.&quot; These portfolio-level rules are difficult to implement
        manually and are exactly the kind of automation that prevents the emotional
        decision-making that costs traders money.
      </P>
      <P>
        Growi also integrates with HyperEVM DeFi protocols, enabling automated flows between
        trading and yield — for example, automatically depositing idle USDC into the{" "}
        <InlineLink href="/learn/hlp-vault-guide">HLP vault</InlineLink> when not actively
        trading, and withdrawing it when a trading signal triggers.
      </P>
      <P>
        <strong>Pros:</strong> Portfolio-level automation (not just individual trade execution),
        risk management rules, DeFi integration, reduces emotional trading decisions.
      </P>
      <P>
        <strong>Cons:</strong> Less focused on individual strategy execution than specialized
        bots, newer platform with less track record, subscription-based pricing.
      </P>

      <ProjectLogoGrid slugs={["hummingbot", "insilico-terminal", "pvp-trade", "katoshi", "growi-hf"]} title="Featured Trading Bots" showTagline />

      <StrategyCard
        title="Copy Trading Strategy"
        risk="Medium"
        timeCommitment="30 min/week"
        capitalMin="$500+"
        description="Mirror the trades of verified profitable Hyperliquid traders. Leverage on-chain transparency to select traders with proven track records."
        steps={[
          "Browse top traders on pvp.trade — filter by PnL, win rate, and risk metrics",
          "Select 2-3 traders with different strategies for diversification",
          "Set position sizing (start at 10-25% of the leader's relative size)",
          "Monitor performance weekly and replace underperforming leaders",
          "Set maximum drawdown limits to auto-stop copying if losses exceed threshold",
        ]}
      />

      <StrategyCard
        title="Grid Bot Strategy"
        risk="Low"
        timeCommitment="1h setup, passive"
        capitalMin="$1,000+"
        description="Place buy and sell orders at regular price intervals to profit from market oscillation. Works best in range-bound markets."
        steps={[
          "Choose a market that's been range-bound (check 30-day price range)",
          "Set a grid of 10-20 buy/sell levels across the range",
          "Configure order sizes (equal or weighted toward center)",
          "Let the bot accumulate profits from each fill across the grid",
          "Adjust or close the grid if price breaks out of the range",
        ]}
      />

      <StrategyCard
        title="Market Making Strategy"
        risk="High"
        timeCommitment="Setup + monitoring"
        capitalMin="$5,000+"
        description="Provide liquidity by placing both buy and sell orders. Earn the spread plus maker rebates on every fill."
        steps={[
          "Set up Hummingbot with Hyperliquid connector and API keys",
          "Choose a market with decent volume but wide-enough spreads",
          "Configure bid-ask spread (start wide at 0.1-0.3% and tighten gradually)",
          "Set inventory limits to prevent accumulating too much directional risk",
          "Monitor and adjust parameters as market conditions change",
        ]}
      />

      <H2 id="comparison">Bot Comparison</H2>
      <ComparisonTable
        headers={["Bot", "Type", "Skill Level", "Cost", "Open Source?", "Best For"]}
        rows={[
          ["Hummingbot", "Market making / custom", "High (coding)", "Free", "Yes", "Developers, market makers"],
          ["Insilico Terminal", "Trading terminal + automation", "Medium", "Subscription", "No", "Active professional traders"],
          ["pvp.trade", "Copy trading", "Low", "Performance fee", "No", "Passive traders, beginners"],
          ["Katoshi", "AI-driven strategies", "Low", "AUM fee", "No", "Hands-off automation seekers"],
          ["Growi", "Portfolio automation", "Medium", "Subscription", "No", "Multi-position portfolio managers"],
        ]}
      />

      <H2 id="choosing-a-bot">How to Choose</H2>
      <P>
        Start by defining your goal. If you want to run a custom market-making or arbitrage
        strategy and have programming experience, <strong>Hummingbot</strong> is the clear
        choice — it is free, open-source, and infinitely customizable. If you are an active
        discretionary trader who wants better tools and conditional automation,{" "}
        <strong>Insilico Terminal</strong> provides the most comprehensive trading interface.
      </P>
      <P>
        If you do not want to trade yourself but want exposure to profitable strategies,{" "}
        <strong>pvp.trade</strong> lets you copy verified traders with minimal effort. If you
        believe in AI-driven approaches and want fully hands-off trading,{" "}
        <strong>Katoshi</strong> handles everything. And if you manage a complex portfolio
        across multiple Hyperliquid positions and DeFi protocols, <strong>Growi</strong>&apos;s
        portfolio automation fills a unique niche.
      </P>
      <P>
        Regardless of which tool you choose, start with small position sizes. Even the
        best-designed bot can produce unexpected results in unusual market conditions. Run any
        new bot with minimal capital for at least 2-4 weeks before scaling up, and always set
        hard stop-loss limits to cap potential losses.
      </P>

      <H2 id="risks">Risks of Bot Trading</H2>
      <P>
        <strong>API key security.</strong> Bots require API keys to interact with your
        Hyperliquid account. Always use trade-only API keys that cannot perform withdrawals.
        Never share your API keys, and rotate them periodically. Self-hosted bots (like
        Hummingbot) are safer because your keys never leave your infrastructure.
      </P>
      <P>
        <strong>Strategy risk.</strong> Every trading strategy can lose money. Market-making
        bots can get caught in trending markets. Momentum bots can be whipsawed in choppy
        conditions. AI models can fail during unprecedented events. No strategy works in all
        market conditions — diversify across approaches and be prepared for drawdowns.
      </P>
      <P>
        <strong>Execution risk.</strong> Bots depend on reliable connectivity to Hyperliquid&apos;s
        API. Network outages, API rate limits, or server downtime can prevent the bot from
        executing trades or managing risk. Cloud-hosted bots with redundant connections mitigate
        this risk but add cost and complexity.
      </P>
      <P>
        <strong>Over-optimization.</strong> A bot strategy that performed brilliantly on
        historical data (backtesting) may fail in live markets. This is the classic
        overfitting problem — the strategy was optimized for past conditions that may not
        repeat. Use out-of-sample testing, start with small sizes, and be skeptical of
        strategies that show unrealistically high backtested returns.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/projects">Explore all Hyperliquid ecosystem projects &rarr;</CTA>
    </LearnLayout>
  );
}
