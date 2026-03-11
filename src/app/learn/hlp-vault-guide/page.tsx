import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hlp-vault-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "HLP Vault Guide — Hyperliquid Liquidity Provider 2026",
  description:
    "How the HLP vault works: deposit USDC, earn yield from market-making, liquidations, and trading fees. HLP APY, risks, TVL, and how it compares to HYPE staking.",
  openGraph: {
    title: "HLP Vault Guide — Hyperliquid Liquidity Provider 2026",
    description:
      "Earn yield on Hyperliquid by depositing to the HLP vault. APY, risks, and full guide 2026.",
    type: "article",
  },
};

const TOC = [
  { id: "what-is-hlp", title: "What Is the HLP Vault?" },
  { id: "how-hlp-generates-yield", title: "How HLP Generates Yield" },
  { id: "hlp-performance", title: "HLP Performance" },
  { id: "how-to-deposit", title: "How to Deposit" },
  { id: "step-by-step-deposit", title: "Step-by-Step: Depositing into HLP" },
  { id: "performance-history", title: "HLP Performance History" },
  { id: "jelly-incident", title: "The JELLY Incident (March 2025)" },
  { id: "hlp-apy", title: "HLP APY" },
  { id: "hlp-risks", title: "Risks" },
  { id: "tax-treatment", title: "Tax Treatment of HLP Returns" },
  { id: "hlp-vs-staking", title: "HLP vs HYPE Staking" },
  { id: "hlp-vs-staking-deep", title: "HLP vs Staking: Detailed Comparison" },
  { id: "who-is-hlp-for", title: "Who Is HLP For?" },
];

const FAQ = [
  {
    question: "What is the HLP vault on Hyperliquid?",
    answer:
      "HLP (Hyperliquidity Provider) is Hyperliquid's protocol-owned liquidity vault. Users deposit USDC and collectively act as the market maker and liquidator across all perpetual markets. There is no management fee — 100% of profits go to depositors.",
  },
  {
    question: "What is the HLP vault APY?",
    answer:
      "HLP vault APY is variable and depends on market conditions. Historical returns have ranged from 10-30% annualized, driven by market-making spreads, taker fee share, liquidation profits, and funding rate capture. There is no guaranteed return.",
  },
  {
    question: "Is the HLP vault safe?",
    answer:
      "HLP is fully on-chain and non-custodial — your deposit is secured by the Hyperliquid L1 blockchain. However, the vault can experience drawdowns during extreme market volatility when large positions move against HLP's market-making book. There is no lock-up period, so you can withdraw at any time.",
  },
  {
    question: "HLP vault vs HYPE staking — which is better?",
    answer:
      "HLP is denominated in USDC and earns yield from market-making (variable, 10-30% APY). HYPE staking earns fixed validator rewards (5-10% APY) but requires holding HYPE. HLP has no lock-up; HYPE staking has an unbonding period. Choose HLP for USDC yield without token exposure, HYPE staking if you're already long HYPE.",
  },
];

