import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-staking-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Stake HYPE — Complete Staking Guide 2026 | perp.wiki",
  description:
    "Step-by-step guide to staking HYPE tokens on Hyperliquid. Covers native staking, liquid staking (Kinetiq), APY, validators, and fee discounts. Updated 2026.",
};

const TOC = [
  { id: "overview", title: "Staking on Hyperliquid" },
  { id: "hlp-vault", title: "HLP Vault" },
  { id: "hype-staking", title: "HYPE Validator Staking" },
  { id: "liquid-staking", title: "Liquid Staking (kHYPE, stHYPE)" },
  { id: "yield-strategies", title: "Advanced Yield Strategies" },
  { id: "risks", title: "Risks to Consider" },
];

const FAQ = [
  {
    question: "What is HLP vault APR on Hyperliquid?",
    answer:
      "HLP vault APR fluctuates based on market conditions but has historically ranged from 15-25% annualized. Returns come from market-making spreads, taker fees, and funding rate capture across 100+ perpetual markets.",
  },
  {
    question: "How do I stake HYPE tokens?",
    answer:
      "You can stake HYPE directly to validators through the Hyperliquid app, or use liquid staking protocols like Kinetiq (kHYPE) or StakedHYPE (stHYPE) to earn staking rewards while keeping your tokens liquid for DeFi.",
  },
  {
    question: "Is HYPE staking worth it?",
    answer:
      "HYPE staking rewards depend on the validator and protocol. Direct staking earns consensus rewards, while liquid staking tokens like kHYPE can be used as collateral in DeFi protocols to earn additional yield on top of staking rewards.",
  },
];

export default function StakingGuidePage() {
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

      <H2 id="overview">Staking on Hyperliquid</H2>
      <P>
        Hyperliquid offers several ways to earn yield on your capital. Whether you want passive
        market-making returns through the HLP vault, consensus rewards from staking HYPE to
        validators, or leveraged yield through liquid staking DeFi strategies, the ecosystem has
        options for every risk tolerance. This guide covers all of them.
      </P>

      <H2 id="hlp-vault">HLP Vault: Protocol-Owned Market Making</H2>
      <P>
        The <InlineLink href="/projects/hlp">HLP (Hyperliquidity Provider)</InlineLink> vault is
        Hyperliquid&apos;s flagship yield product. Users deposit USDC and earn returns from
        automated market-making across all perpetual markets on the platform. Unlike user-created
        vaults, HLP charges zero management fees — 100% of profits go to depositors.
      </P>
      <P>
        HLP has accumulated over $43M in all-time PnL with $373M+ in TVL. Returns come from three
        sources: market-making spreads (the bid-ask difference), a share of taker fees on every
        trade, and funding rate capture when positions earn positive funding. Historical APR has
        ranged from 15-25%, though returns vary with market volatility and trading volume.
      </P>
      <P>
        The key advantage of HLP is simplicity: deposit USDC, earn yield, withdraw anytime. There
        is no lock-up period. The risk is that market-making can produce temporary drawdowns during
        extreme volatility, though HLP has proven resilient across multiple market cycles.
      </P>

      <H2 id="hype-staking">HYPE Validator Staking</H2>
      <P>
        HYPE is the native token of the Hyperliquid L1 and secures the network through a
        delegated proof-of-stake consensus mechanism called HyperBFT. There are currently 25
        active validators (of 30 total) securing the network. By staking HYPE to a validator, you
        earn a share of consensus rewards proportional to your stake.
      </P>
      <P>
        Direct staking locks your HYPE for the staking period. Rewards accrue continuously and can
        be claimed at any time. The staking APY depends on the total amount staked network-wide —
        as more HYPE is staked, the per-token reward decreases. Current estimates range from 5-10%
        APY for direct staking.
      </P>

      <H2 id="liquid-staking">Liquid Staking: kHYPE and stHYPE</H2>
      <P>
        Liquid staking protocols solve the liquidity problem of direct staking. Instead of locking
        your HYPE, you receive a liquid staking token (LST) that represents your staked position
        and accrues rewards automatically.
      </P>
      <P>
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the largest liquid staking
        protocol on HyperEVM with $470M+ HYPE staked. Users deposit HYPE and receive kHYPE, which
        appreciates in value as staking rewards accrue. kHYPE can be used as collateral on lending
        protocols like <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> and{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink>, enabling
        leveraged staking strategies.
      </P>
      <P>
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> (now operated by Valantis
        Labs) offers stHYPE with approximately $200M in TVL. stHYPE is similarly composable across
        HyperEVM DeFi and is deeply integrated with multiple protocols.
      </P>

      <H2 id="yield-strategies">Advanced Yield Strategies</H2>
      <P>
        The composability of liquid staking tokens enables advanced strategies.{" "}
        <InlineLink href="/projects/looped-hype">Looped HYPE</InlineLink> offers recursive
        staking strategies with 3x to 15x leverage, targeting around 10% APY by looping HYPE
        through staking and lending protocols.
      </P>
      <P>
        Yield aggregators like <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink> and{" "}
        <InlineLink href="/projects/mizu">Mizu</InlineLink> automate deployment across multiple
        DeFi protocols to optimize returns. HyperBeat&apos;s Meta Vaults use delta-neutral
        strategies, while Mizu offers multi-asset vaults (HyperETH, HyperBTC, HyperUSD) built on
        Veda&apos;s BoringVault infrastructure.
      </P>

      <H2 id="risks">Risks to Consider</H2>
      <P>
        All yield-bearing strategies carry risk. HLP vault returns depend on market conditions and
        can experience drawdowns during extreme volatility. Liquid staking tokens carry smart
        contract risk from the staking protocol itself, plus any protocols where the LST is
        deployed as collateral. Leveraged staking strategies amplify both returns and potential
        losses — liquidation is possible if collateral values drop sharply.
      </P>
      <P>
        The Hyperliquid validator set is still relatively small (25 active validators), which
        presents centralization risk. As the network matures and the validator set grows, this
        risk should decrease. Always consider your risk tolerance before committing capital to
        any yield strategy.
      </P>

      <CTA href="/projects?category=Yield+%26+Vaults">Browse yield protocols &rarr;</CTA>
    </LearnLayout>
  );
}
