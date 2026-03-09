"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  coin: string;
  days?: number;
}

export function Sparkline({ coin, days = 7 }: SparklineProps) {
  const [data, setData] = useState<{ c: number }[]>([]);

  useEffect(() => {
    fetch(`/api/candles?coin=${coin}&days=${days}`)
      .then((r) => r.json())
      .then((candles) => {
        if (Array.isArray(candles)) setData(candles);
      })
      .catch(() => {});
  }, [coin, days]);

  if (data.length < 2) return null;

  const isUp = data[data.length - 1].c >= data[0].c;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="c"
          stroke={isUp ? "#00E5A0" : "#FF4D6A"}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