export default function HlpVaultGuidePage() {
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

      <H2 id="what-is-hlp">What Is the HLP Vault?</H2>
      <P>
        The <InlineLink href="/projects/hlp">HLP (Hyperliquidity Provider)</InlineLink> vault is
        Hyperliquid&apos;s protocol-owned, community-funded liquidity vault. It is the single largest
        source of liquidity on the Hyperliquid order book. When you deposit USDC into HLP, your capital
        joins a collective pool that acts as the market maker and liquidation backstop across every
        perpetual market on the platform — currently 229 markets processing over $3.4 billion in daily
        volume.
      </P>
      <P>
        Unlike user-created vaults on Hyperliquid (which charge management fees and are run by
        individual traders), HLP is operated by the protocol itself. There is no management fee, no
        performance fee, and no middleman. 100% of the vault&apos;s profits flow directly to
        depositors, proportional to their share of the pool. This makes HLP one of the most transparent
        yield products in DeFi.
      </P>

      <H2 id="how-hlp-generates-yield">How HLP Generates Yield</H2>
      <P>
        HLP earns returns from four distinct revenue streams, all generated by Hyperliquid&apos;s
        trading activity:
      </P>
      <P>
        <strong>Market-making spreads.</strong> HLP places limit orders on both sides of the order book
        (bids and asks) across all 229 perpetual markets. The difference between the buy and sell price
        — the spread — is captured as profit on every filled order. Higher trading volume means more
        spread capture.
      </P>
      <P>
        <strong>Taker fee share.</strong> HLP receives a portion of the taker fees paid on every trade
        executed on Hyperliquid. With billions in daily volume, even a small fee share generates
        significant revenue.
      </P>
      <P>
        <strong>Liquidation profits.</strong> When leveraged traders get liquidated, HLP takes over
        their positions at favorable prices. In volatile markets, liquidation volume can spike
        dramatically, producing outsized returns for the vault.
      </P>
      <P>
        <strong>Funding rate capture.</strong> Perpetual futures use funding rates to keep prices
        aligned with spot. When HLP holds positions that earn positive funding (which happens
        naturally as part of market-making), it captures that yield as additional revenue.
      </P>

      <H2 id="hlp-performance">HLP Performance</H2>
      <P>
        Since launch, HLP has accumulated over $43 million in all-time profit with $373M+ in total
        value locked. The vault has operated continuously through multiple market cycles — including
        sharp drawdowns and extreme volatility events — and has remained profitable on a cumulative
        basis throughout.
      </P>
      <P>
        It&apos;s worth noting that HLP can experience short-term drawdowns. During sudden market
        moves, the vault&apos;s market-making positions can temporarily move against it. These
        drawdowns have historically been recovered within days to weeks as normal trading activity
        resumes. The vault&apos;s maximum historical drawdown was approximately 4-5% of TVL.
      </P>

      <H2 id="how-to-deposit">How to Deposit into HLP</H2>
      <P>
        Depositing into HLP is straightforward. Connect your wallet on{" "}
        <strong>app.hyperliquid.xyz</strong>, navigate to the <strong>Vaults</strong> section, and
        select the HLP vault. Enter the amount of USDC you want to deposit and confirm the transaction.
        You receive vault shares representing your proportional ownership of the pool.
      </P>
      <P>
        There is no minimum deposit and no lock-up period. You can withdraw your USDC at any time by
        redeeming your vault shares. Withdrawals are processed on-chain and typically settle within
        seconds. Your share of profits (or losses) is calculated continuously based on your proportion
        of the total pool.
      </P>

      <H2 id="step-by-step-deposit">Step-by-Step: Depositing into HLP</H2>
      <P>
        If you are new to Hyperliquid and want a detailed walkthrough of the entire deposit process
        from start to finish, this section covers every step — including getting funds onto the
        platform in the first place.
      </P>
      <P>
        <strong>Step 1: Bridge USDC to Hyperliquid.</strong> If your funds are on another chain
        (most commonly Arbitrum), go to the deposit page on app.hyperliquid.xyz. Connect your wallet,
        select the amount of USDC you want to bridge, and confirm the transaction. The bridge from
        Arbitrum typically costs approximately $1 in gas and takes 1-2 minutes to complete. You can
        also use third-party bridges like{" "}
        <InlineLink href="/projects/debridge">deBridge</InlineLink> or{" "}
        <InlineLink href="/projects/across-protocol">Across Protocol</InlineLink> to bridge from
        other chains including Ethereum mainnet, Optimism, and Base.
      </P>
      <P>
        <strong>Step 2: Navigate to the Vaults tab.</strong> Once your USDC is on Hyperliquid, click
        on the &quot;Vaults&quot; tab in the main navigation. This shows all available vaults on the
        platform, including both the protocol-operated HLP vault and user-created vaults run by
        individual traders.
      </P>
      <P>
        <strong>Step 3: Find the HLP vault.</strong> HLP is the top-listed and featured vault on the
        page. It is prominently displayed with its total TVL, all-time PnL, and current APY
        estimate. You cannot miss it — it is the largest vault by a significant margin.
      </P>
      <P>
        <strong>Step 4: Enter your deposit amount.</strong> Click on the HLP vault to open the deposit
        interface. Enter the amount of USDC you want to deposit. There is no minimum deposit
        requirement, so you can start with any amount. The interface will show you the estimated
        share of the vault your deposit represents.
      </P>
      <P>
        <strong>Step 5: Confirm the deposit.</strong> Click &quot;Deposit&quot; and confirm the
        transaction in your wallet. The deposit is processed on-chain and typically settles within
        seconds. Once confirmed, you will see your vault position update in real time.
      </P>
      <P>
        <strong>Step 6: Receive vault shares.</strong> Upon deposit, you receive vault shares that are
        proportional to the total pool size at the time of your deposit. These shares represent your
        ownership stake in the HLP vault. As the vault generates profits (or incurs losses), the
        value of your shares changes accordingly.
      </P>
      <P>
        <strong>Step 7: Track your position.</strong> You can monitor your HLP position at any time
        by navigating to Portfolio and then Vaults in the Hyperliquid app. This view shows your
        current deposit value, cumulative PnL, share of the vault, and a history of deposits and
        withdrawals. Your returns are calculated continuously — there is no need to &quot;claim&quot;
        rewards separately, as they are automatically reflected in your vault share value.
      </P>

      <H2 id="performance-history">HLP Performance History</H2>
      <P>
        Since its inception, HLP has generated over $43 million in cumulative profits for depositors.
        The vault has operated through multiple distinct market environments, and its performance
        pattern reveals important characteristics that prospective depositors should understand.
      </P>
      <P>
        <strong>Best performing periods.</strong> HLP generally performs best during high-volatility
        market conditions. When markets experience sharp moves — whether up or down — trading volume
        spikes, liquidation cascades occur, and bid-ask spreads widen. All three of these dynamics
        benefit HLP&apos;s market-making strategy. Periods with significant liquidation volume have
        historically produced the highest returns, as HLP acquires liquidated positions at favorable
        prices and profits as markets stabilize. The vault&apos;s best months have coincided with
        major market events: large BTC sell-offs, memecoin volatility surges, and periods of
        elevated funding rates.
      </P>
      <P>
        <strong>Worst performing periods.</strong> HLP struggles most during sudden, one-directional
        moves where the vault&apos;s market-making positions get caught on the wrong side. If BTC
        drops 15% in an hour, HLP&apos;s buy-side limit orders get filled while sell-side orders
        do not, leaving the vault with a growing long position in a falling market. The vault can
        also underperform during extended low-volatility periods where trading volume declines,
        spreads compress, and there are few liquidations to profit from. These quiet periods produce
        lower but usually still positive returns.
      </P>
      <P>
        <strong>Drawdown profile.</strong> The maximum historical drawdown for HLP has been
        approximately 4-5% of TVL. Drawdowns have typically been recovered within days to weeks as
        normal market activity resumes. It is important to understand that drawdowns are an inherent
        part of market-making — they are not bugs but expected consequences of providing liquidity in
        volatile markets. Depositors should be prepared for temporary unrealized losses and avoid
        panic withdrawing during drawdown periods, as doing so locks in losses that would likely
        have been recovered.
      </P>
      <P>
        <strong>Return composition.</strong> HLP&apos;s returns are not evenly distributed across its
        four revenue streams. Market-making spreads and taker fee shares provide relatively stable,
        predictable income. Liquidation profits are lumpy — they spike during volatile events and
        are minimal during quiet periods. Funding rate capture varies based on market sentiment and
        positioning. The blend of these revenue streams creates a return profile that is generally
        consistent but with periodic spikes during high-volatility events.
      </P>

      <H2 id="jelly-incident">The JELLY Incident (March 2025)</H2>
      <P>
        In March 2025, the HLP vault faced its most significant stress test when a whale attempted
        to exploit the vault through a coordinated attack involving the JELLY token. This incident
        is worth examining in detail because it reveals both the strengths and vulnerabilities of the
        HLP system — and the governance response that followed.
      </P>
      <P>
        <strong>What happened.</strong> A whale built a massive short position in JELLY (a low-
        liquidity memecoin listed on Hyperliquid) and then aggressively pumped the token&apos;s price
        on external markets. As the JELLY price spiked, the whale&apos;s short position moved deeply
        into the red and was eventually liquidated. HLP, as the liquidation backstop, was forced to
        take on the other side of the position — inheriting a large long exposure to JELLY at
        inflated prices. The vault suffered a significant temporary loss as the manipulated price
        diverged from the token&apos;s fair value.
      </P>
      <P>
        <strong>The governance response.</strong> Hyperliquid&apos;s validators voted to delist the
        JELLY perpetual market and settle all open positions at a price determined to be fair based on
        external market data. This intervention effectively stopped the attack, prevented further
        losses to HLP, and allowed the vault to close its position at a reasonable price. HLP was
        ultimately made whole — depositors did not suffer a permanent loss from the incident.
      </P>
      <P>
        <strong>What it revealed (positive).</strong> The JELLY incident demonstrated that
        Hyperliquid&apos;s governance can respond quickly and decisively to active attacks. The
        validator set identified the manipulation, coordinated a response, and executed a market
        delisting within hours. This rapid response likely prevented millions in additional losses
        for HLP depositors and showed that the system has circuit breakers, even if they are
        human-operated rather than automated.
      </P>
      <P>
        <strong>What it revealed (concerning).</strong> The same response also highlighted
        centralization risk. The fact that 25 validators can vote to delist a market and force-settle
        positions at an arbitrary price is a powerful capability that cuts both ways. While it was used
        benevolently in this case, it demonstrates that Hyperliquid&apos;s markets are ultimately
        governed by a small group of validators who can intervene in trading activity. This is a
        meaningful departure from the &quot;code is law&quot; ethos of fully decentralized protocols.
      </P>
      <P>
        <strong>Aftermath and improvements.</strong> Following the JELLY incident, Hyperliquid
        implemented improved risk parameters and position limits specifically designed to prevent
        similar attacks. These included tighter open interest limits on low-liquidity markets,
        improved liquidation mechanics for concentrated positions, and better monitoring of
        cross-market manipulation patterns. The incident served as a valuable stress test that
        made the system more robust going forward.
      </P>

      <H2 id="hlp-apy">HLP APY</H2>
      <P>
        HLP returns are variable — there is no fixed or guaranteed APY. Historical annualized returns
        have ranged from approximately 10% in quiet markets to 30%+ during periods of high volatility
        and heavy trading volume. The key drivers of higher returns are increased trading volume
        (more spread capture and fee revenue), market volatility (more liquidations), and favorable
        funding rate environments.
      </P>
      <P>
        Returns are denominated in USDC, meaning depositors have no exposure to HYPE token price
        fluctuations. This makes HLP attractive for users who want DeFi yield without taking on
        directional crypto risk. Note that past performance does not guarantee future returns —
        extended periods of low volatility can produce below-average yields.
      </P>

      <H2 id="hlp-risks">Risks</H2>
      <P>
        <strong>Market risk.</strong> HLP&apos;s market-making positions can move against the vault
        during extreme price swings. Large, sudden moves in major assets (BTC, ETH) can cause
        temporary drawdowns. The vault has always recovered historically, but past resilience does not
        guarantee future performance.
      </P>
      <P>
        <strong>Concentration risk.</strong> A single large trader taking an outsized position against
        HLP could cause a meaningful drawdown. Hyperliquid mitigates this through position limits and
        risk parameters, but the risk is not zero.
      </P>
      <P>
        <strong>Smart contract risk.</strong> HLP operates entirely on-chain through Hyperliquid&apos;s
        native vault infrastructure. While this is more transparent than off-chain alternatives, any
        bugs in the vault logic could theoretically affect depositor funds. The vault code has been
        operational since 2023 without incident.
      </P>
      <P>
        <strong>Opportunity cost.</strong> USDC deposited in HLP could alternatively be used for lending
        on protocols like <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> or{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink>, which may offer
        different risk-return profiles depending on market conditions.
      </P>

      <H2 id="tax-treatment">Tax Treatment of HLP Returns</H2>
      <P>
        Understanding the tax implications of HLP vault returns is important for depositors,
        particularly those in the United States. While this section provides general guidance,
        it is not tax advice — always consult a qualified tax professional for your specific
        situation.
      </P>
      <P>
        <strong>Classification of returns.</strong> HLP vault returns are generated from market-making
        activity — placing and filling orders, capturing spreads, and liquidating positions. In most
        tax jurisdictions, income from market-making activity is classified as ordinary income rather
        than capital gains. This distinction matters because ordinary income is typically taxed at
        higher rates than long-term capital gains. In the United States, this means HLP returns would
        likely be subject to your marginal income tax rate (up to 37% for federal) rather than the
        preferential long-term capital gains rate (0-20%).
      </P>
      <P>
        <strong>Tracking deposits and withdrawals.</strong> Every deposit into and withdrawal from the
        HLP vault should be recorded with timestamps and USDC amounts. Your cost basis for each
        withdrawal is calculated as your initial deposit plus any accumulated returns up to that
        point. Since HLP returns are continuous (reflected in vault share value) rather than discrete
        (paid as separate transactions), tracking can be more complex than simple staking rewards.
      </P>
      <P>
        <strong>Record-keeping best practices.</strong> Maintain a spreadsheet or use crypto tax
        software that records the date and amount of each deposit, the date and amount of each
        withdrawal, the change in vault share value over time, and any screenshots or transaction
        hashes that document your positions. The Hyperliquid app provides a transaction history in
        the Portfolio section, but exporting this data for tax purposes may require manual work.
      </P>
      <P>
        <strong>International considerations.</strong> Tax treatment of DeFi yield varies
        significantly by jurisdiction. In some countries, DeFi returns may be classified as investment
        income, while in others they may be treated as business income. The lack of clear regulatory
        guidance in many jurisdictions makes it especially important to consult a tax professional
        who understands both your local tax law and the mechanics of DeFi protocols.
      </P>

      <H2 id="hlp-vs-staking">HLP vs HYPE Staking</H2>
      <ComparisonTable
        headers={["", "HLP Vault", "HYPE Staking"]}
        rows={[
          ["Deposit asset", "USDC", "HYPE token"],
          ["Returns", "Variable (10-30% APY)", "Fixed validator APY (5-10%)"],
          ["Return source", "Market-making, fees, liquidations", "Consensus rewards"],
          ["Risk type", "Market risk (drawdowns)", "Slashing risk (minimal)"],
          ["Lock-up", "None — withdraw anytime", "Unbonding period required"],
          ["Token exposure", "No HYPE price exposure", "Full HYPE price exposure"],
          ["Composability", "Not composable (vault shares)", "Liquid via kHYPE/stHYPE"],
        ]}
      />
      <P>
        The two strategies serve different purposes. HLP is ideal for USDC holders who want yield
        without token price exposure. HYPE staking (especially via liquid staking with{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> or{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink>) is better for users who are
        already holding HYPE long-term and want to earn additional rewards while maintaining DeFi
        composability. For a deeper look at all staking options, see our{" "}
        <InlineLink href="/learn/hyperliquid-staking-guide">Hyperliquid Staking Guide</InlineLink>.
      </P>

      <H2 id="hlp-vs-staking-deep">HLP vs HYPE Staking: Detailed Comparison</H2>
      <P>
        The basic comparison above covers the high-level differences, but choosing between HLP, direct
        staking, and liquid staking requires a deeper understanding of each option&apos;s risk-return
        profile and how they fit into different investment strategies.
      </P>
      <ComparisonTable
        headers={["", "HLP Vault", "Direct HYPE Staking", "Liquid Staking (kHYPE/stHYPE)"]}
        rows={[
          ["Deposit asset", "USDC", "HYPE", "HYPE (receive kHYPE or stHYPE)"],
          ["Typical APY", "10-30% (variable)", "5-10% (consensus)", "5-10% + DeFi yield"],
          ["Yield source", "Market-making activity", "Validator consensus rewards", "Consensus rewards + DeFi composability"],
          ["Risk profile", "Market risk (drawdowns possible)", "Minimal (small slashing risk)", "Smart contract risk + validator risk"],
          ["Lock-up period", "None — instant withdrawal", "7-day unbonding period", "Instant via DEX (sell kHYPE/stHYPE)"],
          ["DeFi composability", "Not composable", "Not composable", "Fully composable (use as collateral, LP, etc.)"],
          ["Token price exposure", "None (USDC-denominated)", "Full HYPE exposure", "Full HYPE exposure"],
        ]}
      />
      <P>
        <strong>When to choose HLP.</strong> HLP is the right choice if you hold USDC and want to
        earn yield without taking on directional crypto exposure. It is particularly attractive during
        volatile market periods when the vault&apos;s market-making activity generates higher returns.
        HLP is also ideal for users who want maximum flexibility — there is no lock-up period, so
        you can withdraw at any time. The tradeoff is market risk: your USDC deposit can temporarily
        decrease in value during sharp market moves, and there is no guarantee of positive returns in
        any given period.
      </P>
      <P>
        <strong>When to choose direct staking.</strong> Direct HYPE staking is the simplest and
        lowest-risk option for HYPE holders who believe in the token&apos;s long-term value. You earn
        consensus rewards (5-10% APY) with minimal risk — the only downside is a 7-day unbonding
        period when you want to unstake. Direct staking is best for long-term holders who do not need
        immediate liquidity and want the most straightforward way to earn yield on their HYPE
        position.
      </P>
      <P>
        <strong>When to choose liquid staking.</strong> Liquid staking through{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> (kHYPE) or{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> (stHYPE) is the most
        capital-efficient option. You earn the same consensus rewards as direct staking, but your
        staked position is represented by a liquid token that can be used across HyperEVM DeFi. Use
        kHYPE as collateral on <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink>{" "}
        to mint feUSD, deposit it into <InlineLink href="/projects/hyperlend">HyperLend</InlineLink>{" "}
        to earn lending interest on top of staking rewards, or provide liquidity on{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> to earn DEX fees. The
        composability means you can stack multiple yield sources simultaneously. The tradeoff is
        additional smart contract risk — you are trusting the liquid staking protocol&apos;s smart
        contracts in addition to the base validator infrastructure.
      </P>
      <P>
        <strong>Combining strategies.</strong> Many sophisticated Hyperliquid users combine multiple
        strategies to diversify their yield exposure. A common portfolio allocation might be: 40% of
        USDC holdings in HLP for market-neutral yield, 30% of HYPE holdings in liquid staking for
        composable staking rewards, and 30% of HYPE in direct staking for maximum simplicity and
        minimum risk. The right allocation depends on your risk tolerance, time horizon, and
        conviction in the HYPE token&apos;s long-term value.
      </P>

      <H2 id="who-is-hlp-for">Who Is HLP For?</H2>
      <P>
        HLP is best suited for users who hold USDC and want passive, market-neutral yield on
        Hyperliquid without managing active trading strategies. It&apos;s effectively a way to earn
        from Hyperliquid&apos;s trading activity — you profit from the exchange being busy, regardless
        of whether markets go up or down.
      </P>
      <P>
        If you&apos;re already holding HYPE and believe in the token&apos;s long-term value,{" "}
        <InlineLink href="/learn/hype-token-guide">HYPE staking</InlineLink> may be a better fit. If
        you want to understand the full picture of yield opportunities on Hyperliquid, start with our{" "}
        <InlineLink href="/learn/what-is-hyperliquid">What Is Hyperliquid?</InlineLink> overview.
      </P>

      <CTA href="/projects/hlp">View HLP on perp.wiki &rarr;</CTA>
    </LearnLayout>
  );
}
