/* ── Project Grid Components (Server Components) ────────────── */

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectLogo } from "@/components/ProjectLogo";

/* ── ProjectLogoGrid ────────────────────────────────────────── */

export async function ProjectLogoGrid({
  slugs,
  title,
  showTagline = false,
}: {
  slugs: string[];
  title?: string;
  showTagline?: boolean;
}) {
  const projects = await prisma.project.findMany({
    where: {
      slug: { in: slugs },
      approvalStatus: "APPROVED",
    },
    select: {
      slug: true,
      name: true,
      tagline: true,
      logoUrl: true,
      isVerified: true,
    },
  });

  // Preserve the input order
  const sorted = slugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean) as typeof projects;

  if (sorted.length === 0) return null;

  return (
    <div className="my-6">
      {title && (
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--hw-text-dim)] font-[family-name:var(--font-jetbrains-mono)]">
          {title}
        </div>
      )}
      <div className={`grid gap-3 grid-cols-2 ${sorted.length > 3 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
        {sorted.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group flex items-start gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-3 transition-all hover:border-[var(--hw-green)]"
            style={{ borderRadius: "4px" }}
          >
            <ProjectLogo name={p.name} logoUrl={p.logoUrl} size="sm" className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors truncate">
                  {p.name}
                </span>
                {p.isVerified && (
                  <svg className="h-3.5 w-3.5 shrink-0 text-[var(--hw-green)]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {showTagline && p.tagline && (
                <p className="text-xs text-[var(--hw-text-dim)] mt-0.5 line-clamp-2">
                  {p.tagline}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
