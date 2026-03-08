import Link from "next/link";
import { LayerBadge } from "./LayerBadge";

interface ProjectCardProps {
  slug: string;
  name: string;
  tagline: string | null;
  layer: string;
  category: string;
  status: string;
  isVerified: boolean;
}

export function ProjectCard({
  slug,
  name,
  tagline,
  layer,
  category,
  status,
  isVerified,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <div
        className="group flex h-full flex-col gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]"
        style={{ borderRadius: "4px" }}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)]">
            {name}
            {isVerified && (
              <span className="ml-1.5 inline-block text-[var(--hw-green)]" title="Verified">
                ✓
              </span>
            )}
          </h3>
          <LayerBadge layer={layer} />
        </div>
        {tagline && (
          <p className="line-clamp-2 text-sm text-[var(--hw-text-muted)]">
            {tagline}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2">
          <span
            className="bg-[var(--hw-green-subtle)] px-1.5 py-0.5 text-xs text-[var(--hw-text-muted)]"
            style={{ borderRadius: "2px" }}
          >
            {category}
          </span>
          {status !== "ACTIVE" && (
            <span className="text-xs text-[var(--hw-gold)]">{status}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
