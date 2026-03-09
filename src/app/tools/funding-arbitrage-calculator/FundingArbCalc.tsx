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

const HOLDING_PERIODS = [
  { label: "1 day", days: 1 },
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
];

export default function FundingArbCalc() {
  const [fundingRate, setFundingRate] = useState<string>("0.003");
  const [positionSize, setPositionSize] = useState<string>("10000");
  const [holdingPeriodIdx, setHoldingPeriodIdx] = useState<number>(2); // 1 month default
  const [tradingFees, setTradingFees] = useState<string>("0.1");
  const [spotPremium, setSpotPremium] = useState<string>("0");

  const results = useMemo(() => {
    const rate = parseFloat(fundingRate);
    const size = parseFloat(positionSize);
    const feesPct = parseFloat(tradingFees);
    const premium = parseFloat(spotPremium);

    if (isNaN(rate) || !size || size <= 0 || isNaN(feesPct) || isNaN(premium)) {
      return null;
    }

    const period = HOLDING_PERIODS[holdingPeriodIdx];
    const hourlyIncome = size * (rate / 100);
    const dailyIncome = hourlyIncome * 24;
    const periodIncome = dailyIncome * period.days;
    const totalFees = size * (feesPct / 100);
    const spotPremiumCost = size * Math.abs(premium) / 100;
    const netProfit = periodIncome - totalFees - spotPremiumCost;
    const apr = (dailyIncome * 365 / size) * 100;
    const breakevenHours = dailyIncome > 0 ? (totalFees + spotPremiumCost) / hourlyIncome : Infinity;

    return {
      hourlyIncome,
      dailyIncome,
      periodIncome,
      totalFees,
      spotPremiumCost,
      netProfit,
      apr,
      breakevenHours,
      periodLabel: period.label,
      isProfit: netProfit > 0,
    };
  }, [fundingRate, positionSize, holdingPeriodIdx, tradingFees, spotPremium]);

  return (
    <div className="space-y-6">
      {/* Calculator */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6"
        style={{ borderRadius: "4px" }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Funding Rate */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Funding Rate (%/hr)
            </label>
            <input
              type="number"
              value={fundingRate}
              onChange={(e) => setFundingRate(e.target.value)}
              placeholder="e.g. 0.003"
              step="0.001"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
            <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
              Positive = longs pay shorts
            </div>
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

          {/* Holding Period */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Holding Period
            </label>
            <select
              value={holdingPeriodIdx}
              onChange={(e) => setHoldingPeriodIdx(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            >
              {HOLDING_PERIODS.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Trading Fees */}
          <div>
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Trading Fees (% round-trip)
            </label>
            <input
              type="number"
              value={tradingFees}
              onChange={(e) => setTradingFees(e.target.value)}
              placeholder="0.1"
              step="0.01"
              min="0"
              className="w-full px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
            <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
              0.05% taker x 2 sides = 0.1% default
            </div>
          </div>

          {/* Spot Premium */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[var(--hw-text-muted)] mb-1.5">
              Spot Premium/Discount (%)
            </label>
            <input
              type="number"
              value={spotPremium}
              onChange={(e) => setSpotPremium(e.target.value)}
              placeholder="0"
              step="0.01"
              className="w-full sm:w-1/2 px-3 py-2.5 text-sm bg-[var(--hw-bg)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green-dim)] font-[family-name:var(--font-jetbrains-mono)]"
              style={{ borderRadius: "4px" }}
            />
            <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
              Cost of entering the spot hedge (perp price vs spot price difference)
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

          {/* APR Display */}
          <div className="text-center py-4 mb-4">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Estimated APR</div>
            <div
              className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-jetbrains-mono)]"
              style={{ color: results.apr > 0 ? "var(--hw-green)" : "var(--hw-red)" }}
            >
              {fmt(results.apr)}%
            </div>
            <div className="mt-2 text-sm text-[var(--hw-text-dim)]">
              based on current funding rate
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Period Income ({results.periodLabel})</div>
              <div className="text-lg font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.periodIncome)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.dailyIncome)}/day
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Fee Cost</div>
              <div className="text-lg font-semibold text-[var(--hw-gold)] font-[family-name:var(--font-jetbrains-mono)]">
                {fmtUsd(results.totalFees)}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                round-trip trading fees
              </div>
            </div>

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <div className="text-xs text-[var(--hw-text-dim)] mb-1">Breakeven Time</div>
              <div className="text-lg font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                {isFinite(results.breakevenHours) ? fmt(results.breakevenHours, 1) + "h" : "—"}
              </div>
              <div className="text-[10px] text-[var(--hw-text-dim)] mt-1">
                to recover fees
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div
            className="mt-4 border border-[var(--hw-border)] bg-[var(--hw-bg)] p-4"
            style={{ borderRadius: "4px" }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-[var(--hw-text-dim)] mb-1">Net Profit ({results.periodLabel})</div>
                <div
                  className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ color: results.isProfit ? "var(--hw-green)" : "var(--hw-red)" }}
                >
                  {results.isProfit ? "+" : ""}{fmtUsd(results.netProfit)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--hw-text-dim)] mb-1">Daily Income</div>
                <div className="text-lg font-semibold text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)]">
                  {fmtUsd(results.dailyIncome)}
                </div>
              </div>
            </div>
          </div>

          {/* Warning for negative */}
          {!results.isProfit && (
            <div
              className="mt-4 px-4 py-3 text-xs text-[var(--hw-red)] border border-[var(--hw-red)]"
              style={{ borderRadius: "4px", background: "rgba(255,77,106,0.06)" }}
            >
              This strategy is unprofitable at the current funding rate for this holding period. Fees exceed funding income. Consider a longer holding period or wait for higher funding rates.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
