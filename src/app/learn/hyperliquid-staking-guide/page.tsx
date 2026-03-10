import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperliquid-staking-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Stake HYPE — Complete Staking Guide 2026",
  description:
    "Step-by-step guide to staking HYPE tokens on Hyperliquid. Covers native staking, liquid staking (Kinetiq), APY, validators, and fee discounts. Updated 2026.",
};

const TOC = [
  { id: "overview", title: "Staking on Hyperliquid" },
  { id: "hlp-vault", title: "HLP Vault" },
  { id: "hype-staking", title: "HYPE Validator Staking" },
  { id: "step-by-step", title: "Step-by-Step: How to Stake HYPE" },
  { id: "validator-comparison", title: "Validator Comparison" },
  { id: "liquid-staking", title: "Liquid Staking (kHYPE, stHYPE)" },
  { id: "liquid-vs-direct", title: "Liquid Staking vs Direct Staking" },
  { id: "yield-strategies", title: "Advanced Yield Strategies" },
  { id: "apy-context", title: "Current APY Context" },
  { id: "unstaking-and-tax", title: "Unstaking and Tax Implications" },
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

      <H2 id="overview">Staking on Hyperliquid</H2>
      <P>
        Hyperliquid offers several ways to earn yield on your capital. Whether you want passive
        market-making returns through the HLP vault, consensus rewards from staking HYPE to
        validators, or leveraged yield through liquid staking DeFi strategies, the ecosystem has
        options for every risk tolerance. This guide covers all of them.
      </P>
      <P>
        Understanding the differences between these yield opportunities is essential for making
        informed allocation decisions. Each approach carries its own risk-reward profile, lockup
        constraints, and tax implications. In the sections that follow, we walk through every
        option available on Hyperliquid today, from the simplest vault deposit to advanced
        recursive staking loops, and help you determine which approach fits your situation.
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
        extreme volatility, though HLP has proven resilient across multiple market cycles. Because
        HLP is denominated in USDC, you avoid direct HYPE price exposure — an important distinction
        from staking, where your returns are in HYPE and subject to token price fluctuations.
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
        APY for direct staking. Validators charge a commission fee (a percentage of your earned
        rewards), which varies by validator — some charge as low as 2%, while others may charge
        10% or more. Choosing the right validator matters for your net return.
      </P>

      <H2 id="step-by-step">Step-by-Step: How to Stake HYPE</H2>
      <P>
        Staking HYPE directly to a validator is straightforward, but it involves a few steps if
        you are starting from scratch. Here is the complete process from zero to earning staking
        rewards.
      </P>
      <P>
        <strong>Step 1: Set up your wallet.</strong> You can use MetaMask configured for the
        Hyperliquid network, or use the native Hyperliquid wallet accessible through the
        Hyperliquid web app at app.hyperliquid.xyz. The native wallet is the simplest option —
        you create it directly from the Hyperliquid interface and it handles all chain-specific
        configuration automatically. If you prefer MetaMask, you will need to add the Hyperliquid
        L1 network manually (chain ID and RPC endpoint are available in the Hyperliquid
        documentation).
      </P>
      <P>
        <strong>Step 2: Bridge USDC to Hyperliquid.</strong> Hyperliquid accepts USDC bridged
        from Arbitrum. Go to the deposit page on app.hyperliquid.xyz, connect your Arbitrum
        wallet, and bridge your desired amount of USDC. The bridge typically completes within a
        few minutes. You will need a small amount of ETH on Arbitrum for the bridge transaction
        gas fee.
      </P>
      <P>
        <strong>Step 3: Buy HYPE on the spot order book.</strong> Once your USDC is on
        Hyperliquid, navigate to the spot trading page and find the HYPE/USDC pair. Place a
        market order or limit order to acquire the amount of HYPE you want to stake. There are
        no gas fees for trading on Hyperliquid, so the only cost is the standard trading fee.
      </P>
      <P>
        <strong>Step 4: Navigate to the Staking tab.</strong> From the Hyperliquid app, find
        the Staking section. This shows the list of active validators, their commission rates,
        total delegated stake, and uptime statistics. Take time to review the options before
        committing.
      </P>
      <P>
        <strong>Step 5: Choose a validator.</strong> This is the most important decision. Consider
        three factors: commission rate (lower means more rewards for you), uptime (higher is
        better — validators with poor uptime may get slashed), and total stake (distributing
        stake across smaller validators helps decentralize the network). We cover specific
        validators in the comparison section below.
      </P>
      <P>
        <strong>Step 6: Confirm the delegation transaction.</strong> Enter the amount of HYPE
        you want to delegate and confirm the transaction. Your HYPE is now staked and begins
        earning rewards immediately. There is no gas fee for the staking transaction on
        Hyperliquid.
      </P>
      <P>
        <strong>Step 7: Track rewards in the staking dashboard.</strong> The staking interface
        shows your total staked amount, accrued rewards, current APY, and the validator you are
        delegated to. Rewards accrue continuously and can be claimed at any time. You can also
        redelegate to a different validator without unstaking first, though there may be a
        cooldown period for redelegation.
      </P>

      <H2 id="validator-comparison">Validator Comparison</H2>
      <P>
        Choosing the right validator affects both your returns and the health of the network.
        Below is a summary of some well-known validators on Hyperliquid. Note that commission
        rates and performance metrics change over time — always check the live data in the
        Hyperliquid staking dashboard before making a decision.
      </P>
      <ComparisonTable
        headers={["Validator", "Commission", "Notes"]}
        rows={[
          ["Hyper Foundation", "Low", "Official foundation validator; largest stake; reliable uptime"],
          ["Nansen", "Moderate", "Blockchain analytics firm; well-resourced infrastructure"],
          ["Figment", "Moderate", "Institutional-grade staking provider; multi-chain operator"],
          ["Chorus One", "Moderate", "Multi-chain validator; operates across 50+ networks"],
          ["Luganodes", "Moderate", "Enterprise-grade infrastructure; Swiss-based operator"],
        ]}
      />
      <P>
        The Hyper Foundation validator typically has the lowest commission rate and the largest
        amount of delegated stake. While delegating to the foundation is the safest and simplest
        choice, it concentrates stake in a single entity. For the long-term health of the
        network, consider spreading your delegation across multiple validators, including smaller
        independent operators. A more decentralized validator set makes the network more resilient
        against attacks and censorship.
      </P>
      <P>
        When evaluating validators beyond those listed above, look for consistent uptime above
        99%, reasonable commission rates (typically 2-10%), and transparent communication from the
        validator team. Some validators also run MEV (Maximal Extractable Value) protection or
        contribute to open-source tooling for the Hyperliquid ecosystem, which can be additional
        factors in your decision.
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
        leveraged staking strategies. Kinetiq distributes staked HYPE across multiple validators,
        which improves network decentralization compared to individual delegation.
      </P>
      <P>
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink> (now operated by Valantis
        Labs) offers stHYPE with approximately $200M in TVL. stHYPE is similarly composable across
        HyperEVM DeFi and is deeply integrated with multiple protocols. The acquisition by
        Valantis means stHYPE benefits from deep DEX liquidity through Valantis STEX pools,
        making stHYPE easy to trade without significant slippage.
      </P>

      <H2 id="liquid-vs-direct">Liquid Staking vs Direct Staking</H2>
      <P>
        The choice between liquid staking and direct staking depends on how you plan to use your
        capital. Both earn the same underlying validator rewards, but they differ significantly in
        flexibility, risk, and potential total return.
      </P>
      <ComparisonTable
        headers={["", "Direct Staking", "Liquid Staking (Kinetiq)"]}
        rows={[
          ["APY", "5-10%", "Similar base + DeFi yield"],
          ["Liquidity", "Locked (7-day unbonding)", "Liquid kHYPE token"],
          ["Complexity", "Simple delegation", "Composable across DeFi"],
          ["Smart Contract Risk", "None (native protocol)", "Yes (staking protocol + DeFi)"],
          ["Additional Yield", "No", "Yes (lending, looping, LPing)"],
        ]}
      />
      <P>
        <strong>When to use direct staking:</strong> If you are a long-term HYPE holder who
        wants a simple, low-risk way to earn consensus rewards without interacting with DeFi
        smart contracts, direct staking is the right choice. You accept the 7-day unbonding
        period in exchange for zero smart contract risk. Direct staking is also appropriate if
        you are delegating a large amount and want to minimize the number of protocols your
        capital touches.
      </P>
      <P>
        <strong>When to use liquid staking:</strong> If you want to maximize capital efficiency,
        liquid staking lets you earn staking rewards and simultaneously deploy your capital in
        DeFi. You can use kHYPE as collateral to borrow stablecoins on Felix Protocol, provide
        liquidity on HyperSwap or Valantis, or loop through lending protocols for amplified
        yield. The trade-off is additional smart contract risk — if Kinetiq or StakedHYPE had a
        vulnerability, your staked HYPE could be at risk. For most DeFi-active users, liquid
        staking is the preferred approach because it unlocks significantly more capital
        efficiency.
      </P>

      <H2 id="yield-strategies">Advanced Yield Strategies</H2>
      <P>
        The composability of liquid staking tokens enables advanced strategies.{" "}
        <InlineLink href="/projects/looped-hype">Looped HYPE</InlineLink> offers recursive
        staking strategies with 3x to 15x leverage, targeting around 10% APY by looping HYPE
        through staking and lending protocols. The mechanism works like this: stake HYPE for
        kHYPE, deposit kHYPE as collateral, borrow HYPE, stake that HYPE for more kHYPE, and
        repeat. Each loop amplifies your staking yield but also amplifies your liquidation risk.
      </P>
      <P>
        Yield aggregators like <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink> and{" "}
        <InlineLink href="/projects/mizu">Mizu</InlineLink> automate deployment across multiple
        DeFi protocols to optimize returns. HyperBeat&apos;s Meta Vaults use delta-neutral
        strategies, while Mizu offers multi-asset vaults (HyperETH, HyperBTC, HyperUSD) built on
        Veda&apos;s BoringVault infrastructure. These aggregators handle the complexity of
        rebalancing and compounding, making advanced strategies accessible to users who do not
        want to manage positions manually.
      </P>

      <H2 id="apy-context">Current APY Context</H2>
      <P>
        Staking yield on Hyperliquid comes from two sources: protocol fees redistributed to
        validators and their delegators, and new HYPE issuance as part of the network&apos;s
        inflation schedule. The combination of these two revenue streams determines the total
        staking APY at any given time.
      </P>
      <P>
        The typical range for direct staking APY is 5-10%. This rate is dynamic — when fewer
        HYPE tokens are staked, the per-token reward is higher because the same pool of rewards
        is distributed across fewer tokens. Conversely, as more HYPE gets staked, the APY
        compresses. This self-regulating mechanism means APY tends to settle at a level that
        balances the opportunity cost of locking HYPE against the rewards earned.
      </P>
      <P>
        It is worth comparing staking yield to the{" "}
        <InlineLink href="/learn/hlp-vault-guide">HLP vault</InlineLink>, which historically
        returns 10-30% APR. However, the two are fundamentally different products. HLP vault
        returns are denominated in USDC, variable, and depend on market-making performance. HLP
        has no lock-up period but carries market-making risk (drawdowns during extreme volatility).
        Staking returns are denominated in HYPE, more predictable, but subject to HYPE price
        fluctuations and a 7-day unbonding period. Many users allocate to both: USDC in HLP for
        stable yield and HYPE staked for consensus rewards and network participation.
      </P>
      <P>
        For liquid stakers, the total yield can exceed direct staking APY significantly. By
        using kHYPE as collateral on Felix Protocol to mint feUSD, then deploying that feUSD in
        yield opportunities, you can layer additional returns on top of the base staking rate.
        Looped strategies can push effective APY into the 10-20% range, though this comes with
        proportionally higher risk.
      </P>

      <H2 id="unstaking-and-tax">Unstaking and Tax Implications</H2>
      <P>
        <strong>Unstaking mechanics:</strong> Direct staking on Hyperliquid has a 7-day unbonding
        period. When you initiate an unstake, your HYPE stops earning rewards immediately, but
        you cannot access the tokens for seven days. Plan your exits in advance — if you think
        you might need liquidity quickly, liquid staking is a better option. With Kinetiq or
        StakedHYPE, you can swap kHYPE or stHYPE back to HYPE instantly on DEXs like HyperSwap
        or Valantis, subject to available liquidity and potential slippage.
      </P>
      <P>
        Redelegation (moving your stake from one validator to another) may also involve a
        cooldown period. Check the current redelegation rules in the Hyperliquid staking
        interface before making changes, especially if you are delegating a large amount.
      </P>
      <P>
        <strong>Tax considerations (United States):</strong> In the United States, staking
        rewards are generally treated as ordinary income at the time they are received. This
        means each time you claim staking rewards, you owe income tax on the fair market value
        of the HYPE tokens received at the time of receipt. Your cost basis for those tokens is
        the fair market value at the time of receipt, which becomes relevant when you later sell
        or trade them (triggering a separate capital gains or loss event).
      </P>
      <P>
        For liquid staking tokens like kHYPE that appreciate in value rather than distributing
        discrete rewards, the tax treatment is less clear. Some tax professionals argue that
        appreciation in a liquid staking token should not be taxable until the token is sold or
        exchanged, while others take a more conservative view. The IRS has not issued specific
        guidance on liquid staking tokens as of early 2026.
      </P>
      <P>
        <strong>This is not tax advice.</strong> Tax treatment of staking rewards varies by
        jurisdiction and individual circumstances. Consult a qualified tax professional who
        understands cryptocurrency taxation before making decisions based on tax considerations.
        Keep detailed records of all staking transactions, reward claims, and token swaps for
        your tax reporting.
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
        risk should decrease. Slashing risk exists for validators that behave maliciously or
        suffer extended downtime, which could result in loss of a portion of delegated stake.
        While slashing events have been rare, they are a feature of proof-of-stake systems
        and should be factored into your risk assessment.
      </P>
      <P>
        HYPE price risk affects all staking strategies. Even if you earn 8% APY in HYPE, a
        30% decline in HYPE price means you are underwater in USD terms. Direct staking is
        most exposed to this risk because of the 7-day unbonding period — you cannot exit
        quickly during a market crash. Liquid staking mitigates this somewhat since you can
        sell kHYPE or stHYPE immediately, but LST liquidity can thin out during market stress.
        Always consider your risk tolerance before committing capital to any yield strategy.
      </P>

      <CTA href="/projects?category=Yield+%26+Vaults">Browse yield protocols &rarr;</CTA>
    </LearnLayout>
  );
}
