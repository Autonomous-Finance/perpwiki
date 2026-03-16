import { getArticle, getAdjacentArticles } from "@/lib/learn-articles";
import { LearnLayout, H2, P, InlineLink, Callout, CTA } from "@/components/LearnLayout";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SLUG = "perpetual-futures-tax";
const article = getArticle(SLUG)!;
const { prev, next } = getAdjacentArticles(SLUG);

export const metadata: Metadata = {
  title: "Perpetual Futures Tax Guide 2026: How Perps Are Taxed",
  description:
    "How perpetual futures contracts are taxed in 2026. Covers US, UK, and EU treatment of crypto perp gains, funding payments, and unrealized PnL. Includes Hyperliquid-specific notes.",
  alternates: { canonical: `https://perp.wiki/learn/${SLUG}` },
  openGraph: {
    title: "Perpetual Futures Tax Guide 2026: How Perps Are Taxed",
    description:
      "How perpetual futures contracts are taxed in 2026. Covers US, UK, and EU treatment of crypto perp gains, funding payments, and unrealized PnL. Includes Hyperliquid-specific notes.",
    url: `https://perp.wiki/learn/${SLUG}`,
    siteName: "perp.wiki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Perpetual Futures Tax Guide 2026: How Perps Are Taxed",
    description:
      "How perpetual futures contracts are taxed in 2026. US, UK, and EU treatment of perp gains, funding payments, and Hyperliquid-specific notes.",
  },
};

const TOC = [
  { id: "disclaimer", title: "Disclaimer" },
  { id: "how-perps-are-classified", title: "How Perps Are Classified" },
  { id: "us-tax-treatment", title: "US Tax Treatment" },
  { id: "section-1256", title: "Section 1256 Contracts" },
  { id: "mark-to-market", title: "Mark-to-Market Rules" },
  { id: "funding-rate-income", title: "Funding Rate Payments" },
  { id: "position-tracking", title: "FIFO vs Specific ID" },
  { id: "uk-treatment", title: "UK Tax Treatment" },
  { id: "eu-treatment", title: "EU Tax Treatment" },
  { id: "taxable-events", title: "What Counts as a Taxable Event" },
  { id: "hyperliquid-notes", title: "Hyperliquid-Specific Notes" },
  { id: "common-mistakes", title: "Common Mistakes" },
  { id: "faq", title: "FAQ" },
];

const FAQ = [
  {
    question: "Are funding payments taxable?",
    answer:
      "In most jurisdictions, yes. Funding payments received by short holders (when longs pay shorts due to positive funding) are generally treated as ordinary income in the tax year they are received. Funding payments you pay out as a long holder may be deductible as a trading expense, depending on your jurisdiction and tax classification. Always record the USD value of each funding payment at the time it is received or paid.",
  },
  {
    question: "Do I pay tax on unrealized perpetual futures gains?",
    answer:
      "In most countries — including the US, UK, and EU member states — you do not owe tax on unrealized gains from open perpetual futures positions. Tax is triggered when you close (realize) the position. The main exception is if you elect mark-to-market accounting under US IRC Section 475, in which case all open positions are treated as sold at year-end for tax purposes. Standard traders do not make this election and owe nothing on unrealized PnL.",
  },
  {
    question: "How do I report Hyperliquid trades on my taxes?",
    answer:
      "Start by exporting your complete trade history from Hyperliquid using the trade history export feature in the app or via the Hyperliquid API. Import this data into a crypto tax tool such as Koinly, TokenTax, or CoinTracking, which can calculate your realized gains, losses, and funding income automatically. From there, the tool generates the tax forms you need — Schedule D and Form 8949 for US taxpayers, SA108 for UK taxpayers, and country-specific forms for EU residents. Keep records of all exports in case of audit.",
  },
];

