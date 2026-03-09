"use client";

import { useState, useMemo } from "react";

export interface FundingRow {
  name: string;
  rateHr: number;
  rateDay: number;
  rateApr: number;
  oi: number;
  oiFmt: string;
  vol24h: number;
  vol24hFmt: string;
  premium: number;
  markPx: number;
  maxLeverage: number;
}

type SortKey = "name" | "rateHr" | "rateDay" | "rateApr" | "oi" | "vol24h" | "premium";
type SortDir = "asc" | "desc";
type RateFilter = "all" | "positive" | "negative";
type OiFilter = "all" | "1m" | "10m" | "100m";

export function FundingDashboard({ rows }: { rows: FundingRow[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rateHr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [rateFilter, setRateFilter] = useState<RateFilter>("all");
  const [oiFilter, setOiFilter] = useState<OiFilter>("all");
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Aggregate stats
  const stats = useMemo(() => {
    const positive = rows.filter((r) => r.rateHr > 0);
    const negative = rows.filter((r) => r.rateHr < 0);
    const avgRate = rows.length > 0 ? rows.reduce((s, r) => s + r.rateHr, 0) / rows.length : 0;
    const totalOi = rows.reduce((s, r) => s + r.oi, 0);
    const totalVol = rows.reduce((s, r) => s + r.vol24h, 0);
    const maxPositive = rows.reduce((max, r) => (r.rateApr > max.rateApr ? r : max), rows[0]);
    const maxNegative = rows.reduce((min, r) => (r.rateApr < min.rateApr ? r : min), rows[0]);
    const oiWeightedRate = totalOi > 0
      ? rows.reduce((s, r) => s + r.rateHr * r.oi, 0) / totalOi
      : 0;
    return {
      total: rows.length,
      positive: positive.length,
      negative: negative.length,
      avgRate,
      oiWeightedRate,
      totalOi,
      totalVol,
      maxPositive,
      maxNegative,
    };
  }, [rows]);

  // Filter
  const filtered = useMemo(() => {
    let result = rows;
    const q = search.toLowerCase();
    if (q) result = result.filter((r) => r.name.toLowerCase().includes(q));
    if (rateFilter === "positive") result = result.filter((r) => r.rateHr > 0);
    if (rateFilter === "negative") result = result.filter((r) => r.rateHr < 0);
    if (oiFilter === "1m") result = result.filter((r) => r.oi >= 1_000_000);
    if (oiFilter === "10m") result = result.filter((r) => r.oi >= 10_000_000);
    if (oiFilter === "100m") result = result.filter((r) => r.oi >= 100_000_000);
    return result;
  }, [rows, search, rateFilter, oiFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") {
        return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortKey === "rateHr" || sortKey === "rateDay" || sortKey === "rateApr") {
        return sortDir === "desc"
          ? Math.abs(b[sortKey]) - Math.abs(a[sortKey])
          : Math.abs(a[sortKey]) - Math.abs(b[sortKey]);
      }
      return sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    });
  }, [filtered, sortKey, sortDir]);

  // Heatmap data (top 40 by OI)
  const heatmapData = useMemo(() => {
    return [...rows]
      .sort((a, b) => b.oi - a.oi)
      .slice(0, 40);
  }, [rows]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  function rateColor(val: number) { return val >= 0 ? "#00E5A0" : "#FF4D6A"; }

  function fmtUsd(n: number) {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  }

  return (
    <div className="space-y-6">
      {/* ===== AGGREGATE STATS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Markets" value={String(stats.total)} />
        <StatCard
          label="Positive / Negative"
          value={`${stats.positive} / ${stats.negative}`}
          valueColor={stats.positive > stats.negative ? "#00E5A0" : "#FF4D6A"}
        />
        <StatCard
          label="Avg Rate/hr"
          value={`${stats.avgRate >= 0 ? "+" : ""}${(stats.avgRate * 100).toFixed(4)}%`}
          valueColor={rateColor(stats.avgRate)}
        />
        <StatCard
          label="OI-Weighted Rate"
          value={`${stats.oiWeightedRate >= 0 ? "+" : ""}${(stats.oiWeightedRate * 100).toFixed(4)}%`}
          valueColor={rateColor(stats.oiWeightedRate)}
        />
        <StatCard label="Total Open Interest" value={fmtUsd(stats.totalOi)} />
        <StatCard label="24h Volume" value={fmtUsd(stats.totalVol)} />
      </div>

      {/* Top/Bottom performers */}
      {stats.maxPositive && stats.maxNegative && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3" style={{ borderRadius: 4 }}>
            <span className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)]">Highest APR</span>
            <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[var(--hw-text)]">{stats.maxPositive.name}</span>
            <span className="ml-auto font-[family-name:var(--font-jetbrains-mono)] font-bold text-[var(--hw-green)]">
              +{stats.maxPositive.rateApr.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3" style={{ borderRadius: 4 }}>
            <span className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)]">Most Negative</span>
            <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[var(--hw-text)]">{stats.maxNegative.name}</span>
            <span className="ml-auto font-[family-name:var(--font-jetbrains-mono)] font-bold text-[var(--hw-red)]">
              {stats.maxNegative.rateApr.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* ===== HEATMAP ===== */}
      <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: 4 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
            Funding Heatmap — Top 40 by Open Interest
          </h2>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {showHeatmap ? "Hide" : "Show"}
          </button>
        </div>
        {showHeatmap && (
          <>
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-1.5">
              {heatmapData.map((item) => {
                const maxAbs = Math.max(...heatmapData.map((d) => Math.abs(d.rateHr)), 0.0001);
                const intensity = Math.min(Math.abs(item.rateHr) / maxAbs, 1);
                const alpha = 0.08 + intensity * 0.55;
                const bg = item.rateHr >= 0
                  ? `rgba(0,229,160,${alpha})`
                  : `rgba(255,77,106,${alpha})`;
                return (
                  <div
                    key={item.name}
                    className="flex flex-col items-center justify-center p-1.5 transition-transform hover:scale-105 cursor-default"
                    style={{ background: bg, borderRadius: 4, minHeight: 52 }}
                    title={`${item.name}: ${(item.rateHr * 100).toFixed(4)}%/hr | OI: ${item.oiFmt}`}
                  >
                    <span className="text-[9px] font-medium text-[var(--hw-text)] leading-tight truncate w-full text-center">
                      {item.name}
                    </span>
                    <span
                      className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] mt-0.5"
                      style={{ color: rateColor(item.rateHr) }}
                    >
                      {(item.rateHr * 100).toFixed(4)}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-[var(--hw-text-dim)]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-6" style={{ background: "rgba(255,77,106,0.5)", borderRadius: 2 }} />
                Shorts pay longs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-6" style={{ background: "rgba(0,229,160,0.5)", borderRadius: 2 }} />
                Longs pay shorts
              </span>
            </div>
          </>
        )}
      </div>

      {/* ===== FILTERS + TABLE ===== */}
      <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: 4 }}>
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto sm:min-w-[200px] border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] placeholder-[var(--hw-text-dim)] outline-none focus:border-[var(--hw-green)]"
            style={{ borderRadius: 4 }}
          />

          <div className="flex gap-1">
            {(["all", "positive", "negative"] as RateFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setRateFilter(f)}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: 4,
                  border: `1px solid ${rateFilter === f ? "var(--hw-green)" : "var(--hw-border)"}`,
                  background: rateFilter === f ? "var(--hw-green-subtle)" : "transparent",
                  color: rateFilter === f ? "var(--hw-green)" : "var(--hw-text-dim)",
                  cursor: "pointer",
                }}
              >
                {f === "all" ? "All" : f === "positive" ? "Positive" : "Negative"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mr-1">Min OI:</span>
            {(["all", "1m", "10m", "100m"] as OiFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setOiFilter(f)}
                className="px-2.5 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: 4,
                  border: `1px solid ${oiFilter === f ? "var(--hw-cyan)" : "var(--hw-border)"}`,
                  background: oiFilter === f ? "rgba(0,200,224,0.08)" : "transparent",
                  color: oiFilter === f ? "var(--hw-cyan)" : "var(--hw-text-dim)",
                  cursor: "pointer",
                }}
              >
                {f === "all" ? "Any" : f === "1m" ? "$1M" : f === "10m" ? "$10M" : "$100M"}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-[var(--hw-text-dim)]">
            {filtered.length} of {rows.length} markets
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--hw-border)]">
                {[
                  { key: "name" as SortKey, label: "Coin", align: "text-left" },
                  { key: "rateHr" as SortKey, label: "Rate/hr", align: "text-right" },
                  { key: "rateDay" as SortKey, label: "Rate/8hr", align: "text-right" },
                  { key: "rateApr" as SortKey, label: "APR", align: "text-right" },
                  { key: "premium" as SortKey, label: "Premium", align: "text-right" },
                  { key: "oi" as SortKey, label: "Open Interest", align: "text-right" },
                  { key: "vol24h" as SortKey, label: "24h Volume", align: "text-right" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`cursor-pointer whitespace-nowrap px-3 py-2.5 text-xs font-medium text-[var(--hw-text-dim)] select-none ${col.align}`}
                    onClick={() => handleSort(col.key)}
                    style={{ background: "none", border: "none" }}
                  >
                    {col.label}
                    {sortArrow(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.name}
                  className="border-b border-[var(--hw-border)] transition-colors hover:bg-[var(--hw-surface-raised)]"
                >
                  <td className="px-3 py-2.5 font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">
                    <div className="flex items-center gap-2">
                      {r.name}
                      {r.maxLeverage > 0 && (
                        <span className="text-[10px] text-[var(--hw-text-dim)]">{r.maxLeverage}x</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]" style={{ color: rateColor(r.rateHr) }}>
                    {r.rateHr >= 0 ? "+" : ""}{(r.rateHr * 100).toFixed(4)}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]" style={{ color: rateColor(r.rateDay) }}>
                    {r.rateDay >= 0 ? "+" : ""}{(r.rateDay * 100).toFixed(4)}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] font-medium" style={{ color: rateColor(r.rateApr) }}>
                    {r.rateApr >= 0 ? "+" : ""}{r.rateApr.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]" style={{ color: rateColor(r.premium) }}>
                    {r.premium >= 0 ? "+" : ""}{(r.premium * 100).toFixed(3)}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                    {r.oiFmt}
                  </td>
                  <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                    {r.vol24hFmt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-3" style={{ borderRadius: 4 }}>
      <div
        className="font-[family-name:var(--font-jetbrains-mono)] text-base font-bold"
        style={{ color: valueColor || "var(--hw-text)" }}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mt-0.5">{label}</div>
    </div>
  );
}
