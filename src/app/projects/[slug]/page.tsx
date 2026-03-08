import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LayerBadge } from "@/components/LayerBadge";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Not Found" };
  return {
    title: project.name,
    description: project.tagline || `${project.name} — ${project.category} on Hyperliquid`,
    openGraph: {
      title: `${project.name} | PerpWiki`,
      description: project.tagline || `${project.name} — ${project.category} on Hyperliquid`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project || project.approvalStatus !== "APPROVED") {
    notFound();
  }

  const tags: string[] = (() => {
    try {
      return JSON.parse(project.tags);
    } catch {
      return [];
    }
  })();

  const links = [
    { label: "Website", url: project.website },
    { label: "Twitter", url: project.twitter },
    { label: "GitHub", url: project.github },
    { label: "Discord", url: project.discord },
    { label: "Telegram", url: project.telegram },
  ].filter((l) => l.url);

  const relatedProjects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      category: project.category,
      slug: { not: project.slug },
    },
    take: 3,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  const statusColor =
    project.status === "ACTIVE"
      ? "var(--hw-green)"
      : project.status === "BETA"
        ? "var(--hw-gold)"
        : "var(--hw-red)";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.name,
          url: project.website || undefined,
          applicationCategory: "FinanceApplication",
          description: project.tagline || project.description || undefined,
        }}
      />
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">
          Home
        </Link>
        {" / "}
        <Link href="/projects" className="hover:text-[var(--hw-text-muted)]">
          Projects
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{project.name}</span>
      </div>

      {/* Hero header */}
      <div className="border-b border-[var(--hw-border)] pb-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)]">
              {project.name}
              {project.isVerified && (
                <span className="ml-2 text-[var(--hw-green)]" title="Verified">
                  ✓
                </span>
              )}
            </h1>
            {project.tagline && (
              <p className="mt-2 text-lg text-[var(--hw-text-muted)]">{project.tagline}</p>
            )}
          </div>
          <LayerBadge layer={project.layer} />
        </div>

        {/* Quick facts strip */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex items-center gap-1.5 px-2 py-0.5 text-xs"
            style={{ borderRadius: "2px", color: statusColor }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            {project.status}
          </span>
          <span
            className="bg-[var(--hw-green-subtle)] px-2 py-0.5 text-xs text-[var(--hw-text-muted)]"
            style={{ borderRadius: "2px" }}
          >
            {project.category}
          </span>
          {project.isFeatured && (
            <span
              className="px-2 py-0.5 text-xs"
              style={{
                borderRadius: "2px",
                background: "rgba(240,180,41,0.15)",
                color: "var(--hw-gold)",
              }}
            >
              Featured
            </span>
          )}
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
            >
              {new URL(project.website).hostname} ↗
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2">
          {project.description && (
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
                Overview
              </h2>
              <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--hw-border)] px-2 py-0.5 text-xs text-[var(--hw-text-dim)]"
                    style={{ borderRadius: "2px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
                Related Projects
              </h2>
              <div className="space-y-2">
                {relatedProjects.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/projects/${rp.slug}`}
                    className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 transition-all hover:border-[var(--hw-border-bright)]"
                    style={{ borderRadius: "2px" }}
                  >
                    <div>
                      <span className="text-sm font-medium text-[var(--hw-text)]">{rp.name}</span>
                      {rp.tagline && (
                        <span className="ml-2 text-xs text-[var(--hw-text-dim)]">{rp.tagline}</span>
                      )}
                    </div>
                    <LayerBadge layer={rp.layer} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info table */}
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
            style={{ borderRadius: "4px" }}
          >
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
              Details
            </h3>
            <dl className="space-y-2 text-sm">
              <InfoRow label="Layer" value={project.layer} />
              <InfoRow label="Category" value={project.category} />
              {project.launchYear && (
                <InfoRow label="Launched" value={project.launchDate || String(project.launchYear)} />
              )}
              <InfoRow label="Status" value={project.status} />
            </dl>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                Links
              </h3>
              <div className="space-y-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
                  >
                    <span>{link.label}</span>
                    <span className="text-[var(--hw-text-dim)]">&nearr;</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Compare */}
          {relatedProjects.length > 0 && (
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                Compare
              </h3>
              <div className="space-y-2">
                {relatedProjects.map((sp) => (
                  <Link
                    key={sp.slug}
                    href={`/compare/${project.slug}-vs-${sp.slug}`}
                    className="block text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
                  >
                    vs {sp.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[var(--hw-text-dim)]">{label}</dt>
      <dd className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
        {value}
      </dd>
    </div>
  );
}
