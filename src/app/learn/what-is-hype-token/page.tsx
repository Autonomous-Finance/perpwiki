import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hype-token";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "What is HYPE Token? Complete Guide to Hyperliquid's Native Token",
  description:
    "Everything you need to know about HYPE token: tokenomics, staking, governance, the $1.6B airdrop, buy-and-burn mechanism, and where to buy HYPE.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "What is HYPE Token? Complete Guide to Hyperliquid's Native Token",
    description:
      "HYPE token guide: tokenomics, staking, governance, the record-breaking airdrop, and the buy-and-burn deflationary mechanism.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "What is HYPE Token? Complete Guide to Hyperliquid's Native Token",
    description:
      "HYPE token guide: tokenomics, staking, governance, the record-breaking airdrop, and the buy-and-burn deflationary mechanism.",
  },
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is-hype", title: "What Is HYPE?" },
  { id: "tokenomics", title: "HYPE Tokenomics" },
  { id: "hype-uses", title: "What Is HYPE Used For?" },
  { id: "staking-hype", title: "Staking HYPE" },
  { id: "the-airdrop", title: "The HYPE Airdrop" },
  { id: "hype-burn", title: "Buy-and-Burn Mechanism" },
  { id: "price-history", title: "HYPE Price History" },
  { id: "where-to-buy", title: "Where to Buy HYPE" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is HYPE token used for?",
    answer:
      "HYPE is the native token of the Hyperliquid L1 blockchain. It serves four primary functions: paying gas fees on HyperEVM (Hyperliquid's EVM-compatible layer), staking to validators to secure the network and earn consensus rewards, participating in governance decisions about protocol upgrades and parameter changes, and powering the buy-and-burn deflationary mechanism where 54% of trading fees are used to buy and permanently burn HYPE from circulation.",
  },
  {
    question: "What was the HYPE airdrop?",
    answer:
      "The HYPE genesis airdrop occurred on November 29, 2024, and distributed 31% of the total HYPE supply (310 million tokens) to approximately 94,000 wallets. At the time of distribution, the airdrop was worth over $1.6 billion, making it the largest airdrop in cryptocurrency history. Tokens were allocated based on users' trading activity, HLP deposits, and engagement with the Hyperliquid platform during Season 1 (April-November 2024).",
  },
  {
    question: "How do I stake HYPE?",
    answer:
      "You can stake HYPE either natively or through liquid staking protocols. For native staking, go to app.hyperliquid.xyz, navigate to the staking section, choose a validator, and delegate your HYPE to earn approximately 2.25% APY. For liquid staking, deposit HYPE into protocols like Kinetiq (receive kHYPE) or StakedHYPE (receive stHYPE) to earn staking rewards while keeping your capital liquid and composable across HyperEVM DeFi.",
  },
  {
    question: "Is HYPE deflationary?",
    answer:
      "Yes. Hyperliquid uses 54% of all trading fees generated on the platform to buy HYPE on the open market and permanently burn it, removing those tokens from circulation forever. With billions in daily trading volume, this creates consistent and meaningful buy pressure combined with permanent supply reduction. As Hyperliquid's volume grows, the rate of HYPE burns accelerates, making the token increasingly deflationary over time.",
  },
  {
    question: "Where can I buy HYPE?",
    answer:
      "HYPE can be purchased natively on Hyperliquid's spot order book at app.hyperliquid.xyz — this is the most liquid venue with the tightest spreads. HYPE is also listed on several centralized exchanges including KuCoin and Gate.io. On HyperEVM, you can swap for HYPE on decentralized exchanges like HyperSwap and Laminar. For the best execution, the native Hyperliquid spot market is recommended.",
  },
];

