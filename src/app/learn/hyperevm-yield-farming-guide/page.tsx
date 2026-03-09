import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SLUG = "hyperevm-yield-farming-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "HyperEVM Yield Farming: Complete Strategy Guide 2026 | perp.wiki",
  description:
    "In-depth HyperEVM yield farming strategies: HLP vault, liquid staking, lending, LP strategies, delta-neutral farming, and leveraged looping with risk analysis.",
  openGraph: {
    title: "HyperEVM Yield Farming: Complete Strategy Guide",
    description:
      "In-depth HyperEVM yield farming strategies: HLP vault, liquid staking, lending, LP strategies, delta-neutral farming, and leveraged looping with risk analysis.",
  },
};

const TOC = [
  { id: "yield-landscape", title: "The Yield Landscape" },
  { id: "hlp-vault", title: "Strategy 1: HLP Vault" },
  { id: "liquid-staking-yield", title: "Strategy 2: Liquid Staking + DeFi" },
  { id: "lending-yields", title: "Strategy 3: Lending & Borrowing" },
  { id: "lp-strategies", title: "Strategy 4: Liquidity Provision" },
  { id: "delta-neutral", title: "Strategy 5: Delta-Neutral Farming" },
  { id: "looping", title: "Strategy 6: Leveraged Looping" },
  { id: "risk-matrix", title: "Risk/Reward Matrix" },
  { id: "getting-started", title: "Getting Started Checklist" },
  { id: "risks-warnings", title: "Risk Warnings" },
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

async function fetchMarketOverview(): Promise<{ totalVol24h: number | null; hypePrice: number | null }> {
  try {
    const [metaRes, midsRes] = await Promise.all([
      fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs" }),
        next: { revalidate: 120 },
      }),
      fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "allMids" }),
        next: { revalidate: 120 },
      }),
    ]);
    const metaData = await metaRes.json();
    const midsData = await midsRes.json();

    // Sum 24h volume across all assets
    const assetCtxs = metaData?.[1] ?? [];
    let totalVol = 0;
    for (const ctx of assetCtxs) {
      const vol = parseFloat(ctx?.dayNtlVlm);
      if (!isNaN(vol)) totalVol += vol;
    }

    const hypePrice = parseFloat(midsData?.["HYPE"]);

    return {
      totalVol24h: totalVol > 0 ? totalVol : null,
      hypePrice: isNaN(hypePrice) ? null : hypePrice,
    };
  } catch {
    return { totalVol24h: null, hypePrice: null };
  }
}

async function LiveEcosystemData() {
  const { totalVol24h, hypePrice } = await fetchMarketOverview();
  const isLive = totalVol24h !== null || hypePrice !== null;

  const formatVol = (v: number) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
    return `$${v.toLocaleString()}`;
  };

  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-1">
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        {isLive && <LiveDot />}
        <span className="text-xs font-medium text-[var(--hw-text-dim)]">
          {isLive ? "Live Ecosystem Data" : "Estimated Data (API unavailable)"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
        <div className="px-4 py-3">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">Ecosystem TVL</div>
          <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)]">
            ~$1.8B
          </div>
          <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">across all HyperEVM protocols</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">24h Trading Volume</div>
          <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)]">
            {totalVol24h ? formatVol(totalVol24h) : "~$4B"}
          </div>
          <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">{totalVol24h ? "via Hyperliquid API" : "fallback estimate"}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-xs text-[var(--hw-text-dim)] mb-1">HYPE Price</div>
          <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)]">
            ${hypePrice ? hypePrice.toFixed(2) : "24.50"}
          </div>
          <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">{hypePrice ? "live" : "fallback estimate"}</div>
        </div>
      </div>
    </div>
  );
}

