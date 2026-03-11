import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-points-airdrop-2";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Hyperliquid Points & Airdrop Season 2: What We Know",
  description:
    "Everything known about Hyperliquid Season 2 points and the potential second HYPE airdrop. Earning strategies, timeline speculation, and risks to consider.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "Hyperliquid Points & Airdrop Season 2: What We Know",
    description:
      "Guide to Hyperliquid Season 2: how points work, earning strategies, timeline speculation, and whether farming is worth the effort.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Hyperliquid Points & Airdrop Season 2: What We Know",
    description:
      "Guide to Hyperliquid Season 2: how points work, earning strategies, timeline speculation, and whether farming is worth the effort.",
  },
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "season-1-recap", title: "Season 1 Recap" },
  { id: "season-2-overview", title: "Season 2 Overview" },
  { id: "how-points-work", title: "How Points Work" },
  { id: "earning-strategies", title: "Earning Strategies" },
  { id: "timeline", title: "Timeline & Speculation" },
  { id: "risks-and-considerations", title: "Risks & Considerations" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "When is Hyperliquid airdrop season 2?",
    answer:
      "There is no officially confirmed date for a Season 2 airdrop. Season 2 points accumulation began after the genesis event in late November 2024 and is ongoing. The Hyperliquid team has not announced a specific end date or distribution timeline. Based on Season 1 precedent (which ran approximately 7 months), some community members speculate a distribution could occur in mid-to-late 2025 or beyond, but this is purely speculation. The team may also choose a different distribution mechanism than a traditional airdrop.",
  },
  {
    question: "How do I earn Hyperliquid points?",
    answer:
      "Hyperliquid points are earned through active participation on the platform. The primary earning methods include trading perpetual futures (both maker and taker volume contribute), depositing USDC into the HLP vault, maintaining open interest (holding positions), and using the referral program to bring new users to the platform. Points are distributed in weekly epochs, with the exact formula not publicly disclosed. Consistent, genuine trading activity over time is believed to be more valuable than short bursts of high volume.",
  },
  {
    question: "Will there be another HYPE airdrop?",
    answer:
      "It is highly likely but not guaranteed. Approximately 38.888% of HYPE's total supply is reserved for future community emissions, which includes Season 2 rewards. However, the exact format of the distribution has not been confirmed — it could be a traditional airdrop similar to Season 1, a gradual points-to-token conversion, ongoing rewards, or some combination. The team has not provided specific guidance on how these tokens will be distributed.",
  },
  {
    question: "Is farming Hyperliquid points worth it?",
    answer:
      "It depends on your situation. Season 1 was extraordinarily profitable — the 31% supply distribution created life-changing returns for many active users. However, Season 2 is expected to have a smaller allocation (the remaining ~39% is for all future emissions, not just Season 2), more participants competing for points, and potentially different criteria. If you are already trading on Hyperliquid because you prefer the platform, earning points is a valuable bonus. If you are purely farming with no genuine interest in trading, the opportunity cost and risks (wash trading crackdowns, unclear conversion rates) may outweigh the potential reward.",
  },
];

