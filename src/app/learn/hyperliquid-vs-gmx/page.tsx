import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-vs-gmx";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid vs GMX: Perp DEX Comparison 2026",
  description:
    "Hyperliquid vs GMX comparison: orderbook vs oracle-based pricing, fees, liquidity models (HLP vs GLP/GM), volume, and which DEX suits different trading styles.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "Hyperliquid vs GMX: Perp DEX Comparison 2026",
    description:
      "Orderbook vs oracle-based perps: fees, liquidity models, volume, and which DEX to choose.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid vs GMX: Perp DEX Comparison 2026",
    description:
      "Orderbook vs oracle-based perps: fees, liquidity models, volume, and which DEX to choose.",
  },
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "architecture", title: "Architecture" },
  { id: "fees-comparison", title: "Fees Comparison" },
  { id: "leverage-and-assets", title: "Leverage & Assets" },
  { id: "liquidity-model", title: "Liquidity Model" },
  { id: "ecosystem", title: "Ecosystem" },
  { id: "user-experience", title: "User Experience" },
  { id: "which-to-choose", title: "Which to Choose" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "Is Hyperliquid better than GMX?",
    answer:
      "For most traders, yes. Hyperliquid offers lower fees (0.035% taker vs 0.05-0.07%), deeper liquidity, more markets (170+ vs ~50), and a true orderbook with price discovery. GMX is better suited for traders who prefer oracle-based pricing with zero price impact on smaller trades, or for liquidity providers who want to earn yield through the GLP/GM model.",
  },
  {
    question: "What are GMX alternatives?",
    answer:
      "The main GMX alternatives for perpetual trading are Hyperliquid (orderbook-based, highest volume), dYdX (Cosmos appchain), Drift (Solana-based), and Gains Network (oracle-based like GMX). Hyperliquid is the most direct competitor in terms of volume and market coverage.",
  },
  {
    question: "Does GMX have an orderbook?",
    answer:
      "No. GMX uses an oracle-based pricing model where trades execute against a liquidity pool (GLP on v1, GM pools on v2) at the oracle price. There is no order book, no limit orders in the traditional sense, and no price discovery on the platform itself. Prices come from Chainlink oracles referencing external exchanges.",
  },
  {
    question: "Which has better liquidity?",
    answer:
      "Hyperliquid has significantly better liquidity. It processes approximately $6 billion in daily volume compared to GMX's roughly $400 million. Hyperliquid's orderbook model also means tighter spreads on major pairs. GMX's pool-based model offers zero price impact up to certain thresholds but can struggle with large trades due to open interest caps.",
  },
  {
    question: "Can I LP on both?",
    answer:
      "Yes. On Hyperliquid, you can provide liquidity through the HLP vault by depositing USDC to earn market-making returns. On GMX, you can buy GLP tokens (v1) or provide liquidity to individual GM pools (v2) to earn trading fees and esGMX rewards. The risk profiles are different — HLP exposes you to market-making PnL, while GLP/GM exposes you to the performance of the underlying asset pool.",
  },
];

