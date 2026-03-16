import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import { LiveEcosystemStats, LiveTopOI } from "@/components/learn/LiveData";
import { NumberCalloutRow } from "@/components/learn/UiBlocks";
import { ProjectLogoGrid } from "@/components/learn/ProjectGrid";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SLUG = "what-is-hyperliquid";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "What Is Hyperliquid? Complete Guide 2026",
  description:
    "Hyperliquid explained: how the DEX works, HYPE token, HLP vault, HyperEVM, fees, and why it dominates decentralized perp trading with $40B+ weekly volume.",
  openGraph: {
    title: "What Is Hyperliquid? Complete Guide 2026",
    description:
      "Hyperliquid explained: how the DEX works, HYPE token, HLP vault, HyperEVM, fees, and why it dominates decentralized perp trading with $40B+ weekly volume.",
    type: "article",
  },
};

const TOC = [
  { id: "what-is-hyperliquid", title: "What Is Hyperliquid?" },
  { id: "hypercore-l1", title: "The HyperCore L1" },
  { id: "how-trading-works", title: "How Trading Works" },
  { id: "hype-token", title: "The HYPE Token" },
  { id: "why-traders-use-it", title: "Why Traders Use It" },
  { id: "ecosystem", title: "The Ecosystem" },
  { id: "growth-story", title: "Hyperliquid's Growth Story" },
  { id: "how-hl-makes-money", title: "How Hyperliquid Makes Money" },
  { id: "hype-airdrop", title: "The HYPE Airdrop" },
  { id: "is-hl-safe", title: "Is Hyperliquid Safe?" },
  { id: "key-risks", title: "Key Risks" },
];

