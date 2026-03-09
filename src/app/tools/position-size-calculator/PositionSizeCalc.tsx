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

export default function PositionSizeCalc() {
  const [accountBalance, setAccountBalance] = useState<string>("10000");
  const [riskPct, setRiskPct] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLossPrice, setStopLossPrice] = useState<string>("");
  const [leverage, setLeverage] = useState<number>(1);

  const results = useMemo(() => {
    const balance = parseFloat(accountBalance);
    const entry = parseFloat(entryPrice);
    const stopLoss = parseFloat(stopLossPrice);

    if (!balance || balance <= 0 || !entry || entry <= 0 || !stopLoss || stopLoss <= 0 || entry === stopLoss) {
      return null;
    }

    const riskAmount = balance * (riskPct / 100);
    const stopLossDistancePct = Math.abs(entry - stopLoss) / entry * 100;
    const positionSize = riskAmount / (stopLossDistancePct / 100);
    const leveragedPosition = positionSize * leverage;
    const marginRequired = leveragedPosition / leverage;
    const numberOfUnits = positionSize / entry;
    const maxLoss = riskAmount;
    const marginPctOfBalance = (marginRequired / balance) * 100;

    return {
      riskAmount,
      stopLossDistancePct,
      positionSize,
      leveragedPosition,
      marginRequired,
      numberOfUnits,
      maxLoss,
      marginPctOfBalance,
      marginWarning: marginPctOfBalance > 50,
    };
  }, [accountBalance, riskPct, entryPrice, stopLossPrice, leverage]);

  return (
    <div className="space-y-6">
      {/* Calculator */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
        style={{ borderRadius: "4px" }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Account Balance */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Account Balance (USDC)
            </label>
            <input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              placeholder="e.g. 10000"
              min="0"
              step="any"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Risk Per Trade */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Risk Per Trade: <span className="text-[var(--hw-green)] font-[family-name:var(--font-jetbrains-mono)]">{riskPct.toFixed(1)}%</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.5}
                value={riskPct}
                onChange={(e) => setRiskPct(parseFloat(e.target.value))}
                className="flex-1 h-1.5 appearance-none bg-[var(--hw-border)] rounded cursor-pointer accent-[var(--hw-green)]"
              />
              <input
                type="number"
                value={riskPct}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (v >= 0.5 && v <= 10) setRiskPct(v);
                }}
                min={0.5}
                max={10}
                step={0.5}
                className="w-16 px-2 py-1.5 text-sm text-center bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div className="flex justify-between mt-1.5 gap-1">
              {[0.5, 1, 2, 5, 10].map((v) => (
                <button
                  key={v}
                  onClick={() => setRiskPct(v)}
                  className={`flex-1 px-2 py-1 text-[10px] font-medium border transition-colors ${
                    riskPct === v
                      ? "border-[var(--hw-green)] text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
                      : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>

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

          {/* Stop Loss Price */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Stop Loss Price (USD)
            </label>
            <input
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(e.target.value)}
              placeholder="e.g. 2900"
              min="0"
              step="any"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Leverage */}
          <div className="sm:col-span-2">
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
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Position Size</div>
              <div className="text-xl font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.positionSize)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                {fmt(results.numberOfUnits, 4)} units
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Leveraged Exposure</div>
              <div className="text-xl font-semibold text-[var(--hw-cyan)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.leveragedPosition)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                at {leverage}x leverage
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Margin Required</div>
              <div className="text-xl font-semibold text-[var(--hw-gold)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.marginRequired)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                {fmt(results.marginPctOfBalance)}% of balance
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Max Loss</div>
              <div className="text-xl font-semibold text-[var(--hw-red)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.maxLoss)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                {fmt(results.stopLossDistancePct)}% stop distance
              </div>
            </div>
          </div>

          {/* Warning */}
          {results.marginWarning && (
            <div
              className="mt-4 px-4 py-3 text-xs text-[var(--hw-red)] border border-[var(--hw-red)]"
              style={{ borderRadius: "4px", background: "rgba(255,77,106,0.06)" }}
            >
              Warning: Margin required ({fmt(results.marginPctOfBalance)}% of balance) exceeds 50% of your account. Consider reducing position size or leverage.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
