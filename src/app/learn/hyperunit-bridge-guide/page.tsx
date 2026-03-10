import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "hyperunit-bridge-guide";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Bridge to Hyperliquid with Unit Protocol",
  description:
    "Step-by-step guide to bridging BTC, ETH, and SOL to Hyperliquid using Unit Protocol. Covers MPC security, fees, supported assets, and troubleshooting.",
  openGraph: {
    title: "Bridge to Hyperliquid with Unit Protocol",
    description:
      "Bridge BTC, ETH, SOL and more to Hyperliquid via Unit Protocol. Complete walkthrough with fees and security details.",
  },
};

const TOC = [
  { id: "what-is-unit", title: "What Is Unit Protocol?" },
  { id: "supported-assets", title: "Supported Assets" },
  { id: "mpc-security", title: "MPC Security Model" },
  { id: "step-by-step", title: "Step-by-Step Bridge Guide" },
  { id: "fees-and-timing", title: "Fees & Timing" },
  { id: "bridging-back", title: "Bridging Back" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "What is Unit Protocol on Hyperliquid?",
    answer:
      "Unit Protocol is the native bridge infrastructure for bringing non-USDC assets onto Hyperliquid. It allows users to bridge BTC, ETH, SOL, and other major assets from their native chains to HyperEVM, where they are represented as wrapped tokens that can be used in DeFi or as trading collateral.",
  },
  {
    question: "How long does it take to bridge assets to Hyperliquid via Unit?",
    answer:
      "Bridge times vary by source chain. Bitcoin transfers typically take 10-30 minutes (waiting for BTC block confirmations). Ethereum transfers take 5-15 minutes. Solana transfers are usually the fastest at 2-5 minutes. Times may be longer during periods of high network congestion.",
  },
  {
    question: "Is bridging via Unit Protocol safe?",
    answer:
      "Unit Protocol uses Multi-Party Computation (MPC) security, where bridge transactions require approval from a distributed set of signers — no single party can move funds unilaterally. While this is more secure than a simple multisig, bridge risk is inherent in any cross-chain transfer. Only bridge what you are comfortable putting at risk.",
  },
  {
    question: "What fees does Unit Protocol charge for bridging?",
    answer:
      "Unit Protocol charges a small bridging fee (typically 0.05-0.1% of the transfer amount) plus the gas cost on the source chain. There is no fee on the Hyperliquid side. Fees may vary by asset and network congestion levels.",
  },
  {
    question: "Can I bridge assets back from Hyperliquid to their native chains?",
    answer:
      "Yes. Unit Protocol supports two-way bridging. You can bridge wrapped assets on HyperEVM back to their native chains (BTC to Bitcoin, ETH to Ethereum, etc.) through the same interface. Withdrawal times and fees are similar to deposit times.",
  },
];

