"use client";

interface FundingHeatmapProps {
  data: Array<{ name: string; rate: number }>;
}

export function FundingHeatmap({ data }: FundingHeatmapProps) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.rate)), 0.0001);

  function getColor(rate: number): string {
    const intensity = Math.min(Math.abs(rate) / maxAbs, 1);
    if (rate >= 0) {
      // Green: positive (longs pay)
      const alpha = 0.1 + intensity * 0.6;
      return `rgba(0,229,160,${alpha})`;
    }
    // Red: negative
    const alpha = 0.1 + intensity * 0.6;
    return `rgba(255,77,106,${alpha})`;
  }

  function getTextColor(rate: number): string {
    return rate >= 0 ? "#00E5A0" : "#FF4D6A";
  }

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center justify-center p-2 transition-transform hover:scale-105"
          style={{
            background: getColor(item.rate),
            borderRadius: 4,
            minHeight: 56,
          }}
        >
          <span className="text-[10px] font-medium text-[var(--hw-text)] leading-tight">
            {item.name}
          </span>
          <span
            className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] mt-0.5"
            style={{ color: getTextColor(item.rate) }}
          >
            {(item.rate * 100).toFixed(4)}%
          </span>
        </div>
      ))}
    </div>
  );
}