export default function HyperliquidVsGmxPage() {
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
        Hyperliquid and GMX are two of the most prominent decentralized perpetual futures
        platforms, but they could not be more different in design. Hyperliquid operates a
        central limit order book (CLOB) on its own Layer 1 blockchain, where buyers and
        sellers match directly at market-determined prices. GMX uses an oracle-based model
        on Arbitrum and Avalanche, where traders execute against a shared liquidity pool at
        prices sourced from Chainlink oracles.
      </P>
      <P>
        This architectural difference cascades through every aspect of the trading experience:
        how prices are determined, how slippage works, what fee structures look like, and how
        liquidity providers earn yield. Understanding these differences is essential for choosing
        the right platform — or deciding when to use each one.
      </P>
      <P>
        In terms of scale, the gap has widened considerably.{" "}
        <InlineLink href="/learn/perp-dex-comparison">Across the perp DEX landscape</InlineLink>,
        Hyperliquid dominates with approximately $6 billion in daily volume, while GMX processes
        around $400 million per day on Arbitrum. But volume is not the only metric that matters.
        GMX pioneered a liquidity model that many protocols have copied, and it continues to
        attract liquidity providers seeking yield from trading fees.
      </P>

      <H2 id="architecture">Architecture: Orderbook vs Oracle-Based</H2>
      <P>
        <strong>Hyperliquid</strong> runs a full central limit order book (CLOB) on{" "}
        <InlineLink href="/learn/what-is-hyperliquid">its custom L1 blockchain</InlineLink>.
        Every trade is a match between a buyer and a seller at a price they both agreed on.
        Limit orders rest in the book at specific prices, and market orders walk the book,
        filling against available liquidity. This is the same model used by every major
        traditional exchange and centralized crypto exchange — it is the gold standard for
        price discovery and efficient markets.
      </P>
      <P>
        The order book runs on HyperCore, Hyperliquid{"'"}s native execution layer, which
        achieves sub-200ms block latency and processes up to 200,000 orders per second.
        Placing, modifying, and canceling orders costs zero gas. This makes Hyperliquid
        suitable for active trading strategies including market making, scalping, and
        algorithmic execution — strategies that are impractical on gas-heavy chains.
      </P>
      <P>
        <strong>GMX</strong> takes a fundamentally different approach. Instead of matching
        buyers and sellers, GMX routes all trades through a shared liquidity pool. In GMX v1,
        this pool is GLP — a basket of assets (ETH, BTC, USDC, and others) that serves as the
        counterparty to every trade. In GMX v2, individual GM pools provide isolated liquidity
        for each market. Prices are not discovered on GMX itself; they come from Chainlink
        oracles that reference prices on major exchanges.
      </P>
      <P>
        The oracle model has a notable advantage for smaller trades: zero price impact. When
        you open a $10,000 long on BTC via GMX, you get the exact oracle price with no
        slippage (below the pool{"'"}s capacity threshold). On an orderbook, the same order
        would walk the book and potentially pay a small spread. However, for larger trades,
        GMX{"'"}s model breaks down — open interest caps limit position sizes, and the pool can
        become imbalanced, triggering higher fees on the overweight side.
      </P>

      <H2 id="fees-comparison">Fees Comparison</H2>
      <ComparisonTable
        headers={["Fee Type", "Hyperliquid", "GMX"]}
        rows={[
          ["Taker fee", "0.035%", "0.05-0.07%"],
          ["Maker fee", "-0.01% (rebate)", "N/A (no orderbook)"],
          ["Open/close position", "Taker or maker fee", "0.05-0.07% each way"],
          ["Price impact", "Orderbook-dependent", "Zero (up to OI cap)"],
          ["Borrowing fee", "Via funding rate", "Hourly borrow rate"],
          ["Gas cost", "None on HyperCore", "$0.10-2.00 (Arbitrum)"],
        ]}
      />
      <P>
        Hyperliquid is cheaper for the vast majority of trades. The base taker fee is 0.035%
        versus GMX{"'"}s 0.05-0.07% (which varies based on pool utilization and open interest
        balance). Makers on Hyperliquid receive a rebate, meaning limit order traders are
        paid to trade. GMX has no concept of maker fees since there is no order book.
      </P>
      <P>
        The total cost of a round-trip trade (open and close) illustrates the difference. On
        Hyperliquid, a taker opening and closing a $100,000 position pays approximately $70
        total. On GMX, the same round trip costs $100-140 in position fees, plus Arbitrum gas
        fees, plus any borrowing fees incurred while the position is open. Over hundreds of
        trades, this cost difference compounds significantly.
      </P>
      <P>
        GMX{"'"}s borrowing fees deserve special attention. Instead of{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rates</InlineLink>{" "}
        that balance long and short open interest (as Hyperliquid uses), GMX charges a
        continuous borrowing fee based on pool utilization. This fee can spike during volatile
        markets when utilization is high, adding unpredictable costs to holding positions.
      </P>

      <H2 id="leverage-and-assets">Leverage & Assets</H2>
      <P>
        Hyperliquid lists over 170 perpetual markets with maximum leverage up to 50x on major
        pairs. The market selection spans large-cap cryptocurrencies, mid-cap altcoins, and
        through HIP-3, tokenized stocks and prediction markets. New markets can be listed
        permissionlessly, enabling rapid expansion.
      </P>
      <P>
        GMX lists approximately 50 markets on Arbitrum, with maximum leverage of 100x on
        BTC and ETH and 50x on most altcoins. Market additions require governance approval
        and depend on Chainlink oracle availability for the asset. This means GMX cannot
        list assets as quickly as Hyperliquid, and exotic or newly launched tokens are
        typically unavailable.
      </P>
      <P>
        For traders who focus on BTC, ETH, and a handful of major alts, both platforms
        provide adequate coverage. For traders who want access to the long tail of crypto
        assets, Hyperliquid{"'"}s broader selection is a significant advantage.
      </P>

      <H2 id="liquidity-model">Liquidity Model: HLP vs GLP/GM</H2>
      <P>
        Both platforms offer ways for users to provide liquidity and earn yield, but the
        models differ substantially.
      </P>
      <P>
        <InlineLink href="/projects/hlp">Hyperliquid{"'"}s HLP vault</InlineLink> is a
        community-funded market-making vault. Depositors contribute USDC, and the vault runs
        automated strategies that provide liquidity on Hyperliquid{"'"}s order book. Returns
        come from the vault{"'"}s trading PnL — spread capture, liquidation profits, and
        market-making gains. HLP has historically delivered strong returns but carries the
        risk of trading losses during adverse market conditions.
      </P>
      <P>
        GMX{"'"}s liquidity model works differently. In v1, liquidity providers buy GLP tokens,
        which represent a share of a multi-asset pool. GLP holders earn 70% of trading fees
        generated by the platform, plus esGMX rewards. In v2, liquidity is provided to
        individual GM pools for specific markets, allowing more targeted exposure. GM pool
        returns come from trading fees, borrowing fees, and price impact fees collected from
        traders.
      </P>
      <P>
        The key risk difference: HLP vault holders bear market-making risk (if the vault{"'"}s
        strategies lose money, depositors absorb the loss). GLP/GM holders bear asset exposure
        risk (the value of the pool changes with the underlying assets) and counterparty risk
        (if traders are highly profitable, the pool pays out). In practice, GLP has historically
        been profitable for holders because the house edge from fees exceeds average trader
        profits.
      </P>

      <H2 id="ecosystem">Ecosystem</H2>
      <P>
        Hyperliquid{"'"}s ecosystem extends far beyond perp trading. Through{" "}
        <InlineLink href="/learn/what-is-hyperevm">HyperEVM</InlineLink>, a growing array
        of DeFi protocols have launched on the Hyperliquid L1: lending platforms, liquid
        staking protocols, yield aggregators, and more. This creates composable DeFi
        opportunities — borrow against perp positions, stake HYPE and use liquid staking
        tokens as margin, or run automated strategies across the ecosystem.
      </P>
      <P>
        GMX lives within the Arbitrum ecosystem, which is rich with DeFi protocols. GLP
        tokens can be used as collateral on platforms like Abracadabra and Plutus. GMX
        has spawned an entire ecosystem of "GLP wrappers" and yield optimizers. However,
        GMX itself is a single-purpose protocol — it does not have its own blockchain or
        a broader DeFi ecosystem under its control.
      </P>
      <P>
        The difference comes down to vertical versus horizontal integration. Hyperliquid
        is building a vertically integrated L1 where trading, DeFi, and infrastructure
        all live on the same chain. GMX is a specialized protocol that plugs into the
        broader Arbitrum ecosystem. Both approaches have merits, but Hyperliquid{"'"}s
        tight integration enables capabilities that a standalone protocol cannot offer.
      </P>

      <H2 id="user-experience">User Experience</H2>
      <P>
        Hyperliquid{"'"}s interface is a professional trading terminal with TradingView charts,
        a real-time order book display, one-click trading, and sub-second execution. The
        experience closely mirrors that of a top centralized exchange. Onboarding requires
        bridging USDC from Arbitrum, after which trading is gasless and instant.
      </P>
      <P>
        GMX{"'"}s interface is simpler and more straightforward. The trading panel shows the
        oracle price, available liquidity, and position details. Since there is no order book,
        the UI is cleaner but less informative — you cannot see market depth or resting orders.
        Trades confirm in Arbitrum block time (roughly 250ms), plus oracle price updates.
        Each transaction incurs Arbitrum gas fees.
      </P>
      <P>
        For experienced traders who want a full-featured trading environment, Hyperliquid is
        the stronger choice. For casual traders who want a simple "buy long / sell short"
        interface without worrying about order types or book dynamics, GMX{"'"}s simplicity
        can be appealing.
      </P>

      <H2 id="which-to-choose">Which to Choose</H2>
      <P>
        <strong>Choose Hyperliquid if:</strong> you are an active trader who values low fees,
        deep liquidity, real price discovery, and a wide selection of markets. The orderbook
        model is superior for serious trading — it provides better execution, tighter spreads,
        and lower costs at scale. The HyperEVM ecosystem adds DeFi composability that
        GMX cannot match.
      </P>
      <P>
        <strong>Choose GMX if:</strong> you prefer oracle-based execution with zero price
        impact on smaller trades, you want to LP into GLP/GM pools for fee-based yield, or
        you are already embedded in the Arbitrum ecosystem. GMX{"'"}s model is simpler and can
        be advantageous for less frequent traders who open and close positions at exact oracle
        prices.
      </P>
      <P>
        <strong>The bottom line:</strong> Hyperliquid has surpassed GMX on nearly every
        quantitative metric — volume, liquidity, fee competitiveness, and market selection.
        GMX{"'"}s oracle-based model remains a viable alternative for specific use cases, but
        the market has clearly spoken in favor of Hyperliquid{"'"}s orderbook approach.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/learn/perp-dex-comparison">Compare all perp DEXs &rarr;</CTA>
    </LearnLayout>
  );
}
