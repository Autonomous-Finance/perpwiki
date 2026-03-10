import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, ComparisonTable, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "what-is-hyperevm";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "What Is HyperEVM? Hyperliquid's Ethereum Layer Explained 2026",
  description:
    "HyperEVM is Hyperliquid's EVM-compatible smart contract layer. Learn how it connects to HyperCore, which projects are building on it, and how to use HyperEVM apps.",
};

const TOC = [
  { id: "what-is-it", title: "What Is HyperEVM?" },
  { id: "how-it-works", title: "How It Works" },
  { id: "hypercore-connection", title: "Connection to HyperCore" },
  { id: "what-you-can-build", title: "What You Can Build" },
  { id: "key-projects", title: "Key Projects" },
  { id: "developer-view", title: "Building on HyperEVM: A Developer's View" },
  { id: "hyperevm-vs-l2s", title: "HyperEVM vs Other L2s" },
  { id: "gas-costs", title: "Gas on HyperEVM" },
  { id: "evm-limitations", title: "Current Limitations" },
  { id: "testnet", title: "Getting Testnet Access" },
  { id: "getting-started", title: "Getting Started" },
];

const FAQ = [
  {
    question: "What is HyperEVM?",
    answer:
      "HyperEVM is the EVM-compatible smart contract layer on Hyperliquid L1. It runs alongside HyperCore (the native trading layer) on the same blockchain, allowing developers to deploy Solidity smart contracts that can interact with Hyperliquid's order book and deep liquidity.",
  },
  {
    question: "Is HyperEVM the same as Ethereum?",
    answer:
      "HyperEVM is compatible with Ethereum's Virtual Machine (EVM), meaning developers can deploy the same Solidity smart contracts they would on Ethereum. However, it runs on Hyperliquid's own L1 blockchain with sub-second finality and has native access to HyperCore's order book liquidity.",
  },
  {
    question: "How do I use HyperEVM?",
    answer:
      "You can use HyperEVM by connecting your wallet (like MetaMask) to the HyperEVM network and bridging HYPE for gas fees. From there, you can interact with any HyperEVM DeFi protocol — including lending, staking, and trading apps.",
  },
];