function RiskRewardMatrix() {
  const strategies = [
    {
      name: "HLP Vault",
      apy: "10-17%",
      risk: "Medium" as const,
      description: "Passive market-making vault earning from trading fees, funding, and liquidations.",
    },
    {
      name: "Native Staking",
      apy: "~2.25%",
      risk: "Low" as const,
      description: "Direct validator delegation with protocol-level security. 7-day unstaking lock.",
    },
    {
      name: "Liquid Staking",
      apy: "~2.1% + DeFi",
      risk: "Low-Medium" as const,
      description: "Stake via kHYPE/stHYPE and maintain DeFi composability for layered yields.",
    },
    {
      name: "Lending (Supply)",
      apy: "3-8%",
      risk: "Medium" as const,
      description: "Supply USDC or HYPE on HyperLend/Morpho for variable interest income.",
    },
    {
      name: "Liquidity Provision",
      apy: "5-20%",
      risk: "Medium" as const,
      description: "AMM pool LP on KittenSwap/HyperSwap. Higher fees but IL exposure.",
    },
    {
      name: "Delta-Neutral Farming",
      apy: "5-30%",
      risk: "Medium" as const,
      description: "Spot long + perp short to harvest funding rates with zero price exposure.",
    },
    {
      name: "Leveraged Looping",
      apy: "5-15% (leveraged)",
      risk: "High" as const,
      description: "Recursive borrow-deposit cycles amplifying staking yield and liquidation risk.",
    },
  ];

  const riskConfig = {
    Low: { color: "bg-emerald-500", barWidth: "w-1/5", textColor: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    "Low-Medium": { color: "bg-emerald-400", barWidth: "w-2/5", textColor: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    Medium: { color: "bg-amber-500", barWidth: "w-3/5", textColor: "text-amber-400", bgColor: "bg-amber-500/10" },
    High: { color: "bg-red-500", barWidth: "w-full", textColor: "text-red-400", bgColor: "bg-red-500/10" },
  };

  return (
    <div className="my-8">
      <div className="rounded border border-[var(--hw-border)] bg-[var(--hw-surface)]">
        <div className="border-b border-[var(--hw-border)] px-5 py-3">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
            Risk / Reward Matrix
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((s) => {
            const rc = riskConfig[s.risk];
            return (
              <div key={s.name} className="border-b border-r border-[var(--hw-border)] p-4 last:border-b-0">
                {/* Risk color bar */}
                <div className="mb-3 h-1 w-full rounded-full bg-[var(--hw-surface-raised)]">
                  <div className={`h-1 rounded-full ${rc.color} ${rc.barWidth}`} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
                    {s.name}
                  </span>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${rc.textColor} ${rc.bgColor}`}>
                    {s.risk}
                  </span>
                </div>
                <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-green)] mb-1">
                  {s.apy}
                </div>
                <p className="text-xs text-[var(--hw-text-dim)] leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--hw-text-dim)]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Low Risk</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Medium Risk</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> High Risk</span>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function HyperevmYieldFarmingGuidePage() {
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

      <ArticleMeta difficulty="Intermediate" />

      <H2 id="yield-landscape">The HyperEVM Yield Landscape</H2>

      <LiveEcosystemData />

      <P>
        HyperEVM has rapidly evolved from an empty smart contract layer into one of the most
        productive yield environments in DeFi. With over $1.8 billion in total value locked
        across its ecosystem, the range of yield opportunities spans from simple, passive
        strategies to complex, multi-layered approaches that can generate double-digit returns
        — each with its own risk profile.
      </P>
      <P>
        What makes HyperEVM particularly interesting for yield farming is its unique position
        at the intersection of two worlds. On one side, you have HyperCore — the native trading
        layer processing billions in daily perp volume, generating real trading fees and funding
        rate revenue. On the other side, you have a growing DeFi ecosystem of lending protocols,
        DEXs, and yield aggregators that can compose with each other and with HyperCore&apos;s
        liquidity. This composability creates yield opportunities that simply do not exist on
        other chains.
      </P>
      <P>
        This guide covers six distinct strategies, ordered from simplest to most complex. If
        you are new to DeFi, start with Strategy 1 (HLP Vault) or Strategy 2 (liquid staking)
        and work your way up as you gain experience. If you are an experienced DeFi user, the
        later strategies — delta-neutral farming and leveraged looping — will be more relevant.
      </P>

      <H2 id="hlp-vault">Strategy 1: HLP Vault</H2>
      <P>
        The <InlineLink href="/projects/hlp">HLP (Hyperliquidity Provider) vault</InlineLink>{" "}
        is the simplest and most battle-tested yield opportunity on Hyperliquid. You deposit
        USDC into the vault, and your capital is deployed across automated market-making
        strategies on HyperCore&apos;s perpetual markets. The vault earns revenue from three
        sources: the bid-ask spread on trades it fills, funding rate payments when positions
        are favorable, and liquidation proceeds when overleveraged traders get liquidated.
      </P>
      <P>
        Historically, HLP has delivered <strong>10-17% APY</strong>, though returns vary
        significantly based on market conditions. During high-volatility periods with lots of
        liquidations, returns can spike above 20%. During calm, low-volume periods, returns
        compress. The vault has also experienced drawdown periods where inventory losses
        temporarily exceeded trading profits — this happened during the March 2025 JELLY
        incident, though the vault recovered fully.
      </P>
      <P>
        The beauty of HLP is its simplicity. You deposit USDC, the vault handles everything,
        and you can withdraw at any time (subject to available liquidity). There is no position
        management, no rebalancing, and no gas fees for the deposit itself. The main risk is
        <strong> inventory risk</strong> — since the vault holds perpetual positions as part of
        its market-making activity, adverse price movements can temporarily reduce the vault&apos;s
        NAV. Over time, the trading edge has historically compensated for these drawdowns, but
        past performance does not guarantee future results.
      </P>
      <P>
        HLP is best suited for users who want passive, USDC-denominated yield without active
        management. It is effectively a bet on the continued growth of Hyperliquid&apos;s
        trading volume — more volume means more fee revenue for the vault.
      </P>

      <H2 id="liquid-staking-yield">Strategy 2: Liquid Staking + DeFi</H2>
      <P>
        Liquid staking is the foundation of many HyperEVM yield strategies because it lets you
        earn staking rewards (~2.25% APY) while maintaining full DeFi composability. The basic
        approach: stake HYPE through{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> to receive kHYPE, then
        deploy that kHYPE into additional yield-generating protocols.
      </P>
      <P>
        The simplest version of this strategy is to stake HYPE for kHYPE and hold it. The
        kHYPE token auto-compounds staking rewards, so your balance grows over time without any
        action. This is equivalent to native staking but without the 7-day unstaking lockup.
      </P>
      <P>
        The more powerful version layers additional yield on top. For example: deposit kHYPE
        into <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> as collateral.
        You continue earning ~2.25% from staking rewards. On top of that, HyperLend may offer
        additional supply APY for kHYPE deposits. If you then borrow USDC against the kHYPE
        and deploy that USDC into HLP or another yield source, you are earning three layers of
        yield on the same underlying capital.
      </P>
      <P>
        This multi-layer approach is where the real returns emerge, but each layer adds
        complexity and risk. The kHYPE staking yield is relatively safe. Using it as collateral
        introduces smart contract and liquidation risk. Borrowing against it and redeploying
        capital adds leverage risk. Stack these deliberately and understand the full risk
        profile at each layer.
      </P>

      <H2 id="lending-yields">Strategy 3: Lending &amp; Borrowing</H2>
      <P>
        Lending protocols on HyperEVM offer straightforward yield opportunities for users who
        want to earn interest on idle assets. The major options include:
      </P>
      <P>
        <strong>HyperLend</strong> — the largest lending protocol on HyperEVM, offering
        variable-rate supply and borrow markets for USDC, HYPE, kHYPE, and other assets.
        Supply APY for USDC typically ranges from 3-8% depending on utilization, while HYPE
        supply rates vary with demand. HyperLend uses a standard pool-based lending model
        similar to Aave, where interest rates adjust dynamically based on supply and demand.
        <InlineLink href="/projects/hyperlend"> Learn more about HyperLend</InlineLink>.
      </P>
      <P>
        <strong>Morpho</strong> — offers isolated lending markets on HyperEVM, allowing for
        more customized risk parameters than pool-based protocols. Morpho&apos;s isolated
        market model means that risk is contained within each market — a bad debt event in one
        market does not affect others. This is particularly useful for lending against more
        volatile or newer assets where the risk profile is less established.
        <InlineLink href="/projects/morpho"> Learn more about Morpho</InlineLink>.
      </P>
      <P>
        <strong>Felix Protocol</strong> — takes a different approach entirely. Felix is a CDP
        (Collateralized Debt Position) protocol that lets users mint feUSD, a dollar-pegged
        stablecoin, against their HYPE collateral. This is not lending in the traditional sense
        — you are minting new stablecoins rather than borrowing existing ones. The advantage is
        that there is no utilization-dependent interest rate; the cost of maintaining a CDP is
        a fixed stability fee. The risk is liquidation if your collateral ratio drops below the
        minimum threshold.
        <InlineLink href="/projects/felix-protocol"> Learn more about Felix Protocol</InlineLink>.
      </P>
      <P>
        For pure lenders (those who simply want to supply assets and earn interest), HyperLend
        is the simplest option. For borrowers who want to unlock capital from their HYPE
        holdings, Felix&apos;s CDP model may offer better rates during periods of high borrow
        demand on HyperLend. Compare rates across all three platforms before committing capital.
      </P>

      <H2 id="lp-strategies">Strategy 4: Liquidity Provision</H2>
      <P>
        Providing liquidity on HyperEVM DEXs is another avenue for earning yield. The major
        venues are{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> and{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink>, both of which
        operate AMM (Automated Market Maker) pools where liquidity providers earn a share
        of swap fees.
      </P>
      <P>
        The mechanics are standard: you deposit two tokens in a pair (for example, HYPE/USDC)
        into a liquidity pool. When traders swap between these tokens, they pay a fee (typically
        0.25-0.30%) that is distributed pro-rata to liquidity providers. Your share of the
        fees depends on what percentage of the pool&apos;s total liquidity you represent.
      </P>
      <P>
        The primary risk of liquidity provision is <strong>impermanent loss (IL)</strong> — the
        phenomenon where your LP position underperforms simply holding both tokens when their
        relative price changes significantly. In a HYPE/USDC pool, if HYPE doubles in price,
        your LP position will be worth less than if you had just held the HYPE and USDC
        separately. Swap fees may or may not compensate for this loss, depending on trading
        volume and the magnitude of the price movement.
      </P>
      <P>
        A particularly interesting LP strategy on HyperEVM is providing liquidity in kHYPE/HYPE
        pools. Because kHYPE and HYPE are tightly correlated (kHYPE is just staked HYPE),
        impermanent loss in this pair is minimal. You earn swap fees from traders moving between
        staked and unstaked HYPE positions while taking on very little IL risk. The tradeoff is
        that these pools typically have lower volume and therefore lower fee revenue.
      </P>

      <H2 id="delta-neutral">Strategy 5: Delta-Neutral Funding Rate Farming</H2>
      <P>
        Delta-neutral farming is one of the more sophisticated strategies available on
        Hyperliquid, and it takes advantage of a feature unique to perpetual futures markets:
        <strong> funding rates</strong>. When the perpetual price trades above the spot index,
        long positions pay short positions a funding rate (and vice versa). See our{" "}
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">
          funding rates guide
        </InlineLink>{" "}
        for a detailed explanation.
      </P>
      <P>
        The basic strategy: buy an asset in the spot market (or hold it) and simultaneously
        open a short perpetual position of equal size. Your net exposure to the asset&apos;s
        price is zero (hence &quot;delta-neutral&quot;) — if the price goes up, your spot
        position gains and your short position loses by the same amount. What you earn is the
        funding rate payment from long holders, which tends to be positive during bullish
        markets when the perp price trades above spot.
      </P>
      <P>
        On Hyperliquid, funding rates are calculated every 8 hours. During bullish market
        conditions, annualized funding rates on major assets like BTC and ETH can range from
        10-30% or higher. Even during neutral markets, rates tend to average 5-10% annualized.
        However, funding rates can also turn negative, in which case your delta-neutral position
        would be paying rather than receiving.
      </P>
      <P>
        <InlineLink href="/projects/liminal">Liminal</InlineLink> is a protocol on HyperEVM
        that automates delta-neutral funding rate strategies, handling the position management,
        rebalancing, and funding rate collection on your behalf. For users who want exposure
        to funding rate yields without manually managing positions, Liminal offers a more
        hands-off approach.
      </P>

      <H2 id="looping">Strategy 6: Leveraged Looping</H2>
      <P>
        Leveraged looping is the most aggressive yield strategy on HyperEVM and should only be
        attempted by experienced DeFi users who fully understand liquidation mechanics. The
        concept: deposit collateral into a lending protocol, borrow against it, redeposit the
        borrowed funds as additional collateral, and repeat — each loop amplifying your
        effective yield exposure but also amplifying your liquidation risk.
      </P>
      <P>
        A concrete example: deposit $10,000 worth of kHYPE into HyperLend. At a 70% LTV
        (loan-to-value) ratio, you can borrow $7,000 worth of HYPE. Stake that HYPE for more
        kHYPE and redeposit it. Now you have $17,000 in collateral earning staking rewards on
        $10,000 of original capital — effectively 1.7x leverage on your staking yield. You
        could loop again, reaching ~2.4x leverage, and so on.
      </P>
      <P>
        The risk is clear: if HYPE drops in price, your collateral value decreases while your
        debt remains constant. At a certain threshold (determined by the protocol&apos;s
        liquidation ratio), your position gets liquidated, and you lose a portion or all of
        your collateral. The more loops you execute, the thinner your margin of safety and the
        smaller the price drop needed to trigger liquidation.
      </P>
      <P>
        HypurrFi is a protocol that facilitates leveraged looping on HyperEVM, automating the
        deposit-borrow-redeposit cycle and providing tools to monitor your health factor. Even
        with automation, the fundamental risk remains: leveraged looping turns a safe 2.25%
        staking yield into a higher-return, higher-risk position that can result in significant
        losses during market downturns.
      </P>

      <H2 id="risk-matrix">Strategy Risk/Reward Matrix</H2>
      <P>
        Each strategy carries a different balance of return potential and risk exposure. The
        matrix below provides a visual summary — green indicates lower risk, amber is medium,
        and red signals higher risk of capital loss.
      </P>

      <RiskRewardMatrix />

      <P>
        These APY figures are estimates based on current market conditions and historical
        performance. Actual returns can vary significantly. Higher-yielding strategies generally
        carry more risk of capital loss. No yield in DeFi is guaranteed, and past returns do
        not predict future performance.
      </P>

      <H2 id="getting-started">Getting Started Checklist</H2>
      <P>
        If you are ready to start earning yield on HyperEVM, here is a recommended progression
        for new users:
      </P>
      <P>
        <strong>Step 1: Bridge USDC.</strong> Deposit USDC from Arbitrum (or another chain
        via a third-party bridge) to your Hyperliquid account. The minimum deposit is 5 USDC,
        but you will want more than that to meaningfully participate in yield strategies.
        See our{" "}
        <InlineLink href="/learn/how-to-bridge-to-hyperliquid">bridging guide</InlineLink>{" "}
        for step-by-step instructions.
      </P>
      <P>
        <strong>Step 2: Start simple.</strong> Deposit a portion of your USDC into the HLP
        vault to earn passive yield from market making. Alternatively, buy HYPE and stake it
        through Kinetiq for kHYPE. Both of these are low-complexity, low-barrier entry points.
      </P>
      <P>
        <strong>Step 3: Explore lending.</strong> Once you are comfortable with the basics,
        try supplying assets on HyperLend or Morpho. Start with USDC supply for the lowest
        risk, then experiment with supplying kHYPE or other assets.
      </P>
      <P>
        <strong>Step 4: Graduate to advanced strategies.</strong> Once you understand the
        mechanics and risks of each protocol, consider layered strategies: kHYPE as collateral
        for borrowing, LP positions on correlated pairs, or delta-neutral farming through
        Liminal. Only attempt leveraged looping once you are fully comfortable with liquidation
        mechanics and can actively monitor your positions.
      </P>

      <H2 id="risks-warnings">Risk Warnings</H2>
      <P>
        <strong>Smart contract risk.</strong> Every DeFi protocol is a set of smart contracts,
        and smart contracts can have bugs. Even audited protocols have been exploited. Diversify
        across protocols rather than concentrating all capital in one contract. Never deposit
        more than you can afford to lose.
      </P>
      <P>
        <strong>Liquidation risk.</strong> Any strategy involving borrowing carries liquidation
        risk. If the value of your collateral drops below the required ratio, your position
        will be partially or fully liquidated. Leveraged strategies amplify this risk
        significantly. Always maintain a healthy margin buffer above the liquidation threshold.
      </P>
      <P>
        <strong>Impermanent loss.</strong> Liquidity provision in AMM pools exposes you to
        impermanent loss when the relative prices of the paired tokens change. This is
        particularly relevant for volatile pairs like HYPE/USDC. Model your expected IL
        before depositing and ensure swap fee revenue is likely to compensate.
      </P>
      <P>
        <strong>Protocol risk.</strong> HyperEVM is a relatively new ecosystem. Many protocols
        are less than a year old and have not been tested through extreme market conditions.
        Newer protocols with less TVL and fewer audits carry higher risk. Stick to established
        protocols for the majority of your capital.
      </P>
      <P>
        <strong>Centralization risk.</strong> Hyperliquid&apos;s validator set is still
        relatively small and concentrated. While this has not caused issues to date, it is a
        factor to consider when evaluating the overall risk of the ecosystem. The chain&apos;s
        security ultimately depends on the integrity and performance of its validators.
      </P>

      <CTA href="/projects">Explore HyperEVM projects &rarr;</CTA>
    </LearnLayout>
  );
}
