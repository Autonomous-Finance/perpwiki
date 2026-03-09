import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-fees-explained";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid Fees Explained: Complete Fee Structure Guide 2026 | perp.wiki",
  description:
    "Full breakdown of Hyperliquid fees: perp maker/taker rates, spot fees, HyperEVM gas, deposit/withdrawal costs, and how to reduce trading costs.",
  openGraph: {
    title: "Hyperliquid Fees Explained: Complete Fee Structure Guide",
    description:
      "Full breakdown of Hyperliquid fees: perp maker/taker rates, spot fees, HyperEVM gas, deposit/withdrawal costs, and how to reduce trading costs.",
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

export default function HyperliquidFeesExplainedPage() {
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

      <H2 id="fee-overview">Hyperliquid Fee Overview</H2>
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