export default async function WhatIsHyperliquidPage() {
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

      <LiveEcosystemStats />

      <H2 id="what-is-hyperliquid">What Is Hyperliquid?</H2>
      <P>
        Hyperliquid is a high-performance Layer 1 blockchain built from the ground up for
        on-chain perpetual futures trading. Unlike most decentralized exchanges that run on
        top of general-purpose blockchains like Ethereum or Solana, Hyperliquid operates its
        own dedicated chain optimized specifically for order book trading.
      </P>
      <P>
        The result is a trading experience that rivals centralized exchanges: sub-second
        transaction finality, no gas fees for placing orders, and the ability to process up to
        200,000 orders per second. Launched in late 2023, Hyperliquid quickly grew to become
        the highest-volume perpetual DEX in crypto — processing over $3.4B in daily volume across
        229 markets and capturing 10.2% of all perpetual trading (up from 2% two years ago).
      </P>
      <P>
        What makes Hyperliquid unique is its fully on-chain order book. While most DEXs use
        automated market makers (AMMs) that pool liquidity, Hyperliquid uses a central limit
        order book (CLOB) — the same model used by Binance, the NYSE, and every traditional
        exchange. This means traders can place limit orders, stop losses, and take profits
        with the same precision they expect from centralized platforms.
      </P>

      <H2 id="hypercore-l1">The HyperCore L1</H2>

      <NumberCalloutRow items={[
        { value: "~200ms", label: "Block Time" },
        { value: "200K+", label: "Orders/Second", sub: "peak throughput" },
        { value: "229+", label: "Active Markets" },
      ]} />

      <P>
        At the heart of Hyperliquid is HyperCore — a custom Layer 1 blockchain running the
        HyperBFT consensus mechanism. HyperBFT is a modified version of HotStuff, the same
        family of consensus algorithms used by Meta&apos;s abandoned Diem project, but
        optimized for trading workloads.
      </P>
      <P>
        HyperCore achieves its speed by separating the consensus layer from the execution
        layer. All trading orders flow through a deterministic state machine that processes
        them sequentially, ensuring consistent ordering without the non-determinism that
        plagues general-purpose blockchains. The chain finalizes blocks in under one second,
        meaning trades confirm almost instantly.
      </P>
      <P>
        The chain also supports HyperEVM — a fully compatible Ethereum Virtual Machine that
        runs as a separate execution environment on the same L1. This lets developers deploy
        Solidity smart contracts (DeFi protocols, lending platforms, NFT marketplaces) while
        leveraging HyperCore&apos;s speed and liquidity. Read more in our{" "}
        <InlineLink href="/learn/hypercore-vs-hyperevm">HyperCore vs HyperEVM guide</InlineLink>.
      </P>

      <H2 id="how-trading-works">How Trading Works</H2>
      <P>
        Trading on Hyperliquid works through a fully on-chain order book. When you place a
        trade, your order is submitted to the blockchain, matched against the book, and
        settled — all on-chain, all in under a second. There are no off-chain order relays,
        no centralized sequencers making matching decisions, and no trust assumptions beyond
        the chain&apos;s own consensus.
      </P>
      <P>
        The platform supports over 100 perpetual futures markets including BTC, ETH, SOL, and
        dozens of altcoins. Leverage ranges from 1x to 50x depending on the asset. Funding
        rates are calculated every hour based on the spread between the perpetual price and
        the spot index price, similar to how centralized exchanges handle perps.
      </P>
      <P>
        For spot trading, Hyperliquid operates a native spot order book with direct token
        listings. HIP-1 governs native token standards, while HIP-2 provides a mechanism for
        bootstrapping liquidity on new spot listings.
      </P>

      <H2 id="hype-token">The HYPE Token</H2>
      <P>
        HYPE is the native token of the Hyperliquid ecosystem. It serves multiple purposes:
        staking for network security, governance over protocol parameters, and as the base gas
        token for HyperEVM transactions. The token launched via one of the largest airdrops in
        crypto history, distributing a significant portion of supply to early traders and
        community members.
      </P>
      <P>
        HYPE can be staked directly to Hyperliquid validators to earn staking rewards. A
        growing ecosystem of liquid staking protocols — including{" "}
        <InlineLink href="/projects/kinetiq">Kinetiq (kHYPE)</InlineLink>,{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE (stHYPE)</InlineLink>, and others
        — allow users to stake while maintaining liquidity. These liquid staking tokens have
        become foundational DeFi primitives on HyperEVM.
      </P>

      <H2 id="why-traders-use-it">Why Traders Use It</H2>
      <P>
        Hyperliquid&apos;s appeal comes down to a few key advantages over both centralized and
        decentralized alternatives. First, the performance: order placement and execution is
        fast enough that active traders can run strategies that would be impossible on slower
        chains. Second, the cost: trading fees are competitive with centralized exchanges, and
        there are no gas costs for order placement.
      </P>
      <P>
        Third, and perhaps most importantly: self-custody. Funds stay in your own wallet at
        all times. There is no deposit to a centralized entity, no KYC requirement, and no
        withdrawal delay. The rise of exchange bankruptcies and frozen withdrawals in recent
        years has driven significant volume toward non-custodial alternatives, and
        Hyperliquid&apos;s professional-grade execution makes it the most credible option.
      </P>
      <P>
        The platform also supports vault strategies, where users can deposit into
        community-managed trading vaults that execute strategies on their behalf — a feature
        that has attracted both retail and institutional participants.
      </P>

      <H2 id="ecosystem">The Ecosystem</H2>
      <P>
        Beyond the core trading platform, a rich ecosystem has developed around Hyperliquid.
        On HyperEVM, lending protocols like{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> and{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> allow users to
        borrow against their HYPE and liquid staking tokens. DEXs like{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> and{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink> provide spot trading
        for HyperEVM-native tokens.
      </P>

      <ProjectLogoGrid
        slugs={["hyperlend", "kinetiq", "stakedhype", "hyperswap", "felix-protocol", "across-protocol", "redstone"]}
        title="Key Ecosystem Projects"
        showTagline
      />

      <LiveTopOI topN={5} />

      <P>
        HIP-3, the permissionless perpetual market standard, has enabled prediction markets,
        stock perpetuals, and other novel financial products. Read our{" "}
        <InlineLink href="/learn/what-is-hip-3">What Is HIP-3?</InlineLink> guide for a deep dive.
      </P>

      <H2 id="growth-story">Hyperliquid&apos;s Growth Story</H2>
      <P>
        Hyperliquid&apos;s trajectory from obscure testnet to the largest perpetual DEX in crypto
        is one of the most striking growth stories in decentralized finance. The platform launched
        its mainnet in late 2023 with a handful of markets and minimal fanfare — no venture capital
        announcements, no celebrity endorsements, no token sale. Just a fast order book and word of
        mouth from traders who noticed the execution quality.
      </P>
      <P>
        Within months, daily volume climbed past $100M. By mid-2024, Hyperliquid was consistently
        processing over $1B per day. As of early 2026, the numbers speak for themselves: $3.4B in
        average daily volume, $40B or more in weekly volume, and 229 listed perpetual markets
        spanning major crypto assets, altcoins, meme tokens, and HIP-3 external assets.
      </P>
      <P>
        The market share numbers tell an even more compelling story. Two years ago, Hyperliquid
        accounted for roughly 2% of all perpetual futures trading across centralized and
        decentralized venues. Today that figure stands at 10.2% — a five-fold increase that has
        come almost entirely at the expense of centralized exchanges. Among DEX-only perpetual
        volume, Hyperliquid commands approximately 32% of the market, making it the undisputed
        leader in on-chain derivatives trading.
      </P>
      <P>
        This growth was not driven by unsustainable incentives or wash trading. Hyperliquid never
        ran a liquidity mining program in the traditional sense. Instead, growth was organic:
        professional traders migrated because the execution was genuinely competitive with Binance
        and Bybit. Market makers came because the order book model was familiar and the latency
        was acceptable. Retail traders followed because the interface was clean and onboarding was
        simple — deposit USDC from Arbitrum, and you are trading in under a minute.
      </P>
      <P>
        The launch of HyperEVM in early 2025 accelerated growth further by creating an entire DeFi
        ecosystem around the trading platform. Suddenly, traders could stake their HYPE, borrow
        against it, earn yield in lending markets, and deploy into automated strategies — all
        without leaving the Hyperliquid L1. Total value locked across HyperEVM protocols grew from
        near zero to over $2B within months, creating a flywheel where DeFi activity generated more
        trading volume, which attracted more liquidity, which enabled more DeFi.
      </P>

      <H2 id="how-hl-makes-money">How Hyperliquid Makes Money</H2>
      <P>
        Understanding Hyperliquid&apos;s revenue model is important for anyone evaluating HYPE as
        an investment or simply trying to understand the protocol&apos;s sustainability. Unlike
        many DeFi protocols that rely on token emissions to subsidize activity, Hyperliquid
        generates real revenue from trading fees — and it generates a lot of it.
      </P>
      <P>
        The fee structure follows the standard maker-taker model familiar from centralized
        exchanges. Taker fees — charged to traders who remove liquidity from the order book by
        placing market orders or crossing the spread — range from 0.035% to 0.045% depending on
        the trader&apos;s volume tier. Maker fees are actually negative: makers (traders who add
        liquidity by placing limit orders that rest on the book) receive a rebate of approximately
        0.01% per fill. This negative maker fee is a deliberate incentive to encourage deep order
        books and tight spreads.
      </P>
      <P>
        At $3.4B in daily volume, even small fee percentages generate substantial revenue. Rough
        math: if 60% of volume is taker-side at an average rate of 0.04%, that is approximately
        $816,000 in daily taker fee revenue. Subtract maker rebates and the net daily fee revenue
        is still in the hundreds of thousands of dollars — adding up to tens of millions per month.
      </P>
      <P>
        Beyond direct trading fees, the HLP vault is another revenue center. HLP (Hyperliquidity
        Provider) is a protocol-operated vault that acts as a market maker across all perpetual
        markets. It earns revenue from the bid-ask spread, from funding rate arbitrage, and from
        successful liquidations. When traders get liquidated, their remaining margin (after covering
        the position) flows to the insurance fund and, in part, to HLP. Depositors in the HLP
        vault share these returns, which have historically averaged in the low double-digit APY
        range, though with significant variance.
      </P>
      <P>
        A portion of fee revenue flows to the Assistance Fund, which conducts open-market HYPE
        buybacks. These buybacks create consistent buy pressure on the HYPE token, effectively
        redistributing protocol revenue to token holders. The buyback mechanism is transparent and
        can be tracked on-chain — the Assistance Fund wallet is publicly known and its transactions
        are visible to anyone. This creates a direct link between trading volume and token value
        that many protocols lack.
      </P>

      <H2 id="hype-airdrop">The HYPE Airdrop</H2>
      <P>
        The HYPE token genesis event in November 2024 was, by most measures, the largest airdrop
        in cryptocurrency history. Over $1.9 billion worth of HYPE tokens were distributed to early
        users of the platform, making it not just the largest by dollar value but also one of the
        most broadly distributed token launches ever conducted.
      </P>
      <P>
        What made the HYPE airdrop remarkable was not just its size but its structure. There was no
        venture capital allocation. Zero. In an industry where 15-25% of token supply routinely goes
        to investors who bought at a fraction of the public price, Hyperliquid allocated 76% of the
        total HYPE supply to the community. This was a deliberate philosophical choice by the team:
        the protocol was self-funded, and the team believed that the people who used the product
        should own the majority of it.
      </P>
      <P>
        The airdrop was based primarily on trading activity during Hyperliquid&apos;s first year of
        operation. Traders who had generated volume, provided liquidity, or otherwise contributed to
        the ecosystem received allocations proportional to their activity. There were no complex
        quest systems, no social media tasks, and no referral games. You traded, and you were
        rewarded based on how much you traded.
      </P>
      <P>
        Critically, community recipients had no lockup period. When HYPE launched, airdrop
        recipients could immediately sell, stake, or use their tokens however they chose. This was
        another deliberate decision — the team did not want to create artificial sell pressure cliffs
        months or years down the line. If the product was good enough, the team reasoned, people
        would hold voluntarily.
      </P>
      <P>
        The team and future contributor tokens, by contrast, are on a multi-year vesting schedule.
        Team tokens unlock gradually over several years, ensuring long-term alignment between the
        core developers and the protocol&apos;s success. This is the inverse of the typical crypto
        pattern where insiders have short lockups and the community is left holding the bag.
      </P>
      <P>
        The market&apos;s response to this structure was overwhelmingly positive. Despite the
        absence of any lockup for community tokens, HYPE traded upward after launch — a signal that
        recipients saw long-term value in holding rather than immediately liquidating. The token
        reached a market capitalization of over $10B within weeks of launch, establishing it as a
        top-30 cryptocurrency by market cap.
      </P>

      <H2 id="is-hl-safe">Is Hyperliquid Safe?</H2>
      <P>
        Safety on Hyperliquid requires evaluating several distinct layers: the consensus mechanism,
        the bridge, the smart contract ecosystem on HyperEVM, and the governance structure. Each
        carries its own risk profile, and informed users should understand all of them.
      </P>
      <P>
        On the consensus side, Hyperliquid currently operates with 25 active validators running
        HyperBFT. This validator set is growing — the protocol has a roadmap to expand it
        significantly — but 25 is still small compared to networks like Ethereum (hundreds of
        thousands of validators) or even Solana (roughly 1,500). A smaller validator set means
        lower decentralization, which in turn means more trust in a smaller group of operators. In
        practice, the validators have performed reliably, and the chain has never experienced a
        consensus failure or unplanned downtime. But &quot;never has failed&quot; is not the same
        as &quot;cannot fail,&quot; and users should weigh this accordingly.
      </P>
      <P>
        The bridge is perhaps the most important trust assumption in the system. To trade on
        Hyperliquid, users deposit USDC from Arbitrum (an Ethereum L2) into the Hyperliquid bridge
        contract. This bridge is secured by a subset of Hyperliquid validators who run the bridge
        signer software. Deposits are fast and reliable, but the bridge represents a concentrated
        point of risk: if enough bridge signers were compromised simultaneously, bridge funds could
        theoretically be at risk. The Hyperliquid team has taken steps to mitigate this — including
        timelocks on large withdrawals and monitoring systems — but bridge risk is inherent in any
        cross-chain system.
      </P>
      <P>
        The March 2025 JELLY incident is worth examining in detail because it revealed both the
        strengths and limitations of Hyperliquid&apos;s safety model. A whale trader attempted to
        manipulate the JELLY perpetual market through a coordinated strategy: they built a large
        short position on Hyperliquid while simultaneously pumping the JELLY spot price on external
        markets. The goal was to trigger liquidations and force the HLP vault to absorb a losing
        position at manipulated prices.
      </P>
      <P>
        The attack partially succeeded in that HLP took a temporary unrealized loss. However, the
        validator set responded by voting to delist the JELLY perpetual market entirely, unwinding
        positions at a fair price determined by the validators. The HLP vault recovered its losses
        once the manipulated positions were closed out. No user funds were lost, and the attacker
        did not profit from the manipulation.
      </P>
      <P>
        The JELLY incident demonstrated that Hyperliquid&apos;s governance can respond quickly to
        threats — the entire resolution happened within hours. But it also highlighted a
        centralization concern: the validator set effectively made a discretionary decision to
        delist a market and settle positions at a price they determined was fair. In a perfectly
        decentralized system, such unilateral action would not be possible. Whether this is a
        feature (fast crisis response) or a bug (centralized control) depends on your perspective,
        and it remains one of the most debated aspects of Hyperliquid&apos;s design.
      </P>
      <P>
        On the audit front, HyperCore&apos;s core trading logic has been reviewed by security
        firms, but the full audit history is not as extensive as older protocols like Aave or
        Uniswap. HyperEVM smart contracts are audited on a per-project basis — some protocols like
        Felix and Kinetiq have undergone multiple audits, while newer projects may have less
        coverage. Users should check individual project audit statuses before depositing funds.
      </P>

      <H2 id="key-risks">Key Risks</H2>
      <P>
        Hyperliquid is not without risks. The chain is still relatively young and operates
        with a smaller validator set than more established networks. While trading is
        non-custodial, the bridge from Ethereum (used to deposit USDC) has its own trust
        assumptions. Smart contract risk on HyperEVM is real, particularly for newer DeFi
        protocols that may not have undergone thorough audits.
      </P>
      <P>
        Perpetual futures trading itself carries significant financial risk. Leverage amplifies
        both gains and losses, and liquidation can happen quickly in volatile markets. Users
        should understand these risks thoroughly before trading.
      </P>
      <P>
        Finally, regulatory uncertainty remains a factor. Like all decentralized trading
        platforms, Hyperliquid operates in a gray area in many jurisdictions. The regulatory
        landscape is evolving, and users should stay informed about the rules in their region.
      </P>

      <CTA href="/">Browse the full ecosystem &rarr;</CTA>
    </LearnLayout>
  );
}
