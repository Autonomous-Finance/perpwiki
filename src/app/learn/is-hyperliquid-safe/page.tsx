import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, Callout, KeyFacts, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "is-hyperliquid-safe";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Is Hyperliquid Safe? Security, Risks & Honest Review 2026",
  description:
    "Is Hyperliquid safe to trade on? Independent review of Hyperliquid's security model, smart contract audits, custody, decentralization, and real risks. Updated 2026.",
  openGraph: {
    title: "Is Hyperliquid Safe? Security, Risks & Honest Review 2026",
    description:
      "Is Hyperliquid safe to trade on? Independent review of Hyperliquid's security model, smart contract audits, custody, decentralization, and real risks. Updated 2026.",
    type: "article",
  },
};

const TOC = [
  { id: "tldr", title: "TL;DR" },
  { id: "how-funds-work", title: "How Hyperliquid Handles Your Funds" },
  { id: "security-track-record", title: "Security Track Record" },
  { id: "centralization-risks", title: "Centralization Risks" },
  { id: "specific-risks", title: "Specific Risks to Know" },
  { id: "vs-cex", title: "How It Compares to CEXs" },
  { id: "verdict", title: "Verdict" },
];

const FAQ = [
  {
    question: "Has Hyperliquid been hacked?",
    answer:
      "No. As of March 2026, Hyperliquid has not suffered a direct hack or loss of user funds. The most notable security event was the March 2025 JELLY incident, where a trader attempted to manipulate the HLP vault through a coordinated long squeeze on a low-liquidity token. Hyperliquid intervened by delisting the token and settling positions at a favorable price, preventing losses — but the intervention itself drew criticism for being a centralized decision.",
  },
  {
    question: "Is HYPE token safe to hold?",
    answer:
      "HYPE is a speculative asset subject to standard crypto market volatility. Holding HYPE in a self-custodial wallet is as secure as holding any other crypto token — your risk is market price risk, not custody risk. The token has no smart contract exploit risk as it is a native L1 asset on Hyperliquid, not an ERC-20.",
  },
  {
    question: "Is Hyperliquid KYC-required?",
    answer:
      "No. Hyperliquid does not require KYC (Know Your Customer) identity verification. You connect a crypto wallet and trade pseudonymously. However, your on-chain activity is publicly visible on the blockchain, so it is not fully anonymous.",
  },
  {
    question: "Can US users use Hyperliquid?",
    answer:
      "Hyperliquid's terms of service restrict US persons from trading on the platform. In practice, the platform does not enforce geographic restrictions at the protocol level — there are no IP blocks or KYC checks. However, trading as a US person would be in violation of the terms of service and potentially of US regulatory requirements around unregistered derivatives trading. Use caution and consult your own legal advice.",
  },
];

