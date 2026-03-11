import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "how-to-earn-yield-on-hyperliquid";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "5 Ways to Earn Yield on Hyperliquid (2026 Guide)",
  description:
    "Complete guide to earning yield on Hyperliquid: HLP vault (15-25% APR), HYPE staking, lending on HyperLend, builder vaults, and funding rate arbitrage.",
  openGraph: {
    title: "5 Ways to Earn Yield on Hyperliquid",
    description:
      "HLP vault, HYPE staking, lending, builder vaults, and funding rate farming — all yield options on Hyperliquid explained.",
    type: "article",
  },
};

const TOC = [
  { id: "yield-overview", title: "Yield Overview" },
  { id: "hlp-vault", title: "1. HLP Vault" },
  { id: "hype-staking", title: "2. HYPE Staking" },
  { id: "lending", title: "3. Lending on HyperLend" },
  { id: "builder-vaults", title: "4. Builder Vaults" },
  { id: "funding-rate-arb", title: "5. Funding Rate Arbitrage" },
  { id: "comparison", title: "Yield Comparison" },
  { id: "stacking-strategies", title: "Stacking Strategies" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is the best way to earn yield on Hyperliquid?",
    answer:
      "It depends on your holdings and risk tolerance. The HLP vault offers 15-25% APY on USDC with market-making risk. HYPE staking provides 5-10% APY with minimal risk. Lending on HyperLend offers 3-12% on various assets. Builder vaults and funding rate arbitrage are higher-effort, higher-reward options.",
  },
  {
    question: "How much does the HLP vault pay?",
    answer:
      "HLP vault returns are variable and depend on market conditions. Historical annualized returns have ranged from 10-30%, driven by market-making spreads, taker fee share, liquidation profits, and funding rate capture. There is no fixed or guaranteed APY.",
  },
  {
    question: "Can I earn yield on HYPE without selling it?",
    answer:
      "Yes. You can stake HYPE directly to validators for 5-10% APY, use liquid staking (Kinetiq for kHYPE or StakedHYPE for stHYPE) to earn staking rewards while keeping your tokens liquid, or deposit HYPE into HyperLend to earn lending interest from borrowers.",
  },
  {
    question: "Is yield farming on Hyperliquid safe?",
    answer:
      "Each yield source has different risks. HYPE staking is the lowest risk (minimal slashing). HLP vault has market risk (temporary drawdowns during volatility). Lending has smart contract risk. Funding rate farming has rate reversal and margin risk. Diversifying across multiple yield sources reduces overall risk.",
  },
  {
    question: "Can I stack multiple yield strategies on Hyperliquid?",
    answer:
      "Yes, and this is one of HyperEVM's key advantages. For example: stake HYPE via Kinetiq (earn staking rewards), deposit kHYPE into Felix Protocol (mint feUSD), then lend feUSD on HyperLend (earn lending interest). This creates three layers of yield on a single underlying HYPE position.",
  },
];

