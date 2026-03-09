"use client";

import { useState, useMemo } from "react";

interface FundingRow {
  name: string;
  rateHr: number;
  rateDay: number;
  rateApr: number;
  oi: number;
  oiFmt: string;
}

type SortKey = "name" | "rateHr" | "rateDay" | "rateApr" | "oi";
type SortDir = "asc" | "desc";

export function FundingTable({ rows }: { rows: FundingRow[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rateHr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") {
        return sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      // For rate columns, sort by absolute value
      if (sortKey === "rateHr" || sortKey === "rateDay" || sortKey === "rateApr") {
        return sortDir === "desc"
          ? Math.abs(b[sortKey]) - Math.abs(a[sortKey])
          : Math.abs(a[sortKey]) - Math.abs(b[sortKey]);
      }
      return sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  function rateColor(val: number) {
    return val >= 0 ? "#00E5A0" : "#FF4D6A";
  }

  const cols: { key: SortKey; label: string; align: string }[] = [
    { key: "name", label: "Coin", align: "text-left" },
    { key: "rateHr", label: "Rate/hr", align: "text-right" },
    { key: "rateDay", label: "Rate/day", align: "text-right" },
    { key: "rateApr", label: "APR", align: "text-right" },
    { key: "oi", label: "Open Interest", align: "text-right" },
  ];

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2 text-sm text-[var(--hw-text)] placeholder-[var(--hw-text-dim)] outline-none focus:border-[var(--hw-green)]"
          style={{ borderRadius: 4 }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hw-border)]">
              {cols.map((col) => (
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
            {sorted.map((r) => (
              <tr
                key={r.name}
                className="border-b border-[var(--hw-border)] transition-colors hover:bg-[var(--hw-surface-raised)]"
              >
                <td className="px-3 py-2.5 font-[family-name:var(--font-space-grotesk)] font-medium text-[var(--hw-text)]">
                  {r.name}
                </td>
                <td
                  className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: rateColor(r.rateHr) }}
                >
                  {r.rateHr >= 0 ? "+" : ""}
                  {(r.rateHr * 100).toFixed(4)}%
                </td>
                <td
                  className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: rateColor(r.rateDay) }}
                >
                  {r.rateDay >= 0 ? "+" : ""}
                  {(r.rateDay * 100).toFixed(4)}%
                </td>
                <td
                  className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] font-medium"
                  style={{ color: rateColor(r.rateApr) }}
                >
                  {r.rateApr >= 0 ? "+" : ""}
                  {r.rateApr.toFixed(2)}%
                </td>
                <td className="px-3 py-2.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
                  {r.oiFmt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
