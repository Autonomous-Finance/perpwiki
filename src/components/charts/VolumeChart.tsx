"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VolumeChartProps {
  data: Array<{ week: string; vol: number }>;
}

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5A0" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#00E5A0" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="week"
          tick={{ fill: "#7A9A8E", fontSize: 11 }}
          axisLine={{ stroke: "#1E2832" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#7A9A8E", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}T` : `$${v}B`
          }
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: "#131920",
            border: "1px solid #1E2832",
            borderRadius: 4,
            color: "#E8F4F0",
            fontSize: 12,
          }}
          labelStyle={{ color: "#7A9A8E" }}
          formatter={(value) => [`$${value}B`, "Weekly Volume"]}
        />
        <Area
          type="monotone"
          dataKey="vol"
          stroke="#00E5A0"
          strokeWidth={2}
          fill="url(#volGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
