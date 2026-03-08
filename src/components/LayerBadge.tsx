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
      className={`${badgeClass} inline-block px-2 py-0.5 text-xs font-medium font-[family-name:var(--font-jetbrains-mono)]`}
      style={{ borderRadius: "2px" }}
    >
      {meta.label}
    </span>
  );
}
