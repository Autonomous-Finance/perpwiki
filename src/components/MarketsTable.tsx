"use client";

import { useState, useMemo } from "react";
import { formatCompactUsd, formatPrice } from "@/lib/format";

export interface MarketRow {
  name: string;
  markPx: number;
  change24h: number;
  fundingRate: number;
  fundingApr: number;
  oi: number;
  vol24h: number;
}

type SortKey = keyof Omit<MarketRow, "name"> | "name";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

export function MarketsTable({ markets }: { markets: MarketRow[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("oi");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return markets.filter((m) => m.name.toLowerCase().includes(q));
  }, [markets, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  const fmt = formatCompactUsd;
  const fmtPrice = formatPrice;

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  const columns: { key: SortKey; label: string; align: string }[] = [
    { key: "name", label: "Market", align: "text-left" },
    { key: "markPx", label: "Mark Price", align: "text-right" },
    { key: "change24h", label: "24h Change", align: "text-right" },
    { key: "fundingRate", label: "Funding/hr", align: "text-right" },
    { key: "fundingApr", label: "Funding APR", align: "text-right" },
    { key: "oi", label: "Open Interest", align: "text-right" },
    { key: "vol24h", label: "24h Volume", align: "text-right" },
  ];

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search markets..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="w-full max-w-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2 text-sm text-[var(--hw-text)] placeholder-[var(--hw-text-dim)] outline-none focus:border-[var(--hw-green)]"
          style={{ borderRadius: 4 }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hw-border)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`cursor-pointer whitespace-nowrap px-3 py-2.5 text-xs font-medium text-[var(--hw-text-dim)] select-none ${col.align}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortArrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((m) => (
              <tr
                key={m.name}
                className="border-b border-[var(--hw-border)] transition-colors hover:bg-[var(--hw-surface-raised)]"
              >
                <td className="px-3 py-2.5 font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">
                  {m.name}-PERP
                </td>
                <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text)]">
                  {fmtPrice(m.markPx)}
                </td>
                <td
                  className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: m.change24h >= 0 ? "#00E5A0" : "#FF4D6A" }}
                >
                  {m.change24h >= 0 ? "+" : ""}
                  {m.change24h.toFixed(2)}%
                </td>
                <td
                  className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: m.fundingRate >= 0 ? "#00E5A0" : "#FF4D6A" }}
                >
                  {m.fundingRate >= 0 ? "+" : ""}
                  {(m.fundingRate * 100).toFixed(4)}%
                </td>
                <td
                  className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: m.fundingApr >= 0 ? "#00E5A0" : "#FF4D6A" }}
                >
                  {m.fundingApr >= 0 ? "+" : ""}
                  {m.fundingApr.toFixed(2)}%
                </td>
                <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                  {fmt(m.oi)}
                </td>
                <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                  {fmt(m.vol24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[var(--hw-text-dim)]">
            Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length} markets
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="border border-[var(--hw-border)] px-3 py-1 text-[var(--hw-text-muted)] transition-colors hover:border-[var(--hw-green)] hover:text-[var(--hw-text)] disabled:opacity-30 disabled:hover:border-[var(--hw-border)] disabled:hover:text-[var(--hw-text-muted)]"
              style={{ borderRadius: 2 }}
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="border border-[var(--hw-border)] px-3 py-1 text-[var(--hw-text-muted)] transition-colors hover:border-[var(--hw-green)] hover:text-[var(--hw-text)] disabled:opacity-30 disabled:hover:border-[var(--hw-border)] disabled:hover:text-[var(--hw-text-muted)]"
              style={{ borderRadius: 2 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
