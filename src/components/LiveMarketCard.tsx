"use client";
import { useEffect, useState } from "react";
import { Sparkline } from "./charts/Sparkline";
import { formatCompactUsd, formatPrice } from "@/lib/format";

interface MarketCardData {
  coin: string;
  markPx: string;
  prevDayPx: string;
  funding: string;
  openInterest: string;
  dayNtlVlm: string;
}

export function LiveMarketCard({ coin }: { coin: string }) {
  const [data, setData] = useState<MarketCardData | null>(null);

  useEffect(() => {
    fetch(`/api/market-data?coin=${coin}`)
      .then((r) => r.json())
      .then((d) => { if (d.coin) setData(d); })
      .catch(() => {});
  }, [coin]);

  if (!data) return null;

  const price = parseFloat(data.markPx);
  const prev = parseFloat(data.prevDayPx);
  const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
  const funding8h = parseFloat(data.funding) * 100;
  const oi = parseFloat(data.openInterest);
  const vol = parseFloat(data.dayNtlVlm);

  return (
    <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
      <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
        Live Market Data
      </h3>
      <Sparkline coin={coin} />
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--hw-text-dim)]">Price</dt>
          <dd className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
            {formatPrice(price)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--hw-text-dim)]">24h Change</dt>
          <dd className={`font-[family-name:var(--font-jetbrains-mono)] ${change >= 0 ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}%
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--hw-text-dim)]">Funding/8h</dt>
          <dd className={`font-[family-name:var(--font-jetbrains-mono)] ${funding8h >= 0 ? "text-[var(--hw-green)]" : "text-[var(--hw-red)]"}`}>
            {funding8h >= 0 ? "+" : ""}{(funding8h * 8).toFixed(4)}%
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--hw-text-dim)]">Open Interest</dt>
          <dd className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{formatCompactUsd(oi)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--hw-text-dim)]">24h Volume</dt>
          <dd className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">{formatCompactUsd(vol)}</dd>
        </div>
      </dl>
    </div>
  );
}
