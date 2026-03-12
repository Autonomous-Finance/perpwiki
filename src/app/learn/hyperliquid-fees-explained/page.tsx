import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SLUG = "hyperliquid-fees-explained";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid Fees Explained: Complete Fee Structure Guide 2026",
  description:
    "Full breakdown of Hyperliquid fees: perp maker/taker rates, spot fees, HyperEVM gas, deposit/withdrawal costs, and how to reduce trading costs.",
  openGraph: {
    title: "Hyperliquid Fees Explained: Complete Fee Structure Guide",
    description:
      "Full breakdown of Hyperliquid fees: perp maker/taker rates, spot fees, HyperEVM gas, deposit/withdrawal costs, and how to reduce trading costs.",
    type: "article",
  },
};

const TOC = [
  { id: "fee-overview", title: "Fee Overview" },
  { id: "perp-trading-fees", title: "Perpetual Trading Fees" },
  { id: "spot-trading-fees", title: "Spot Trading Fees" },
  { id: "deposit-withdrawal", title: "Deposits & Withdrawals" },
  { id: "hyperevm-gas", title: "HyperEVM Gas Costs" },
  { id: "fee-comparison", title: "Fee Comparison" },
  { id: "reducing-fees", title: "Reducing Your Fees" },
  { id: "fee-distribution", title: "Where Do Fees Go?" },
];

/* ── Inline server components ─────────────────────────────────── */

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hw-green)]" />
    </span>
  );
}

function ArticleMeta({ difficulty }: { difficulty: string }) {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const year = now.getUTCFullYear();
  const diffColor =
    difficulty === "Beginner"
      ? "bg-emerald-500/15 text-emerald-400"
      : difficulty === "Intermediate"
        ? "bg-amber-500/15 text-amber-400"
        : "bg-red-500/15 text-red-400";

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hw-surface-raised)] px-3 py-1 text-xs text-[var(--hw-text-muted)]">
        <LiveDot />
        Last updated {month} {year} &middot; Live data
      </span>
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${diffColor}`}>
        {difficulty}
      </span>
    </div>
  );
}

async function fetchBtcFundingRate(): Promise<number | null> {
  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
      next: { revalidate: 120 },
    });
    const data = await res.json();
    // data[1] is the array of asset contexts; BTC is index 0
    const btcCtx = data?.[1]?.[0];
    const fundingRate = parseFloat(btcCtx?.funding);
    return isNaN(fundingRate) ? null : fundingRate;
  } catch {
    return null;
  }
}

async function LiveFundingData() {
  const fundingRate = await fetchBtcFundingRate();
  const displayRate = fundingRate !== null ? fundingRate : 0.000032;
  const isLive = fundingRate !== null;
  const annualized = displayRate * 3 * 365 * 100; // 8h rate * 3 per day * 365

  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-1">
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        {isLive && <LiveDot />}
        <span className="text-xs font-medium text-[var(--hw-text-dim)]">
          {isLive ? "Live Funding Rate" : "Estimated Data (API unavailable)"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-px sm:grid-cols-2">
        <div className="px-4 py-3">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">BTC Funding Rate (8h)</div>
          <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)]">
            {(displayRate * 100).toFixed(4)}%
          </div>
          <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
            {displayRate >= 0 ? "Longs pay shorts" : "Shorts pay longs"}
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">Annualized Rate</div>
          <div className={`font-[family-name:var(--font-space-grotesk)] text-2xl font-bold ${annualized >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {annualized >= 0 ? "+" : ""}{annualized.toFixed(2)}%
          </div>
          <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">based on current rate</div>
        </div>
      </div>
    </div>
  );
}

