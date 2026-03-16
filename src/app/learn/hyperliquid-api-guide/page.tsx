import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-api-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid API & TypeScript SDK Guide for Developers 2026",
  description:
    "Complete Hyperliquid developer guide: REST API, WebSocket feeds, TypeScript SDK, and Python client. Authentication, rate limits, and working code examples.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "Hyperliquid API & TypeScript SDK Guide for Developers 2026",
    description:
      "Complete Hyperliquid developer guide: REST API, WebSocket feeds, TypeScript SDK, and Python client. Authentication, rate limits, and working code examples.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid API & TypeScript SDK Guide for Developers 2026",
    description:
      "Complete Hyperliquid developer guide: REST API, WebSocket feeds, TypeScript SDK, and Python client. Authentication, rate limits, and working code examples.",
  },
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "typescript-sdk", title: "TypeScript / JavaScript SDK" },
  { id: "api-overview", title: "API Overview" },
  { id: "authentication", title: "Authentication" },
  { id: "info-endpoints", title: "Info API Endpoints" },
  { id: "trading-endpoints", title: "Exchange API Endpoints" },
  { id: "websocket", title: "WebSocket API" },
  { id: "rate-limits", title: "Rate Limits" },
  { id: "sdk-libraries", title: "SDK Libraries" },
  { id: "building-a-bot", title: "Building a Trading Bot" },
  { id: "best-practices", title: "Best Practices" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "Is the Hyperliquid API free?",
    answer:
      "Yes, the Hyperliquid API is completely free to use. There are no API subscription fees, data fees, or premium tiers. You only pay standard trading fees (0.035% taker, -0.01% maker rebate at base tier) when you execute trades through the Exchange API. The Info API for market data is entirely free with no trading requirement.",
  },
  {
    question: "What programming languages can I use?",
    answer:
      "You can use any programming language that supports HTTP requests and WebSocket connections. The official SDKs are available in Python (hyperliquid-python-sdk) and TypeScript. Community-built libraries exist for Rust, Go, and C#. The API uses standard REST and WebSocket protocols, so any language with HTTP and WebSocket support will work — you just need to implement the EIP-712 signing for authenticated endpoints.",
  },
  {
    question: "Is there a testnet?",
    answer:
      "Yes, Hyperliquid provides a fully functional testnet at api.hyperliquid-testnet.xyz. The testnet mirrors the production API endpoints and behavior, allowing you to test your trading bot with fake funds before risking real capital. You can request testnet USDC through the Hyperliquid Discord. The testnet supports all Info and Exchange API endpoints with the same rate limits as production.",
  },
  {
    question: "How fast is the Hyperliquid API?",
    answer:
      "The Hyperliquid API delivers sub-200ms round-trip latency for order placement from well-connected servers. The underlying blockchain achieves sub-second block times with near-instant finality. WebSocket order book updates arrive within 50-100ms of on-chain state changes. For lowest latency, co-locate your servers in AWS us-east or use the WebSocket API instead of polling REST endpoints.",
  },
];

