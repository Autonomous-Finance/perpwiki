import { LAYER_META } from "@/lib/categories";

export function LayerBadge({ layer }: { layer: string }) {
  const meta = LAYER_META[layer] || LAYER_META.BOTH;
  const badgeClass =
    layer === "HYPERCORE"
      ? "badge-hypercore"
      : layer === "HYPEREVM"
        ? "badge-hyperevm"
        : layer === "HIP3"
          ? "badge-hip3"
          : "badge-both";

  return (
    <span
      className={`${badgeClass} inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium font-[family-name:var(--font-jetbrains-mono)] shrink-0`}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "currentColor", opacity: 0.6 }}
      />
      {meta.label}
    </span>
  );
}