export default function IsHyperliquidSafePage() {
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
          publisher: {
            "@type": "Organization",
            name: "perp.wiki",
            url: "https://perp.wiki",
            logo: { "@type": "ImageObject", url: "https://perp.wiki/icon.svg" },
          },
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

      <H2 id="tldr">TL;DR</H2>
      <Callout type="info">
        Hyperliquid is reasonably safe for a decentralized perpetual futures exchange — it has a clean hack record,
        non-custodial architecture, and fast on-chain settlement. However, it carries real risks: a small validator set
        controlled by the Hyperliquid Foundation, bridge trust assumptions for deposits, and oracle manipulation
        exposure on thin markets. It is safer than a CEX in terms of custody, but riskier in terms of decentralization
        and regulatory clarity. Read the full breakdown below before deciding whether to trade there.
      </Callout>
      <KeyFacts
        facts={[
          { label: "Custody model", value: "Non-custodial (you hold keys)" },
          { label: "Hack history", value: "No user funds lost to date" },
          { label: "Validator set", value: "~25 validators (Foundation-controlled)" },
          { label: "Smart contract audits", value: "Partial (bridge audited; L1 proprietary)" },
          { label: "KYC required", value: "No" },
          { label: "US users", value: "Restricted by ToS" },
        ]}
      />

      <H2 id="how-funds-work">How Hyperliquid Handles Your Funds</H2>
      <P>
        Hyperliquid uses a non-custodial architecture. You connect a self-custodial wallet (typically MetaMask or a
        hardware wallet) and sign transactions with your private key. No one else holds your keys or has access to your
        funds — not Hyperliquid Labs, not the Foundation, not any validator. This is a fundamental structural difference
        from centralized exchanges like Binance or Bybit, where you deposit funds into accounts controlled by the
        exchange.
      </P>
      <P>
        It is important to understand the two-layer structure of Hyperliquid. The platform runs on{" "}
        <InlineLink href="/learn/hypercore-vs-hyperevm">HyperCore and HyperEVM</InlineLink>, which are distinct
        environments. HyperCore is the native trading layer — an L1 blockchain purpose-built for the order book and
        perpetual futures engine. Your perpetual trading collateral lives here, settled and secured by the L1 consensus.
        HyperEVM is the EVM-compatible smart contract environment on the same L1, where DeFi protocols like lending
        markets and liquid staking operate. Funds in HyperEVM smart contracts are subject to the security of those
        specific contracts, which is separate from the L1 itself.
      </P>
      <P>
        Deposits to Hyperliquid are made by bridging USDC from Ethereum (or Arbitrum) through the official Hyperliquid
        bridge contract. This is a one-time trust event: you send USDC to the bridge, and equivalent USDC is credited to
        your Hyperliquid account on the L1. Withdrawals are the reverse process. The bridge is secured by a multisig —
        meaning multiple authorized parties must co-sign any bridge operation. This is a meaningful trust assumption and
        is discussed further in the risks section below.
      </P>

      <H2 id="security-track-record">Security Track Record</H2>
      <P>
        As of March 2026, Hyperliquid has not suffered a direct hack resulting in loss of user funds. This is a
        meaningful track record for a platform that has processed over $1 trillion in cumulative volume. Many
        centralized and decentralized exchanges have experienced significant security breaches within their first few
        years of operation — Hyperliquid has not.
      </P>
      <P>
        The most significant security-adjacent event in Hyperliquid&apos;s history was the{" "}
        <strong>March 2025 JELLY incident</strong>. A trader opened a large long position in JELLY, a low-liquidity
        token, and simultaneously shorted it on a separate address. When the short was liquidated at extreme losses (the
        position was so large it could not be filled at market without moving the price), it was absorbed by the HLP
        vault — putting an estimated $230M+ of HLP depositor capital at risk if the manipulation succeeded. Hyperliquid
        intervened by delisting the JELLY perpetual contract and settling all positions at a price favorable to HLP
        depositors, preventing losses.
      </P>
      <Callout type="warning">
        The JELLY incident revealed a real tension: Hyperliquid can intervene in markets to protect users, but that
        intervention is a centralized decision made by the Hyperliquid Foundation. Critics noted that delisting a token
        and manually setting a settlement price — even if the outcome was positive for users — is not behavior
        consistent with a trustless, decentralized system. It is a trade-off to understand rather than ignore.
      </Callout>
      <P>
        Hyperliquid&apos;s L1 consensus uses HyperBFT, a Byzantine fault-tolerant consensus algorithm. The validator
        set currently consists of approximately 25 validators. The network can tolerate up to one-third of validators
        acting maliciously without compromising safety. Smart contract audits have been conducted on the bridge contract
        (the critical custody interface), but the core L1 trading engine is proprietary software and has not had a
        comprehensive public audit as of this writing. Hyperliquid Labs has indicated that further security reviews are
        planned as the platform matures toward greater decentralization.
      </P>

      <H2 id="centralization-risks">Centralization Risks</H2>
      <P>
        Hyperliquid is significantly more centralized than Ethereum, Solana, or Bitcoin — and this matters for a
        security assessment. Understanding where that centralization lives is essential.
      </P>
      <P>
        The validator set is currently curated and controlled by the Hyperliquid Foundation. This means that unlike
        permissionless networks where anyone can run a validator, Hyperliquid&apos;s validators are known entities
        approved by the team. The benefit is that this simplifies coordination and enables fast upgrades. The risk is
        that if the Foundation were compromised, pressured by regulators, or acted adversarially, it could in theory
        influence the network — for example, by adding malicious validators that collectively compromise consensus.
      </P>
      <P>
        This is meaningfully different from a fully decentralized network, but it is also meaningfully different from a
        centralized exchange. The funds themselves are secured by L1 consensus, not by a company&apos;s database. Even
        in a worst-case scenario involving the Foundation, exploiting the network would require compromising a
        supermajority of validators — a much higher bar than hacking a CEX&apos;s hot wallet. The JELLY incident
        demonstrated that the Foundation can intervene in market mechanics, but not that it can unilaterally seize user
        funds.
      </P>
      <ComparisonTable
        headers={["Factor", "Hyperliquid", "Ethereum", "Binance (CEX)"]}
        rows={[
          ["Validator count", "~25 (curated)", "1M+ (permissionless)", "N/A (centralized)"],
          ["Who controls validators", "Foundation", "Permissionless", "Exchange"],
          ["Funds custody", "Your wallet / L1", "Your wallet / L1", "Exchange holds funds"],
          ["Can funds be frozen by operator?", "No (but markets can be delisted)", "No", "Yes"],
          ["Smart contract audits", "Bridge audited; L1 proprietary", "Extensive (major contracts)", "N/A"],
          ["Decentralization roadmap", "In progress", "Mature", "Not applicable"],
        ]}
      />
      <P>
        Hyperliquid has publicly committed to decentralizing its validator set over time — opening permissionless
        validator registration and moving toward community governance of protocol parameters. This is the standard
        trajectory for blockchain projects launched with a more centralized initial configuration for practical reasons.
        Whether and how quickly that roadmap is executed is something to monitor as a user.
      </P>

      <H2 id="specific-risks">Specific Risks to Know</H2>
      <P>
        Beyond the general security model, there are several specific risk categories that every Hyperliquid user should
        understand before depositing funds. These are not reasons to avoid the platform, but they are real
        considerations that should inform how much capital you put at risk and how you use it.
      </P>
      <P>
        <strong>Bridge risk.</strong> The USDC bridge connecting Ethereum/Arbitrum to Hyperliquid is the most critical
        piece of custody infrastructure in the system. Bridge hacks have been among the largest losses in crypto
        history — the Ronin bridge lost $625M in 2022, Nomad lost $190M, and Wormhole lost $320M. The Hyperliquid
        bridge uses a multisig structure, meaning it requires multiple authorized signers to process withdrawals.
        This reduces single-point-of-failure risk, but a compromise of enough signers could result in bridge funds
        being stolen. The bridge contract has been audited, but bridged capital remains the highest-risk component of
        the system. Minimizing your bridge balance (withdraw frequently rather than holding large balances) is a
        reasonable mitigation.
      </P>
      <P>
        <strong>Oracle risk.</strong> Hyperliquid perpetual markets use price oracles to determine mark prices for
        liquidation calculations and funding rate computation. On thin or low-liquidity markets, oracle prices can be
        manipulated by large market orders — as demonstrated by the JELLY incident. Mainstream markets (BTC-PERP,
        ETH-PERP) are extremely difficult to manipulate due to deep liquidity across many venues. Exotic or new token
        perps are more vulnerable. If you trade on low-cap perps, you are exposed to the possibility of oracle
        manipulation triggering an unfair liquidation or causing unusual funding rate spikes.
      </P>
      <P>
        <strong>Liquidation risk.</strong> This is standard for any leveraged trading venue. If you use leverage and
        the market moves against you enough to breach your maintenance margin, your position is liquidated. On
        Hyperliquid, liquidations are handled by the HLP vault, which absorbs positions from liquidated accounts.
        This process is fully on-chain and transparent — you can verify that your liquidation price matched protocol
        rules. However, in fast markets with low liquidity, liquidation prices can slip significantly beyond your
        expected liquidation level, especially on altcoin perps. Funding rates on popular directional trades can also
        be extremely high (positive or negative), quietly eroding position value over time if you hold leveraged
        positions for extended periods.
      </P>
      <P>
        <strong>Regulatory risk.</strong> Hyperliquid is an unregistered perpetual futures exchange. In many
        jurisdictions — including the United States — trading unregistered derivatives is legally prohibited. The
        platform restricts US persons in its terms of service, but does not enforce this technically. If regulators
        in your jurisdiction crack down on decentralized perp exchanges, you could face legal consequences or find the
        platform suddenly inaccessible via geographic restrictions. This is a real and evolving risk across the entire
        decentralized derivatives space, not unique to Hyperliquid.
      </P>
      <P>
        <strong>Smart contract risk (HyperEVM).</strong> If you interact with DeFi protocols on HyperEVM — lending
        markets, liquid staking, yield aggregators — you take on the smart contract risk of those specific protocols
        in addition to the base L1 risk. A bug in Felix Protocol&apos;s feUSD contracts, for example, could result in
        loss of funds deposited there, even if the Hyperliquid L1 itself is uncompromised. Always review audit status
        and track record before depositing into HyperEVM protocols.
      </P>

      <H2 id="vs-cex">How It Compares to CEXs on Safety</H2>
      <P>
        The most common comparison is between Hyperliquid and centralized exchanges like Binance, Bybit, or OKX.
        The safety profile is genuinely different rather than straightforwardly better or worse — it depends on which
        risks you care most about.
      </P>
      <P>
        Hyperliquid is safer on <strong>custody</strong>. When you trade on a CEX, the exchange holds your funds. If
        the exchange is hacked, goes insolvent, or freezes withdrawals, you could lose access to your capital. This is
        not a theoretical risk — FTX lost $8B+ in user funds, QuadrigaCX lost $190M, and countless smaller exchanges
        have collapsed or exit-scammed. On Hyperliquid, funds remain in your wallet at all times. The only custodial
        event is the bridge, which is a discrete trust assumption rather than ongoing exposure.
      </P>
      <P>
        CEXs are safer on <strong>regulatory clarity</strong>. Major centralized exchanges operate under regulatory
        frameworks in multiple jurisdictions, with compliance programs, insurance, and legal recourse available to
        users in some cases. Trading on Hyperliquid is pseudonymous and unregulated. If something goes wrong at the
        protocol level, there is no regulatory body you can appeal to, no insurance scheme, and no legal mechanism for
        recovery. This is a real trade-off, not a marketing talking point.
      </P>
      <P>
        CEXs also tend to have more mature security infrastructure — bug bounty programs, dedicated security teams,
        internal fraud detection, and multi-layer authentication. Hyperliquid&apos;s security infrastructure is
        evolving, and some of its security depends on the Hyperliquid Foundation&apos;s operational security practices
        (key management for the bridge multisig, validator selection, etc.) which are not fully transparent.
      </P>

      <H2 id="verdict">Verdict — Who Should and Shouldn&apos;t Use It</H2>
      <P>
        Hyperliquid is a legitimate, battle-tested perpetual futures platform that has processed enormous volume without
        a hack. For traders who understand crypto self-custody and accept the risks of a partially centralized,
        unregulated derivatives venue, it offers genuine advantages: lower fees than most CEXs, full self-custody,
        transparent on-chain execution, and a growing DeFi ecosystem.
      </P>
      <P>
        <strong>It makes sense for you if:</strong> you are comfortable with self-custodial wallets and understand how
        to secure your private key; you prioritize not trusting a third party with your funds; you want competitive
        fees and fast on-chain settlement; and you are willing to accept the bridge trust assumption for deposits.
      </P>
      <P>
        <strong>It may not be right for you if:</strong> you are new to crypto and not yet comfortable managing
        wallet security independently; you are a US person or reside in a jurisdiction where trading unregistered
        derivatives is prohibited; you want regulatory protection and legal recourse in case of losses; or you need
        fiat on-ramp functionality and customer support.
      </P>
      <P>
        The honest summary: Hyperliquid sits in a category that does not map neatly onto &ldquo;safe&rdquo; or
        &ldquo;unsafe.&rdquo; It is safer than a CEX in terms of custody; it is riskier than Ethereum mainnet DeFi
        in terms of decentralization; it is riskier than a CEX in terms of regulatory clarity. Approach it with
        eyes open, size your positions according to your risk tolerance, understand the JELLY-style market
        manipulation risk on thin markets, and never deposit more than you can afford to lose to a bridge exploit.
        With those caveats, it is one of the most credible decentralized trading venues available.
      </P>

      <CTA href="/learn/hyperliquid-vs-cex">Compare Hyperliquid to centralized exchanges in detail &rarr;</CTA>
    </LearnLayout>
  );
}
