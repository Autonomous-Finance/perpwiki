import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SLUG = "how-to-stake-hype";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Stake HYPE: Native & Liquid Staking Guide 2026",
  description:
    "Complete guide to staking HYPE — native staking for ~2.25% APY, liquid staking with kHYPE, stHYPE, and beHYPE, and strategies for maximizing yield.",
  openGraph: {
    title: "How to Stake HYPE: Native & Liquid Staking Guide",
    description:
      "Complete guide to staking HYPE — native staking for ~2.25% APY, liquid staking with kHYPE, stHYPE, and beHYPE, and strategies for maximizing yield.",
    type: "article",
  },
};

const TOC = [
  { id: "why-stake-hype", title: "Why Stake HYPE?" },
  { id: "native-staking", title: "Native Staking Step-by-Step" },
  { id: "liquid-staking-options", title: "Liquid Staking Options" },
  { id: "kinetiq-khype", title: "Kinetiq (kHYPE)" },
  { id: "stakedhype-sthype", title: "StakedHYPE (stHYPE)" },
  { id: "hyperbeat-behype", title: "HyperBeat (beHYPE)" },
  { id: "comparing-options", title: "Comparing Options" },
  { id: "staking-risks", title: "Risks & Considerations" },
  { id: "maximizing-yield", title: "Maximizing Yield" },
];

/* ── Inline server components ─────────────────────────────────── */

async function fetchHypePrice(): Promise<number | null> {
  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "allMids" }),
      next: { revalidate: 120 },
    });
    const data = await res.json();
    const price = parseFloat(data?.["HYPE"]);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
}

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

