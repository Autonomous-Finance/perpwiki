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

function DossierContent({ data }: { data: DossierData }) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      {data.keyMetrics && data.keyMetrics.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Key Metrics
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.keyMetrics.map((metric, i) => (
              <div
                key={i}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-3"
                style={{ borderRadius: "4px" }}
              >
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-green)]">
                  {metric.value}
                </div>
                <div className="text-xs text-[var(--hw-text-muted)]">{metric.label}</div>
                {metric.note && (
                  <div className="mt-1 text-xs text-[var(--hw-text-dim)]">{metric.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview */}
      {data.overview && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Overview
          </h2>
          <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] whitespace-pre-line">
            {data.overview}
          </p>
        </div>
      )}

      {/* How It Works */}
      {data.howItWorks && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            How It Works
          </h2>
          <div
            className="border-l-2 border-[var(--hw-green)] pl-4"
          >
            <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] whitespace-pre-line">
              {data.howItWorks}
            </p>
          </div>
        </div>
      )}

      {/* Tokenomics */}
      {data.tokenomics && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Tokenomics
          </h2>
          <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] whitespace-pre-line">
            {data.tokenomics}
          </p>
        </div>
      )}

      {/* Team */}
      {data.team && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Team
          </h2>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
            style={{ borderRadius: "4px" }}
          >
            {data.team.anonymous && (
              <span
                className="inline-block mb-2 px-2 py-0.5 text-xs"
                style={{
                  borderRadius: "2px",
                  background: "rgba(240,180,41,0.15)",
                  color: "var(--hw-gold)",
                }}
              >
                Anonymous
              </span>
            )}
            {data.team.description && (
              <p className="text-sm text-[var(--hw-text-muted)]">{data.team.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Funding */}
      {data.funding && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Funding
          </h2>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
            style={{ borderRadius: "4px" }}
          >
            {data.funding.raised && (
              <div className="mb-2">
                <span className="text-xs text-[var(--hw-text-dim)]">Raised</span>
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-text)]">
                  {data.funding.raised}
                </div>
              </div>
            )}
            {data.funding.investors && data.funding.investors.length > 0 && (
              <div>
                <span className="text-xs text-[var(--hw-text-dim)]">Investors</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {data.funding.investors.map((investor, i) => (
                    <span
                      key={i}
                      className="border border-[var(--hw-border)] px-2 py-0.5 text-xs text-[var(--hw-text-muted)]"
                      style={{ borderRadius: "2px" }}
                    >
                      {investor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Status */}
      {data.auditStatus && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Audit Status
          </h2>
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
            <span className="text-sm text-[var(--hw-text-muted)]">{data.auditStatus}</span>
          </div>
        </div>
      )}

      {/* Risks */}
      {data.risks && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Risks
          </h2>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
            style={{ borderRadius: "4px", borderLeftWidth: "2px", borderLeftColor: "var(--hw-red)" }}
          >
            <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] whitespace-pre-line">
              {data.risks}
            </p>
          </div>
        </div>
      )}

      {/* Verdict */}
      {data.verdict && (
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-3">
            Verdict
          </h2>
          <div
            className="border border-[var(--hw-green)] bg-[var(--hw-green-subtle)] p-4"
            style={{ borderRadius: "4px" }}
          >
            <p className="text-sm leading-relaxed text-[var(--hw-text)]">
              {data.verdict}
            </p>
          </div>
        </div>
      )}

      {/* Last Updated */}
      {data.lastUpdated && (
        <p className="text-xs text-[var(--hw-text-dim)]">
          Dossier last updated: {data.lastUpdated}
        </p>
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
