import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hype-token-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "HYPE Token Guide: Tokenomics, Staking & Governance | PerpWiki",
  description: article.description,
};

const TOC = [
  { id: "what-is-hype", title: "What Is HYPE?" },
  { id: "tokenomics", title: "Tokenomics" },
  { id: "staking", title: "Staking HYPE" },
  { id: "liquid-staking", title: "Liquid Staking" },
  { id: "governance", title: "Governance" },
  { id: "burn-mechanism", title: "Burn Mechanism" },
  { id: "where-to-get", title: "Where to Get HYPE" },
];

const FAQ = [
  {
    question: "What is the HYPE token?",
    answer:
      "HYPE is the native token of the Hyperliquid L1 blockchain. It serves three main functions: staking for network security (via validators), governance over protocol parameters, and as the gas token for HyperEVM transactions. It was distributed through one of the largest airdrops in crypto history.",
  },
  {
    question: "How does HYPE staking work?",
    answer:
      "HYPE can be staked to validators to earn consensus rewards (5-10% APY), or deposited into liquid staking protocols like Kinetiq (kHYPE) or StakedHYPE (stHYPE) to earn rewards while keeping tokens liquid for DeFi. There are currently 25 active validators securing the network.",
  },
  {
    question: "Is HYPE deflationary?",
    answer:
      "Yes. A portion of trading fees, HyperEVM gas fees, and HIP-3 auction revenue is used to buy back and burn HYPE tokens. The Assistance Fund (managed by the Hyper Foundation) also executes periodic buybacks, creating persistent buy pressure.",
  },
];

export default function HypeTokenGuidePage() {
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

      <H2 id="what-is-hype">What Is HYPE?</H2>
      <P>
        HYPE is the native token of Hyperliquid, the high-performance L1 blockchain that processes
        over $3.4B in daily perpetual trading volume across 229 markets. HYPE serves as the backbone
        of the network — powering consensus through staking, governing protocol upgrades, and paying
        for gas on HyperEVM.
      </P>
      <P>
        The token launched in November 2024 through one of the largest airdrops in crypto history,
        distributing tokens to early platform users based on their trading activity and loyalty to
        the platform. There was no venture capital sale, no ICO, and no private rounds — the
        community received the token directly.
      </P>

      <H2 id="tokenomics">Tokenomics</H2>
      <P>
        HYPE has a total supply of 1 billion tokens. The distribution was designed to be heavily
        community-oriented: approximately 31% was distributed in the genesis airdrop, with additional
        allocations reserved for future community distributions, ecosystem development, and the
        Hyper Foundation.
      </P>
      <P>
        The Assistance Fund (AF) holds a significant allocation and actively manages its HYPE position.
        Revenue from the Assistance Fund comes from trading fees, HyperEVM gas fees, and HIP-3 auction
        proceeds. The AF uses this revenue for ongoing HYPE buybacks, creating consistent buy pressure.
      </P>
      <P>
        There are no token unlocks from VC investors (because there were none). The team&apos;s
        allocation is subject to a multi-year vesting schedule. This clean tokenomics structure —
        no VC overhang, no aggressive unlock schedule — is a key reason for HYPE&apos;s strong
        price performance since launch.
      </P>

      <H2 id="staking">Staking HYPE</H2>
      <P>
        Hyperliquid uses a delegated proof-of-stake (DPoS) consensus mechanism called HyperBFT. There
        are currently 25 active validators (of 30 total) securing the network. HYPE holders can
        delegate their tokens to any validator to earn a share of consensus rewards.
      </P>
      <P>
        Direct staking APY ranges from roughly 5-10%, depending on the total amount staked and the
        validator&apos;s commission rate. Staking involves a bonding period — when you unstake, there
        is a waiting period before tokens become liquid again. Rewards accrue continuously and can be
        claimed at any time.
      </P>
      <P>
        You can stake directly through the Hyperliquid app under the &quot;Staking&quot; section. Choose
        a validator based on their uptime, commission rate, and total stake. Diversifying across multiple
        validators is recommended to reduce slashing risk.
      </P>

      <H2 id="liquid-staking">Liquid Staking: kHYPE and stHYPE</H2>
      <P>
        For users who want staking rewards without locking their tokens, liquid staking protocols
        provide the best of both worlds.{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the largest with $470M+ HYPE
        staked — deposit HYPE, receive kHYPE, which appreciates as staking rewards accrue.
      </P>
      <P>
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> offers stHYPE with ~$200M
        TVL. Both LSTs are widely accepted as collateral across HyperEVM — use them on{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> to mint feUSD, on{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> to borrow against, or provide
        liquidity on <InlineLink href="/projects/valantis">Valantis</InlineLink> for additional yield.
      </P>
      <P>
        Liquid staking tokens effectively turn your staked HYPE into productive DeFi collateral. The
        composability means you can earn staking rewards, lending interest, and DEX fees simultaneously.
        See our <InlineLink href="/learn/hyperliquid-staking-guide">Staking Guide</InlineLink> for
        detailed strategies.
      </P>

      <H2 id="governance">Governance</H2>
      <P>
        HYPE stakers participate in governance over protocol parameters and upgrades. The governance
        model is evolving as the network matures. Currently, staked HYPE weight determines voting
        power on proposals affecting the protocol — including fee parameters, validator set changes,
        and network upgrades.
      </P>
      <P>
        The Hyper Foundation coordinates governance processes and manages the Assistance Fund. As
        Hyperliquid decentralizes further, governance is expected to become increasingly on-chain and
        community-driven.
      </P>

      <H2 id="burn-mechanism">Burn Mechanism</H2>
      <P>
        HYPE is deflationary. Multiple revenue streams flow into buyback-and-burn mechanisms: a portion
        of trading fees from HyperCore, gas fees from HyperEVM transactions, and revenue from HIP-3
        ticker auctions. The Assistance Fund executes periodic buybacks on the open market, permanently
        removing tokens from circulation.
      </P>
      <P>
        This creates a flywheel: more trading volume generates more fees, which fund more buybacks,
        which reduce supply. As Hyperliquid&apos;s volume grows (currently processing $40B+ weekly),
        the burn rate accelerates proportionally.
      </P>

      <H2 id="where-to-get">Where to Get HYPE</H2>
      <P>
        HYPE trades natively on Hyperliquid&apos;s own spot order book. You can also acquire it
        through HyperEVM DEXs like{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> and{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink>. To bridge funds to
        Hyperliquid from other chains, use{" "}
        <InlineLink href="/projects/debridge">deBridge</InlineLink> or{" "}
        <InlineLink href="/projects/across-protocol">Across Protocol</InlineLink> for fast, low-cost
        transfers.
      </P>

      <CTA href="/learn/hyperliquid-staking-guide">Read the Staking Guide &rarr;</CTA>
    </LearnLayout>
  );
}
