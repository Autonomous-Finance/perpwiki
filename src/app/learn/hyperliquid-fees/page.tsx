import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-fees";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid Fees Explained — Trading Fees, Gas, Maker Rebates 2026",
  description:
    "Complete breakdown of Hyperliquid fees in 2026: taker fees (0.035%-0.045%), maker rebates, HyperEVM gas costs, withdrawal fees, and how to reduce your fees with higher volume.",
  openGraph: {
    title: "Hyperliquid Fees Explained — Trading Fees, Gas, Maker Rebates 2026",
    description:
      "Taker fees, maker rebates, gas costs, withdrawal fees, and volume tiers — everything about Hyperliquid fees in 2026.",
  },
};

const TOC = [
  { id: "overview", title: "Hyperliquid Fee Structure" },
  { id: "perp-fees", title: "Perpetual Trading Fees" },
  { id: "spot-fees", title: "Spot Trading Fees" },
  { id: "hyperevm-gas", title: "HyperEVM Gas Fees" },
  { id: "withdrawal-fees", title: "Withdrawal Fees" },
  { id: "fee-comparison", title: "Fee Comparison" },
  { id: "reduce-fees", title: "How to Reduce Your Fees" },
  { id: "funding-rates", title: "Understanding Funding Rates" },
];

const FAQ = [
  {
    question: "What are Hyperliquid fees?",
    answer:
      "Hyperliquid charges taker fees starting at 0.035% for perpetual trades and offers maker rebates of 0.01% for limit orders that add liquidity. There are no gas fees for placing orders on HyperCore. HyperEVM transactions cost $0.01-$0.10 in HYPE gas. Withdrawals to Arbitrum cost a flat ~$1-2 USDC.",
  },
  {
    question: "Does Hyperliquid charge gas fees?",
    answer:
      "HyperCore (where perp and spot trading happens) does not charge gas for placing, canceling, or modifying orders. This is a major advantage over other on-chain exchanges. HyperEVM, used for DeFi smart contracts, does require HYPE as gas, but costs are typically $0.01-$0.10 per transaction — far cheaper than Ethereum.",
  },
  {
    question: "How do maker rebates work on Hyperliquid?",
    answer:
      "When you place a limit order that sits on the order book and is filled by another trader (a taker), you earn a rebate of 0.01% at VIP0 tier. This means you are paid to provide liquidity. For example, a $10,000 maker order earns you $1.00. Higher volume tiers offer even larger rebates.",
  },
];