export default function HyperliquidApiGuidePage() {
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
        Hyperliquid&apos;s API is the gateway for developers and algorithmic traders to interact
        programmatically with the largest on-chain perpetual futures exchange. Whether you are
        building a market-making bot, a copy-trading platform, an analytics dashboard, or a custom
        trading terminal, the Hyperliquid API provides the data and execution capabilities you need.
      </P>
      <P>
        Unlike many DeFi protocols that require interacting with smart contracts through complex
        transaction construction, Hyperliquid offers a clean REST and WebSocket API that feels more
        like a centralized exchange API — but with all the self-custody and transparency guarantees
        of an on-chain system. Every order you place through the API is settled on the Hyperliquid
        L1 blockchain with sub-second finality, and your funds never leave your wallet.
      </P>
      <P>
        This guide covers everything you need to get started: the two-API architecture, authentication
        with EIP-712 signatures, key endpoints for market data and trading, real-time WebSocket feeds,
        rate limits, available SDKs, and practical advice for building your first trading bot.
      </P>

      <H2 id="typescript-sdk">TypeScript / JavaScript SDK</H2>
      <P>
        The fastest way to start building on Hyperliquid with TypeScript is the{" "}
        <InlineLink href="https://github.com/nktkas/hyperliquid">@nktkas/hyperliquid</InlineLink>{" "}
        SDK — a fully typed client for both the Info and Exchange APIs. Install it with:
      </P>
      <P>
        <code>npm install @nktkas/hyperliquid</code>
      </P>
      <P>
        <strong>Quick start — fetch the order book:</strong>
      </P>
      <pre style={{ background: "var(--hw-surface)", padding: "1rem", borderRadius: "4px", overflowX: "auto", fontSize: "0.875rem", lineHeight: "1.5" }}>
        <code>{`import { HttpTransport, PublicClient } from "@nktkas/hyperliquid";

const client = new PublicClient({ transport: new HttpTransport() });

// Fetch BTC order book
const book = await client.l2Book({ coin: "BTC" });
console.log("Best bid:", book.levels[0][0].px);
console.log("Best ask:", book.levels[1][0].px);`}</code>
      </pre>
      <P>
        <strong>Place an order (authenticated):</strong>
      </P>
      <pre style={{ background: "var(--hw-surface)", padding: "1rem", borderRadius: "4px", overflowX: "auto", fontSize: "0.875rem", lineHeight: "1.5" }}>
        <code>{`import { HttpTransport, WalletClient } from "@nktkas/hyperliquid";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount("0xYOUR_PRIVATE_KEY");
const wallet = new WalletClient({
  account,
  transport: new HttpTransport(),
});

// Place a limit buy order for 0.01 BTC at $60,000
await wallet.order({
  orders: [{
    a: 0, // BTC asset index
    b: true, // buy
    p: "60000",
    s: "0.01",
    r: false, // not reduce-only
    t: { limit: { tif: "Gtc" } },
  }],
  grouping: "na",
});`}</code>
      </pre>
      <P>
        The SDK provides full TypeScript type definitions for all API responses, making it easy to
        work with market data and order types in a type-safe way. It supports both Node.js and
        browser environments.
      </P>
      <P>
        <strong>Python alternative:</strong> If you prefer Python, the official{" "}
        <code>hyperliquid-python-sdk</code> provides equivalent functionality — see the{" "}
        <InlineLink href="https://github.com/hyperliquid-dex/hyperliquid-python-sdk">
          GitHub repository
        </InlineLink>{" "}
        for installation and examples.
      </P>

      <H2 id="api-overview">API Overview: Two APIs, One Platform</H2>
      <P>
        Hyperliquid exposes two distinct APIs that serve different purposes. Understanding the
        separation is essential before you start building.
      </P>
      <P>
        <strong>Info API</strong> — The public, read-only API for market data and account information.
        No authentication is required. Use this to fetch order books, recent trades, candle data,
        funding rates, open interest, user positions, and account state. The base URL is{" "}
        <code>https://api.hyperliquid.xyz/info</code> and all requests are POST requests with a JSON
        body specifying the query type.
      </P>
      <P>
        <strong>Exchange API</strong> — The authenticated, write API for trading actions. Requires
        EIP-712 signature authentication. Use this to place orders, cancel orders, modify positions,
        update leverage, transfer margins between sub-accounts, and initiate withdrawals. The base
        URL is <code>https://api.hyperliquid.xyz/exchange</code>.
      </P>
      <P>
        Both APIs use JSON over HTTPS. There are no separate REST endpoints for different resources
        as you might find on a traditional exchange — instead, you POST a typed request to a single
        endpoint. For example, to get the order book, you POST{" "}
        <code>{`{"type": "l2Book", "coin": "BTC"}`}</code> to the Info API. This design simplifies
        the API surface while supporting a wide range of queries.
      </P>

      <H2 id="authentication">Authentication: EIP-712 Signatures</H2>
      <P>
        The Exchange API uses EIP-712 typed data signatures for authentication — the same standard
        used by MetaMask and other Ethereum wallets for structured data signing. This means you prove
        ownership of your wallet by signing each request with your private key, without ever sending
        your private key to Hyperliquid&apos;s servers.
      </P>
      <P>
        Each Exchange API request includes three components: the action (what you want to do), a
        nonce (current timestamp in milliseconds for replay protection), and the EIP-712 signature
        generated from the action and nonce using your wallet&apos;s private key. The signature
        scheme ensures that even if someone intercepts your API request, they cannot modify it or
        replay it after the nonce window expires.
      </P>
      <P>
        <strong>API wallets vs main wallets:</strong> Hyperliquid supports a critical security
        feature — API-only wallets. You can authorize a separate wallet address to trade on behalf
        of your main account. This API wallet can place and cancel orders but cannot initiate
        withdrawals. If your API wallet key is compromised, the attacker can trade (and potentially
        lose money through bad trades) but cannot steal your funds. This is a best practice for any
        production bot — never use your main wallet&apos;s private key in an automated system.
      </P>

      <H2 id="info-endpoints">Info API Endpoints</H2>
      <P>
        The Info API covers all the market data and account information you need for trading
        decisions. Key endpoint types include:
      </P>
      <P>
        <strong>Market metadata:</strong> Request type <code>meta</code> returns all available
        markets with their specifications — symbol, maximum leverage, tick size, lot size, and
        current funding rate. This is the starting point for discovering which markets are available
        and their trading parameters.
      </P>
      <P>
        <strong>Order book:</strong> Request type <code>l2Book</code> returns the current order book
        for a given market, with configurable depth. Returns arrays of price/size pairs for bids and
        asks. For real-time book updates, use the WebSocket API instead of polling.
      </P>
      <P>
        <strong>Candle data:</strong> Request type <code>candleSnapshot</code> returns OHLCV candle
        data for a specified market and time interval (1m, 5m, 15m, 1h, 4h, 1d). Essential for
        technical analysis and backtesting.
      </P>
      <P>
        <strong>Funding rates:</strong> Request type <code>fundingHistory</code> returns historical
        funding rates for a market. Combined with <code>meta</code> (which includes current
        predicted rates), this gives you a complete picture of funding dynamics. See our{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rates guide</InlineLink>{" "}
        for strategies around funding.
      </P>
      <P>
        <strong>User state:</strong> Request types <code>clearinghouseState</code> and{" "}
        <code>openOrders</code> return a user&apos;s current positions, margin balances, and pending
        orders. These do not require authentication (any address can be queried), which is useful for
        building analytics tools that track whale positions.
      </P>

      <H2 id="trading-endpoints">Exchange API Endpoints</H2>
      <P>
        The Exchange API handles all trading operations. Every request must be signed with your
        wallet&apos;s private key using the EIP-712 scheme described above.
      </P>
      <P>
        <strong>Place order:</strong> The <code>order</code> action lets you place limit orders,
        market orders (as aggressive limit orders), and advanced order types including
        stop-loss, take-profit, and trailing-stop orders. You specify the market, side (buy/sell),
        size, price, order type, and optional reduce-only or time-in-force parameters. Batch
        ordering is supported — you can place up to 20 orders in a single API call.
      </P>
      <P>
        <strong>Cancel order:</strong> The <code>cancel</code> action cancels one or more open
        orders by their order ID. You can also use <code>cancelByClid</code> to cancel by your
        client-assigned order ID, which is useful for tracking orders in your own system. Batch
        cancellation supports up to 20 cancels per request.
      </P>
      <P>
        <strong>Modify order:</strong> Rather than canceling and replacing, you can use the{" "}
        <code>modify</code> action to update an existing order&apos;s price or size in a single
        atomic operation. This is more efficient and avoids the risk of the cancel succeeding but
        the new order failing.
      </P>
      <P>
        <strong>Update leverage:</strong> The <code>updateLeverage</code> action changes the
        leverage setting for a specific market. This affects new positions and adjusts the margin
        requirement for existing positions.
      </P>
      <P>
        <strong>Transfer and withdraw:</strong> Transfer USDC between sub-accounts or initiate
        withdrawals to Arbitrum. Withdrawals go through the Hyperliquid bridge and typically settle
        within a few minutes.
      </P>

      <H2 id="websocket">WebSocket API</H2>
      <P>
        For real-time data, the WebSocket API is essential. Polling REST endpoints introduces latency
        and wastes rate limit budget. The WebSocket connection provides push-based updates as soon as
        state changes on-chain.
      </P>
      <P>
        Connect to <code>wss://api.hyperliquid.xyz/ws</code> and subscribe to channels by sending
        JSON subscription messages. Available channels include:
      </P>
      <P>
        <strong>l2Book:</strong> Real-time order book updates for a specific market. Sends the full
        book snapshot on subscription, then incremental updates as orders are placed, filled, or
        canceled. Updates arrive within 50-100ms of on-chain state changes.
      </P>
      <P>
        <strong>trades:</strong> Real-time trade feed showing every fill on a market — price, size,
        side, and timestamp. Useful for tape-reading strategies and real-time volume analysis.
      </P>
      <P>
        <strong>userFills:</strong> Real-time notifications when your orders are filled. Subscribe
        with your wallet address to receive instant fill confirmations without polling. This is
        critical for bots that need to react immediately to position changes.
      </P>
      <P>
        <strong>activeAssetCtx:</strong> Real-time updates to market context including mark price,
        funding rate, open interest, and 24-hour volume. Provides a live snapshot of market
        conditions without querying individual endpoints.
      </P>
      <P>
        Implement reconnection logic in your WebSocket client — connections may drop due to server
        restarts, network issues, or idle timeouts. A robust bot should detect disconnections,
        reconnect automatically, resubscribe to all channels, and reconcile any state changes that
        occurred during the disconnection by querying the REST API.
      </P>

      <H2 id="rate-limits">Rate Limits</H2>
      <P>
        Hyperliquid enforces rate limits to prevent abuse and ensure fair access. Understanding these
        limits is critical for bot development — hitting rate limits can cause missed trades or
        temporary bans.
      </P>
      <ComparisonTable
        headers={["API", "Limit", "Window", "Notes"]}
        rows={[
          ["Info API", "1,200 requests", "1 minute", "Per IP address"],
          ["Exchange API", "100 requests", "10 seconds", "Per wallet address"],
          ["WebSocket", "No message limit", "Continuous", "Max 100 subscriptions per connection"],
        ]}
      />
      <P>
        The Info API limit of 1,200 requests per minute (20 per second) is generous for most use
        cases, but can be consumed quickly if you are polling multiple markets. Use the WebSocket API
        for real-time data to conserve REST rate limits for on-demand queries.
      </P>
      <P>
        The Exchange API limit of 100 requests per 10 seconds per wallet allows 10 orders per
        second on average. With batch ordering (up to 20 orders per request), you can effectively
        place up to 200 orders per 10 seconds — sufficient for most market-making strategies. If you
        need more throughput, consider using multiple API wallets authorized on the same account.
      </P>

      <H2 id="sdk-libraries">SDK Libraries</H2>
      <P>
        While you can interact with the Hyperliquid API using raw HTTP requests in any language,
        official and community SDKs simplify development significantly by handling authentication,
        request formatting, and response parsing.
      </P>
      <P>
        <strong>Python SDK (hyperliquid-python-sdk):</strong> The official Python SDK is the most
        mature and widely used. It handles EIP-712 signature generation, provides typed request and
        response objects, and includes helper functions for common operations. Install with{" "}
        <code>pip install hyperliquid-python-sdk</code>. The SDK supports both synchronous and
        asynchronous usage and includes WebSocket client management.
      </P>
      <P>
        <strong>TypeScript SDK:</strong> An official TypeScript/JavaScript SDK is available for
        Node.js and browser environments. It provides the same functionality as the Python SDK with
        TypeScript type definitions for all request and response types. Useful for building web-based
        trading interfaces or Node.js bots.
      </P>
      <P>
        <strong>Community SDKs:</strong> Community-maintained libraries exist for Rust, Go, and C#.
        These vary in completeness and maintenance status — check the GitHub repository activity
        before depending on a community SDK for production use. For a curated list of developer
        tools, see our <InlineLink href="/projects">project directory</InlineLink>.
      </P>

      <H2 id="building-a-bot">Building a Trading Bot: From Zero to First Trade</H2>
      <P>
        Building a basic trading bot on Hyperliquid involves four steps: connecting to the API,
        fetching market data, placing an order, and monitoring fills. Here is the conceptual flow
        using the Python SDK:
      </P>
      <P>
        <strong>Step 1 — Set up authentication:</strong> Create an API wallet on the Hyperliquid
        interface, export the private key, and initialize the SDK client with your API wallet address
        and private key. Store the private key in an environment variable, never in source code.
      </P>
      <P>
        <strong>Step 2 — Fetch market data:</strong> Query the Info API for the current order book,
        recent trades, and funding rates. Parse the response to determine current market conditions —
        best bid, best ask, spread, and recent price action.
      </P>
      <P>
        <strong>Step 3 — Place an order:</strong> Based on your strategy logic, construct an order
        with the appropriate market, side, size, price, and order type. Submit it through the
        Exchange API. The response includes an order ID (oid) for tracking.
      </P>
      <P>
        <strong>Step 4 — Monitor and manage:</strong> Subscribe to the WebSocket userFills channel
        to receive real-time fill notifications. When your order fills, update your internal state
        and execute follow-up logic (place stop-loss, update position tracking, log the trade).
        Implement error handling for partial fills, rejected orders, and network failures.
      </P>
      <P>
        Start on testnet. The Hyperliquid testnet provides identical API endpoints with fake funds,
        letting you validate your bot&apos;s behavior without risking real capital. Only move to
        mainnet after thorough testing. For more on automated trading, see our{" "}
        <InlineLink href="/learn/best-hyperliquid-trading-bots">
          Best Hyperliquid Trading Bots
        </InlineLink>{" "}
        guide.
      </P>

      <H2 id="best-practices">Best Practices for Production Bots</H2>
      <P>
        <strong>Use API-only wallets:</strong> Never put your main wallet&apos;s private key in a
        bot. Create a dedicated API wallet that can trade but cannot withdraw. This limits the damage
        if your server is compromised.
      </P>
      <P>
        <strong>Implement circuit breakers:</strong> Your bot should have automatic shutdown triggers:
        maximum loss per hour, maximum number of consecutive losing trades, unusual spread widening,
        and abnormal latency. A bot without circuit breakers can lose your entire account in minutes
        during adverse conditions.
      </P>
      <P>
        <strong>Handle disconnections gracefully:</strong> Network failures, API outages, and
        WebSocket drops are inevitable. Your bot should detect disconnections immediately, reconnect
        with exponential backoff, reconcile state after reconnection (query current positions and
        open orders), and have a safe default behavior during disconnections (e.g., cancel all open
        orders).
      </P>
      <P>
        <strong>Respect rate limits proactively:</strong> Do not wait for 429 errors — track your
        request count locally and throttle before hitting limits. Use WebSocket feeds instead of
        polling for real-time data. Batch orders when possible to reduce request count.
      </P>
      <P>
        <strong>Log everything:</strong> Every order placed, fill received, error encountered, and
        decision made should be logged with timestamps. When something goes wrong (and it will),
        detailed logs are the only way to diagnose the issue and prevent recurrence.
      </P>
      <P>
        <strong>Start small:</strong> Even after successful testnet validation, start with minimal
        position sizes on mainnet. Increase gradually as you build confidence in your bot&apos;s
        behavior under real market conditions.
      </P>

      <CTA href="/projects">Explore Hyperliquid Developer Tools &rarr;</CTA>
    </LearnLayout>
  );
}