export default function PerpetualFuturesTaxPage() {
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

      <H2 id="disclaimer">Disclaimer</H2>
      <Callout>
        This article is for informational purposes only and does not constitute tax advice. Tax
        treatment of crypto derivatives varies significantly by jurisdiction, individual
        circumstances, and how activities are classified. Consult a qualified tax professional
        for advice specific to your situation before making any tax decisions.
      </Callout>

      <H2 id="how-perps-are-classified">How Perps Are Classified: Derivatives, Not Spot</H2>
      <P>
        Perpetual futures are derivatives — contracts whose value is derived from an underlying
        asset — rather than direct ownership of that asset. This distinction matters enormously for
        tax purposes. When you buy spot Bitcoin, you own Bitcoin. When you trade a BTC perpetual
        futures contract, you own a financial contract that tracks the price of Bitcoin. These two
        instruments are taxed differently in every major jurisdiction.
      </P>
      <P>
        The derivative classification means that the tax rules applying to spot crypto transactions
        — which most tax authorities now treat as property disposals — do not automatically apply
        to perp trades. Instead, tax authorities generally look to their existing rules for
        financial derivatives: futures contracts, contracts for difference (CFDs), or financial
        instruments, depending on the country. In practice, this can be more favorable (lower tax
        rates, better loss treatment) or more burdensome (mark-to-market requirements) depending
        on your jurisdiction.
      </P>
      <P>
        A key conceptual distinction: trading a <InlineLink href="/learn/what-is-hyperliquid">Hyperliquid</InlineLink>{" "}
        perpetual futures contract is economically similar to trading a CFD or a futures contract
        on a traditional exchange. You are gaining or losing money based on price movement of the
        underlying, but you never actually hold the underlying asset. Most tax authorities
        recognize this distinction, which is why crypto perp traders often find themselves
        subject to derivatives tax rules rather than the standard crypto property disposal rules.
      </P>

      <H2 id="us-tax-treatment">US Tax Treatment of Perpetual Futures</H2>
      <P>
        The United States has the most detailed and complex framework for taxing financial
        derivatives, and applying that framework to crypto perpetual futures involves meaningful
        uncertainty. The IRS has issued relatively limited guidance specifically on crypto
        derivatives, leaving traders to apply general derivatives tax principles and wait for
        further clarification.
      </P>
      <P>
        The foundational question for any US trader is: does your perp trading activity qualify
        for Section 1256 treatment, or does it fall under the standard capital gains rules? The
        answer affects your tax rate, your ability to carry back losses, and your year-end
        reporting obligations. Most US crypto perp traders currently report under standard capital
        gains rules (Section 1221), but Section 1256 may apply in some circumstances.
      </P>

      <H2 id="section-1256">Section 1256 Contracts: Does It Apply to Crypto Perps?</H2>
      <P>
        Section 1256 of the Internal Revenue Code provides a special tax treatment for certain
        regulated futures contracts and foreign currency contracts. Under Section 1256, gains and
        losses are split 60/40 — 60% are treated as long-term capital gains regardless of how
        long the position was held, and 40% are treated as short-term capital gains. Because
        long-term capital gains are taxed at lower rates (0%, 15%, or 20% depending on income),
        Section 1256 treatment is generally favorable compared to standard short-term rates (up
        to 37%).
      </P>
      <P>
        The critical requirement for Section 1256 treatment is that the contract must be a
        &quot;regulated futures contract&quot; traded on a &quot;qualified board or exchange.&quot;
        Traditional crypto futures traded on CFTC-regulated exchanges like the CME (Bitcoin futures,
        Ether futures) clearly qualify for Section 1256. However, perpetual futures traded on
        decentralized exchanges like Hyperliquid almost certainly do not qualify, because these
        platforms are not regulated boards or exchanges under the CFTC&apos;s definition.
      </P>
      <P>
        For this reason, most tax professionals advise US traders to treat crypto perp gains and
        losses under standard capital gains rules (Section 1221) rather than Section 1256. This
        means short-term capital gains rates apply to positions held less than one year (which
        describes the vast majority of perp trades), and losses can only be deducted against
        capital gains (not ordinary income) in most cases. The absence of Section 1256 treatment
        also means no loss carryback — perp losses carry forward, not back.
      </P>
      <P>
        Note that this remains an evolving area of tax law. As regulatory clarity around crypto
        derivatives increases, the IRS may issue specific guidance. Traders with significant
        perp volume should work with a crypto tax attorney to assess whether any arguments exist
        for Section 1256 treatment in their specific circumstances.
      </P>

      <H2 id="mark-to-market">Mark-to-Market Rules for Traders</H2>
      <P>
        US taxpayers who qualify as &quot;traders&quot; rather than &quot;investors&quot; have
        access to a special election under Section 475(f) known as mark-to-market accounting.
        Under this election, all open positions are treated as sold at fair market value on the
        last trading day of the year, and all gains and losses are treated as ordinary income
        rather than capital gains.
      </P>
      <P>
        The mark-to-market election can be advantageous for active perp traders because ordinary
        trading losses can be deducted against any type of income (not just capital gains), and
        there is no wash sale rule for ordinary income. However, the election also means you owe
        tax on unrealized gains at year-end — even if you have not closed your positions and
        received cash. This cash-flow mismatch can be burdensome for traders with large open
        positions.
      </P>
      <P>
        Qualifying as a &quot;trader&quot; for tax purposes requires that trading be your primary
        activity, conducted with continuity and regularity, with the intent to profit from
        short-term price swings rather than long-term appreciation. The IRS applies a facts-and-
        circumstances test. Casual or part-time traders typically do not qualify. For those who
        do qualify and make the election, mark-to-market accounting eliminates the complex lot
        tracking that standard capital gains reporting requires — every open position is simply
        marked to market at year-end.
      </P>

      <H2 id="funding-rate-income">Funding Rate Payments: Ordinary Income</H2>
      <P>
        <InlineLink href="/learn/hyperliquid-funding-rates-guide">Funding rate</InlineLink>{" "}
        payments present a distinct tax issue that many perp traders overlook. On Hyperliquid,
        funding rates are settled every 8 hours — at 00:00, 08:00, and 16:00 UTC. If you hold a
        short position during periods of positive funding (when longs pay shorts), you receive
        periodic cash inflows to your account. These inflows are generally treated as ordinary
        income in the US, not as capital gains.
      </P>
      <P>
        The practical consequence is that funding payments received are taxed at your marginal
        income tax rate — potentially up to 37% federally, plus state taxes — rather than the
        preferential capital gains rates. This distinction matters particularly for traders who
        pursue <InlineLink href="/learn/hyperliquid-funding-rates-guide">funding rate farming</InlineLink>{" "}
        strategies (long spot, short perp) that generate substantial funding income.
      </P>
      <P>
        Funding payments you make as a long holder (paying shorts when funding is positive) may
        be deductible as a trading expense, reducing your net taxable income. However, the
        deductibility depends on whether you are classified as a trader (can deduct as ordinary
        business expenses) or an investor (limited to investment expense deductions, which were
        eliminated for most taxpayers through 2025 under the Tax Cuts and Jobs Act). The
        treatment of funding payments remains an area where professional guidance is particularly
        valuable.
      </P>
      <P>
        Record-keeping is essential: you need the USD value of each funding payment at the time
        it was received or paid. Most crypto tax software can import Hyperliquid trade history
        and calculate this automatically, but verify the results against your actual account
        history.
      </P>

      <H2 id="position-tracking">FIFO vs Specific Identification for Position Tracking</H2>
      <P>
        When you open and close multiple perp positions in the same market at different prices,
        you need a method for determining which positions were closed and at what cost basis.
        The two main methods are FIFO (first in, first out) and specific identification.
      </P>
      <P>
        Under <strong>FIFO</strong>, when you close part of a position, you are deemed to have
        closed the oldest open lots first. This is the default method and is simple to apply —
        your tax software typically handles it automatically. FIFO is not always optimal from a
        tax perspective: in rising markets, your oldest lots may have the lowest cost basis,
        resulting in higher capital gains.
      </P>
      <P>
        <strong>Specific identification</strong> allows you to designate which specific lots are
        being closed when you partially close a position. This flexibility can optimize your tax
        outcome — for example, you might close high-cost-basis lots first to minimize gains, or
        close loss lots to harvest tax losses. To use specific identification, you must designate
        the specific lots before or at the time of the trade, and keep adequate records to
        substantiate the designation. Some crypto tax software supports specific identification
        for exchange accounts with sufficient transaction data.
      </P>
      <P>
        For most retail perp traders who open and close single positions without complex layering,
        the FIFO vs specific ID question is less relevant — the position is simply opened and
        closed. But for active traders who add to or partially reduce positions frequently,
        understanding your lot tracking method is important for accurate tax reporting.
      </P>

      <H2 id="uk-treatment">UK Tax Treatment (HMRC Guidance)</H2>
      <P>
        HMRC, the UK tax authority, has published specific guidance on the tax treatment of
        crypto assets, including derivatives. Under HMRC&apos;s framework, profits and losses from
        crypto derivatives — including CFDs and futures contracts that settle in cash — are
        generally treated as capital gains (or losses) rather than income, provided the activity
        does not constitute financial trading as a business.
      </P>
      <P>
        For most UK retail traders, crypto perp gains fall under Capital Gains Tax (CGT). The
        CGT annual exempt amount (currently £3,000 for the 2024/25 tax year) applies to total
        gains across all assets. Gains above the exempt amount are taxed at 18% (basic rate
        taxpayer) or 24% (higher rate taxpayer) as of April 2024, following the rates applicable
        to financial assets. Capital losses from perp trades can be offset against other capital
        gains in the same year or carried forward to future years.
      </P>
      <P>
        Funding payments received in the UK context are more nuanced. HMRC has not issued specific
        guidance on the treatment of perpetual futures funding rates. The most defensible position
        appears to treat received funding payments as miscellaneous income (taxable as income at
        your marginal rate) rather than capital receipts, analogous to interest income or other
        financial income. Funding payments made may be deductible trading expenses if you qualify
        as a trader, but HMRC applies strict criteria to distinguish trading from investment
        activity.
      </P>
      <P>
        UK traders should also be aware of the bed-and-breakfasting rules (the 30-day rule) for
        crypto assets, which prevent you from selling and immediately rebuying to crystallize a
        loss. While these rules apply explicitly to spot crypto, their application to perp
        contracts is less certain — another area where professional advice is warranted.
      </P>

      <H2 id="eu-treatment">EU Tax Treatment: Key Variations by Country</H2>
      <P>
        The European Union does not have a unified crypto tax framework, so treatment varies
        significantly by member state. Most EU countries treat crypto derivatives gains as capital
        gains, but the rates, exemptions, and reporting requirements differ substantially.
      </P>
      <P>
        <strong>Germany</strong> generally exempts capital gains on private crypto disposals held
        for more than one year, but this exemption applies to spot crypto property rather than
        derivatives. Crypto perp gains in Germany are typically subject to capital gains tax
        regardless of holding period, at rates up to 26.375% (including solidarity surcharge).
        Gains below the annual exemption threshold (€1,000 as of 2024) may be exempt for private
        individuals.
      </P>
      <P>
        <strong>France</strong> taxes crypto gains at a flat rate of 30% (PFU — prélèvement
        forfaitaire unique) for occasional investors, or at progressive income tax rates for
        habitual traders. Derivative trading may be classified differently under French tax law,
        and the threshold between &quot;occasional&quot; and &quot;habitual&quot; is not clearly
        defined for crypto derivatives.
      </P>
      <P>
        <strong>The Netherlands</strong> uses a wealth tax (Box 3) approach that taxes deemed
        returns on net wealth rather than actual gains — including crypto holdings. Perp positions
        may be counted as financial assets in the Box 3 calculation, though the treatment of
        leveraged derivative positions is complex.
      </P>
      <P>
        In all EU countries, DAC8 — the EU&apos;s crypto asset reporting directive — came into
        force in 2026, requiring exchanges and service providers to report crypto transaction data
        to tax authorities. EU-based traders on centralized platforms will have their trading
        activity automatically reported, increasing the importance of accurate voluntary
        disclosure.
      </P>

      <H2 id="taxable-events">What Counts as a Taxable Event</H2>
      <P>
        Understanding which activities trigger a tax liability is fundamental to proper
        crypto perp tax compliance. Not all account activity is a taxable event.
      </P>
      <P>
        <strong>Closing a position (realized gain or loss).</strong> The primary taxable event
        for perp traders is closing an open position. When you close a long or short perp
        position, you realize a gain or loss equal to the difference between your entry price
        and exit price, multiplied by your position size. This realized PnL is reportable
        in the tax year the position is closed. Partial closes are also taxable events — each
        close triggers recognition of the corresponding portion of your gain or loss.
      </P>
      <P>
        <strong>Receiving funding payments.</strong> Each funding settlement that results in a
        payment to your account is a taxable event — ordinary income in the year received, at the
        USD value of the payment at settlement time. If you receive 1,095 funding payments per
        year across three daily settlements, each one is a separate income event that must be
        recorded. In practice, most crypto tax software aggregates these automatically from
        exchange export data.
      </P>
      <P>
        <strong>Liquidation events.</strong> If your position is liquidated because your margin
        falls below the maintenance margin requirement, this is treated as a forced close. The
        tax treatment is the same as a voluntary close — you realize a loss equal to the
        difference between your entry price and the liquidation price. Any remaining margin
        returned to you is not a separate taxable event. Liquidation losses can offset other
        capital gains.
      </P>
      <P>
        <strong>What is NOT a taxable event.</strong> Opening a position (no gain or loss is
        realized at entry), transferring funds between wallets you control, depositing to or
        withdrawing from a perp exchange (assuming no asset conversion), and holding an open
        position (unrealized gains and losses are not taxable until the position is closed).
      </P>

      <H2 id="hyperliquid-notes">Hyperliquid-Specific Notes</H2>
      <P>
        Hyperliquid is a non-custodial, decentralized perpetual exchange running on its own
        L1 blockchain. For tax purposes, this creates some practical differences compared to
        trading on centralized exchanges. There are no KYC requirements or automatic tax
        reporting to tax authorities (though this may change as regulations evolve). This means
        traders on Hyperliquid are solely responsible for their own record-keeping and reporting.
      </P>
      <P>
        <strong>Exporting trade history from Hyperliquid.</strong> Hyperliquid provides a trade
        history export feature accessible from the app&apos;s account section. You can download
        a CSV containing your complete trade history, including entry and exit prices, position
        sizes, realized PnL, and funding payments. The export covers both your perpetual trades
        and spot trades. For programmatic access, the{" "}
        <InlineLink href="/learn/hyperliquid-api-guide">Hyperliquid API</InlineLink> also exposes
        historical trade data, which some tax tools use for direct integration.
      </P>
      <P>
        <strong>Recommended crypto tax tools.</strong> Several crypto tax platforms support
        Hyperliquid data imports and can calculate your tax liability automatically. <strong>Koinly</strong>{" "}
        (koinly.io) supports Hyperliquid via CSV import and API and is widely used for its
        ease of use and support for perp PnL calculations. <strong>TokenTax</strong> (tokentax.com)
        offers professional-grade crypto tax reporting with strong support for derivatives and
        is popular with active traders who need CPA-level reporting. <strong>CoinTracking</strong>{" "}
        (cointracking.info) is a comprehensive portfolio tracking and tax reporting tool that
        supports Hyperliquid imports and can handle large transaction volumes. <strong>Accointing</strong>{" "}
        and <strong>Crypto.com Tax</strong> are additional options that support CSV imports for
        platforms not natively integrated.
      </P>
      <P>
        When importing Hyperliquid data, verify that the tool correctly categorizes funding
        payments as income (not capital gains) and that realized perp PnL is accurately
        calculated from your entry and exit prices. Review the generated tax forms against
        your actual account history before filing.
      </P>

      <H2 id="common-mistakes">Common Mistakes Perp Traders Make</H2>
      <P>
        <strong>Ignoring funding payments.</strong> Funding payments are easily overlooked because
        they appear as small, frequent credits or debits rather than dramatic P&L events.
        Over a full year of active trading, cumulative funding income can be substantial.
        Omitting it from your tax return is an underreporting error that audits can surface
        easily, since the amounts are visible in your account history.
      </P>
      <P>
        <strong>Treating perp gains as long-term capital gains.</strong> Because perpetual futures
        have no expiry date, some traders assume they can achieve long-term capital gains
        treatment by holding a position for more than one year. Under standard capital gains
        rules, this may be possible if you hold an open perp position for over 12 months before
        closing — but in practice, almost all perp positions are held for far shorter periods.
        Additionally, if mark-to-market treatment applies, holding period is irrelevant.
      </P>
      <P>
        <strong>Failing to record USD values at transaction time.</strong> Tax liability is
        calculated in your local fiat currency at the time of each transaction. If you received
        funding in USDC and the USDC/USD rate was not exactly 1.00 at the time, the USD value
        at transaction time is what matters — not the current value. Use tax software that
        records prices at transaction timestamps automatically.
      </P>
      <P>
        <strong>Assuming DeFi transactions are invisible to tax authorities.</strong> While
        Hyperliquid does not currently report to tax authorities, on-chain transactions are
        permanently recorded on the blockchain. Tax authorities in the US, UK, and EU are
        increasingly using blockchain analytics to identify unreported crypto income. Do not
        assume that decentralized trading is untraceable or that the absence of a 1099 form
        means income is not reportable.
      </P>
      <P>
        <strong>Not tracking loss harvesting opportunities.</strong> Perp losses are a tax asset.
        If you have unrealized losses on open positions near year-end, closing those positions
        realizes the loss, which can offset other capital gains (and, depending on your
        classification, potentially ordinary income). Systematic loss harvesting across your
        perp and spot portfolios can meaningfully reduce your tax bill.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      {FAQ.map((f) => (
        <div key={f.question}>
          <P><strong>{f.question}</strong></P>
          <P>{f.answer}</P>
        </div>
      ))}

      <CTA href="/learn/perpetual-futures-vs-options">
        Next: Perpetual Futures vs Options &rarr;
      </CTA>
    </LearnLayout>
  );
}