export default function HyperunitBridgeGuidePage() {
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

      <H2 id="what-is-unit">What Is Unit Protocol?</H2>
      <P>
        Unit Protocol is the native bridge infrastructure that enables users to bring non-USDC
        assets onto{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>. While
        Hyperliquid&apos;s primary deposit method has always been bridging USDC from Arbitrum,
        Unit Protocol expands this by supporting native BTC, ETH, SOL, and other major assets
        from their home chains.
      </P>
      <P>
        Before Unit, bringing BTC or ETH exposure onto Hyperliquid required a multi-step
        process: swap your BTC for USDC on a centralized exchange, bridge the USDC to Arbitrum,
        then bridge from Arbitrum to Hyperliquid. Unit Protocol eliminates these steps by
        providing direct bridges from Bitcoin, Ethereum, Solana, and other chains directly into
        the Hyperliquid ecosystem.
      </P>
      <P>
        Assets bridged via Unit Protocol arrive as wrapped tokens on{" "}
        <InlineLink href="/learn/what-is-hyperevm">HyperEVM</InlineLink>, where they can be
        used across the growing DeFi ecosystem — as collateral on lending platforms, in liquidity
        pools, or deposited into yield strategies. This has significantly expanded the range of
        capital that can participate in Hyperliquid&apos;s ecosystem beyond just USDC holders.
      </P>

      <H2 id="supported-assets">Supported Assets</H2>
      <P>
        Unit Protocol currently supports bridging for several major assets. <strong>Bitcoin
        (BTC)</strong> can be bridged directly from the Bitcoin network — you send BTC to a
        Unit-provided deposit address and receive wrapped BTC (uBTC) on HyperEVM.{" "}
        <strong>Ethereum (ETH)</strong> can be bridged from Ethereum mainnet, arriving as uETH
        on HyperEVM. <strong>Solana (SOL)</strong> bridges from the Solana network as uSOL.
      </P>
      <P>
        Additional assets are added periodically based on community demand and liquidity
        conditions. Each supported asset has its own bridge contract and deposit address. The
        wrapped tokens (uBTC, uETH, uSOL) are fully backed 1:1 by the native assets held in
        Unit&apos;s MPC-secured custody.
      </P>
      <P>
        These wrapped assets are standard ERC-20 tokens on HyperEVM, meaning they integrate
        natively with all HyperEVM DeFi protocols. You can use uBTC as collateral on{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink>, provide uETH liquidity on{" "}
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink>, or hold them as a way to
        maintain BTC/ETH exposure while having access to Hyperliquid&apos;s trading and DeFi
        features.
      </P>

      <H2 id="mpc-security">MPC Security Model</H2>
      <P>
        Unit Protocol secures bridged assets using Multi-Party Computation (MPC) — a
        cryptographic approach where the signing authority for bridge transactions is distributed
        across multiple independent parties. No single signer can move funds unilaterally; a
        threshold of signers must cooperate to authorize any transaction.
      </P>
      <P>
        This model is more secure than a simple multisig wallet because the private key never
        exists in a complete form at any single location. In traditional multisig, each signer
        has their own complete key. In MPC, the key is generated and used in a distributed
        fashion — key shares are created through a secure ceremony and no individual share can
        reconstruct the full key.
      </P>
      <P>
        The MPC signer set for Unit Protocol includes a mix of Hyperliquid validators and
        independent third-party operators. This distribution reduces the risk of collusion or
        compromise. For a bridge transaction to be processed, a supermajority of signers must
        validate the deposit on the source chain and authorize the minting of wrapped tokens on
        HyperEVM.
      </P>
      <P>
        Despite these safeguards, bridge risk is inherent in any cross-chain protocol. The MPC
        signer set is a trust assumption — you are trusting that a sufficient number of signers
        will remain honest and operational. Users should evaluate this risk relative to the
        amount they intend to bridge and consider it alongside other security measures like
        transaction timelocks and monitoring systems.
      </P>

      <H2 id="step-by-step">Step-by-Step Bridge Guide</H2>
      <P>
        <strong>Step 1: Connect your wallet.</strong> Navigate to the Unit Protocol bridge
        interface (accessible from app.hyperliquid.xyz or directly at the Unit Protocol site).
        Connect your HyperEVM-compatible wallet (MetaMask, Rabby, or any EVM wallet configured
        for Hyperliquid).
      </P>
      <P>
        <strong>Step 2: Select the source asset and chain.</strong> Choose which asset you want
        to bridge (BTC, ETH, or SOL) and the source chain. The interface will display the
        current exchange rate, estimated fees, and expected bridge time.
      </P>
      <P>
        <strong>Step 3: Generate a deposit address.</strong> The bridge generates a unique
        deposit address on the source chain linked to your HyperEVM wallet. For Bitcoin, this
        is a standard BTC address. For Ethereum, it is an Ethereum address. For Solana, a
        Solana address. Each deposit address is single-use and tied to your destination wallet.
      </P>
      <P>
        <strong>Step 4: Send assets to the deposit address.</strong> Using your source chain
        wallet (a Bitcoin wallet for BTC, MetaMask for ETH, Phantom for SOL), send the desired
        amount to the generated deposit address. Double-check the address carefully — bridge
        deposits to incorrect addresses are generally not recoverable.
      </P>
      <P>
        <strong>Step 5: Wait for confirmations.</strong> The bridge monitors the source chain
        for your deposit. Once the required number of block confirmations is reached (typically
        3-6 for Bitcoin, 12-20 for Ethereum, 30+ for Solana), the MPC signers authorize the
        minting of wrapped tokens on HyperEVM.
      </P>
      <P>
        <strong>Step 6: Receive wrapped tokens.</strong> The wrapped tokens (uBTC, uETH, or
        uSOL) appear in your HyperEVM wallet automatically. No claim transaction is required.
        You can immediately use them in DeFi or hold them in your wallet.
      </P>

      <H2 id="fees-and-timing">Fees & Timing</H2>
      <P>
        Unit Protocol charges a bridging fee of approximately 0.05-0.1% of the transfer amount.
        This fee covers the operational costs of running the MPC signer infrastructure and
        monitoring systems. In addition, you pay the standard gas fee on the source chain for
        your deposit transaction — this varies by network (Bitcoin fees depend on mempool
        congestion, Ethereum gas varies with network activity).
      </P>
      <P>
        There is no fee on the Hyperliquid/HyperEVM side for receiving wrapped tokens. The total
        cost of bridging a $10,000 BTC deposit is typically $5-15 (bridge fee + Bitcoin network
        fee). For Ethereum, costs may be higher during gas spikes.
      </P>
      <P>
        Timing depends on the source chain&apos;s block time and confirmation requirements.
        Bitcoin transfers generally take 10-30 minutes (waiting for 3 BTC block confirmations
        at ~10 minutes each). Ethereum transfers take 5-15 minutes. Solana transfers are
        typically the fastest at 2-5 minutes due to Solana&apos;s fast block times.
      </P>

      <H2 id="bridging-back">Bridging Back</H2>
      <P>
        Unit Protocol supports two-way bridging. To bridge assets back to their native chain,
        navigate to the bridge interface, select &quot;Withdraw,&quot; choose the wrapped asset
        and destination chain, and enter the destination address on the native chain. The bridge
        burns your wrapped tokens on HyperEVM and releases the native assets from the MPC
        custody to your destination address.
      </P>
      <P>
        Withdrawal times are similar to deposit times, as the process requires MPC signer
        authorization and on-chain confirmations. Fees are comparable to deposit fees. For large
        withdrawals, there may be additional security checks (timelocks) designed to prevent
        unauthorized fund movements in case of a security incident.
      </P>

      <H2 id="troubleshooting">Troubleshooting</H2>
      <P>
        <strong>Deposit not showing up.</strong> The most common issue is insufficient
        confirmations on the source chain. Check a block explorer for the source chain (mempool.space
        for Bitcoin, etherscan.io for Ethereum) to verify your transaction status. Once the
        required confirmations are reached, the wrapped tokens will appear automatically.
      </P>
      <P>
        <strong>Wrong deposit address.</strong> Always double-check the deposit address generated
        by the bridge interface. Sending assets to an incorrect address (including addresses
        from previous bridge sessions) may result in permanent loss of funds. If in doubt,
        start with a small test transfer.
      </P>
      <P>
        <strong>Minimum deposit amounts.</strong> Each asset has a minimum bridge amount to
        ensure the bridge fee covers operational costs. Attempting to bridge below the minimum
        will result in the transaction being rejected or, in some cases, the deposit being
        returned minus the network fee.
      </P>
      <P>
        <strong>Stuck transactions.</strong> If your deposit appears confirmed on the source
        chain but wrapped tokens have not arrived after the expected time, check the Unit
        Protocol status page for any system-wide delays. In rare cases, MPC signer maintenance
        can temporarily slow bridge processing. If the issue persists beyond an hour past the
        expected time, contact Unit Protocol support through their official channels.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/learn/how-to-use-hyperliquid">How to use Hyperliquid — beginner&apos;s tutorial &rarr;</CTA>
    </LearnLayout>
  );
}
