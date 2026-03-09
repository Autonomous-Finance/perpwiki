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

const FEE_RATES = {
  perp: { maker: 0.00025, taker: 0.0005 },
  spot: { maker: 0.0002, taker: 0.0005 },
};

const BINANCE_RATES = {
  perp: { maker: 0.0002, taker: 0.0004 },
  spot: { maker: 0.0002, taker: 0.0004 },
};

export default function FeeCalc() {
  const [tradeSize, setTradeSize] = useState<string>("10000");
  const [orderType, setOrderType] = useState<"maker" | "taker">("taker");
  const [tradeType, setTradeType] = useState<"perp" | "spot">("perp");
  const [numTrades, setNumTrades] = useState<string>("1");

  const results = useMemo(() => {
    const size = parseFloat(tradeSize);
    const trades = parseInt(numTrades) || 1;

    if (!size || size <= 0) return null;

    const hlRate = FEE_RATES[tradeType][orderType];
    const binanceRate = BINANCE_RATES[tradeType][orderType];

    const feePerTrade = size * hlRate;
    const totalFees = feePerTrade * trades;
    const annualCost = feePerTrade * trades * 365;

    const binanceFeePerTrade = size * binanceRate;
    const binanceTotalFees = binanceFeePerTrade * trades;

    const savings = binanceTotalFees - totalFees;

    return {
      hlRate,
      feePerTrade,
      totalFees,
      annualCost,
      binanceRate,
      binanceFeePerTrade,
      binanceTotalFees,
      savings,
      tradesPerDay: trades,
    };
  }, [tradeSize, orderType, tradeType, numTrades]);

  return (
    <div className="space-y-6">
      {/* Calculator */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
        style={{ borderRadius: "4px" }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Trade Size */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Trade Size (USDC)
            </label>
            <input
              type="number"
              value={tradeSize}
              onChange={(e) => setTradeSize(e.target.value)}
              placeholder="e.g. 10000"
              min="0"
              step="any"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Number of Trades */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Number of Trades (per day)
            </label>
            <input
              type="number"
              value={numTrades}
              onChange={(e) => setNumTrades(e.target.value)}
              placeholder="1"
              min="1"
              step="1"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Order Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType("maker")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  orderType === "maker"
                    ? "border-[var(--hw-green)] text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{ borderRadius: "4px" }}
              >
                Maker (Limit)
              </button>
              <button
                onClick={() => setOrderType("taker")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  orderType === "taker"
                    ? "border-[var(--hw-gold)] text-[var(--hw-gold)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{
                  borderRadius: "4px",
                  background: orderType === "taker" ? "rgba(240,180,41,0.08)" : undefined,
                }}
              >
                Taker (Market)
              </button>
            </div>
          </div>

          {/* Trade Type */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Trade Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTradeType("perp")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  tradeType === "perp"
                    ? "border-[var(--hw-cyan)] text-[var(--hw-cyan)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{
                  borderRadius: "4px",
                  background: tradeType === "perp" ? "rgba(0,200,224,0.08)" : undefined,
                }}
              >
                Perpetual
              </button>
              <button
                onClick={() => setTradeType("spot")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-colors ${
                  tradeType === "spot"
                    ? "border-[var(--hw-cyan)] text-[var(--hw-cyan)]"
                    : "border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)]"
                }`}
                style={{
                  borderRadius: "4px",
                  background: tradeType === "spot" ? "rgba(0,200,224,0.08)" : undefined,
                }}
              >
                Spot
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
            Fee Breakdown
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Fee Per Trade</div>
              <div className="text-xl font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.feePerTrade)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                {(results.hlRate * 100).toFixed(3)}% rate
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">
                Daily Total ({results.tradesPerDay} trade{results.tradesPerDay !== 1 ? "s" : ""})
              </div>
              <div className="text-xl font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.totalFees)}
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Annual Estimate</div>
              <div className="text-xl font-semibold text-[var(--hw-gold)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.annualCost)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                at {results.tradesPerDay} trade{results.tradesPerDay !== 1 ? "s" : ""}/day
              </div>
            </div>
          </div>

          {/* Binance Comparison */}
          <div
            className="mt-4 border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
            style={{ borderRadius: "4px" }}
          >
            <div className="text-xs font-medium text-[var(--hw-text-dim)] uppercase tracking-wider mb-3">
              Binance Comparison (VIP0)
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-[10px] text-[var(--hw-text-dim)]">Binance Fee/Trade</div>
                <div className="text-sm text-[var(--hw-text-muted)] font-[family-name:var(--font-jetbrains-mono)]">
                  {fmtUsd(results.binanceFeePerTrade)}
                </div>
                <div className="text-[10px] text-[var(--hw-text-dim)] font-[family-name:var(--font-jetbrains-mono)]">
                  {(results.binanceRate * 100).toFixed(3)}% rate
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--hw-text-dim)]">Binance Daily Total</div>
                <div className="text-sm text-[var(--hw-text-muted)] font-[family-name:var(--font-jetbrains-mono)]">
                  {fmtUsd(results.binanceTotalFees)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--hw-text-dim)]">
                  {results.savings >= 0 ? "You Save" : "Extra Cost"} vs Binance
                </div>
                <div
                  className="text-sm font-semibold font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: results.savings >= 0 ? "var(--hw-green)" : "var(--hw-red)" }}
                >
                  {results.savings >= 0 ? "+" : ""}{fmtUsd(Math.abs(results.savings))}/day
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
