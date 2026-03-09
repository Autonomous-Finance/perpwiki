import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "how-to-bridge-to-hyperliquid";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Bridge to Hyperliquid: Complete Deposit Guide 2026 | perp.wiki",
  description:
    "Step-by-step guide to bridging funds to Hyperliquid: official Arbitrum bridge, third-party bridges (Across, deBridge, LayerZero), withdrawals, and safety tips.",
  openGraph: {
    title: "How to Bridge to Hyperliquid: Complete Deposit Guide",
    description:
      "Step-by-step guide to bridging funds to Hyperliquid: official Arbitrum bridge, third-party bridges (Across, deBridge, LayerZero), withdrawals, and safety tips.",
  },
};

const TOC = [
  { id: "why-bridge", title: "Getting Funds to Hyperliquid" },
  { id: "official-bridge", title: "Official Arbitrum Bridge" },
  { id: "third-party-bridges", title: "Third-Party Bridges" },
  { id: "step-by-step", title: "Step-by-Step: First Deposit" },
  { id: "withdrawals", title: "Withdrawing from Hyperliquid" },
  { id: "bridge-comparison", title: "Bridge Comparison" },
  { id: "safety-tips", title: "Bridge Safety Tips" },
  { id: "email-wallet", title: "Email Wallet Onboarding" },
];

