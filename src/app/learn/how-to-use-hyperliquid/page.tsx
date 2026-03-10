import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "how-to-use-hyperliquid";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "How to Use Hyperliquid — Complete Beginner's Guide 2026",
  description:
    "Step-by-step guide to using Hyperliquid in 2026: create a wallet, bridge USDC, place your first trade, understand leverage, and withdraw funds.",
  openGraph: {
    title: "How to Use Hyperliquid — Complete Beginner's Guide 2026",
    description:
      "From zero to your first trade — a step-by-step walkthrough of Hyperliquid for beginners.",
  },
};

const TOC = [
  { id: "intro", title: "Getting Started with Hyperliquid" },
  { id: "step-wallet", title: "Step 1: Set Up a Wallet" },
  { id: "step-usdc", title: "Step 2: Get USDC on Arbitrum" },
  { id: "step-bridge", title: "Step 3: Bridge to Hyperliquid" },
  { id: "step-interface", title: "Step 4: Explore the Interface" },
  { id: "step-trade", title: "Step 5: Place Your First Trade" },
  { id: "step-manage", title: "Step 6: Manage Your Position" },
  { id: "step-withdraw", title: "Step 7: Withdraw" },
  { id: "common-mistakes", title: "Common Mistakes for Beginners" },
  { id: "safety", title: "Safety Notes" },
  { id: "next-steps", title: "Next Steps" },
];

const FAQ = [
  {
    question: "Do I need KYC for Hyperliquid?",
    answer:
      "No. Hyperliquid is a fully decentralized exchange that requires no KYC, no account registration, and no email. You connect a wallet (such as MetaMask) and trade directly. This is one of the biggest advantages over centralized exchanges — anyone in the world can access Hyperliquid with just a wallet and USDC.",
  },
  {
    question: "How long does it take to bridge to Hyperliquid?",
    answer:
      "Bridging USDC from Arbitrum to Hyperliquid typically takes 1-2 minutes. The deposit is processed by Hyperliquid's validators and your funds appear in your HyperCore trading account once confirmed. Withdrawals back to Arbitrum take 5-15 minutes.",
  },
  {
    question: "What's the minimum deposit for Hyperliquid?",
    answer:
      "There is no strict minimum deposit. You can bridge as little as $1 USDC to Hyperliquid. However, to place meaningful perpetual trades with leverage, most users start with at least $50-100 USDC. The minimum order size varies by market but is typically around $10 notional value.",
  },
];