export default function HyperliquidPointsAirdrop2Page() {
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
        Hyperliquid&apos;s Season 1 airdrop was the largest in crypto history — 31% of the HYPE token
        supply distributed to approximately 94,000 wallets, worth over $1.6 billion at the time of the
        genesis event. Naturally, attention has turned to Season 2. With nearly 39% of HYPE&apos;s total
        supply reserved for future community emissions, the question is not whether there will be more
        distributions, but when, how much, and what criteria will determine allocations.
      </P>
      <P>
        This guide covers everything currently known about Hyperliquid Season 2: how the points system
        works, what strategies maximize your accumulation, realistic timeline expectations, and the risks
        you should weigh before committing time and capital to farming. We will be straightforward about
        what is confirmed versus what is community speculation — there is a meaningful difference, and
        making decisions based on unverified assumptions can be costly.
      </P>

      <H2 id="season-1-recap">Season 1 Recap</H2>
      <P>
        Season 1 ran from approximately April 2024 through November 2024, covering roughly seven months
        of platform activity. During this period, Hyperliquid distributed points to users based on their
        trading activity, HLP deposits, and overall platform engagement. Points were allocated in weekly
        epochs, with 1 million points distributed per week across all eligible users.
      </P>
      <P>
        When the genesis event occurred on November 29, 2024, accumulated Season 1 points were converted
        to HYPE token allocations. The conversion rate was generous — 310 million HYPE tokens (31% of
        total supply) were distributed. At HYPE&apos;s initial trading price, this made Season 1 one of
        the most lucrative farming opportunities in DeFi history. Some large traders received allocations
        worth hundreds of thousands or even millions of dollars.
      </P>
      <P>
        The Season 1 distribution was notable for several reasons. First, its size — 31% of total supply
        to users is nearly unprecedented. Most airdrops allocate 5-15%. Second, the absence of VC
        allocations meant the community distribution was not diluted by investor tokens. Third, the
        allocation formula appeared to meaningfully reward genuine, consistent users over short-term
        mercenary farmers, though the exact methodology was never fully disclosed.
      </P>
      <P>
        The success of Season 1 created both an opportunity and a challenge for Season 2. The opportunity
        is that Hyperliquid has demonstrated willingness to distribute tokens generously. The challenge is
        that Season 2 has attracted far more participants — many of whom are farming specifically for the
        airdrop rather than genuinely using the platform — which dilutes per-user allocations and may
        prompt the team to adjust criteria.
      </P>

      <H2 id="season-2-overview">Season 2 Overview</H2>
      <P>
        Season 2 began immediately after the genesis event in late November 2024 and is ongoing as of
        this writing. Points continue to be distributed weekly, following a similar cadence to Season 1.
        However, important details about Season 2 differ from Season 1 — or remain unknown.
      </P>
      <P>
        <strong>Allocation size.</strong> The total HYPE supply reserved for future community emissions is
        approximately 38.888% (388.88 million tokens). However, this allocation is for all future
        distributions, not exclusively Season 2. The team may distribute this over multiple seasons,
        staking rewards, ecosystem grants, and other incentive programs. It is reasonable to expect that
        Season 2&apos;s allocation will be smaller than Season 1&apos;s 31%.
      </P>
      <P>
        <strong>More participants.</strong> The massive success of Season 1 attracted significant attention
        to Hyperliquid. The user base has grown substantially, meaning more wallets are competing for
        points. All else being equal, more participants means smaller per-user allocations. This is the
        most important difference between Season 1 and Season 2 from a farming perspective.
      </P>
      <P>
        <strong>Changed criteria.</strong> The exact criteria for Season 2 points have not been publicly
        disclosed, and they may differ from Season 1. The team has the ability to adjust the formula to
        better reward genuine users and penalize farm-only behavior. There is no guarantee that the
        activities that were most rewarded in Season 1 will be equally rewarded in Season 2.
      </P>

      <H2 id="how-points-work">How Points Work</H2>
      <P>
        Hyperliquid distributes points in weekly epochs. Each week, a fixed number of points (1 million
        during Season 1) are allocated proportionally across all eligible users based on their platform
        activity during that epoch. The exact formula has never been fully disclosed, but community
        analysis of Season 1 allocations has identified several key contributing factors.
      </P>
      <P>
        <strong>Trading volume.</strong> Both maker and taker volume on perpetual markets contribute to
        points accumulation. Higher volume generally means more points, though the relationship may not
        be perfectly linear. Maker volume (placing limit orders that add liquidity) has historically been
        weighted more favorably than taker volume (market orders that remove liquidity), which aligns
        with the protocol&apos;s interest in encouraging order book depth.
      </P>
      <P>
        <strong>HLP deposits.</strong> Capital deposited in the{" "}
        <InlineLink href="/projects/hlp">HLP vault</InlineLink> earns points based on the size and
        duration of the deposit. This is one of the most passive ways to accumulate points — deposit
        USDC into HLP and earn both the vault&apos;s market-making returns and points simultaneously.
        HLP deposits have historically been a reliable points source.
      </P>
      <P>
        <strong>Open interest.</strong> Holding open positions (maintaining open interest) contributes to
        points accumulation. This rewards users who actively hold positions rather than just executing
        quick round-trip trades. The size and duration of open positions appear to matter, incentivizing
        genuine position-taking over wash trading.
      </P>
      <P>
        <strong>Referrals.</strong> The referral program allows users to earn bonus points by inviting
        new users to Hyperliquid. When referred users trade, the referrer receives a portion of the
        points generated by that trading activity. This creates a network effect that benefits early
        adopters who bring genuine new users to the platform.
      </P>
      <P>
        <strong>What does NOT earn points.</strong> Activities that do not contribute meaningfully to
        the platform&apos;s health are unlikely to be rewarded. Wash trading (trading with yourself
        across multiple wallets), Sybil farming (creating many wallets to game minimum allocations),
        and other extractive behaviors are actively monitored and filtered. The team has demonstrated
        willingness to exclude suspicious wallets from distributions.
      </P>

      <H2 id="earning-strategies">Earning Strategies</H2>
      <P>
        <strong>Active trading on Hyperliquid.</strong> The most direct way to earn points is to actively
        trade on Hyperliquid&apos;s perpetual markets. Focus on major markets (BTC, ETH, SOL) where
        liquidity is deepest and spreads are tightest, minimizing the cost of trading. Using limit orders
        (maker volume) is generally more capital-efficient than market orders for points accumulation.
        For a guide on getting started, see{" "}
        <InlineLink href="/learn/how-to-use-hyperliquid">How to Use Hyperliquid</InlineLink>.
      </P>
      <P>
        <strong>Providing HLP liquidity.</strong> Depositing USDC into the HLP vault earns points
        passively while also generating the vault&apos;s market-making returns (historically 15-25% APR).
        This is arguably the best risk-adjusted strategy for points accumulation — you earn yield from
        the vault itself plus points for the deposit. The main risk is the vault&apos;s market-making
        drawdowns during extreme volatility. For details, see our{" "}
        <InlineLink href="/learn/hlp-vault-guide">HLP Vault Guide</InlineLink>.
      </P>
      <P>
        <strong>Using ecosystem projects.</strong> Engaging with the broader Hyperliquid ecosystem may
        contribute to points accumulation, particularly if the team rewards cross-ecosystem activity.
        This includes trading on spot markets, using HyperEVM DeFi protocols, and participating in
        HIP-3 markets. While the direct points impact of these activities is less clear than perp
        trading and HLP deposits, diversifying your on-chain activity creates a more robust farming
        profile.
      </P>
      <P>
        <strong>Consistency over bursts.</strong> Analysis of Season 1 allocations suggested that
        consistent activity over time was rewarded more favorably than short bursts of high volume.
        Users who traded regularly throughout the season tended to receive better allocations relative
        to their total volume than users who concentrated all their activity into a few weeks. This
        pattern — if it continues into Season 2 — favors steady engagement over one-time farming sprints.
      </P>

      <H2 id="timeline">Timeline &amp; Speculation</H2>
      <P>
        As of this writing, there is no officially confirmed end date for Season 2 or a confirmed
        distribution timeline. The Hyperliquid team has been characteristically tight-lipped about
        specifics, which makes timeline predictions inherently speculative. Here is what we can
        reasonably infer.
      </P>
      <P>
        <strong>Season 1 precedent.</strong> Season 1 ran approximately seven months (April-November
        2024). If Season 2 follows a similar duration, it could conclude sometime in mid-2025 or later.
        However, the team is under no obligation to follow the same timeline, and Season 2 could be
        shorter, longer, or structured differently than Season 1.
      </P>
      <P>
        <strong>Token unlock considerations.</strong> The team&apos;s vesting schedule and broader
        tokenomics timeline may influence when a Season 2 distribution occurs. A distribution that
        coincides with significant token unlocks could create selling pressure, which the team would
        likely want to avoid. This suggests the distribution timing will be carefully considered in the
        context of overall token supply dynamics.
      </P>
      <P>
        <strong>Market conditions.</strong> The team may also time any distribution to align with favorable
        market conditions. Launching during a bull market maximizes the perceived value of the
        distribution and generates more positive attention for the protocol. A bear market distribution
        would have less impact and could disappoint recipients.
      </P>
      <P>
        <strong>The honest assessment.</strong> Nobody outside the core team knows when Season 2 will end
        or how tokens will be distributed. Anyone claiming to have inside information or specific dates
        should be treated with extreme skepticism. The best approach is to use Hyperliquid because you
        genuinely value the platform, and treat any future distribution as a bonus rather than a
        guaranteed outcome.
      </P>

      <H2 id="risks-and-considerations">Risks &amp; Considerations</H2>
      <P>
        <strong>Wash trading crackdowns.</strong> The Hyperliquid team has both the ability and the
        incentive to identify and exclude wash trading activity from points distributions. Sophisticated
        on-chain analysis can detect patterns such as trading with yourself across wallets, circular
        trading patterns, and artificially inflated volume. Users who engage in these practices risk
        having their points zeroed out entirely, losing both the time invested and any trading fees paid.
      </P>
      <P>
        <strong>Unclear conversion rate.</strong> There is no guarantee that Season 2 points will convert
        to HYPE at the same rate as Season 1. The total allocation is likely smaller, and the user base
        is larger, which mechanically reduces per-point value. Users farming under the assumption that
        Season 2 will be as lucrative as Season 1 may be disappointed.
      </P>
      <P>
        <strong>Opportunity cost.</strong> Capital deployed for points farming on Hyperliquid could
        potentially earn higher risk-adjusted returns elsewhere. If you are trading primarily to farm
        points rather than because you have a genuine edge, the trading fees and potential losses you
        incur represent a real cost. The HLP vault deposit strategy has the best risk-adjusted profile
        because you earn vault returns regardless of whether a Season 2 distribution materializes.
      </P>
      <P>
        <strong>Changing criteria.</strong> The team can modify the points formula at any time without
        notice. Activities that were highly rewarded in Season 1 may be weighted differently in Season 2.
        This uncertainty is inherent to points-based systems and means that no farming strategy is
        guaranteed to be optimal. Diversifying across multiple earning vectors (trading, HLP, ecosystem
        engagement) provides the best hedge against criteria changes.
      </P>
      <P>
        <strong>Tax implications.</strong> Any HYPE received from a Season 2 distribution would likely be
        taxable income in most jurisdictions, valued at the market price at the time of receipt. Users
        should plan for potential tax obligations and consult a qualified tax professional. This is
        particularly relevant given the potentially large dollar value of airdrop allocations.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P>
            <strong>{f.question}</strong>
          </P>
          <P>{f.answer}</P>
        </div>
      ))}
    </LearnLayout>
  );
}
