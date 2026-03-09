const levels = {
  beginner: { bars: 1, color: "var(--hw-green)", label: "Beginner" },
  intermediate: { bars: 2, color: "#EAB308", label: "Intermediate" },
  advanced: { bars: 3, color: "#EF4444", label: "Advanced" },
} as const;

export function DifficultyBadge({
  level,
}: {
  level: "beginner" | "intermediate" | "advanced";
}) {
  const config = levels[level];

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className="block w-[4px] rounded-sm"
            style={{
              height: `${8 + bar * 4}px`,
              backgroundColor:
                bar <= config.bars ? config.color : "var(--hw-border)",
            }}
          />
        ))}
      </span>
      <span
        className="text-[11px] font-medium uppercase tracking-wider"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </span>
  );
}