export default function WhatIsHypeTokenPage() {
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
        HYPE is the native token of Hyperliquid, the high-performance Layer 1 blockchain built for
        on-chain perpetual trading. Since its launch in late November 2024, HYPE has become one of
        the most closely watched tokens in crypto — partly because of its record-breaking airdrop
        that distributed over $1.6 billion to early users, and partly because of its aggressive
        deflationary tokenomics powered by a buy-and-burn mechanism funded by trading fees.
      </P>
      <P>
        This guide covers everything you need to know about HYPE: what it does, how the tokenomics
        work, staking options (both native and liquid), the genesis airdrop, the burn mechanism, price
        history, and where to buy it. Whether you are evaluating HYPE as an investment, trying to
        understand the role it plays in the Hyperliquid ecosystem, or looking for the best way to earn
        yield on your existing holdings, this article provides the complete picture.
      </P>

      <H2 id="what-is-hype">What Is HYPE?</H2>
      <P>
        HYPE is the native utility and governance token of the Hyperliquid L1 blockchain. It was launched
        on November 29, 2024, alongside the genesis event that transformed Hyperliquid from a standalone
        perpetual exchange into a full Layer 1 blockchain with its own consensus mechanism, validator set,
        and EVM-compatible smart contract layer (HyperEVM).
      </P>
      <P>
        Before HYPE existed, Hyperliquid operated without a token — users traded perpetual futures on the
        platform using USDC as the sole collateral and settlement currency. The introduction of HYPE
        created an alignment mechanism between the protocol and its users: HYPE holders benefit from the
        platform&apos;s growth through staking rewards, governance influence, and the deflationary
        buy-and-burn mechanism that ties token value directly to trading volume.
      </P>
      <P>
        HYPE is not an ERC-20 token on Ethereum. It is a native token on the Hyperliquid L1 blockchain,
        similar to how ETH is native to Ethereum or SOL is native to Solana. It can be used natively
        on both HyperCore (the native trading layer) and HyperEVM (the EVM-compatible smart contract
        layer). For a detailed look at how these two layers interact, see our{" "}
        <InlineLink href="/learn/hypercore-vs-hyperevm">HyperCore vs HyperEVM</InlineLink> explainer.
      </P>

      <H2 id="tokenomics">HYPE Tokenomics</H2>
      <P>
        HYPE has a total supply of 1 billion tokens. The allocation was designed to heavily favor the
        community over insiders, which was a deliberate strategic decision that differentiated Hyperliquid
        from most other token launches in crypto.
      </P>
      <P>
        <strong>Genesis distribution (31%).</strong> 310 million HYPE tokens (31% of total supply) were
        distributed in the genesis airdrop to approximately 94,000 wallets. This was the largest token
        airdrop in cryptocurrency history by dollar value. Allocations were based on trading activity,
        HLP vault deposits, and platform engagement during Season 1 (April-November 2024). There was no
        venture capital allocation and no private sale — the team chose not to raise external funding.
      </P>
      <P>
        <strong>Future emissions and community rewards (38.888%).</strong> Nearly 39% of the total supply
        is reserved for future community incentives, including Season 2 points distributions, ecosystem
        grants, and potential future airdrops. This allocation ensures the protocol can continue rewarding
        active users and builders for years to come.
      </P>
      <P>
        <strong>Core contributors (23.8%).</strong> The team allocation is 238 million tokens, subject to
        a vesting schedule. This is a relatively standard team allocation, though notably Hyperliquid did
        not allocate any tokens to venture capital investors — a rarity in the industry. The team&apos;s
        tokens vest over time to align long-term incentives.
      </P>
      <P>
        <strong>Hyper Foundation (6.0%).</strong> 60 million tokens are allocated to the Hyper Foundation,
        which oversees protocol development, governance, and ecosystem growth initiatives. The foundation
        operates independently from the core team.
      </P>
      <P>
        <strong>Community grants (0.3%).</strong> A smaller allocation for direct community grants, used
        to fund specific projects and initiatives within the Hyperliquid ecosystem.
      </P>

      <H2 id="hype-uses">What Is HYPE Used For?</H2>
      <P>
        <strong>Gas on HyperEVM.</strong> Every transaction on HyperEVM — the EVM-compatible smart
        contract layer of Hyperliquid — requires HYPE for gas fees, just as Ethereum transactions require
        ETH. This creates baseline demand for HYPE that grows proportionally with HyperEVM adoption. As
        more DeFi protocols, NFT platforms, and applications deploy on HyperEVM, gas consumption
        increases. For more on HyperEVM, see our{" "}
        <InlineLink href="/learn/what-is-hyperevm">What Is HyperEVM?</InlineLink> guide.
      </P>
      <P>
        <strong>Validator staking.</strong> HYPE is staked to validators who secure the Hyperliquid L1
        blockchain through its HyperBFT consensus mechanism. Stakers earn consensus rewards (currently
        approximately 2.25% APY) for delegating their HYPE to validators. This staking mechanism serves
        the dual purpose of securing the network and providing yield to long-term token holders.
      </P>
      <P>
        <strong>Governance.</strong> HYPE holders participate in governance decisions that affect the
        protocol&apos;s future direction. Validators (who hold staked HYPE) vote on proposals including
        market listings and delistings, risk parameter adjustments, protocol upgrades, and fee structure
        changes. The governance power of HYPE was most visibly demonstrated during the March 2025 JELLY
        incident, when validators voted to delist a manipulated market.
      </P>
      <P>
        <strong>Buy-and-burn.</strong> 54% of all trading fees generated on Hyperliquid are used to
        purchase HYPE on the open market and permanently burn it. This mechanism creates a direct link
        between exchange usage and HYPE value — as trading volume grows, more HYPE is bought and burned,
        reducing circulating supply. This is covered in detail in the buy-and-burn section below.
      </P>

      <H2 id="staking-hype">Staking HYPE</H2>
      <P>
        There are two primary approaches to staking HYPE: native staking directly to validators, and
        liquid staking through specialized protocols. Each has distinct advantages depending on your
        priorities. For a step-by-step walkthrough, see our{" "}
        <InlineLink href="/learn/how-to-stake-hype">How to Stake HYPE</InlineLink> guide.
      </P>
      <P>
        <strong>Native staking.</strong> You can stake HYPE directly to validators through the Hyperliquid
        app. Navigate to the staking section, choose a validator from the active set, and delegate your
        HYPE. You earn approximately 2.25% APY in consensus rewards. The tradeoff is an unbonding period
        when you want to unstake — your HYPE is locked for several days during the withdrawal process.
        Native staking is the simplest and lowest-risk option.
      </P>
      <P>
        <strong>Liquid staking with Kinetiq (kHYPE).</strong>{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> is the leading liquid staking protocol
        on Hyperliquid. When you deposit HYPE into Kinetiq, you receive kHYPE — a liquid staking token
        that represents your staked position plus accumulated rewards. kHYPE can be used throughout
        HyperEVM DeFi: as collateral on lending platforms, in liquidity pools, or held in your wallet
        while it appreciates in value relative to HYPE as staking rewards accumulate. This gives you
        staking yield plus DeFi composability.
      </P>
      <P>
        <strong>Liquid staking with StakedHYPE (stHYPE).</strong>{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> offers a similar liquid staking
        experience. Deposit HYPE, receive stHYPE, and use it across DeFi while earning staking rewards.
        StakedHYPE was built by Thunderhead (later acquired by Valantis) and provides an alternative to
        Kinetiq for users who want to diversify their liquid staking exposure across multiple protocols.
      </P>
      <P>
        <strong>Other liquid staking options.</strong> beHYPE from Bedrock is another liquid staking
        derivative available on Hyperliquid. The liquid staking landscape is still maturing, and having
        multiple competing protocols benefits users through competitive yields and reduced
        concentration risk.
      </P>

      <H2 id="the-airdrop">The HYPE Airdrop</H2>
      <P>
        The HYPE genesis airdrop on November 29, 2024, was the largest token airdrop in cryptocurrency
        history. 310 million HYPE tokens (31% of total supply) were distributed to approximately 94,000
        wallets, with a total value exceeding $1.6 billion at initial trading prices.
      </P>
      <P>
        Allocations were determined by user activity during Season 1, which ran from April to November
        2024. The primary criteria included trading volume on Hyperliquid&apos;s perpetual markets (both
        maker and taker), deposits into the HLP vault, referral activity, and overall platform engagement.
        Larger and more consistent users received proportionally larger allocations, though the
        distribution was not purely linear — there was a degree of progressive allocation that rewarded
        smaller active users more than a strict pro-rata formula would have.
      </P>
      <P>
        What made the HYPE airdrop remarkable was not just its size but its structure. Hyperliquid did not
        raise venture capital funding, which meant there were no investor allocations diluting the
        community distribution. The 31% community allocation was unusually generous compared to industry
        norms — most token launches allocate 5-15% to airdrops. The team&apos;s decision to self-fund
        development allowed them to direct a larger share to actual users.
      </P>
      <P>
        The airdrop created significant wealth for early Hyperliquid users and generated massive attention
        for the platform. It also established a precedent — the success of the airdrop demonstrated that a
        large, fair distribution to genuine users can be a more effective growth strategy than traditional
        venture-backed launches.
      </P>

      <H2 id="hype-burn">Buy-and-Burn Mechanism</H2>
      <P>
        One of HYPE&apos;s most distinctive tokenomic features is its buy-and-burn mechanism. 54% of all
        trading fees generated on Hyperliquid are allocated to a systematic process: the protocol uses
        these fees to purchase HYPE on the open market through the spot order book, and the purchased
        tokens are permanently burned — removed from circulation forever.
      </P>
      <P>
        This creates a powerful deflationary dynamic. With Hyperliquid processing over $3.4 billion in
        daily trading volume, the fee revenue directed toward buy-and-burn is substantial. As the
        platform&apos;s volume grows, the rate of HYPE burns accelerates. This means HYPE becomes
        increasingly scarce over time, with the rate of scarcity directly proportional to exchange usage.
      </P>
      <P>
        The mechanism is transparent and verifiable on-chain. Anyone can track the burn transactions and
        calculate the cumulative number of HYPE tokens removed from circulation. Since genesis, millions
        of HYPE have been permanently burned, and the daily burn rate continues to increase as
        Hyperliquid&apos;s volume grows.
      </P>
      <P>
        The buy-and-burn approach differs from traditional token buyback programs in an important way:
        buybacks that add tokens to a treasury can always be reversed (the treasury can sell), but burned
        tokens are gone permanently. This makes the deflationary pressure irreversible and gives HYPE
        holders confidence that the supply reduction is real and lasting.
      </P>

      <H2 id="price-history">HYPE Price History</H2>
      <P>
        HYPE launched at approximately $2 during the genesis event on November 29, 2024. The token
        quickly appreciated as market participants recognized the platform&apos;s strong fundamentals —
        billions in daily trading volume, no VC dilution, and the aggressive buy-and-burn mechanism.
        Within weeks of launch, HYPE had risen significantly from its opening price.
      </P>
      <P>
        The token&apos;s price has been influenced by several key factors: overall crypto market sentiment,
        Hyperliquid&apos;s trading volume (which drives the buy-and-burn rate), new market listings and
        platform features, ecosystem growth on HyperEVM, and broader narratives around decentralized
        perpetual exchanges. HYPE has generally traded in correlation with the broader crypto market but
        with higher beta — it tends to outperform during risk-on periods and underperform during
        risk-off periods.
      </P>
      <P>
        For the most current price and detailed analysis, see our{" "}
        <InlineLink href="/learn/hype-token-guide">HYPE Token Guide</InlineLink> which covers
        tokenomics, staking, and governance in additional depth.
      </P>

      <H2 id="where-to-buy">Where to Buy HYPE</H2>
      <P>
        <strong>Hyperliquid spot market.</strong> The primary and most liquid venue for buying HYPE is
        Hyperliquid&apos;s native spot order book at app.hyperliquid.xyz. This offers the tightest
        spreads, deepest liquidity, and direct access to the token without bridging to external chains.
        You can buy HYPE with USDC on the spot market.
      </P>
      <P>
        <strong>Centralized exchanges.</strong> HYPE is listed on several centralized exchanges including
        KuCoin and Gate.io. These options may be more convenient for users who already hold funds on these
        platforms, though liquidity is typically deeper on the native Hyperliquid spot market.
      </P>
      <P>
        <strong>HyperEVM DEXs.</strong> On the HyperEVM side, you can swap for HYPE on decentralized
        exchanges like HyperSwap and Laminar. These are useful if you already have assets on HyperEVM
        and want to swap without going through the native spot market. For more about the HyperEVM
        ecosystem, see our{" "}
        <InlineLink href="/learn/best-hyperevm-projects">Best HyperEVM Projects</InlineLink> guide.
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