export default function WhatIsHyperEvmPage() {
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

      <H2 id="what-is-it">What Is HyperEVM?</H2>
      <P>
        HyperEVM is the EVM-compatible smart contract layer on Hyperliquid L1. If HyperCore is the
        engine that powers Hyperliquid&apos;s native perpetual trading (229 markets, $3.4B+ daily
        volume), then HyperEVM is the platform where developers build everything else — lending
        protocols, liquid staking, DEXs, NFT marketplaces, and yield strategies.
      </P>
      <P>
        &quot;EVM-compatible&quot; means developers can write smart contracts in Solidity (the same
        language used on Ethereum) and deploy them on HyperEVM with minimal changes. This makes it
        easy to port existing Ethereum DeFi protocols to Hyperliquid — and many have. Over 136 projects
        now build on the Hyperliquid ecosystem, with the majority targeting HyperEVM.
      </P>

      <H2 id="how-it-works">How It Works</H2>
      <P>
        HyperEVM runs as a separate execution environment on the same Hyperliquid L1 blockchain. Both
        HyperCore (the native trading engine) and HyperEVM share the same consensus layer (HyperBFT),
        the same validator set (25 active validators), and the same state. This means they operate at
        L1 speed — sub-second block finality — rather than as a slower sidechain or L2.
      </P>
      <P>
        HYPE is the native gas token for HyperEVM transactions. Gas costs are minimal compared to
        Ethereum mainnet, making it practical for DeFi interactions that would be prohibitively
        expensive on Ethereum. The chain ID for HyperEVM is 999, and it can be added to MetaMask or
        any EVM-compatible wallet.
      </P>
      <P>
        For a deeper comparison of HyperCore and HyperEVM, read our{" "}
        <InlineLink href="/learn/hypercore-vs-hyperevm">HyperCore vs HyperEVM guide</InlineLink>.
      </P>

      <H2 id="hypercore-connection">The Connection to HyperCore</H2>
      <P>
        What makes HyperEVM special is its native connection to HyperCore. Smart contracts on HyperEVM
        can read HyperCore state — including order book data, position information, and market prices.
        This enables composable DeFi that would be impossible on a standalone chain.
      </P>
      <P>
        For example, <InlineLink href="/projects/sentiment">Sentiment</InlineLink> accepts perpetual
        futures positions from HyperCore as collateral for loans on HyperEVM — the first protocol
        anywhere to do this. Liquid staking tokens like kHYPE and stHYPE earn validator rewards from
        HyperCore consensus while being fully composable in HyperEVM DeFi.
      </P>
      <P>
        Assets can move between HyperCore and HyperEVM through native transfers. USDC deposited for
        trading on HyperCore can be transferred to HyperEVM for use in DeFi, and vice versa, without
        using an external bridge.
      </P>

      <H2 id="what-you-can-build">What You Can Build</H2>
      <P>
        HyperEVM supports anything you can build on Ethereum. The current ecosystem includes lending
        protocols (<InlineLink href="/projects/felix-protocol">Felix</InlineLink>,{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink>), liquid staking (
        <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink>,{" "}
        <InlineLink href="/projects/stakedhype">StakedHYPE</InlineLink>), AMM DEXs (
        <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink>,{" "}
        <InlineLink href="/projects/kittenswap">KittenSwap</InlineLink>), NFT marketplaces (
        <InlineLink href="/projects/drip-trade">Drip Trade</InlineLink>), and yield aggregators (
        <InlineLink href="/projects/hyperbeat">HyperBeat</InlineLink>,{" "}
        <InlineLink href="/projects/mizu">Mizu</InlineLink>).
      </P>
      <P>
        The unique opportunity is building at the intersection of HyperCore and HyperEVM — protocols
        that leverage Hyperliquid&apos;s native order book liquidity, funding rates, and trading
        infrastructure in novel ways. This is where the most innovative HyperEVM projects differentiate
        themselves.
      </P>

      <H2 id="key-projects">Key Projects on HyperEVM</H2>
      <P>
        The largest HyperEVM projects by TVL include{" "}
        <InlineLink href="/projects/felix-protocol">Felix Protocol</InlineLink> ($1B+ TVL, CDP lending
        and feUSD stablecoin), <InlineLink href="/projects/kinetiq">Kinetiq</InlineLink> ($470M+ HYPE
        staked), <InlineLink href="/projects/morpho">Morpho</InlineLink> ($500M+ TVL, permissionless
        lending), and <InlineLink href="/projects/hyperswap">HyperSwap</InlineLink> (~$57M TVL, leading
        AMM). For a detailed breakdown, see our{" "}
        <InlineLink href="/learn/best-hyperevm-projects">Best HyperEVM Projects</InlineLink> guide.
      </P>

      <H2 id="developer-view">Building on HyperEVM: A Developer&apos;s View</H2>
      <P>
        One of the most compelling aspects of HyperEVM for developers is that there is nothing new to
        learn. Full EVM equivalence means the entire Ethereum development toolkit works out of the box.
        If you have written Solidity or Vyper contracts before, you can deploy them on HyperEVM today
        without modifying a single line of code. The same contract bytecode that runs on Ethereum
        mainnet, Arbitrum, or Base will run identically on HyperEVM.
      </P>
      <P>
        <strong>Frameworks.</strong> Both Foundry and Hardhat are fully supported. You can use Foundry
        for fast, Rust-based compilation and testing, or stick with Hardhat if you prefer its
        JavaScript/TypeScript plugin ecosystem. Create a new project with <code>forge init</code> or{" "}
        <code>npx hardhat init</code>, write your contracts in <code>src/</code> or{" "}
        <code>contracts/</code>, and deploy by pointing to HyperEVM&apos;s RPC endpoint. There are no
        custom deploy scripts or proprietary CLIs required — just standard Ethereum tooling with a
        different RPC URL.
      </P>
      <P>
        <strong>Client libraries.</strong> On the frontend, ethers.js, viem, and wagmi all work
        seamlessly. Connect users with wagmi hooks like <code>useConnect</code> and{" "}
        <code>useContractRead</code>, or interact with contracts directly using viem&apos;s{" "}
        <code>publicClient</code> and <code>walletClient</code>. Any React or Next.js app that talks
        to Ethereum can talk to HyperEVM — just swap the chain configuration to chain ID 999 and
        update the RPC URL.
      </P>
      <P>
        <strong>RPC endpoints.</strong> HyperEVM provides publicly accessible RPC endpoints for both
        mainnet and testnet. These endpoints support the standard Ethereum JSON-RPC interface, so
        tools like MetaMask, WalletConnect, and block explorers all work without any special
        configuration. Rate limits are generous enough for most development workflows, though
        production apps may want to consider running a dedicated node for reliability.
      </P>
      <P>
        <strong>The developer experience advantage.</strong> The zero-learning-curve onboarding is not
        just a convenience — it is a strategic moat for HyperEVM. By maintaining full EVM
        compatibility, Hyperliquid can attract any Ethereum developer without requiring them to learn
        Move, Rust for Solana, or CosmWasm. Tutorials, Stack Overflow answers, and OpenZeppelin
        contracts all work. If a developer has already deployed an ERC-20, built a Uniswap fork, or
        written a Chainlink oracle consumer, they can do the same on HyperEVM without friction.
      </P>
      <P>
        What makes building on HyperEVM meaningfully different from deploying on yet another EVM
        chain is the native access to HyperCore order book state. Smart contracts on HyperEVM can
        read prices, positions, and order data from HyperCore directly — without relying on external
        oracles. This opens up an entirely new design space for DeFi protocols that simply does not
        exist on Ethereum L1 or any L2. Imagine a lending protocol that can check a borrower&apos;s
        perpetual positions in real time to calculate health factors, or a yield vault that
        automatically rebalances based on live funding rates. These architectures are native to
        HyperEVM.
      </P>

      <H2 id="hyperevm-vs-l2s">HyperEVM vs Other L2s</H2>
      <P>
        HyperEVM is often compared to Ethereum L2s like Arbitrum, Optimism, and Base, but the
        architecture is fundamentally different. L2s inherit Ethereum&apos;s security by posting
        transaction data back to Ethereum L1 and relying on fraud proofs (optimistic rollups) or
        validity proofs (zk-rollups) for finality. HyperEVM, by contrast, is part of a standalone
        L1 with its own consensus mechanism (HyperBFT) and validator set. The trust models are
        different, and the tradeoffs are worth understanding.
      </P>
      <ComparisonTable
        headers={["", "HyperEVM", "Arbitrum", "Optimism", "Base"]}
        rows={[
          ["Finality", "~1 second", "7-day fraud proof", "7-day fraud proof", "7-day fraud proof"],
          ["Native DEX state", "Yes (HyperCore)", "No", "No", "No"],
          ["Gas token", "HYPE", "ETH", "ETH", "ETH"],
          ["TVL", "$2B+", "$15B+", "$7B+", "$10B+"],
          ["Unique advantage", "Order book composability", "Largest L2 ecosystem", "OP Stack governance", "Coinbase distribution"],
        ]}
      />
      <P>
        The most significant distinction is HyperEVM&apos;s native access to HyperCore order book
        state. No Ethereum L2 has a built-in central limit order book with $3.4B+ in daily volume
        that smart contracts can composably interact with. On Arbitrum or Base, if you want to build
        a protocol that references perpetual futures data, you need to integrate with a separate DEX
        protocol (like GMX or Vertex) and rely on oracle infrastructure to bridge price data. On
        HyperEVM, that data is natively available on the same L1.
      </P>
      <P>
        On the other hand, L2s benefit from Ethereum&apos;s battle-tested security. Arbitrum and
        Optimism inherit the security of Ethereum&apos;s validator set (hundreds of thousands of
        validators and billions in staked ETH). HyperEVM relies on HyperBFT with 25 active
        validators — a much smaller and newer security model. For protocols handling billions in TVL,
        this difference in security guarantees matters.
      </P>
      <P>
        L2s also benefit from the sheer size of the Ethereum ecosystem. Arbitrum alone has over 600
        DeFi protocols, established infrastructure providers, and deep developer talent pools.
        HyperEVM&apos;s ecosystem, while growing rapidly (136+ projects), is still in its earlier
        stages. The choice between HyperEVM and an L2 ultimately depends on whether your protocol
        benefits more from order book composability (choose HyperEVM) or from ecosystem size and
        Ethereum security (choose an L2).
      </P>

      <H2 id="gas-costs">Gas on HyperEVM</H2>
      <P>
        HYPE is the gas token for all HyperEVM transactions. Every smart contract interaction — swaps,
        lending deposits, NFT mints, token approvals — requires a small amount of HYPE to pay for
        execution. If you are coming from Ethereum mainnet, the first thing you will notice is how
        dramatically cheaper everything is.
      </P>
      <P>
        A typical token swap on HyperEVM costs approximately $0.01 to $0.10 in gas fees. For context,
        the same swap on Ethereum mainnet can cost $5 to $50 or more during periods of network
        congestion. Lending interactions (deposits, borrows, repayments) on protocols like{" "}
        <InlineLink href="/projects/hyperlend">HyperLend</InlineLink> or{" "}
        <InlineLink href="/projects/morpho">Morpho</InlineLink> are similarly cheap — usually well
        under $0.10 per transaction. This makes it practical to execute frequent DeFi strategies
        that would be cost-prohibitive on Ethereum mainnet.
      </P>
      <P>
        Gas prices on HyperEVM fluctuate with network demand, just as they do on any EVM chain. During
        periods of heavy activity — such as NFT mints, new token launches, or market volatility events
        — gas prices can spike temporarily. However, even during peak congestion, HyperEVM gas costs
        remain orders of magnitude lower than Ethereum mainnet. The combination of HyperBFT&apos;s
        high throughput and the relatively young state of the network keeps gas consistently affordable.
      </P>
      <P>
        To get HYPE for gas, you have two primary options. First, if you already have assets on
        HyperCore (from trading on Hyperliquid), you can transfer HYPE from HyperCore to HyperEVM
        directly through the Hyperliquid app — this is an internal transfer with no bridge required.
        Second, you can bridge HYPE from other chains using cross-chain bridges like{" "}
        <InlineLink href="/projects/debridge">deBridge</InlineLink> or{" "}
        <InlineLink href="/projects/across-protocol">Across Protocol</InlineLink>. Most users start
        by transferring a small amount (0.5-1 HYPE is more than enough for hundreds of transactions)
        and top up as needed.
      </P>

      <H2 id="evm-limitations">Current Limitations</H2>
      <P>
        While HyperEVM offers full EVM compatibility, there are some practical limitations that
        developers and users should be aware of. These are not fundamental design flaws — they are
        growing pains that are being actively addressed — but they matter if you are building or
        choosing to deploy on HyperEVM today.
      </P>
      <P>
        <strong>Precompile support.</strong> Some Ethereum precompiled contracts may not be available
        on HyperEVM. Precompiles are special built-in functions for operations like elliptic curve
        cryptography (ecPairing, ecMul) and modular exponentiation (modexp). If your contract relies
        on uncommon precompiles, verify their availability on HyperEVM before deploying. The most
        commonly used precompiles (ecRecover, sha256, identity) are supported, but more exotic ones
        used in advanced ZK or cryptographic protocols may not be.
      </P>
      <P>
        <strong>EIP support.</strong> HyperEVM&apos;s support for Ethereum Improvement Proposals is
        evolving. Core EIPs like EIP-1559 (fee market), EIP-2930 (access lists), and EIP-721/1155
        (NFT standards) are supported, but newer EIPs that are being rolled out on Ethereum (such as
        EIP-4844 blob transactions) may not be available yet. Always check the Hyperliquid
        documentation for the latest compatibility details before relying on specific EIP features.
      </P>
      <P>
        <strong>Ecosystem maturity.</strong> HyperEVM has a smaller ecosystem of verified and audited
        contracts compared to Ethereum. On Ethereum mainnet, you can import battle-tested libraries
        from OpenZeppelin, reference hundreds of verified contracts on Etherscan, and use established
        DeFi primitives as building blocks. On HyperEVM, the ecosystem is newer and the library of
        production-tested code is still growing. That said, since standard Solidity contracts deploy
        without modification, you can still use OpenZeppelin libraries directly.
      </P>
      <P>
        <strong>Developer tooling and indexing.</strong> The ecosystem of developer tools and indexing
        services for HyperEVM is expanding but not yet at parity with Ethereum. Block explorers like
        HypurrScan provide core functionality, and indexing solutions like HyperIndex enable subgraph-
        style data querying. However, the depth of tooling — debugging tools, simulation environments,
        analytics dashboards, and third-party APIs — is still catching up to what Ethereum L2s offer.
        This gap is closing rapidly as more developers and infrastructure providers enter the ecosystem.
      </P>

      <H2 id="testnet">Getting Testnet Access</H2>
      <P>
        HyperEVM provides a dedicated testnet environment for development and testing. The testnet
        mirrors the mainnet architecture — including the HyperCore and HyperEVM dual-environment
        structure — so you can develop and test contracts in conditions that closely match production.
        This is essential for any protocol that interacts with HyperCore state, as you can verify
        your contract&apos;s behavior against real (test) order book data.
      </P>
      <P>
        To get started on testnet, you need test HYPE for gas. Faucets are available through the
        Hyperliquid community and documentation resources. Request a small amount of test HYPE from
        the faucet, and you will have enough to deploy contracts and run transactions for an extended
        development period. The testnet faucet is rate-limited to prevent abuse, but the limits are
        generous enough for active development.
      </P>
      <P>
        Deploying to testnet is identical to mainnet — just point your Foundry or Hardhat
        configuration to the testnet RPC URL instead of mainnet. In Foundry, this means using{" "}
        <code>forge create --rpc-url &lt;testnet-rpc&gt;</code> or updating your{" "}
        <code>foundry.toml</code> with the testnet endpoint. In Hardhat, add a network entry in your{" "}
        <code>hardhat.config.ts</code> with the testnet chain ID and RPC URL. All your tests,
        scripts, and deployment workflows work the same way.
      </P>
      <P>
        One important note: the testnet environment may not always have identical performance
        characteristics to mainnet. Block times, gas prices, and throughput can differ because the
        testnet runs on a smaller validator set. However, for smart contract logic testing, state
        interaction verification, and integration testing with HyperCore, the testnet is fully
        representative. Developers are encouraged to complete thorough testing on testnet before
        deploying to mainnet, especially for contracts that handle significant user funds.
      </P>

      <H2 id="getting-started">Getting Started</H2>
      <P>
        To use HyperEVM, add the network to your wallet (chain ID 999), bridge HYPE for gas, and
        start interacting with protocols. Most HyperEVM apps provide a seamless onboarding experience
        with wallet connection prompts. If you&apos;re a developer, the standard Ethereum tooling
        (Hardhat, Foundry, ethers.js) works out of the box — just point to HyperEVM&apos;s RPC
        endpoint.
      </P>

      <CTA href="/projects?layer=HYPEREVM">Explore HyperEVM projects &rarr;</CTA>
    </LearnLayout>
  );
}