export default function HowToUseHyperliquidPage() {
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

      <H2 id="intro">Getting Started with Hyperliquid</H2>
      <P>
        Hyperliquid is the highest-volume decentralized perpetual futures exchange in crypto, processing
        over $3.4 billion in daily trading volume across 229 markets. Despite those numbers, getting
        started on the platform is surprisingly straightforward — most new users go from zero to their
        first trade in under 10 minutes. There is no KYC, no account creation, no email signup. You
        connect a wallet, deposit USDC, and start trading.
      </P>
      <P>
        This guide walks you through every step in detail: setting up a wallet, acquiring USDC on
        Arbitrum, bridging funds to Hyperliquid, navigating the interface, placing your first trade,
        managing open positions, and withdrawing your funds. Whether you are coming from centralized
        exchanges like Binance or have never traded perpetual futures before, this tutorial covers
        everything you need to know.
      </P>
      <P>
        Before we begin, here is what you will need: a browser-based Ethereum wallet (MetaMask is the
        most common), USDC on the Arbitrum One network, and a small amount of ETH on Arbitrum for the
        initial bridge gas fee (approximately $0.10–$0.50). If you already have these, you can skip ahead
        to Step 3. If not, we will cover how to set up everything from scratch.
      </P>

      <H2 id="step-wallet">Step 1: Set Up a Wallet</H2>
      <P>
        If you do not already have an Ethereum-compatible wallet, install MetaMask from{" "}
        <strong>metamask.io</strong>. MetaMask is a browser extension available for Chrome, Firefox,
        Brave, and Edge. The installation takes about two minutes. During setup, MetaMask will generate a
        seed phrase (12 or 24 words) — write this down on paper and store it securely. This seed phrase
        is the only way to recover your wallet if you lose access to your browser. Never share it with
        anyone, never take a screenshot of it, and never store it in a text file on your computer.
      </P>
      <P>
        After creating your wallet, you need to add the Arbitrum One network. In MetaMask, click the
        network selector at the top and choose &quot;Add Network.&quot; Search for Arbitrum One or add it
        manually with the following parameters: Network Name: Arbitrum One, RPC URL:
        https://arb1.arbitrum.io/rpc, Chain ID: 42161, Currency Symbol: ETH, Block Explorer:
        https://arbiscan.io. Many wallets now include Arbitrum by default, so you may already have it
        available.
      </P>
      <P>
        For users who plan to trade with larger amounts (more than $1,000), it is strongly recommended to
        use a hardware wallet like Ledger or Trezor connected to MetaMask. This provides an additional
        layer of security — your private keys remain on the hardware device and never touch your browser.
        The setup is slightly more involved but provides significantly better protection for your funds.
      </P>

      <H2 id="step-usdc">Step 2: Get USDC on Arbitrum</H2>
      <P>
        Hyperliquid uses USDC as its settlement currency. To deposit, you need USDC on the Arbitrum One
        network. There are several ways to acquire it depending on where your funds currently are.
      </P>
      <P>
        <strong>From a centralized exchange:</strong> If you have funds on Coinbase, Binance, Kraken, or
        any other major exchange, buy USDC (or withdraw existing USDC) directly to Arbitrum One. Most
        major exchanges now support Arbitrum withdrawals. When withdrawing, make sure you select the
        Arbitrum network (not Ethereum mainnet) to avoid high gas fees. The withdrawal will send USDC
        directly to your MetaMask wallet on Arbitrum, typically arriving within 5–15 minutes.
      </P>
      <P>
        <strong>Via Circle Bridge:</strong> If you already have USDC on another chain (such as Ethereum
        mainnet, Optimism, or Base), you can use Circle&apos;s official CCTP bridge to transfer USDC to
        Arbitrum at a 1:1 ratio with no slippage. This is the most cost-effective way to move USDC between
        chains because Circle mints native USDC on the destination chain rather than using a wrapped
        token.
      </P>
      <P>
        <strong>Swap on Arbitrum:</strong> If you already have ETH or other tokens on Arbitrum, you can
        swap them for USDC using Uniswap, SushiSwap, or any other Arbitrum DEX. Navigate to the swap
        interface, select your input token and USDC as the output, and execute the swap. This approach
        requires a small amount of ETH for gas (usually $0.10–$0.30 per swap on Arbitrum).
      </P>
      <P>
        You will also need a small amount of ETH on Arbitrum to pay the gas fee for the bridge transaction
        to Hyperliquid. Approximately 0.0002–0.001 ETH ($0.10–$0.50) is sufficient. If you withdrew USDC
        from a centralized exchange, send a small ETH withdrawal to Arbitrum as well. Some exchanges allow
        you to withdraw ETH directly on Arbitrum; otherwise, bridge ETH from mainnet using the official
        Arbitrum bridge at bridge.arbitrum.io.
      </P>

      <H2 id="step-bridge">Step 3: Bridge to Hyperliquid</H2>
      <P>
        With USDC in your MetaMask wallet on Arbitrum, you are ready to deposit to Hyperliquid. Navigate
        to <strong>app.hyperliquid.xyz</strong> in your browser and click &quot;Connect&quot; in the top
        right corner. Select MetaMask (or your preferred wallet) and approve the connection request. The
        app will recognize your Arbitrum wallet and display your available balances.
      </P>
      <P>
        Click the &quot;Deposit&quot; button in the portfolio section. A deposit dialog will appear showing
        your USDC balance on Arbitrum. Enter the amount of USDC you want to deposit — you can deposit any
        amount, though most users start with $50–$500 for initial exploration. Click &quot;Deposit&quot;
        and confirm the transaction in MetaMask. The gas fee for this bridging transaction is paid in ETH
        on Arbitrum and is typically less than $0.50.
      </P>
      <P>
        Your deposit will be processed by Hyperliquid&apos;s validators and typically appears in your
        trading account within 1–2 minutes. Once the deposit is confirmed, your USDC balance will be
        visible in the Portfolio section of the app. You are now ready to trade.
      </P>
      <P>
        For users coming from chains other than Arbitrum, third-party bridges
        like <InlineLink href="/projects/debridge">deBridge</InlineLink> offer direct bridging to
        Hyperliquid from Ethereum, Solana, BSC, and other chains. These bridges handle the Arbitrum
        intermediary step automatically, though they charge their own bridge fee (usually 0.04%–0.10%).
        For most users depositing for the first time, the Arbitrum route is simplest and cheapest.
      </P>

      <H2 id="step-interface">Step 4: Explore the Interface</H2>
      <P>
        Hyperliquid&apos;s interface is designed to feel familiar to anyone who has used a centralized
        exchange like Binance or Bybit. The main sections are organized across the top navigation bar:
        Trade, Portfolio, Vaults, and Staking. Let&apos;s walk through each one.
      </P>
      <P>
        <strong>Portfolio:</strong> This is your account dashboard. It shows your USDC balance, open
        positions, unrealized PnL, margin usage, and trade history. You can deposit and withdraw from
        this section. The portfolio page also displays your fee tier based on rolling 14-day volume and
        your referral information.
      </P>
      <P>
        <strong>Trade:</strong> The main trading interface. The left side shows the real-time order book
        with bid and ask prices. The center displays the TradingView price chart (customizable with
        different timeframes, indicators, and chart types). The right side is the order entry panel where
        you select market or limit orders, set leverage, and place trades. Below the chart, you can see
        your open positions, pending orders, and recent fills.
      </P>
      <P>
        <strong>Vaults:</strong> Access the HLP vault (Hyperliquid&apos;s protocol-owned market-making
        vault) and user-created vaults. You can deposit USDC into HLP for passive yield or browse
        trader-operated vaults for copy-trading strategies. See
        our <InlineLink href="/learn/hlp-vault-guide">HLP Vault Guide</InlineLink> for a deep dive.
      </P>
      <P>
        <strong>Staking:</strong> Stake HYPE tokens to earn validator rewards and participate in
        governance. This section shows available validators, current APY, and your staking positions.
        Covered in detail in
        our <InlineLink href="/learn/hyperliquid-staking-guide">Staking Guide</InlineLink>.
      </P>
      <P>
        In addition to the native interface, several ecosystem projects offer alternative trading
        terminals with advanced features. Hyperdrive Trade and Insilico Terminal provide enhanced
        charting, advanced order types, multi-screen layouts, and customizable hotkeys for power users
        who want more than the default interface offers.
      </P>

      <H2 id="step-trade">Step 5: Place Your First Trade</H2>
      <P>
        Let&apos;s walk through placing your first perpetual futures trade step by step. For this example,
        we will open a long BTC-PERP position.
      </P>
      <P>
        <strong>Select the market.</strong> In the Trade section, use the market selector at the top left
        to search for and select &quot;BTC-PERP.&quot; The chart and order book will update to show
        Bitcoin perpetual futures data. You can also type the market name directly into the search bar to
        find it quickly among the 229 available markets.
      </P>
      <P>
        <strong>Choose your order type.</strong> In the order entry panel on the right, you will see two
        primary options: Market and Limit. A market order executes immediately at the best available price
        (you pay the taker fee of 0.035%). A limit order lets you set a specific price — your order will
        only execute if the market reaches your price (you earn the maker rebate of 0.01%). For your first
        trade, a market order is simpler, though limit orders are generally recommended for cost savings.
      </P>
      <P>
        <strong>Set your leverage.</strong> The leverage slider lets you choose between 1x and up to 50x
        leverage (maximum varies by market). For beginners, start with low leverage — 2x to 5x maximum.
        Higher leverage amplifies both gains and losses. At 10x leverage, a 10% price move against your
        position will wipe out your entire margin. At 2x leverage, you need a 50% adverse move to face
        liquidation — a much larger safety cushion while you learn.
      </P>
      <P>
        <strong>Choose margin mode.</strong> Hyperliquid offers two margin modes: Cross and Isolated. In
        cross margin mode, your entire account balance is available as collateral for all open positions —
        this provides more liquidation headroom but means one losing position can affect your entire
        account. In isolated margin mode, each position has its own dedicated margin — if one position
        gets liquidated, only the margin assigned to that specific position is lost. For beginners,
        isolated margin is generally safer because it limits your maximum loss per trade to the margin
        you assigned.
      </P>
      <P>
        <strong>Enter your size and execute.</strong> Enter the USDC amount you want to use as margin (for
        example, $100 with 5x leverage gives you a $500 notional position). Review the details: entry
        price, estimated fees, liquidation price, and position size. Click &quot;Buy / Long&quot; (if you
        expect the price to go up) or &quot;Sell / Short&quot; (if you expect it to go down). Confirm the
        trade — no gas fee is required, and the order is processed within sub-second latency.
      </P>

      <H2 id="step-manage">Step 6: Manage Your Position</H2>
      <P>
        Once your trade is executed, it appears in the &quot;Positions&quot; panel below the chart. This
        panel shows real-time information for each open position: entry price, current mark price,
        unrealized PnL (in USDC and percentage), liquidation price, leverage, margin, and funding rate
        status.
      </P>
      <P>
        <strong>Setting a stop-loss.</strong> A stop-loss is an order that automatically closes your
        position if the price moves against you by a specified amount. This is the most important risk
        management tool in leveraged trading. Click the &quot;TP/SL&quot; button next to your position
        to set a stop-loss price. For a long position, set your stop-loss below your entry price — for
        example, if you entered BTC at $95,000, a stop-loss at $93,000 limits your maximum loss to
        approximately 2.1% of the position&apos;s notional value.
      </P>
      <P>
        <strong>Setting a take-profit.</strong> Similarly, you can set a take-profit order that
        automatically closes your position when it reaches a target price. If you entered long at
        $95,000, a take-profit at $98,000 would lock in a 3.2% gain. Using both stop-loss and
        take-profit simultaneously creates a defined risk-reward setup where you know your maximum loss
        and target gain before the trade plays out.
      </P>
      <P>
        <strong>Adjusting leverage and margin.</strong> You can modify your position after opening it.
        To add margin (reducing liquidation risk), click the margin edit button next to the position.
        To adjust leverage, use the leverage modifier. You can also partially close a position by placing
        a reduce-only order for a portion of your position size — useful for taking partial profits
        while letting the remainder run.
      </P>
      <P>
        <strong>Funding rate payments.</strong> If you hold a position across a funding interval (every
        8 hours at 00:00, 08:00, and 16:00 UTC), funding is automatically settled. If you are long and
        the funding rate is positive, a small amount is deducted from your margin and paid to short
        holders (and vice versa). These payments appear in your trade history and are reflected in your
        realized PnL. For more on how funding works, see
        our <InlineLink href="/learn/hyperliquid-fees">Hyperliquid Fees Guide</InlineLink>.
      </P>

      <H2 id="step-withdraw">Step 7: Withdraw</H2>
      <P>
        When you are ready to move funds off Hyperliquid, navigate to the Portfolio section and click
        &quot;Withdraw.&quot; Enter the amount of USDC you want to withdraw. Note that any USDC being used
        as margin for open positions is not available for withdrawal — you must close or reduce positions
        first to free up that margin.
      </P>
      <P>
        The withdrawal sends your USDC back to Arbitrum One. A flat bridge fee of approximately $1–2 USDC
        is deducted. The withdrawal typically processes within 5–15 minutes depending on validator
        confirmations. Once the USDC arrives in your MetaMask wallet on Arbitrum, you can swap it for
        other tokens, send it to a centralized exchange, or bridge it to another chain.
      </P>
      <P>
        For users who want to move funds to a bank account, the typical flow is: withdraw USDC from
        Hyperliquid to Arbitrum, send the USDC to a centralized exchange (like Coinbase) that supports
        Arbitrum deposits, sell USDC for fiat currency, and withdraw to your bank. The entire process
        from Hyperliquid to bank account typically takes 30 minutes to a few hours depending on the
        exchange&apos;s processing time.
      </P>

      <H2 id="common-mistakes">Common Mistakes for Beginners</H2>
      <P>
        <strong>Over-leveraging.</strong> This is by far the most common and most costly mistake. New
        traders are drawn to 20x, 30x, or even 50x leverage because of the potential for large percentage
        gains. But high leverage also means high risk — at 20x leverage, a 5% price move against you
        results in a 100% loss (liquidation). Start with 2x–5x leverage until you have a clear
        understanding of how position sizing, liquidation prices, and margin requirements interact. Many
        experienced traders rarely exceed 10x even on their highest-conviction setups.
      </P>
      <P>
        <strong>Ignoring funding rates.</strong> Funding rates are a hidden cost that catches many new
        perpetual traders off guard. If you hold a long position during a period of strongly positive
        funding, you might be paying 0.03%–0.15% of your position value per day — that is 1%–4.5% per
        month, or 12%–54% annualized. On a $10,000 position, daily funding of 0.10% costs $10 per day,
        $300 per month. Always check the current funding rate before opening a position and factor it
        into your trade thesis.
      </P>
      <P>
        <strong>Using market orders exclusively.</strong> Market orders are convenient but cost 0.035% in
        taker fees. Limit orders earn a 0.01% rebate. The difference is 0.045% per trade — on $10,000,
        that is $4.50. Over 100 trades, you save (or earn) $450. For traders who execute hundreds of
        trades per month, switching to primarily limit orders can mean the difference between profitability
        and breakeven.
      </P>
      <P>
        <strong>Not setting stop-losses.</strong> Trading without a stop-loss is like driving without a
        seatbelt — everything is fine until it is not. A single large adverse move can wipe out weeks of
        accumulated profits. Always set a stop-loss immediately after opening a position, even if you
        plan to actively monitor the trade. Markets can move dramatically in minutes, and you may not
        always be at your screen when it happens.
      </P>
      <P>
        <strong>Bridging to the wrong address.</strong> When withdrawing USDC from Hyperliquid or
        depositing from an exchange, always double-check the destination address. Funds sent to an
        incorrect address on-chain are generally unrecoverable. Use copy-paste rather than manual entry,
        and verify the first and last few characters of the address before confirming any transaction.
      </P>

      <H2 id="safety">Safety Notes</H2>
      <P>
        Hyperliquid is a self-custody exchange, which means you are fully responsible for the security of
        your funds. There is no customer support team that can recover lost funds, reverse erroneous
        transactions, or reset your password. This is both the advantage and the responsibility of
        decentralized finance.
      </P>
      <P>
        Protect your seed phrase above all else. Anyone with access to your 12- or 24-word seed phrase can
        access your wallet and all funds within it. Store it offline — written on paper, engraved on
        metal, or in a dedicated hardware security module. Never store it digitally, never take a photo
        of it, and never enter it on any website or app other than your wallet software during initial
        setup or recovery.
      </P>
      <P>
        For accounts holding significant value (more than $5,000), strongly consider using a hardware
        wallet. Ledger and Trezor devices connect to MetaMask and work seamlessly with Hyperliquid. The
        hardware wallet stores your private keys in a secure element that never exposes them to your
        browser, protecting you from phishing attacks, malware, and browser-based exploits.
      </P>
      <P>
        Be cautious of phishing sites. The only legitimate Hyperliquid URL is <strong>app.hyperliquid.xyz</strong>.
        Bookmark it and always navigate directly rather than clicking links in messages, emails, or social
        media posts. Phishing sites that mimic the Hyperliquid interface have been used to steal funds
        from unsuspecting users. Never approve token spending permissions or sign transactions prompted by
        unfamiliar websites.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <P>
        Now that you know how to use Hyperliquid, here are several paths for going deeper into the
        ecosystem:
      </P>
      <P>
        <strong>Earn passive yield.</strong> Deposit USDC into the HLP vault to earn returns from
        market-making activity without actively trading. Our{" "}
        <InlineLink href="/learn/hlp-vault-guide">HLP Vault Guide</InlineLink> explains how it works,
        the current APY, and the risks involved.
      </P>
      <P>
        <strong>Stake HYPE.</strong> If you hold HYPE tokens, you can stake them to earn validator rewards
        and support network security. Read our{" "}
        <InlineLink href="/learn/hyperliquid-staking-guide">Hyperliquid Staking Guide</InlineLink> for
        a full walkthrough of staking options including liquid staking via Kinetiq and StakedHYPE.
      </P>
      <P>
        <strong>Explore HyperEVM DeFi.</strong> Hyperliquid&apos;s EVM layer supports a growing
        ecosystem of DeFi protocols — lending, DEXs, yield aggregators, and more. Our guide to
        the <InlineLink href="/learn/best-hyperevm-projects">Best HyperEVM Projects</InlineLink> covers
        the most notable protocols building on the platform.
      </P>
      <P>
        <strong>Understand fees in depth.</strong> To optimize your trading costs, read our{" "}
        <InlineLink href="/learn/hyperliquid-fees">Hyperliquid Fees Guide</InlineLink>, which covers
        volume tiers, maker rebates, funding rates, and strategies for minimizing your effective fee rate.
      </P>

      <CTA href="/learn/what-is-hyperliquid">What Is Hyperliquid? — Complete Overview &rarr;</CTA>
    </LearnLayout>
  );
}
