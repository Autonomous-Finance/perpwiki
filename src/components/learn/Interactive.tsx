"use client";

import { useState } from "react";

/* ── YieldCalculator ────────────────────────────────────────── */

interface YieldOption {
  label: string;
  apy: number;
  description: string;
}

export function YieldCalculator({
  defaultAmount = 1000,
  options,
  hypePrice,
  currency = "HYPE",
}: {
  defaultAmount?: number;
  options: YieldOption[];
  hypePrice: number;
  currency?: "HYPE" | "USD";
}) {
  const [amount, setAmount] = useState(defaultAmount);
  const [selected, setSelected] = useState(0);

  const opt = options[selected];
  const annual = (amount * opt.apy) / 100;
  const monthly = annual / 12;
  const isUsd = currency === "USD";
  const annualUsd = isUsd ? annual : annual * hypePrice;
  const monthlyUsd = isUsd ? monthly : monthly * hypePrice;

  return (
    <div className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)]" style={{ borderRadius: "4px" }}>
      <div className="border-b border-[var(--hw-border)] px-5 py-3">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
          Yield Calculator
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {/* Amount input */}
        <div>
          <label className="block text-xs text-[var(--hw-text-dim)] mb-1.5">
            I have
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full rounded border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)] focus:border-[var(--hw-green)] focus:outline-none"
            />
            <span className="shrink-0 text-sm font-medium text-[var(--hw-text-dim)]">
              {isUsd ? "USDC" : "HYPE"}
            </span>
          </div>
        </div>

        {/* Option tabs */}
        <div className="flex flex-wrap gap-2">
          {options.map((o, i) => (
            <button
              key={o.label}
              onClick={() => setSelected(i)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                i === selected
                  ? "bg-[var(--hw-green)] text-[var(--hw-bg)]"
                  : "border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
              }`}
            >
              {o.label} — {o.apy}%
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--hw-text-dim)]">{opt.description}</p>

        {/* Results */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Annual Yield</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-green)]">
              {annual.toFixed(isUsd ? 2 : 1)} {isUsd ? "USDC" : "HYPE"}
            </div>
            {!isUsd && (
              <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
                ~${annualUsd.toFixed(0)} USD
              </div>
            )}
          </div>
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Monthly Yield</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-text)]">
              {monthly.toFixed(isUsd ? 2 : 2)} {isUsd ? "USDC" : "HYPE"}
            </div>
            {!isUsd && (
              <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
                ~${monthlyUsd.toFixed(0)} USD
              </div>
            )}
          </div>
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Current Value</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-text)]">
              ${(isUsd ? amount : amount * hypePrice).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
              {isUsd ? "USDC" : `@ $${hypePrice.toFixed(2)}/HYPE`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FeeCalculator ──────────────────────────────────────────── */

export function FeeCalculator() {
  const [tradeSize, setTradeSize] = useState(10000);
  const [isTaker, setIsTaker] = useState(true);

  const hlRate = isTaker ? 0.00035 : -0.0001; // maker gets rebate
  const binanceRate = isTaker ? 0.00045 : 0.0002;

  const hlFee = tradeSize * hlRate;
  const binanceFee = tradeSize * binanceRate;
  const savings = binanceFee - hlFee;

  return (
    <div className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)]" style={{ borderRadius: "4px" }}>
      <div className="border-b border-[var(--hw-border)] px-5 py-3">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
          Fee Calculator
        </h3>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs text-[var(--hw-text-dim)] mb-1.5">Trade Size (USD)</label>
          <input
            type="number"
            value={tradeSize}
            onChange={(e) => setTradeSize(Math.max(0, Number(e.target.value)))}
            className="w-full rounded border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)] focus:border-[var(--hw-green)] focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsTaker(true)}
            className={`rounded px-4 py-1.5 text-xs font-medium transition-all ${
              isTaker
                ? "bg-[var(--hw-green)] text-[var(--hw-bg)]"
                : "border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
            }`}
          >
            Taker
          </button>
          <button
            onClick={() => setIsTaker(false)}
            className={`rounded px-4 py-1.5 text-xs font-medium transition-all ${
              !isTaker
                ? "bg-[var(--hw-green)] text-[var(--hw-bg)]"
                : "border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
            }`}
          >
            Maker
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Hyperliquid Fee</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-green)]">
              {hlFee >= 0 ? "" : ""}${Math.abs(hlFee).toFixed(2)}
              {hlFee < 0 && <span className="text-xs ml-1 text-emerald-400">rebate</span>}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
              {isTaker ? "0.035%" : "0.01% rebate"}
            </div>
          </div>
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Binance Fee</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-text-muted)]">
              ${binanceFee.toFixed(2)}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
              {isTaker ? "0.045%" : "0.020%"}
            </div>
          </div>
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">You Save</div>
            <div className={`font-[family-name:var(--font-space-grotesk)] text-lg font-bold ${savings > 0 ? "text-emerald-400" : "text-[var(--hw-text-muted)]"}`}>
              ${savings.toFixed(2)}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">vs Binance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FundingRateCalculator ──────────────────────────────────── */

export function FundingRateCalculator() {
  const [positionSize, setPositionSize] = useState(10000);
  const [fundingRate, setFundingRate] = useState(0.01);
  const [longsPayShorts, setLongsPayShorts] = useState(true);
  const [hours, setHours] = useState(24);

  const intervals = hours / 8;
  const rateDecimal = fundingRate / 100;
  const totalPayment = positionSize * rateDecimal * intervals;
  const annualized = rateDecimal * 3 * 365 * 100;

  return (
    <div className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)]" style={{ borderRadius: "4px" }}>
      <div className="border-b border-[var(--hw-border)] px-5 py-3">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
          Funding Rate Calculator
        </h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-[var(--hw-text-dim)] mb-1.5">Position Size (USD)</label>
            <input
              type="number"
              value={positionSize}
              onChange={(e) => setPositionSize(Math.max(0, Number(e.target.value)))}
              className="w-full rounded border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)] focus:border-[var(--hw-green)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--hw-text-dim)] mb-1.5">Funding Rate (%/8h)</label>
            <input
              type="number"
              step="0.001"
              value={fundingRate}
              onChange={(e) => setFundingRate(Number(e.target.value))}
              className="w-full rounded border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)] focus:border-[var(--hw-green)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--hw-text-dim)] mb-1.5">Hold Duration (hours)</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
              className="w-full rounded border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)] focus:border-[var(--hw-green)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--hw-text-dim)] mb-1.5">Direction</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLongsPayShorts(true)}
                className={`flex-1 rounded px-3 py-2 text-xs font-medium transition-all ${
                  longsPayShorts
                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                    : "border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
                }`}
              >
                Longs pay
              </button>
              <button
                onClick={() => setLongsPayShorts(false)}
                className={`flex-1 rounded px-3 py-2 text-xs font-medium transition-all ${
                  !longsPayShorts
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
                }`}
              >
                Shorts pay
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">
              {longsPayShorts ? "Short earns" : "Long earns"} over {hours}h
            </div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-emerald-400">
              ${totalPayment.toFixed(2)}
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
              across {intervals.toFixed(0)} funding intervals
            </div>
          </div>
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">
              {longsPayShorts ? "Long pays" : "Short pays"} over {hours}h
            </div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-red-400">
              -${totalPayment.toFixed(2)}
            </div>
          </div>
          <div className="rounded bg-[var(--hw-surface-raised)] p-3">
            <div className="text-xs text-[var(--hw-text-dim)] mb-1">Annualized Rate</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-text)]">
              {annualized.toFixed(1)}%
            </div>
            <div className="text-xs text-[var(--hw-text-dim)] mt-0.5">
              {fundingRate}% &times; 3 &times; 365
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
