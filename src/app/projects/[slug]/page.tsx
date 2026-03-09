import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LayerBadge } from "@/components/LayerBadge";
import { JsonLd } from "@/components/JsonLd";
import { ReviewForm } from "@/components/ReviewForm";
import { getMarketTicker } from "@/lib/market-map";
import { LiveMarketCard } from "@/components/LiveMarketCard";
import Link from "next/link";
import type { Metadata } from "next";

interface DossierData {
  entityName?: string;
  oneLiner?: string;
  overview?: string;
  keyMetrics?: Array<{ label: string; value: string; note?: string }>;
  howItWorks?: string;
  tokenomics?: string;
  risks?: string;
  competitors?: string[];
  team?: { description?: string; anonymous?: boolean };
  funding?: { raised?: string; investors?: string[] };
  auditStatus?: string;
  verdict?: string;
  lastUpdated?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Not Found" };
  const seoTitle = `${project.name} — Hyperliquid Ecosystem | perp.wiki`;
  const seoDesc = `${project.name} on Hyperliquid: overview, features, layer, and ecosystem context. Independent profile on perp.wiki.`;
  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
    },
  };
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
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

  const relatedProjects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      category: project.category,
      slug: { not: project.slug },
    },
    take: 3,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  // Fetch dossier
  const dossier = await prisma.dossier.findUnique({
    where: { projectId: project.id },
  });

  let dossierData: DossierData | null = null;
  if (dossier) {
    try {
      dossierData = JSON.parse(dossier.dossierJson) as DossierData;
    } catch {
      dossierData = null;
    }
  }

  // Fetch published reviews
  const reviews = await prisma.review.findMany({
    where: { projectId: project.id, isPublished: true },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const ticker = getMarketTicker(project.slug);

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
          <div className="flex items-start gap-4">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover mt-1" />
            ) : (
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-[var(--hw-bg)]"
                style={{ background: "var(--hw-text-dim)" }}
              >
                {project.name.charAt(0)}
              </span>
            )}
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

        {/* Social icons row */}
        {(project.website || project.twitter || project.github || project.discord || project.telegram) && (
          <div className="flex items-center gap-2 mt-3">
            {project.website && (
              <a href={project.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" /></svg>
                {(() => { try { return new URL(project.website).hostname; } catch { return "Website"; } })()}
              </a>
            )}
            {project.twitter && (
              <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                GitHub
              </a>
            )}
            {project.discord && (
              <a href={project.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
                Discord
              </a>
            )}
            {project.telegram && (
              <a href={project.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram
              </a>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2">
          {dossierData ? (
            <DossierContent data={dossierData} />
          ) : (
            project.description && (
              <div className="mb-8">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
                  Overview
                </h2>
                <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )
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

          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
              Reviews
            </h2>

            {reviews.length > 0 && (
              <div className="space-y-3 mb-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
                    style={{ borderRadius: "4px" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color:
                                star <= review.rating
                                  ? "var(--hw-gold)"
                                  : "var(--hw-text-dim)",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[var(--hw-text-dim)]">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                    {review.content && (
                      <p className="text-sm text-[var(--hw-text-muted)]">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                Leave a Review
              </h3>
              <ReviewForm projectId={project.id} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {ticker && <LiveMarketCard coin={ticker} />}
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

          {/* Social Links */}
          {(project.website || project.twitter || project.github || project.discord || project.telegram) && (
            <div
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
              style={{ borderRadius: "4px" }}
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                Links & Social
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--hw-border)] px-3 py-2 text-xs text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                    style={{ borderRadius: "2px" }}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" /></svg>
                    Website
                  </a>
                )}
                {project.twitter && (
                  <a
                    href={project.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--hw-border)] px-3 py-2 text-xs text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                    style={{ borderRadius: "2px" }}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X / Twitter
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--hw-border)] px-3 py-2 text-xs text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                    style={{ borderRadius: "2px" }}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    GitHub
                  </a>
                )}
                {project.discord && (
                  <a
                    href={project.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--hw-border)] px-3 py-2 text-xs text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                    style={{ borderRadius: "2px" }}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
                    Discord
                  </a>
                )}
                {project.telegram && (
                  <a
                    href={project.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--hw-border)] px-3 py-2 text-xs text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                    style={{ borderRadius: "2px" }}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Telegram
                  </a>
                )}
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

function DossierContent({ data }: { data: DossierData }) {
  const renderParagraphs = (text: string) =>
    text.split(/\n\n+/).map((para, i) => (
      <p key={i} className="text-sm leading-relaxed text-[var(--hw-text-muted)] mb-3 last:mb-0">
        {para}
      </p>
    ));

  return (
    <div className="space-y-6">
      {/* Key Metrics — horizontal scrollable strip */}
      {data.keyMetrics && data.keyMetrics.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {data.keyMetrics.map((metric, i) => (
            <div
              key={i}
              className="shrink-0 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 min-w-[120px]"
              style={{ borderRadius: "4px" }}
            >
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-green)]">
                {metric.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mt-0.5">{metric.label}</div>
              {metric.note && (
                <div className="mt-1 text-[10px] text-[var(--hw-text-dim)] opacity-70">{metric.note}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Overview — clean prose */}
      {data.overview && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-4 bg-[var(--hw-green)]" style={{ borderRadius: "1px" }} />
            Overview
          </h2>
          <div>{renderParagraphs(data.overview)}</div>
        </div>
      )}

      {/* How It Works — numbered steps feel if multiple paragraphs */}
      {data.howItWorks && (
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: "4px" }}>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-4 bg-[var(--hw-cyan)]" style={{ borderRadius: "1px" }} />
            How It Works
          </h2>
          <div className="border-l-2 border-[var(--hw-cyan)] pl-4">
            {renderParagraphs(data.howItWorks)}
          </div>
        </div>
      )}

      {/* Two-column grid: Tokenomics + Team */}
      {(data.tokenomics || data.team) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.tokenomics && (
            <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2 flex items-center gap-2">
                <span className="inline-block h-1 w-3 bg-[var(--hw-gold)]" style={{ borderRadius: "1px" }} />
                Tokenomics
              </h3>
              {renderParagraphs(data.tokenomics)}
            </div>
          )}
          {data.team && (
            <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2 flex items-center gap-2">
                <span className="inline-block h-1 w-3" style={{ background: "var(--hw-tier-hip3)", borderRadius: "1px" }} />
                Team
                {data.team.anonymous && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px]" style={{ borderRadius: "2px", background: "rgba(240,180,41,0.15)", color: "var(--hw-gold)" }}>
                    Anon
                  </span>
                )}
              </h3>
              {data.team.description && (
                <p className="text-sm text-[var(--hw-text-muted)]">{data.team.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Funding — prominent card */}
      {data.funding && (data.funding.raised || (data.funding.investors && data.funding.investors.length > 0)) && (
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-3 bg-[var(--hw-green)]" style={{ borderRadius: "1px" }} />
            Funding
          </h3>
          <div className="flex flex-wrap items-baseline gap-4">
            {data.funding.raised && (
              <div>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xl font-bold text-[var(--hw-text)]">
                  {data.funding.raised}
                </span>
                <span className="ml-1.5 text-xs text-[var(--hw-text-dim)]">raised</span>
              </div>
            )}
            {data.funding.investors && data.funding.investors.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {data.funding.investors.map((inv, i) => (
                  <span
                    key={i}
                    className="border border-[var(--hw-border)] bg-[var(--hw-bg)] px-2 py-0.5 text-[10px] text-[var(--hw-text-muted)]"
                    style={{ borderRadius: "2px" }}
                  >
                    {inv}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit + Competitors row */}
      <div className="flex flex-wrap gap-3">
        {data.auditStatus && (
          <div
            className="inline-flex items-center gap-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2"
            style={{ borderRadius: "4px" }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: data.auditStatus.toLowerCase().includes("audit")
                  ? "var(--hw-green)"
                  : "var(--hw-gold)",
              }}
            />
            <span className="text-xs text-[var(--hw-text-muted)]">{data.auditStatus}</span>
          </div>
        )}
        {data.competitors && data.competitors.length > 0 && (
          <div className="inline-flex items-center gap-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2" style={{ borderRadius: "4px" }}>
            <span className="text-xs text-[var(--hw-text-dim)]">Competitors:</span>
            {data.competitors.map((c, i) => (
              <span key={i} className="text-xs text-[var(--hw-text-muted)]">{c}{i < data.competitors!.length - 1 ? "," : ""}</span>
            ))}
          </div>
        )}
      </div>

      {/* Risks — warning-style card */}
      {data.risks && (
        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
          style={{ borderRadius: "4px", borderLeftWidth: "3px", borderLeftColor: "var(--hw-red)" }}
        >
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-2">
            Risk Factors
          </h3>
          {renderParagraphs(data.risks)}
        </div>
      )}

      {/* Verdict — highlighted conclusion */}
      {data.verdict && (
        <div
          className="border border-[var(--hw-green)] p-4 relative overflow-hidden"
          style={{ borderRadius: "4px", background: "linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(0,229,160,0.02) 100%)" }}
        >
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-green)] mb-2">
            Verdict
          </h3>
          {renderParagraphs(data.verdict)}
        </div>
      )}

      {data.lastUpdated && (
        <p className="text-[10px] text-[var(--hw-text-dim)]">Last updated: {data.lastUpdated}</p>
      )}
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
