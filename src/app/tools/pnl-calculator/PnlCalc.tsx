"use client";

import { useState, useMemo } from "react";

function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtUsd(n: number): string {
  if (!isFinite(n)) return "—";
  return "$" + fmt(n, 2);
}

export default function PnlCalc() {
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [exitPrice, setExitPrice] = useState<string>("");
  const [positionSize, setPositionSize] = useState<string>("1000");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState<number>(1);
  const [includeFees, setIncludeFees] = useState<boolean>(true);

  const results = useMemo(() => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const size = parseFloat(positionSize);

    if (!entry || entry <= 0 || !exit || exit <= 0 || !size || size <= 0) {
      return null;
    }

    let pnl: number;
    if (direction === "long") {
      pnl = size * (exit - entry) / entry;
    } else {
      pnl = size * (entry - exit) / entry;
    }

    const feeCost = includeFees ? size * 0.0005 * 2 : 0; // 0.05% taker both sides
    const netPnl = pnl - feeCost;
    const margin = size / leverage;
    const roe = (netPnl / margin) * 100;

    // Breakeven: for long, entry * (1 + fee%) / (1 - fee%); simplified
    let breakevenPrice: number;
    if (includeFees) {
      if (direction === "long") {
        breakevenPrice = entry * (1 + 0.001); // 0.05% open + 0.05% close = 0.1% total
      } else {
        breakevenPrice = entry * (1 - 0.001);
      }
    } else {
      breakevenPrice = entry;
    }

    return {
      pnl,
      feeCost,
      netPnl,
      margin,
      roe,
      breakevenPrice,
      isProfit: netPnl >= 0,
    };
  }, [entryPrice, exitPrice, positionSize, direction, leverage, includeFees]);

  return (
    <div className="space-y-6">
      {/* Calculator */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
        style={{ borderRadius: "4px" }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Entry Price */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Entry Price (USD)
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="e.g. 3000"
              min="0"
              step="any"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Exit Price */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Exit Price (USD)
            </label>
            <input
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              placeholder="e.g. 3200"
              min="0"
              step="any"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Position Size */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Position Size (USDC)
            </label>
            <input
              type="number"
              value={positionSize}
              onChange={(e) => setPositionSize(e.target.value)}
              placeholder="e.g. 1000"
              min="0"
              step="any"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Leverage */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Leverage: <span className="text-[var(--hw-green)] font-[family-name:var(--font-jetbrains-mono)]">{leverage}x</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={50}
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="flex-1 h-1.5 appearance-none bg-[var(--hw-border)] rounded cursor-pointer accent-[var(--hw-green)]"
              />
              <input
                type="number"
                value={leverage}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v >= 1 && v <= 50) setLeverage(v);
                }}
                min={1}
                max={50}
                className="w-16 px-2 py-1.5 text-sm text-center bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div className="flex justify-between mt-1.5 gap-1">
              {[1, 5, 10, 20, 50].map((v) => (
                <button
                  key={v}
                  onClick={() => setLeverage(v)}
                  className={`flex-1 px-2 py-1 text-[10px] font-medium border transition-colors ${
                    leverage === v
                      ? "border-[var(--hw-green)] text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
                      : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Direction
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDirection("long")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  direction === "long"
                    ? "border-[var(--hw-green)] text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{ borderRadius: "4px" }}
              >
                Long
              </button>
              <button
                onClick={() => setDirection("short")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  direction === "short"
                    ? "border-[var(--hw-red)] text-[var(--hw-red)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{
                  borderRadius: "4px",
                  background: direction === "short" ? "rgba(255,77,106,0.08)" : undefined,
                }}
              >
                Short
              </button>
            </div>
          </div>

          {/* Include Fees */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Include Fees
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIncludeFees(true)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  includeFees
                    ? "border-[var(--hw-green)] text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{ borderRadius: "4px" }}
              >
                Yes (0.05% x2)
              </button>
              <button
                onClick={() => setIncludeFees(false)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  !includeFees
                    ? "border-[var(--hw-gold)] text-[var(--hw-gold)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{
                  borderRadius: "4px",
                  background: !includeFees ? "rgba(240,180,41,0.08)" : undefined,
                }}
              >
                No Fees
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
          style={{ borderRadius: "4px" }}
        >
          <h3 className="text-xs font-medium text-[var(--hw-text-dim)] uppercase tracking-wider mb-4">
            Results
          </h3>

          {/* Large PnL Display */}
          <div className="text-center py-4 mb-4">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Net Profit / Loss</div>
            <div
              className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-jetbrains-mono)]"
              style={{ color: results.isProfit ? "var(--hw-green)" : "var(--hw-red)" }}
            >
              {results.isProfit ? "+" : ""}{fmtUsd(results.netPnl)}
            </div>
            <div
              className="mt-2 text-lg font-semibold font-[family-name:var(--font-jetbrains-mono)]"
              style={{ color: results.isProfit ? "var(--hw-green-dim)" : "var(--hw-red)" }}
            >
              {results.isProfit ? "+" : ""}{fmt(results.roe)}% ROE
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Fee Cost</div>
              <div className="text-lg font-semibold text-[var(--hw-gold)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.feeCost)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                0.05% taker x2 sides
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Margin Used</div>
              <div className="text-lg font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.margin)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                at {leverage}x leverage
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Breakeven Price</div>
              <div className="text-lg font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.breakevenPrice)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                including fees
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
