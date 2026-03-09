"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const SHARE_DATA = [
  { name: "Hyperliquid", value: 26 },
  { name: "dYdX", value: 12 },
  { name: "GMX", value: 8 },
  { name: "Drift", value: 6 },
  { name: "Others", value: 48 },
];

const COLORS = ["#00E5A0", "#00C8E0", "#A78BFA", "#F0B429", "#2A3A4A"];

export function MarketShareDonut() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={SHARE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {SHARE_DATA.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#131920",
              border: "1px solid #1E2832",
              borderRadius: 4,
              color: "#E8F4F0",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}%`, "Market Share"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3">
        {SHARE_DATA.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: COLORS[i] }}
            />
            <span className="text-[var(--hw-text-muted)]">
              {entry.name}{" "}
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text)]">
                {entry.value}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
