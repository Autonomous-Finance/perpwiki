import Link from "next/link";
import { LayerBadge } from "./LayerBadge";
import { ProjectLogo } from "./ProjectLogo";

interface ProjectCardProps {
  slug: string;
  name: string;
  tagline: string | null;
  layer: string;
  category: string;
  status: string;
  isVerified: boolean;
  logoUrl?: string | null;
  tags?: string;
  updatedAt?: Date | string | null;
}

export function ProjectCard({
  slug,
  name,
  tagline,
  layer,
  category,
  status,
  isVerified,
  logoUrl,
  tags: tagsJson,
  updatedAt,
}: ProjectCardProps) {
  const parsedTags: string[] = (() => {
    try { return tagsJson ? JSON.parse(tagsJson) : []; }
    catch { return []; }
  })();
  const isRecentlyUpdated = updatedAt && (Date.now() - new Date(updatedAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/projects/${slug}`} className="group block">
      <div
        className="card-hover flex h-full flex-col gap-3 rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 group-hover:border-[var(--hw-green)] group-hover:shadow-[0_0_12px_rgba(0,229,160,0.08)] group-focus-visible:border-[var(--hw-green)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <ProjectLogo name={name} logoUrl={logoUrl} size="sm" />
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] truncate">
              {name}
              {isVerified && <VerifiedCheck />}
            </h3>
          </div>
          <LayerBadge layer={layer} />
        </div>
        {tagline && (
          <p className="line-clamp-2 text-sm text-[var(--hw-text-muted)]">
            {tagline}
          </p>
        )}
        {parsedTags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {parsedTags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 text-[10px] text-[var(--hw-text-dim)] border border-[var(--hw-border)]" style={{ borderRadius: "2px" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="rounded-sm bg-[var(--hw-green-subtle)] px-1.5 py-0.5 text-xs text-[var(--hw-text-muted)]">
              {category}
            </span>
            {isRecentlyUpdated && (
              <span className="text-[10px] text-[var(--hw-green)] font-medium">
                ↑ Updated recently
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            {status !== "ACTIVE" && (
              <span className="text-xs text-[var(--hw-gold)]">{status}</span>
            )}
            <svg
              className="h-3.5 w-3.5 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-transform group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function VerifiedCheck() {
  return (
    <span className="verified-badge" title="Verified project" aria-label="Verified">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