export default function HowToBridgeToHyperliquidPage() {
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

      <H2 id="why-bridge">Getting Funds to Hyperliquid</H2>
      <P>
        Before you can trade, stake, or participate in DeFi on{" "}
        <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>, you need to
        get funds onto the network. Hyperliquid operates as its own Layer 1 blockchain,
        separate from Ethereum, Arbitrum, Solana, and other chains where you might currently
        hold assets. The process of moving funds from one chain to another is called bridging.
      </P>
      <P>
        <strong>USDC is the primary currency on Hyperliquid.</strong> All perpetual futures
        are settled in USDC, margin accounts are denominated in USDC, and most DeFi protocols
        on HyperEVM accept USDC deposits. While you can also bridge and trade HYPE and other
        tokens, USDC is the starting point for most users — especially if your primary goal
        is trading perpetuals.
      </P>
      <P>
        The good news is that bridging to Hyperliquid is fast and inexpensive. Whether you use
        the official bridge or a third-party option, the entire process typically takes less
        than 5 minutes and costs minimal fees. This guide covers all available options so you
        can choose the best path based on which chain your funds are currently on.
      </P>

      <H2 id="official-bridge">Official Arbitrum Bridge</H2>
      <P>
        The official and most widely used method for depositing funds to Hyperliquid is the
        native bridge from Arbitrum. This is built directly into the Hyperliquid interface at
        <strong> app.hyperliquid.xyz</strong> and requires no third-party protocols.
      </P>
      <P>
        The process is straightforward: you send USDC from your wallet on Arbitrum to the
        Hyperliquid bridge contract. The bridge validators (a subset of Hyperliquid&apos;s
        validator set) verify the deposit and credit your Hyperliquid account. The entire
        process usually takes <strong>1-2 minutes</strong>.
      </P>
      <P>
        Key details for the official bridge: the <strong>minimum deposit is 5 USDC</strong>.
        There is no fee on the Hyperliquid side — the only cost is the Arbitrum gas fee for
        the bridge transaction, which is typically a few cents. There is no maximum deposit
        limit for standard users, though very large deposits (millions of USDC) may be subject
        to additional security checks from the bridge validators.
      </P>
      <P>
        If your funds are already on Arbitrum as USDC, the official bridge is the simplest
        option. If your funds are on a different chain (Ethereum mainnet, Optimism, Base,
        Solana, etc.) or in a different token (ETH, USDT), you will either need to swap and
        bridge to Arbitrum first, or use a third-party bridge that supports direct cross-chain
        deposits.
      </P>

      <H2 id="third-party-bridges">Third-Party Bridges for Speed &amp; Multi-Chain</H2>
      <P>
        Several third-party bridge protocols support direct deposits to Hyperliquid from
        multiple source chains, saving you the intermediate step of first bridging to Arbitrum.
        These bridges are particularly useful if your funds are on Ethereum mainnet, Optimism,
        Base, Polygon, or other chains.
      </P>
      <P>
        <strong><InlineLink href="/projects/across-protocol">Across Protocol</InlineLink></strong>{" "}
        is one of the fastest bridges available, supporting deposits to Hyperliquid from
        Ethereum, Optimism, Base, and Arbitrum. Across uses an intent-based bridging model
        where relayers front the funds on the destination chain, resulting in near-instant
        settlement for the user. Fees are competitive — typically 0.05-0.12% of the transfer
        amount depending on the route and current relayer competition. Across has been audited
        by multiple firms and has processed billions in total bridge volume, making it one of
        the more battle-tested options.
      </P>
      <P>
        <strong><InlineLink href="/projects/debridge">deBridge</InlineLink></strong>{" "}
        offers multi-chain bridging to Hyperliquid with support for a wide range of source
        chains including Ethereum, BNB Chain, Polygon, Avalanche, and Solana. deBridge uses
        a decentralized validator network to verify cross-chain messages, providing a different
        security model than relayer-based bridges. Fees vary by route but are generally in the
        0.05-0.15% range. deBridge is particularly useful for users coming from non-EVM chains
        like Solana, where fewer bridge options are available.
      </P>
      <P>
        <strong><InlineLink href="/projects/layerzero">LayerZero</InlineLink></strong>{" "}
        provides the underlying cross-chain messaging infrastructure that several bridge
        interfaces use. LayerZero is not a bridge in the traditional sense — it is a messaging
        protocol that applications build on top of. However, several bridge interfaces built
        on LayerZero support Hyperliquid as a destination chain. LayerZero&apos;s security
        model is based on independent verification by oracles and relayers, providing a modular
        trust framework.
      </P>

      <H2 id="step-by-step">Step-by-Step: Your First Deposit</H2>
      <P>
        Here is a complete walkthrough for making your first deposit to Hyperliquid using the
        official Arbitrum bridge:
      </P>
      <P>
        <strong>Step 1: Get USDC on Arbitrum.</strong> If your funds are on Ethereum mainnet,
        bridge them to Arbitrum first using the official Arbitrum bridge (bridge.arbitrum.io)
        or a fast bridge like Across. If your funds are in ETH or another token, swap to USDC
        on a DEX (Uniswap, 1inch) before bridging. You need USDC specifically — USDT and
        other stablecoins are not accepted by the Hyperliquid bridge.
      </P>
      <P>
        <strong>Step 2: Connect your wallet to Hyperliquid.</strong> Navigate to
        app.hyperliquid.xyz and click &quot;Connect Wallet.&quot; Hyperliquid supports
        MetaMask, WalletConnect, Rabby, and most major Ethereum wallets. Once connected, make
        sure your wallet is set to the Arbitrum network.
      </P>
      <P>
        <strong>Step 3: Select deposit.</strong> In the Hyperliquid interface, navigate to the
        deposit section. Enter the amount of USDC you want to deposit (minimum 5 USDC). The
        interface will show you the estimated gas cost for the Arbitrum transaction.
      </P>
      <P>
        <strong>Step 4: Approve &amp; confirm.</strong> If this is your first deposit, you
        will need to approve the USDC token for the bridge contract — this is a standard ERC-20
        approval transaction. After approval, confirm the deposit transaction. Your wallet will
        prompt you to sign the transaction.
      </P>
      <P>
        <strong>Step 5: Funds arrive.</strong> Within 1-2 minutes, your USDC will appear in
        your Hyperliquid account. You can immediately start trading perpetuals, buying spot
        tokens, or transferring funds to HyperEVM for DeFi activities. No additional setup
        is required — your trading account is created automatically with your first deposit.
      </P>

      <H2 id="withdrawals">Withdrawing from Hyperliquid</H2>
      <P>
        Withdrawing funds from Hyperliquid is equally straightforward but comes with a few
        important details to be aware of.
      </P>
      <P>
        All withdrawals are processed to <strong>Arbitrum</strong> — this is the only
        withdrawal destination from the official Hyperliquid bridge. If you ultimately need
        funds on Ethereum mainnet or another chain, you will need to bridge from Arbitrum
        after withdrawal.
      </P>
      <P>
        There is a flat <strong>1 USDC withdrawal fee</strong> regardless of the withdrawal
        amount. This means withdrawing $100 costs the same 1 USDC fee as withdrawing $100,000.
        For this reason, it is more efficient to batch withdrawals rather than making many
        small ones.
      </P>
      <P>
        Withdrawals are typically processed within a few minutes. However, large withdrawals
        may trigger additional security delays — the bridge validators apply timelocks to
        unusually large withdrawals as a protective measure against bridge exploits. For most
        users, this is never an issue, but if you are withdrawing a very large amount, plan
        for potentially longer processing times.
      </P>
      <P>
        Before withdrawing, make sure you have closed any open perpetual positions and have
        no outstanding margin obligations. USDC that is being used as margin for open positions
        cannot be withdrawn — you need to close or reduce positions first to free up the capital.
      </P>

      <H2 id="bridge-comparison">Bridge Options Compared</H2>
      <P>
        The following table compares the major bridge options for depositing to Hyperliquid:
      </P>
      <ComparisonTable
        headers={["Bridge", "Chains Supported", "Speed", "Fees", "Audited"]}
        rows={[
          ["Official Bridge", "Arbitrum only", "1-2 min", "Gas only (~$0.05)", "Yes (core protocol)"],
          ["Across Protocol", "ETH, OP, Base, Arb", "~1 min", "0.05-0.12%", "Yes (multiple audits)"],
          ["deBridge", "ETH, BNB, Polygon, SOL, Avax", "2-5 min", "0.05-0.15%", "Yes (multiple audits)"],
          ["LayerZero-based", "Multiple EVM chains", "2-10 min", "Variable", "Yes (protocol-level)"],
        ]}
      />
      <P>
        For most users, the choice comes down to where your funds currently are. If you are on
        Arbitrum, use the official bridge — it is free (aside from gas), fast, and has no
        third-party trust assumptions. If you are on Ethereum mainnet, Across Protocol offers
        the fastest and cheapest route. If you are on a non-EVM chain like Solana, deBridge is
        likely your best option.
      </P>

      <H2 id="safety-tips">Bridge Safety Tips</H2>
      <P>
        Bridging involves sending tokens to smart contracts on different chains, which means
        there are real security considerations. Here are essential safety practices:
      </P>
      <P>
        <strong>Always verify URLs.</strong> Phishing sites that impersonate Hyperliquid and
        bridge interfaces are common. The official Hyperliquid URL is app.hyperliquid.xyz —
        bookmark it and always navigate directly rather than clicking links in messages,
        emails, or social media posts. Double-check that your browser shows the correct domain
        before connecting your wallet.
      </P>
      <P>
        <strong>Test with a small amount first.</strong> Before bridging a large amount, send
        a small test transaction (10-20 USDC) to verify that the entire flow works correctly
        and funds arrive in your Hyperliquid account. This is especially important when using
        a bridge for the first time or when trying a new route.
      </P>
      <P>
        <strong>Check audit status.</strong> Before using any third-party bridge, verify that
        it has been audited by reputable security firms. All the bridges listed in this guide
        have undergone multiple audits, but this may not be true for newer or less established
        bridge protocols. Bridge exploits have historically been some of the largest hacks in
        DeFi — the Wormhole ($320M), Ronin ($620M), and Nomad ($190M) exploits all targeted
        bridge infrastructure.
      </P>
      <P>
        <strong>Beware of token approval scams.</strong> Only approve token spending for the
        official bridge contract. Malicious sites may ask you to approve unlimited token
        spending for a different contract, which could drain your wallet. When your wallet
        shows the approval request, verify that the spender address matches the known bridge
        contract address.
      </P>
      <P>
        <strong>Do not bridge obscure tokens directly.</strong> The official Hyperliquid
        bridge only supports USDC. If a site claims to let you bridge other tokens directly
        to Hyperliquid&apos;s official bridge, it may be a scam. Third-party bridges like
        Across and deBridge do support multi-token bridging through their own contracts, but
        verify you are on the legitimate bridge interface.
      </P>

      <H2 id="email-wallet">Alternative: Email Wallet Onboarding</H2>
      <P>
        Hyperliquid has introduced a simplified onboarding flow for users who do not have a
        Web3 wallet — the email wallet. This feature allows new users to create a Hyperliquid
        account using just an email address, without needing MetaMask, Rabby, or any other
        browser extension wallet.
      </P>
      <P>
        The email wallet is designed to lower the barrier to entry for crypto newcomers. When
        you sign up with an email, Hyperliquid creates a wallet for you behind the scenes.
        You can then deposit funds through partner on-ramp services that accept credit cards
        or bank transfers, bypassing the need to buy crypto on another exchange and bridge it
        manually.
      </P>
      <P>
        The tradeoff of the email wallet is that it is inherently more custodial than a
        self-managed wallet. Your private keys are managed by the email wallet infrastructure
        rather than stored locally on your device. For small amounts and casual trading, this
        may be an acceptable convenience. For larger amounts, most experienced users prefer
        the full self-custody model of a hardware or software wallet.
      </P>
      <P>
        If you start with an email wallet and later want to upgrade to full self-custody, you
        can export your private key and import it into MetaMask or another wallet. This gives
        you a path from easy onboarding to full sovereignty without needing to create a new
        account.
      </P>

      <CTA href="/learn/what-is-hyperliquid">Learn more about Hyperliquid &rarr;</CTA>
    </LearnLayout>
  );
}