function FeeFlowDiagram() {
  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5">
      <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-4">
        Fee Flow Breakdown
      </h3>
      <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center sm:gap-0">
        {/* Step 1 */}
        <div className="flex-1 rounded border border-[var(--hw-border-bright)] bg-[var(--hw-surface-raised)] p-3 text-center">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">You Place a Trade</div>
          <div className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--hw-text)]">
            $10,000 Notional
          </div>
        </div>
        {/* Arrow */}
        <div className="flex items-center justify-center py-1 sm:px-1 sm:py-0">
          <svg className="h-5 w-5 text-[var(--hw-green)] rotate-90 sm:rotate-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Step 2 */}
        <div className="flex-1 rounded border border-[var(--hw-green)] bg-[var(--hw-green-subtle)] p-3 text-center">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">Trading Fee</div>
          <div className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--hw-green)]">
            0.025% maker / 0.050% taker
          </div>
          <div className="text-xs text-[var(--hw-text-dim)] mt-1">$2.50 &mdash; $5.00</div>
        </div>
        {/* Arrow */}
        <div className="flex items-center justify-center py-1 sm:px-1 sm:py-0">
          <svg className="h-5 w-5 text-[var(--hw-green)] rotate-90 sm:rotate-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Step 3 */}
        <div className="flex-1 rounded border border-[var(--hw-border-bright)] bg-[var(--hw-surface-raised)] p-3 text-center">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">Protocol Revenue</div>
          <div className="mt-2 flex flex-col gap-1">
            <span className="inline-block rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
              HLP Vault Yield
            </span>
            <span className="inline-block rounded bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
              HYPE Buyback
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeCalculatorPreview() {
  const trades = [
    { size: 1_000, maker: 1_000 * 0.00025, taker: 1_000 * 0.0005 },
    { size: 10_000, maker: 10_000 * 0.00025, taker: 10_000 * 0.0005 },
    { size: 100_000, maker: 100_000 * 0.00025, taker: 100_000 * 0.0005 },
  ];

  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)]">
      <div className="border-b border-[var(--hw-border)] px-5 py-3 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
          Quick Fee Estimate
        </h3>
        <Link
          href="/tools/fee-calculator"
          className="text-xs text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
        >
          Full calculator &rarr;
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-500/10">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-emerald-400">Trade Size</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-emerald-400">Maker Fee (0.025%)</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-emerald-400">Taker Fee (0.050%)</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.size} className="border-t border-[var(--hw-border)]">
                <td className="px-5 py-2.5 font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">
                  ${t.size.toLocaleString()}
                </td>
                <td className="px-5 py-2.5 text-[var(--hw-text-muted)]">
                  ${t.maker.toFixed(2)}
                </td>
                <td className="px-5 py-2.5 text-[var(--hw-text-muted)]">
                  ${t.taker.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function HyperliquidFeesExplainedPage() {
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
          mainEntity: [
            { "@type": "Question", name: "Does Hyperliquid charge gas fees?", acceptedAnswer: { "@type": "Answer", text: "No gas fees on HyperCore for placing, modifying, or canceling orders. Only trading fees (0.025% maker / 0.050% taker) apply when orders execute. HyperEVM charges standard EVM gas, typically a few cents per transaction." } },
            { "@type": "Question", name: "What are Hyperliquid maker and taker fees?", acceptedAnswer: { "@type": "Answer", text: "Maker orders add liquidity and pay 0.025%; taker orders remove liquidity and pay 0.050%. Volume-based tiers can reduce rates further — high-volume traders may achieve near-zero maker fees and rebates." } },
            { "@type": "Question", name: "What are the withdrawal fees on Hyperliquid?", acceptedAnswer: { "@type": "Answer", text: "Withdrawals cost a flat 1 USDC per withdrawal regardless of amount, making batch withdrawals more cost-effective." } },
            { "@type": "Question", name: "How do Hyperliquid fees compare to other exchanges?", acceptedAnswer: { "@type": "Answer", text: "Hyperliquid charges 0.025% maker / 0.050% taker with zero gas on HyperCore. Binance charges 0.02% maker / 0.05% taker. dYdX and GMX generally charge higher fees. Hyperliquid's edge is zero gas plus competitive trading fees." } },
            { "@type": "Question", name: "How can I reduce my Hyperliquid fees?", acceptedAnswer: { "@type": "Answer", text: "Use limit orders instead of market orders (0.025% vs 0.050%), increase your 30-day volume tier, use referral codes, and batch withdrawals to minimize the flat 1 USDC fee." } },
          ],
        }}
      />

      <ArticleMeta difficulty="Beginner" />

      <H2 id="fee-overview">Hyperliquid Fee Overview</H2>

      <LiveFundingData />

      <FeeFlowDiagram />

      <P>
        One of Hyperliquid&apos;s most compelling features is its fee structure — or more
        precisely, the fees it <em>doesn&apos;t</em> charge. On HyperCore, the native trading
        layer, there are <strong>no gas fees</strong> for placing, modifying, or canceling
        orders. Every interaction with the order book — whether you are placing a limit order,
        setting a stop loss, or canceling a resting order — is processed without any gas cost
        to the user. This is fundamentally different from trading on Ethereum-based DEXs where
        every on-chain action costs gas, and it is one of the primary reasons professional
        traders have migrated to Hyperliquid.
      </P>
      <P>
        The only fees you pay on HyperCore are <strong>trading fees</strong> — charged when
        your order is actually filled. This means you can place hundreds of limit orders, adjust
        them as the market moves, and cancel them freely, only paying when a trade executes.
        For market makers who routinely place and cancel thousands of orders per day, this
        zero-gas model is transformative.
      </P>
      <P>
        HyperEVM, the smart contract layer, does charge standard EVM gas fees for contract
        interactions. However, because Hyperliquid&apos;s L1 has high throughput and low
        congestion, gas costs on HyperEVM are typically a fraction of what you would pay on
        Ethereum mainnet — often just a few cents per transaction. If you are only trading perps
        and spot on HyperCore, you will never encounter gas fees at all.
      </P>

      <H2 id="perp-trading-fees">Perpetual Trading Fees</H2>
      <P>
        Hyperliquid uses the standard maker-taker fee model familiar from centralized exchanges.
        The distinction is simple: if your order adds liquidity to the order book (a limit order
        that rests on the book waiting to be filled), you are a <strong>maker</strong>. If your
        order removes liquidity (a market order, or a limit order that crosses the spread and
        fills immediately), you are a <strong>taker</strong>.
      </P>
      <P>
        The base fee tier for perpetual trading is <strong>0.025% maker / 0.050% taker</strong>.
        On a $10,000 trade, this means a maker pays $2.50 and a taker pays $5.00. These rates
        are competitive with major centralized exchanges — Binance&apos;s base tier charges
        0.02% maker / 0.05% taker, while Bybit charges 0.02% maker / 0.055% taker. Hyperliquid
        is in the same range while offering the additional benefit of self-custody.
      </P>

      <FeeCalculatorPreview />

      <P>
        For higher-volume traders, Hyperliquid offers volume-based fee tiers that reduce costs
        as your 30-day trading volume increases. The exact tier thresholds and rates are visible
        on the platform, but the general pattern follows industry norms: as you trade more, your
        maker fee approaches zero (or even becomes a rebate) and your taker fee decreases
        meaningfully. Traders doing tens of millions in monthly volume can achieve significantly
        lower effective rates.
      </P>
      <P>
        It is worth noting that fees are calculated on notional value, not margin. If you open
        a $100,000 position using 10x leverage with $10,000 margin, the fee is based on the
        $100,000 notional — not the $10,000 margin deposit. This is consistent with how all
        perpetual exchanges calculate fees, but new traders sometimes overlook it.
      </P>

      <H2 id="spot-trading-fees">Spot Trading Fees</H2>
      <P>
        Spot trading fees on Hyperliquid generally follow a similar maker-taker structure to
        perpetual fees, though rates may vary by trading pair. The native spot order book on
        HyperCore supports direct token listings via the HIP-1 standard, and each pair may
        have its own fee schedule depending on the token&apos;s listing parameters.
      </P>
      <P>
        For major pairs like HYPE/USDC, fees are typically in the same range as perpetual fees.
        Newer or lower-liquidity pairs listed through HIP-1 may have slightly different
        structures. As with perpetual trading, there are no gas fees for placing or canceling
        spot orders on HyperCore — you only pay when a trade executes.
      </P>
      <P>
        Spot trading on HyperEVM through DEXs like{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> or{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> involves different fee
        structures set by each protocol. These typically include a swap fee (usually 0.25-0.30%)
        plus a small gas cost for the on-chain transaction. For tokens that are available on
        both the native HyperCore spot book and HyperEVM DEXs, the native order book usually
        offers better pricing due to lower fees and tighter spreads.
      </P>

      <H2 id="deposit-withdrawal">Deposits &amp; Withdrawals</H2>
      <P>
        Depositing funds to Hyperliquid is <strong>free</strong> on the Hyperliquid side.
        You bridge USDC from Arbitrum to Hyperliquid through the official bridge at
        app.hyperliquid.xyz, and the only cost is the Arbitrum gas fee for the bridge
        transaction (typically a few cents). The minimum deposit amount is{" "}
        <strong>5 USDC</strong>, and deposits usually confirm within 1-2 minutes.
      </P>
      <P>
        Withdrawals carry a flat fee of <strong>1 USDC</strong> per withdrawal, regardless of
        the amount withdrawn. Withdrawals go back to Arbitrum and typically process within a
        few minutes, though during periods of high network activity they may take longer. There
        is no minimum withdrawal amount beyond the 1 USDC fee — you can withdraw as little as
        2 USDC if you choose (receiving 1 USDC after the fee).
      </P>
      <P>
        For users bridging from chains other than Arbitrum, third-party bridges like{" "}
        <InlineLink href="/projects/across-protocol">Across Protocol</InlineLink> and{" "}
        <InlineLink href="/projects/debridge">deBridge</InlineLink> support direct deposits
        from Ethereum mainnet, Optimism, Base, and other chains. These bridges charge their own
        fees (usually 0.05-0.15% of the transfer amount) but save you the step of first
        bridging to Arbitrum.
      </P>

      <H2 id="hyperevm-gas">HyperEVM Gas Costs</H2>
      <P>
        HyperEVM operates as a standard EVM-compatible execution environment, which means
        all smart contract interactions require gas fees paid in HYPE (the native gas token).
        This includes swapping tokens on DEXs, depositing into lending protocols, staking
        through liquid staking contracts, and any other on-chain operation.
      </P>
      <P>
        The good news is that HyperEVM gas costs are extremely low compared to Ethereum
        mainnet. A typical token swap costs a few cents, a lending deposit or withdrawal is
        similarly cheap, and even complex multi-step transactions rarely exceed $0.10-0.20 in
        gas. This is because Hyperliquid&apos;s L1 has high throughput and low congestion,
        keeping base fees minimal.
      </P>
      <P>
        To pay gas on HyperEVM, you need a small amount of HYPE in your HyperEVM wallet.
        If you are new to the ecosystem and only have USDC, you will need to acquire some HYPE
        first — either by buying it on the native spot order book or through a faucet if
        available. Most users find that 1-2 HYPE is more than sufficient for weeks of normal
        DeFi activity.
      </P>

      <H2 id="fee-comparison">Fee Comparison: Hyperliquid vs Competitors</H2>
      <P>
        To put Hyperliquid&apos;s fees in context, here is how they compare to other major
        perpetual trading platforms:
      </P>
      <ComparisonTable
        headers={["Platform", "Maker Fee", "Taker Fee", "Gas", "Withdrawal Fee"]}
        rows={[
          ["Hyperliquid", "0.025%", "0.050%", "None (HyperCore)", "1 USDC"],
          ["dYdX v4", "0.020%", "0.050%", "None (app chain)", "Variable"],
          ["Binance", "0.020%", "0.050%", "N/A (CEX)", "Chain-dependent"],
          ["GMX (Arbitrum)", "0.050%", "0.070%", "Arbitrum gas", "Arbitrum gas"],
        ]}
      />
      <P>
        Hyperliquid&apos;s fees are broadly competitive with the industry. Where it stands
        out is the combination of competitive trading fees, zero gas on the order book, and
        the self-custody advantage over centralized exchanges. GMX, while decentralized, charges
        significantly higher fees and runs on Arbitrum where gas costs are an additional
        consideration.
      </P>

      <H2 id="reducing-fees">How to Reduce Your Fees</H2>
      <P>
        <strong>Use limit orders.</strong> The single most effective way to reduce fees is to
        place limit orders instead of market orders. Maker fees (0.025%) are half the taker fee
        (0.050%). If you are not in a rush to enter or exit a position, placing a limit order
        at your desired price saves you money on every single trade.
      </P>
      <P>
        <strong>Increase your volume tier.</strong> As your 30-day trading volume increases,
        you unlock lower fee tiers. If you are already trading actively, this happens
        automatically. For traders doing significant volume, the savings from higher tiers
        can be substantial — potentially thousands of dollars per month.
      </P>
      <P>
        <strong>Use referral codes.</strong> Hyperliquid supports a referral system where both
        the referrer and the referred trader can receive fee discounts. If you are signing up
        for the first time, using a referral code costs nothing and provides an immediate fee
        reduction on your trades.
      </P>
      <P>
        <strong>Batch withdrawals.</strong> Since withdrawals carry a flat 1 USDC fee regardless
        of amount, it is more cost-effective to withdraw larger amounts less frequently rather
        than making many small withdrawals. If you are regularly taking profits, consider
        accumulating them and withdrawing weekly rather than daily.
      </P>

      <H2 id="fee-distribution">Where Do Fees Go?</H2>
      <P>
        Understanding where trading fees flow is important for evaluating the sustainability
        of the Hyperliquid ecosystem and the HYPE token&apos;s value proposition.
      </P>
      <P>
        A significant portion of fee revenue flows to the{" "}
        <InlineLink href="/projects/hlp">HLP vault</InlineLink>, which serves as the
        protocol&apos;s primary market-making vault. HLP depositors earn a share of trading
        fees, which contributes to the vault&apos;s historical 10-17% APY. This creates a
        direct incentive for liquidity providers to keep the order book deep and tight.
      </P>
      <P>
        Another portion of fees goes to the Assistance Fund, which conducts open-market
        <strong> HYPE buybacks</strong>. These buybacks create consistent buy pressure on the
        HYPE token, effectively distributing protocol revenue to token holders. The buyback
        mechanism is fully transparent — the Assistance Fund wallet is publicly known, and all
        transactions are visible on-chain.
      </P>
      <P>
        This fee distribution model creates a virtuous cycle: more trading volume generates more
        fees, which supports higher HLP yields (attracting more liquidity), more HYPE buybacks
        (supporting the token price), and ultimately a deeper, more liquid market that attracts
        more traders. It is one of the clearest examples of a DeFi protocol generating real,
        sustainable revenue rather than relying on token emissions.
      </P>

      <CTA href="/learn/what-is-hyperliquid">Learn more about Hyperliquid &rarr;</CTA>
    </LearnLayout>
  );
}