export default function HyperliquidFeesPage() {
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

      <H2 id="overview">Hyperliquid Fee Structure</H2>
      <P>
        Hyperliquid has earned its reputation as the dominant perpetual futures DEX in large part because
        of its fee structure. In a market where centralized exchanges charge 0.04%–0.10% per trade and
        many decentralized alternatives add additional gas costs on top, Hyperliquid delivers a fee
        schedule that is competitive with — and in many cases cheaper than — the largest CEXs in the
        world. This guide provides a complete breakdown of every fee you will encounter on Hyperliquid in
        2026, from trading fees and gas costs to withdrawals and funding rates.
      </P>
      <P>
        The Hyperliquid fee model is built around a simple principle: reward liquidity providers and keep
        costs low for active traders. Taker fees (paid when you execute against resting orders) start at
        just 0.035% and decrease with volume. Maker fees are negative — meaning you receive a rebate for
        every limit order that adds liquidity to the book. This maker-taker model incentivizes deep order
        books and tight spreads, which benefits all participants on the platform.
      </P>
      <P>
        Perhaps the most significant advantage of Hyperliquid&apos;s fee model is the absence of gas fees
        for order placement on HyperCore. Unlike other on-chain trading venues where every order
        submission, modification, or cancellation requires a gas payment, Hyperliquid&apos;s native
        trading engine processes these operations without any gas cost. This makes high-frequency limit
        order strategies viable on-chain for the first time, and it is one of the key reasons market
        makers have migrated significant volume to the platform.
      </P>

      <H2 id="perp-fees">Perpetual Trading Fees</H2>
      <P>
        Perpetual futures are the core product on Hyperliquid, and the fee schedule reflects the
        platform&apos;s focus on attracting serious trading volume. Fees are divided into two categories:
        taker fees (charged when your order executes immediately against a resting order) and maker
        rebates (paid to you when your limit order rests on the book and is filled by a taker).
      </P>
      <P>
        At the base tier (VIP0, for traders with less than $5 million in monthly volume), the taker fee
        is 0.035% and the maker rebate is 0.01%. To put this in concrete terms: if you place a $10,000
        market order to buy BTC-PERP, you pay $3.50 in taker fees. If instead you place a $10,000 limit
        order that rests on the book and gets filled, you earn $1.00 as a maker rebate. The difference
        between these two approaches — $4.50 on a single $10,000 trade — adds up quickly for active
        traders.
      </P>
      <P>
        The volume tier system rewards higher-volume traders with progressively better rates. Tiers are
        calculated based on your rolling 14-day trading volume. As your volume increases, your taker fees
        decrease and your maker rebates increase. Here is the full tier structure:
      </P>
      <ComparisonTable
        headers={["Tier", "14-Day Volume", "Taker Fee", "Maker Rebate"]}
        rows={[
          ["VIP0", "< $5M", "0.035%", "0.010%"],
          ["VIP1", "$5M – $25M", "0.030%", "0.012%"],
          ["VIP2", "$25M – $100M", "0.025%", "0.014%"],
          ["VIP3", "$100M – $500M", "0.022%", "0.015%"],
          ["VIP4", "$500M – $1B", "0.020%", "0.016%"],
          ["VIP5", "> $1B", "0.018%", "0.018%"],
        ]}
      />
      <P>
        At the highest tier (VIP5, for traders exceeding $1 billion in 14-day volume), taker fees drop to
        just 0.018% and maker rebates rise to 0.018%. This makes Hyperliquid one of the cheapest venues
        for high-volume perpetual trading anywhere — centralized or decentralized. Even at VIP0, the
        0.035% taker fee is lower than Binance&apos;s base rate of 0.045% and far below the 0.055%
        charged by most other perpetual DEXs.
      </P>
      <P>
        It is important to note that these fees apply to the notional value of your trade, not your
        margin deposit. If you open a $50,000 BTC-PERP position with 10x leverage using $5,000 margin,
        you pay fees on the full $50,000 notional — not the $5,000 margin. This is standard across all
        perpetual futures venues, but new traders sometimes overlook it.
      </P>

      <H2 id="spot-fees">Spot Trading Fees</H2>
      <P>
        Hyperliquid&apos;s spot market launched through the HIP-1 standard, which allows tokens to be
        listed natively on the HyperCore order book. Spot trading uses the same central limit order book
        (CLOB) architecture as perpetuals, providing professional-grade execution for token trading.
      </P>
      <P>
        Spot fees follow a similar maker-taker structure to perpetuals, though the specific rates may
        differ slightly depending on the token pair. For most HIP-1 tokens, taker fees are in the range
        of 0.035%–0.045% and maker orders receive rebates. The exact fee schedule for each spot market
        can be found in the Hyperliquid app under the market information panel.
      </P>
      <P>
        One significant advantage of spot trading on Hyperliquid versus other venues is that there is no
        gas cost for order placement. On Ethereum-based DEXs like Uniswap or even Arbitrum-based order
        books, every swap or order requires a gas transaction. On HyperCore, you can place, modify, and
        cancel spot limit orders with zero gas cost. This makes it practical to use sophisticated limit
        order strategies for spot tokens — something that is economically infeasible on most other chains
        due to gas overhead.
      </P>
      <P>
        The spot market is still growing relative to the perpetual market, but trading volume has been
        increasing steadily as more projects deploy tokens via HIP-1. Notable spot markets include HYPE/USDC,
        PURR/USDC, and dozens of ecosystem tokens from projects building on HyperEVM.
      </P>

      <H2 id="hyperevm-gas">HyperEVM Gas Fees</H2>
      <P>
        While HyperCore (the native trading engine) is gas-free for order operations, HyperEVM — the
        EVM-compatible smart contract layer — does require gas for transactions. This is an important
        distinction that new users often find confusing, so let&apos;s clarify it completely.
      </P>
      <P>
        <strong>HyperCore (no gas):</strong> Placing perpetual or spot orders, canceling orders, modifying
        orders, depositing into vaults, staking HYPE, and all native trading operations are entirely
        gas-free. You never need to hold HYPE to trade on HyperCore. This is possible because
        Hyperliquid&apos;s L1 blockchain processes these operations as native protocol actions rather
        than smart contract calls.
      </P>
      <P>
        <strong>HyperEVM (gas required):</strong> Interacting with DeFi protocols built on HyperEVM —
        such as lending on <InlineLink href="/projects/hyperlend">HyperLend</InlineLink>, providing
        liquidity on <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink>, minting feUSD
        on <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink>, or liquid staking
        via <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> — requires HYPE as gas. These are
        EVM smart contract transactions and follow the standard Ethereum gas model.
      </P>
      <P>
        The good news is that HyperEVM gas is extremely cheap. Typical transactions cost between $0.01
        and $0.10 worth of HYPE, making it comparable to Arbitrum or Optimism and orders of magnitude
        cheaper than Ethereum mainnet. Even complex DeFi transactions like multi-step swaps or
        collateralized borrowing rarely exceed $0.20 in gas. You only need a small amount of HYPE in
        your HyperEVM wallet to cover gas for dozens or hundreds of transactions.
      </P>

      <H2 id="withdrawal-fees">Withdrawal Fees</H2>
      <P>
        Withdrawing funds from Hyperliquid back to Arbitrum One incurs a flat bridge fee of approximately
        $1–2 USDC. This fee covers the cost of the cross-chain bridge transaction and is deducted from
        the withdrawal amount. Withdrawals typically process within 5–15 minutes, depending on validator
        confirmations.
      </P>
      <P>
        Transfers within the Hyperliquid ecosystem are free. Moving USDC between your HyperCore trading
        account and your HyperEVM wallet costs no fee — it is an internal ledger operation on the same
        L1 chain. Similarly, depositing into or withdrawing from the HLP vault or user vaults has no
        additional fee beyond the standard protocol operations.
      </P>
      <P>
        If you are bridging from chains other than Arbitrum (such as Ethereum mainnet, Optimism, Base, or
        Solana), you will typically use a third-party bridge
        like <InlineLink href="/projects/debridge">deBridge</InlineLink> or Across Protocol. These
        bridges charge their own fees (usually 0.04%–0.10% of the transfer amount) in addition to the
        source chain&apos;s gas costs. For most users, depositing via Arbitrum remains the cheapest
        route.
      </P>

      <H2 id="fee-comparison">Fee Comparison</H2>
      <P>
        To appreciate how competitive Hyperliquid&apos;s fees are, it helps to compare them directly
        against the major alternatives — both centralized and decentralized. The following table shows
        base-tier fees (before any volume discounts or token holding benefits) across the most popular
        perpetual trading venues in 2026.
      </P>
      <ComparisonTable
        headers={["", "Hyperliquid", "Binance", "Bybit", "dYdX v4", "GMX v2"]}
        rows={[
          ["Taker Fee", "0.035%", "0.045%", "0.055%", "0.050%", "0.050–0.070%"],
          ["Maker Fee", "-0.010% (rebate)", "0.020%", "0.020%", "0.020%", "0.050–0.070%"],
          ["Withdrawal", "~$1–2 USDC", "$5–25 (varies)", "$5–15 (varies)", "~$1 USDC", "~$0.50 (Arb gas)"],
          ["Trading Gas", "Free (HyperCore)", "N/A (centralized)", "N/A (centralized)", "$0.01–0.05", "$0.10–0.50"],
          ["Funding Model", "8-hour intervals", "8-hour intervals", "8-hour intervals", "1-hour intervals", "Adaptive"],
        ]}
      />
      <P>
        Several things stand out in this comparison. First, Hyperliquid&apos;s taker fee at VIP0 (0.035%)
        is already lower than Binance&apos;s base rate (0.045%) — and Binance is widely considered the
        cheapest centralized exchange. Second, Hyperliquid is the only major venue that offers a maker
        rebate at the base tier; Binance and Bybit both charge positive maker fees unless you hold
        significant amounts of their native tokens (BNB/VIP status). Third, the absence of gas fees for
        order placement is unique to Hyperliquid among on-chain venues — dYdX and GMX both require gas
        for every trade.
      </P>
      <P>
        For a trader executing $1 million in monthly volume, the fee savings from using Hyperliquid
        versus Binance amount to roughly $100–$200 per month. For a $10 million monthly trader, savings
        can reach $1,000–$2,000 or more, especially when factoring in maker rebates that Hyperliquid
        pays but Binance charges.
      </P>

      <H2 id="reduce-fees">How to Reduce Your Fees</H2>
      <P>
        Even though Hyperliquid&apos;s base fees are already among the lowest in the industry, there are
        several strategies to reduce your effective trading costs further.
      </P>
      <P>
        <strong>Use limit orders whenever possible.</strong> This is the single most impactful change you
        can make. Switching from market orders (taker) to limit orders (maker) flips your fee from a cost
        of 0.035% to a rebate of 0.01%. On a $10,000 trade, that is a $4.50 swing — from paying $3.50 to
        earning $1.00. For active traders, this difference compounds enormously over time. Limit orders
        also typically provide better execution prices, so the real savings are even larger than the fee
        difference alone.
      </P>
      <P>
        <strong>Build volume to reach higher VIP tiers.</strong> If you are trading consistently, your
        14-day rolling volume will naturally push you into higher tiers with better rates. Even reaching
        VIP1 ($5M in 14-day volume, roughly $360K per day) drops your taker fee from 0.035% to 0.030% — a
        meaningful improvement for active strategies. Serious traders should track their tier progress in
        the Hyperliquid app under the portfolio section.
      </P>
      <P>
        <strong>Use the referral program.</strong> Hyperliquid offers a referral system that provides fee
        discounts for both the referrer and the referred user. If you haven&apos;t already signed up
        through a referral link, consider doing so — the discount is applied automatically to every trade
        and stacks with your VIP tier benefits.
      </P>
      <P>
        <strong>Time your trades to manage funding costs.</strong> While funding rates are not technically
        a fee, they can significantly affect your P&L on leveraged positions held for more than a few
        hours. If the funding rate is strongly positive and you are long, consider whether the trade setup
        justifies the ongoing funding cost. Monitoring funding rates before entering positions can save
        hundreds or thousands of dollars on large positions.
      </P>

      <H2 id="funding-rates">Understanding Funding Rates</H2>
      <P>
        Funding rates are often confused with trading fees, but they are a fundamentally different
        mechanism. While trading fees are a one-time cost paid when you enter or exit a position, funding
        rates are ongoing periodic payments exchanged between long and short position holders to keep
        perpetual futures prices aligned with the underlying spot price.
      </P>
      <P>
        On Hyperliquid, funding is settled every 8 hours (at 00:00, 08:00, and 16:00 UTC). The funding
        rate is calculated based on the difference between the perpetual mark price and the spot index
        price. When the perp price trades above spot (indicating more demand for long positions), the
        funding rate is positive — longs pay shorts. When the perp trades below spot, funding is
        negative — shorts pay longs.
      </P>
      <P>
        The magnitude of the funding rate varies by market conditions. During calm markets, funding rates
        are typically 0.001%–0.005% per 8-hour interval (0.01%–0.06% daily). During high-demand periods
        such as strong bull runs, funding on popular pairs like BTC-PERP and ETH-PERP can spike to
        0.01%–0.05% per interval (0.03%–0.15% daily). On a $100,000 position, a 0.01% funding rate
        means a $10 payment every 8 hours — $30 per day, $900 per month. These costs add up significantly
        for positions held over multiple days or weeks.
      </P>
      <P>
        You can monitor real-time funding rates directly in the Hyperliquid trading interface (shown next
        to each market pair) or through ecosystem analytics tools
        like <InlineLink href="/projects/hypurrscan">HypurrScan</InlineLink>, which provides historical
        funding rate charts and aggregate statistics. Some traders actively use funding rates as a
        strategy — earning funding by taking the less popular side of the market, especially during
        extreme sentiment periods.
      </P>
      <P>
        It is worth emphasizing that funding rates are not collected by Hyperliquid. They are peer-to-peer
        payments between traders — the exchange acts as a neutral settlement layer. This is consistent
        with how funding works on centralized exchanges, but the on-chain transparency of Hyperliquid
        means you can independently verify every funding payment on the blockchain.
      </P>

      <CTA href="/learn/how-to-use-hyperliquid">How to Use Hyperliquid — Beginner&apos;s Guide &rarr;</CTA>
    </LearnLayout>
  );
}
