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

export default function LiquidationCalc() {
  const [entryPrice, setEntryPrice] = useState<string>("3000");
  const [positionSize, setPositionSize] = useState<string>("10000");
  const [leverage, setLeverage] = useState<number>(10);
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mmr, setMmr] = useState<string>("0.5");

  const results = useMemo(() => {
    const entry = parseFloat(entryPrice);
    const size = parseFloat(positionSize);
    const mmrRate = parseFloat(mmr) / 100;

    if (!entry || entry <= 0 || !size || size <= 0 || !leverage || leverage <= 0 || isNaN(mmrRate)) {
      return null;
    }

    let liqPrice: number;
    if (direction === "long") {
      liqPrice = entry * (1 - 1 / leverage + mmrRate);
    } else {
      liqPrice = entry * (1 + 1 / leverage - mmrRate);
    }

    const initialMargin = size / leverage;
    const distancePct = Math.abs(liqPrice - entry) / entry * 100;
    const maxLoss = initialMargin - (size * mmrRate);

    return {
      liqPrice,
      initialMargin,
      distancePct,
      maxLoss: Math.max(0, maxLoss),
      isSafe: distancePct > 5,
    };
  }, [entryPrice, positionSize, leverage, direction, mmr]);

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

          {/* Position Size */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Position Size (USDC)
            </label>
            <input
              type="number"
              value={positionSize}
              onChange={(e) => setPositionSize(e.target.value)}
              placeholder="e.g. 10000"
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
        </div>

        {/* Advanced */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] transition-colors"
          >
            {showAdvanced ? "Hide" : "Show"} advanced settings {showAdvanced ? "▲" : "▼"}
          </button>
          {showAdvanced && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
                Maintenance Margin Rate (%)
              </label>
              <input
                type="number"
                value={mmr}
                onChange={(e) => setMmr(e.target.value)}
                step="0.1"
                min="0"
                max="10"
                className="w-32 px-3 py-2 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
                style={{ borderRadius: "4px" }}
              />
            </div>
          )}
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
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Liquidation Price — large */}
            <div className="sm:col-span-2 text-center py-4">
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Estimated Liquidation Price</div>
              <div
                className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-jetbrains-mono)]"
                style={{ color: results.isSafe ? "var(--hw-green)" : "var(--hw-red)" }}
              >
                {fmtUsd(results.liqPrice)}
              </div>
              <div
                className="mt-2 text-sm font-[family-name:var(--font-jetbrains-mono)]"
                style={{ color: results.isSafe ? "var(--hw-green-dim)" : "var(--hw-red)" }}
              >
                {fmt(results.distancePct)}% from entry
              </div>
            </div>

            {/* Stats */}
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Initial Margin Required</div>
              <div className="text-lg font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.initialMargin)}
              </div>
            </div>
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Max Loss Before Liquidation</div>
              <div className="text-lg font-semibold text-[var(--hw-red)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.maxLoss)}
              </div>
            </div>
          </div>

          {/* Warning */}
          {!results.isSafe && (
            <div
              className="mt-4 px-4 py-3 text-xs text-[var(--hw-red)] border border-[var(--hw-red)]"
              style={{ borderRadius: "4px", background: "rgba(255,77,106,0.06)" }}
            >
              Your liquidation price is very close to entry ({fmt(results.distancePct)}%). Consider using lower leverage or adding more margin.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