async function LiveStakingData() {
  const hypePrice = await fetchHypePrice();
  const displayPrice = hypePrice ?? 24.5; // static fallback
  const isLive = hypePrice !== null;
  const stakingApy = 2.25;
  const annualPer1000 = (1000 * stakingApy) / 100;
  const annualValuePer1000 = annualPer1000 * displayPrice;

  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-1">
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        {isLive && <LiveDot />}
        <span className="text-xs font-medium text-[var(--hw-text-dim)]">
          {isLive ? "Live Market Data" : "Estimated Data (API unavailable)"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
        {[
          {
            label: "Current HYPE Price",
            value: `$${displayPrice.toFixed(2)}`,
            sub: isLive ? "via Hyperliquid API" : "fallback estimate",
          },
          {
            label: "Est. Staking APY",
            value: `${stakingApy}%`,
            sub: "native staking reward",
          },
          {
            label: "Annual Reward / 1,000 HYPE",
            value: `${annualPer1000.toFixed(1)} HYPE`,
            sub: `~$${annualValuePer1000.toFixed(0)} at current price`,
          },
        ].map((card) => (
          <div key={card.label} className="px-4 py-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">{card.label}</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)]">
              {card.value}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionHelper() {
  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)]">
      <div className="border-b border-[var(--hw-border)] px-5 py-3">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
          Quick Decision Helper: Native vs Liquid Staking
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-px sm:grid-cols-2">
        {/* Native */}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/15 text-sm font-bold text-emerald-400">
              N
            </span>
            <span className="text-sm font-semibold text-[var(--hw-text)]">Native Staking</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--hw-text-muted)]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">+</span>
              Simpler — no smart contract risk beyond base layer
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">+</span>
              Rewards auto-compound into staked balance
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">-</span>
              7-day unstaking lockup period
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">-</span>
              Cannot use staked HYPE in DeFi
            </li>
          </ul>
          <div className="mt-3 rounded bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            Best for: Long-term holders who want simplicity
          </div>
        </div>
        {/* Liquid */}
        <div className="border-t border-[var(--hw-border)] p-5 sm:border-t-0 sm:border-l">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[var(--hw-green-subtle)] text-sm font-bold text-[var(--hw-green)]">
              L
            </span>
            <span className="text-sm font-semibold text-[var(--hw-text)]">Liquid Staking</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--hw-text-muted)]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">+</span>
              Fully composable — use LST in DeFi protocols
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">+</span>
              Instant exit — no lockup period
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">-</span>
              Smart contract risk from LST protocols
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">-</span>
              Slight fee (5-10% of rewards) taken by protocol
            </li>
          </ul>
          <div className="mt-3 rounded bg-[var(--hw-green-subtle)] px-3 py-2 text-xs text-[var(--hw-green)]">
            Best for: Active DeFi users who want composability
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function HowToStakeHypePage() {
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
            { "@type": "Question", name: "Why should I stake HYPE?", acceptedAnswer: { "@type": "Answer", text: "Staking HYPE earns approximately 2.25% APY in native staking rewards while contributing to Hyperliquid network security through validator delegation, with no smart-contract risk beyond the base layer." } },
            { "@type": "Question", name: "What is the difference between native staking and liquid staking for HYPE?", acceptedAnswer: { "@type": "Answer", text: "Native staking locks tokens with a 7-day unbonding period at ~2.25% APY but offers no DeFi composability. Liquid staking tokens like kHYPE, stHYPE, and beHYPE provide instant liquidity and DeFi use but charge 5–10% commission and introduce smart-contract risk." } },
            { "@type": "Question", name: "Which HYPE liquid staking protocol should I choose?", acceptedAnswer: { "@type": "Answer", text: "kHYPE (Kinetiq) is the most widely integrated with ~$1.7B TVL. stHYPE (StakedHYPE) is the second-largest option. beHYPE is suited for yield aggregation if you want to abstract complexity." } },
            { "@type": "Question", name: "What are the risks of staking HYPE?", acceptedAnswer: { "@type": "Answer", text: "Main risks include validator centralization, smart-contract risk for liquid staking tokens, slashing risk from validator misbehavior, and LST depeg risk during market stress." } },
            { "@type": "Question", name: "How can I maximize yield on staked HYPE?", acceptedAnswer: { "@type": "Answer", text: "Use kHYPE as collateral on lending protocols like HyperLend, provide liquidity on DEXs like KittenSwap or HyperSwap, or use leveraged looping strategies with protocols like HypurrFi." } },
          ],
        }}
      />

      <ArticleMeta difficulty="Beginner" />

      <H2 id="why-stake-hype">Why Stake HYPE?</H2>

      <LiveStakingData />

      <P>
        Staking HYPE is one of the simplest ways to earn passive yield on Hyperliquid while
        contributing to network security. When you stake HYPE, your tokens are delegated to
        validators who run the HyperBFT consensus mechanism — the backbone that keeps the
        Hyperliquid L1 processing trades, settling positions, and finalizing blocks in under
        one second.
      </P>
      <P>
        In return for securing the network, stakers currently earn approximately 2.25% APY
        in native staking rewards. While this may seem modest compared to some DeFi yields,
        it is important to understand what this number represents: a relatively low-risk,
        protocol-level reward denominated in HYPE itself. There is no smart contract risk
        beyond the base layer, no impermanent loss, and no complex strategy to manage. You
        delegate, you earn.
      </P>

      <DecisionHelper />

      <P>
        Beyond the direct yield, staking serves a governance function. Validators with more
        stake have more weight in consensus, and as Hyperliquid moves toward more decentralized
        governance, staked HYPE will likely play a role in protocol-level decision making. If
        you believe in the long-term future of{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>, staking aligns
        your incentives with the network&apos;s health.
      </P>

      <H2 id="native-staking">Native Staking Step-by-Step</H2>
      <P>
        Native staking on Hyperliquid is straightforward and does not require interacting with
        any third-party smart contracts. Everything happens through the official Hyperliquid
        interface. Here is how to do it:
      </P>
      <P>
        First, navigate to{" "}
        <strong>app.hyperliquid.xyz</strong> and connect your wallet. Once connected, go to the
        Staking section, which is accessible from the main navigation. You will see a list of
        active validators along with their commission rates, total stake, and uptime metrics.
      </P>
      <P>
        Choose a validator to delegate to. Currently, the Hyper Foundation operates the
        majority of the validator set — roughly 81% of all staked HYPE is delegated to
        Foundation-run validators. While these validators have been extremely reliable, this
        concentration is a centralization concern that the community is actively working to
        address. Consider delegating to smaller, independent validators to help diversify
        the network.
      </P>
      <P>
        The minimum staking amount is 1 HYPE. Enter the amount you wish to stake, confirm
        the transaction, and your tokens are delegated. Rewards begin accruing immediately
        and are distributed automatically. There is no need to claim — rewards compound into
        your staked balance.
      </P>
      <P>
        The key tradeoff of native staking is the <strong>7-day unstaking period</strong>.
        When you decide to unstake, your HYPE enters a cooldown period during which it cannot
        be used, traded, or transferred. After 7 days, the tokens become available in your
        wallet again. This lockup exists to prevent validators from rapidly entering and
        exiting the active set, which could destabilize consensus. Plan accordingly — if you
        need instant liquidity, liquid staking may be a better option.
      </P>

      <H2 id="liquid-staking-options">Liquid Staking: kHYPE, stHYPE, beHYPE</H2>
      <P>
        Liquid staking solves the main drawback of native staking: illiquidity during the
        unstaking period. When you liquid stake your HYPE, you receive a liquid staking token
        (LST) that represents your staked position. This LST can be freely traded, used as
        collateral in lending protocols, deposited into liquidity pools, or composed with other
        DeFi strategies — all while your underlying HYPE continues to earn staking rewards.
      </P>
      <P>
        Three major liquid staking protocols have emerged on HyperEVM, each with different
        approaches, integrations, and risk profiles. Understanding the differences between
        them is essential for choosing the right option for your needs.
      </P>

      <H2 id="kinetiq-khype">Kinetiq (kHYPE)</H2>
      <P>
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the dominant liquid
        staking protocol on Hyperliquid, with approximately $1.7 billion in total value locked
        — making it by far the largest DeFi protocol in the ecosystem. When you deposit HYPE
        into Kinetiq, you receive kHYPE, a rebasing token that automatically reflects your
        growing share of the staking rewards.
      </P>
      <P>
        kHYPE uses an auto-compounding mechanism: staking rewards are periodically restaked,
        which means your kHYPE balance grows over time without any manual intervention. The
        protocol distributes stake across multiple validators to reduce concentration risk,
        though the exact validator selection strategy is managed by the Kinetiq team.
      </P>
      <P>
        The most important advantage of kHYPE is its deep DeFi integration. kHYPE is accepted
        as collateral on{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink>, can be paired in
        liquidity pools on{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> and HyperSwap, and
        serves as the foundation for numerous yield strategies across HyperEVM. This wide
        acceptance means kHYPE holders have maximum flexibility in how they use their staked
        position.
      </P>

      <H2 id="stakedhype-sthype">StakedHYPE (stHYPE)</H2>
      <P>
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> was originally built
        by Thunderhead and later acquired by Valantis, a DeFi protocol specializing in
        liquidity infrastructure. stHYPE currently holds approximately $200 million in TVL,
        making it the second-largest liquid staking option on Hyperliquid.
      </P>
      <P>
        stHYPE follows a similar model to kHYPE: deposit HYPE, receive stHYPE, and your
        underlying stake earns rewards that are reflected in the stHYPE exchange rate. The
        acquisition by Valantis has brought additional technical resources and a focus on
        integrating stHYPE deeply into Valantis&apos;s broader liquidity layer — potentially
        opening up unique DeFi use cases that leverage Valantis&apos;s AMM infrastructure.
      </P>
      <P>
        For users who want to diversify their liquid staking exposure rather than concentrating
        entirely in one protocol, holding both kHYPE and stHYPE is a reasonable strategy.
        Different smart contracts mean different risk profiles, and spreading stake across
        protocols reduces the impact of any single contract vulnerability.
      </P>

      <H2 id="hyperbeat-behype">HyperBeat (beHYPE)</H2>
      <P>
        <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink> takes a different
        approach to staked HYPE. Rather than being a pure liquid staking protocol, HyperBeat
        is a yield aggregation protocol that issues beHYPE as its receipt token. beHYPE
        represents a position in HyperBeat&apos;s optimized yield strategies, which may include
        staking, lending, liquidity provision, and other yield sources.
      </P>
      <P>
        The advantage of beHYPE is that it abstracts away the complexity of multi-strategy
        yield optimization. Instead of manually managing staking plus lending plus LP positions,
        you deposit into HyperBeat and let the protocol allocate capital across strategies.
        The tradeoff is less transparency and more smart contract risk — your funds are exposed
        to whatever strategies HyperBeat deploys, which may change over time.
      </P>

      <H2 id="comparing-options">Comparing Staking Options</H2>
      <P>
        The following table summarizes the key differences between native staking and the
        three major liquid staking tokens:
      </P>
      <ComparisonTable
        headers={["Method", "APY", "Lockup", "DeFi Composable", "Min Amount"]}
        rows={[
          ["Native Staking", "~2.25%", "7-day unstake", "No", "1 HYPE"],
          ["kHYPE (Kinetiq)", "~2.1% + DeFi", "None (liquid)", "Yes — widely integrated", "No minimum"],
          ["stHYPE (StakedHYPE)", "~2.1% + DeFi", "None (liquid)", "Yes — growing integrations", "No minimum"],
          ["beHYPE (HyperBeat)", "Variable (aggregated)", "None (liquid)", "Yes — limited integrations", "No minimum"],
        ]}
      />
      <P>
        The APY figures for liquid staking tokens are slightly lower than native staking because
        each protocol takes a fee (typically 5-10% of staking rewards) to cover operational
        costs and protocol revenue. However, the ability to compound yield through DeFi
        strategies can more than compensate for this difference.
      </P>

      <H2 id="staking-risks">Risks &amp; Considerations</H2>
      <P>
        <strong>Validator centralization.</strong> As noted, roughly 81% of all staked HYPE
        is currently delegated to Hyper Foundation validators. This means a single entity
        controls the supermajority of stake. While the Foundation has operated reliably, this
        concentration means that if Foundation validators experienced coordinated downtime or
        misbehavior, it could affect the entire network. Stakers should consider delegating
        to independent validators when possible.
      </P>
      <P>
        <strong>Smart contract risk.</strong> Liquid staking tokens introduce an additional
        layer of smart contract risk. If a vulnerability is found in Kinetiq, StakedHYPE, or
        HyperBeat&apos;s contracts, staked funds could be at risk. All three protocols have
        undergone audits, but audits reduce risk — they do not eliminate it. Native staking
        avoids this risk entirely since it operates at the protocol level.
      </P>
      <P>
        <strong>Slashing risk.</strong> Hyperliquid&apos;s HyperBFT consensus includes
        slashing provisions for validator misbehavior (double signing, extended downtime).
        If a validator you have delegated to is slashed, a portion of your staked HYPE could
        be lost. Liquid staking protocols mitigate this by distributing stake across multiple
        validators, but the risk is not zero.
      </P>
      <P>
        <strong>LST depeg risk.</strong> Liquid staking tokens should trade at or near their
        underlying value (1 kHYPE = ~1.0x HYPE plus accumulated rewards). However, during
        periods of market stress or liquidity crunches, LSTs can temporarily trade below
        their fair value — a phenomenon known as depegging. If you need to exit a position
        during such a period, you may receive less than the theoretical value of your stake.
      </P>

      <H2 id="maximizing-yield">Maximizing Yield with Staked HYPE</H2>
      <P>
        The real power of liquid staking becomes apparent when you layer additional yield
        strategies on top of your staked position. Here are the most common approaches:
      </P>
      <P>
        <strong>kHYPE as collateral on HyperLend.</strong> Deposit your kHYPE into{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> as collateral and borrow
        USDC or other assets against it. You continue earning staking rewards on the underlying
        HYPE while using the borrowed funds for additional yield opportunities. This effectively
        lets you earn on the same capital twice — once from staking and once from whatever you
        do with the borrowed funds.
      </P>
      <P>
        <strong>LP on KittenSwap or HyperSwap.</strong> Pair your kHYPE or stHYPE with HYPE,
        USDC, or other tokens in a liquidity pool on{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> or HyperSwap. You earn
        swap fees from traders using the pool while your underlying stake continues to accrue
        rewards. Be aware of impermanent loss risk — if the price of kHYPE diverges significantly
        from the paired asset, your LP position may underperform simply holding both tokens.
      </P>
      <P>
        <strong>Leveraged looping with HypurrFi.</strong> For more aggressive strategies,
        protocols like HypurrFi enable leveraged looping: deposit kHYPE as collateral, borrow
        HYPE, stake the borrowed HYPE for more kHYPE, and repeat. Each loop amplifies your
        effective staking yield but also amplifies your liquidation risk. This strategy is only
        appropriate for experienced DeFi users who understand the risks of leveraged positions
        and can monitor their health factor actively.
      </P>
      <P>
        For a broader overview of yield opportunities, see our{" "}
        <InlineLink href="/learn/how-to-earn-yield-on-hyperliquid">
          guide to earning yield on Hyperliquid
        </InlineLink>.
      </P>

      <CTA href="/projects">Explore staking projects &rarr;</CTA>
    </LearnLayout>
  );
}