export default function HowToEarnYieldOnHyperliquidPage() {
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

      <H2 id="yield-overview">Yield Overview</H2>
      <P>
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink> has evolved from
        a pure perpetual futures exchange into a full DeFi ecosystem with multiple distinct yield
        opportunities. Whether you hold USDC, HYPE, or liquid staking tokens, there are now
        several ways to put your capital to work — ranging from low-risk staking to more
        aggressive strategies like funding rate arbitrage.
      </P>
      <P>
        This guide covers five proven yield strategies available on Hyperliquid in 2026, ordered
        from most accessible to most advanced. Each strategy has different risk-return
        characteristics, capital requirements, and complexity levels. Understanding all five
        gives you the tools to build a diversified yield portfolio that matches your risk
        tolerance and time commitment.
      </P>

      <H2 id="hlp-vault">1. HLP Vault (15-25% Variable APY)</H2>
      <P>
        The <InlineLink href="/learn/hlp-vault-guide">HLP (Hyperliquidity Provider) vault</InlineLink>{" "}
        is Hyperliquid&apos;s protocol-operated liquidity vault and the single largest yield
        opportunity on the platform. Depositors provide USDC that collectively acts as the market
        maker and liquidation backstop across all 229 perpetual markets.
      </P>
      <P>
        HLP generates yield from four sources: market-making spreads (the difference between bid
        and ask prices), a share of taker fees paid on every trade, liquidation profits when
        leveraged traders are liquidated, and funding rate capture from positions that earn
        positive funding.
      </P>
      <P>
        Historical returns have averaged 15-25% annualized, with higher yields during volatile
        market periods and lower yields during quiet conditions. The vault has accumulated over
        $43 million in total profits since inception with $373M+ in TVL. There is no lock-up
        period — you can deposit or withdraw USDC at any time.
      </P>
      <P>
        <strong>Best for:</strong> USDC holders who want passive yield without managing positions
        or taking directional exposure. The main risk is temporary drawdowns during extreme
        market volatility, when the vault&apos;s market-making positions can move against it.
        Maximum historical drawdown has been approximately 4-5% of TVL.
      </P>

      <H2 id="hype-staking">2. HYPE Staking (5-10% APY)</H2>
      <P>
        HYPE holders can stake their tokens directly to Hyperliquid validators to earn consensus
        rewards. The staking APY currently ranges from 5-10%, paid in HYPE. This is the simplest
        and lowest-risk yield option for HYPE holders.
      </P>
      <P>
        Direct staking involves delegating your HYPE to one of Hyperliquid&apos;s 25 active
        validators. Your tokens are locked during the staking period, and unstaking requires a
        7-day unbonding period before you can access your HYPE again.
      </P>
      <P>
        For users who want staking rewards without the unbonding period, liquid staking protocols
        offer an attractive alternative.{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> issues kHYPE — a liquid token
        that accrues staking rewards automatically while remaining freely tradeable and usable
        as DeFi collateral.{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> offers stHYPE with
        similar functionality.
      </P>
      <P>
        <strong>Best for:</strong> Long-term HYPE holders who believe in the token&apos;s value
        and want to earn rewards on their position. Liquid staking via Kinetiq or StakedHYPE is
        preferable if you want to use your staked position in DeFi.
      </P>

      <H2 id="lending">3. Lending on HyperLend (3-12% APY)</H2>
      <P>
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> is the primary lending
        protocol on HyperEVM. By supplying assets (USDC, HYPE, kHYPE, or other supported
        tokens), you earn interest from borrowers who need those assets.
      </P>
      <P>
        Lending APYs are determined by supply and demand. When many users want to borrow a
        particular asset and supply is limited, rates increase. USDC lending has historically
        offered 3-8% APY, while HYPE lending rates can be higher (6-12%) during periods of
        elevated borrow demand — such as when traders want to borrow HYPE for short selling or
        DeFi strategies.
      </P>
      <P>
        The lending process is straightforward: connect your wallet to HyperLend, select the
        asset you want to supply, and deposit. Interest accrues continuously and can be withdrawn
        at any time (subject to available liquidity in the pool). Your deposited assets serve as
        potential collateral for other users&apos; borrowing activity.
      </P>
      <P>
        <strong>Best for:</strong> Users who want predictable, low-risk yield on USDC or HYPE.
        Lending carries smart contract risk (inherent in any DeFi protocol) but does not have
        the market-making risk of HLP or the directional exposure of staking.
      </P>

      <H2 id="builder-vaults">4. Builder Vaults (Variable APY)</H2>
      <P>
        Beyond the protocol-operated HLP vault, Hyperliquid supports user-created vaults —
        commonly called builder vaults. These are managed by individual traders or teams who
        deploy trading strategies using depositors&apos; capital. Anyone can create a vault, and
        anyone can deposit into one.
      </P>
      <P>
        Builder vaults vary enormously in strategy, risk, and performance. Some run market-making
        strategies similar to HLP but focused on specific markets. Others run momentum strategies,
        mean-reversion strategies, or statistical arbitrage. The best-performing vaults have
        delivered returns significantly above HLP, but with higher variance and risk.
      </P>
      <P>
        Each builder vault charges a performance fee (typically 10-20% of profits) and may have
        minimum deposit requirements. Before depositing, you can review the vault&apos;s
        historical performance, current positions, and the vault leader&apos;s track record on
        the Hyperliquid interface.
      </P>
      <P>
        <strong>Best for:</strong> Users who want to allocate to specific trading strategies
        without executing them personally. The key risk is vault manager performance — a bad
        strategy or unlucky market conditions can produce losses. Always diversify across
        multiple vaults and monitor performance regularly.
      </P>

      <H2 id="funding-rate-arb">5. Funding Rate Arbitrage (10-30% APY)</H2>
      <P>
        Funding rate arbitrage is the most hands-on yield strategy on this list but also one of
        the most consistent. The concept is simple: when perpetual funding rates are positive
        (longs paying shorts), you buy the spot asset and simultaneously short the perpetual.
        Your net market exposure is zero, and you collect the funding rate payments from your
        short position.
      </P>
      <P>
        On Hyperliquid, funding is settled every 8 hours. A rate of +0.01% per 8 hours
        annualizes to approximately 11%. Rates of +0.03% to +0.05% (common during bull markets)
        annualize to 33-55%. Even accounting for execution costs and the occasional rate
        reversal, experienced funding rate farmers consistently generate 10-30% annualized
        returns.
      </P>
      <P>
        The strategy requires active management: monitoring rates across markets, rotating into
        the highest-yielding pairs, managing margin on the perpetual side, and unwinding
        positions when rates compress or flip negative. For a detailed walkthrough, see our{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rates guide</InlineLink>.
      </P>
      <P>
        <strong>Best for:</strong> Active traders comfortable with margin management and
        position monitoring. The risks include funding rate reversal (the rate flips and your
        short starts paying instead of earning), margin liquidation on the perp side during
        sharp rallies, and execution slippage when entering or exiting positions.
      </P>

      <H2 id="comparison">Yield Comparison</H2>
      <ComparisonTable
        headers={["Strategy", "Typical APY", "Deposit Asset", "Risk Level", "Effort"]}
        rows={[
          ["HLP Vault", "15-25%", "USDC", "Medium", "Passive"],
          ["HYPE Staking", "5-10%", "HYPE", "Low", "Passive"],
          ["HyperLend Lending", "3-12%", "USDC / HYPE / kHYPE", "Low-Medium", "Passive"],
          ["Builder Vaults", "Variable", "USDC", "Medium-High", "Semi-passive"],
          ["Funding Rate Arb", "10-30%", "USDC + Spot", "Medium", "Active"],
        ]}
      />

      <H2 id="stacking-strategies">Stacking Strategies</H2>
      <P>
        One of HyperEVM&apos;s most powerful features is the ability to stack multiple yield
        sources on a single capital base. This composability lets you earn from several protocols
        simultaneously, multiplying your effective yield.
      </P>
      <P>
        <strong>Example stack for HYPE holders:</strong> Start with 1,000 HYPE. Stake via{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> to receive 1,000 kHYPE (earn
        ~7% staking APY). Deposit kHYPE into{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> as collateral
        and mint 5,000 feUSD (at 50% LTV). Lend the 5,000 feUSD on{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> at 5% APY. Your effective
        yield is now: 7% staking on the full position + 5% lending on the borrowed amount —
        significantly more than any single strategy alone.
      </P>
      <P>
        <strong>Example stack for USDC holders:</strong> Deposit 50% of USDC into HLP vault
        (earn ~20% APY). Lend the remaining 50% on HyperLend (earn ~5% APY). The blended
        portfolio yield is approximately 12.5% with diversified risk exposure — HLP market risk
        on one half, lending contract risk on the other.
      </P>
      <P>
        <strong>Risk warning:</strong> Stacking increases both yield and risk. Each additional
        protocol layer introduces its own smart contract risk. Leveraged positions (like minting
        feUSD against kHYPE collateral) can be liquidated if the underlying collateral value
        drops. Always understand the liquidation thresholds and monitor your positions,
        especially during volatile markets.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/projects">Explore yield projects on Hyperliquid &rarr;</CTA>
    </LearnLayout>
  );
}
