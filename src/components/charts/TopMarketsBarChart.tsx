"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopMarketsBarChartProps {
  data: Array<{ name: string; oi: number }>;
}

export function TopMarketsBarChart({ data }: TopMarketsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 48 }}
      >
        <XAxis
          type="number"
          tick={{ fill: "#7A9A8E", fontSize: 11 }}
          axisLine={{ stroke: "#1E2832" }}
          tickLine={false}
          tickFormatter={(v: number) => {
            if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
            if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
            return `$${v}`;
          }}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#E8F4F0", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={{
            background: "#131920",
            border: "1px solid #1E2832",
            borderRadius: 4,
            color: "#E8F4F0",
            fontSize: 12,
          }}
          formatter={(value) => {
            const v = Number(value);
            if (v >= 1e9) return [`$${(v / 1e9).toFixed(2)}B`, "Open Interest"];
            if (v >= 1e6) return [`$${(v / 1e6).toFixed(1)}M`, "Open Interest"];
            return [`$${v.toLocaleString()}`, "Open Interest"];
          }}
        />
        <Bar dataKey="oi" radius={[0, 3, 3, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? "#00E5A0" : `rgba(0,229,160,${0.7 - i * 0.05})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
