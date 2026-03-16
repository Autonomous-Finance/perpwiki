/* ── Live Data Components (Server Components) ───────────────────
   All components fetch from Hyperliquid API with ISR revalidation.
   Every fetch has try/catch with static fallbacks.                */

import Link from "next/link";

/* ── Shared helpers ─────────────────────────────────────────── */

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hw-green)]" />
    </span>
  );
}

function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

/* ── API fetchers ───────────────────────────────────────────── */

export async function fetchHypePrice(): Promise<number | null> {
  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "allMids" }),
      next: { revalidate: 120 },
    });
    const data = await res.json();
    const price = parseFloat(data?.["HYPE"]);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
}

interface MarketData {
  name: string;
  funding: number;
  openInterest: number;
  dayNtlVlm: number;
  markPx: number;
}

export async function fetchMetaAndAssetCtxs(): Promise<MarketData[] | null> {
  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
      next: { revalidate: 120 },
    });
    const [meta, contexts] = await res.json();
    return meta.universe.map((m: { name: string }, i: number) => ({
      name: m.name,
      funding: parseFloat(contexts[i].funding) || 0,
      openInterest: parseFloat(contexts[i].openInterest) * parseFloat(contexts[i].markPx) || 0,
      dayNtlVlm: parseFloat(contexts[i].dayNtlVlm) || 0,
      markPx: parseFloat(contexts[i].markPx) || 0,
    }));
  } catch {
    return null;
  }
}

/* ── LiveFundingRatesTable ──────────────────────────────────── */

export async function LiveFundingRatesTable({ topN = 8 }: { topN?: number }) {
  const markets = await fetchMetaAndAssetCtxs();
  const isLive = markets !== null;

  const data = (markets ?? [])
    .filter((m) => m.funding !== 0)
    .sort((a, b) => Math.abs(b.funding) - Math.abs(a.funding))
    .slice(0, topN);

  if (data.length === 0) {
    return (
      <div className="my-6 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6 text-center text-sm text-[var(--hw-text-dim)]">
        Funding rate data unavailable — check back shortly.
      </div>
    );
  }

  return (
    <div className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)]" style={{ borderRadius: "4px" }}>
      <div className="flex items-center gap-2 border-b border-[var(--hw-border)] px-4 py-2.5">
        {isLive && <LiveDot />}
        <span className="text-xs font-medium text-[var(--hw-text-dim)]">
          {isLive ? "Live Funding Rates" : "Estimated Funding Rates"} &middot; Updated every 2 min
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-left text-xs font-medium text-[var(--hw-text-dim)]">Market</th>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-right text-xs font-medium text-[var(--hw-text-dim)]">Rate (8h)</th>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-right text-xs font-medium text-[var(--hw-text-dim)]">APY Equiv</th>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-right text-xs font-medium text-[var(--hw-text-dim)]">Direction</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => {
              const pct = m.funding * 100;
              const apy = Math.abs(pct) * 3 * 365;
              const isPositive = m.funding > 0;
              const color = isPositive
                ? "text-red-400"    // longs pay
                : "text-emerald-400"; // shorts pay (longs earn)
              return (
                <tr key={m.name} className="border-b border-[var(--hw-border)] last:border-b-0">
                  <td className="px-4 py-2.5 font-medium text-[var(--hw-text)]">
                    <Link href={`/markets`} className="hover:text-[var(--hw-green)]">
                      {m.name}-PERP
                    </Link>
                  </td>
                  <td className={`px-4 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] ${color}`}>
                    {pct >= 0 ? "+" : ""}{pct.toFixed(4)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] ${color}`}>
                    {apy.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs ${color}`}>
                      {isPositive ? "Longs pay" : "Shorts pay"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── LiveTopOI ──────────────────────────────────────────────── */

export async function LiveTopOI({ topN = 8 }: { topN?: number }) {
  const markets = await fetchMetaAndAssetCtxs();
  const isLive = markets !== null;

  const data = (markets ?? [])
    .sort((a, b) => b.openInterest - a.openInterest)
    .slice(0, topN);

  if (data.length === 0) {
    return (
      <div className="my-6 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6 text-center text-sm text-[var(--hw-text-dim)]">
        Open interest data unavailable — check back shortly.
      </div>
    );
  }

  return (
    <div className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)]" style={{ borderRadius: "4px" }}>
      <div className="flex items-center gap-2 border-b border-[var(--hw-border)] px-4 py-2.5">
        {isLive && <LiveDot />}
        <span className="text-xs font-medium text-[var(--hw-text-dim)]">
          {isLive ? "Live Open Interest" : "Estimated Open Interest"} &middot; Top {topN} Markets
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-left text-xs font-medium text-[var(--hw-text-dim)]">Market</th>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-right text-xs font-medium text-[var(--hw-text-dim)]">Open Interest</th>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-right text-xs font-medium text-[var(--hw-text-dim)]">24h Volume</th>
              <th className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2.5 text-right text-xs font-medium text-[var(--hw-text-dim)]">Funding</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => {
              const pct = m.funding * 100;
              const fundingColor = m.funding > 0 ? "text-red-400" : m.funding < 0 ? "text-emerald-400" : "text-[var(--hw-text-dim)]";
              return (
                <tr key={m.name} className="border-b border-[var(--hw-border)] last:border-b-0">
                  <td className="px-4 py-2.5 font-medium text-[var(--hw-text)]">{m.name}-PERP</td>
                  <td className="px-4 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text)]">
                    {formatUsd(m.openInterest)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                    {formatUsd(m.dayNtlVlm)}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] ${fundingColor}`}>
                    {pct >= 0 ? "+" : ""}{pct.toFixed(4)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── LiveEcosystemStats ─────────────────────────────────────── */

export async function LiveEcosystemStats() {
  const [markets, hypePrice] = await Promise.all([
    fetchMetaAndAssetCtxs(),
    fetchHypePrice(),
  ]);

  const isLive = markets !== null;
  const data = markets ?? [];
  const totalVolume = data.reduce((s, m) => s + m.dayNtlVlm, 0);
  const totalOI = data.reduce((s, m) => s + m.openInterest, 0);
  const numMarkets = data.length || 150;
  const displayPrice = hypePrice ?? 24.5;

  const stats = [
    { label: "24h Trading Volume", value: formatUsd(totalVolume), sub: isLive ? "across all markets" : "estimate" },
    { label: "Total Open Interest", value: formatUsd(totalOI), sub: isLive ? "live aggregate" : "estimate" },
    { label: "HYPE Price", value: `$${displayPrice.toFixed(2)}`, sub: isLive ? "via Hyperliquid API" : "fallback" },
    { label: "Active Markets", value: `${numMarkets}+`, sub: "perpetual contracts" },
  ];

  return (
    <div className="my-8 rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] p-1" style={{ borderRadius: "4px" }}>
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        {isLive && <LiveDot />}
        <span className="text-xs font-medium text-[var(--hw-text-dim)]">
          {isLive ? "Live Ecosystem Data" : "Estimated Data (API unavailable)"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">{s.label}</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--hw-text)] sm:text-2xl">
              {s.value}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LiveHypePrice ──────────────────────────────────────────── */

export async function LiveHypePrice() {
  const price = await fetchHypePrice();
  const isLive = price !== null;
  const display = price ?? 24.5;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hw-surface-raised)] px-3 py-1 text-sm font-medium text-[var(--hw-text)]">
      {isLive && <LiveDot />}
      <span className="font-[family-name:var(--font-jetbrains-mono)]">${display.toFixed(2)}</span>
      <span className="text-xs text-[var(--hw-text-dim)]">HYPE</span>
    </span>
  );
}
